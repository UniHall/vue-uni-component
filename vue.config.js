const fs = require('fs')
const path = require('path')

function resolve(dir) {
  return path.resolve(__dirname, dir)
}
const join = path.join
function getEntries(path) {
  const files = fs.readdirSync(resolve(path))
  const entries = files.reduce((ret, item) => {
    const itemPath = join(path, item)
    const isDir = fs.statSync(itemPath).isDirectory()
    if (isDir) {
      if (fs.existsSync(join(itemPath, 'index.js'))) {
        ret[item] = resolve(join(itemPath, 'index.js'))
      }
    } else {
      const [name] = item.split('.')
      ret[name] = resolve(`${itemPath}`)
    }
    return ret
  }, {})
  return entries
}
// const md = require('markdown-it')()
// const slugify = require('transliteration').slugify
const devConfig = {
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('packages'),
        '~': resolve('examples'),
        'assets': resolve('examples/assets'),
        'views': resolve('examples/views')
      }
    }
  },
  runtimeCompiler: true,
  devServer: {
    port: 8084,
    hot: true,
    open: 'Google Chrome'
  },
  chainWebpack: config => {
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('./markdown.js')
      // .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true,
        preventExtract: true // 这个加载器将自动从html令牌内容中提取脚本和样式标签
        //   // 定义处理规则
        //   preprocess: (MarkdownIt, source) => {
        //     // 对于markdown中的table,
        //     MarkdownIt.renderer.rules.table_open = function() {
        //       return '<table class="md-table">'
        //     }
        //     // 对于代码块去除v - pre, 添加高亮样式;
        //     const defaultRender = md.renderer.rules.fence
        //     MarkdownIt.renderer.rules.fence = (tokens, idx, options, env, self) => {
        //       const token = tokens[idx]
        //       // 判断该 fence 是否在 :::demo 内
        //       const prevToken = tokens[idx - 1]
        //       const isInDemoContainer = prevToken && prevToken.nesting === 1 && prevToken.info.trim().match(/^demo\s*(.*)$/)
        //       if (token.info === 'html' && isInDemoContainer) {
        //         return `<template slot="highlight">
        //               ${defaultRender(tokens, idx, options, env, self)}
        //             </template>`
        //       }
        //       return `<div class="code-common">${defaultRender(tokens, idx, options, env, self)}</div>`
        //     }
        //     const code_inline = md.renderer.rules.code_inline
        //     MarkdownIt.renderer.rules.code_inline = function(...args) {
        //       args[0][args[1]].attrJoin('class', 'code_inline')
        //       return code_inline(...args)
        //     }
        //     return source
        //   },
        // use: [
        // 标题锚点
        // [
        //   require('markdown-it-anchor'),
        //   {
        //     level: 2, // 添加超链接锚点的最小标题级别, 如: #标题 不会添加锚点
        //     slugify: slugify, // 自定义slugify, 我们使用的是将中文转为汉语拼音,最终生成为标题id属性
        //     permalink: true, // 开启标题锚点功能
        //     permalinkBefore: true // 在标题前创建锚点
        //   }
        // ],
        // [require('markdown-it-container'), 'tip'],
        // [require('markdown-it-container'), 'warning']
        // ]
      })
    config.module
      .rule('js')
      .include.add(resolve('packages'))
      .end()
      .include.add(resolve('examples'))
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        return options
      })
  }
}

const buildConfig = {
  outputDir: 'lib',
  productionSourceMap: false,
  css: {
    sourceMap: true,
    extract: {
      filename: 'style/[name].css'
    }
  },
  configureWebpack: {
    entry: {
      ...getEntries('packages')
    },
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2'
    },
    resolve: {
      alias: {
        '@': resolve('packages'),
        'assets': resolve('examples/assets'),
        'views': resolve('examples/views')
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('js')
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        return options
      })
      .end()

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
    config.optimization.delete('splitChunks')
    config.plugins.delete('copy')
    config.plugins.delete('html')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.plugins.delete('hmr')
    config.entryPoints.delete('app')
  }
}
module.exports = process.env.NODE_ENV === 'development' ? devConfig : (process.argv[2] === 'examples' ? require('./doc.config') : buildConfig)
