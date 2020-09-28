(async function () {
  const puppeteer = require('puppeteer');
  const fs = require('fs');
  const path = require('path');
  const getContent = require('./mk-template');
  
  const CATEGORIES_PDF_FILE_NAME = (lang) => path.resolve(
    __dirname,
    '..',
    `categories/categories-${lang}.pdf`,
  );
  const TEMPLATE_PATH = path.resolve(__dirname, 'templates/pdf-template.html');

  const DIRECTORY_NAME = 'categories';
  if (!fs.existsSync(DIRECTORY_NAME)) {
    fs.mkdirSync(DIRECTORY_NAME);
  }

  ['en', 'fr'].forEach(async lang => {
    const htmlContent = await getContent(TEMPLATE_PATH, lang);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent);
    //page.emulateMediaType('screen') // use default CSS rather than print media CSS
    await page.pdf({
      path: CATEGORIES_PDF_FILE_NAME(lang),
      margin: { top: 24, right: 24, bottom: 24, left: 24 },
      format: 'A4',
      scale: 1.36
    });
    await browser.close();
  })
})();
