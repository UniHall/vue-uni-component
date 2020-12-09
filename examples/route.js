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
  redirect: '/my-vue-component/describe',
  component: HomePage
}, {
  path: '/my-vue-component/describe',
  component: HomePage
}, {
  path: '/my-vue-component/component/uni-table',
  component: UniTable,
  name: 'UniTable'
}, {
  path: '/my-vue-component/component/uni-anchor',
  component: UniAnchor,
  name: 'UniAnchor'
}, {
  path: '/my-vue-component/component/uni-drag',
  component: UniDrag,
  name: 'UniDrag'
}, {
  path: '/my-vue-component/component/uni-drag-group',
  component: UniDragGroup,
  name: 'UniDragGroup'
}]
const router = new VueRouter({
  routes,
  mode: 'history'
})
export default router
