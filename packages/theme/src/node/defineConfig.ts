// VitePress 配置工厂
// 用户通过 import { defineConfig } from 'vitepress-theme-ninc/defineConfig' 使用
// 内部包裹 vitepress defineConfig，注入主题全部能力（vite 插件、markdown 扩展、RSS、外链中转、PWA）
import path from 'path'
import fs from 'fs-extra'
import { realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import pc from 'picocolors'
import { defineConfig as vpDefineConfig, type UserConfig } from 'vitepress'
import { defu } from 'defu'
import { createVitePlugins, createResolveAlias, createSsrNoExternal, type PluginSwitches } from './plugins'
import {
  getAllPosts,
  getAllType,
  getAllCategories,
  getAllArchives,
  getUnencryptedPosts
} from './utils/getPostData.mjs'
import { createRssFile } from './utils/generateRSS.mjs'
import { generateAiSummaries } from './utils/aiSummary.mjs'
import markdownConfig from './utils/markdownConfig.mjs'
import { jumpRedirect } from './utils/commonTools.mjs'
import { createRedirectHtmlPlugin, createRedirectHtmlBuildPlugin } from './redirectHtml'
import type { ThemeConfig, UserThemeConfig } from '../types/index'

/**
 * defineConfig 的可选参数
 *
 * 用于参数化主题行为：文章目录、RSS 输出、SVG 图标目录、PWA 开关、各 Vite 插件开关等。
 * 所有字段都可选，未提供时使用默认值（基于 process.cwd）。
 */
export interface DefineConfigOptions {
  /** 文章源目录，默认 path.resolve(process.cwd(), 'posts') */
  postsDir?: string
  /** RSS 输出路径，默认 path.join(outDir, 'rss.xml')，写入 VitePress 构建输出目录 */
  rssOutput?: string
  /** SVG 图标扫描目录，默认 [path.resolve(process.cwd(), 'public/svg')] */
  svgIconDirs?: string[]
  /** 代码组图标配置，默认 {} */
  groupIconConfig?: Record<string, any>
  /** vitepress-demo-plugin 的 demo 目录，默认 path.resolve(process.cwd(), 'posts/components') */
  demoDir?: string
  /** 设为 false 时跳过 PWA 包裹（用户未安装 @vite-pwa/vitepress 时使用） */
  pwa?: false
  /** PWA manifest 配置覆盖（默认从 themeConfig.siteMeta 派生） */
  pwaManifest?: Record<string, any>
  /** PWA workbox 配置覆盖 */
  pwaWorkbox?: Record<string, any>
  /** 各 Vite 插件开关，值为 false 时关停该插件 */
  plugins?: PluginSwitches
  /** 额外的组件扫描目录（除包内 components/views 与用户 .vitepress/theme 外） */
  extraComponentDirs?: string[]
  /** 自动导入 dts 输出路径，默认 <cwd>/.vitepress/auto-imports.d.ts */
  autoImportDtsPath?: string
  /** 组件自动注册 dts 输出路径，默认 <cwd>/.vitepress/components.d.ts */
  componentsDtsPath?: string
  /**
   * 站点加密密钥文件路径（仅用于加密文章 crypto.enable: true）。
   *
   * 指向一个本地文本文件，文件全部内容即作为站点密钥（构建期会 trim 首尾空白）。
   * 主题不再内置任何固定密钥——避免 npm 分发后密钥公开导致密钥文件门槛失效。
   * 访问者上传的密钥文件内容必须与此文件内容完全一致才能解锁加密文章。
   *
   * 推荐：自定义一段足够长的随机字符串作为文件内容，并将该文件加入 .gitignore，
   * 不要提交到 Git 仓库，也不要放在 public/ 目录下。
   *
   * 若站点没有任何加密文章，可省略此字段。
   */
  cryptoSecretKeyFile?: string
}

/**
 * 解析用户项目根目录下的路径
 */
const resolveUserPath = (p: string) => path.resolve(process.cwd(), p)

/**
 * 解析主题包真实物理路径，用于 Vite dev server fs.allow
 *
 * pnpm 安装结构下，用户项目 node_modules/vitepress-theme-ninc 是软链接，
 * 真实文件位于 node_modules/.pnpm/vitepress-theme-ninc@x.y.z_.../node_modules/vitepress-theme-ninc/。
 * 主题源码内 cursor.scss 等使用相对路径 url('../assets/cursor/pointer.png') 引用资源，
 * Vite 处理时会 resolve 成真实物理路径，该路径在用户项目目录之外，
 * 触发 "outside of Vite serving allow list" 警告。
 *
 * 这里返回需要加入 fs.allow 的路径列表：
 * - 用户项目根目录（process.cwd）
 * - 主题包真实根目录
 * - 主题包父目录（覆盖 pnpm .pnpm/<pkg>@<version>/node_modules 结构）
 */
function resolveThemeFsAllow(): string[] {
  const allow = new Set<string>()
  // 用户项目根目录
  allow.add(process.cwd())

  try {
    const require = createRequire(import.meta.url)
    const pkgJsonPath = require.resolve('vitepress-theme-ninc/package.json')
    // realpathSync 解析所有软链接，返回真实物理路径
    const realPkgDir = realpathSync(path.dirname(pkgJsonPath))
    allow.add(realPkgDir)
    // pnpm 结构下还需包含父目录，覆盖 .pnpm/<pkg>@<ver>/node_modules 完整结构
    allow.add(path.dirname(realPkgDir))
    // 再向上一层（.pnpm 目录），覆盖跨包资源访问
    allow.add(path.dirname(path.dirname(realPkgDir)))
  } catch {
    // 主题包解析失败时降级为仅允许 cwd，让 Vite 使用默认行为
  }
  return Array.from(allow)
}

/**
 * 规范化用户传入的路径
 *
 * 用户常用 `new URL('./foo', import.meta.url).pathname` 获取 ESM 模块相对路径，
 * 但 `.pathname` 返回 URL 编码路径（中文等非 ASCII 字符会被编码为 %XX），
 * 文件系统无法识别这类路径，会抛出 EPERM/ENOENT 等错误。
 *
 * 这里统一 decodeURIComponent 还原为原始文件系统路径，保证主题对 URL 编码路径具有容错性。
 * 推荐用户使用 `fileURLToPath(new URL(...))`，但即便误用 `.pathname` 也能正常工作。
 */
const normalizeUserPath = (p: string | undefined): string | undefined => {
  if (!p) return p
  try {
    return decodeURIComponent(p)
  } catch {
    // 路径中包含非法 % 序列时保持原样
    return p
  }
}

/**
 * 默认 PWA workbox 配置（迁移自原 .vitepress/config.mjs）
 */
const defaultPwaWorkbox = {
  clientsClaim: true,
  skipWaiting: true,
  cleanupOutdatedCaches: true,
  // 默认 2MB 限制会跳过大文件预缓存（如 sass.worker.js、字体、大图）
  // 提升到 10MB 以覆盖常见静态资源
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
  runtimeCaching: [
    {
      urlPattern: /(.*?)\.(css)/,
      handler: 'CacheFirst',
      options: { cacheName: 'file-cache' }
    },
    {
      urlPattern: /(.*?)\.(woff2|woff|ttf)/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'font-cache',
        expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] }
      }
    },
    {
      urlPattern: /(.*?)\.(ico|webp|png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 },
        cacheableResponse: { statuses: [0, 200] }
      }
    },
    {
      urlPattern: /^https:\/\/cdn2\.codesign\.qq\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'iconfont-cache',
        expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 2 },
        cacheableResponse: { statuses: [0, 200] }
      }
    }
  ],
  globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,gif,svg,woff2,ttf}'],
  navigateFallbackDenylist: [/^\/sitemap\.xml$/, /^\/rss\.xml$/, /^\/robots\.txt$/]
}

