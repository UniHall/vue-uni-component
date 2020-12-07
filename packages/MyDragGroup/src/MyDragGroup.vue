<template>
  <div class="container">
    <div ref="dragContainer" class="my-drag-group" :style="{ 'grid-template-areas': gridAreas }">
      <div v-for="(dragData, index) in dragDataList" :key="index" v-drag :style="{ 'grid-area': 'area-' + index }" class="drag-item" onselectstart="return false;">
        {{ dragData }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MyDragGroup',
  directives: {
    drag: {
      bind: function(el, binding, vnode) {
        const moveEl = el
        moveEl.onmousedown = (event) => {
          const parentEl = event.path[1]
          moveEl.style.backgroundColor = 'red'
          vnode.context.$emit('drag-start', event)
          console.info('parentEl', parentEl)
          debugger
          const disX = event.offsetX
          const disY = event.offsetY
          console.info('*****', disX, disY)
          document.onmousemove = (dEvent) => {
            // 当拖动时，算出的值就刚好是方块的top和left值
            let x = dEvent.offsetX - disX
            let y = dEvent.offsetY - disY
            console.info('-----', dEvent.offsetX, dEvent.offsetY)
            if (x < 0) {
              x = 0
            } else if (x > parentEl.offsetWidth - moveEl.offsetWidth) {
              x = parentEl.offsetWidth - moveEl.offsetWidth
            }
            if (y < 0) {
              y = 0
            } else if (y > parentEl.offsetHeight - moveEl.offsetHeight) {
              y = parentEl.offsetHeight - moveEl.offsetHeight
            }
            moveEl.style.left = x + 'px'
            moveEl.style.top = y + 'px'
          }
          document.onmouseup = (e) => {
            document.onmousemove = null // 需要把事件监听取消
            document.onmouseup = null // 需要把事件监听取消
            // const box = moveEl.getBoundingClientRect()
            // 当鼠标up时判断当前元素位置是否满足隐藏条件
            // let x = box.x
            // let y = box.y
            // if (x < 0) {
            //   x = 0
            // } else if (x > parentEl.offsetWidth - moveEl.offsetWidth) {
            //   x = parentEl.offsetWidth - moveEl.offsetWidth
            // }
            // if (y < 0) {
            //   y = 0
            // } else if (y > parentEl.offsetHeight - moveEl.offsetHeight) {
            //   y = parentEl.offsetHeight - moveEl.offsetHeight
            // }
          }
        }
      }
    }
  },
  props: {
    dragDataList: {
      type: Array,
      default: () => {
        return ['1', '2', '3', '4', '5']
      }
    },
    column: {
      type: Number,
      default: 1
    }
  },
  data: function() {
    return {
      gridAreas: ''
    }
  },
  mounted: function() {
    this.$refs.dragContainer.style.setProperty('--columnLength', this.column)
    this.$refs.dragContainer.style.setProperty('--rowLength', Math.ceil(this.dragDataList.length / this.column))
    this.joinGridArea()
  },
  methods: {
    joinGridArea: function() {
      const len = this.dragDataList.length
      let areaStr = ''
      for (let i = 0; i < len; i++) {
        if (i % this.column === 0) {
          areaStr += '"area-' + i + ' '
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
    changeBlock: function(blockName, moveEl) { // 将方块移入到对应的区域中
      this.positionX = 0
      this.positionY = 0
      moveEl.style.gridArea = blockName
    }
  }
}
</script>
<style lang="scss" scoped>
  .container {
    // --columnLength: 3;
    .my-drag-group {
      display: grid;
      // grid-template-columns: repeat(var(--columnLength), 1fr);
      gap: 5px 5px;
      justify-content: center;
      align-content: center;
      width: fit-content;
    }
    .drag-item {
      padding: 50px;
      position: relative;
    }
  }
</style>
