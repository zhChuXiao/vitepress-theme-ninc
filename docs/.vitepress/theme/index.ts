// 文档站主题入口
// 使用 VitePress 默认主题，注入代码组图标 CSS、Markdown 扩展样式、Iconify 图标组件、自定义首页
// 所有 Iconify 图标均通过本地 @iconify-json/* 包提供，无运行时在线请求
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { Icon, addIcon } from '@iconify/vue'
import 'virtual:group-icons.css'
import './markdown-extensions.css'
import CustomHome from './components/CustomHome.vue'
import { localIcons } from 'virtual:local-icons'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 在 home 布局的 hero 之前注入自定义首页内容
      'home-hero-before': () => h(CustomHome)
    })
  },
  enhanceApp({ app }) {
    // 全局注册 Iconify 图标组件，在 markdown 中可直接使用 <Icon icon="lucide:xxx" />
    app.component('Icon', Icon)

    // 注册本地图标数据到 Iconify 运行时存储
    // enhanceApp 在 SSR 与客户端都会执行，可保证首屏 HTML 即包含 SVG，避免 hydration 闪烁
    for (const [name, data] of Object.entries(localIcons)) {
      addIcon(name, data)
    }
  }
}
