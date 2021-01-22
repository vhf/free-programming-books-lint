#!/usr/bin/env node
const { lint } = require('./lib/lint')

;((directory) => {
  const failure = lint(directory)
  if (failure) {
    process.exit(1)
  }
  process.exit(0)
})(process.argv[2])
