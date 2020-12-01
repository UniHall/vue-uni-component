## MyDrag 拖拽组件使用说明
### 普通拖拽
::: demo
```html
<template>
  <my-drag-group :column="3" />
</template>
<script>
export default {
  methods: {
    dragStart: function(event) {
      this.$message({
        type: 'info',
        message: `拖拽开始，通过console可以查看event参数, ${JSON.stringify(event)}`
      })
      console.info('拖拽开始', event)
    },
    dragEnd: function(event) {
      this.$message({
        type: 'info',
        message: `拖拽结束，通过console可以查看event参数, ${JSON.stringify(event)}`
      })
      console.info('拖拽结束', event)
    }
  }
}
</script>
<style scoped>
.test-drag {
  padding: 50px;
  background-color: #149ef1;
  width: 50px;
}
</style>
```
:::

### anchor 属性
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| initTop | 拖拽组件默认距离页面顶部高度 | String | —— | 50vh |
| initLeft | 拖拽组件默认距离页面左侧的距离 | String | —— | 0 |
| minShowWidth | 隐藏时展示的像素宽度 | Number | —— | 20 |
| hideMinMargin | 距离边框多少像素时可以隐藏 | Number | —— | 0 |
| hide | 是否自动隐藏 | Boolean | —— | true |
