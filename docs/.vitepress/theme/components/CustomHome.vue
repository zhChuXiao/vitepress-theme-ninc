<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import Compare from './Compare.vue'
import AnimatedBeam from './AnimatedBeam.vue'
import ParticlesBg from './effects/ParticlesBg.vue'
import SplitText from './effects/SplitText.vue'
import NumberCount from './effects/NumberCount.vue'
import MagneticButton from './effects/MagneticButton.vue'
import TiltCard from './effects/TiltCard.vue'
import GlowCard from './effects/GlowCard.vue'
import ScrollReveal from './effects/ScrollReveal.vue'
import ScrollShowcase from './effects/ScrollShowcase.vue'
import SparklesText from './SparklesText.vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const features = [
  { icon: 'lucide:message-circle', title: '评论系统', desc: '内置 Twikoo 评论系统，开箱即用，支持邮件通知、表情、反垃圾等完整能力。' },
  { icon: 'lucide:search', title: '全站搜索', desc: '内置本地搜索与 Algolia DocSearch 集成，毫秒级响应，支持中文分词。' },
  { icon: 'lucide:smartphone', title: 'PWA 离线', desc: '自动生成 Service Worker，支持离线访问与可安装到手机桌面。' },
  { icon: 'lucide:music', title: '音乐播放器', desc: 'APlayer + MetingJS 驱动，支持网易云、QQ 音乐等多平台歌单。' },
  { icon: 'lucide:mouse-pointer-click', title: '自定义光标', desc: '内置精致鼠标光标，默认、链接、文本三种状态分别适配，明暗主题自动切换。' },
  { icon: 'lucide:image', title: '图片灯箱', desc: 'Fancybox 灯箱，点击图片自动放大，支持相册浏览、缩放、旋转。' },
  { icon: 'lucide:rss', title: 'RSS 订阅', desc: '自动生成 RSS 订阅源，读者可通过 RSS 阅读器订阅更新。' },
  { icon: 'lucide:link', title: '外链中转', desc: '自动将外链转换为中转页跳转，保护用户隐私，提升 SEO。' },
  { icon: 'lucide:moon', title: '暗色模式', desc: '完整的明暗主题适配，支持跟随系统、手动切换、记忆偏好。' },
  { icon: 'lucide:zap', title: '丰富动画', desc: '基于 GSAP、CSS 动画，页面切换丝滑流畅，视觉体验出众。' },
  { icon: 'lucide:gamepad-2', title: 'NES 模拟器', desc: '内置 NES 模拟器，init 自带超级马里奥，支持存档读档、TAS 录像、双人键盘与手柄控制。' },
  { icon: 'lucide:puzzle', title: '自动导入', desc: 'unplugin-auto-import + unplugin-vue-components，API 与组件全自动导入。' }
]

const stats = [
  { value: 12, suffix: '+', label: '内置功能' },
  { value: 5, suffix: 'min', label: '快速上手' },
  { value: 100, suffix: '%', label: '开源免费' }
]

// ===== 技术栈（Animated Beam） =====
const techStack = [
  { name: 'Vue 3', icon: 'logos:vue', color: '#42b883', beamStart: '#42b883', beamStop: '#35495e' },
  { name: 'VitePress', icon: 'simple-icons:vitepress', color: '#5672cd', beamStart: '#ff5e5b', beamStop: '#5672cd' },
  { name: 'TypeScript', icon: 'logos:typescript-icon', color: '#3178c6', beamStart: '#3178c6', beamStop: '#235a97' },
  { name: 'Vite', icon: 'logos:vitejs', color: '#646cff', beamStart: '#646cff', beamStop: '#ff8e3c' },
  { name: 'pnpm', icon: 'logos:pnpm', color: '#f69220', beamStart: '#f69220', beamStop: '#f04e23' },
  { name: 'Twikoo', icon: '/images/twikoo-logo.png', color: '#fb7299', beamStart: '#fb7299', beamStop: '#ff9eb5' }
]

// 使用场景
const useCases = [
  {
    icon: 'lucide:pen-tool',
    title: '个人博客',
    desc: '记录技术文章、生活随笔，支持评论、点赞、RSS 订阅',
    features: ['Twikoo 评论', '文章封面', '标签分类', 'RSS 订阅'],
    color: '#42b883'
  },
  {
    icon: 'lucide:book-open',
    title: '项目文档',
    desc: '为开源项目或团队提供完整的文档站，支持全文搜索',
    features: ['Algolia 搜索', '代码组', 'PWA 离线', '多语言'],
    color: '#3178c6'
  },
  {
    icon: 'lucide:blocks',
    title: '小组件集合',
    desc: '在 Markdown 中直接渲染 Vue 组件，时间线、按钮、卡片等开箱即用，交互即写即得',
    features: ['Vue 组件直渲染', '时间线容器', '代码演示'],
    color: '#aa344d'
  },
  {
    icon: 'lucide:sparkles',
    title: '作品集',
    desc: '展示个人项目、设计稿、摄影作品，支持图片灯箱',
    features: ['Fancybox 灯箱', '相册布局', '音乐播放', '暗色模式'],
    color: '#6366f1'
  }
]

