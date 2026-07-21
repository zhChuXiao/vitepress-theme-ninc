# CLI 命令行工具

主题自带一个命令行小工具 `vitepress-theme-ninc`，封装了几件平时要手动做的事：初始化博客、预生成 AI 摘要、生成代理脚手架。本页教你怎么用它，不需要任何命令行基础。

## 先认识它

主题内置三个命令：

| 命令 | 干什么用 | 什么时候用 |
| --- | --- | --- |
| `init` | 从零生成一个完整的博客 | 第一次建站 |
| `summary` | 本地预生成所有文章的 AI 摘要 | 写完新文章后 |
| `init-proxy` | 生成 AI 摘要代理的脚手架 | 想部署运行时代理时 |

### 怎么运行

**方式一：包管理器脚本（推荐）**

如果你是用 `init` 命令初始化的博客，`package.json` 里已经预置了 `summary` 和 `init-proxy` 两个脚本，直接用：

::: code-group

```bash [npm]
npm run summary
npm run init-proxy
```

```bash [yarn]
yarn run summary
yarn run init-proxy
```

```bash [pnpm]
pnpm run summary
pnpm run init-proxy
```

:::

可选参数照常加在后面，例如 `pnpm run summary --force`。

**方式二：`npx` 命令（通用）**

不适合走包管理器脚本时（比如临时调试、不在博客项目目录里），用 `npx`：

```bash
npx vitepress-theme-ninc <命令>
```

不带任何命令直接运行 `npx vitepress-theme-ninc`，默认执行 `init`。

### 老项目补上命令

如果你的 `package.json` 是早期手动建的、还没有这两个脚本，把下面几行加到 `scripts` 字段里即可：

```json
{
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build",
    "preview": "vitepress preview",
    "summary": "vitepress-theme-ninc summary",
    "init-proxy": "vitepress-theme-ninc init-proxy"
  }
}
```

::: tip 两种方式等价
`pnpm run summary` 与 `npx vitepress-theme-ninc summary` 调用的是同一个命令、同一份代码，效果完全一致。包管理器脚本更短、有终端补全，所以是推荐写法。
:::

**所有命令都是交互式的**：运行后会用中文一步一步问你问题，用键盘 ↑ ↓ 选择、回车确认、空格多选。随时可以按 `Ctrl + C` 取消，不会破坏任何文件。

## init：初始化博客

```bash
npx vitepress-theme-ninc init
```

`init` 只能用 `npx` 运行——它要在**空文件夹**里从零建项目，那时还没 `package.json`，自然也就没有脚本可用。

运行后会带你从零生成一个可以直接跑起来的博客。会问的问题依次是：

1. **初始化模式**：`基础博客配置`（推荐，带示例文章和所有页面）或 `极简配置`（只有核心文件）。
2. **配置方式**：`使用默认配置` 或 `自定义配置`（自定义会多问几个开关，比如要不要 PWA、评论）。
3. **基础信息**：站点标题、描述、网址、作者名、邮箱。

回答完毕后自动生成全部文件，并告诉你下一步：

::: code-group

```bash [npm]
npm install      # 安装依赖
npm run dev      # 启动本地预览
```

```bash [yarn]
yarn install      # 安装依赖
yarn run dev      # 启动本地预览
```

```bash [pnpm]
pnpm install      # 安装依赖
pnpm run dev      # 启动本地预览
```

:::

浏览器打开终端里显示的地址（通常是 `http://localhost:5173`），你的博客就跑起来了。

::: tip 在已有项目里运行会怎样
它会检测出当前目录已有配置，生成每个已存在的文件前都会先问「是否覆盖」，选否就跳过，不会冲掉你的内容。
:::

::: tip package.json 的特殊处理：选「不覆盖」也会合并更新
`package.json` 是个例外——即使你选「不覆盖」，CLI 也会做合并更新，确保：

- **`vitepress-theme-ninc` 版本强制对齐**：与当前 CLI 版本齐平（正式版 `^x.x.x`，预发布版精确锁定）。这避免了你装了新版 CLI、项目却还在用旧版主题导致特性对不上的情况。
- **缺失依赖自动补充**：`vitepress` / `vue` / `nes-vue` / `patch-package` 等如果缺失会自动加上，已有的不会动。
- **缺失脚本自动补充**：`summary` / `init-proxy` / `postinstall` 缺失会自动补上，已有的保留你的版本。

其他字段（`name` / `version` / `description` / `type` / 已有的依赖版本和脚本内容）一律不动，尊重你的项目配置。合并完成后会打印变更清单，让你清楚改了什么。

