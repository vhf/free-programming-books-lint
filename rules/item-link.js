'use strict';

var _ = require('lodash');
var visit = require('unist-util-visit');
var position = require('mdast-util-position');

var start = position.start;

function hasLink(item) {
  return item.children.length &&
         item.children[0].type === 'paragraph' &&
         item.children[0].children.length &&
         item.children[0].children[0].type === 'link';
}

function itemLink(ast, file, preferred, done) {
  var contents = file.toString();

  visit(ast, 'list', function (node) {
    var items = node.children;

    if (node.ordered) {
      return;
    }

    items.forEach(function (item) {
      if (hasLink(item)) {
        var lineStart = item.children[0].children[0].position.start.offset;
        var lineEnd = item.children[0].children[item.children[0].children.length - 1].position.end.offset;
        var line = contents.slice(lineStart, lineEnd);

        var rest = null;
        if (item.children[0].children.length > 1) {
          var restStart = item.children[0].children[1].position.start.offset;
          var restEnd = item.children[0].children[item.children[0].children.length - 1].position.end.offset;
          rest = contents.slice(restStart, restEnd);
        }

        var author;
        var pdf;

        if (position.generated(item)) {
          return;
        }

        if (author = /- ([^\(\n]+){0,1}/gm.exec(rest)) {
          if (author.index < 1) {
            file.warn('Missing a space before author', item);
          } else if (author.index !== 1 && author[1][author[1].length - 1] !== ')') {
            file.warn('Misplaced author', item);
          }
        }

        if (pdf = /(\.pdf)/gmi.exec(line)) {
          if (!rest || (pdf.length > 1 && !/PDF/gm.test(rest))) {
            file.warn('Missing PDF indication', item);
          }
        }
      } else {
        if (['podcast', 'screencast'].indexOf(item.children[0].children[0].identifier) === -1) {
          if (!hasLink(item.children[0])) {
            if (item.children.length > 1 &&
                contents.slice(item.children[1].position.start.offset, item.children[1].position.start.offset + 1) === '('
            ) {
              file.warn('Invalid link: ] (', item);
            }
          }
        }
      }
    });
  });

  done();
}

module.exports = itemLink;
