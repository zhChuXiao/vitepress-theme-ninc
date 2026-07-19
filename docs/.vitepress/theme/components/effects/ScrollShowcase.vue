<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 文字行：实色 + 描边交替
const textRows = [
  { text: 'VITEPRESS', subtitle: '由 VitePress 驱动，Markdown 即博客' },
  { text: 'CUSTOMIZABLE', subtitle: '深度可配置，defu 深合并' },
  { text: 'BEAUTIFUL', subtitle: '动效丰富，视觉冲击力强' },
  { text: 'READY', subtitle: '开箱即用，一行命令初始化' }
]

// 图片行：用本地截图
const galleries = [
  [
    { src: '/images/scrollShowcase/home-hero-light.png', alt: '首页 Hero · 浅色' },
    { src: '/images/scrollShowcase/home-hero-dark.png', alt: '首页 Hero · 深色' },
    { src: '/images/scrollShowcase/home-footer-light.png', alt: '首页页脚 · 浅色' },
    { src: '/images/scrollShowcase/home-footer-dark.png', alt: '首页页脚 · 深色' }
  ],
  [
    { src: '/images/scrollShowcase/archives-light.png', alt: '归档页 · 浅色' },
    { src: '/images/scrollShowcase/archives-dark.png', alt: '归档页 · 深色' },
    { src: '/images/scrollShowcase/article-light.png', alt: '文章页 · 浅色' },
    { src: '/images/scrollShowcase/article-dark.png', alt: '文章页 · 深色' }
  ],
  [
    { src: '/images/scrollShowcase/comments-dark.png', alt: '留言板' },
    { src: '/images/scrollShowcase/equipment-dark.png', alt: '装备编年史' },
    { src: '/images/scrollShowcase/about-light.png', alt: '关于本站 · 浅色' },
    { src: '/images/scrollShowcase/about-dark.png', alt: '关于本站 · 深色' }
  ]
]

let ctx: gsap.Context | null = null

// 滚动状态跟踪：避免在用户滚动中触发 refresh 导致抽搐
// refresh 会重算所有 ScrollTrigger 的 start/end 位置，滚动中执行会让 scrub 进度突变
let isScrolling = false
let scrollEndTimer: number | null = null
let pendingRefresh = false
let refreshRaf: number | null = null
let preEntryObserver: IntersectionObserver | null = null
let preEntryRefreshDone = false

const handleScroll = () => {
  isScrolling = true
  if (scrollEndTimer !== null) clearTimeout(scrollEndTimer)
  // 滚动停止 200ms 后才认为真正停止，再执行 pending 的 refresh
  scrollEndTimer = window.setTimeout(() => {
    isScrolling = false
    if (pendingRefresh) {
      pendingRefresh = false
      ScrollTrigger.refresh()
    }
  }, 200)
}

// 调度 refresh：滚动中只标记 pending，停止后才真正执行
const scheduleRefresh = () => {
  if (isScrolling) {
    pendingRefresh = true
    return
  }
  // 不在滚动，立即执行（rAF 内合并同帧多次调用）
  if (refreshRaf !== null) return
  refreshRaf = window.requestAnimationFrame(() => {
    refreshRaf = null
    ScrollTrigger.refresh()
  })
}

// 跟踪图片 load 监听器，便于卸载时清理
const trackedImages: Array<{ el: HTMLImageElement; fn: () => void }> = []

// 等所有图片加载完（用于 IntersectionObserver 触发后的预加载等待）
const waitForImages = (): Promise<void> => {
  const images = Array.from(document.querySelectorAll<HTMLImageElement>('.ss-gallery-track img'))
  if (images.length === 0) return Promise.resolve()

  return Promise.all(
    images.map(img => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve()
      return new Promise<void>(resolve => {
        const onDone = () => resolve()
        img.addEventListener('load', onDone, { once: true })
        img.addEventListener('error', onDone, { once: true })
      })
    })
  ).then(() => undefined)
}

