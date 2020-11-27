<template>
  <div onselectstart="return false;" class="my-drag" :style="{height: initHeight, width: initWidth}">
    <div v-drag class="drag-inner" :style="{top: initTop, left: initLeft}">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'MyDrag',
  directives: {
    drag: {
      bind: function(el, binding, vnode) {
        const moveEl = el
        let width = document.documentElement.clientWidth > document.body.offsetWidth ? document.documentElement.clientWidth : document.body.offsetWidth
        let height = document.documentElement.clientHeight > document.body.offsetHeight ? document.documentElement.clientHeight : document.body.offsetHeight
        window.onresize = () => {
          height = document.body.offsetHeight
          width = document.body.offsetWidth + window.scrollX === width ? width : document.body.offsetWidth + window.scrollX
          vnode.context.initHeight = height + 'px'
          vnode.context.initWidth = width + 'px'
          if (moveEl.getBoundingClientRect().x > document.documentElement.clientWidth) {
            moveEl.style.left = width - 20 + 'px'
          }
          if (height < moveEl.getBoundingClientRect().bottom + window.scrollY) {
            moveEl.style.top = height - 20 + 'px'
          }
        }
        moveEl.onmousedown = (event) => {
          const disX = event.clientX - moveEl.offsetLeft
          const disY = event.clientY - moveEl.offsetTop
          vnode.context.$emit('drag-start', event)
          document.onmousemove = (dEvent) => {
            height = document.body.offsetHeight === height ? height : document.body.offsetHeight
            width = document.body.offsetWidth + window.scrollX === width ? width : document.body.offsetWidth + window.scrollX
            const left = dEvent.clientX - disX
            const top = dEvent.clientY - disY
            moveEl.style.left = left + 'px'
            moveEl.style.top = top + 'px'
          }
          document.onmouseup = (event) => {
            document.onmousemove = null
            document.onmouseup = null
            const box = moveEl.getBoundingClientRect()
            let left = window.scrollX + box.x
            let top = window.scrollY + box.y
            left = left > width - moveEl.offsetWidth ? width - 20
              : left < -(moveEl.offsetWidth - 20) || left < 0 ? -(moveEl.offsetWidth - 20) : left
            top = left === width - 20 || left === -(moveEl.offsetWidth - 20) ? (top < 0 ? 0
              : top > height - moveEl.offsetHeight ? height - moveEl.offsetHeight : top)
              : top < -(moveEl.offsetHeight - 20) || top < 0 ? -(moveEl.offsetHeight - 20)
                : top > height - moveEl.offsetHeight ? height - 20 : top
            moveEl.style.left = left + 'px'
            moveEl.style.top = top + 'px'
            vnode.context.$emit('drag-end', event)
          }
        }
      }
    }
  },
  props: {
    initTop: {
      type: String,
      default: '20%'
    },
    initLeft: {
      type: String,
      default: 'calc(100% - 150px)'
    }
  },
  data: function() {
    return {
      initHeight: '100vh',
      initWidth: '100%'
    }
  },
  mounted: function() {
    this.initHeight = document.body.offsetHeight + 'px'
    this.initWidth = document.body.offsetWidth + 'px'
  }
}
</script>
<style scoped>
.my-drag {
  position: absolute;
  overflow: hidden;
  z-index: 100;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.drag-inner {
  position: absolute;
}
</style>