// 功能亮点（左右交错布局）
const highlights = [
  {
    icon: 'lucide:settings-2',
    title: '配置即一切',
    desc: '基于 defu 深合并机制，只需声明想改的字段，其余自动沿用默认值。无需复制整个配置文件，themeConfig 让你精准控制每一个细节。',
    points: ['17 个配置模块', 'defu 深合并', 'TypeScript 类型提示', '热更新支持'],
    codeLang: 'ts',
    code: `// themeConfig.ts
import { defineThemeConfig } from 'vitepress-theme-ninc'

export const themeConfig = defineThemeConfig({
  siteMeta: {
    title: '我的博客',
    site: 'https://blog.example.com',
    lang: 'zh-CN'
  },
  comment: { enable: true, twikoo: { envId: '...' } },
  // 只需声明想改的字段，其余自动补全
  pwa: { enable: true },
  nav: { enable: true }
})`
  },
  {
    icon: 'lucide:code-2',
    title: 'Markdown 扩展',
    desc: '在标准 Markdown 之上扩展了 timeline、radio、button、card 四种容器，并重写表格渲染规则，让你的内容更生动。',
    points: ['时间线容器', '任务清单', '按钮卡片', '表格自动包裹'],
    codeLang: 'ts',
    code: `// .vitepress/config.mts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'

export default defineConfig({}, themeConfig, {
  markdown: {
    timeline: true,           // 时间线容器
    checkbox: true,           // 任务清单 ✓ ✗
    container: ['button', 'card'], // 容器类型
    tableWrap: true           // 表格自动包裹
  },
  // 在 .md 中使用 ::: type 语法即可
  // 例: ::: timeline 2025 年 ... :::
})`
  },
  {
    icon: 'lucide:wifi-off',
    title: 'PWA 离线',
    desc: '自动生成 Service Worker，支持离线访问与可安装到手机桌面。读者即使断网也能浏览已访问的页面。',
    points: ['自动 SW 生成', '可安装应用', '离线缓存', '自动更新'],
    codeLang: 'ts',
    code: `// .vitepress/config.mts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'

export default defineConfig({}, themeConfig, {
  pwa: true,  // 一键开启 PWA
  pwaManifest: {
    name: '我的博客',
    short_name: '博客',
    theme_color: '#42b883',
    display: 'standalone'
  }
})`
  },
  {
    icon: 'lucide:zap',
    title: '自动导入',
    desc: 'unplugin-auto-import + unplugin-vue-components，API 与组件全自动导入，无需手动 import，开发体验丝滑。',
    points: ['API 自动导入', '组件自动注册', '按需引入', 'Tree-shaking'],
    codeLang: 'vue',
    code: `<script setup lang="ts">
// 无需手动 import，API 全自动注入
const count = ref(0)         // ref ← 自动导入
const double = computed(() => count.value * 2)  // computed
watch(count, (v) => console.log('count:', v))   // watch

// useRoute / useData 自动导入
const route = useRoute()
const { theme } = useData()

// 自定义 store 也自动导入
const store = mainStore()
<\/script>`
  }
]

// ---- 轻量级语法高亮（零依赖，同步执行）----
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const TOKEN_RE = /(\/\/[^\n]*|#[^\n]*|<!--[\s\S]*?-->)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(import|export|from|const|let|var|function|return|if|else|for|while|await|async|default|new|class|extends|interface|type)\b|\b(true|false|null|undefined)\b|\b([a-zA-Z_$][\w$]*)(?=\s*\()|\b(\d+\.?\d*)\b/g

function highlightCode(code: string): string {
  let result = ''
  let last = 0
  TOKEN_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = TOKEN_RE.exec(code)) !== null) {
    result += escapeHtml(code.slice(last, m.index))
    const [full, comment, str, kw, bool, fn, num] = m
    if (comment !== undefined) result += `<span class="tok-comment">${escapeHtml(comment)}</span>`
    else if (str !== undefined) result += `<span class="tok-string">${escapeHtml(str)}</span>`
    else if (kw !== undefined) result += `<span class="tok-keyword">${escapeHtml(kw)}</span>`
    else if (bool !== undefined) result += `<span class="tok-boolean">${escapeHtml(bool)}</span>`
    else if (fn !== undefined) result += `<span class="tok-function">${escapeHtml(fn)}</span>`
    else if (num !== undefined) result += `<span class="tok-number">${escapeHtml(num)}</span>`
    else result += escapeHtml(full)
    last = TOKEN_RE.lastIndex
  }
  result += escapeHtml(code.slice(last))
  return result
}

// 预计算高亮 HTML（同步，无闪烁）
const highlightedHtml = highlights.map((h) => highlightCode(h.code))

// 性能数据
const performanceData = [
  { label: 'Lighthouse 评分', value: 98, suffix: '/100', color: '#42b883' },
  { label: '首屏加载', value: 1.2, suffix: 's', decimals: 1, color: '#3178c6' },
  { label: '内置组件', value: 70, suffix: '+', color: '#f69220' },
  { label: 'LCP', value: 1.8, suffix: 's', decimals: 1, color: '#aa344d' }
]

// 对比表
const comparisonData = [
  { feature: 'Vite 驱动 · 毫秒级热更新', ninc: true, others: false },
  { feature: 'Vue 组件嵌入 Markdown（script setup）', ninc: true, others: false },
  { feature: '零配置 TypeScript 全链路', ninc: true, others: false },
  { feature: 'Rollup 生产构建 · Tree-shaking', ninc: true, others: false },
  { feature: 'SPA 开发 + SSG 部署混合渲染', ninc: true, others: false },
  { feature: '原生 ESM 模块支持', ninc: true, others: false },
  { feature: 'defu 配置深合并 · 零冲突定制', ninc: true, others: false },
  { feature: 'API / 组件自动导入', ninc: true, others: false },
  { feature: '主题热插拔 · 无需 fork 源码', ninc: true, others: false },
  { feature: '内置 PWA 离线支持', ninc: true, others: false }
]

// Markdown 扩展展示
const markdownFeatures = [
  { name: 'timeline', desc: '时间线容器', icon: 'lucide:git-commit-vertical' },
  { name: 'radio', desc: '任务清单', icon: 'lucide:check-circle' },
  { name: 'button', desc: 'CTA 按钮', icon: 'lucide:mouse-pointer-click' },
  { name: 'card', desc: '内容卡片', icon: 'lucide:layout-dashboard' },
  { name: 'keybutton', desc: '按键标记', icon: 'lucide:keyboard' },
  { name: 'tabs', desc: '标签页', icon: 'lucide:panel-top' },
  { name: 'attrs', desc: '属性语法', icon: 'lucide:hash' },
  { name: 'code-group', desc: '代码组', icon: 'lucide:code' }
]

