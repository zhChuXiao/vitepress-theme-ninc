// packages/theme/scripts/build-node.mjs
// 用 esbuild 把 Node 端 .ts 入口打包为 .js
// 解决 npm 安装后 Node.js 不支持 node_modules 下 .ts type stripping 的问题
import esbuild from 'esbuild'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkgDir = path.resolve(__dirname, '..')
const srcNodeDir = path.resolve(pkgDir, 'src/node')
const distDir = path.resolve(pkgDir, 'dist')

// 清理 dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true })
}
fs.mkdirSync(distDir, { recursive: true })

// 读取 package.json 获取需要 external 的依赖
const pkg = JSON.parse(fs.readFileSync(path.resolve(pkgDir, 'package.json'), 'utf-8'))
const externalDeps = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.optionalDependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
]

// 额外标记一些 Node 内置模块
const external = [
  ...externalDeps,
  // Node 内置模块
  'node:path',
  'node:url',
  'node:fs',
  'node:crypto',
  'node:os',
  'node:child_process',
  'node:module',
  'node:process',
  'path',
  'url',
  'fs',
  'fs-extra',
  'crypto',
  'os',
  'child_process',
  'module',
  'process'
]

console.log('external deps:', external.length, '个')

// 打包 Node 端入口
await esbuild.build({
  entryPoints: {
    'defineConfig': path.join(srcNodeDir, 'defineConfig.ts'),
    'defineThemeConfig': path.join(srcNodeDir, 'defineThemeConfig.ts'),
    'index': path.join(srcNodeDir, 'index.ts'),
    // utils 单独打包：用户在 paths.mjs 中通过 'vitepress-theme-ninc/utils' 导入
    // Node.js 无法对 node_modules 下的 .ts 做类型擦除，必须提供编译后的 .js
    'utils': path.join(srcNodeDir, 'utils/index.ts')
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  outdir: distDir,
  outExtension: { '.js': '.js' },
  external,
  // 保留 .mjs 文件的 import 路径（它们会被 bundle 进来）
  logLevel: 'info',
  // 发布到 npm 不带 sourcemap，减小包体积
  sourcemap: false,
  // 保持合法的 ESM import 路径
  // esbuild bundle 后内部 import 不再需要扩展名
  banner: {
    js: '// vitepress-theme-ninc Node 端产物 — 由 esbuild 打包生成\n// 请勿手动编辑'
  }
})

console.log('✓ Node 端打包完成 → dist/')
