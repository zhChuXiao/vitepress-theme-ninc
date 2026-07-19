// vitepress-theme-ninc summary — 本地预生成 AI 摘要到缓存文件
// 运行：npx vitepress-theme-ninc summary [--force] [--dir <文章目录>]
// 用途：aiSummary.buildGenerate 为 false 时，构建期只读缓存不调用大模型，
//       摘要改由本命令在本地预生成；缓存文件提交 git 后 CI 构建直接复用，构建零耗时。
import * as clack from '@clack/prompts'
import fs from 'node:fs'
import path from 'node:path'
import pc from 'picocolors'
import { createJiti } from 'jiti'
import { getAllPosts } from '../node/utils/getPostData.mjs'
import { generateAiSummaries, getProviderMissing } from '../node/utils/aiSummary.mjs'

/** 解析命令行参数（--force / --dir <path>） */
function parseArgs(argv) {
  const args = { force: false, dir: '' }
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--force') args.force = true
    if (argv[i] === '--dir' && argv[i + 1]) args.dir = argv[++i]
  }
  return args
}

/** 加载 .env 与 .env.local（Node 20.6+ 原生支持，不覆盖已有环境变量） */
function loadEnvFiles() {
  for (const name of ['.env', '.env.local']) {
    try {
      process.loadEnvFile(path.resolve(process.cwd(), name))
    } catch {
      // 文件不存在或格式错误时静默跳过，与 VitePress 的容错行为一致
    }
  }
}

/** 用 jiti 加载用户的 themeConfig.ts（支持 TS 与 ESM 命名导出） */
async function loadThemeConfig() {
  const candidates = ['.vitepress/themeConfig.ts', '.vitepress/themeConfig.mts', '.vitepress/themeConfig.js']
  const configPath = candidates
    .map((p) => path.resolve(process.cwd(), p))
    .find((p) => fs.existsSync(p))
  if (!configPath) return null
  const jiti = createJiti(import.meta.url)
  const mod = await jiti.import(configPath)
  return mod?.themeConfig ?? mod?.default ?? mod
}

/** summary 子命令主流程 */
export async function runSummary() {
  const args = parseArgs(process.argv.slice(3))
  clack.intro(pc.cyan(pc.bold(' vitepress-theme-ninc summary ')))

  // 1. 加载环境变量（API Key 通常放在 .env.local）
  loadEnvFiles()

  // 2. 读取主题配置
  const themeConfig = await loadThemeConfig()
  if (!themeConfig) {
    clack.cancel('未找到 .vitepress/themeConfig.ts，请在 VitePress 项目根目录运行本命令')
    process.exit(1)
  }
  const aiSummary = themeConfig?.aiSummary
  if (!aiSummary?.enable) {
    clack.cancel('themeConfig.aiSummary 未启用（enable 不为 true），无需生成摘要')
    process.exit(1)
  }

  // 前置校验 provider 配置：CLI 是用户主动触发的预生成，配置缺失应立即明确告知并退出，
  // 而不是静默走完扫描流程后输出"生成 0 篇"让用户误以为成功
  const { missing } = getProviderMissing(aiSummary)
  if (missing.length > 0) {
    clack.cancel(
      `aiSummary 配置缺失：${missing.join('、')}。请在 .vitepress/themeConfig.ts 或 .env.local 中补齐后重试。`
    )
    process.exit(1)
  }

  // 3. 扫描文章（与构建期使用同一套 getAllPosts，保证缓存 key 与内容哈希一致）
  const postsDir = args.dir
    ? path.resolve(process.cwd(), args.dir)
    : path.resolve(process.cwd(), 'posts')
  if (!fs.existsSync(postsDir)) {
    clack.cancel(`文章目录不存在：${path.relative(process.cwd(), postsDir)}（可用 --dir 指定）`)
    process.exit(1)
  }
  const posts = await getAllPosts(postsDir, undefined, { includeContent: true })

  // 4. 调用与构建期完全一致的生成流程（写缓存、并发限制、失败降级均内置）
  //    onProgress：终端实时显示"生成中 / 成功 / 失败"状态，避免长时间无反馈
  //    onToken：流式传输逐 token 输出到终端，让用户直观看到大模型正在生成
  let streaming = false // 标记当前是否有流式 token 正在输出（用于换行管理）
  const { stats } = await generateAiSummaries(
    posts,
    {
      ...aiSummary,
      // CLI 是手动触发的预生成，必须真正调用大模型，忽略 buildGenerate: false
      buildGenerate: true,
      force: args.force || aiSummary.force,
    },
    (ctx) => {
      if (ctx.type === 'start') {
        const parts = []
        if (ctx.stats.cached > 0) parts.push(`缓存命中 ${ctx.stats.cached} 篇`)
        if (ctx.stats.skipped > 0) parts.push(`跳过 ${ctx.stats.skipped} 篇`)
        if (ctx.total > 0) parts.push(`待生成 ${ctx.total} 篇`)
        clack.log.step(`共扫描到 ${posts.length} 篇文章（${parts.join('，')}），开始调用大模型...`)
        if (ctx.total === 0) {
          clack.log.info(pc.dim('所有文章均命中缓存或被跳过，无需调用大模型'))
        }
      } else if (ctx.type === 'generating') {
        // 在 API 调用前给出反馈，让用户知道正在处理哪篇文章
        if (streaming) process.stdout.write('\n')
        console.log(pc.cyan(`  ⏳ [${ctx.index}/${ctx.total}]`) + pc.dim(` 生成中：${ctx.path}`))
        process.stdout.write(pc.dim('  ┃ '))
        streaming = true
      } else if (ctx.type === 'success') {
        if (streaming) process.stdout.write('\n')
        streaming = false
        console.log(
          pc.green(`  ✓ [${ctx.completed}/${ctx.total}]`) + pc.dim(` 生成成功：${ctx.path}`)
        )
      } else if (ctx.type === 'failed') {
        if (streaming) process.stdout.write('\n')
        streaming = false
        console.log(
          pc.yellow(`  ✗ [${ctx.completed}/${ctx.total}]`) +
            pc.dim(` 生成失败：${ctx.path}（${ctx.error || '未知错误'}）`)
        )
      }
    },
    // onToken：流式逐 token 输出，让用户实时看到大模型正在生成摘要
    ({ token }) => {
      process.stdout.write(token)
    },
  )
  // 确保流式输出结束后有换行
  if (streaming) process.stdout.write('\n')

  // 5. 结果汇总
  const cacheFile = aiSummary.cache?.file || '.vitepress/ai-summary-cache.json'
  clack.outro(
    pc.green('生成完成') +
      pc.dim(
        `  缓存命中 ${stats.cached} 篇，新生成 ${stats.generated} 篇` +
          (stats.failed > 0 ? `，失败 ${stats.failed} 篇（下次运行会重试）` : '') +
          `，跳过 ${stats.skipped} 篇\n` +
          `缓存已写入 ${cacheFile}，提交 git 后构建（buildGenerate: false）即可零耗时复用`
      )
  )
}
