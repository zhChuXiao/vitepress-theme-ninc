// 主题配置工厂函数 - 深合并用户配置与默认配置
// 用法：export const themeConfig = defineThemeConfig({ siteMeta: { ... } })
import { defu } from 'defu'
import { defaultThemeConfig } from './defaultThemeConfig'
import type { ThemeConfig, UserThemeConfig } from '../types/index'

/**
 * 定义主题配置
 *
 * 将用户传入的配置与默认主题配置深合并。
 * 用户只需提供想覆盖的字段，其余自动使用默认值。
 *
 * @param userConfig 用户自定义配置（所有字段可选）
 * @returns 合并后的完整主题配置
 *
 * @example
 * ```ts
 * export const themeConfig = defineThemeConfig({
 *   siteMeta: {
 *     title: '我的博客',
 *     site: 'https://my-blog.com'
 *   },
 *   comment: {
 *     enable: true,
 *     twikoo: { envId: 'https://your-twikoo.example.com' }
 *   }
 * })
 * ```
 */
export function defineThemeConfig(userConfig: UserThemeConfig = {}): ThemeConfig {
  return defu(userConfig, defaultThemeConfig) as ThemeConfig
}
