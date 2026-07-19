<script lang="ts" setup>
import { ref, computed } from 'vue'

interface TiltCardProps {
  /** 最大倾斜角度（deg） */
  max?: number
  /** hover 放大倍数 */
  scale?: number
  /** 透视距离（px） */
  perspective?: number
  class?: string
}

const props = withDefaults(defineProps<TiltCardProps>(), {
  max: 15,
  scale: 1.02,
  perspective: 1000,
})

const cardRef = ref<HTMLElement | null>(null)
const rotateX = ref(0)
const rotateY = ref(0)
const isHovering = ref(false)
// 鼠标位置百分比（用于高光层），0% ~ 100%
const mx = ref(50)
const my = ref(50)

function onMouseMove(e: MouseEvent) {
  const el = cardRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  // 相对位置：-0.5 ~ 0.5
  const px = (e.clientX - rect.left) / rect.width - 0.5
  const py = (e.clientY - rect.top) / rect.height - 0.5
  // 转换为倾斜角度，范围 -max ~ max
  rotateY.value = -px * props.max * 2
  rotateX.value = py * props.max * 2
  // 高光位置百分比
  mx.value = (px + 0.5) * 100
  my.value = (py + 0.5) * 100
}

function onMouseEnter() {
  isHovering.value = true
}

function onMouseLeave() {
  isHovering.value = false
  rotateX.value = 0
  rotateY.value = 0
}

const cardStyle = computed(() => ({
  '--mx': `${mx.value}%`,
  '--my': `${my.value}%`,
  transform: isHovering.value
    ? `perspective(${props.perspective}px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg) scale(${props.scale})`
    : `perspective(${props.perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
}))
</script>

<template>
  <div
    ref="cardRef"
    class="tilt-card"
    :class="[props.class, { 'is-hovering': isHovering }]"
    :style="cardStyle"
    @mousemove="onMouseMove"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="tilt-card__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.tilt-card {
  position: relative;
  display: block;
  width: 100%;
  border-radius: 12px;
  background: var(--vp-c-bg, var(--tilt-bg, #ffffff));
  border: 1px solid var(--vp-c-divider, var(--tilt-border, rgba(0, 0, 0, 0.1)));
  transform-style: preserve-3d;
  /* 默认带 transition 以便 mouseleave 平滑回归；hover 时通过 .is-hovering 移除避免跟手延迟 */
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
  box-sizing: border-box;
}

.tilt-card.is-hovering {
  transition: none;
}

.tilt-card__content {
  position: relative;
  z-index: 1;
  transform-style: preserve-3d;
  transform: translateZ(0);
  height: 100%;
}

/* 高光层：跟随鼠标位置移动 */
.tilt-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at var(--mx, 50%) var(--my, 50%),
    rgba(255, 255, 255, 0.35),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  transform: translateZ(1px);
}

.tilt-card.is-hovering::before {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .tilt-card {
    transition: none;
  }
  .tilt-card.is-hovering {
    transform: none;
  }
  .tilt-card::before {
    display: none;
  }
}

@media (prefers-color-scheme: dark) {
  .tilt-card {
    --tilt-bg: #1a1a1a;
    --tilt-border: rgba(255, 255, 255, 0.1);
  }
  .tilt-card::before {
    background: radial-gradient(
      circle at var(--mx, 50%) var(--my, 50%),
      rgba(255, 255, 255, 0.18),
      transparent 60%
    );
  }
}
</style>