/**
 * 从 themeConfig.siteMeta 派生 PWA manifest
 */
const derivePwaManifest = (themeConfig: ThemeConfig): Record<string, any> => ({
  name: themeConfig.siteMeta.title,
  short_name: themeConfig.siteMeta.title,
  description: themeConfig.siteMeta.description,
  display: 'standalone',
  start_url: themeConfig.siteMeta.base || '/',
  theme_color: '#fff',
  background_color: '#efefef',
  icons: [
    { src: '/images/cxLogo/favicon-32x32.webp', sizes: '32x32', type: 'image/webp' },
    { src: '/images/cxLogo/favicon-96x96.webp', sizes: '96x96', type: 'image/webp' },
    { src: '/images/cxLogo/favicon-256x256.webp', sizes: '256x256', type: 'image/webp' },
    { src: '/images/cxLogo/favicon-512x512.webp', sizes: '512x512', type: 'image/webp' }
  ]
})

/**
 * 动态加载 @vite-pwa/vitepress 的 withPwa
 * 用户未安装该可选依赖时返回 null，defineConfig 会降级为不包裹 PWA
 */
async function loadWithPwa(): Promise<((cfg: any) => any) | null> {
  try {
    const mod = await import('@vite-pwa/vitepress')
    return (mod as any).withPwa ?? null
  } catch {
    return null
  }
}

