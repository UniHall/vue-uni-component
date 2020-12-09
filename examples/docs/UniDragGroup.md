## UniDrag 拖拽组件使用说明
### 普通拖拽
::: demo
```html
<template>
  <uni-drag-group :column="3" :drag-data-list.sync="dragDataList" @drag-start="dragStart" @drag-end="dragEnd">
    <template v-slot:default="dragData"><div class="drag-data-div" >这是{{ dragData.data }}数据</div></template>
  </uni-drag-group>
</template>
<script>
export default {
  data: function() {
    return {
      dragDataList: ['1', '2', '3', '4', '5', '6']
    }
  },
  methods: {
    dragStart: function(event) {
      this.$message({
        type: 'info',
        message: `拖拽开始，通过console可以查看event参数, ${JSON.stringify(event)}`
      })
      console.info('拖拽开始', event)
    },
    dragEnd: function(event, dragList) {
      this.$message({
        type: 'info',
        message: `拖拽结束，通过console可以查看event参数, ${JSON.stringify(event)}, ${dragList}`
      })
      console.info('拖拽结束', event, dragList)
    }
  }
}
</script>
<style scoped>
.drag-data-div {
  background-color: green;
  color: #FFFFFF;
  width: 100px;
  height: 100px;
  line-height: 100px;
}
</style>
```
:::

### dragGroup 属性
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| dragDataList | 拖拽组件数据列表，支持.sync修饰符 | Array | —— | [] |
| column | 数据分几列展示 | Number | —— | 1 |
| columnWidth | 列宽 | String | —— | —— |
| rowHeight | 行高 | String | —— | —— |
| type | 拖拽类型：重排resort/替换replace | String | resort/replace | resort |

### dragGroup 插槽
作用域插槽
| 名称 | 说明 |
| ---- | ---- |
| default | 数据展示插槽，默认为直接展示数据 |

### dragGroup 事件
| 事件名 | 说明 | 参数 | 返回值 |
| ---- | ---- | ---- | ---- |
| drag-start | 拖拽开始事件，参数为鼠标down事件 | event | —— |
| drag-end | 拖拽结束事件，参数为鼠标up事件, 以及当前拖拽数据列表 | event, dragList | —— |

