'use strict';

var fs = require('fs');
var remark = require('remark');
var report = require('vfile-reporter');
var path = require('path');

var excludes = ['README.md', 'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md', 'SUMMARY.md'];

var langsToAlphabetize = ['az', 'bg', 'cs', 'de', 'en', 'en-US', 'es', 'fi', 'fr', 'gr', 'hu', 'id', 'it', 'pl', 'pt-BR', 'pt-PT', 'ro', 'se', 'sk', 'tr', 'ua'];

function getLangFromFilename(filename) {
  var dash = filename.lastIndexOf('-');
  var dot = filename.lastIndexOf('.');
  var lang = filename.slice(dash + 1, dot).replace(/_/, '-');
  if (lang.length > 2 && lang.indexOf('-') === -1) {
    lang = 'en-US';
  }
  return lang;
}

function getFilesFromDir(dir) {
  return fs.readdirSync(dir).filter(function (file) {
    return path.extname(file) === '.md' && excludes.indexOf(file) === -1;
  }).map(function (file) {
    return path.join(dir, file);
  });
}

var commonPreset = {
  plugins: [[require('remark-lint')], [require('remark-lint-final-newline'), true], [require('remark-lint-heading-style'), 'atx'], [require('remark-lint-no-duplicate-headings'), true], [require('remark-lint-no-emphasis-as-heading'), true], [require('remark-lint-no-heading-content-indent'), true], [require('remark-lint-no-heading-indent'), true], [require('remark-lint-no-heading-punctuation'), true], [require('remark-lint-no-literal-urls'), true], [require('remark-lint-no-tabs'), true], [require('remark-lint-strong-marker'), 'consistent'], [require('remark-lint-unordered-list-marker-style'), '*'], [require('remark-lint-blank-lines-1-0-2')], [require('remark-lint-books-links')], [require('remark-lint-no-empty-sections')], [require('remark-lint-no-url-trailing-slash')]]
};

(function (directory) {
  var failed = false;
  var filenames = getFilesFromDir(path.resolve(directory));
  filenames.forEach(function (filename) {
    var doc = fs.readFileSync(filename);
    var lang = getLangFromFilename(filename);
    var processor = remark().use(commonPreset);
    if (langsToAlphabetize.includes(lang)) {
      processor.use(require('remark-lint-alphabetize-lists'), lang);
    }

    processor.process(doc, function (err, file) {
      if (report(err || file) !== 'no issues found') {
        failed = true;
        console.log(filename);
        console.error(report(err || file));
      }
    });
  });
  if (failed) {
    process.exit(1);
  }
  process.exit(0);
})(process.argv[2]);