const techContainerRef = ref<HTMLElement | null>(null)
const centerNodeRef = ref<HTMLElement | null>(null)
const techRefs = ref<HTMLElement[]>([])

const setTechRef = (el: unknown, i: number) => {
  if (el) techRefs.value[i] = el as HTMLElement
}

const copied = ref(false)
const copyInstall = async () => {
  try {
    await navigator.clipboard.writeText('npx vitepress-theme-ninc init')
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // clipboard 不可用时静默失败
  }
}

let scrollHandler: (() => void) | null = null
let lenisInstance: Lenis | null = null

onMounted(() => {
  // 注册 GSAP ScrollTrigger 插件
  gsap.registerPlugin(ScrollTrigger)

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Reduced motion：直接显示所有 .ninc-reveal 元素，跳过 Lenis 平滑滚动
  if (prefersReducedMotion) {
    document.querySelectorAll('.ninc-reveal').forEach((el) => el.classList.add('is-visible'))
  } else {
    // Lenis 平滑滚动
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    lenisInstance = lenis

    let ticking = false

    const checkReveal = () => {
      ticking = false
      const triggerHeight = window.innerHeight * 0.92

      document.querySelectorAll('.ninc-reveal:not(.is-visible)').forEach((el) => {
        if (el.getBoundingClientRect().top < triggerHeight) {
          el.classList.add('is-visible')
        }
      })
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(checkReveal)
        ticking = true
      }
    }

    scrollHandler = onScroll

    // 延迟首次检查，确保 VitePress hydration 完全完成
    requestAnimationFrame(() => {
      checkReveal()
      window.addEventListener('scroll', onScroll, { passive: true })
    })
  }
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
    scrollHandler = null
  }
  if (lenisInstance) {
    gsap.ticker.remove((time) => lenisInstance!.raf(time * 1000))
    lenisInstance.destroy()
    lenisInstance = null
  }
})
</script>

<template>
  <div class="ninc-home">
    <!-- ===== Hero ===== -->
    <section class="ninc-hero">
      <ParticlesBg class="ninc-hero-particles" :count="40" color="#6366f1" :speed="0.3" :size="2"
        :connect-distance="100" />
      <div class="ninc-hero-bg" aria-hidden="true"></div>
      <div class="ninc-hero-content">
        <!-- <img src="/logo.svg" alt="vitepress-theme-ninc" class="ninc-hero-logo" width="80" height="80" /> -->
        <div class="ninc-badge">
          <Icon icon="lucide:sparkles" />
          <span>基于 VitePress 构建</span>
        </div>
        <SparklesText text="VitePress Theme Ninc" class="ninc-hero-sparkles" :sparkles-count="12"
          :colors="{ first: '#9E7AFF', second: '#FE8BBB' }" />
        <p class="ninc-hero-tagline">
          一个功能丰富的 VitePress 主题 — 开箱即用的博客、文档与工具站
        </p>
        <div class="ninc-hero-actions">
          <a class="ninc-btn ninc-btn-brand" href="/guide/getting-started">
            <Icon icon="lucide:rocket" />
            <span>快速开始</span>
          </a>
          <a class="ninc-btn ninc-btn-alt" href="/config/site-meta">
            <Icon icon="lucide:sliders-horizontal" />
            <span>配置参考</span>
          </a>
          <a class="ninc-btn ninc-btn-alt" href="https://blog.ninc.top" target="_blank" rel="noopener">
            <Icon icon="lucide:external-link" />
            <span>预览博客</span>
          </a>
          <a class="ninc-btn ninc-btn-alt" href="https://github.com/zhChuXiao/vitepress-theme-ninc" target="_blank"
            rel="noopener">
            <Icon icon="mdi:github" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      <!-- Preview（Compare 滑动对比）- 放在 hero-content 外面，不受 max-width 限制 -->
      <div class="ninc-hero-compare">
        <!-- <p class="ninc-section-desc">滑动鼠标对比亮色与暗色模式下的博客首页效果</p> -->
        <div class="ninc-compare-wrap">
          <Compare first-image="/images/image-light.webp" second-image="/images/image-dark.webp" first-alt="亮色模式博客首页"
            second-alt="暗色模式博客首页" first-label="亮色" second-label="暗色" :initial="50" />
        </div>
        <p class="ninc-compare-tip">
          <Icon icon="lucide:mouse-pointer-click" />
          <span>移动鼠标或拖拽中间手柄切换对比</span>
        </p>
      </div>
    </section>

    <!-- ===== Terminal（终端 mockup） ===== -->
    <section class="ninc-section ninc-terminal-section ninc-reveal">
      <div class="ninc-container">
        <div class="ninc-terminal">
          <div class="ninc-terminal-bar">
            <span class="ninc-dot ninc-dot-red"></span>
            <span class="ninc-dot ninc-dot-yellow"></span>
            <span class="ninc-dot ninc-dot-green"></span>
            <span class="ninc-terminal-title">Terminal</span>
            <button class="ninc-copy-btn" @click="copyInstall" title="复制安装命令">
              <Icon :icon="copied ? 'lucide:check' : 'lucide:copy'" />
            </button>
          </div>
          <pre class="ninc-terminal-body"><code><span class="c-comment"># 初始化项目（交互式生成全部文件）</span>
<span class="c-cmd">npx</span> vitepress-theme-ninc init

