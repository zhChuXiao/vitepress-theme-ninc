<template>
  <div v-if="!loadError" class="animal-container">
    <!-- 用动态绑定 :src 避免 SSR build 静态解析 /images/animal.webp（资源缺失时也不影响构建） -->
    <img class="animal" :src="animalSrc" alt="" @error="loadError = true" />
  </div>
</template>

<script setup>
// 装饰图由用户在 public/images/animal.webp 提供；缺失时整个组件不渲染，避免显示 broken img
const animalSrc = '/images/animal.webp'
const loadError = ref(false)
</script>

<style lang="scss" scoped>
.animal-container {
  position: relative;
  background-color: var(--main-card-background-opacity2);
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 36px;
    background: url(/images/504654.webp) repeat center / auto 100%;
    box-shadow: 0 4px 7px rgba(0, 0, 0, 0.15);
  filter: var(--main-filter);

  }
  .animal {
    position: relative;
    max-width: min(974px, 100vw);
    margin: 0 auto;
    display: block;
    filter: blur(0) var(--main-filter);
    
  }
}
</style>
