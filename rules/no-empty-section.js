var visit = require('unist-util-visit');

function noEmptySection(ast, file, preferred, done) {
  visit(ast, function (node, index, parent) {
    var next = parent && parent.children[index + 1];

    if (
        next &&
        (node.type === 'heading') &&
        (next.type === 'heading') &&
        (node.depth === next.depth)
      ) {
      file.warn('Remove empty section' + (node.children.length ? ': "' + node.children[0].value + '"' : ''), next);
    }
  });

  done();
}

module.exports = noEmptySection;