<span class="c-comment"># 安装依赖并启动</span>
<span class="c-cmd">pnpm</span> install
<span class="c-cmd">pnpm</span> dev<span class="ninc-cursor"></span></code></pre>
        </div>
      </div>
    </section>

    <!-- ===== Tech Stack (Animated Beam) ===== -->
    <section class="ninc-section ninc-tech-stack ninc-reveal">
      <div class="ninc-container">
        <h2 class="ninc-section-title">由 VitePress 驱动</h2>
        <p class="ninc-section-desc">直接在 Markdown 中使用 Vue 语法和组件，将 Markdown 变成优雅的博客，只需几分钟。</p>
        <div ref="techContainerRef" class="ninc-tech-wrap">
          <!-- AnimatedBeam 连接 -->
          <AnimatedBeam v-for="(tech, i) in techStack" :key="`beam-${i}`" :container-ref="techContainerRef"
            :from-ref="centerNodeRef" :to-ref="techRefs[i] || null" :curvature="30" :duration="3 + i * 0.7"
            :gradient-start-color="tech.beamStart" :gradient-stop-color="tech.beamStop" />

          <!-- 中心节点 -->
          <div class="ninc-tech-center">
            <div ref="centerNodeRef" class="ninc-tech-center-inner">
              <img src="/images/avatar.jpg" alt="avatar" class="ninc-tech-center-avatar" />
            </div>
            <span class="ninc-tech-center-label">theme-ninc</span>
          </div>

          <!-- 周围技术栈节点 -->
          <div v-for="(tech, i) in techStack" :key="tech.name" class="ninc-tech-node" :class="`ninc-tech-node-${i}`">
            <div :ref="(el) => setTechRef(el, i)" class="ninc-tech-node-inner" :style="{ '--node-color': tech.color }">
              <img v-if="tech.icon.startsWith('/')" :src="tech.icon" :alt="tech.name"
                class="ninc-tech-node-icon ninc-tech-node-img" />
              <Icon v-else :icon="tech.icon" class="ninc-tech-node-icon" />
            </div>
            <span class="ninc-tech-node-label">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Scroll Showcase (横向视差滚动) ===== -->
    <ScrollShowcase />

    <!-- ===== Use Cases ===== -->
    <section class="ninc-section ninc-use-cases">
      <div class="ninc-container">
        <ScrollReveal :y="30">
          <h2 class="ninc-section-title">使用场景</h2>
          <p class="ninc-section-desc">一个主题，多种用途</p>
        </ScrollReveal>
        <div class="ninc-usecase-grid">
          <ScrollReveal v-for="(uc, i) in useCases" :key="uc.title" :delay="i * 0.1" :y="40">
            <TiltCard :max="12" class="ninc-usecase-card">
              <GlowCard :color="uc.color" :size="280">
                <div class="ninc-usecase-inner">
                  <div class="ninc-usecase-icon" :style="{ '--uc-color': uc.color }">
                    <Icon :icon="uc.icon" />
                  </div>
                  <h3>{{ uc.title }}</h3>
                  <p>{{ uc.desc }}</p>
                  <ul class="ninc-usecase-features">
                    <li v-for="f in uc.features" :key="f">
                      <Icon icon="lucide:check" />
                      <span>{{ f }}</span>
                    </li>
                  </ul>
                </div>
              </GlowCard>
            </TiltCard>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <!-- ===== Highlights ===== -->
    <section class="ninc-section ninc-highlights">
      <div class="ninc-container">
        <ScrollReveal :y="30">
          <h2 class="ninc-section-title">功能亮点</h2>
          <p class="ninc-section-desc">深入了解主题的核心能力</p>
        </ScrollReveal>
        <div class="ninc-highlights-list">
          <ScrollReveal v-for="(h, i) in highlights" :key="h.title" :delay="0.05" :y="50">
            <div class="ninc-highlight-row" :class="{ 'ninc-highlight-reverse': i % 2 === 1 }">
              <div class="ninc-highlight-content">
                <div class="ninc-highlight-icon">
                  <Icon :icon="h.icon" />
                </div>
                <h3>{{ h.title }}</h3>
                <p>{{ h.desc }}</p>
                <ul class="ninc-highlight-points">
                  <li v-for="p in h.points" :key="p">
                    <Icon icon="lucide:arrow-right" />
                    <span>{{ p }}</span>
                  </li>
                </ul>
              </div>
              <div class="ninc-highlight-visual">
                <div class="ninc-highlight-window">
                  <div class="ninc-highlight-dots">
                    <span class="ninc-dot ninc-dot-r" />
                    <span class="ninc-dot ninc-dot-y" />
                    <span class="ninc-dot ninc-dot-g" />
                    <span class="ninc-highlight-lang">{{ h.codeLang }}</span>
                  </div>
                  <pre class="ninc-highlight-code"><code v-html="highlightedHtml[i]" /></pre>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <!-- ===== Features ===== -->
    <section class="ninc-section ninc-features ninc-reveal">
      <div class="ninc-container">
        <h2 class="ninc-section-title">核心功能</h2>
        <p class="ninc-section-desc">12 个内置功能模块，覆盖博客、工具站、数据可视化等多种场景</p>
        <div class="ninc-feature-grid">
          <div v-for="(f, i) in features" :key="f.title" class="ninc-feature-card"
            :style="{ transitionDelay: `${i * 45}ms` }">
            <div class="ninc-feature-icon-wrap">
              <Icon :icon="f.icon" class="ninc-feature-icon" />
            </div>
            <h3 class="ninc-feature-title">{{ f.title }}</h3>
            <p class="ninc-feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Performance ===== -->
    <section class="ninc-section ninc-performance">
      <div class="ninc-container">
        <ScrollReveal :y="30">
          <h2 class="ninc-section-title">性能数据</h2>
          <p class="ninc-section-desc">极速加载，丝滑体验</p>
        </ScrollReveal>
        <div class="ninc-perf-grid">
          <ScrollReveal v-for="(p, i) in performanceData" :key="p.label" :delay="i * 0.1" :y="40">
            <div class="ninc-perf-card">
              <div class="ninc-perf-number" :style="{ color: p.color }">
                <NumberCount :target="p.value" :suffix="p.suffix" :decimals="p.decimals || 0" :duration="2000" />
              </div>
              <div class="ninc-perf-label">{{ p.label }}</div>
              <div class="ninc-perf-bar">
                <div class="ninc-perf-bar-fill"
                  :style="{ '--bar-color': p.color, width: p.value <= 100 ? p.value + '%' : '95%' }" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <!-- ===== Markdown Showcase ===== -->
    <section class="ninc-section ninc-markdown-show">
      <div class="ninc-container">
        <ScrollReveal :y="30">
          <h2 class="ninc-section-title">Markdown 扩展</h2>
          <p class="ninc-section-desc">在标准 Markdown 之上，主题内置了 8 种扩展语法</p>
        </ScrollReveal>
        <div class="ninc-md-grid">
          <ScrollReveal v-for="(m, i) in markdownFeatures" :key="m.name" :delay="i * 0.05" :y="30">
            <GlowCard color="#6366f1" :size="200" class="ninc-md-card">
              <div class="ninc-md-inner">
                <Icon :icon="m.icon" class="ninc-md-icon" />
                <code class="ninc-md-name">{{ m.name }}</code>
                <span class="ninc-md-desc">{{ m.desc }}</span>
              </div>
            </GlowCard>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <!-- ===== Comparison ===== -->
    <section class="ninc-section ninc-comparison">
      <div class="ninc-container">
        <ScrollReveal :y="30">
          <h2 class="ninc-section-title">主题对比</h2>
          <p class="ninc-section-desc">VitePress 生态 vs 传统文档方案</p>
        </ScrollReveal>
        <ScrollReveal :y="50">
          <div class="ninc-compare-table">
            <table>
              <thead>
                <tr>
                  <th>框架特性</th>
                  <th class="ninc-col-ninc">theme-ninc</th>
                  <th class="ninc-col-ninc">传统方案</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in comparisonData" :key="row.feature">
                  <td>{{ row.feature }}</td>
                  <td class="ninc-col-ninc">
                    <Icon :icon="row.ninc ? 'lucide:check-circle-2' : 'lucide:x-circle'"
                      :class="row.ninc ? 'ninc-yes' : 'ninc-no'" />
                  </td>
                  <td class="ninc-col-ninc">
                    <Icon :icon="row.others ? 'lucide:check-circle-2' : 'lucide:x-circle'"
                      :class="row.others ? 'ninc-yes' : 'ninc-no'" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <!-- ===== Quick Start ===== -->
    <section class="ninc-section ninc-quick-start ninc-reveal">
      <div class="ninc-container">
        <h2 class="ninc-section-title">三步上手</h2>
        <p class="ninc-section-desc">从安装到发布，5 分钟搞定</p>
        <div class="ninc-steps">
          <div class="ninc-step">
            <div class="ninc-step-header">
              <Icon icon="lucide:terminal" class="ninc-step-icon" />
              <span class="ninc-step-label">初始化</span>
            </div>
            <pre class="ninc-code-block"><code><span class="c-cmd">npx</span> vitepress-theme-ninc init</code></pre>
          </div>
          <div class="ninc-step">
            <div class="ninc-step-header">
              <Icon icon="lucide:download" class="ninc-step-icon" />
              <span class="ninc-step-label">安装</span>
            </div>
            <pre class="ninc-code-block"><code><span class="c-cmd">pnpm</span> install</code></pre>
          </div>
          <div class="ninc-step">
            <div class="ninc-step-header">
              <Icon icon="lucide:play" class="ninc-step-icon" />
              <span class="ninc-step-label">启动</span>
            </div>
            <pre class="ninc-code-block"><code><span class="c-cmd">pnpm</span> dev</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Stats ===== -->
    <section class="ninc-section ninc-stats ninc-reveal">
      <div class="ninc-stats-grid">
        <div v-for="(s, i) in stats" :key="s.label" class="ninc-stat">
          <div class="ninc-stat-number" :data-index="i">
            <NumberCount :target="s.value" :suffix="s.suffix" :duration="2500" />
          </div>
          <div class="ninc-stat-label">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <!-- ===== CTA ===== -->
    <section class="ninc-section ninc-cta ninc-reveal">
      <div class="ninc-container">
        <h2 class="ninc-cta-title">开始你的博客之旅</h2>
        <p class="ninc-cta-desc">跟随快速上手指南，5 分钟拥有一个功能完整的博客</p>
        <div class="ninc-hero-actions">
          <MagneticButton :strength="0.4" :radius="80" class="ninc-cta-magnetic">
            <a class="ninc-btn ninc-btn-brand ninc-btn-lg ninc-cta-btn" href="/guide/getting-started">
              <Icon icon="lucide:rocket" />
              <span>立即开始</span>
            </a>
          </MagneticButton>
          <a class="ninc-btn ninc-btn-alt ninc-btn-lg" href="https://blog.ninc.top" target="_blank" rel="noopener">
            <Icon icon="lucide:external-link" />
            <span>预览博客</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ===== 通用容器 ===== */
