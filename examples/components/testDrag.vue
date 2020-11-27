<template>
  <div>
    <my-drag @drag-start="dragStart" @drag-end="dragEnd">
      <div class="test-drag">dragMe</div>
    </my-drag>
  </div>
</template>
<script>
export default {
  methods: {
    dragStart: function(event) {
      console.info('drag-start', event)
    },
    dragEnd: function(event) {
      console.info('drag-end', event)
    }
  }
}
</script>
<style scoped>
.test-drag {
  padding: 50px;
  background-color: #149ef1;
  width: 50px;
}
</style>
