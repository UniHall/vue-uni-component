import VueRouter from 'vue-router'
import Vue from 'vue'
import HomePage from './docs/README.md'
import MyTable from './docs/MyTable.md'
import MyAnchor from './docs/MyAnchor.md'
import MyDrag from './docs/MyDrag.md'
import MyDragGroup from './docs/MyDragGroup.md'

Vue.use(VueRouter)
const routes = [{
  path: '/',
  redirect: '/my-vue-component/describe',
  component: HomePage
}, {
  path: '/my-vue-component/describe',
  component: HomePage
}, {
  path: '/my-vue-component/component/my-table',
  component: MyTable,
  name: 'MyTable'
}, {
  path: '/my-vue-component/component/my-anchor',
  component: MyAnchor,
  name: 'MyAnchor'
}, {
  path: '/my-vue-component/component/my-drag',
  component: MyDrag,
  name: 'MyDrag'
}, {
  path: '/my-vue-component/component/my-drag-group',
  component: MyDragGroup,
  name: 'MyDragGroup'
}]
const router = new VueRouter({
  routes,
  mode: 'history'
})
export default router
