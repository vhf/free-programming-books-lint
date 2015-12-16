var visit = require('unist-util-visit');
var position = require('mdast-util-position');

function isApplicable(node) {
  return [
    'paragraph',
    'heading',
    'list',
  ].indexOf(node.type) !== -1;
}

function blankLines(ast, file, preferred, done) {
  visit(ast, function (node, index, parent) {
    var next = parent && parent.children[index + 1];

    if (position.generated(node)) {
      return;
    }

    if (next && isApplicable(node) && isApplicable(next)) {
      if (node.type === 'heading' && next.type === 'heading') {
        if (position.start(next).line !== position.end(node).line + 2) {
          file.warn('Incorrect number of blank lines between headings', node);
        }
      } else if (node.type === 'heading' && next.type !== 'heading') {
        if (position.start(next).line - position.end(node).line !== 2) {
          file.warn('Incorrect number of blank line between heading and section', node);
        }
      } else if (node.type === 'list') {
        if (position.start(next).line - position.end(node).line !== 3) {
          file.warn('Incorrect number of blank line between last section and next heading', node);
        }
      }
    }
  });

  done();
}

module.exports = blankLines;
