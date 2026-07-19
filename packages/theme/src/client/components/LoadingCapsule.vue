<template>
  <div class="loading-capsule">
    <div class="loading-capsule-bar" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script setup>
import NProgress from 'nprogress'
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { mainStore } from '../store'

const store = mainStore()
const { loadingStatus } = storeToRefs(store)
const progress = ref(0)



// 重写 NProgress 的进度设置方法
const originalSet = NProgress.set
NProgress.set = (n) => {
  progress.value = Math.min(n * 100, 100)
  return originalSet.call(NProgress, n)
}



onMounted(() => {
  // 移除原始的 NProgress 样式
  const nprogressStyle = document.getElementById('nprogress-style')
  if (nprogressStyle) {
    nprogressStyle.remove()
  }
})
</script>

<style lang="scss" scoped>
.loading-capsule {
  position: fixed;
  top: 10px;
  left: 0;
  right: 0;
  margin: 12px auto;
  width: 25%;
  max-width: 900px;
  height: 8px;
  background: var(--vp-c-bg-soft);
  z-index: 10000;
  border-radius: 8px;
  overflow: hidden;

  .loading-capsule-bar {
    height: 100%;
    background: linear-gradient(
      90deg,
      #ff6b6b 0%,
      #feca57 25%,
      #48dbfb 50%,
      #1dd1a1 75%,
      #ff6b6b 100%
    );
    background-size: 200% 100%;
    border-radius: 8px;
    transition: width 300ms ease;
    box-shadow: 0 0 15px rgba(255, 107, 107, 0.5);
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

<style lang="scss">

</style>