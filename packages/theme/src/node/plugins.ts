// Vite 插件工厂 - 把原 config.mjs 中硬编码的插件封装为可配置的工厂函数
// 用户可通过 defineConfig 的 options.plugins 关停某些插件
import path from 'path'
import { fileURLToPath } from 'url'
import alias from '@rollup/plugin-alias'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VueMcp } from 'vite-plugin-vue-mcp'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import viteCompression from 'vite-plugin-compression'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import type { PluginOption } from 'vite'
import { defaultGroupIconConfig } from './defaultGroupIconConfig'

/** 插件开关（值为 false 时关停该插件） */
export interface PluginSwitches {
  /** @rollup/plugin-alias - 路径别名 */
  alias?: false
  /** @vitejs/plugin-vue-jsx - JSX 支持（主题内部未使用 JSX，可安全关闭） */
  vueJsx?: false
  /** vite-plugin-vue-mcp - MCP 开发工具 */
  vueMcp?: false
  /** vitepress-plugin-group-icons - 代码组图标（关闭后主题入口虚拟 CSS 由内置 stub 兜底） */
  groupIcons?: false
  /** code-inspector-plugin - 点击定位到编辑器 */
  codeInspector?: false
  /** vite-plugin-compression - gzip/brotli 压缩 */
  compression?: false
  /**
   * unplugin-auto-import - 自动导入 vue/vitepress API
   *
   * 注意：主题内置 .vue 文件未显式 `import { ref, reactive, ... } from 'vue'`，
   * 关闭后主题将无法构建。仅当你要完全替换为主题自定义版本并补全所有显式导入时才关闭。
   */
  autoImport?: false
  /**
   * unplugin-vue-components - 组件自动注册
   *
   * 注意：关闭后用户在 markdown/vue 中直接使用的主题组件（如 Aside、Tags 等）
   * 不会被自动注册，需用户在 .vitepress/theme 中手动 app.component 注册。
   * 主题入口 enhanceApp 显式注册的全局组件（LazyLoader）不受影响。
   */
  components?: false
  /** vite-plugin-svg-icons - SVG 雪碧图（关闭后主题入口虚拟模块由内置 stub 兜底） */
  svgIcons?: false
}

/** createVitePlugins 的配置项 */
export interface CreateVitePluginsOptions {
  /** 代码组图标配置（默认 {}） */
  groupIconConfig?: Record<string, any>
  /** SVG 图标扫描目录（默认 [cwd/public/svg]） */
  svgIconDirs?: string[]
  /** 自动导入 dts 输出路径（默认 cwd/.vitepress/auto-imports.d.ts） */
  autoImportDtsPath?: string
  /** 组件自动注册 dts 输出路径（默认 cwd/.vitepress/components.d.ts） */
  componentsDtsPath?: string
  /** 额外的组件扫描目录（默认会自动加上包内组件目录 + 用户 .vitepress/theme） */
  extraComponentDirs?: string[]
  /** 插件开关 */
  switches?: PluginSwitches
}

/**
 * 解析用户项目根目录下的路径
 */
const resolveUserPath = (p: string) => path.resolve(process.cwd(), p)

/**
 * 创建 Vite 插件数组
 *
 * 封装了原 config.mjs 中全部 Vite 插件，参数化关键路径与配置。
 * 用户可通过 switches 关停不需要的插件。
 */
