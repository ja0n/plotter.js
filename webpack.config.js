
var webpack = require('webpack');
var path = require('path');
var isDev = process.env.NODE_ENV === 'dev';

var config = {
  cache: true,
  resolve: {
    extensions: ["", ".js"]
  },
  entry: [
    './Plotter.js',
  ],
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/build/'),
    filename: 'plotter.js',
    library: 'Plotter',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ]
  },
};

if (isDev) {
  config.devtool = 'eval';
  config.entry.unshift('webpack-dev-server/client?http://localhost:8090');
}

module.exports = config;
