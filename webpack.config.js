
var webpack = require('webpack'),
  path = require('path'),
  isDev = process.env.NODE_ENV;

var config = {
  cache: true,
  resolve: {
    extensions: ["", ".js"]
  },
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    './index.js'
  ],
  output: {
    path: path.join(__dirname, '/build/'),
    filename: 'app.js',
    publicPath: ''
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ]
  },
};

if (process.env.NODE_ENV === "dev") {
  config.devtool = 'eval';
}

module.exports = config;
