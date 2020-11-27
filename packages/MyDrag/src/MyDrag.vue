<template>
  <div class="my-drag">
    <div v-drag class="drag-inner">
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
        moveEl.onmousedown = (event) => {
          const disX = event.clientX - moveEl.offsetLeft
          const disY = event.clientY - moveEl.offsetTop
          vnode.context.$emit('drag-start', event)
          document.onmousemove = (dEvent) => {
            const left = dEvent.clientX - disX
            const top = dEvent.clientY - disY
            moveEl.style.left = left + 'px'
            moveEl.style.top = top + 'px'
            const innerContainer = document.querySelector('.drag-inner')
            if (left < 0 || left + innerContainer.offsetWidth > document.documentElement.clientWidth ||
              top < 0 || top + innerContainer.offsetHeight > document.documentElement.clientHeight) {
              vnode.context.hide = true
            }
          }
          document.onmouseup = (event) => {
            document.onmousemove = null
            document.onmouseup = null
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
  position: relative;
}
</style>
