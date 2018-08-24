# mulberry-symbols
The Mulberry Symbols are collection of pictograms / symbols / icons designed for AAC users who rely on graphics symbols for communication with others. They include more unusual symbols, including many suitable for adult AAC users. Thesymbols are freely usable, sharable and modifiable having a liberal Creative Commons licence. Thus they are perfect for using in on-line applications as there are no licence fees to concider.

The symbols are provided in Scalable Vector Format (SVG) so they look good at any size. We've always preferred this format and it is now readily usable on the web and other platforms. If you want a fixed size raster image there are various SVG tools that alow you to convert to the ressolution that you require. 

See https://mulberrysymbols.org for more details

## Developing

This is a typical npm/node managed package.

Two npm scripts are provided in `package.json`

1. test - checks the symbols names against the `symbol-info.csv'
1. build - generates the .zip for distibution 

## Releases

Currently this is a manual process.

1. Update the RELEASE number in `scripts/mkzip.js`
1. Commit and push everything so merged to master on GitHub
1. `npm build` to build the zip
1. Make a GitHub Release with Tag of `v<Release NUMER>`, adding release notes
1. Add the zip to the release
1. Announce the release
