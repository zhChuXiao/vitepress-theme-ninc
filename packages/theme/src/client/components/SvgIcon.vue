<template>
  <svg class="svg-icon" aria-hidden="true" :style="{ width, height }">
    <use :xlink:href="symbolId" :style="{transform: name === 'apple' ? 'translateY(-2px)' : 'translateY(0px)'}" />
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
