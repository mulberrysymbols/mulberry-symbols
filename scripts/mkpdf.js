const fs = require("fs");
const path = require("path");
const util = require("util");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const parse = require("csv-parse");

const asyncReadFile = util.promisify(fs.readFile);
const SVG_BASE_PATH = path.resolve(__dirname, "..", "EN");
const PDF_TEMPLATE_PATH = path.resolve(__dirname, "pdf-template.html");
const CSV_PATH = path.resolve(__dirname, "..", "symbol-info.csv");
const NAME_INDEX = 1;
const CATEGORY_INDEX = 3;
const CATEGORIES_PDF_FILE_NAME = "categories.pdf";

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
      "utf8"
    );

    const categoryTemplate = {
      name: convertToDisplayString(name),
      content: iconContent
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

  return template({
    categories: sortedCategories
  });
}

/**
 * Parse content of CSV file
 */
async function asyncParseCSV() {
  const csvContents = await asyncReadFile(CSV_PATH, "utf8");

  return new Promise((resolve, reject) => {
    parse(csvContents, { from: 2, cast: true }, (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
}

/**
 * Generate PDF
 */
async function asyncGeneratePDF() {
  const csvData = await asyncParseCSV();
  const html = await asyncGenerateHtmlContent(csvData);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);
  await page.pdf({
    path: CATEGORIES_PDF_FILE_NAME,
    margin: { top: 24, right: 24, bottom: 24, left: 24 }
  });
  await browser.close();
}

/**
 * IIFE to allow async/await syntax
 */
(async () => {
  try {
    console.log("Creating Categories PDF (this may take a few moments)...");
    await asyncGeneratePDF();
    console.log(`PDF created: "${CATEGORIES_PDF_FILE_NAME}"`);
  } catch (err) {
    console.log("Unable to create Categories PDF");
    console.log(err);
  }
})();
