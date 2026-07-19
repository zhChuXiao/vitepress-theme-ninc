<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  /** 左侧（上层）图片 URL，被分割线裁剪显示 */
  firstImage: string
  /** 右侧（底层）图片 URL，完整显示 */
  secondImage: string
  /** 左侧图片 alt */
  firstAlt?: string
  /** 右侧图片 alt */
  secondAlt?: string
  /** 左侧标签文字 */
  firstLabel?: string
  /** 右侧标签文字 */
  secondLabel?: string
  /** 初始分割位置（百分比 0-100） */
  initial?: number
}

const props = withDefaults(defineProps<Props>(), {
  firstAlt: 'First content',
  secondAlt: 'Second content',
  firstLabel: '亮色',
  secondLabel: '暗色',
  initial: 50
})

const containerRef = ref<HTMLElement | null>(null)
const sliderX = ref(props.initial)
const isInteracting = ref(false)

let rafId: number | null = null

const updateSlider = (clientX: number) => {
  if (!containerRef.value) return
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    rafId = null
    const rect = containerRef.value!.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    sliderX.value = Math.max(0, Math.min(100, pct))
  })
}

const handleMouseMove = (e: MouseEvent) => {
  if (isInteracting.value) return // drag 模式下由 mousemove 单独处理
  updateSlider(e.clientX)
}

const handleMouseEnter = () => {
  // hover 模式下立即响应
}

const handleMouseLeave = () => {
  // 鼠标离开后回归初始位置（平滑动画）
  isInteracting.value = false
  sliderX.value = props.initial
}

// 触屏支持
const handleTouchMove = (e: TouchEvent) => {
  if (e.touches.length === 0) return
  updateSlider(e.touches[0].clientX)
}

// 拖拽手柄支持
const handleMouseDown = (e: MouseEvent) => {
  isInteracting.value = true
  updateSlider(e.clientX)
  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
  e.preventDefault()
}

const handleDragMove = (e: MouseEvent) => {
  if (!isInteracting.value) return
  updateSlider(e.clientX)
}

const handleDragEnd = () => {
  isInteracting.value = false
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
}

onMounted(() => {
  sliderX.value = props.initial
})

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
})
</script>

<template>
  <div
    ref="containerRef"
    class="ninc-compare"
    :class="{ 'is-dragging': isInteracting }"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="handleMouseDown"
    @touchmove="handleTouchMove"
  >
    <!-- 底层图片（完整显示） -->
    <img
      :src="props.secondImage"
      :alt="props.secondAlt"
      class="ninc-compare-img ninc-compare-bottom"
      draggable="false"
    />

    <!-- 上层图片（按分割位置裁剪） -->
    <div
      class="ninc-compare-overlay"
      :style="{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }"
    >
      <img
        :src="props.firstImage"
        :alt="props.firstAlt"
        class="ninc-compare-img"
        draggable="false"
      />
    </div>

    <!-- 分割线 -->
    <div class="ninc-compare-divider" :style="{ left: `${sliderX}%` }">
      <div class="ninc-compare-line"></div>
      <div class="ninc-compare-glow"></div>
      <div class="ninc-compare-handle">
        <Icon icon="lucide:chevrons-left-right" />
      </div>
    </div>

    <!-- 左右标签 -->
    <div class="ninc-compare-tag ninc-compare-tag-left">
      <Icon icon="lucide:sun" />
      <span>{{ props.firstLabel }}</span>
    </div>
    <div class="ninc-compare-tag ninc-compare-tag-right">
      <Icon icon="lucide:moon" />
      <span>{{ props.secondLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.ninc-compare {
  position: relative;
  width: 100%;
  /* 16:10 比例，与博客首页截图接近 */
  aspect-ratio: 16 / 10;
  border-radius: 16px;
  overflow: hidden;
  /* border: 1px solid var(--vp-c-border); */
  /* background: var(--vp-c-bg-soft); */
  cursor: col-resize;
  user-select: none;
  /* box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04); */
  transition: box-shadow 0.3s ease;
}

.ninc-compare:hover {
  /* box-shadow: 0 14px 48px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06); */
}

.ninc-compare.is-dragging {
  cursor: grabbing;
}

.ninc-compare-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  pointer-events: none;
}

.ninc-compare-bottom {
  z-index: 1;
}

.ninc-compare-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  /* 防止子图片溢出裁剪区域 */
  overflow: hidden;
  will-change: clip-path;
  transition: clip-path 0.15s ease-out;
}

/* hover 模式下让 overlay 跟随鼠标无延迟 */
.ninc-compare:hover .ninc-compare-overlay {
  transition: none;
}

/* 鼠标离开时回归动画 */
.ninc-compare:not(:hover) .ninc-compare-overlay {
  transition: clip-path 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ===== 分割线 ===== */
.ninc-compare-divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0;
  z-index: 10;
  pointer-events: none;
  /* 用 transform 而非改 width，触发 GPU 加速 */
  transform: translateX(-50%);
}

.ninc-compare-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(99, 102, 241, 0.4) 15%,
    rgba(139, 92, 246, 0.8) 50%,
    rgba(99, 102, 241, 0.4) 85%,
    transparent 100%
  );
  box-shadow: 0 0 12px rgba(139, 92, 246, 0.5);
}

.ninc-compare-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    ellipse at center,
    rgba(139, 92, 246, 0.25) 0%,
    transparent 70%
  );
  filter: blur(8px);
  opacity: 0.8;
}

/* ===== 拖拽手柄 ===== */
.ninc-compare-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid var(--vp-c-brand-1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-brand-1);
  pointer-events: auto;
  cursor: grab;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), 0 0 0 4px rgba(60, 135, 114, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ninc-compare-handle:hover {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2), 0 0 0 6px rgba(60, 135, 114, 0.15);
}

.ninc-compare-handle:active {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.05);
}

.ninc-compare-handle .iconify {
  font-size: 18px;
}

/* ===== 左右标签胶囊 ===== */
.ninc-compare-tag {
  position: absolute;
  top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  pointer-events: none;
  z-index: 5;
}

.ninc-compare-tag .iconify {
  font-size: 14px;
}

.ninc-compare-tag-left {
  left: 16px;
  background: rgba(255, 255, 255, 0.85);
  color: #92400e;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.ninc-compare-tag-right {
  right: 16px;
  background: rgba(30, 30, 46, 0.85);
  color: #c4b5fd;
  border: 1px solid rgba(139, 92, 246, 0.4);
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .ninc-compare {
    aspect-ratio: 4 / 3;
    border-radius: 12px;
  }

  .ninc-compare-tag {
    top: 12px;
    padding: 4px 10px;
    font-size: 11px;
  }

  .ninc-compare-tag-left {
    left: 12px;
  }

  .ninc-compare-tag-right {
    right: 12px;
  }

  .ninc-compare-handle {
    width: 32px;
    height: 32px;
  }

  .ninc-compare-handle .iconify {
    font-size: 14px;
  }
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .ninc-compare-overlay,
  .ninc-compare-handle,
  .ninc-compare:hover .ninc-compare-overlay {
    transition: none !important;
  }
}
</style>
