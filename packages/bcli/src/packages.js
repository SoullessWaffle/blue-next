'use strict'
const chalk = require('chalk')
const co = require('co')
const ora = require('ora')
const emoji = require('node-emoji').emoji
const execa = require('execa')
const spinner = ora()
const hasYarn = require('./commons/utils').yarnAvailable()

module.exports = co.wrap(function * (options) {
  console.log('') // extra space
  spinner.text = 'Install dependencies with ' + (hasYarn ? 'yarn' : 'npm')
  spinner.start()

  try {
    const dependencies = options.dependencies.join(' ')
    if (hasYarn) {
      yield execa.shell(`yarn add ${dependencies}`)
    } else {
      yield execa.shell(`npm install --save ${dependencies}`)
    }
  } catch (error) {
    spinner.fail()
    console.error(chalk.red(`\n${error.stderr}`))
    return
  }

  spinner.succeed()
  console.log(`\nPackages installed!`, emoji.heart)
})
