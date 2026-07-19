<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { animate } from 'animejs'

interface Props {
  target: number
  duration?: number
  delay?: number
  suffix?: string
  prefix?: string
  decimals?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2000,
  delay: 0,
  suffix: '',
  prefix: '',
  decimals: 0,
  class: '',
})

const containerRef = ref<HTMLElement | null>(null)
const currentValue = ref(0)
const prefersReduced = ref(false)

// 根据 decimals 格式化小数位
const formattedNumber = computed(() => currentValue.value.toFixed(props.decimals))

// anime.js v4 的 animate 返回 Animation 实例
let animation: ReturnType<typeof animate> | undefined
let observer: IntersectionObserver | undefined

function play() {
  // 用普通对象作为动画目标，对其 val 属性做数值插值
  const obj = { val: 0 }
  animation?.pause()
  animation = animate(obj, {
    val: props.target,
    duration: props.duration,
    delay: props.delay,
    ease: 'outExpo',
    onUpdate: () => {
      currentValue.value = obj.val
    },
  })
}

onMounted(() => {
  prefersReduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const el = containerRef.value
  if (!el) return
  // 偏好减少动效：直接显示目标值
  if (prefersReduced.value) {
    currentValue.value = props.target
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer?.disconnect()
          play()
        }
      })
    },
    { threshold: 0.3 },
  )
  observer.observe(el)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  animation?.pause()
})
</script>

<template>
  <span ref="containerRef" class="number-count" :class="props.class">
    {{ prefix }}{{ formattedNumber }}{{ suffix }}
  </span>
</template>

<style scoped>
.number-count {
  color: var(--vp-c-text-1);
  /* 等宽数字，避免滚动时宽度抖动 */
  font-variant-numeric: tabular-nums;
}
</style>
