(async function() {
  const fs = require('fs');
  const path = require('path');
  const getContent = require('./mk');
  const util = require('util');

  const CATEGORIES_HTML_FILE_NAME = 'categories/categories.html';
  const WEBPAGE_TEMPLATE_PATH = path.resolve(
    __dirname,
    'templates/webpage-template.html',
  );
  const DIRECTORY_NAME = 'categories';

  const asyncWriteFile = util.promisify(fs.writeFile);

  const htmlContent = await getContent(WEBPAGE_TEMPLATE_PATH);

  if (!fs.existsSync(DIRECTORY_NAME)) {
    fs.mkdirSync(DIRECTORY_NAME);
  }

  await asyncWriteFile(CATEGORIES_HTML_FILE_NAME, htmlContent);
})();
