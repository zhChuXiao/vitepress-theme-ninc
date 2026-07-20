// 本地图标 Vite 插件（自动扫描版）
// 在构建时扫描 docs 目录下所有源码文件，提取用到的 'prefix:name' 形式图标 ID，
// 从本地 @iconify-json/* 包中提取对应图标数据，通过虚拟模块 virtual:local-icons 暴露，
// 运行时调用 addIcon 注册到 @iconify/vue，避免任何在线 API 请求。
//
// 优势：
//   1. 自动扫描源码，无需手动维护 usedIcons 列表
//   2. 只提取用到的图标，不会装整个集合（vscode-icons 全集 ~5MB，但只用到 30+ 个）
//   3. 已安装集合作为白名单，避免误匹配非图标字符串
import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { getIconData, iconToSVG, iconToHTML } from '@iconify/utils'
import type { IconifyJSON } from '@iconify/types'

const VIRTUAL_ID = 'virtual:local-icons'
const RESOLVED_ID = `\0${VIRTUAL_ID}`

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
// local-icons.ts 位于 docs/.vitepress/local-icons.ts，docs 根目录是上一级
const DOCS_ROOT = path.resolve(__dirname, '..')

// 扫描的文件扩展名（.md/.vue/.ts/.mts/.js/.mjs/.json 都可能引用图标）
const SCAN_EXTS = new Set(['.md', '.vue', '.ts', '.mts', '.js', '.mjs', '.json'])

// 跳过的目录（node_modules / dist / cache 等）
const SKIP_DIRS = new Set(['node_modules', 'dist', 'cache', '.cache', 'public'])

// 匹配 'prefix:name' / "prefix:name" / `prefix:name` 形式的图标 ID
// prefix：小写字母开头，可含小写字母/数字/连字符（lucide / mdi / vscode-icons / simple-icons 等）
// name：小写字母或数字开头，可含小写字母/数字/连字符
const ICON_ID_REGEX = /['"`]([a-z][a-z0-9-]*):([a-z0-9][a-z0-9-]*)['"`]/g

// 缓存已安装的图标集白名单（避免对每个候选 prefix 都尝试 require）
let installedPrefixesCache: Set<string> | null = null

function getInstalledPrefixes(): Set<string> {
  if (installedPrefixesCache) return installedPrefixesCache
  const result = new Set<string>()
  // 扫描 @iconify-json/* 下所有已安装的集合
  try {
    const pnpmRoot = path.join(__dirname, '..', '..', 'node_modules', '@iconify-json')
    if (fs.existsSync(pnpmRoot)) {
      for (const name of fs.readdirSync(pnpmRoot)) {
        result.add(name)
      }
    }
  } catch {
    // 忽略
  }
  // 兜底：再尝试 require.resolve 探测常见集合
  const knownPrefixes = ['lucide', 'mdi', 'logos', 'simple-icons', 'vscode-icons']
  for (const prefix of knownPrefixes) {
    try {
      require.resolve(`@iconify-json/${prefix}/icons.json`)
      result.add(prefix)
    } catch {
      // 未安装，跳过
    }
  }
  installedPrefixesCache = result
  return result
}

/** 递归扫描目录，收集所有 'prefix:name' 形式的图标 ID */
function scanDir(dir: string, icons: Record<string, Set<string>>) {
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      scanDir(fullPath, icons)
    } else if (entry.isFile() && SCAN_EXTS.has(path.extname(entry.name))) {
      scanFile(fullPath, icons)
    }
  }
}

/** 扫描单个文件，提取图标 ID */
function scanFile(filePath: string, icons: Record<string, Set<string>>) {
  let content: string
  try {
    content = fs.readFileSync(filePath, 'utf-8')
  } catch {
    return
  }
  // 复用全局 regex 实例，每次扫描前重置 lastIndex
  ICON_ID_REGEX.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = ICON_ID_REGEX.exec(content)) !== null) {
    const prefix = match[1]
    const name = match[2]
    // 只收集已安装的图标集前缀，避免误匹配（如 'user:password' 这种非图标字符串）
    if (getInstalledPrefixes().has(prefix)) {
      if (!icons[prefix]) icons[prefix] = new Set()
      icons[prefix].add(name)
    }
  }
}

/** 扫描所有源码，返回按集合分组的图标名映射 */
function scanUsedIcons(): Record<string, string[]> {
  const result: Record<string, Set<string>> = {}
  scanDir(DOCS_ROOT, result)
  return Object.fromEntries(
    Object.entries(result).map(([k, v]) => [k, [...v].sort()])
  )
}

/** 加载本地 @iconify-json/{prefix} 图标集 */
function loadCollection(prefix: string): IconifyJSON | null {
  try {
    // 优先使用 icons.json 显式路径，避免 package.json 入口差异
    return require(`@iconify-json/${prefix}/icons.json`)
  } catch {
    try {
      return require(`@iconify-json/${prefix}`)
    } catch {
      return null
    }
  }
}

export function localIconsPlugin(): Plugin {
  // 启动时扫描一次（dev 启动 / build 启动各执行一次）
  const usedIcons = scanUsedIcons()
  const totalIcons = Object.values(usedIcons).reduce((sum, arr) => sum + arr.length, 0)
  const collections = Object.keys(usedIcons).sort()
  console.log(
    `\n[local-icons] 扫描到 ${totalIcons} 个图标，分布在 ${collections.length} 个集合：` +
    collections.map(c => `${c}(${usedIcons[c].length})`).join(' ')
  )

  // 构建时一次性提取所有用到的图标数据
  const iconsData: Record<string, ReturnType<typeof getIconData>> = {}

  for (const [prefix, names] of Object.entries(usedIcons)) {
    const collection = loadCollection(prefix)
    if (!collection) {
      console.warn(
        `[local-icons] 图标集 "@iconify-json/${prefix}" 未安装，请执行 pnpm i -D @iconify-json/${prefix}`
      )
      continue
    }
    for (const name of names) {
      const data = getIconData(collection, name)
      if (data) {
        iconsData[`${prefix}:${name}`] = data
      }
      // 集合中不存在的图标名静默跳过：
      // 通常是文档/注释里的"示例文字"（如 'lucide:xxx'、'vscode-icons:vue'），
      // 不是真实使用。真实使用时若拼错图标名，运行时 @iconify/vue 会显示空方框占位，
      // 用户能立即在页面上发现，无需构建期 warning 噪声
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
        `// 由 vitepress-local-icons 插件自动生成，请勿手动编辑`,
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
