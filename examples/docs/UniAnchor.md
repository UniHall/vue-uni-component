## UniAnchor 锚点组件使用说明
### 仅有返回顶部的anchor
::: tip
仅有返回顶部的anchor，则会只有一个返回顶部按钮
:::
::: demo
```html
<template>
  <uni-anchor position="bottom" />
</template>
```
:::
### 普通anchor
::: tip
您可以配置是否开启动态锚点。

使用锚点请注意务必在页面上存在对应id的dom元素才可以使锚点生效。

动态锚点为滚动页面可以自动高亮相应的锚点；非动态锚点则表现为页面滚动时保留之前锚点列表的高亮，不会动态变化高亮。
:::
::: demo
```html
<template>
  <div>
    <uni-anchor :anchor-list="anchorList" >
      <template v-slot:backTopAnchorSlot>
        <span>UP</span>
      </template>
    </uni-anchor>
  </div>
</template>
<script>
  export default {
    data: function() {
      return {
        anchorList: [{
          id: 'jin-you-fan-hui-ding-bu-de-anchor',
          name: '仅有返回顶部的锚点',
          shortName: '一毛'
        }, {
          id: 'pu-tong-anchor',
          name: '普通anchor',
          shortName: '二毛'
        }]
      }
    }
  }
</script>
```
:::

### 自定义返回顶部按钮
::: tip
在仅有返回顶部按钮时，可以自定义返回顶部按钮的样式
:::
::: demo
```html
<template>
  <uni-anchor>
    <div class="top-cus">UP</div>
  </uni-anchor>
</template>
<style scoped>
.top-cus {
  padding: 20px 15px;
  color: #1891FF;
  background-color: #f0edf0;
  position: fixed;
  top: 10%;
  right: 0;
  cursor: pointer;
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