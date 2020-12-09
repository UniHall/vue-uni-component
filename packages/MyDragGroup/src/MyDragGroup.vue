<template>
  <div ref="dragContainer" class="my-drag-group" :style="{ 'grid-template-areas': gridAreas }">
    <div v-for="(dragData, index) in dragList" :key="index" v-drag :style="{ 'grid-area': 'area-' + index }" class="drag-item" onselectstart="return false;">
      <slot :data="dragData">{{ dragData }}</slot>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'MyDragGroup',
  directives: {
    drag: {
      bind: function(el, binding, vnode) {
        const moveEl = el
        moveEl.onmousedown = (event) => {
          moveEl.style.boxShadow = '#e6e6e6 0 0 10px 10px'
          moveEl.style.zIndex = 100
          vnode.context.$emit('drag-start', event)
          const disX = event.clientX
          const disY = event.clientY
          document.onmousemove = (dEvent) => {
            let x = dEvent.clientX - disX
            let y = dEvent.clientY - disY
            const { minX, maxX, minY, maxY } = vnode.context.getRangeOfEl(moveEl)
            x = x < minX ? minX : (x > maxX ? maxX : x)
            y = y < minY ? minY : (y > maxY ? maxY : y)
            moveEl.style.left = x + 'px'
            moveEl.style.top = y + 'px'
          }
          document.onmouseup = (upEvent) => {
            document.onmousemove = null // 需要把事件监听取消
            document.onmouseup = null // 需要把事件监听取消
            moveEl.style.boxShadow = 'none'
            vnode.context.changeBlock(moveEl)
            vnode.context.$emit('drag-end', upEvent, vnode.context.dragList)
          }
        }
      }
    }
  },
  props: {
    // 拖拽列表数据
    dragDataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 列数
    column: {
      type: Number,
      default: 1
    },
    // 列宽
    columnWidth: {
      type: String,
      default: 'auto'
    },
    // 行高
    rowHeight: {
      type: String,
      default: 'auto'
    },
    // 拖拽类型：重排resort/替换replace
    type: {
      type: String,
      default: 'resort'
    }
  },
  data: function() {
    return {
      gridAreas: '',
      dragList: _.cloneDeep(this.dragDataList)
    }
  },
  mounted: function() {
    this.$refs.dragContainer.style.setProperty('--columnWidth', this.columnWidth)
    this.$refs.dragContainer.style.setProperty('--rowHeight', this.rowHeight)
    this.joinGridArea()
  },
  methods: {
    // grid style拼接
    joinGridArea: function() {
      const len = this.dragList.length
      let areaStr = ''
      for (let i = 0; i < len; i++) {
        if (i % this.column === 0) {
          areaStr += '"area-' + i + ' '
          if (this.column === 1) {
            areaStr += '"'
          }
        } else if (i % this.column === this.column - 1) {
          areaStr += 'area-' + i + '"'
        } else {
          areaStr += 'area-' + i + ' '
        }
      }
      if (len % this.column !== 0) {
        const emptyLength = this.column - (len % this.column)
        areaStr += new Array(emptyLength).fill('.').join(' ') + '"'
      }
      this.gridAreas = areaStr
    },
    // 计算当前元素可移动的区域
    getRangeOfEl: function(moveEl) {
      const index = parseInt(moveEl.style.gridArea.split(' / ')[0].split('-')[1])
      const res = {}
      const currentColummn = index % this.column
      res.minX = -((moveEl.offsetWidth + 5) * currentColummn)
      res.maxX = (this.column - currentColummn - 1) * (moveEl.offsetWidth + 5)
      const allRow = Math.ceil(this.dragList.length / this.column)
      const currentRow = Math.floor(index / this.column)
      res.minY = -((moveEl.offsetHeight + 5) * currentRow)
      res.maxY = (allRow - currentRow - 1) * (moveEl.offsetHeight + 5)
      return res
    },
    dynamicChangeArea: function(left, top, moveEl) {
      let { nowIndex, index } = this.getIndexOfMoveEL(moveEl)
      let oindex = 0
      let onowIndex = 0
      console.info(nowIndex, index)
      index = index + oindex
      nowIndex = nowIndex + onowIndex
      this.dragList.splice(index, 1)
      this.dragList.splice(nowIndex, 0, this.dragList[index])
      oindex = index + oindex
      onowIndex = nowIndex + onowIndex
    },
    getIndexOfMoveEL: function(moveEl) {
      const x = parseInt(moveEl.style.left.split('px')[0])
      const y = parseInt(moveEl.style.top.split('px')[0])
      const index = parseInt(moveEl.style.gridArea.split(' / ')[0].split('-')[1])
      let nowIndex = 0
      if (x < 0) {
        nowIndex = index - (Math.round(Math.abs(x) / moveEl.offsetWidth))
      } else {
        nowIndex = index + (Math.round(Math.abs(x) / moveEl.offsetWidth))
      }
      if (y < 0) {
        nowIndex = nowIndex - (Math.round(Math.abs(y) / moveEl.offsetHeight)) * this.column
      } else {
        nowIndex = nowIndex + (Math.round(Math.abs(y) / moveEl.offsetHeight)) * this.column
      }
      return { nowIndex, index }
    },
    // 拖拽结束时重排数据或者替换数据
    changeBlock: function(moveEl) { // 将方块移入到对应的区域中
      const { nowIndex, index } = this.getIndexOfMoveEL(moveEl)
      if (this.type === 'replace') {
        const temp = this.dragList[index]
        this.dragList[index] = this.dragList[nowIndex]
        this.dragList[nowIndex] = temp
      } else {
        this.dragList.splice(index, 1)
        this.dragList.splice(nowIndex, 0, this.dragDataList[index])
      }
      moveEl.style.left = 0
      moveEl.style.top = 0
      this.$emit('update:drag-data-list', _.cloneDeep(this.dragList))
    }
  }
}
</script>
<style lang="scss" scoped>
  .my-drag-group {
    --columnWidth: 'auto';
    --rowHeight: 'auto';
    display: grid;
    gap: 5px 5px;
    justify-content: center;
    align-content: center;
    width: fit-content;
    position: relative;
    .drag-item {
      position: relative;
      width: var(--columnWidth);
      height: var(--rowHeight);
      line-height: var(--rowHeight);
      text-align: center;
      user-select: none;
    }
  }
</style>
