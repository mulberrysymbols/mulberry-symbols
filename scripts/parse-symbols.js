const fs = require('fs');
const path = require('path');
const util = require('util');
const {parse} = require('csv-parse');
const asyncReadFile = util.promisify(fs.readFile);


const SVG_BASE_PATH = path.resolve(__dirname, '..', 'EN');

const slugify = (unslugged) => unslugged.toLowerCase().replace(/\s/g, '-');
const convertToDisplayString = (original) => original.replace(/_/g, ' ');

async function asyncParseCSV(pathToCSV) {
  const CSV_PATH = pathToCSV;
  const csvContents = await asyncReadFile(CSV_PATH, 'utf8');

  return new Promise((resolve, reject) => {
    parse(csvContents, { from: 2, cast: true }, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

module.exports = async function(lang) {
  const NAME_INDEX = (lang) => ({'en':5, 'fr':7})[lang];
  const CATEGORY_INDEX = (lang) => NAME_INDEX(lang) + 1;
  const categories = {};

  const csv = path.resolve(__dirname, `./data/symbol-info.csv`)
  const data = await asyncParseCSV(csv);
  for (const row of data) {
    const filename = row[NAME_INDEX('en')];
    const iconContent = await asyncReadFile(
      path.resolve(SVG_BASE_PATH, `${filename}.svg`),
      'utf8',
    );

    const name = row[NAME_INDEX(lang)];
    const categoryTemplate = {
      name: convertToDisplayString(name),
      content: encodeURIComponent(iconContent),
    };

    const category = row[CATEGORY_INDEX(lang)];
    if (categories[category] === undefined) { // TODO should be an error now
      categories[category] = [categoryTemplate];
    } else {
      categories[category].push(categoryTemplate);
    }
  }

  const sortedCategories = {};

  for (const category of Object.keys(categories).sort()) {
    sortedCategories[category] = {
      symbols: categories[category],
      anchor: slugify(category),
    };
  }

  return sortedCategories;
};
