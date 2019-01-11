const path = require("path");
const handlebars = require("handlebars");
const util = require("util");
const fs = require("fs");

const NAME_INDEX = 1;
const CATEGORY_INDEX = 3;
const SVG_BASE_PATH = path.resolve(__dirname, "..", "EN");
const PDF_TEMPLATE_PATH = path.resolve(__dirname, "pdf-template.html");
const asyncReadFile = util.promisify(fs.readFile);
const asyncWriteFile = util.promisify(fs.writeFile);
const asyncMkDir = util.promisify(fs.mkdir);
const CATEGORIES_HTML_FILE_NAME = "categories/categories.html";

/**
 * Convert an icon name to a human-readable string
 *
 * @param {string} originalString
 */
function convertToDisplayString(originalString) {
  return originalString.replace(/_/g, " ");
}

/**
 * Generate HTML content of the PDF report
 *
 * @param {*} data
 */
async function asyncGenerateHtmlContent(data) {
  const categories = {};

  for (const row of data) {
    let category = row[CATEGORY_INDEX];

    if (category === "") {
      category = "Uncatagorized";
    }

    const name = row[NAME_INDEX];
    const iconContent = await asyncReadFile(
      path.resolve(SVG_BASE_PATH, `${name}.svg`),
      "utf8",
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
    sortedCategories[category] = categories[category];
  }

  const content = await asyncReadFile(PDF_TEMPLATE_PATH, "utf8");
  const template = handlebars.compile(content);

  const htmlContent = template({
    categories: sortedCategories,
  });

  await asyncWriteFile(CATEGORIES_HTML_FILE_NAME, htmlContent);

  return htmlContent;
}

module.exports = asyncGenerateHtmlContent;
