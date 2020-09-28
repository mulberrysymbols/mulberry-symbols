# mulberry-symbols

The Mulberry Symbols are collection of pictograms / symbols / icons designed for AAC users who rely on graphics symbols for communication with others. They include more unusual symbols, including many suitable for adult AAC users. The symbols are freely usable, sharable and modifiable having a liberal Creative Commons license. Thus they are perfect for using in on-line applications as there are no license fees to consider.

The symbols are provided in Scalable Vector Format (SVG) so they look good at any size. We've always preferred this format and it is now readily usable on the web and other platforms. If you want a fixed size raster image there are various SVG tools that allow you to convert to the resolution that you require.

See [mulberrysymbols.org](https://mulberrysymbols.org) for more details

## Developing

This is a typical npm/node managed package. A source of complexity, especially in releases, is due to the symbols and the website being in the same repo.

Two npm scripts are provided in `package.json`

1. test - checks the symbols names against the `symbol-info.csv`
1. build - build everything
1. build:zip - generates the .zip for distribution
1. build:categories - generate categories-xx.pdf and catagories-en.html

If you want to develop the website locally follow the instructions on [Githubs docs](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/)

## Releases

Currently this is a manual process. The following updates the zip and category files ready for the release

1. Update the version number in `package.json`
1. Commit and push everything so merged to master on GitHub
1. Execute `npm run build` to build the zip and categories files
1. Make a GitHub Release with Tag of `v<RELEASE NUMBER>`, adding release notes
1. Add the zip to the release
1. Add `categories-xx.pdf` to the release
1. Add `categories-en.html` to the release
1. Add `symbol-info.csv` to the release - this gets generated manually from a master Google Sheet
1. Announce the release
1. Perform `git pull` to get the release tag locally

### Updating the website assets

The website references files in the latest release so this may need to be built first.
The website files are found in the `docs` folder and the `README` becomes the home page.
Any changes pushed to `master` cause the website to be regenerated and published.

## Contributors

Thanks to the following people for helping to improve the Mulberry Symbols

- @austin94
- @gavinhenderson
- @shayc
