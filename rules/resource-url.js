var visit = require('unist-util-visit');
var url = require('url');

function checkURL(ast, file, preferred, done) {
  visit(ast, 'link', function (node) {
    var href = node.href;
    var parsed = url.parse(node.href);
    var target = parsed.protocol + '//' + parsed.host;

    if (href === target + '/') {
      file.warn('Remove trailing slash (' + target + ')', node);
    }
  });

  done();
}

module.exports = checkURL;
