'use strict'
const path = require('path')
function resolve(dir) {
  return path.resolve(__dirname, dir)
}

// 判断参数是打包examples,设置output出口为dist
const docConfig = {
  publicPath: '/dist',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: 'all'
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('packages'),
        'assets': resolve('examples/assets'),
        'views': resolve('examples/views')
      }
    }
  },
  runtimeCompiler: true,
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
    config.module
      .rule('js')
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        return options
      })
      .end()
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('./markdown.js')
      .options({
        raw: true,
        preventExtract: true // 这个加载器将自动从html令牌内容中提取脚本和样式标签
      })
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .optimization.splitChunks({
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
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}

module.exports = docConfig