.ninc-container {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ===== Hero ===== */
.ninc-hero {
  position: relative;
  overflow: hidden;
  padding: 80px 24px 30px;
}

.ninc-hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

/* 点阵背景 */
.ninc-hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--vp-c-border) 1px, transparent 1px);
  background-size: 24px 24px;
  opacity: 0.5;
  -webkit-mask-image: radial-gradient(ellipse 60% 50% at center, black 30%, transparent 75%);
  mask-image: radial-gradient(ellipse 60% 50% at center, black 30%, transparent 75%);
}

/* 径向光晕（缓慢呼吸动画） */
.ninc-hero-bg::after {
  content: '';
  position: absolute;
  top: -10%;
  left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: 500px;
  background: radial-gradient(ellipse at center, var(--vp-c-brand-soft) 0%, transparent 70%);
  opacity: 0.7;
  filter: blur(30px);
  animation: ninc-glow 6s ease-in-out infinite;
}

@keyframes ninc-glow {

  0%,
  100% {
    opacity: 0.55;
    transform: translateX(-50%) scale(1);
  }

  50% {
    opacity: 0.8;
    transform: translateX(-50%) scale(1.08);
  }
}

.ninc-hero-content {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
}

.ninc-hero-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
  filter: drop-shadow(0 4px 12px rgba(60, 135, 114, 0.25));
  animation: ninc-float 4s ease-in-out infinite;
}

