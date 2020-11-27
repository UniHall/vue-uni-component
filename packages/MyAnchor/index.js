import MyAnchor from './src/MyAnchor.vue'
MyAnchor.install = function(Vue) {
  Vue.component(MyAnchor.name, MyAnchor)
}
export default MyAnchor
