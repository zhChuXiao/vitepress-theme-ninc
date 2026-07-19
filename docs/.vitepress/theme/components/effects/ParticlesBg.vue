<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface ParticlesBgProps {
  /** 粒子数量 */
  count?: number
  /** 粒子颜色 */
  color?: string
  /** 粒子速度倍率 */
  speed?: number
  /** 粒子半径（px） */
  size?: number
  /** 是否连线 */
  connect?: boolean
  /** 连线最大距离（px） */
  connectDistance?: number
  class?: string
}

const props = withDefaults(defineProps<ParticlesBgProps>(), {
  count: 50,
  color: '#6366f1',
  speed: 0.5,
  size: 2,
  connect: true,
  connectDistance: 120,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let rafId = 0
let particles: Particle[] = []
let mouseX = -9999
let mouseY = -9999
let resizeObserver: ResizeObserver | undefined
let mouseMoveHandler: ((e: MouseEvent) => void) | null = null
let mouseLeaveHandler: (() => void) | null = null
let resizeHandler: (() => void) | null = null

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

// hex 颜色转 rgb，用于连线 rgba
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '').trim()
  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned
  const num = parseInt(full, 16)
  if (Number.isNaN(num)) return { r: 99, g: 102, b: 241 }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

function createParticles(width: number, height: number) {
  particles = []
  for (let i = 0; i < props.count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * props.speed * 2,
      vy: (Math.random() - 0.5) * props.speed * 2,
    })
  }
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  const w = Math.max(1, rect.width)
  const h = Math.max(1, rect.height)
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  // setTransform 避免多次 scale 累积
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  // 将越界粒子拉回边界
  for (const p of particles) {
    if (p.x > w) p.x = w
    if (p.y > h) p.y = h
    if (p.x < 0) p.x = 0
    if (p.y < 0) p.y = 0
  }
}

function draw() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  const rect = canvas.getBoundingClientRect()
  const w = rect.width
  const h = rect.height
  const rgb = hexToRgb(props.color)
  const attractRadius = 150

  ctx.clearRect(0, 0, w, h)

  // 更新并绘制粒子
  for (const p of particles) {
    // 鼠标吸引
    const dx = mouseX - p.x
    const dy = mouseY - p.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < attractRadius && dist > 0.001) {
      const force = (1 - dist / attractRadius) * 0.6
      p.vx += (dx / dist) * force
      p.vy += (dy / dist) * force
    }
    // 阻尼，避免速度无限增大
    p.vx *= 0.96
    p.vy *= 0.96
    // 保底漂浮速度（基于 props.speed）
    const minV = props.speed * 0.15
    if (Math.abs(p.vx) < minV) p.vx += (Math.random() - 0.5) * 0.02
    if (Math.abs(p.vy) < minV) p.vy += (Math.random() - 0.5) * 0.02

    p.x += p.vx
    p.y += p.vy

    // 边界反弹
    if (p.x <= 0 || p.x >= w) {
      p.vx *= -1
      p.x = Math.max(0, Math.min(w, p.x))
    }
    if (p.y <= 0 || p.y >= h) {
      p.vy *= -1
      p.y = Math.max(0, Math.min(h, p.y))
    }

    // 绘制粒子
    ctx.beginPath()
    ctx.arc(p.x, p.y, props.size, 0, Math.PI * 2)
    ctx.fillStyle = props.color
    ctx.fill()
  }

  // 连线
  if (props.connect) {
    const maxDist = props.connectDistance
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i]
        const b = particles[j]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.5
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
    }
  }

  rafId = requestAnimationFrame(draw)
}

// prefers-reduced-motion：静态绘制一次，不连线
function drawStatic() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  const rect = canvas.getBoundingClientRect()
  ctx.clearRect(0, 0, rect.width, rect.height)
  for (const p of particles) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, props.size, 0, Math.PI * 2)
    ctx.fillStyle = props.color
    ctx.fill()
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  if (!ctx) return

  resize()
  const rect = canvas.getBoundingClientRect()
  createParticles(rect.width, rect.height)

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    drawStatic()
    return
  }

  mouseMoveHandler = (e: MouseEvent) => {
    const canvasRect = canvas.getBoundingClientRect()
    mouseX = e.clientX - canvasRect.left
    mouseY = e.clientY - canvasRect.top
  }
  mouseLeaveHandler = () => {
    mouseX = -9999
    mouseY = -9999
  }
  resizeHandler = () => resize()

  canvas.addEventListener('mousemove', mouseMoveHandler)
  canvas.addEventListener('mouseleave', mouseLeaveHandler)
  window.addEventListener('resize', resizeHandler)

  resizeObserver = new ResizeObserver(() => resize())
  resizeObserver.observe(canvas)

  rafId = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  rafId = 0
  const canvas = canvasRef.value
  if (canvas && mouseMoveHandler) canvas.removeEventListener('mousemove', mouseMoveHandler)
  if (canvas && mouseLeaveHandler) canvas.removeEventListener('mouseleave', mouseLeaveHandler)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  resizeObserver?.disconnect()
  resizeObserver = undefined
  particles = []
})
</script>

<template>
  <div class="particles-bg" :class="props.class">
    <canvas ref="canvasRef" class="particles-bg__canvas" />
  </div>
</template>

<style scoped>
.particles-bg {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  overflow: hidden;
  background: var(--vp-c-bg, var(--particles-bg, transparent));
  box-sizing: border-box;
}

.particles-bg__canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

@media (prefers-color-scheme: dark) {
  .particles-bg {
    --particles-bg: #0f0f0f;
  }
}
</style>
