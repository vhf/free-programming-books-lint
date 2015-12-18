((directory) => {
  const fs = require('fs');
  const mdast = require('mdast');
  const lint = require('mdast-lint');
  const path = require('path');

  const excludes = ['README.md', 'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md'];
  let messages = [];
  let filenames;

  function getLangFromFilename(filename) {
    const dash = filename.lastIndexOf('-');
    const dot = filename.lastIndexOf('.');
    let lang = filename.slice(dash + 1, dot).replace(/_/, '-');
    if (lang.length > 2 && lang.indexOf('-') === -1) {
      lang = 'en-US';
    }
    return lang;
  }

  function rulesForFile(filename) {
    return {
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
      'mdast-lint-alphabetize-lists': getLangFromFilename(filename),
      external: [
        'mdast-lint-alphabetize-lists',
        'mdast-lint-blank-lines-1-0-2',
        'mdast-lint-books-links',
        'mdast-lint-empty-sections',
        'mdast-lint-url-trailing-slash',
      ],
    };
  }

  function getFilesFromDir(dir) {
    return fs.readdirSync(dir).filter((file) => {
      return path.extname(file) === '.md' && excludes.indexOf(file) === -1;
    }).map((file) => {
      return path.join(dir, file);
    });
  }

  filenames = getFilesFromDir(path.resolve(directory));

  filenames.forEach((filename) => {
    const doc = fs.readFileSync(filename) + '';
    const processor = mdast().use(lint, rulesForFile(filename));
    processor.process(doc, (err, file) => {
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
