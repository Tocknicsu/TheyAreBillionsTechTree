var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')

const app = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  disableHostCheck: true,
  stats: {
    colors: true
  }
})
const server = app.listen(3000, '0.0.0.0', function (err) {
  server.keepAliveTimeout = 0
  if (err) {
    console.log(err)
  }

  console.log('Listening at 0.0.0.0:3000')
})

