// 虚拟模块类型声明
declare module 'virtual:local-icons' {
  import type { IconifyIcon } from '@iconify/vue'
  export const localIcons: Record<string, IconifyIcon>
}
