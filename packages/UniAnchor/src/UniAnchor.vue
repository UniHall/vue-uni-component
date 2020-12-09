<template>
  <ul
    v-if="anchorList.length !== 0"
    :class="{ 'uni-anchor': true, 'full-name': showFullName, 'short-name': !showFullName, 'opacity-ul': opacity}"
    :style="{ top: position === 'top' ? 0 : (position === 'bottom' ? '90%' : '50%')}"
  >
    <li v-if="anchorList.length > 0" @click="showFullName = !showFullName">
      <i :class="showFullName ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'" />
    </li>
    <li v-for="anchor in anchorList" :key="anchor.id" :class="{actived: anchor.id === activeAnchor}" @click="toAnchor(anchor)">
      {{ showFullName ? anchor.name : (anchor.shortName ? anchor.shortName : anchor.name) }}
    </li>
    <li v-show="openBackTop" class="none-background" />
    <li v-show="openBackTop" @click="toTop">顶部</li>
  </ul>
  <div v-else-if="openBackTop" @click="toTop">
    <slot>
      <span
        :class="{ 'uni-anchor': true, 'opacity-ul': opacity, 'only-back-top': true }"
        :style="{ top: position === 'top' ? '10%' : (position === 'bottom' ? '90%' : '50%')}"
      >
        顶部
      </span>
    </slot>
  </div>
</template>
<script>
export default {
  name: 'UniAnchor',
  props: {
    // 锚点列表
    anchorList: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 锚点列表位置
    position: {
      type: String,
      default: 'middle'
    },
    // 是否展示为动态锚点
    dynamicAnchor: {
      type: Boolean,
      default: true
    },
    // 是否分步滑动页面
    stepShow: {
      type: Boolean,
      default: false
    },
    // 分布定位每次渲染移动多少像素
    stepHeight: {
      type: Number,
      default: 60
    },
    // 锚点位置相对于原位置的偏移量
    offSet: {
      type: Number,
      default: 0
    },
    // 是否透明展示
    opacity: {
      type: Boolean,
      default: true
    },
    // 是否打开返回顶部
    openBackTop: {
      type: Boolean,
      default: true
    },
    // 是否存在固定页头
    fixedHeader: {
      type: Boolean,
      default: false
    },
    // 页头高度
    headerHeight: {
      type: Number,
      default: 0
    },
    // 在滚动时是否一直计算锚点位置
    scrollAlwaysComputePosition: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      // 是否展示锚点全称
      showFullName: true,
      // 存放各锚点位置
      anchorPosition: [],
      // 当前定位的锚点
      activeAnchor: ''
    }
  },
  mounted: function() {
    this.showFullName = this.anchorList.length > 0
    this.initPosition()
  },
  destroyed: function() {
    if (this.dynamicAnchor) {
      window.removeEventListener('scroll', this.onScroll, true)
    }
  },
  methods: {
    // 初始化锚点位置
    initPosition: function() {
      if (this.anchorList.length === 0) {
        return
      }
      this.activeAnchor = null
      this.anchorPosition = []
      // 如果为动态锚点，自动定位当前所属锚点
      if (this.dynamicAnchor) {
        window.addEventListener('scroll', this.onScroll, true)
        this.onScroll()
        this.anchorPosition = []
      }
    },
    // 返回顶部
    toTop: function() {
      if (this.stepShow) {
        this.byStepShow(0 + this.offSet)
      } else {
        document.documentElement.scrollTop = 0 + this.offSet
      }
      this.activeAnchor = null
      // 如果是动态锚点，自动定位当前所属锚点
      if (this.dynamicAnchor) {
        this.onScroll()
      }
    },
    // 点击锚点进行页面定位
    toAnchor: function(anchor) {
      if (anchor.clickEvent && !anchor.clickEvent()) {
        return
      }
      this.activeAnchor = anchor.id
      const toElement = document.querySelector('#' + anchor.id)
      if (toElement) {
        const headerHeight = this.fixedHeader ? -this.headerHeight : this.headerHeight
        const scrollTop = toElement.offsetTop + this.offSet + headerHeight
        if (scrollTop === document.documentElement.scrollTop) {
          return
        }
        if (this.stepShow) {
          // 分步滑动页面
          this.byStepShow(scrollTop)
        } else {
          // 直接定位
          document.documentElement.scrollTop = scrollTop
        }
      }
    },
    // 分步滑动页面进行定位
    byStepShow: function(scrollTop) {
      let top = Math.abs(document.documentElement.scrollTop - scrollTop)
      const $this = this
      const animationCallback = function() {
        top -= $this.stepHeight
        if (top <= 0) {
          document.documentElement.scrollTop = scrollTop
          return
        } else {
          requestAnimationFrame(animationCallback)
          if (document.documentElement.scrollTop > scrollTop) {
            document.documentElement.scrollTop = document.documentElement.scrollTop - top
          } else {
            document.documentElement.scrollTop = document.documentElement.scrollTop + top
          }
        }
      }
      animationCallback()
    },
    // 滚动页面时的监听回调函数
    onScroll: function() {
      if (this.anchorList.length === 0) {
        return
      }
      if (this.anchorPosition.length === 0 || this.scrollAlwaysComputePosition) {
        this.anchorList.forEach(anchor => {
          const toElement = document.querySelector('#' + anchor.id)
          if (toElement) {
            this.anchorPosition.push({
              id: anchor.id,
              position: toElement.offsetTop + (this.fixedHeader ? -this.headerHeight : this.headerHeight)
            })
          }
        })
      }
      // 因为页面头部信息是固定高度的，需要在浏览器滚动条滚动页面时，加上头部高度计算定位位置
      const headerHeight = this.fixedHeader ? -this.headerHeight : this.headerHeight
      let scrolled = document.documentElement.scrollTop || document.body.scrollTop
      scrolled = Math.ceil(headerHeight + scrolled)
      // 将锚点位置列表根据锚点位置排序
      this.anchorPosition.sort(function(pre, next) { return pre.position - next.position })
      // 根据页面位置进行当前锚点高亮
      for (let i = 0; i < this.anchorPosition.length - 1; i++) {
        if (scrolled >= this.anchorPosition[i].position && scrolled < this.anchorPosition[i + 1].position) {
          this.activeAnchor = this.anchorPosition[i].id
        }
      }
      if (this.anchorPosition.length === 0) {
        return
      }
      if (scrolled >= this.anchorPosition[this.anchorPosition.length - 1].position) {
        this.activeAnchor = this.anchorPosition[this.anchorPosition.length - 1].id
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '~@/style/mixin.scss';
  .uni-anchor {
    list-style: none;
    background-color: #606266;
    font-family: MicrosoftYaHei;
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
    padding: 0;
    @include fix-position;
  }
  .opacity-ul {
    opacity: 0.6;
  }
  .uni-anchor li {
    @include text-overflow;
    line-height: 26px;
    padding: 0 3px;
    cursor: pointer;
  }
  .uni-anchor li:hover {
    background-color: #409EFF;
  }
  .uni-anchor li.actived{
    background-color: #1891FF;
  }
  .none-background {
    background-color: #FFFFFF;
    height: 2px;
  }
  .full-name {
    width: 100px;
  }
  .short-name {
    width: 30px;
  }
  .only-back-top {
    width: auto;
    padding: 20px 15px !important;
    cursor: pointer;
  }
</style>
