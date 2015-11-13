(function(directory) {
  var fs = require('fs');
  var mdast = require('mdast');
  var lint = require('mdast-lint');
  var rules = require('./rules');
  var path = require('path');

  var processor = mdast().use(lint, {
    'blockquote-indentation': false,
    'checkbox-character-style': false,
    'checkbox-content-indent': false,
    'code-block-style': false,
    'definition-case': false,
    'definition-spacing': false,
    'emphasis-marker': false,
    'fenced-code-flag': false,
    'fenced-code-marker': false,
    'file-extension': false,
    'final-definition': false,
    'final-newline': true,
    'first-heading-level': false,
    'hard-break-spaces': false,
    'heading-increment': false,
    'heading-style': 'atx',
    'index': false,
    'link-title-style': false,
    'list-item-bullet-indent': false,
    'list-item-content-indent': false,
    'list-item-indent': false,
    'list-item-spacing': false,
    'maximum-heading-length': false,
    'maximum-line-length': false,
    'no-auto-link-without-protocol': false,
    'no-blockquote-without-caret': false,
    'no-consecutive-blank-lines': false,
    'no-duplicate-definitions': false,
    'no-duplicate-headings': true,
    'no-emphasis-as-heading': true,
    'no-file-name-articles': false,
    'no-file-name-consecutive-dashes': false,
    'no-file-name-irregular-characters': false,
    'no-file-name-mixed-case': false,
    'no-file-name-outer-dashes': false,
    'no-heading-content-indent': true,
    'no-heading-indent': true,
    'no-heading-punctuation': true,
    'no-html': false,
    'no-inline-padding': false,
    'no-literal-urls': true,
    'no-missing-blank-lines': false,
    'no-multiple-toplevel-headings': false,
    'no-shell-dollars': false,
    'no-shortcut-reference-image': false,
    'no-shortcut-reference-link': false,
    'no-table-indentation': false,
    'no-tabs': true,
    'ordered-list-marker-style': false,
    'ordered-list-marker-value': false,
    'rule-style': false,
    'strong-marker': 'consistent',
    'table-cell-padding': false,
    'table-pipe-alignment': false,
    'table-pipes': false,
    'unordered-list-marker-style': '*',
    external: [rules],
  });

  var dir = path.resolve(directory);
  var messages = [];
  var excludes = ['README.md', 'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md'];
  var filenames;

  function getFiles(directory) {
    return fs.readdirSync(directory).filter(function(file) {
      return path.extname(file) === '.md' && excludes.indexOf(file) === -1;
    });
  }
  console.log(dir);

  filenames = getFiles(dir);

  filenames.forEach(function(filename) {
    var doc = fs.readFileSync(path.join(dir, filename)) + '';
    processor.process(doc, function(err, file) {
      if (err) throw err;
      if (file.messages.length) {
        messages.push(filename);
        messages = messages.concat(file.messages);
      }
    });
  });

  if (messages.length) {
    console.log(messages);
    process.exit(1);
  }
  process.exit(0);
})(process.argv[2]);
