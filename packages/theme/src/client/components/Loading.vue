<template>
  <Teleport to="body">
    <Transition name="fade" mode="out-in">
      <div v-if="loadingStatus" class="loading-wrapper">
        <div class="loading" @click="loadingStatus = false">
          <div class="logo-container">
            <img :src="theme.siteMeta.avatar" class="logo" alt="loading-logo" />
            <div class="logo-container-after">
              <div class="logo-container-after-item"></div>
            </div>
          </div>
          <span :class="['tip', { show: showTip }]">一直显示？点击任意区域即可关闭</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { mainStore } from '../store'
import NProgress from 'nprogress'

const store = mainStore()
const { theme } = useData()
const { loadingStatus,scrollDataProgress } = storeToRefs(store)

// 显示提示
const showTip = ref(false)
const showTimeOut = ref(null)

// 监听加载状态
watch(
  () => loadingStatus.value,
  val => {
    if (val) {
      scrollDataProgress.value = 0
      NProgress.start()
      showTimeOut.value = setTimeout(() => {
        showTip.value = true
      }, 3000)
    } else {
      showTip.value = false
      clearTimeout(showTimeOut.value)
      NProgress.done()
    }
  }
)

onMounted(() => {
  NProgress.start()
  loadingStatus.value = true
})

onBeforeUnmount(() => {
  clearTimeout(showTimeOut.value)
})
</script>

<style lang="scss" scoped>
.loading-wrapper {
  position: relative;
  z-index: 9999;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: var(--main-card-background2);
  .logo-container {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    position: relative;
    border: 4px solid var(--main-card-border);
    .logo-container-after {
      position: absolute;
      bottom: 0px;
      right: 0px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ebeaea;
      .logo-container-after-item {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #4af466;
      }
    }
  }
  .logo {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: relative;
    animation: loading 2s infinite;
  }
  .tip {
    font-weight: bold;
    position: absolute;
    bottom: 2rem;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.3s;
    &.show {
      opacity: 0.6;
    }
  }
}
</style>
