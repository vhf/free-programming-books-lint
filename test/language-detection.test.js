const { describe, it } = require('mocha')
const assert = require('assert')
const { getLangFromFilename } = require('../lib/lint')

describe('detects language from filename', () => {
  it('detects languages', () => {
    const files = {
      'fa-IR': '/foo/bar/free-programming-books/books/free-programming-books-fa_IR.md',
      ko: '/foo/bar/free-programming-books/books/free-programming-books-ko.md'
    }

    Object.entries(files)
      .forEach(([bcp47, filename]) => {
        const detectedBCP47 = getLangFromFilename(filename)
        assert.strictEqual(detectedBCP47, bcp47, `language detection failed for ${filename}`)
      })
  })

  it('assumes en-US when no language in filename', () => {
    const files = {
      'en-US': '/foo/bar/free-programming-books/books/free-programming-books.md'
    }

    Object.entries(files)
      .forEach(([bcp47, filename]) => {
        const detectedBCP47 = getLangFromFilename(filename)
        assert.strictEqual(detectedBCP47, bcp47, `language detection failed for ${filename}`)
      })
  })

  it('does not return lang on unrecognized lang', () => {
    const files = [
      '/foo/bar/free-programming-books/books/free-programming-books-xx.md',
      '/foo/bar/free-programming-books/books/free-programming-books-xx_ZZ.md'
    ]

    files.forEach(filename => {
      const detectedBCP47 = getLangFromFilename(filename)
      assert.strictEqual(detectedBCP47, '', `language detection failed for ${filename}`)
    })
  })
})