// 关键修复：在用户进入 ScrollShowcase 之前完成图片加载 + refresh
// 用 IntersectionObserver 提前 1000px 触发，此时用户还在区域上方
// refresh 不会造成视觉跳跃（因为用户还没看到 scrub 动画）
const watchShowcasePreEntry = () => {
  const showcase = document.querySelector('.scroll-showcase')
  if (!showcase || typeof IntersectionObserver === 'undefined') return

  // 立即预加载所有图片：绕过 <img loading="lazy"> 的延迟
  // 让浏览器在 onMounted 时就开始下载，不等视口接近
  galleries.flat().forEach(({ src }) => {
    const preload = new Image()
    preload.src = src
  })

  preEntryObserver = new IntersectionObserver(
    async entries => {
      for (const entry of entries) {
        if (entry.isIntersecting && !preEntryRefreshDone) {
          preEntryRefreshDone = true
          preEntryObserver?.disconnect()
          preEntryObserver = null
          // 用户即将进入 ScrollShowcase，等所有图片加载完
          await waitForImages()
          // 此时用户还在区域上方或刚开始进入，refresh 不会造成明显跳跃
          ScrollTrigger.refresh()
        }
      }
    },
    {
      // 提前 1000px 触发，给图片加载留出时间（约 1-2 秒滚动时间）
      rootMargin: '1000px 0px 0px 0px'
    }
  )

  preEntryObserver.observe(showcase)
}

const initScrollTriggers = () => {
  let textCount = 0
  let galleryCount = 0

  ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('.scroll-showcase section').forEach(section => {
      const track = section.querySelector<HTMLElement>('.showcase-track')
      if (!track) return

      const isGallery = section.classList.contains('ss-gallery-section')

      // 文字行和图片行各自内部交替方向
      // 文字: 0→从左, 1→从右, 2→从左, 3→从右
      // 图片: 0→从右, 1→从左, 2→从右
      let fromRight: boolean
      if (isGallery) {
        fromRight = galleryCount % 2 === 0
        galleryCount++
      } else {
        fromRight = textCount % 2 === 1
        textCount++
      }

      const [x, xEnd] = fromRight ? ['100%', (track.scrollWidth - section.offsetWidth) * -1] : [track.scrollWidth * -1, 0]

      gsap.fromTo(
        track,
        { x },
        {
          x: xEnd,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            scrub: 0.5,
            start: 'top bottom',
            end: 'bottom top'
          }
        }
      )
    })
    ScrollTrigger.refresh()
  })
}

// 监听图片加载：每张图片 load 后刷新 ScrollTrigger 位置
// 修复「首次加载等待几秒后滚动，后几行过早触发」的时序 bug
const watchImageLoads = () => {
  const images = document.querySelectorAll<HTMLImageElement>('.ss-gallery-track img')
  images.forEach(img => {
    // 已加载（缓存命中）直接跳过
    if (img.complete) return
    const fn = () => scheduleRefresh()
    img.addEventListener('load', fn, { once: true })
    img.addEventListener('error', fn, { once: true })
    trackedImages.push({ el: img, fn })
  })
}

// 字体加载也会改变文字 section 高度，需要刷新
const watchFontsReady = () => {
  const fonts = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts
  if (fonts?.ready) {
    fonts.ready.then(() => scheduleRefresh())
  }
}

onMounted(async () => {
  await nextTick()
  // 0. 监听滚动状态（用于调度 refresh 时机，避免滚动中 refresh 造成抽搐）
  window.addEventListener('scroll', handleScroll, { passive: true })
  // 1. 立即初始化（图片未加载，section 较短，先用初步位置）
  initScrollTriggers()
  // 2. 关键修复：监听 ScrollShowcase 即将进入视口，提前完成图片加载 + refresh
  //    这样用户真正进入区域时位置已正确，停止滚动时无需 refresh → 不会跳跃
  watchShowcasePreEntry()
  // 3. 监听图片 load，加载后 refresh 校正位置（兜底）
  watchImageLoads()
  // 4. 字体加载完成后再刷新一次
  watchFontsReady()
  // 5. window.load 兜底：所有资源（图片、字体、iframe 等）加载完后最终刷新
  if (document.readyState === 'complete') {
    scheduleRefresh()
  } else {
    window.addEventListener('load', scheduleRefresh, { once: true })
  }
})

