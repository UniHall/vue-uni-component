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
          const disX = event.clientX - moveEl.offsetLeft
          const disY = event.clientY - moveEl.offsetTop
          document.onmousemove = (dEvent) => {
            console.info('*****', moveEl.offsetLeft)
            // 当拖动时，算出的值就刚好是方块的top和left值
            let x = dEvent.x - disX
            let y = dEvent.y - disY
            if (x < parentEl.offsetLeft) {
              x = parentEl.offsetLeft
            } else if (x > parentEl.offsetLeft + parentEl.offsetWidth - moveEl.offsetWidth) {
              x = parentEl.offsetLeft + parentEl.offsetWidth - moveEl.offsetWidth
            }
            if (y < parentEl.offsetTop) {
              y = parentEl.offsetLeft
            } else if (y > parentEl.offsetTop + parentEl.offsetHeight - moveEl.offsetHeight) {
              y = parentEl.offsetTop + parentEl.offsetHeight - moveEl.offsetHeight
            }
            moveEl.style.left = x + 'px'
            moveEl.style.top = y + 'px'
          }
          document.onmouseup = (e) => {
          // 当鼠标抬起时，我们要做的事
          // 通过点击位置和父级元素的偏移判断方块在哪个区域
            if (e.clientY - parentEl.offsetTop < 100 && e.clientX - parentEl.offsetLeft < 100) {
            // 将方块移动到该区域中
              vnode.context.changeBlock('head1', moveEl)
            } else if (e.clientY - parentEl.offsetTop > 100 && e.clientX - parentEl.offsetLeft < 100 && e.clientY - parentEl.offsetTop < 200) {
              this.changeBlock('main1', moveEl)
            } else if (e.clientY - parentEl.offsetTop > 200 && e.clientX - parentEl.offsetLeft < 100) {
              this.changeBlock('footer1', moveEl)
            } else if (e.clientY - parentEl.offsetTop < 100 && e.clientX - parentEl.offsetLeft > 100 && e.clientX - parentEl.offsetLeft < 200) {
              this.changeBlock('head2', moveEl)
            } else if (e.clientY - parentEl.offsetTop < 100 && e.clientX - parentEl.offsetLeft > 200) {
              this.changeBlock('head3', moveEl)
            } else if (e.clientY - parentEl.offsetTop > 100 && e.clientX - parentEl.offsetLeft > 200 && e.clientY - parentEl.offsetTop < 200) {
              this.changeBlock('main3', moveEl)
            } else if (e.clientY - parentEl.offsetTop > 200 && e.clientX - parentEl.offsetLeft > 200) {
              this.changeBlock('footer3', moveEl)
            } else if (e.clientY - parentEl.offsetTop > 200 && e.clientX - parentEl.offsetLeft > 100 && e.clientX - parentEl.offsetLeft < 200) {
              this.changeBlock('footer2', moveEl)
            } else {
              this.changeBlock('main2', moveEl)
            }
            document.onmousemove = null // 需要把事件监听取消
            document.onmousedown = null // 需要把事件监听取消
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
    rangeOfEl: function(moveEl, parentEl, dEvent, disX, disY) {
      let x = dEvent.x + disX
      let y = dEvent.y + disY
      if (x < parentEl.offsetLeft) {
        x = parentEl.offsetLeft
      } else if (x > parentEl.offsetLeft + parentEl.offsetWidth - moveEl.offsetWidth) {
        x = parentEl.offsetLeft + parentEl.offsetWidth - moveEl.offsetWidth
      }
      if (y < parentEl.offsetTop) {
        y = parentEl.offsetLeft
      } else if (y > parentEl.offsetTop + parentEl.offsetHeight - moveEl.offsetHeight) {
        y = parentEl.offsetTop + parentEl.offsetHeight - moveEl.offsetHeight
      }
      moveEl.style.left = x + 'px'
      moveEl.style.top = y + 'px'
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
    }
    .drag-item {
      padding: 50px;
      position: relative;
    }
  }
</style>
