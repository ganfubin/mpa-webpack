const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const webpackConfigBase = require('./webpack.base.config');

module.exports = merge(webpackConfigBase, {
  mode: 'development',
  devtool: "#source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    historyApiFallback: true,
    overlay: true,
    hot: true,
    contentBase: path.join(__dirname, "..", "dist"),
    useLocalIp: true,
    host: '0.0.0.0',
    port: 4000,
    compress: true,
    disableHostCheck: true
  }
});
