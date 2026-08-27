<template>
  <div class="scroll-progress">
    <div class="scroll-progress-bar" :style="{ width: scrollDataProgress + '%' }"></div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { mainStore } from '../store'

const store = mainStore()
const { scrollDataProgress } = storeToRefs(store)
</script>

<style lang="scss" scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  height: 3px;
  background: var(--vp-c-bg-soft);
  z-index: 9999;

  .scroll-progress-bar {
    // 渐变色变量化：视觉默认值与此前硬编码完全一致，
    // 用户可在自定义样式中覆盖这些变量替换进度条配色/辉光
    --sp-color-1: #ff6b6b;
    --sp-color-2: #feca57;
    --sp-color-3: #48dbfb;
    --sp-color-4: #1dd1a1;
    --sp-glow: rgba(255, 107, 107, 0.3);
    height: 100%;
    width: 0;
    background: linear-gradient(
      90deg,
      var(--sp-color-1) 0%,
      var(--sp-color-2) 25%,
      var(--sp-color-3) 50%,
      var(--sp-color-4) 75%,
      var(--sp-color-1) 100%
    );
    background-size: 200% 100%;
    transition: width 100ms ease;
    box-shadow: 0 0 10px var(--sp-glow);
    animation: moveGradient 2s linear infinite;
  }
}

@keyframes moveGradient {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: -200% 0%;
  }
}

// 与 NesGame/docs 动效组件一致：尊重系统减少动效偏好
@media (prefers-reduced-motion: reduce) {
  .scroll-progress .scroll-progress-bar {
    animation: none;
    transition: none;
  }
}
</style>