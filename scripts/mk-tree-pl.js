// Builds a folder tree with a Polish thematic grouping of the symbols.
//
// It never changes the EN/ directory or any file name. It creates copies (or
// symbolic links) in the structure  <domain>/<subcategory>/<symbol>.svg
// based on the `categories` sheet of scripts/data/mulberry-pl.ods.
//
// Usage:
//   node scripts/mk-tree-pl.js                  # copies into ./tree-pl
//   node scripts/mk-tree-pl.js --out other/dir
//   node scripts/mk-tree-pl.js --link           # symlinks instead of copies
//   node scripts/mk-tree-pl.js --dry-run        # validation only
//   node scripts/mk-tree-pl.js --verbs          # verbs grouped by meaning (sheet `verbs`), default ./verbs-tree-pl

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { readOds } = require('./read-ods');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const OUT = path.resolve(ROOT, option('--out', 'tree-pl'));
const LINK = flag('--link');
const DRY = flag('--dry-run');

const readCsv = (file) =>
  parse(fs.readFileSync(path.join(__dirname, 'data', file), 'utf8'), {
    columns: true,
    skip_empty_lines: true,
    bom: true,
  });

// Polish data: one workbook with the sheets `symbols`, `verbs` and `categories`.
const WORKBOOK = path.join(__dirname, 'data', 'mulberry-pl.ods');
const workbook = readOds(WORKBOOK);
const sheet = (name) => {
  if (!workbook[name]) {
    console.error(`sheet "${name}" not found in ${path.relative(ROOT, WORKBOOK)}`);
    process.exit(1);
  }
  return workbook[name];
};

const symbols = readCsv('symbol-info.csv');

// The sheet `symbols` must list exactly the symbols of symbol-info.csv, in the same order.
{
  const rows = sheet('symbols');
  const problems = [];
  if (rows.length !== symbols.length) problems.push(`sheet symbols has ${rows.length} rows, symbol-info.csv has ${symbols.length}`);
  symbols.forEach((s, i) => {
    const r = rows[i];
    if (!r || r['symbol-id'] !== s['symbol-id'] || r['symbol-en'] !== s['symbol-en']) {
      problems.push(`sheet symbols, row ${i + 2}: expected ${s['symbol-id']} ${s['symbol-en']}, found ${r ? `${r['symbol-id']} ${r['symbol-en']}` : 'nothing'}`);
    }
  });
  if (problems.length) {
    console.error(`ERRORS (${problems.length}):`);
    problems.slice(0, 50).forEach((e) => console.error('  - ' + e));
    process.exit(1);
  }
}
// --verbs mode: verbs arranged by semantic class (sheet `verbs`).
if (flag('--verbs')) {
  const verbOut = path.resolve(ROOT, option('--out', 'verbs-tree-pl'));
  const verbs = sheet('verbs');
  const verbErrors = [];
  const bySymbol = new Map(symbols.map((s) => [s['symbol-en'], s]));
  const verbSeen = new Set();
  const verbPlan = [];
  for (const v of verbs) {
    const name = v['symbol-en'];
    if (!bySymbol.has(name)) verbErrors.push(`symbol not in symbol-info.csv: ${name}`);
    if (verbSeen.has(name)) verbErrors.push(`duplicate in sheet verbs: ${name}`);
    verbSeen.add(name);
    const src = path.join(ROOT, 'EN', `${name}.svg`);
    if (!fs.existsSync(src)) verbErrors.push(`missing file: EN/${name}.svg`);
    if (!v['class-path']) verbErrors.push(`missing class-path: ${name}`);
    if (v['semantic-subclass'] && !v['subclass-path']) verbErrors.push(`subclass without a path: ${name}`);
    verbPlan.push({ src, dest: path.join(verbOut, v['class-path'], v['subclass-path'] || '', `${name}.svg`) });
  }
  // Every verb according to the source (grammar or the _,_to suffix) must have a row.
  for (const s of symbols) {
    const verbLike = ['Verb', 'VerbComplex'].includes(s.grammar) || /_,_to(_\d+)?$/.test(s['symbol-en']);
    if (verbLike && !verbSeen.has(s['symbol-en'])) verbErrors.push(`verb without a row: ${s['symbol-en']}`);
  }
  if (verbErrors.length) {
    console.error(`ERRORS (${verbErrors.length}):`);
    verbErrors.slice(0, 50).forEach((e) => console.error('  - ' + e));
    process.exit(1);
  }
  const perClass = new Map();
  const perSub = new Map();
  for (const v of verbs) {
    perClass.set(v['semantic-class'], (perClass.get(v['semantic-class']) || 0) + 1);
    if (v['semantic-subclass']) {
      const k = `${v['semantic-class']} / ${v['semantic-subclass']}`;
      perSub.set(k, (perSub.get(k) || 0) + 1);
    }
  }
  console.log(`Verbs: ${verbPlan.length} | semantic classes: ${perClass.size} | subclasses: ${perSub.size}`);
  [...perClass.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, n]) => console.log(`  ${String(n).padStart(4)}  ${k}`));
  [...perSub.entries()].sort().forEach(([k, n]) => console.log(`        ${String(n).padStart(4)}  ${k}`));
  if (DRY) {
    console.log('--dry-run mode: validation passed, nothing written.');
    process.exit(0);
  }
  for (const { src, dest } of verbPlan) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (fs.existsSync(dest)) fs.rmSync(dest);
    if (LINK) fs.symlinkSync(path.relative(path.dirname(dest), src), dest);
    else fs.copyFileSync(src, dest);
  }
  console.log(`Wrote ${verbPlan.length} files to ${path.relative(process.cwd(), verbOut) || '.'} (${LINK ? 'symlinks' : 'copies'}).`);
  process.exit(0);
}

