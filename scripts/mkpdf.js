(async function() {
  const puppeteer = require('puppeteer');
  const path = require('path');
  const getContent = require('./mk');

  const CATEGORIES_PDF_FILE_NAME = 'categories/categories.pdf';
  const TEMPLATE_PATH = path.resolve(__dirname, 'templates/pdf-template.html');

  const htmlContent = await getContent(TEMPLATE_PATH);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent);
  await page.pdf({
    path: CATEGORIES_PDF_FILE_NAME,
    margin: { top: 24, right: 24, bottom: 24, left: 24 },
  });
  await browser.close();
})();
