<template>
  <div class="container">
    <div ref="dragContainer" class="my-drag-group" :style="{ 'grid-template-areas': gridAreas }">
      <div v-for="(dragData, index) in dragDataList" :key="index" :style="{ 'grid-area': 'area-' + index }" class="drag-item" onselectstart="return false;" @mousedown="dragStart">
        {{ dragData }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MyDragGroup',
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
    dragStart: function(event) {
      const moveEl = event.target
      const parentEl = event.path[1]
      moveEl.style.backgroundColor = 'red'
      this.$emit('drag-start', event)
      console.info('parentEl', parentEl)
      debugger
      document.onmousemove = (dEvent) => {
        // 当拖动时，算出的值就刚好是方块的top和left值
        const left = dEvent.clientX - event.clientX
        const top = dEvent.clientY - event.clientY
        switch (moveEl.style.gridArea) {
          case 'head1 / head1 / head1 / head1':this.rangeOfHead1(left, top, moveEl); break // 实现head1的移动范围
          case 'head2 / head2 / head2 / head2':this.rangeOfHead2(left, top, moveEl); break // 实现head2的移动范围
          case 'head3 / head3 / head3 / head3':this.rangeOfHead3(left, top, moveEl); break // 实现head3的移动范围
          case 'main1 / main1 / main1 / main1':this.rangeOfMain1(left, top, moveEl); break // 实现main1的移动范围
        }
      }
      document.onmouseup = (e) => {
        // 当鼠标抬起时，我们要做的事
        // 通过点击位置和父级元素的偏移判断方块在哪个区域
        if (e.clientY - parentEl.offsetTop < 100 && e.clientX - parentEl.offsetLeft < 100) {
          // 将方块移动到该区域中
          this.changeBlock('head1', moveEl)
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
    },
    rangeOfHead1(x, y, moveEl) { // 判断head1格子中的可以移动范围
      if (x >= 200) {
        x = 200
      } else if (x <= 0) {
        x = 0
      }
      if (y >= 200) {
        y = 200
      } else if (y <= 0) {
        y = 0
      }
      moveEl.style.left = x + 'px'
      moveEl.style.top = y + 'px'
      this.positionX = x
      this.positionY = y
    },
    rangeOfHead2(x, y, moveEl) { // 判断head2格子中的可以移动范围
      if (x >= 100) {
        x = 100
      } else if (x <= -100) {
        x = -100
      }
      if (y >= 200) {
        y = 200
      } else if (y <= 0) {
        y = 0
      }
      moveEl.style.left = x + 'px'
      moveEl.style.top = y + 'px'

      this.positionX = x
      this.positionY = y
    },
    changeBlock(blockName, moveEl) { // 将方块移入到对应的区域中
      this.positionX = 0
      this.positionY = 0
      moveEl.style.gridArea = blockName
    }
  }
}
</script>
<style lang="scss" scoped>
  .container {
    --columnLength: 3;
    --rowLength: 1;
    .my-drag-group {
      display: grid;
      grid-template-columns: repeat(var(--columnLength), 1fr);
      gap: 5px 5px;
      justify-content: center;
      align-content: center;
    }
    .drag-item {
      padding: 50px;
    }
  }
</style>
