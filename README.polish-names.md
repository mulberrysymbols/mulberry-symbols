# Mulberry Symbols: Polish taxonomy and names (work in progress)

This branch adds a **Polish thematic grouping and Polish names** for the Mulberry Symbols set.
It does not change any symbol or file name: the `EN/` directory is identical to upstream.
All data is **working material for review**, not a final decision about what goes into any database.
A Polish version of this document is in [`README.pl.md`](README.pl.md).

Column names, code comments and commit messages are in English. The *values* that make up the Polish
dictionary (names, domains, subcategories, verb classes, most notes) are in Polish.

## What was added

| File | Contents |
|---|---|
| `scripts/data/mulberry-pl.ods` | one workbook with three sheets, described below |
| ↳ sheet `symbols` | all 3436 symbols with a Polish name, category, part of speech (English and Polish), flags, and an intentionally empty `database-decision` column |
| ↳ sheet `verbs` | 468 verbs: Polish infinitive, aspect, semantic class and subclass, approximate WordNet domain, notes |
| ↳ sheet `categories` | maps the 117 source categories to a Polish domain and subcategory, an ASCII folder path and notes |
| `scripts/read-ods.js` | small dependency-free reader for the workbook (used by `mk-tree-pl.js`) |
| `scripts/mk-tree-pl.js` | builds `tree-pl/<domain>/<subcategory>/<symbol>.svg` (or with `--verbs`: `verbs-tree-pl/<class>/<subclass>/`) and validates the workbook against `symbol-info.csv` (same symbols, same order, valid categories, a row for every verb) |
| `.gitignore` | the generator's output folders |

Every sheet has a header row in the first line; `symbol-id` and `symbol-en` match `symbol-info.csv`.

## Usage

```
PUPPETEER_SKIP_DOWNLOAD=1 npm install   # csv-parse is already in devDependencies; skip the Chromium download
node scripts/mk-tree-pl.js --dry-run    # validation only
node scripts/mk-tree-pl.js              # copies into ./tree-pl
node scripts/mk-tree-pl.js --link       # symlinks instead of copies
node scripts/mk-tree-pl.js --verbs      # verbs grouped by semantic class and subclass
```

The script exits with an error if a category has no mapping, an SVG is missing, or two symbols
would end up at the same path under the same name.

## Decisions and known limitations

- **Two source categories are merged in the tree:** `Food Vegetables and salad` (3 symbols) and
  `Food Vegetables and salads` (55) are the same category with a typo in the source. They stay
  separate in `symbol-info.csv`.
- **The domain comes from the first word(s) of the category name** (`Food Fruit` becomes Food / Fruit).
  The source has no "domain" field; this is a convention reconstructed from the names.
- **The source category `Verb` is built by part of speech, not by topic**, so in the tree the verbs are
  split: some in the verb folders, some in thematic subcategories. This follows the source data.
- **Computers in one domain.** Source categories 36 (`Computer Icon`) and 49 (`Electrical Computer`)
  are one conceptual area cut in two; the boundary is blurry. In the tree both sit under one folder;
  in the source data they stay separate.
- **Culture-specific content** (British holidays and stations, English football clubs, dishes) carries
  flag `K` and needs a decision when adapting to a Polish context.
- **Religion.** All symbols in the `Religion *` categories carry the tag `Christian`; a search of
  names and tags found no symbol of another religion. There are biblical figures and events
  (`Jesus`, `Mary`, `Joseph`, `Judas`, `Last_Supper`, `Crucifixion`, `Nativity`) and liturgical calendar
  items (`Advent`, `Ash_Wednesday`, `Lent`, `Palm_Sunday`, `Shrove_Tuesday_1`). There is no clergy or
  sacraments, and the only explicitly denominational term is `Puritans`. The content reflects the
  British calendar and school culture rather than a single denomination. This note rests on names and
  tags, not on an analysis of the images' symbolism.

## Polish names for all symbols (sheet `symbols`)

