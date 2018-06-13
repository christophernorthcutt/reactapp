const path = require('path');
//const HtmlWebpackPlugin = require('html-webpack-plugin');
//const ReactRootPlugin = require('html-webpack-react-root-plugin');
//const webpack = require('webpack');

module.exports = {
  entry: './script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [],
  devtool: 'inline-source-map',
  mode: "development",
  resolve: {
    extensions: ['.js', '.jsx']
  }
};