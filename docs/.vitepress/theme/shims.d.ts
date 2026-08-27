// 虚拟模块类型声明
declare module 'virtual:local-icons' {
  import type { IconifyIcon } from '@iconify/vue'
  export const localIcons: Record<string, IconifyIcon>
}

// 构建期注入的全局常量（见 docs/.vitepress/config.mts 的 vite.define）
declare const __THEME_VERSION__: string