export async function createVitePlugins(options: CreateVitePluginsOptions = {}): Promise<PluginOption[]> {
  const {
    groupIconConfig = {},
    svgIconDirs = [resolveUserPath('public/svg')],
    autoImportDtsPath = resolveUserPath('.vitepress/auto-imports.d.ts'),
    componentsDtsPath = resolveUserPath('.vitepress/components.d.ts'),
    extraComponentDirs = [],
    switches = {}
  } = options

  // 包内组件目录（让用户的 unplugin-vue-components 也能识别主题包的组件）
  // ESM 中无 __dirname，用 fileURLToPath 获取当前文件所在目录
  // 注意：esbuild 打包后本文件位于 dist/，而源码场景位于 src/node/，
  // 二者相对包根的层级不同，需动态计算包根以保证两种场景下路径都正确。
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const isBundled = path.basename(__dirname) === 'dist'
  const pkgRoot = isBundled ? path.resolve(__dirname, '..') : path.resolve(__dirname, '../..')
  const themeComponentsDir = path.resolve(pkgRoot, 'src/client/components')
  const themeViewsDir = path.resolve(pkgRoot, 'src/client/views')
  const userComponentsDir = resolveUserPath('.vitepress/theme/components')
  const userViewsDir = resolveUserPath('.vitepress/theme/views')

  const componentDirs = [
    themeComponentsDir,
    themeViewsDir,
    userComponentsDir,
    userViewsDir,
    ...extraComponentDirs
  ].filter(Boolean)

  const plugins: PluginOption[] = []

  // alias
  if (switches.alias !== false) {
    plugins.push(alias())
  }

  // vueJsx
  if (switches.vueJsx !== false) {
    plugins.push(vueJsx())
  }

  // vueMcp
  if (switches.vueMcp !== false) {
    try {
      plugins.push(VueMcp())
    } catch (e) {
      // vueMcp 仅开发期使用，缺失时跳过
    }
  }

  // groupIcons
  if (switches.groupIcons !== false) {
    plugins.push(groupIconVitePlugin({ customIcon: { ...defaultGroupIconConfig, ...groupIconConfig } }))
  }

  // codeInspector
  if (switches.codeInspector !== false) {
    try {
      plugins.push(codeInspectorPlugin({ bundler: 'vite' }))
    } catch (e) {
      // code-inspector 可选
    }
  }

  // compression
  if (switches.compression !== false) {
    try {
      // gzip
      plugins.push(
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240,
          algorithm: 'gzip',
          ext: '.gz',
          deleteOriginFile: false
        })
      )
      // brotli
      plugins.push(
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240,
          algorithm: 'brotliCompress',
          ext: '.br',
          deleteOriginFile: false
        })
      )
    } catch (e) {
      // compression 可选
    }
  }

  // autoImport
  if (switches.autoImport !== false) {
    plugins.push(
      AutoImport({
        imports: ['vue', 'vitepress'],
        dts: autoImportDtsPath,
        // 默认 exclude 含 [\\/]node_modules[\\/]，会跳过 npm 安装场景下的主题源码，
        // 导致主题 .vue 中使用的 useRoute/ref/computed 等无法被自动注入（ReferenceError）。
        // 使用负向先行断言：排除 node_modules 下除 vitepress-theme-ninc 外的其他包，
        // 避免误处理第三方包（如 vue-instantsearch 内部变量 h 与自动注入的 h 冲突）。
        exclude: [
          /[\\/]node_modules[\\/](?!.*vitepress-theme-ninc)/,
          /[\\/]\.git[\\/]/,
          /[\\/]\.nuxt[\\/]/
        ]
      })
    )
  }

  // components
  if (switches.components !== false) {
    plugins.push(
      Components({
        dirs: componentDirs,
        extensions: ['vue', 'md'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        // 同 autoImport，排除 node_modules 下除 vitepress-theme-ninc 外的其他包
        exclude: [
          /[\\/]node_modules[\\/](?!.*vitepress-theme-ninc)/,
          /[\\/]\.git[\\/]/,
          /[\\/]\.nuxt[\\/]/
        ],
        dts: componentsDtsPath
      })
    )
  }

  // svgIcons
  if (switches.svgIcons !== false) {
    try {
      plugins.push(
        createSvgIconsPlugin({
          iconDirs: svgIconDirs,
          symbolId: 'icon-[dir]-[name]',
          inject: 'body-last',
          customDomId: '__svg__icons__dom__',
          svgoOptions: {
            plugins: [
              { name: 'removeAttrs', params: { attrs: '(fill|stroke)' } },
              { name: 'cleanupListOfValues' },
              { name: 'removeUselessStrokeAndFill' },
              { name: 'removeViewBox', active: false }
            ]
          }
        })
      )
    } catch (e) {
      // svg-icons 可选
    }
  } else {
    // 主题入口硬编码 import 'virtual:svg-icons-register'，关闭插件时需提供空 stub
    // 否则 Rollup 解析阶段会报 "failed to resolve import virtual:svg-icons-register"
    plugins.push({
      name: 'vitepress-theme-ninc:svg-icons-stub',
      enforce: 'pre',
      resolveId(id) {
        if (id === 'virtual:svg-icons-register') return '\0virtual:svg-icons-register'
      },
      load(id) {
        if (id === '\0virtual:svg-icons-register') return ''
      }
    })
  }

  // groupIcons 关闭时，主题入口 import 'virtual:group-icons.css' 同样需要 stub
  if (switches.groupIcons === false) {
    plugins.push({
      name: 'vitepress-theme-ninc:group-icons-stub',
      enforce: 'pre',
      resolveId(id) {
        if (id === 'virtual:group-icons.css') return '\0virtual:group-icons.css'
      },
      load(id) {
        if (id === '\0virtual:group-icons.css') return ''
      }
    })
  }

  return plugins
}

/**
 * 创建 Vite resolve.alias 配置
 * @ 指向主题包的 client 目录，用户在 markdown/vue 中可用 @/views/Home.vue 等导入主题组件
 * 用户自定义组件可通过 unplugin-vue-components 自动注册，无需 @ 别名
 */
export function createResolveAlias() {
  // 主题包 client 目录（ESM 中用 fileURLToPath 获取当前文件路径）
  // 与 createVitePlugins 同理，需兼容源码（src/node/）与打包（dist/）两种场景
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const isBundled = path.basename(__dirname) === 'dist'
  const pkgRoot = isBundled ? path.resolve(__dirname, '..') : path.resolve(__dirname, '../..')
  const themeClientDir = path.resolve(pkgRoot, 'src/client')
  return {
    alias: {
      '@': themeClientDir
    }
  }
}

/**
 * 创建 Vite ssr.noExternal 配置
 * 这些包需要在 SSR 阶段被 Vite 处理（不能作为外部依赖）
 */
export function createSsrNoExternal() {
  return {
    noExternal: ['vitepress-theme-ninc', 'lottie-web', '**/Banner.*', 'codejar', 'twikoo', '**/Twikoo.*']
  }
}
