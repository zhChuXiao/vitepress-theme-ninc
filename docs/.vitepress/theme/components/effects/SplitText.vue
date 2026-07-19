<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

interface Props {
  text: string
  delay?: number
  stagger?: number
  duration?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  stagger: 0.03,
  duration: 0.6,
  class: '',
})

const containerRef = ref<HTMLElement | null>(null)
const prefersReduced = ref(false)

// 按 Unicode 码点拆分字符
const chars = computed(() => Array.from(props.text))

let ctx: gsap.Context | undefined
let observer: IntersectionObserver | undefined

function play() {
  const el = containerRef.value
  if (!el) return
  ctx?.revert()
  ctx = gsap.context(() => {
    gsap.fromTo(
      '.split-char',
      { opacity: 0, y: 40, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: props.duration,
        delay: props.delay,
        stagger: props.stagger,
        ease: 'back.out(1.7)',
      },
    )
  }, el)
}

onMounted(() => {
  prefersReduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const el = containerRef.value
  if (!el) return
  if (prefersReduced.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
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
  <div
    ref="containerRef"
    class="split-text"
    :class="[{ 'is-reduced': prefersReduced }, props.class]"
  >
    <span
      v-for="(ch, i) in chars"
      :key="i"
      class="split-char"
    >{{ ch === ' ' ? '\u00A0' : ch }}</span>
  </div>
</template>

<style scoped>
.split-text {
  display: inline-block;
  perspective: 400px;
  color: var(--vp-c-text-1);
}

.split-char {
  display: inline-block;
  transform-style: preserve-3d;
  /* 初始隐藏态由 CSS 承担，避免首屏闪烁 */
  opacity: 0;
  transform: translateY(40px) rotateX(-90deg);
  will-change: opacity, transform;
}

.split-text.is-reduced .split-char {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .split-char {
    opacity: 1;
    transform: none;
  }
}
</style>
