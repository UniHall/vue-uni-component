import './assets/markdown.scss'
import Vue from 'vue'
import App from './App.vue'
import modules from '../packages'
import VueRouter from 'vue-router'
import routes from './route'
import demoBlock from './components/demo-block.vue'
Vue.use(VueRouter)
const router = new VueRouter({
  routes
})

Vue.component('demo-block', demoBlock)
Vue.use(modules)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