onBeforeUnmount(() => {
  // 清理 scroll 监听
  window.removeEventListener('scroll', handleScroll)
  if (scrollEndTimer !== null) {
    clearTimeout(scrollEndTimer)
    scrollEndTimer = null
  }
  // 清理 IntersectionObserver
  if (preEntryObserver) {
    preEntryObserver.disconnect()
    preEntryObserver = null
  }
  // 清理图片 load 监听器（once: true 已自动清理，但保险起见再清一次）
  trackedImages.forEach(({ el, fn }) => {
    el.removeEventListener('load', fn)
    el.removeEventListener('error', fn)
  })
  trackedImages.length = 0
  // 取消未执行的 rAF
  if (refreshRaf !== null) {
    cancelAnimationFrame(refreshRaf)
    refreshRaf = null
  }
  // 销毁所有 ScrollTrigger 与 tween
  ctx?.revert()
})
</script>

<template>
  <div class="scroll-showcase">
    <!-- 内容区 -->
    <div class="ss-content">
      <!-- 文字行 + 图片行交替 -->
      <template v-for="(row, i) in textRows" :key="`row-${i}`">
        <!-- 文字 section -->
        <section class="ss-section ss-text-section">
          <div class="ss-text-track showcase-track">
            <span class="ss-big-text">{{ row.text }}</span>
            <span class="ss-big-text ss-big-text-outline">{{ row.text }}</span>
            <span class="ss-big-text">{{ row.text }}</span>
          </div>
          <p class="ss-subtitle">{{ row.subtitle }}</p>
        </section>

        <!-- 图片 section（最后一行文字后不渲染图片） -->
        <section v-if="i < galleries.length" class="ss-section ss-gallery-section">
          <ul class="ss-gallery-track showcase-track">
            <li v-for="(img, j) in galleries[i]" :key="j">
              <img :src="img.src" :alt="img.alt" loading="lazy" />
              <!-- <span class="ss-img-caption">{{ img.alt }}</span> -->
            </li>
          </ul>
        </section>
      </template>

      <!-- 页脚 -->
      <!-- <footer class="ss-footer">
        <p>
          <Icon icon="lucide:mouse" /> 向下滚动体验横向视差
        </p>
      </footer> -->
    </div>
  </div>
</template>

<style scoped>
.scroll-showcase {
  position: relative;
}

/* ===== 内容 ===== */
.ss-content {
  overflow-x: clip;
}

.ss-section {
  position: relative;
}

/* 文字行 */
.ss-text-section {
  padding: 3rem 0 2rem;
  overflow: hidden;
}
.ss-text-track {
  display: flex;
  align-items: center;
  white-space: nowrap;
  will-change: transform;
}
.ss-big-text {
  font-size: clamp(5rem, 14vw, 16rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--vp-c-text-1);
  margin-right: 3rem;
}
.ss-big-text-outline {
  -webkit-text-stroke: 2px var(--vp-c-brand-1);
  color: transparent;
  margin-right: 3rem;
}
.ss-subtitle {
  font-size: clamp(1rem, 2vw, 1.5rem);
  color: var(--vp-c-text-2);
  margin: 1.5rem 0 0;
  text-align: center;
}

/* 图片行 */
.ss-gallery-section {
  padding: 1rem 0 2rem;
}
.ss-gallery-track {
  display: flex;
  list-style: none;
  padding: 0 0 0 1rem;
  margin: 0;
  will-change: transform;
}
.ss-gallery-track li {
  flex-shrink: 0;
  width: clamp(380px, 50vw, 980px);
  padding-right: 1rem;
}
.ss-gallery-track img {
  width: 100%;
  height: auto;
  border-radius: 16px;
  display: block;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}
.ss-img-caption {
  display: block;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0.6rem 0 0;
  text-align: center;
}

/* 页脚 */
.ss-footer {
  height: 30vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ss-footer p {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  gap: 8px;
}
.ss-footer .iconify {
  font-size: 18px;
  color: var(--vp-c-brand-1);
}

/* 响应式 */
@media (max-width: 768px) {
  .ss-big-text {
    font-size: clamp(3rem, 18vw, 8rem);
    margin-right: 1.5rem;
  }
  .ss-gallery-track li {
    width: clamp(280px, 75vw, 420px);
  }
  .ss-text-section {
    padding: 2rem 0 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ss-text-track,
  .ss-gallery-track {
    transform: none !important;
  }
}
</style>
