// VitePress 配置 —— 由 vitepress-theme-ninc init 生成
// 文档：https://theme.ninc.top/guide/configuration
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from './themeConfig'
// 如需代码组图标，取消下行注释并创建 groupIconConfig.json
// import groupIconConfig from './groupIconConfig.json'

export default defineConfig(
  // ── 第一参数：VitePress 顶层配置 ──
  {
    sitemap: { hostname: "https://example.com" }
  },
  // ── 第二参数：主题配置（来自 themeConfig.ts）──
  themeConfig,
  // ── 第三参数：构建选项 ──
  {
    pwa: false  // 关闭 PWA（如需启用改为 true 或删除此行）
    // 文章目录（默认为项目根目录下的 posts）
    // postsDir: new URL('../posts', import.meta.url).pathname,
    // RSS 输出路径（默认为 dist/rss.xml）
    // rssOutput: new URL('./dist/rss.xml', import.meta.url).pathname,
    // SVG 图标扫描目录（默认为 public/svg）
    // svgIconDirs: [new URL('../public/svg', import.meta.url).pathname],
    // 代码组图标配置（需在顶部 import groupIconConfig from './groupIconConfig.json'）
    // groupIconConfig,
    // 按需关闭 Vite 插件（autoImport / components 为硬依赖，不可关闭）
    // plugins: { compression: false, codeInspector: false }
  }
)