如果文件不存在或 JSON 解析失败，会直接生成新的 `package.json`。
:::

::: tip init 会顺手创建 `public/svg/` 目录
`init` 命令在两种模式下都会在 `public/svg/` 下放一个 `example.svg` 示例图标，方便你直接往这个目录丢自己的 `.svg` 文件用。把 `.svg` 丢进去后，在 `themeConfig` 的 `icon` 字段里写 `'svg:文件名'` 就能用——无需任何额外配置。详见 [图标使用指南](./icons.md)。
:::

## summary：预生成 AI 摘要

::: code-group

```bash [npm]
npm run summary
```

```bash [yarn]
yarn run summary
```

```bash [pnpm]
pnpm run summary
```

:::

也可用 `npx vitepress-theme-ninc summary`。

**它是干嘛的**：正常情况下，AI 摘要在构建时生成。文章多了以后构建会变慢。这条命令让你把「生成摘要」挪到本地手动执行，构建时只读现成的缓存，耗时和没开 AI 一样。

**使用前提**：`.vitepress/themeConfig.ts` 里已配置好 `aiSummary`（还没配？先看 [AI 文章摘要](/guide/ai-summary)），并建议把 `buildGenerate` 设为 `false`：

```ts
aiSummary: {
  enable: true,
  provider: 'deepseek',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  model: 'deepseek-chat',
  buildGenerate: false // 构建期只读缓存，不调用大模型
}
```

**日常使用**：每次写完新文章（或改了旧文章正文），在终端跑一次命令。它会自动跳过没变化的文章，只给新增和修改过的生成，几秒就完事：

```text
🤖 [vitepress-theme-ninc] AI 摘要：缓存命中 12 篇，新生成 2 篇。
```

然后把缓存文件提交 git，之后本地和部署平台的构建都直接复用：

```bash
git add .vitepress/ai-summary-cache.json
git commit -m "chore: update ai summary cache"
```

**两个可选参数**（加在命令后面）：

::: code-group

```bash [npm]
# 全部重新生成（换了模型或 prompt 后用一次）
npm run summary -- --force

# 文章不在 posts/ 目录时指定目录
npm run summary -- --dir articles
```

```bash [yarn]
# 全部重新生成（换了模型或 prompt 后用一次）
yarn run summary --force

# 文章不在 posts/ 目录时指定目录
yarn run summary --dir articles
```

```bash [pnpm]
# 全部重新生成（换了模型或 prompt 后用一次）
pnpm run summary --force

# 文章不在 posts/ 目录时指定目录
pnpm run summary --dir articles
```

:::

::: tip npm 需要多余的 `--`
npm run 执行脚本时，参数要写在 `--` 之后才会透传给脚本本身；yarn 和 pnpm 则可以直接跟在后面。
:::

## init-proxy：生成代理脚手架

::: code-group

```bash [npm]
npm run init-proxy
```

```bash [yarn]
yarn run init-proxy
```

```bash [pnpm]
pnpm run init-proxy
```

:::

也可用 `npx vitepress-theme-ninc init-proxy`。

**它是干嘛的**：生成「AI 摘要运行时代理」的完整项目代码（Cloudflare Worker 或 Vercel Serverless 二选一），放到你项目的 `proxy/` 目录里，你拿去直接部署，一行代码都不用写。

运行后只需回答两个问题（平台、存放目录），然后把生成的项目部署出去。部署的每一步（注册账号、装工具、填 Key）都有详细图文指引，见 [AI 摘要代理部署](/guide/ai-summary-proxy)。

## 常见问题

### 提示 command not found 或找不到模块

- 用包管理器脚本：在博客项目根目录执行，且确认依赖已经装过（`package.json` 里有 `vitepress-theme-ninc`）。
- 用 `npx vitepress-theme-ninc`：同样要在项目根目录，`npx` 会优先用项目里安装的主题包。

### 运行 summary 提示「themeConfig.aiSummary 未启用」

`.vitepress/themeConfig.ts` 里的 `aiSummary.enable` 不是 `true`，或者文件不在默认位置。命令只认 `.vitepress/themeConfig.ts`（也支持 `.mts` / `.js`）。

### 运行 summary 提示 API Key 缺失

命令会自动读取项目根目录的 `.env` 和 `.env.local`。检查 Key 是否写在这两个文件之一、变量名和配置里的 `process.env.XXX` 是否一致。

### 中途按了 Ctrl + C

所有命令都支持随时取消，已生成的文件会保留，未生成的不会有残留，重新运行一遍即可。
