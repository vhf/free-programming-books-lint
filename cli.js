#!/usr/bin/env node
const { lint } = require('./lib/lint')
const { program } = require('commander')

program.version('3.0.0')

program
  .command('lint', null, { isDefault: true })
  .argument('<dirs...>')
  .description('lint the specified directories')
  .action((directories) => {
    let failure

    for (const directory of directories) {
      const failed = lint(directory)

      if (failed) {
        failure = true
      }
    }

    if (failure) {
      process.exit(1)
    }

    process.exit(0)
  })

program.parse(process.argv)
