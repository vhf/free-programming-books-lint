var fs = require('fs');
var _ = require('lodash');
var exec = require('child_process').exec;
var mdast = require('mdast');
var lint = require('mdast-lint');
var rules = require('./rules');
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

exec(`find "../free-programming-books" -name "*.md" | egrep -v '(README|CONTRIBUTING|CODE)'`, function(error, stdout) {
  var filenames = _.compact(stdout.split('\n'));
  _.each(filenames, function(filename) {
    var doc = fs.readFileSync(filename) + '';
    processor.process(doc, function(err, file) {
      if (err) throw err;
      if (file.messages.length) {
        console.log(filename, file.messages);
      }
    });
  });
});
