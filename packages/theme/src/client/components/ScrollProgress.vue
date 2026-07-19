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
  width: 100vw;
  height: 3px;
  background: var(--vp-c-bg-soft);
  z-index: 9999;

  .scroll-progress-bar {
    height: 100%;
    width: 0;
    background: linear-gradient(
      90deg,
      #ff6b6b 0%,
      #feca57 25%,
      #48dbfb 50%,
      #1dd1a1 75%,
      #ff6b6b 100%
    );
    background-size: 200% 100%;
    transition: width 100ms ease;
    box-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
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
</style> 