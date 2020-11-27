<template>
  <div onselectstart="return false;" class="my-drag">
    <div v-drag class="drag-inner" :style="{top: initTop, left: initLeft}">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'MyDrag',
  props: {
    initTop: {
      type: String,
      default: '50%'
    },
    initLeft: {
      type: String,
      default: 'calc(100% - 150px)'
    }
  },
  directives: {
    drag: {
      bind: function(el, binding, vnode) {
        const moveEl = el
        moveEl.onmousedown = (event) => {
          const disX = event.clientX - moveEl.offsetLeft
          const disY = event.clientY - moveEl.offsetTop
          vnode.context.$emit('drag-start', event)
          const innerContainer = document.querySelector('.drag-inner')
          document.onmousemove = (dEvent) => {
            const left = dEvent.clientX - disX
            const top = dEvent.clientY - disY
            moveEl.style.left = left + 'px'
            moveEl.style.top = top + 'px'
          }
          document.onmouseup = (event) => {
            document.onmousemove = null
            document.onmouseup = null
            let left = event.clientX
            let top = event.clientY
            console.info(left, innerContainer.offsetWidth - 20, top, document.documentElement.clientHeight - 20)
            left = left > document.documentElement.clientWidth - innerContainer.offsetWidth ? document.documentElement.clientWidth - 20
              : left < innerContainer.offsetWidth - 20 ? -(innerContainer.offsetWidth - 20) : left
            console.info('aa', left, -(innerContainer.offsetWidth - 20))
            top = left === document.documentElement.clientWidth - 20 || left === -(innerContainer.offsetWidth - 20) ? (top < 0 ? 0
              : top > document.documentElement.clientHeight - innerContainer.offsetHeight ? document.documentElement.clientHeight - innerContainer.offsetHeight : top)
              : top < innerContainer.offsetHeight - 20 ? -(innerContainer.offsetHeight - 20)
                : top > document.documentElement.clientHeight - 20 ? document.documentElement.clientHeight - 20 : top
            moveEl.style.left = left + 'px'
            moveEl.style.top = top + 'px'
            vnode.context.$emit('drag-end', event)
          }
        }
      }
    }
  },
  data: function() {
    return {
      hide: false
    }
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
