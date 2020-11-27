## MyDrag 拖拽组件使用说明
### 普通拖拽
::: demo
```html
<template>
  <my-drag @drag-start="dragStart" @drag-end="dragEnd">
    <div class="test-drag">dragMe</div>
  </my-drag>
</template>
<script>
export default {
  methods: {
    dragStart: function(event) {
      console.info('drag-start', event)
    },
    dragEnd: function(event) {
      console.info('drag-end', event)
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
| anchorList | 锚点列表，无需添加返回顶部锚点，开启返回顶部配置，会自动渲染。详细属性见下方anchorList 属性 | Array | —— | —— |
| position | 锚点列表位置，top：页面右上角，middle：页面右侧中间，bottom：页面右下角 | String | top/middle/bottom | middle |
| dynamicAnchor | 是否展示为动态锚点，页面滚动自动定位锚点 | Boolean | —— | true |
| stepShow | 锚点定位时是否分步滑动到页面中 | Boolean | —— | false |
| stepHeight | 分步滑动时，每步步长，单位px | Number | —— | 150 |
| offset | 页面定位锚点的位置相对于页面顶部的偏移量；默认会将锚点位置定位到页面顶部，若想要定位到距离页面顶部一定距离，可以设置此值。单位px | Number | —— | 0 |
| opacity | 锚点列表是否透明展示 | Boolean | —— | true |
| openBackTop | 是否展示返回顶部按钮 | Boolean | —— | true |

### anchorList 属性
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| id | 锚点的id属性，需要在页面上有对应id属性的dom元素 | String | —— | —— |
| name | 锚点名称，默认展示的名称 | String | —— | —— |
| shortName | 锚点收起时展示的名称 | String | —— | —— |