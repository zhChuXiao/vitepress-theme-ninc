<template>
  <svg class="svg-icon" aria-hidden="true" :style="{ width, height }">
    <use :href="symbolId" :style="{transform: name === 'apple' ? 'translateY(-2px)' : 'translateY(0px)'}" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    default: 'icon'
  },
  // 注意：当前版本模板未消费此 prop（雪碧图图标颜色由图标自身 fill/stroke 或 CSS 控制），
  // 保留声明仅为向后兼容；全库使用点均未传 color（grep 实证），未来可考虑移除
  color: {
    type: String,
    default: '#333'
  },
  width: {
    type: String,
    default: '16px'
  },
  height: {
    type: String,
    default: '16px'
  }
})
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style lang="scss" scoped>
.svg-icon {
  display: inline-flex;
    align-items: center;
}
</style>
