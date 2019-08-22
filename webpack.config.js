'use strict'

const devMode = process.env.NODE_ENV !== 'production'
const path = require('path')

const VueLoaderPlugin = require('vue-loader/lib/plugin')

// preset default output object
const output = {
  library: '__widget_example_name',
  libraryTarget: 'umd',
  path: path.resolve(__dirname, 'dist'),
  filename: 'widget-example-name.min.js'
}

// base Webpack config
const config = {
  mode: devMode ? 'development' : 'production',
  entry: path.resolve(__dirname, 'src/index.js'),
  output,
  devServer: {
    contentBase: path.resolve(__dirname, 'test'),
    stats: 'minimal',
    open: true
  },
  stats: {
    colors: true
  },
  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /^(.(?!\.min.js$))+\.m?js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: 'file-loader'
      },

      {
        test: /\.s?css$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              minimize: !devMode,
              plugins: [
                require('autoprefixer')(),
                require('cssnano')({ preset: 'default' })
              ]
            }
          },
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin()
  ],

  // exclude all imported libs on production by default
  externals: devMode ? '' : /^[^./].*$/
}

module.exports = devMode
  // single config object for dev server
  ? config

  // production outputs with and without polyfill
  : [
    config,
    {
      ...config,
      output: {
        ...output,
        filename: output.filename.replace('.min.js', '.root.min.js')
      },

      externals: {
        vue: {
          commonjs: 'vue',
          commonjs2: 'vue',
          root: 'Vue'
        },
        '@ecomplus/utils': {
          commonjs: '@ecomplus/utils',
          commonjs2: '@ecomplus/utils',
          root: 'ecomUtils'
        },
        '@ecomplus/client': {
          commonjs: '@ecomplus/client',
          commonjs2: '@ecomplus/client',
          root: 'ecomClient'
        },
        '@ecomplus/search-engine': {
          commonjs: '@ecomplus/search-engine',
          commonjs2: '@ecomplus/search-engine',
          root: 'EcomSearch'
        },
        '@ecomplus/storefront-twbs': {
          commonjs: '@ecomplus/storefront-twbs',
          commonjs2: '@ecomplus/storefront-twbs',
          root: '__storefront_twbs'
        }
      }
    }
  ]
