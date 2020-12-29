<template>
  <div class="translate" :style="ret_style" :class="ret_class">
    <!--  -->
    <!-- Reactive, component-oriented view layer for modern web interfaces -->
    <slot></slot>
  </div>
</template>
<script>
export default {
  /**
   * position：动画方式；取值：
   *    top 向上滑动
   *    bottom 向下滑动
   *    left 向左滑动
   *    right 向右滑动
   *    suspension 悬浮按钮上下漂浮效果
   *    flash 闪光,浮光掠影
   *
   * time：动画持续时间
   */
  props: {
    position: {
      type: String,
      default: "top"
    },
    time: {
      type: String,
      default: "0.3s"
    }
  },
  /**
   * classArr：position做class名处理
   * styleArr：position做style处理
   */
  data() {
    return {
      classArr: ["flash"],
      styleArr: ["top", "bottom", "right", "left", "suspension"]
    };
  },
  computed: {
    ret_style() {
      if (this.classArr.indexOf(this.position) > -1) return;
      else if (this.position == "suspension")
        return `
          animation: suspension 2s ease-in-out infinite alternate;
        `;
      else
        return `
          animation-name: ${this.position};
          animation-duration: ${this.time};
        `;
    },
    ret_class() {
      if (this.styleArr.indexOf(this.position) > -1) return;
      else return this.position;
    }
  }
};
</script>
<style>
@keyframes right {
  0% {
    transform: translate3d(-100px, 0, 0);
    opacity: 0;
    filter: blur(2px);
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
    filter: blur(0);
  }
}
@keyframes top {
  0% {
    transform: translate3d(0, 100px, 0);
    opacity: 0;
    filter: blur(2px);
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
    filter: blur(0px);
  }
}
@keyframes bottom {
  0% {
    transform: translate3d(0, -100px, 0);
    opacity: 0;
    filter: blur(2px);
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
    filter: blur(0px);
  }
}
@keyframes left {
  0% {
    transform: translate3d(100px, 0, 0);
    opacity: 0;
    filter: blur(2px);
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
    filter: blur(0px);
  }
}
@keyframes suspension {
  from {
    transform: translate3d(0, 2px, 0);
  }
  to {
    transform: translate3d(0, -2px, 0);
  }
}
</style>
<style scoped lang="scss">
.translate {
  transform: translate3d(0, 0, 0);
}

.flash {
  overflow: hidden;
}
.flash::before {
  content: "";
  position: absolute;
  width: 20px;
  top: 0;
  height: 100%;
  opacity: 0.4;
  transform: skewX(-30deg);
  transform-origin: 0 100%;
  background-color: #fff;
  animation: btn_before 4s infinite;
}
@keyframes btn_before {
  0% {
    left: -100%;
  }
  25% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}
</style>