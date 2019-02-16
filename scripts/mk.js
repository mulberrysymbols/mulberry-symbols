const path = require('path');
const handlebars = require('handlebars');
const util = require('util');
const fs = require('fs');

const PDF_TEMPLATE_PATH = path.resolve(
  __dirname,
  'templates/pdf-template.html',
);
const CONTENT_TEMPLATE_PATH = path.resolve(
  __dirname,
  'templates/content-partial.html',
);
const DIRECTORY_NAME = 'categories';

const asyncReadFile = util.promisify(fs.readFile);
const asyncWriteFile = util.promisify(fs.writeFile);
const CATEGORIES_HTML_FILE_NAME = 'categories/categories.html';

/**
 * Generate HTML content of the PDF report
 *
 * @param {*} data
 */
module.exports = async function(templatePath) {
  const contentFile = await asyncReadFile(CONTENT_TEMPLATE_PATH, 'utf8');
  const htmlFile = await asyncReadFile(templatePath, 'utf8');

  const contentTemplate = handlebars.compile(contentFile);
  handlebars.registerPartial('symbols', contentTemplate);
  const htmlTemplate = handlebars.compile(htmlFile);

  const categories = await require('./parse-symbols')();

  const html = await htmlTemplate({
    categories,
    version: require('../package.json').version,
  });

  return html;
};