/**
 * 动态加载 vitepress-plugin-group-icons 的 groupIconMdPlugin
 */
async function loadGroupIconMdPlugin(): Promise<((md: any) => void) | null> {
  try {
    const mod = await import('vitepress-plugin-group-icons')
    return (mod as any).groupIconMdPlugin ?? null
  } catch {
    return null
  }
}

/**
 * 动态加载 vitepress-demo-plugin
 */
async function loadVitepressDemoPlugin(): Promise<any> {
  try {
    const mod = await import('vitepress-demo-plugin')
    return (mod as any).vitepressDemoPlugin ?? null
  } catch {
    return null
  }
}

/**
 * VitePress 主题配置工厂
 *
 * 包裹 vitepress defineConfig，自动注入：
 * - 全部 Vite 插件（alias/vueJsx/svg-icons/auto-import/components/group-icons/compression/code-inspector/vue-mcp）
 * - markdown 扩展（tabs/attrs/container/mathjax3/按键块 %%k%%/timeline/radio/button/card/代码组图标/demo-plugin）
 * - 主题 themeConfig（含文章数据 postData/tagsData/categoriesData/archivesData/unencryptedData）
 * - buildEnd 生成 RSS
 * - transformHtml 外链中转
 * - PWA（可选，默认开启）
 * - sitemap、cleanUrls、lastUpdated 等基础配置
 *
 * 用户传入的 userConfig 可覆盖上述默认（用 defu 深合并）。
 *
 * @param userConfig 用户 vitepress 配置覆盖
 * @param userThemeConfig 用户主题配置（与 defaultThemeConfig 深合并）
 * @param options 参数化选项（postsDir/rssOutput/svgIconDirs/pwa/plugins 等）
 *
 * @example
 * ```ts
 * // .vitepress/config.mts
 * import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
 * import { themeConfig } from './themeConfig'
 *
 * export default defineConfig({
 *   sitemap: { hostname: 'https://example.com' }
 * }, themeConfig, {
 *   pwa: false  // 关停 PWA
 * })
 * ```
 */
