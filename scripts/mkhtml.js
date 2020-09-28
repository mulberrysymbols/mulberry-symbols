(async function() {
  const fs = require('fs');
  const path = require('path');
  const getContent = require('./mk-template');
  const util = require('util');

  const CATEGORIES_HTML_FILE_NAME = path.resolve(
    __dirname,
    '..',
    'categories/categories-en.html',
  );
  const DIRECTORY_NAME = path.resolve(__dirname, '..', 'categories');
  const WEBPAGE_TEMPLATE_PATH = path.resolve(
    __dirname,
    'templates/webpage-template.html',
  );

  const asyncWriteFile = util.promisify(fs.writeFile);
  const htmlContent = await getContent(WEBPAGE_TEMPLATE_PATH, 'en');

  if (!fs.existsSync(DIRECTORY_NAME)) {
    fs.mkdirSync(DIRECTORY_NAME);
  }

  await asyncWriteFile(CATEGORIES_HTML_FILE_NAME, htmlContent);
})();
