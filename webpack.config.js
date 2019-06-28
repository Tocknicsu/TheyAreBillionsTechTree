const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'eval',
  devServer: {
    historyApiFallback: true,
    compress: true,
    keepalive: false
  },
  entry: [
    'react-hot-loader/patch',
    'webpack/hot/only-dev-server',
    'webpack-dev-server/client',
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      src: path.join(__dirname, './src'),
      containers: path.join(__dirname, './src/js/containers'),
      js: path.join(__dirname, './src/js'),
      assets: path.join(__dirname, './src/assets')
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'eslint-loader',
        enforce: 'pre',
        include: path.join(__dirname, 'src/'),
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: 'babel-loader',
        include: path.join(__dirname, 'src/'),
        options: {
          cacheDirectory: true,
          plugins: ['react-hot-loader/babel']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(html|ttf|eot|png|gif|jpg|woff|woff2|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader?name=[name].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.ejs',
      inject: true
    })
  ]
}