export function defineConfig(
  userConfig: UserConfig = {},
  userThemeConfig: UserThemeConfig = {},
  options: DefineConfigOptions = {}
) {
  return (vpDefineConfig as any)(async () => {
    // 1. 主题配置应由 defineThemeConfig 预先补全。
    // 不在这里再次与默认配置合并，否则 defu 会拼接数组并产生重复项。
    const themeConfig = userThemeConfig as ThemeConfig

    // 2. 收集文章数据（支持用户自定义文章目录）
    // 注意：所有用户传入的路径都经 normalizeUserPath 处理，避免 URL 编码路径导致 EPERM
    const postsDir = normalizeUserPath(options.postsDir) ?? resolveUserPath('posts')

    // 2.1 读取站点加密密钥文件（仅用于加密文章 crypto.enable: true）
    // 主题不再硬编码密钥，由用户在 options.cryptoSecretKeyFile 中指定本地密钥文件路径
    // 兜底策略：密钥文件缺失或内容为空时不抛错，仅打印警告并降级为不设置密钥，
    // 由 getAllPosts 内部使用兜底密钥让加密文章仍可工作（安全保护减弱但不阻断启动）
    let cryptoSecretKey: string | undefined
    const cryptoSecretKeyFile = normalizeUserPath(options.cryptoSecretKeyFile)
    if (cryptoSecretKeyFile) {
      const keyFilePath = path.isAbsolute(cryptoSecretKeyFile)
        ? cryptoSecretKeyFile
        : resolveUserPath(cryptoSecretKeyFile)
      if (!fs.existsSync(keyFilePath)) {
        console.warn(
          '\n' +
          pc.yellow(pc.bold('⚠️  [vitepress-theme-ninc] options.cryptoSecretKeyFile 指定的密钥文件不存在:')) + '\n' +
          pc.dim(`   ${keyFilePath}`) + '\n' +
          pc.cyan('   请创建一个本地文本文件（内容为你自定义的任意字符串），并将路径填入 cryptoSecretKeyFile。') + '\n' +
          pc.dim('   当前已降级为主题内置兜底密钥，加密文章仍可启动但不具真正的安全保护作用。') + '\n'
        )
      } else {
        cryptoSecretKey = (await fs.readFile(keyFilePath, 'utf-8')).trim()
        if (!cryptoSecretKey) {
          console.warn(
            '\n' +
            pc.yellow(pc.bold(`⚠️  [vitepress-theme-ninc] options.cryptoSecretKeyFile 指定的密钥文件内容为空: ${keyFilePath}`)) + '\n' +
            pc.cyan('   请在文件中写入一段自定义字符串作为站点密钥。') + '\n' +
            pc.dim('   当前已降级为主题内置兜底密钥，加密文章仍可启动但不具真正的安全保护作用。') + '\n'
          )
          cryptoSecretKey = undefined
        }
      }
    }

    // 2.5 AI 摘要（aiSummary.enable 时构建期调用大模型生成）
    // includeContent 让 getAllPosts 临时携带 _content / _hasArticleGPT，生成完毕后立即删除，
    // 避免文章正文泄漏到客户端 themeConfig
    const aiSummaryConfig = themeConfig?.aiSummary
    const aiSummaryEnable = aiSummaryConfig?.enable === true

    const postData = await getAllPosts(postsDir, cryptoSecretKey, { includeContent: aiSummaryEnable })

    // 构建期生成摘要，得到 { [regularPath]: summary }
    // 任何失败都在 generateAiSummaries 内部收敛为 warn + 降级，不会阻断构建
    let aiSummaryMap = {}
    if (aiSummaryEnable) {
      const { summaries } = await generateAiSummaries(postData, aiSummaryConfig)
      aiSummaryMap = summaries
      // 删除临时字段，防止正文进入客户端 bundle
      for (const post of postData) {
        delete post._content
        delete post._hasArticleGPT
      }
    }

    // 2.2 兜底警告：存在加密文章但用户未配置站点密钥时，打印警告（不抛错，项目仍可启动）
    // getAllPosts 内部会用兜底密钥让加密文章正常工作，但兜底密钥公开在主题源码中无真正安全可言。
    const hasEncryptedPosts = postData.some((p: any) => p.crypto?.enable === true)
    if (hasEncryptedPosts && !cryptoSecretKey) {
      console.warn(
        '\n' +
        pc.yellow(pc.bold('⚠️  [vitepress-theme-ninc] 检测到加密文章但未配置站点密钥（cryptoSecretKeyFile）。')) + '\n' +
        pc.dim('   当前使用主题内置的兜底密钥，该密钥公开在 npm 包源码中，不具真正的安全保护作用。') + '\n' +
        pc.cyan('   请在 defineConfig 的 options 中配置 cryptoSecretKeyFile 字段，指向一个本地密钥文件路径') + '\n' +
        pc.dim('   （内容为你自定义的任意字符串，加入 .gitignore），以获得真正的加密保护。') + '\n' +
        pc.cyan('   详见文档：https://blog.ninc.top/guide/writing/encrypted') + '\n'
      )
    }

    // 3. 派生默认值
    const demoDir = normalizeUserPath(options.demoDir) ?? resolveUserPath('posts/components')
    const svgIconDirs = (options.svgIconDirs ?? [resolveUserPath('public/svg')]).map(p => normalizeUserPath(p)!)
    const autoImportDtsPath = normalizeUserPath(options.autoImportDtsPath) ?? resolveUserPath('.vitepress/auto-imports.d.ts')
    const componentsDtsPath = normalizeUserPath(options.componentsDtsPath) ?? resolveUserPath('.vitepress/components.d.ts')
    const extraComponentDirs = (options.extraComponentDirs ?? []).map(p => normalizeUserPath(p)!)

    // 4. 创建 Vite 插件
    const vitePlugins = await createVitePlugins({
      groupIconConfig: options.groupIconConfig,
      svgIconDirs,
      autoImportDtsPath,
      componentsDtsPath,
      extraComponentDirs,
      switches: options.plugins
    })

    // 4.1 外链中转页自动注入（dev 中间件拦截 + build 输出 redirect.html）
    // 仅在 jumpRedirect.enable 时启用，用户无需手动创建 redirect.md / public/redirect.html
    if (themeConfig?.jumpRedirect?.enable) {
      vitePlugins.push(createRedirectHtmlPlugin(themeConfig))
      vitePlugins.push(createRedirectHtmlBuildPlugin(themeConfig))
    }

    // 5. 加载 markdown 插件（可选依赖，缺失时跳过）
    // groupIcons 开关同时控制 Vite 插件与 markdown 插件，保持开关语义一致
    const groupIconMdPlugin = options.plugins?.groupIcons === false
      ? null
      : await loadGroupIconMdPlugin()
    const vitepressDemoPlugin = await loadVitepressDemoPlugin()

    // 5.5 客户端可用的 aiSummary 配置
    // themeConfig 会整体注入浏览器端（useData().theme），必须剔除 apiKey/baseURL/prompt 等
    // 仅构建期使用的敏感字段，防止 API Key 泄漏到客户端 bundle
    const clientAiSummary = aiSummaryConfig
      ? {
          enable: aiSummaryConfig.enable === true,
          provider: aiSummaryConfig.provider,
          model: aiSummaryConfig.model,
          logoText: aiSummaryConfig.logoText,
          tip: aiSummaryConfig.tip,
          maxInputLength: aiSummaryConfig.maxInputLength,
          runtime: aiSummaryConfig.runtime
        }
      : aiSummaryConfig

    // 6. 构建主题默认 vitepress 配置
    const themeDefaults: UserConfig = {
      base: themeConfig.siteMeta.base,
      title: themeConfig.siteMeta.title,
      description: themeConfig.siteMeta.description,
      lang: themeConfig.siteMeta.lang,
      cleanUrls: true,
      lastUpdated: true,
      // 关闭 vitepress 主题管理（与本主题冲突）
      appearance: false,
      // Head 注入（favicon/SEO/字体等）
      head: themeConfig.inject.header as any,
      // sitemap
      sitemap: {
        hostname: themeConfig.siteMeta.site,
        transformItems: (items: any[]) => {
          return items.filter((page) => {
            const url = page.url
            // 排除 pages/ 目录下页面（保留 nes.md、utils/ 子目录）
            if (url.startsWith('pages/')) {
              if (url === 'pages/nes') return true
              if (url.startsWith('pages/utils/')) return true
              return false
            }
            // 排除 page/ 目录（分页路由）
            if (url.startsWith('page/') || url === 'page') return false
            // 排除加密文章
            if (url.startsWith('posts/encrypted/')) return false
            // 保留 posts/demo/
            if (url.startsWith('posts/demo/')) return true
            return true
          })
        }
      },
      // 主题配置（运行时通过 useData().theme 访问）
      themeConfig: {
        ...themeConfig,
        aiSummary: clientAiSummary,
        postData,
        tagsData: getAllType(postData),
        categoriesData: getAllCategories(postData),
        archivesData: getAllArchives(postData),
        unencryptedData: getUnencryptedPosts(postData)
      } as any,
      // markdown 配置
      markdown: {
        math: true,
        lineNumbers: true,
        toc: { level: [1, 2, 3, 4] },
        image: { lazyLoading: true },
        config: (md: any) => {
          // 主题内置 markdown 扩展（tabs/attrs/container/按键块 %%k%%/timeline/radio/button/card/表格/图片灯箱）
          markdownConfig(md, themeConfig)
          // 代码组图标
          if (groupIconMdPlugin) md.use(groupIconMdPlugin)
          // vitepress-demo-plugin（组件 demo）
          if (vitepressDemoPlugin) {
            md.use(vitepressDemoPlugin, { demoDir })
          }
        }
      } as any,
      // transformPageData: 注入构建期生成的 AI 摘要（仅在文章未手动填写 articleGPT 时注入）
      transformPageData: (pageData: any) => {
        if (!aiSummaryEnable) return
        if (pageData.frontmatter?.articleGPT) return
        const regularPath = `/${pageData.relativePath.replace(/\.md$/, '.html')}`
        const summary = (aiSummaryMap as Record<string, string>)[regularPath]
        if (summary) {
          pageData.frontmatter.articleGPT = summary
        }
      },
      // 构建排除
      srcExclude: ['**/README.md', '**/TODO.md'],
      // transformHtml: 外链中转
      transformHtml: (html: string) => jumpRedirect(html, themeConfig) as any,
      // buildEnd: 生成 RSS（支持用户自定义输出路径与文章目录）
      buildEnd: async (cfg: any) => {
        await createRssFile(cfg, themeConfig, {
          rssOutput: normalizeUserPath(options.rssOutput),
          postsDir
        })
      },
      // Vite 配置
      vite: {
        plugins: vitePlugins,
        resolve: createResolveAlias(),
        css: {
          preprocessorOptions: {
            scss: {
              silenceDeprecations: ['legacy-js-api', 'if-function', 'color-functions', 'global-builtin', 'import']
            }
          },
          postcss: {
            plugins: [
              {
                postcssPlugin: 'postcss-preset-env',
                options: { stage: 3, features: { 'nesting-rules': true } }
              }
            ]
          },
          devSourcemap: false
        },
        optimizeDeps: {
          // 排除主题包自身：esbuild 预扫描阶段不运行 Vite 插件链，
          // 无法解析 src/client/index.ts 中的 virtual:group-icons.css / virtual:svg-icons-register
          // 且主题包含 .vue/.scss，esbuild 无法打包
          exclude: ['vitepress', 'vitepress-theme-ninc'],
          // exclude 主题包后，esbuild 无法通过主题入口发现传递依赖，
          // 以下包必须显式 include，否则浏览器端 default 导出失败
          // （CJS 模块不经预构建无法被 ESM 正确 import）
          //
          // pnpm 兼容：pnpm 不会把主题的依赖提升到用户 node_modules 顶层，
          // 使用 'vitepress-theme-ninc > dep' 语法让 Vite 从主题包的 node_modules 解析依赖
          include: [
            // vue 是 peerDependency，在用户 node_modules 中可直接解析
            'vue',
            // 主题 dependencies（ESM）
            'vitepress-theme-ninc > pinia',
            'vitepress-theme-ninc > lodash-es',
            'vitepress-theme-ninc > dayjs',
            // 主题 optionalDependencies - ESM
            'vitepress-theme-ninc > element-plus',
            // CJS 包（静态导入）— 必须预构建，否则 default 导出失败
            'vitepress-theme-ninc > crypto-js',
            'vitepress-theme-ninc > nprogress',
            // ESM 入口但含 CJS 传递依赖（algoliasearch-helper 等）
            'vitepress-theme-ninc > vue-instantsearch/vue3/es',
            // CJS 包（动态导入）— 必须预构建
            'vitepress-theme-ninc > aplayer',
            'vitepress-theme-ninc > vue-slider-component',
            'vitepress-theme-ninc > lottie-web/build/player/lottie_light',
            'vitepress-theme-ninc > twikoo/dist/twikoo.nocss.js'
          ]
        },
        server: {
          host: true,
          fs: {
            // pnpm 软链接会把主题包内的相对资源（如 cursor 图片）解析到 .pnpm store 真实物理路径，
            // 该路径通常在用户项目目录之外，导致 Vite dev server 默认 fs.allow 拦截并打印警告。
            // 这里动态解析主题包真实路径并加入允许列表，同时保留 VitePress 默认的搜索行为。
            allow: resolveThemeFsAllow()
          }
        },
        build: {
          minify: 'terser',
          terserOptions: {
            compress: {
              // 移除 console.log/info/debug（第三方库的版本信息、调试日志），
              // 保留 console.error/warn（运行时错误处理与降级提示仍有价值）
              pure_funcs: ['console.log', 'console.info', 'console.debug'],
              drop_debugger: true,
              booleans_as_integers: false,
              passes: 2
            },
            mangle: { safari10: true },
            format: { comments: false }
          },
          commonjsOptions: {
            include: [/twikoo/, /node_modules/],
            transformMixedEsModules: true
          }
        },
        ssr: createSsrNoExternal(),
        performance: { hints: false }
      } as any
    }

    // 7. 用 defu 合并用户配置与主题默认（用户覆盖）
    // 注意：defu 对函数类型字段会保留默认函数，但用户显式传入的函数会被使用
    // 对于 themeConfig 等嵌套对象，defu 会深合并；但这里我们希望用户能完全替换某些字段
    // 所以采用 defu 后再用展开运算符覆盖关键字段
    const mergedConfig: UserConfig = defu(userConfig, themeDefaults)

    // 8. 确保 themeConfig 中包含文章数据（defu 可能因 userConfig.themeConfig 存在而绕过默认）
    // 这里强制重新注入，避免用户传入空 themeConfig 导致数据丢失
    const finalThemeConfig = defu(
      (userConfig as any).themeConfig,
      themeDefaults.themeConfig
    )
    ;(mergedConfig as any).themeConfig = finalThemeConfig

    // 9. PWA 包裹（可选）
    if (options.pwa !== false) {
      const withPwa = await loadWithPwa()
      if (withPwa) {
        const pwaConfig = {
          registerType: 'autoUpdate' as const,
          workbox: defu(options.pwaWorkbox ?? {}, defaultPwaWorkbox),
          manifest: defu(options.pwaManifest ?? {}, derivePwaManifest(themeConfig))
        }
        return withPwa({ ...mergedConfig, pwa: pwaConfig } as any)
      }
      // withPwa 加载失败（用户未装 @vite-pwa/vitepress）：降级为不包裹
      console.warn('[vitepress-theme-ninc] @vite-pwa/vitepress 未安装，已跳过 PWA 包裹。如需 PWA 请执行 pnpm add @vite-pwa/vitepress')
    }

    return mergedConfig
  })
}
