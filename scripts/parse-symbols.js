const fs = require('fs');
const path = require('path');
const util = require('util');
const parse = require('csv-parse');
const asyncReadFile = util.promisify(fs.readFile);

const NAME_INDEX = 1;
const CATEGORY_INDEX = 3;
const SVG_BASE_PATH = path.resolve(__dirname, '..', 'EN');

const slugify = (unslugged) => unslugged.toLowerCase().replace(/\s/g, '-');
const convertToDisplayString = (original) => original.replace(/_/g, ' ');

async function asyncParseCSV(pathToCSV) {
  const CSV_PATH = pathToCSV || path.resolve(__dirname, '../symbol-info.csv');
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

module.exports = async function() {
  const categories = {};
  const data = await asyncParseCSV();

  for (const row of data) {
    let category = row[CATEGORY_INDEX];

    if (category === '') {
      category = 'Uncatagorized';
    }

    const name = row[NAME_INDEX];
    const iconContent = await asyncReadFile(
      path.resolve(SVG_BASE_PATH, `${name}.svg`),
      'utf8',
    );

    const categoryTemplate = {
      name: convertToDisplayString(name),
      content: encodeURIComponent(iconContent),
    };

    if (categories[category] === undefined) {
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