const categories = sheet('categories');

const byId = new Map(categories.map((c) => [c['category-id'], c]));
const errors = [];

// 1. Every source category has a Polish counterpart and a matching EN name.
const usedIds = new Set();
for (const s of symbols) {
  const c = byId.get(s['category-id']);
  if (!c) {
    errors.push(`no mapping for category-id=${s['category-id']} (${s['symbol-en']})`);
    continue;
  }
  if (c['category-en'] !== s['category-en']) {
    errors.push(`EN name mismatch for id=${c['category-id']}: "${c['category-en']}" vs "${s['category-en']}"`);
  }
  usedIds.add(s['category-id']);
}
// 2. No mapped category is orphaned.
for (const c of categories) {
  if (!usedIds.has(c['category-id'])) errors.push(`orphaned category in sheet categories: id=${c['category-id']}`);
}

// 3. Files exist and there are no name collisions in the target tree.
const seen = new Map();
const plan = [];
for (const s of symbols) {
  const c = byId.get(s['category-id']);
  if (!c) continue;
  const src = path.join(ROOT, 'EN', `${s['symbol-en']}.svg`);
  const dest = path.join(OUT, ...c['path'].split('/'), `${s['symbol-en']}.svg`);
  if (!fs.existsSync(src)) errors.push(`missing file: EN/${s['symbol-en']}.svg`);
  if (seen.has(dest)) errors.push(`collision: ${s['symbol-en']} (${seen.get(dest)} and ${s['category-id']})`);
  seen.set(dest, s['category-id']);
  plan.push({ src, dest });
}

if (errors.length) {
  console.error(`ERRORS (${errors.length}):`);
  errors.slice(0, 50).forEach((e) => console.error('  - ' + e));
  process.exit(1);
}

// 4. Summary: number of symbols in each domain.
const perDomain = new Map();
for (const s of symbols) {
  const d = byId.get(s['category-id'])['domain-pl'];
  perDomain.set(d, (perDomain.get(d) || 0) + 1);
}
console.log(`Symbols: ${plan.length} | source categories: ${usedIds.size} | domains: ${perDomain.size}`);
[...perDomain.entries()]
  .sort((a, b) => b[1] - a[1])
  .forEach(([d, n]) => console.log(`  ${String(n).padStart(4)}  ${d}`));

if (DRY) {
  console.log('--dry-run mode: validation passed, nothing written.');
  process.exit(0);
}

for (const { src, dest } of plan) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest)) fs.rmSync(dest);
  if (LINK) fs.symlinkSync(path.relative(path.dirname(dest), src), dest);
  else fs.copyFileSync(src, dest);
}
console.log(`Wrote ${plan.length} files to ${path.relative(process.cwd(), OUT) || '.'} (${LINK ? 'symlinks' : 'copies'}).`);
