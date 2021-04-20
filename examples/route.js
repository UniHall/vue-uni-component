import VueRouter from 'vue-router'
import Vue from 'vue'
import HomePage from './docs/README.md'
import UniTable from './docs/UniTable.md'
import UniAnchor from './docs/UniAnchor.md'
import UniDrag from './docs/UniDrag.md'
import UniDragGroup from './docs/UniDragGroup.md'

Vue.use(VueRouter)
const routes = [{
  path: '/',
  redirect: '/describe',
  component: HomePage
}, {
  path: '/describe',
  component: HomePage
}, {
  path: '/component/uni-table',
  component: UniTable,
  name: 'UniTable'
}, {
  path: '/component/uni-anchor',
  component: UniAnchor,
  name: 'UniAnchor'
}, {
  path: '/component/uni-drag',
  component: UniDrag,
  name: 'UniDrag'
}, {
  path: '/component/uni-drag-group',
  component: UniDragGroup,
  name: 'UniDragGroup'
}]
const router = new VueRouter({
  routes,
  base: '/my-vue-component',
  mode: 'history'
})
export default router