@keyframes ninc-float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

.ninc-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 14px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 20px;
}

.ninc-badge .iconify {
  font-size: 14px;
  color: var(--vp-c-brand-1);
}

.ninc-hero-title {
  font-size: clamp(2.2rem, 5.5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, #6366f1 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ninc-hero-sparkles {
  font-size: clamp(2.2rem, 5.5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
}

/* 渐变文字必须作用在「直接包含文字的元素」上，否则 Safari 会因 -webkit-text-fill-color
   继承到子 span 而让文字透明（外层 div 没有直接文本，background-clip: text 切割不到任何东西，
   Chrome 的「穿透」行为是非标准实现）。这里用 :deep() 穿透 scoped 到 SparklesText 内层 span。 */
.ninc-hero-sparkles :deep(> span) {
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, #6366f1 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  /* Safari 多行渐变文字断裂修复 */
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}

.ninc-hero-tagline {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 auto 32px;
}

.ninc-hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ===== 按钮 ===== */
.ninc-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid transparent;
  transition: background-color 0.25s, border-color 0.25s, color 0.25s, transform 0.25s;
  cursor: pointer;
}

.ninc-btn .iconify {
  font-size: 1.1em;
}

.ninc-btn-brand {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.ninc-btn-brand:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.ninc-btn-alt {
  border-color: var(--vp-c-border);
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
}

.ninc-btn-alt:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.ninc-btn-lg {
  padding: 14px 32px;
  font-size: 16px;
  border-radius: 24px;
}

/* ===== Hero Compare 区域 ===== */
.ninc-hero-compare {
  margin-top: 48px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 24px;
}

.ninc-hero-compare .ninc-section-desc {
  margin-bottom: 24px;
  font-size: clamp(0.875rem, 2vw, 1rem);
  text-align: center;
}

/* ===== 终端 mockup ===== */
.ninc-terminal {
  max-width: 520px;
  margin: 0 auto;
  border: 1px solid #313244;
  border-radius: 12px;
  overflow: hidden;
  background: #1e1e2e;
  text-align: left;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* ===== Terminal Section ===== */
.ninc-terminal-section {
  background: var(--vp-c-bg);
}

.ninc-terminal-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid #313244;
  background: #181825;
}

.ninc-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ninc-dot-red {
  background: #ff5f57;
}

.ninc-dot-yellow {
  background: #febc2e;
}

.ninc-dot-green {
  background: #28c840;
}

.ninc-terminal-title {
  margin-left: auto;
  margin-right: auto;
  font-size: 12px;
  color: #6c7086;
  font-family: var(--vp-font-family-mono);
}

.ninc-copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #6c7086;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s, background-color 0.2s;
}

.ninc-copy-btn:hover {
  color: #cdd6f4;
  background: #313244;
}

.ninc-copy-btn .iconify {
  font-size: 14px;
}

.ninc-terminal-body {
  padding: 16px 20px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.7;
  color: #cdd6f4;
  margin: 0;
  overflow-x: auto;
}

.ninc-terminal-body .c-comment {
  color: #6c7086;
}

.ninc-terminal-body .c-cmd {
  color: #89b4fa;
  font-weight: 600;
}

/* 终端光标闪烁 */
.ninc-cursor {
  display: inline-block;
  width: 7px;
  height: 14px;
  background: #cdd6f4;
  margin-left: 3px;
  vertical-align: text-bottom;
  animation: ninc-blink 1.1s steps(2) infinite;
}

@keyframes ninc-blink {

  0%,
  50% {
    opacity: 1;
  }

  51%,
  100% {
    opacity: 0;
  }
}

/* ===== Section 通用 ===== */
.ninc-section {
  padding: 10px 0 80px 0;
}

.ninc-section-title {
  font-size: clamp(1.6rem, 3vw, 2rem);
  font-weight: 700;
  text-align: center;
  margin: 0 0 12px;
  letter-spacing: -0.01em;
}

.ninc-section-desc {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  text-align: center;
  margin: 0 auto 48px;
  /* max-width: 550px; */
  line-height: 1.6;
}

/* ===== Tech Stack (Animated Beam) ===== */
.ninc-tech-stack {
  background: var(--vp-c-bg);
  overflow: hidden;
  position: relative;
}

.ninc-tech-wrap {
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  height: 480px;
}

.ninc-tech-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 3;
}

.ninc-tech-center-inner {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--vp-c-brand-1), #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  overflow: hidden;
  box-shadow:
    0 8px 32px rgba(99, 102, 241, 0.3),
    0 0 0 4px var(--vp-c-bg),
    0 0 0 5px var(--vp-c-brand-1);
  transition: transform 0.3s ease;
}

.ninc-tech-center:hover .ninc-tech-center-inner {
  transform: scale(1.06);
}

.ninc-tech-center-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.ninc-tech-center-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  padding: 4px 12px;
  border-radius: 16px;
  border: 1px solid var(--vp-c-border);
  white-space: nowrap;
}

.ninc-tech-node {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 3;
}

.ninc-tech-node-inner {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  border: 2px solid var(--node-color, var(--vp-c-border));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.ninc-tech-node:hover .ninc-tech-node-inner {
  transform: scale(1.12);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.14);
}

.ninc-tech-node-icon {
  font-size: 28px;
}

.ninc-tech-node-img {
  width: 1em;
  height: 1em;
  object-fit: contain;
}

