import MyTable from './src/MyTable.vue'
MyTable.install = function(Vue) {
  Vue.component(MyTable.name, MyTable)
}
export default MyTable
