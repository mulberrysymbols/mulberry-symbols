const fs = require("fs");
const parse = require("csv-parse");
const path = require("path");
const util = require("util");

const parser = parse({ from: 2, cast: true }, function(err, data) {
  if (err) {
    console.log(err);
    return;
  }
  const symbols = data.map(([id, symbol]) => symbol);

  fs.readdir("EN", (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    const filenames = files.map(filename => path.parse(filename).name);
    const missingFiles = symbols.filter(symbol => !filenames.includes(symbol));
    const missingSymbols = filenames.filter(
      filename => !symbols.includes(filename)
    );

    console.log(
      "Missing Files",
      util.inspect(missingFiles, { maxArrayLength: null })
    );
    console.log(
      "Missing Symbols",
      util.inspect(missingSymbols, { maxArrayLength: null })
    );
  });
});

fs.createReadStream("scripts/data/symbol-info-en.csv").pipe(parser);
