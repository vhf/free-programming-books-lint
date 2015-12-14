var visit = require('unist-util-visit');
var position = require('mdast-util-position');
var strip = require('strip-markdown');
var mdast = require('mdast').use(strip);
var franc = require('franc');


function alphaCheck(ast, file, preferred, done) {
  var contents = file.toString();
  var lang = franc(mdast.process(contents));

  visit(ast, 'list', function(node) {
    var items = node.children;
    var lastLine = -1;
    var lastText = '';

    items.forEach(function(item) {
      if (item.children.length) {
        var lineStart = item.children[0].children[0].position.start.offset;
        var lineEnd = item.children[0].children[item.children[0].children.length - 1].position.end.offset;
        var text = mdast.process(contents.slice(lineStart, lineEnd));
        var line = item.position.start.line;
        var a = lastText.toLowerCase().trim().replace(/^(\.|\-|\_)*/, '');
        var b = text.toLowerCase().trim().replace(/^(\.|\-|\_)*/, '');
        var comp = new Intl.Collator(lang).compare(a, b);
        if (comp > 0) {
          file.warn('Alphabetical ordering: swap l.' + item.position.start.line + ' and l.' + lastLine + '', node);
        }
        lastLine = line;
        lastText = text;
      }
    });
  });

  done();
}

module.exports = alphaCheck;