One row per file in `EN/`; key: `symbol-en` (file name without `.svg`). The `database-decision`
column is intentionally empty.

Columns: `symbol-id`, `symbol-en`, `symbol-pl`, `domain-pl`, `subcategory-pl`,
`pos-source` (the original `grammar` from `symbol-info.csv`), `pos-en`, `pos-pl`,
`number-pl`, `form-gender-pl`, `variant`, `semantic-class`, `semantic-subclass`,
`wordnet-domain`, `aspect` (the last four apply to verbs only), `notes`, `flags`, `database-decision`.

Translation rules:
- Verbs: the infinitive (dictionary form) from the sheet `verbs`; all other names in the nominative singular.
  Interface commands (`copy`, `paste`, `print`, `save`) are imperatives marked "(polecenie)" ("command"),
  while the maths operations (`add`, `subtract`, `multiply`, `divide`) are verbal nouns; this distinction
  is deliberate but open to decision.
- Citation form (the form a user searches for): `symbol-pl` always holds one lemma. Nouns are in the nominative
  singular (nominative plural for pluralia tantum, see `number-pl`), verbs in the infinitive, adjectives in the
  nominative singular masculine. Inflected forms ("psa", "pieska") and synonyms are not stored; an application
  that searches these names needs lemmatisation or its own alias list.
