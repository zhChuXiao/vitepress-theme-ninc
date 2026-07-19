// 主题客户端入口
// 用户通过 import Theme from 'vitepress-theme-ninc' 使用
// 注册 Pinia / InstantSearch / 路由守卫 / 全局组件 / 样式 / 自动导入
import { h } from 'vue'
import { createPinia } from 'pinia'
import { useData, useRoute } from 'vitepress'
import { routeChange } from './utils/initTools'
import { printCopyright } from './utils/printCopyright'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'
import LazyLoader from './components/LazyLoader.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import InstantSearch from 'vue-instantsearch/vue3/es'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 全局样式
import 'nprogress/nprogress.css'
import 'virtual:group-icons.css'
import './styles/cursor.scss'
import './styles/element.scss'
import './styles/element_dark.scss'
import './styles/RobotoMemo.css'
import './styles/index.scss'
import './styles/main.scss'

// SVG 雪碧图
import 'virtual:svg-icons-register'

// 折叠代码块样式
import './utils/codeblocks-fold/index.scss'

// 根布局组件
import App from './App.vue'

// 创建 Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

/**
 * 51la 站点统计脚本注入
 * 仅在生产环境 + 客户端运行，且用户在 themeConfig.tongji['51la'] 配置了 id 时才注入
 */
function inject51La(tongji: Record<string, string> = {}) {
  const laId = tongji['51la']
  if (!laId) return
  const script = document.createElement('script')
  script.id = 'LA_COLLECT'
  script.src = '/js-sdk-pro.min.js'
  script.onload = () => {
    // eslint-disable-next-line no-undef
    ;(window as any).LA?.init({ id: laId, ck: laId, autoTrack: true })
  }
  document.head.appendChild(script)
}

// 主题对象（VitePress Theme 约定）
const Theme = {
  Layout: () => h(App),
  enhanceApp(ctx: any) {
    const { app, router, siteData } = ctx
    // Pinia
    app.use(pinia)
    // InstantSearch（Algolia 搜索 UI）
    app.use(InstantSearch, { locale: zhCn })
    // 全局组件
    app.component('LazyLoader', LazyLoader)
    // vitepress-plugin-tabs 客户端增强
    enhanceAppWithTabs(app)

    // 路由守卫：切换前后触发加载动画与跳转中转
    router.onBeforeRouteChange = (to: string) => {
      routeChange('before', to)
    }
    router.onAfterRouteChanged = (to: string) => {
      routeChange('after', to)
    }

    // 51la 统计：生产环境 + 客户端 + 用户配置了 id 时注入
    // 注意：enhanceApp 阶段不可调用 useData()（app 尚未注入 data，会抛
    // "vitepress data not properly injected in app" 并阻断 hydration），
    // themeConfig 从 ctx.siteData 获取（useData().theme 同源）
    if (import.meta.env.PROD && !import.meta.env.SSR) {
      inject51La(siteData.value?.themeConfig?.tongji)
    }

    // 控制台版权输出（仅客户端，函数内部已判断 SSR）
    printCopyright()
  },
  setup() {
    const { frontmatter } = useData()
    const route = useRoute()
    // 占位：未来可在此处放置全局 onMounted 逻辑
    void frontmatter
    void route
  }
}

export default Theme
