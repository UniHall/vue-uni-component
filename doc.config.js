'use strict'
const path = require('path')

const markdownRender = require('markdown-it')()

// 判断参数是打包examples,设置output出口为dist
const webpackConfig = {
  entry: {
    // 设置打包example的入口
    app: './examples/main.js'
  },
  devtool: '#source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: path.posix.join('static', 'js/[name].[chunkhash].js'),
    chunkFilename: path.posix.join('static', 'js/[id].[chunkhash].js')
  },
  chainWebpack(config) {
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        wrapper: 'article',
        wrapperName: '123',
        raw: true,
        preventExtract: true,
        use: [
          [
            require('markdown-it-container'),
            'demo',
            {
              validate: function(params) {
                return params.trim().match(/^demo\s+(.*)$/)
              },

              render: function(tokens, idx) {
                if (tokens[idx].nesting === 1) {
                  const content = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : ''
                  // 先把demo中的代码放到demo-block的之中，然后程序继续render fence，按照上面的fence规则渲染出代码部分，作为隐藏的查看代码。
                  return `<demo-block><div class="kv-demo">${content}</div>`
                }
                return '</demo-block>'
              }
            }
          ]
        ]
      })
    config.plugins.UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: true,
      parallel: true
    })
    config.plugins.ExtractTextPlugin({
      filename: path.posix.join('static', 'css/[name].[contenthash].css'),
      allChunks: true
    })
    config.plugins.OptimizeCSSPlugin({
      cssProcessorOptions: { safe: true, map: { inline: false }}
    })
    config.plugins.HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: './examples/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    })
    config.optimize.splitChunks({
      chunks: 'all',
      maxAsyncRequests: 10,
      maxInitialRequests: 20,
      name: true,
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial' // only package third parties that are initially dependent
        },
        vue: {
          name: 'chunk-vue',
          test: /[\\/]node_modules[\\/]_?vue(.*)/,
          priority: 30,
          chunks: 'initial'
        },
        elementUI: {
          name: 'chunk-elementUI', // split elementUI into a single package
          priority: 30, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          chunks: 'all'
        },
        lodash: {
          name: 'chunk-lodash',
          priority: 30,
          test: /[\\/]node_modules[\\/]_?lodash(.*)/,
          chunks: 'initial'
        },
        commons: {
          name: 'chunk-commons',
          test: path.resolve(__dirname, 'src/components'), // can customize your rules
          minChunks: 3, //  minimum common number
          priority: -20,
          reuseExistingChunk: true
        }
      }
    })
    config.optimization.runtimeChunk('single')
  }
}

module.exports = webpackConfig