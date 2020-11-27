<template>
  <div id="app">
    <div class="left-container">
      <el-menu router>
        <el-menu-item index="/my-vue-component/describe">介绍</el-menu-item>
        <el-submenu index="/my-vue-component/component">
          <template slot="title">
            <span slot="title">组件</span>
          </template>
          <el-menu-item-group>
            <span slot="title">分组一</span>
            <el-menu-item index="/my-vue-component/component/my-table">table 表格</el-menu-item>
            <el-menu-item index="/my-vue-component/component/my-anchor">anchor 锚点</el-menu-item>
            <el-menu-item index="/my-vue-component/component/my-drag">drag 拖拽</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div class="right-container">
      <router-view class="component-desc" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  padding: 20px 2%;
}
body {
  margin: 0;
}
</style>
<style scoped>
#app {
  display: flex;
}
.left-container {
  width: 200px;
}
.right-container {
  flex-grow: 1;
}
.component-desc {
  padding: 0 5%;
}
</style>
