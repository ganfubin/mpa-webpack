const glob = require('glob')
const path = require('path');
const PAGE_PATH = path.resolve(__dirname, '../src/pages')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = require('../config')

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

/**
 * 获取入口文件
 * @returns {{}}
 */
exports.entries = function () {
  let entryFiles = glob.sync(PAGE_PATH + '/*/*.ts')
  let map = {}
  entryFiles.forEach((filePath) => {
    let entryPath = path.dirname(filePath)
    let filename = entryPath.substring(entryPath.lastIndexOf('\/') + 1)
    map[filename] = filePath
  });
  return map
};

/**
 * 获取html模板
 * @returns {Array}
 */
exports.htmlPlugin = function () {
  let entryHtml = glob.sync(PAGE_PATH + '/*/*.html')
  let arr = []
  entryHtml.forEach((filePath) => {
    let entryPath = path.dirname(filePath)
    let filename = entryPath.substring(entryPath.lastIndexOf('\/') + 1)
    let conf = {
      template: filePath,
      filename: `${filename}.html`,
      iconfontcss: config.iconFontCssUrl,
      iconfontjs: config.iconFontJsUrl,
      chunks: [filename],
      inject: true,
      hash: true
    }
    if (process.env.NODE_ENV === 'production') {
      let productionConfig = {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      }
      conf = {...conf, ...productionConfig}
    }
    arr.push(new HtmlWebpackPlugin(conf))
  })
  return arr
}

/**
 * 获取版本号
 */
exports.getVersion = function() {

}
