<template>
  <div v-drag onselectstart="return false;" class="drag-inner" :style="{top: initTop, left: initLeft}">
    <slot />
  </div>
</template>
<script>
export default {
  name: 'UniDrag',
  directives: {
    drag: {
      bind: function(el, binding, vnode) {
        const moveEl = el
        moveEl.onmousedown = (event) => {
          // 获取事件触发位置与元素左上角的偏移量
          const disX = event.clientX - moveEl.offsetLeft
          const disY = event.clientY - moveEl.offsetTop
          // 页面的宽度和高度
          const width = document.documentElement.clientWidth
          const height = document.documentElement.clientHeight
          // 触发拖拽开始事件
          vnode.context.$emit('drag-start', event)
          document.onmousemove = (dEvent) => {
            // 鼠标移动时，将元素定位到鼠标移动的位置，减去鼠标与元素左上角的偏移量
            const left = dEvent.clientX - disX
            const top = dEvent.clientY - disY
            moveEl.style.left = left + 'px'
            moveEl.style.top = top + 'px'
          }
          document.onmouseup = (event) => {
            document.onmousemove = null
            document.onmouseup = null
            const box = moveEl.getBoundingClientRect()
            // 当鼠标up时判断当前元素位置是否满足隐藏条件
            let left = box.x
            let top = box.y
            if (vnode.context.hide) {
              left = left > width - moveEl.offsetWidth - vnode.context.hideMinMargin ? width - vnode.context.minShowWidth
                : left < -(moveEl.offsetWidth - vnode.context.minShowWidth) || left < vnode.context.hideMinMargin ? -(moveEl.offsetWidth - vnode.context.minShowWidth) : left
              // 在4个角落时，防止x和y轴同时隐藏，判断x轴隐藏了，y轴便固定为0，或着最底部
              top = left === width - vnode.context.minShowWidth || left === -(moveEl.offsetWidth - vnode.context.minShowWidth) ? (top < vnode.context.hideMinMargin ? 0
                : box.bottom > height - vnode.context.hideMinMargin ? height - box.height : top)
                : top < vnode.context.hideMinMargin ? -(box.height - vnode.context.minShowWidth)
                  : box.bottom > height - vnode.context.hideMinMargin ? height - vnode.context.minShowWidth : top
            }
            moveEl.style.left = left + 'px'
            moveEl.style.top = top + 'px'
            // 触发拖拽结束事件
            vnode.context.$emit('drag-end', event)
          }
        }
      }
    }
  },
  props: {
    // 拖拽组件默认距离页面顶部高度， 默认50vh
    initTop: {
      type: String,
      default: '50vh'
    },
    // 拖拽组件默认距离页面左侧的距离， 默认0
    initLeft: {
      type: String,
      default: '0'
    },
    // 隐藏时展示的像素宽度
    minShowWidth: {
      type: Number,
      default: 20
    },
    // 距离边框多少像素时可以隐藏
    hideMinMargin: {
      type: Number,
      default: 0
    },
    // 是否开启自动隐藏
    hide: {
      type: Boolean,
      default: true
    }
  },
  mounted: function() {
    window.addEventListener('resize', this.windowResize)
    window.addEventListener('scroll', this.resizeDragContainer)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.windowResize) // 通过有名函数 解除事件订阅
    window.removeEventListener('scroll', this.resizeDragContainer)
  },
  methods: {
    windowResize: function() {
      // 当窗口被重新定义大小时重新设置父元素的大小
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => { // 只执行最后一个定时器的 结果
        this.resizeContainer()
      }, 300) // 推迟 300 ms 在执行resize 效果
    },
    resizeDragContainer: function() {
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => { // 只执行最后一个定时器的 结果
        this.resizeContainer()
      }, 300)
    },
    resizeContainer: function() {
      if (document.querySelector('.drag-inner').getBoundingClientRect().x > document.documentElement.clientWidth - this.hideMinMargin) {
        // 当前元素的x坐标比需要隐藏的x坐标大时，隐藏drag组件
        document.querySelector('.drag-inner').style.left = document.documentElement.clientWidth - this.minShowWidth + 'px'
      }
      if (document.querySelector('.drag-inner').getBoundingClientRect().bottom > document.documentElement.clientHeight - this.hideMinMargin) {
        // 如果当前元素的y坐标大于需要隐藏的y坐标时，隐藏drag组件
        document.querySelector('.drag-inner').style.top = document.documentElement.clientHeight - this.minShowWidth + 'px'
      }
    }
  }
}
</script>
<style scoped>
.uni-drag {
  position: absolute;
  overflow: hidden;
  z-index: 100;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  user-select: none;
}
.drag-inner {
  position: fixed;
}
</style>
