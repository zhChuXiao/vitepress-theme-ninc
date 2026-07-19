<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

interface Props {
  text: string
  delay?: number
  stagger?: number
  duration?: number
  as?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  stagger: 0.04,
  duration: 0.8,
  as: 'div',
  class: '',
})

const containerRef = ref<HTMLElement | null>(null)
const prefersReduced = ref(false)

// 按 Unicode 码点拆分，兼容 emoji 等代理对字符
const chars = computed(() => Array.from(props.text))

let ctx: gsap.Context | undefined
let observer: IntersectionObserver | undefined

function play() {
  const el = containerRef.value
  if (!el) return
  // 清理上一次的 context，避免重复动画残留
  ctx?.revert()
  ctx = gsap.context(() => {
    gsap.fromTo(
      '.blur-char',
      { opacity: 0, filter: 'blur(12px)', y: 20 },
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: props.duration,
        delay: props.delay,
        stagger: props.stagger,
        ease: 'power3.out',
      },
    )
  }, el)
}

onMounted(() => {
  prefersReduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const el = containerRef.value
  if (!el) return
  // 偏好减少动效：直接显示最终状态，不注册观察器
  if (prefersReduced.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // 触发一次后停止观察
          observer?.disconnect()
          play()
        }
      })
    },
    { threshold: 0.2 },
  )
  observer.observe(el)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  ctx?.revert()
})
</script>

<template>
  <component
    :is="as"
    ref="containerRef"
    class="blur-text"
    :class="[{ 'is-reduced': prefersReduced }, props.class]"
  >
    <span
      v-for="(ch, i) in chars"
      :key="i"
      class="blur-char"
    >{{ ch === ' ' ? '\u00A0' : ch }}</span>
  </component>
</template>

<style scoped>
.blur-text {
  color: inherit;
}

.blur-char {
  display: inline-block;
  position: relative;
  /* 初始隐藏态由 CSS 承担，避免首屏闪烁 */
  opacity: 0;
  filter: blur(12px);
  transform: translateY(20px);
  will-change: opacity, filter, transform;
}

/* 偏好减少动效时直接呈现最终状态 */
.blur-text.is-reduced .blur-char {
  opacity: 1;
  filter: none;
  transform: none;
}

/* 兜底：无 JS 或媒体查询命中时也保证可见 */
@media (prefers-reduced-motion: reduce) {
  .blur-char {
    opacity: 1;
    filter: none;
    transform: none;
  }
}
</style>
