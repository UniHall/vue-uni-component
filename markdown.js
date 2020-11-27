var hljs = require('highlight.js')

var cheerio = require('cheerio')
var markdown = require('markdown-it')
var componentIndex = 0
var path = require('path')
var renderHighlight = function(str, lang) {
  if (!(lang && hljs.getLanguage(lang))) {
    return ''
  }

  return hljs.highlight(lang, str, true).value
}

var renderMd = function(html, fileName) {
  var $ = cheerio.load(html, {
    decodeEntities: false,
    lowerCaseAttributeNames: false,
    lowerCaseTags: false
  })
  let componenetsString = ''
  let id = 0
  let styleStr = ''

  $('style').each((index, item) => {
    styleStr += $(item).html()
  })

  $('div.kv-demo').each((index, item) => {
    const componentName = `kv-demo${id}`
    const vueTeml = renderVueTemplate($(item).html(), componentName)

    $(item).replaceWith(`<template slot="source"><${componentName} /></template>`)

    componenetsString += `${JSON.stringify(componentName)}: ${vueTeml},`
    id++
  })

  const pageScript = `<script>
      export default {
        name: "component-doc${componentIndex}",
        components: {
          ${componenetsString}
        }
      }
    </script>`

  const htmlStr = $.html()
  var result = `<template> <div class="demo-${fileName}">${htmlStr}</div> </template> \n  ${pageScript} \n  <style lang="scss"  >${styleStr}</style>`

  return result
}

var renderVueTemplate = function(content, componentName) {
  const $ = cheerio.load(content, {
    decodeEntities: false
  })

  const $style = $('style')
  $style.remove()

  const $script = $('script')
  let componentOptionsStr = ''
  if ($script) {
    const execResult = /export[\s]+?default[\s]*?{([\s\S]*)}/.exec($script.html())
    componentOptionsStr = execResult ? execResult[1] : ''
  }

  $script.remove()

  const templateExecResult = /^\s*<template>([\s\S]*)<\/template>\s*$/.exec($.html())

  let templateStr = ''
  templateStr = templateExecResult ? templateExecResult[1] : $.html()

  const componentStr = `{template: \`<div class="${componentName}">${templateStr}</div>\`,${componentOptionsStr}}`
  return componentStr
}

var parser = markdown('default', {
  // 主要给markdown中不在demo::中的代码高亮
  highlight: renderHighlight
})
const ensureVPre = function(markdown) {
  if (markdown && markdown.renderer && markdown.renderer.rules) {
    const rules = ['code_inline', 'code_block', 'fence']
    const rendererRules = markdown.renderer.rules
    rules.forEach(function(rule) {
      if (typeof rendererRules[rule] === 'function') {
        const saved = rendererRules[rule]
        rendererRules[rule] = function() {
          return saved.apply(this, arguments).replace(/(<pre|<code)/g, '$1 v-pre')
        }
      }
    })
  }
}
ensureVPre(parser)

const defaultRender = parser.renderer.rules.fence
parser.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  // 判断该 fence 是否在 :::demo 内
  const prevToken = tokens[idx - 1]
  const isInDemoContainer = prevToken && prevToken.nesting === 1 && prevToken.info.trim().match(/^demo\s*(.*)$/)
  if (token.info === 'html' && isInDemoContainer) {
    return `<template slot="highlight">
					${defaultRender(tokens, idx, options, env, self)}
				</template>`
  }

  return `<div class="code-common">${defaultRender(tokens, idx, options, env, self)}</div>`
}

// 给table增加样式
parser.renderer.rules.table_open = function() {
  return '<table class="md-table">'
}

// ```code`` 给这种样式加个class code_inline
const code_inline = parser.renderer.rules.code_inline
parser.renderer.rules.code_inline = function(...args) {
  args[0][args[1]].attrJoin('class', 'code_inline')
  return code_inline(...args)
}

parser.use(require('markdown-it-container'), 'demo', {
  validate(params) {
    return params.trim().match(/^demo\s*(.*)$/)
  },
  // 把demo代码放到div.kv-demo里面
  render(tokens, idx) {
    const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
    if (tokens[idx].nesting === 1) {
      const content = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : ''
      // 先把demo中的代码放到demo-block的之中，然后程序继续render fence，按照上面的fence规则渲染出代码部分，作为隐藏的查看代码。
      return `<demo-block><div  class="kv-demo">${content}</div>`
    }
    return '</demo-block>'
  }
})

const slugify = require('transliteration').slugify
parser.use(require('markdown-it-anchor'), {
  level: 2, // 添加超链接锚点的最小标题级别, 如: #标题 不会添加锚点
  slugify: slugify, // 自定义slugify, 我们使用的是将中文转为汉语拼音,最终生成为标题id属性
  permalink: true, // 开启标题锚点功能
  permalinkBefore: true // 在标题前创建锚点
})

parser.use(require('markdown-it-container'), 'tip')
parser.use(require('markdown-it-container'), 'warning')

module.exports = function(source) {
  this.cacheable && this.cacheable()
  const { resourcePath = '' } = this
  const fileName = path.basename(resourcePath, '.md')
  // @符号在markdown中是特殊符号
  source = source.replace(/@/g, '__at__')

  var content = parser.render(source).replace(/__at__/g, '@')

  var result = renderMd(content, fileName)
  return result
}
