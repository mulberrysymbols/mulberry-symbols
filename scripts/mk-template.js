const path = require('path');
const handlebars = require('handlebars');
const util = require('util');
const fs = require('fs');

const CONTENT_TEMPLATE_PATH = path.resolve(
  __dirname,
  'templates/content-partial.html',
);

const asyncReadFile = util.promisify(fs.readFile);

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
