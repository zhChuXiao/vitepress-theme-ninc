// 文档站主题入口
// 使用 VitePress 默认主题，注入代码组图标 CSS、Markdown 扩展样式、Iconify 图标组件、自定义首页
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { Icon } from '@iconify/vue'
import 'virtual:group-icons.css'
import './markdown-extensions.css'
import CustomHome from './components/CustomHome.vue'

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
  }
}
