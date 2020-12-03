const fs = require('fs');
const remark = require('remark');
const report = require('vfile-reporter');
const path = require('path');

const excludes = [
  'README.md',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'SUMMARY.md'
];

const langsToAlphabetize = [
  'az',
  'bg',
  'cs',
  'de',
  'en',
  'en-US',
  'es',
  'fi',
  'fr',
  'gr',
  'hu',
  'id',
  'it',
  'pl',
  'pt-BR',
  'pt-PT',
  'ro',
  'se',
  'sk',
  'tr',
  'ua',
];

function getLangFromFilename(filename) {
  const dash = filename.lastIndexOf('-');
  const dot = filename.lastIndexOf('.');
  let lang = filename.slice(dash + 1, dot).replace(/_/, '-');
  if (lang.length > 2 && lang.indexOf('-') === -1) {
    lang = 'en-US';
  }
  return lang;
}

function getFilesFromDir(dir) {
  return fs.readdirSync(dir).filter(file => path.extname(file) === '.md' && excludes.indexOf(file) === -1).map(file => path.join(dir, file));
}

const commonPreset = {
  plugins: [
    [require('remark-lint')],
    [require('remark-lint-final-newline'), true],
    [require('remark-lint-heading-style'), 'atx'],
    [require('remark-lint-no-duplicate-headings'), true],
    [require('remark-lint-no-emphasis-as-heading'), true],
    [require('remark-lint-no-heading-content-indent'), true],
    [require('remark-lint-no-heading-indent'), true],
    [require('remark-lint-no-heading-punctuation'), true],
    [require('remark-lint-no-literal-urls'), true],
    [require('remark-lint-no-tabs'), true],
    [require('remark-lint-strong-marker'), 'consistent'],
    [require('remark-lint-unordered-list-marker-style'), '*'],
    [require('remark-lint-blank-lines-1-0-2')],
    [require('remark-lint-books-links')],
    [require('remark-lint-no-empty-sections')],
    [require('remark-lint-no-url-trailing-slash')],
  ],
};

((directory) => {
  let failed = false;
  const filenames = getFilesFromDir(path.resolve(directory));
  filenames.forEach((filename) => {
    const doc = fs.readFileSync(filename);
    const lang = getLangFromFilename(filename);
    const processor = remark().use(commonPreset);
    if (langsToAlphabetize.includes(lang)) {
      processor.use(require('remark-lint-alphabetize-lists'), lang);
    }

    processor.process(doc, (err, file) => {
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
