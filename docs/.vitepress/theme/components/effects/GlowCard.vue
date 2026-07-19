<script lang="ts" setup>
import { ref, computed } from 'vue'

interface GlowCardProps {
  /** 光晕颜色 */
  color?: string
  /** 光晕半径（px） */
  size?: number
  class?: string
}

const props = withDefaults(defineProps<GlowCardProps>(), {
  color: '#6366f1',
  size: 300,
})

const glowX = ref(0)
const glowY = ref(0)

function onMouseMove(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  glowX.value = e.clientX - rect.left
  glowY.value = e.clientY - rect.top
}

const cardStyle = computed(() => ({
  '--glow-x': `${glowX.value}px`,
  '--glow-y': `${glowY.value}px`,
  '--glow-color': props.color,
  '--glow-size': `${props.size}px`,
}))
</script>

<template>
  <div
    class="glow-card"
    :class="props.class"
    :style="cardStyle"
    @mousemove="onMouseMove"
  >
    <div class="glow-card__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.glow-card {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: var(--vp-c-bg, var(--glow-card-bg, #ffffff));
  border: 1px solid var(--vp-c-divider, var(--glow-card-border, rgba(0, 0, 0, 0.1)));
  box-sizing: border-box;
}

/* 光晕层：跟随鼠标位置的径向渐变 */
.glow-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle var(--glow-size) at var(--glow-x, 0) var(--glow-y, 0),
    var(--glow-color, #6366f1),
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 0;
}

.glow-card:hover::before {
  opacity: 0.15;
}

.glow-card__content {
  position: relative;
  z-index: 1;
  height: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .glow-card::before {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .glow-card {
    --glow-card-bg: #1a1a1a;
    --glow-card-border: rgba(255, 255, 255, 0.1);
  }
}
</style>
