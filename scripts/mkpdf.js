const puppeteer = require("puppeteer");

const CATEGORIES_PDF_FILE_NAME = "categories/categories.pdf";

/**
 * Generate PDF
 */
async function asyncGeneratePDF(html) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);
  await page.pdf({
    path: CATEGORIES_PDF_FILE_NAME,
    margin: { top: 24, right: 24, bottom: 24, left: 24 },
  });
  await browser.close();
}

module.exports = asyncGeneratePDF;