.ninc-tech-node-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-border);
  white-space: nowrap;
}

/* 6 个节点的环绕位置（六边形布局） */
.ninc-tech-node-0 {
  top: 8%;
  left: 12%;
}

.ninc-tech-node-1 {
  top: 8%;
  right: 12%;
}

.ninc-tech-node-2 {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.ninc-tech-node-3 {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}

.ninc-tech-node-4 {
  bottom: 8%;
  left: 12%;
}

.ninc-tech-node-5 {
  bottom: 8%;
  right: 12%;
}

/* ===== Tech Stack 响应式 ===== */
@media (max-width: 768px) {
  .ninc-tech-wrap {
    height: 400px;
  }

  .ninc-tech-center-inner {
    width: 72px;
    height: 72px;
  }

  .ninc-tech-node-inner {
    width: 44px;
    height: 44px;
  }

  .ninc-tech-node-icon {
    font-size: 22px;
  }

  .ninc-tech-node-label {
    font-size: 10px;
    padding: 1px 6px;
  }
}

@media (max-width: 480px) {
  .ninc-tech-wrap {
    height: 340px;
  }

  .ninc-tech-node-0 {
    top: 4%;
    left: 4%;
  }

  .ninc-tech-node-1 {
    top: 4%;
    right: 4%;
  }

  .ninc-tech-node-4 {
    bottom: 4%;
    left: 4%;
  }

  .ninc-tech-node-5 {
    bottom: 4%;
    right: 4%;
  }

  .ninc-tech-center-inner {
    width: 64px;
    height: 64px;
  }

  .ninc-tech-node-inner {
    width: 40px;
    height: 40px;
  }

  .ninc-tech-node-icon {
    font-size: 20px;
  }
}

/* ===== Features ===== */
.ninc-features {
  background: var(--vp-c-bg);
}

.ninc-feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.ninc-feature-card {
  padding: 24px;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg);
  transition: border-color 0.3s, background-color 0.3s, transform 0.3s;
}

.ninc-feature-card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
  transform: translateY(-2px);
}

.ninc-feature-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--vp-c-brand-soft);
  margin-bottom: 16px;
  transition: transform 0.3s;
}

.ninc-feature-card:hover .ninc-feature-icon-wrap {
  transform: scale(1.08);
}

.ninc-feature-icon {
  font-size: 22px;
  color: var(--vp-c-brand-1);
  transition: transform 0.3s;
}

.ninc-feature-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.ninc-feature-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}

/* ===== Compare（滑动对比） ===== */
.ninc-compare-wrap {
  max-width: 1200px;
  margin: 0 auto;
}

.ninc-compare-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 16px;
  color: var(--vp-c-text);
}

.ninc-compare-tip .iconify {
  font-size: 15px;
  color: var(--vp-c-brand-1);
}

/* ===== Quick Start ===== */
.ninc-quick-start {
  background: var(--vp-c-bg);
}

.ninc-steps {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.ninc-step-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.ninc-step-icon {
  font-size: 20px;
  color: var(--vp-c-brand-1);
}

.ninc-code-block {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 16px 20px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  margin: 0;
  color: var(--vp-c-text-1);
}

.ninc-code-block .c-comment {
  color: var(--vp-c-text-3);
}

.ninc-code-block .c-cmd {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.ninc-code-block .c-kw {
  color: var(--vp-c-brand-1);
}

.ninc-code-block .c-str {
  color: var(--vp-c-green-1);
}

/* ===== Stats ===== */
.ninc-stats {
  padding: 56px 24px;
  border-top: 1px solid var(--vp-c-border);
  border-bottom: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
}

.ninc-stats-grid {
  max-width: 720px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  text-align: center;
}

.ninc-stat-number {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, var(--vp-c-brand-1), #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-variant-numeric: tabular-nums;
}

.ninc-stat-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-top: 8px;
}

/* ===== CTA ===== */
.ninc-cta {
  text-align: center;
  padding: 80px 24px;
  background: var(--vp-c-bg);
}

.ninc-cta-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 700;
  margin: 0 0 12px;
  letter-spacing: -0.01em;
}

.ninc-cta-desc {
  color: var(--vp-c-text-2);
  margin: 0 auto 32px;
  font-size: 1rem;
  line-height: 1.6;
}

/* Scroll Reveal 与 stagger 样式见文件末尾非 scoped 全局样式 */

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .ninc-hero {
    padding: 60px 20px 40px;
  }

  .ninc-section {
    /* padding: 60px 0; */
  }

  .ninc-hero-compare {
    margin-top: 32px;
    padding: 0 20px;
  }
}

/* ===== Hero ParticlesBg ===== */
.ninc-hero-particles {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.5;
  pointer-events: none;
}

/* ===== Use Cases ===== */
.ninc-use-cases {
  background: var(--vp-c-bg);
}

.ninc-usecase-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 40px;
}

.ninc-usecase-card {
  height: 100%;
}

.ninc-usecase-inner {
  padding: 28px 24px;
  height: 100%;
}

.ninc-usecase-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--uc-color, #6366f1) 15%, transparent);
  color: var(--uc-color, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 16px;
}

.ninc-usecase-inner h3 {
  font-size: 18px;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.ninc-usecase-inner p {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0 0 16px;
  line-height: 1.6;
}

.ninc-usecase-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ninc-usecase-features li {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  padding: 3px 10px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
}

.ninc-usecase-features li :deep(svg),
.ninc-usecase-features li .iconify {
  font-size: 12px;
  color: var(--uc-color, #6366f1);
}

/* ===== Highlights ===== */
.ninc-highlights {
  background: var(--vp-c-bg);
}

.ninc-highlights-list {
  display: flex;
  flex-direction: column;
  gap: 80px;
  margin-top: 60px;
}

.ninc-highlight-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.ninc-highlight-reverse {
  direction: rtl;
}

.ninc-highlight-reverse>* {
  direction: ltr;
}

.ninc-highlight-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 20px;
}

.ninc-highlight-content h3 {
  font-size: 26px;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
}

.ninc-highlight-content p {
  font-size: 15px;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin: 0 0 20px;
}

.ninc-highlight-points {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.ninc-highlight-points li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.ninc-highlight-points li .iconify {
  color: var(--vp-c-brand-1);
}

.ninc-highlight-visual {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  display: flex;
}

.ninc-highlight-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--vp-code-block-bg);
}

