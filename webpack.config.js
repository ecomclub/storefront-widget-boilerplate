'use strict'

const devMode = process.env.NODE_ENV !== 'production'
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const templatePath = path.join(process.cwd(), 'node_modules/@ecomplus/storefront-template/dist')

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
    contentBase: templatePath,
    stats: 'minimal',
    port: 9128,
    open: true
  },
  stats: {
    colors: true
  },
  devtool: 'source-map',
  plugins: [
    new VueLoaderPlugin()
  ],
  // exclude all imported libs on production by default
  externals: devMode ? '' : /^[^./].*$/,

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
  }
}

if (devMode) {
  // inject widget script with HTML plugin
  config.plugins.push(new HtmlWebpackPlugin({
    template: path.resolve(templatePath, 'index.html')
  }))
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
      externals: require('@ecomplus/storefront-template/webpack.externals')
    }
  ]
