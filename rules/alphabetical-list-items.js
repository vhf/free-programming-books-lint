var visit = require('unist-util-visit');
var position = require('mdast-util-position');
var strip = require('strip-markdown');
var mdast = require('mdast').use(strip);
var franc = require('franc');

function normalize(text) {
  var removeAtBeginning = /^(\.|\-|\_|\(|《|\"|\')*/;
  var removeInside = /(,|:)/;
  var replaceWithSpace = /(-)/;
  return text.toLowerCase().trim().replace(removeAtBeginning, '')
             .replace(removeInside, '').replace(replaceWithSpace, ' ');
}


function alphaCheck(ast, file, preferred, done) {
  var contents = file.toString();
  var lang = franc(mdast.process(contents));

  visit(ast, 'list', function(node) {
    var items = node.children;
    var lastLine = -1;
    var lastText = '';

    items.forEach(function(item) {
      if (item.children.length) {
        var lineStartOffset = item.children[0].children[0].position.start.offset;
        var lineEndOffset = item.children[0].children[item.children[0].children.length - 1].position.end.offset;
        var text = normalize(mdast.process(contents.slice(lineStartOffset, lineEndOffset)));
        var line = item.position.start.line;
        var comp = new Intl.Collator(lang).compare(lastText, text);
        if (comp > 0) {
          file.warn('Alphabetical ordering: swap l.' + item.children[0].children[0].position.start.line + ' and l.' + lastLine + '', node);
        }
        lastLine = line;
        lastText = text;
      }
    });
  });

  done();
}

module.exports = alphaCheck;
