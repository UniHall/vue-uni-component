import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
Vue.use(ElementUI, { size: 'small' })

import MyTable from '@/MyTable'
import MyAnchor from '@/MyAnchor'
import MyDrag from '@/MyDrag'
import MyDragGroup from '@/MyDragGroup'
import './style/common.scss'

const components = [
  MyTable,
  MyAnchor,
  MyDrag,
  MyDragGroup
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
  MyTable,
  MyAnchor,
  MyDrag,
  MyDragGroup
}
export default {
  install,
  ...components
}
