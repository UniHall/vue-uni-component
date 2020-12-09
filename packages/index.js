import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
Vue.use(ElementUI, { size: 'small' })

import UniTable from '@/UniTable'
import UniAnchor from '@/UniAnchor'
import UniDrag from '@/UniDrag'
import UniDragGroup from '@/UniDragGroup'
import './style/common.scss'

const components = [
  UniTable,
  UniAnchor,
  UniDrag,
  UniDragGroup
]
const install = function(Vue) {
  if (install.installed) return
  components.map(component => Vue.component(component.name, component))
}

if (typeof window !== 'undefined' && window.Vue) {
  install(Vue)
}
export {
  install,
  UniTable,
  UniAnchor,
  UniDrag,
  UniDragGroup
}
export default {
  install,
  ...components
}
