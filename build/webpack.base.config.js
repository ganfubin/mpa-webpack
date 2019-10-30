const webpack = require('webpack');
const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const utils = require('./utils')

const config = require('../config')
const package = require('../package.json')
let version = package.version;
let env_config = process.env.env_config;

let isDev = env_config === 'local';

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

let plugins = [
  new VueLoaderPlugin(),
  new webpack.DefinePlugin({
    'CONFIG': JSON.stringify(config),
    'process.env': JSON.stringify(process.env)
  })
];

if (!isDev) {
  plugins.push(
    new miniCssExtractPlugin({
      filename: `css/[name].[hash:5].${version}.css`,
      chunkFilename: `css/[name].[hash:5].${version}.css`
    })
  )
}

module.exports = {
  entry: utils.entries(),
  output: {
    path: resolve('../dist'),
    filename: `js/[name]/${version}.js`,
    chunkFilename: `js/[name]/${version}.js`,
  },
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      'vue': 'vue/dist/vue.js',
      '@': resolve('../src'),
      '@assets': resolve('../src/assets'),
      '@components': resolve('../src/components'),
    }
  },
  plugins: plugins.concat(utils.htmlPlugin()),
  optimization: {
    splitChunks: {
      cacheGroups: {
        elementUI: {
          name: "element-ui",
          priority: 20,
          test: /[\/]node_modules[\/]element-ui[\/]/
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : {loader: miniCssExtractPlugin.loader},
          {loader: 'css-loader?importLoaders=1'},
        ]
      },
      {
        test: /\.less$/,
        use: [
          isDev ? 'style-loader' : {
            loader: miniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(__dirname, './postcss.config.js')
              }
            },
          },
          'less-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                resolve('../src/assets/css/variables.less')
              ]
            }
          },
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
        options: {
          loaders: {
            'less': [
              'vue-style-loader',
              'css-loader',
              'less-loader?indentedSyntax'
            ]
          },
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/images/[name].[ext]?[hash]',
            }
          },
        ]
      },
      {test: /\.(ttf|eot|svg|woff|woff2)$/, use: 'url-loader'},
    ]
  }

};
