// Minimal reader for .ods workbooks, without dependencies.
//
// readOds(file) returns { <sheet name>: [ { <column header>: <text>, ... }, ... ] }:
// the first row of every sheet holds the headers, empty rows are skipped and every
// value is returned as the text shown in the cell. It reads the standard ODF
// structure (a zip archive with content.xml); formulas, styles and charts are ignored.

const fs = require('fs');
const zlib = require('zlib');

function readZipEntry(buf, wanted) {
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  if (eocd < 0) throw new Error('not a zip archive');
  const count = buf.readUInt16LE(eocd + 10);
  let off = buf.readUInt32LE(eocd + 16);
  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(off) !== 0x02014b50) throw new Error('corrupt zip directory');
    const method = buf.readUInt16LE(off + 10);
    const size = buf.readUInt32LE(off + 20);
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const commentLen = buf.readUInt16LE(off + 32);
    const local = buf.readUInt32LE(off + 42);
    const name = buf.toString('utf8', off + 46, off + 46 + nameLen);
    if (name === wanted) {
      const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
      const data = buf.subarray(start, start + size);
      if (method === 0) return data;
      if (method === 8) return zlib.inflateRawSync(data);
      throw new Error(`unsupported zip compression method ${method}`);
    }
    off += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error(`${wanted} not found in archive`);
}

const decode = (s) =>
  s.replace(/&(#x[0-9a-fA-F]+|#\d+|amp|lt|gt|quot|apos);/g, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[e];
  });

const attr = (s, name) => {
  const m = new RegExp(`${name}="([^"]*)"`).exec(s);
  return m ? decode(m[1]) : undefined;
};

function readOds(file) {
  const xml = readZipEntry(fs.readFileSync(file), 'content.xml').toString('utf8');
  const sheets = {};
  let rows = null;
  let row = null;
  let rowRepeat = 1;
  let cell = null;
  let cellRepeat = 1;
  let paragraphs = 0;
  let inParagraph = false;
  const token = /<(\/?)([A-Za-z][\w:.-]*)([^>]*?)(\/?)>|([^<]+)/g;
  let name = null;
  for (let m; (m = token.exec(xml)); ) {
    const [, closing, tag, attrs, selfClosing, text] = m;
    if (text !== undefined) {
      if (inParagraph && cell !== null) cell += decode(text);
      continue;
    }
    if (!closing) {
      if (tag === 'table:table') {
        name = attr(attrs, 'table:name');
        rows = [];
        sheets[name] = rows;
      } else if (tag === 'table:table-row' && rows) {
        row = [];
        rowRepeat = Number(attr(attrs, 'table:number-rows-repeated') || 1);
        if (selfClosing) {
          rows.push(...Array(Math.min(rowRepeat, 1)).fill([]));
          row = null;
        }
      } else if ((tag === 'table:table-cell' || tag === 'table:covered-table-cell') && row) {
        cellRepeat = Number(attr(attrs, 'table:number-columns-repeated') || 1);
        if (selfClosing) {
          row.push(...Array(cellRepeat).fill(''));
        } else {
          cell = '';
          paragraphs = 0;
        }
      } else if (tag === 'text:p' && cell !== null) {
        if (paragraphs++) cell += '\n';
        inParagraph = !selfClosing;
      } else if (tag === 'text:s' && inParagraph) {
        cell += ' '.repeat(Number(attr(attrs, 'text:c') || 1));
      } else if (tag === 'text:tab' && inParagraph) {
        cell += '\t';
      } else if (tag === 'text:line-break' && inParagraph) {
        cell += '\n';
      }
    } else if (tag === 'text:p') {
      inParagraph = false;
    } else if ((tag === 'table:table-cell' || tag === 'table:covered-table-cell') && cell !== null) {
      row.push(...Array(cellRepeat).fill(cell));
      cell = null;
    } else if (tag === 'table:table-row' && row) {
      while (row.length && row[row.length - 1] === '') row.pop();
      if (row.length) for (let i = 0; i < rowRepeat; i++) rows.push(row);
      else rows.push([]);
      row = null;
    }
  }
  const result = {};
  for (const [sheet, all] of Object.entries(sheets)) {
    const data = all.filter((r) => r.length);
    const headers = data.shift() || [];
    result[sheet] = data.map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] === undefined ? '' : r[i]])));
  }
  return result;
}

module.exports = { readOds };