- Adjectives are stored in the base form (nominative singular masculine); `form-gender-pl` says which
  form was stored. Where possible a gender-neutral form was chosen (e.g. "w związku małżeńskim", "na
  emeryturze"). Gender pairs ("-y/-a") or separate symbols are an open decision.
- Professions (`People Profession`): usually `_1x` = male figure, `_2x` = female figure; letters `a`-`d`
  = skin tones (for taxi drivers `a`/`b` and `c`/`d` are two pairs of figures). Exception:
  `care_assistant_*`, where `a` = male figure, `b` = female figure, and the number 1-6 encodes the skin
  tones of the carer and the person supported (2 and 4 show a wheelchair icon). Polish names follow the
  gender of the figure.
- Alphabet: Latin letters without Polish diacritics (`ą ć ę ł ń ó ś ź ż` do not occur in the source).
- Method: the translations started from the English names; the image of every one of the 3436 symbols
  was then checked against the Polish name, and the result was reviewed manually by the author, a Polish
  speech-language pathologist and AAC specialist. Where the image decided the meaning (the English name
  is ambiguous or misleading), `notes` has an entry starting with "obraz:" ("image:"). Open linguistic
  questions that are policy decisions rather than errors (verb aspect, adjective gender) are listed under
  "Decisions and known limitations".

Flags in the `flags` column (they can be combined): `K` culture-specific (UK) content or idiom (112);
`B` brand name (21); `E` typo or error in the source (15); `N` not a state: territory, region,
organisation (90); `P` disputed or not universally recognised status (14); `M` motion verb (7);
`G` source grammar inconsistent with the name (7); `R` marked `rated=1` in the source (6).

### Parts of speech

The source column `grammar` marks 2973 of 3436 symbols as `Noun`, including adjectives (`absent`, `hot`,
`red`), prepositions (`under_1`), adverbs and pronouns. The columns `pos-en` and `pos-pl` are the author's own
working classification (rules plus manual lists; about 825 symbols have a part of speech other than noun
or letter), open to review. The two may differ between languages (e.g. `add`: verb in English, verbal
noun in Polish).

Rule for phrases: descriptive combinations (e.g. `clean_room`, `hat_too_big`) are marked "noun phrase",
while established compound names ("woda po goleniu" = aftershave, "sok jabłkowy" = apple juice) count as
nouns. The column `number-pl` marks only nouns that exist in Polish solely in the plural (pluralia
tantum); the list is partial.

Eight symbols with a verbal English name sit outside the "Verb" category and have no row in
the sheet `verbs`: `add`, `subtract`, `multiply`, `divide`, `copy`, `paste`, `print`, `save`.
For `copy` there is also a separate verb symbol `copy_,_to`.

## Verbs (sheet `verbs`)

468 verb entries (grammar `Verb` or `VerbComplex`, or the `_,_to` suffix; seven of them, `gravy_pour`,
`mash_potato`, `pour_cake_mixture`, `break_2`, `float`, `mend` and `toilet_,_go_to_the`, have grammar `Noun` in the source and flag `G`).

- Source names are in dictionary form ("X, to"), not inflected. Hits ending in `-ing` and `-ed` are
  lexemes (`sing`, `bring`, `swing`) or idioms (`get_dressed`).
- **The classification is the author's own working construct, not a research result or a mapping of an existing
  resource.** 17 semantic classes (column `semantic-class`) and 33 subclasses within eight of them
  (motion; handling objects; cooking and food preparation; social relations and care; hygiene and dressing;
  games, sport and leisure; change of state; housework and gardening), where a class was too varied.
  One class per symbol, by meaning rather than by the topic of the source category. The largest class is
  handling objects (52), split into six subclasses.
- `wordnet-domain` is an approximate manual assignment to one of the 15 lexicographer files for verbs in
  Princeton WordNet (14 of them are used in the data): `body`, `change`, `cognition`, `communication`,
  `competition`, `consumption`, `contact`, `creation`, `emotion`, `motion`, `perception`, `possession`,
  `social`, `stative`, `weather`. plWordNet has an analogous set. This is not a dictionary lookup but my
  assignment from the meaning and the Polish infinitive; it is meant for comparison with other resources,
  not for decisions. The `weather` domain is not used.
- Aspect (`impf` = imperfective, `pf` = perfective): 465 `impf`, 3 `pf` (`znaleźć`,
  `spóźnić się na autobus`, `oparzyć się`). The citation rule and aspect pairs are left to decision.
- Motion verbs have determinate/indeterminate pairs (iść/chodzić, biec/biegać, jechać/jeździć); they are
  marked in `notes`.
- The images of all verbs were viewed. English names are sometimes ambiguous or misleading, so the image
  changed the meaning in, among others: `hang` (to hang from a bar, not to hang an object), `shake`
  (to tremble), `stamp` (to stamp one's feet), `slide` (to slip, not a playground slide), `dive` and
  `dive_2` (a dive into water, not scuba diving), `bend` (to bend over), `stretch` (to stretch an
  object), `cheat` (to copy in a test), `decorate` (image: painting a wall; the translation keeps
  "dekorować"), `sign` (to use hand signs), `talk_3` and `talk_4` (to talk with someone), `order_2`
  (to give an order). For `sign` the interpretation should be confirmed by someone who knows
  Makaton or Polish Sign Language, because the image shows no pen or paper.
- Five verbs in the source category `People Actions` are spread over the semantic classes (motion, rest,
  work).

## Source issues noticed

While checking the images, a few source errors were noticed that are **not** changed here:
`flag_Canary_Islands` shows the flag of the Balearic Islands; `sour_cream.svg` has a broken `viewBox` and
renders as a tiny icon; a few file names have typos (`breafkfast_*`, `hankerchief`, `Antartica`,
`brussel_sprouts`); and `cheese_burger` has grammar `Interjection`. They could be reported as separate
issues.

## Licence and attribution

Original set: *Mulberry Symbols*, (c) 2018-2026 Steve Lee,
licence [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
(see `LICENSE.txt`). Source: <https://github.com/mulberrysymbols/mulberry-symbols>.

Changes from the original: added `scripts/data/mulberry-pl.ods`, the scripts `mk-tree-pl.js` and
`read-ods.js`, this file, `README.pl.md` and entries in `.gitignore`. The derived material is shared
under the same licence (CC BY-SA 4.0). The CC licence does not cover trademarks; we do not suggest
endorsement by the author of the original.

Prepared by Elżbieta Dawidek (speech-language pathologist, AAC specialist) with AI assistance (Claude);
reviewed manually by the author.
