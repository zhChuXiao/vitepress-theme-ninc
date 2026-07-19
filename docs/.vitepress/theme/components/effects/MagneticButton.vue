<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

interface Props {
  strength?: number
  radius?: number
}

const props = withDefaults(defineProps<Props>(), {
  strength: 0.3,
  radius: 100,
})

const btnRef = ref<HTMLButtonElement | null>(null)
const innerRef = ref<HTMLSpanElement | null>(null)
const prefersReduced = ref(false)

function onMouseMove(e: MouseEvent) {
  if (prefersReduced.value || !innerRef.value || !btnRef.value) return
  const rect = btnRef.value.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  // 相对按钮中心的偏移 × 强度
  let dx = (e.clientX - cx) * props.strength
  let dy = (e.clientY - cy) * props.strength
  // 限制最大偏移半径，避免过度位移
  const mag = Math.hypot(dx, dy)
  if (mag > props.radius) {
    const scale = props.radius / mag
    dx *= scale
    dy *= scale
  }
  gsap.to(innerRef.value, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' })
}

function onMouseLeave() {
  if (!innerRef.value) return
  // 鼠标离开平滑回归原位
  gsap.to(innerRef.value, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' })
}

onMounted(() => {
  prefersReduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

onBeforeUnmount(() => {
  // 清理尚未完成的补间，防止内存泄漏
  if (innerRef.value) gsap.killTweensOf(innerRef.value)
})
</script>

<template>
  <button
    ref="btnRef"
    class="magnetic-button"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <span ref="innerRef" class="magnetic-inner">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.magnetic-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6em 1.2em;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.magnetic-button:hover {
  border-color: var(--vp-c-brand);
}

.magnetic-inner {
  display: inline-block;
  will-change: transform;
}

/* 偏好减少动效时关闭磁吸交互的视觉反馈（按钮仍可正常使用） */
@media (prefers-reduced-motion: reduce) {
  .magnetic-inner {
    will-change: auto;
  }
}
</style>
