const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const progressbarWebpack = require('progress-bar-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const webpackConfigBase = require('./webpack.base.config');

module.exports = merge(webpackConfigBase, {
  mode: 'production',
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.common.js',
    },
  },
  plugins: [
    new CompressionPlugin(),
    new progressbarWebpack(),
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin(),
    new LodashModuleReplacementPlugin()
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({ // 压缩js
        cache: true,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({ // 压缩css
        cssProcessorOptions: {
          safe: true
        }
      })
    ]
  },

});
