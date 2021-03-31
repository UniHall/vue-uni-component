const fs = require('fs')
const path = require('path')

function resolve(dir) {
  return path.resolve(__dirname, dir)
}
function capitalize(str) {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}
const join = path.join
function getEntries(path) {
  const files = fs.readdirSync(resolve(path))
  const entries = files.reduce((ret, item) => {
    const itemPath = join(path, item)
    const isDir = fs.statSync(itemPath).isDirectory()
    if (isDir) {
      if (fs.existsSync(join(itemPath, 'index.js'))) {
        item = capitalize(item)
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
    port: 8089,
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
      .options({
        raw: true,
        preventExtract: true // 这个加载器将自动从html令牌内容中提取脚本和样式标签
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

module.exports = process.env.NODE_ENV === 'development' ? devConfig : (process.argv[3] === 'examples' ? require('./doc.config') : buildConfig)
