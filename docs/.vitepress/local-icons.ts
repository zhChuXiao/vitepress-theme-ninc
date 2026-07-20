// 本地图标 Vite 插件
// 在构建时从 @iconify-json/* 包中提取用到的图标数据，通过虚拟模块 virtual:local-icons 暴露
// 运行时调用 addIcon 注册到 @iconify/vue，避免任何在线 API 请求
import type { Plugin } from 'vite'
import { createRequire } from 'node:module'
import { getIconData, iconToSVG, iconToHTML } from '@iconify/utils'
import type { IconifyJSON } from '@iconify/types'

// 文档中实际使用到的图标清单（按集合前缀分组）
// 后续新增图标时，只需在对应集合中追加图标名即可
const usedIcons: Record<string, string[]> = {
  lucide: [
    'message-circle',
    'search',
    'smartphone',
    'music',
    'image',
    'rss',
    'link',
    'moon',
    'moon-star',
    'sparkles',
    'puzzle',
    'tag',
    'file-archive',
    'file-text',
    'home',
    'route',
    'party-popper',
    'circle-check-big',
    'circle-x',
    'loader-circle',
    'clock',
    'triangle-alert',
    'mouse',
    'mouse-pointer-click',
    'check',
    'copy',
    'arrow-right',
    'check-circle-2',
    'x-circle',
    'terminal',
    'download',
    'play',
    'pen-tool',
    'book-open',
    'blocks',
    'settings-2',
    'code-2',
    'wifi-off',
    'zap',
    'git-commit-vertical',
    'check-circle',
    'layout-dashboard',
    'keyboard',
    'panel-top',
    'hash',
    'code',
    'gamepad-2',
    'chevrons-left-right',
    'sun',
    'rocket',
    'external-link'
  ],
  mdi: ['github'],
  logos: ['vue', 'typescript-icon', 'vitejs', 'pnpm'],
  'simple-icons': ['vitepress']
}

const VIRTUAL_ID = 'virtual:local-icons'
const RESOLVED_ID = `\0${VIRTUAL_ID}`

const require = createRequire(import.meta.url)

function loadCollection(prefix: string): IconifyJSON | null {
  try {
    // 优先使用 icons.json 显式路径，避免 package.json 入口差异
    return require(`@iconify-json/${prefix}/icons.json`)
  } catch {
    try {
      return require(`@iconify-json/${prefix}`)
    } catch {
      console.warn(
        `[local-icons] 图标集 "@iconify-json/${prefix}" 未安装，请执行 ppm i 进行安装`
      )
      return null
    }
  }
}

export function localIconsPlugin(): Plugin {
  // 构建时一次性提取所有用到的图标数据
  const iconsData: Record<string, ReturnType<typeof getIconData>> = {}

  for (const [prefix, names] of Object.entries(usedIcons)) {
    const collection = loadCollection(prefix)
    if (!collection) continue
    for (const name of names) {
      const data = getIconData(collection, name)
      if (data) {
        iconsData[`${prefix}:${name}`] = data
      } else {
        console.warn(
          `[local-icons] 图标 "${prefix}:${name}" 在集合中不存在，请检查名称拼写`
        )
      }
    }
  }

  return {
    name: 'vitepress-local-icons',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
      return null
    },
    load(id) {
      if (id !== RESOLVED_ID) return null
      // 把图标数据序列化为 ESM，运行时直接 import 使用
      return [
        `// 由 vitepress-local-icons 插件生成，请勿手动编辑`,
        `// 共包含 ${Object.keys(iconsData).length} 个图标`,
        `export const localIcons = ${JSON.stringify(iconsData)}`
      ].join('\n')
    }
  }
}

/**
 * 从本地 @iconify-json/<prefix> 包中提取指定图标的内联 SVG 字符串
 * 用于 VitePress config.mts 中给 socialLinks 等接受 { svg: string } 的位置使用
 * 避免 VitePress 默认主题对 https://api.iconify.design 的运行时请求
 */
export function getLocalIconSVG(prefix: string, name: string): string {
  const collection = loadCollection(prefix)
  if (!collection) {
    throw new Error(`[local-icons] 图标集 "@iconify-json/${prefix}" 未安装`)
  }
  const data = getIconData(collection, name)
  if (!data) {
    throw new Error(`[local-icons] 图标 "${prefix}:${name}" 不存在`)
  }
  const renderData = iconToSVG(data)
  return iconToHTML(renderData.body, renderData.attributes)
}
