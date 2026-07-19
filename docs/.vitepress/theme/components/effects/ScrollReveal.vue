<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface ScrollRevealProps {
  /** 延迟（秒） */
  delay?: number
  /** 起始 y 偏移（px） */
  y?: number
  /** 动画时长（秒） */
  duration?: number
  /** 是否只触发一次 */
  once?: boolean
  class?: string
}

const props = withDefaults(defineProps<ScrollRevealProps>(), {
  delay: 0,
  y: 40,
  duration: 0.8,
  once: true,
})

const containerRef = ref<HTMLElement | null>(null)
let ctx: ReturnType<typeof gsap.context> | null = null

onMounted(() => {
  // 注册 ScrollTrigger 插件（重复注册安全）
  gsap.registerPlugin(ScrollTrigger)

  const el = containerRef.value
  if (!el) return

  // 尊重 prefers-reduced-motion：直接显示，不动画
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    gsap.set(el, { opacity: 1, y: 0 })
    return
  }

  ctx = gsap.context(() => {
    const stConfig: ScrollTrigger.Vars = {
      trigger: el,
      start: 'top 80%',
    }
    if (props.once) {
      stConfig.once = true
    } else {
      stConfig.toggleActions = 'play reverse play reverse'
    }

    // gsap.from：从 { opacity: 0, y } 过渡到当前 DOM 状态；
    // immediateRender 默认为 true，创建时即应用初始隐藏态，避免未触发前内容闪现
    gsap.from(el, {
      opacity: 0,
      y: props.y,
      duration: props.duration,
      delay: props.delay,
      ease: 'power3.out',
      scrollTrigger: stConfig,
    })
  }, el)
})

onBeforeUnmount(() => {
  // gsap.context.revert() 会清除内部创建的 tween/ScrollTrigger 并还原 DOM 内联样式
  ctx?.revert()
  ctx = null
})
</script>

<template>
  <div ref="containerRef" class="scroll-reveal" :class="props.class">
    <slot />
  </div>
</template>

<style scoped>
.scroll-reveal {
  display: block;
  width: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-reveal {
    /* 由 gsap.set 兜底显示，确保内容可见 */
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
