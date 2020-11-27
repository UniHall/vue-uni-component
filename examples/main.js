import './assets/markdown.scss'
import Vue from 'vue'
import App from './App.vue'
import modules from '../packages'

import router from './route'
import demoBlock from './components/demo-block.vue'

Vue.component('demo-block', demoBlock)
Vue.use(modules)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
