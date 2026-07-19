// vitepress-theme-ninc init-proxy — 生成 AI 摘要运行时代理脚手架
// 运行：npx vitepress-theme-ninc init-proxy 或 pnpm run init-proxy
// 用途：在用户项目根目录生成可直接部署到 Cloudflare / Vercel 的代理项目，
//       用户无需手写任何代理代码。
import * as clack from '@clack/prompts'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pc from 'picocolors'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** 检查用户是否取消（Ctrl+C） */
function handleCancel(value) {
  if (clack.isCancel(value)) {
    clack.cancel('已取消生成')
    process.exit(0)
  }
  return value
}

/** 单选列表 */
async function select(prompt, options, defaultIndex = 0) {
  const result = await clack.select({
    message: prompt,
    initialValue: options[defaultIndex]?.value,
    options: options.map(opt => ({
      value: opt.value,
      label: opt.label,
      hint: opt.desc,
    })),
  })
  return handleCancel(result)
}

/** 文本输入 */
async function question(prompt, defaultValue = '') {
  const result = await clack.text({
    message: prompt,
    initialValue: defaultValue || undefined,
    placeholder: defaultValue || undefined,
  })
  const val = handleCancel(result)
  return val || defaultValue
}

/** 是/否确认 */
async function confirm(prompt, defaultValue = false) {
  const result = await clack.confirm({
    message: prompt,
    initialValue: defaultValue,
  })
  return handleCancel(result)
}

/** 递归复制目录，目标已存在时询问是否覆盖 */
async function copyDir(src, dest, force = false) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, force)
    } else {
      if (fs.existsSync(destPath) && !force) {
        const overwrite = await confirm(`${destPath} 已存在，是否覆盖？`, false)
        if (!overwrite) {
          console.log(pc.dim(`  跳过 ${destPath}`))
          continue
        }
      }
      fs.copyFileSync(srcPath, destPath)
      console.log(pc.green('  ✓') + pc.dim(` ${destPath}`))
    }
  }
}

/** 检测当前目录是否为 VitePress 项目根目录 */
function detectVitePressRoot() {
  return fs.existsSync('.vitepress') || fs.existsSync('index.md')
}

// ============== 模板路径 ==============

const TEMPLATES = {
  cloudflare: path.join(__dirname, 'templates', 'cloudflare-worker'),
  vercel: path.join(__dirname, 'templates', 'vercel-api'),
}

// ============== 主流程 ==============

export async function runProxy() {
  clack.intro(pc.cyan(pc.bold(' vitepress-theme-ninc init-proxy — AI 摘要代理脚手架 ')))

  if (!detectVitePressRoot()) {
    clack.cancel('未检测到 VitePress 项目（缺少 .vitepress 目录或 index.md），请在你的博客根目录运行本命令')
    process.exit(1)
  }

  // 1. 选择部署平台
  const platform = await select('你想把代理部署到哪个平台？', [
    { value: 'cloudflare', label: 'Cloudflare Workers', desc: '免费额度高，国内访问相对稳定，推荐' },
    { value: 'vercel', label: 'Vercel Serverless', desc: '部署最简单，绑定域名后可用' },
  ])

  // 2. 目标目录
  const defaultDir = platform === 'cloudflare' ? 'proxy/cloudflare-ai-proxy' : 'proxy/vercel-ai-proxy'
  const dirInput = await question('代理项目放在哪个目录？（相对当前目录）', defaultDir)
  const targetDir = path.resolve(process.cwd(), dirInput)

  // 3. 复制模板
  const templateDir = TEMPLATES[platform]
  if (!fs.existsSync(templateDir)) {
    clack.cancel(`模板缺失：${templateDir}，请重新安装主题或到 GitHub 提交 issue`)
    process.exit(1)
  }

  clack.log.step(`正在复制 ${platform === 'cloudflare' ? 'Cloudflare Worker' : 'Vercel Serverless'} 模板...`)
  await copyDir(templateDir, targetDir)

  // 4. 输出下一步指引
  const relative = path.relative(process.cwd(), targetDir)
  const lines = []
  lines.push('')
  lines.push(pc.green(pc.bold('  代理项目已生成！')))
  lines.push('')
  lines.push(pc.dim('  接下来只需要 3 步：'))
  lines.push('')

  if (platform === 'cloudflare') {
    lines.push(pc.cyan('  ① 进入目录并安装 wrangler'))
    lines.push(pc.dim(`     cd ${relative}`))
    lines.push(pc.dim('     pnpm add -D wrangler'))
    lines.push('')
    lines.push(pc.cyan('  ② 登录 Cloudflare 并部署'))
    lines.push(pc.dim('     pnpm wrangler login'))
    lines.push(pc.dim('     pnpm wrangler deploy'))
    lines.push('')
    lines.push(pc.cyan('  ③ 到 Cloudflare 后台配置环境变量（OPENAI_API_KEY 等）'))
    lines.push(pc.dim('     https://dash.cloudflare.com → Workers & Pages → 你的 Worker → Settings → Variables'))
    lines.push('')
    lines.push(pc.cyan('  部署完成后，把 Worker 地址填到 themeConfig：'))
    lines.push(pc.dim('     aiSummary: {'))
    lines.push(pc.dim('       enable: true,'))
    lines.push(pc.dim('       runtime: {'))
    lines.push(pc.dim('         enable: true,'))
    lines.push(pc.dim(`         endpoint: 'https://<你的Worker名>.<你的子域>.workers.dev'`))
    lines.push(pc.dim('       }'))
    lines.push(pc.dim('     }'))
  } else {
    lines.push(pc.cyan('  ① 进入目录并安装 Vercel CLI'))
    lines.push(pc.dim(`     cd ${relative}`))
    lines.push(pc.dim('     pnpm add -D vercel'))
    lines.push('')
    lines.push(pc.cyan('  ② 登录 Vercel 并部署'))
    lines.push(pc.dim('     pnpm vercel login'))
    lines.push(pc.dim('     pnpm vercel --prod'))
    lines.push('')
    lines.push(pc.cyan('  ③ 到 Vercel 后台配置环境变量（OPENAI_API_KEY 等）'))
    lines.push(pc.dim('     https://vercel.com → 你的项目 → Settings → Environment Variables'))
    lines.push('')
    lines.push(pc.cyan('  部署完成后，把接口地址填到 themeConfig：'))
    lines.push(pc.dim('     aiSummary: {'))
    lines.push(pc.dim('       enable: true,'))
    lines.push(pc.dim('       runtime: {'))
    lines.push(pc.dim('         enable: true,'))
    lines.push(pc.dim(`         endpoint: 'https://<你的项目名>.vercel.app/api/summary'`))
    lines.push(pc.dim('       }'))
    lines.push(pc.dim('     }'))
  }

  lines.push('')
  lines.push(pc.dim('  详细图文教程：https://theme.ninc.top/guide/ai-summary-proxy'))
  lines.push('')
  clack.outro(lines.join('\n'))
}
