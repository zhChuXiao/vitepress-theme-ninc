/**
 * 图标字段解析工具
 *
 * 主题所有配置项的 `icon` 字段统一支持三种写法：
 *   1. 字符串（向后兼容，走字体图标）：`icon: 'github'`
 *   2. 字符串带前缀（走 SVG 图标，最简洁）：`icon: 'svg:github'`
 *   3. 对象（最明确）：`icon: { type: 'svg', name: 'github' }` 或 `icon: { type: 'font', name: 'github' }`
 *
 * 字体图标：依赖主题内置的 iconfont.scss + .woff2 字体文件，类名 `.icon-{name}`
 *   用户只能使用主题预置的图标，无法自行扩展（除非改源码）
 * SVG 图标：依赖 vite-plugin-svg-icons，扫描用户项目 public/svg/ 目录
 *   用户只需把 .svg 文件丢进去就能用，文件名即图标名
 */

/** 解析后的图标描述 */
export interface ResolvedIcon {
  /** 图标类型：font=字体图标，svg=SVG 图标 */
  type: 'font' | 'svg'
  /** 图标名（不含前缀）：字体图标对应 iconfont 类名，SVG 图标对应文件名 */
  name: string
}

/** icon 字段的合法类型（string 或对象） */
export type IconField = string | ResolvedIcon | undefined | null

/**
 * 把配置项里的 icon 字段解析为统一格式
 *
 * @param icon 用户配置的 icon 字段
 * @returns 解析后的图标描述，输入为空则返回 null
 *
 * @example
 * resolveIcon('github')        // { type: 'font', name: 'github' }
 * resolveIcon('svg:github')    // { type: 'svg', name: 'github' }
 * resolveIcon({ type: 'svg', name: 'github' })  // { type: 'svg', name: 'github' }
 * resolveIcon(undefined)       // null
 */
export function resolveIcon(icon: IconField): ResolvedIcon | null {
  if (!icon) return null

  // 字符串写法：检测 svg: 前缀
  if (typeof icon === 'string') {
    if (icon.startsWith('svg:')) {
      const name = icon.slice(4).trim()
      return name ? { type: 'svg', name } : null
    }
    return { type: 'font', name: icon }
  }

  // 对象写法：直接返回（保留 type 与 name 字段）
  if (icon && typeof icon === 'object' && icon.name) {
    return { type: icon.type === 'svg' ? 'svg' : 'font', name: icon.name }
  }

  return null
}
