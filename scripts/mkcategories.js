const fs = require("fs");
const path = require("path");
const util = require("util");

const asyncGenerateHtmlContent = require("./mkhtml");
const asyncGeneratePDF = require("./mkpdf");

const parse = require("csv-parse");

const asyncReadFile = util.promisify(fs.readFile);

const CSV_PATH = path.resolve(__dirname, "..", "symbol-info.csv");
const DIRECTORY_NAME = "categories";

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
 * IIFE to allow async/await syntax
 */
(async () => {
  try {
    if (!fs.existsSync(DIRECTORY_NAME)) {
      fs.mkdirSync(DIRECTORY_NAME);
    }
    console.log("Creating Categories HTML (this may take a few moments)...");
    const csvData = await asyncParseCSV();
    const htmlContent = await asyncGenerateHtmlContent(csvData);

    console.log("Creating Categories PDF (this may take a few moments)...");
    await asyncGeneratePDF(htmlContent);
  } catch (err) {
    console.log("Unable to create Categories PDF or HTMl");
    console.log(err);
  }
})();
