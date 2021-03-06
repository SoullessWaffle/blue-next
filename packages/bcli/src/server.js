'use strict'
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const utils = require('./commons/utils')
const paths = require('./commons/paths')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const merge = require('webpack-merge')
const detectPort = require('./detect-port')
const co = require('co')

module.exports = co.wrap(function * (options) {
  const config = yield utils.getConfig(options.env)
  const webpackConfig = config.webpack
  const port = yield detectPort(webpackConfig.devServer.port)
  const host = webpackConfig.devServer.host
  const serverUrl =`http://${host}:${port}`

  // Add the FriendlyErrorsWebpackPlugin after everything is sorted.
  // We need this to be able to change server port in runtime and
  // display the current project and where it's served.
  webpackConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`'${config.app.title}' is running on ${serverUrl}\n`]
      }
    })
  )

  // add webpack-dev-server to the webpack entry point
  // webpack-dev-server needs to point to the cli node_modules folder or won't be recognized
  const devServerPath = `${paths.cliNodeModules}/webpack-dev-server/client?${serverUrl}`
  webpackConfig.entry.app.unshift(devServerPath)

  // start the server!
  const server = new WebpackDevServer(webpack(webpackConfig), webpackConfig.devServer)
  server.listen(port, host, function () {
    console.log(`\n   Starting the server...`)
  })
})