.ninc-highlight-dots {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.ninc-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.ninc-dot-r {
  background: #ff5f56;
}

.ninc-dot-y {
  background: #ffbd2e;
}

.ninc-dot-g {
  background: #27c93f;
}

.ninc-highlight-lang {
  margin-left: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ninc-highlight-code {
  flex: 1;
  margin: 0;
  padding: 20px 24px;
  overflow: auto;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.7;
}

.ninc-highlight-code code {
  font-family: inherit;
  white-space: pre;
}

/* ===== Performance ===== */
.ninc-performance {
  background: var(--vp-c-bg);
}

.ninc-perf-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 40px;
}

.ninc-perf-card {
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  text-align: center;
}

.ninc-perf-number {
  font-size: 36px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  margin-bottom: 8px;
}

.ninc-perf-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 16px;
}

.ninc-perf-bar {
  height: 4px;
  background: var(--vp-c-divider);
  border-radius: 2px;
  overflow: hidden;
}

.ninc-perf-bar-fill {
  height: 100%;
  background: var(--bar-color, var(--vp-c-brand-1));
  border-radius: 2px;
  transition: width 1.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ===== Markdown Showcase ===== */
.ninc-markdown-show {
  background: var(--vp-c-bg);
}

.ninc-md-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 40px;
}

.ninc-md-card {
  height: 100%;
}

.ninc-md-inner {
  padding: 24px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.ninc-md-icon {
  font-size: 28px;
  color: var(--vp-c-brand-1);
}

.ninc-md-name {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  padding: 2px 10px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
}

.ninc-md-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

/* ===== Comparison ===== */
.ninc-comparison {
  background: var(--vp-c-bg);
}

.ninc-compare-table {
  margin-top: 40px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  overflow: hidden;
}

.ninc-compare-table table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

.ninc-compare-table th,
.ninc-compare-table td {
  padding: 14px 20px;
  text-align: left;
  border-bottom: 1px solid var(--vp-c-divider);
}

.ninc-compare-table th {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
  font-size: 14px;
}

.ninc-compare-table td {
  font-size: 14px;
}

.ninc-col-ninc {
  text-align: center !important;
  width: 140px;
}

.ninc-yes {
  color: var(--vp-c-green-1);
  font-size: 20px;
}

.ninc-no {
  color: var(--vp-c-text-3);
  font-size: 20px;
  opacity: 0.5;
}

/* ===== CTA MagneticButton ===== */
.ninc-cta-magnetic {
  background: transparent;
  border: none;
  padding: 0;
}

.ninc-cta-btn {
  display: inline-flex;
}

/* ===== 新增 section 响应式 ===== */
@media (max-width: 1024px) {
  .ninc-usecase-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .ninc-perf-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .ninc-md-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .ninc-highlight-row {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .ninc-highlight-reverse {
    direction: ltr;
  }
}

@media (max-width: 640px) {
  .ninc-usecase-grid {
    grid-template-columns: 1fr;
  }

  .ninc-perf-grid {
    grid-template-columns: 1fr;
  }

  .ninc-md-grid {
    grid-template-columns: 1fr;
  }

  .ninc-highlight-points {
    grid-template-columns: 1fr;
  }

  .ninc-highlights-list {
    gap: 50px;
  }
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {

  .ninc-hero-logo,
  .ninc-hero-bg::after,
  .ninc-cursor {
    animation: none;
  }

  .ninc-perf-bar-fill {
    transition: none;
  }
}
</style>

<!-- 全局样式：隐藏 VitePress 默认的 Hero 和 Features（仅在 home 布局时渲染） -->
<style>
.ninc-home~.VPHero,
.ninc-home~.VPFeatures {
  display: none !important;
}

/* 语法高亮 token 颜色（全局样式，确保 v-html 注入的 span 生效） */
.tok-comment {
  color: #6a737d;
  font-style: italic;
}

.tok-string {
  color: #0a7d28;
}

.tok-keyword {
  color: #7c4dff;
}

.tok-function {
  color: #1565c0;
}

.tok-number {
  color: #c2185b;
}

.tok-boolean {
  color: #c2185b;
}

.dark .tok-comment {
  color: #8b949e;
}

.dark .tok-string {
  color: #7ee787;
}

.dark .tok-keyword {
  color: #bc9cff;
}

.dark .tok-function {
  color: #79c0ff;
}

.dark .tok-number {
  color: #f0883e;
}

.dark .tok-boolean {
  color: #f0883e;
}

/* ===== Scroll Reveal（全局样式，避免 scoped 在 SSR hydration 下优先级问题） ===== */
.ninc-home .ninc-reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.ninc-home .ninc-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Feature 卡片 stagger 淡入（section 可见后逐个出现，延迟通过内联 transitionDelay 设置） */
.ninc-home .ninc-features .ninc-feature-card {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s ease, border-color 0.3s, background-color 0.3s;
}

.ninc-home .ninc-features.is-visible .ninc-feature-card {
  opacity: 1;
  transform: translateY(0);
}

.ninc-home .ninc-features.is-visible .ninc-feature-card:hover {
  transform: translateY(-2px);
}

/* Reduced Motion：禁用所有动画 */
@media (prefers-reduced-motion: reduce) {

  .ninc-home .ninc-reveal,
  .ninc-home .ninc-features .ninc-feature-card {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>
