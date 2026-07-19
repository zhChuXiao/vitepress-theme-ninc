# AI 文章摘要

文章页的摘要卡片默认需要手动在 frontmatter 里填写 `articleGPT`。开启 `aiSummary` 后，主题会在构建时调用大模型，自动为没填摘要的文章生成摘要。整个过程不需要改动任何文章，开箱即用。

本页从零开始，带你完成「申请 Key → 配置 → 构建验证 → 部署」的完整流程。如果你只想查配置字段，直接看 [配置参考](/config/ai-summary)。

## 先了解两件事

**摘要在哪里显示**：文章页顶部有一个「文章摘要」卡片，打字机效果逐字输出。没开 AI 时它只显示你手动写的 `articleGPT`；开了 AI 之后，没写摘要的文章也能自动生成。手动写的永远优先，AI 不会覆盖。

**会花多少钱**：以 DeepSeek 为例，输入约 1 元/百万 token。主题做了三件事控制开销：

- 发送前会剥离代码块、图片、HTML 标签，只留纯文字，且默认最多发前 2000 字
- 每篇文章的摘要会按正文内容算哈希缓存起来，正文没变过就不会重复调用
- 构建时最多 3 篇文章同时生成，不会因为请求太密被限流

一个 50 篇文章的博客，首次全量生成大约消耗 5 万 token，之后每次构建只处理新增和修改的文章，日常开销可以忽略。

::: warning API Key 的安全
Key 只在你电脑的构建过程中使用，主题不会把它写进网站产物，访客看不到。但前提是你别把 Key 直接写在配置里提交到公开仓库 —— 用环境变量，下面会教。
:::

## 准备工作

一个已经能正常 `pnpm dev` 运行的站点，以及一个大模型平台的账号。

主题支持所有 OpenAI 兼容接口，内置了多家预设，任选其一即可：

| 平台 | provider | 注册地址 | 说明 |
| --- | --- | --- | --- |
| DeepSeek | `deepseek` | [platform.deepseek.com](https://platform.deepseek.com/) | 国内直连，价格便宜，中文效果好 |
| 智谱 GLM | `glm` | [open.bigmodel.cn](https://open.bigmodel.cn/) | GLM Coding Plan 套餐端点 |
| 通义千问 | `qwen` | [bailian.console.aliyun.com](https://bailian.console.aliyun.com/) | 阿里云百炼平台 |
| Kimi | `kimi` | [platform.moonshot.cn](https://platform.moonshot.cn/) | 月之暗面 |
| MiniMax | `minimax` | [platform.minimaxi.com](https://platform.minimaxi.com/) | MiniMax M 系列模型 |
| 小米 MiMo | `mimo` | [platform.xiaomimimo.com](https://platform.xiaomimimo.com/) | 按量付费；Token Plan 套餐用 `mimo-token-plan` |
| 豆包 | `doubao` | [console.volcengine.com](https://console.volcengine.com/ark) | 火山方舟按量付费；Coding Plan 套餐用 `volcengine-coding` |
| 胜算云 | `shengsuanyun` | [shengsuanyun.com](https://www.shengsuanyun.com/) | 聚合路由，一个 Key 调用数百种模型 |
| StepFun | `stepfun` | [platform.stepfun.com](https://platform.stepfun.com/) | 阶跃星辰 Step Plan 套餐端点 |
| OpenAI | `openai` | [platform.openai.com](https://platform.openai.com/) | 需要海外网络与支付方式 |

下面的步骤以 DeepSeek 为例，其他平台只是「预设名、Key、模型名」不同，流程完全一样。

::: tip 你要用的平台不在这个表里？
硅基流动、OpenRouter、自建网关、本地模型等服务走「自定义」模式接入，需要多填一个 `baseURL` 字段，具体写法见第三步末尾的 [使用其他 AI 服务（自定义）](#使用其他-ai-服务-自定义)。
:::

## 第一步：获取 API Key （以 DeepSeek 为例）

1. 打开 [DeepSeek 开放平台](https://platform.deepseek.com/)，注册并登录。
2. 进入左侧「API keys」页面，点击「创建 API key」。
3. 随便起个名字（比如 `blog`），创建后立刻复制保存 —— 这个 Key 只显示一次。

::: tip 先充点小钱
DeepSeek 需要账户有余额才能调用。充 5 元够一个博客用很久。其他平台（智谱、通义）有免费额度，可以跳过充值。
:::

## 第二步：配置环境变量

API Key 不要直接写在配置文件里，用环境变量传入。

在**项目根目录**（和 `package.json` 同级）新建 `.env.local` 文件：

```bash
# .env.local
DEEPSEEK_API_KEY=sk-你的真实Key
```

然后确认 `.gitignore` 里有这一行（VitePress 项目模板默认已包含）：

```text
.env.local
```

VitePress 构建时会自动加载 `.env.local`，不需要装任何插件。部署时的环境变量配置在 [第五步](#第五步-部署时做什么) 讲。

## 第三步：修改主题配置

打开 `.vitepress/themeConfig.ts`，加上 `aiSummary` 配置：

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  // ...你已有的配置
  aiSummary: {
    enable: true,
    provider: 'deepseek',
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    model: 'deepseek-chat'
  }
})
```

四个字段就够了，其余都用默认值。各字段的完整说明见 [配置参考](/config/ai-summary)。

用其他平台时换 `provider` 和 `model`：

```ts
// 智谱 GLM（Coding Plan 套餐端点，模型按套餐支持的编码填写）
aiSummary: {
  enable: true,
  provider: 'glm',
  apiKey: process.env.GLM_API_KEY || '',
  model: 'glm-5.2'
}

// ChatGPT 5.6 模型，需要海外网络
aiSummary: {
  enable: true,
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY || '',
  model: 'gpt-5.6-sol'
}
```

### 使用其他 AI 服务（自定义）

除了上面这些内置平台，主题还支持所有提供 **OpenAI 兼容接口** 的服务。这类服务数量很多，无法一一内置，主题统一用 `provider: 'custom'` 来接入。

**为什么要用 custom？**

内置平台（deepseek、glm 等）主题已经帮你记好了接口地址，你只需要填 Key 和模型名。但如果你用的是硅基流动、OpenRouter、自建的代理网关、甚至是本地跑的模型（如 Ollama），主题不知道它的接口地址，需要你自己填进去 —— 这就是 `provider: 'custom'` 存在的意义。

**接入前需要确认一件事**

这个服务必须提供 **OpenAI 兼容接口**，也就是地址格式和 OpenAI 官方一致。你的服务商通常会写明「兼容 OpenAI SDK」或「支持 OpenAI API 格式」。如果你不确定，可以直接问客服或在文档里搜「OpenAI compatible」。

**配置怎么写**

`custom` 模式下，`provider` 固定写 `'custom'`，然后额外加一个 `baseURL` 字段，其他字段和内置平台一样：

```ts
aiSummary: {
  enable: true,
  provider: 'custom',
  baseURL: 'https://api.example.com/v1',
  apiKey: process.env.YOUR_API_KEY || '',
  model: 'your-model-name',
  logoText: 'AI'
}
```

**注意 `baseURL` 的格式**：它必须是一个完整的 URL，以 `http://` 或 `https://` 开头，以版本号结尾（通常是 `/v1`），**不要** 在后面加 `/chat/completions`。主题会自动帮你拼上这个路径。下面几个例子供你参考：

| 服务 | `baseURL` 示例 |
| --- | --- |
| 硅基流动 | `https://api.siliconflow.cn/v1` |
| OpenRouter | `https://openrouter.ai/api/v1` |
| 自建网关 | `https://ai.your-domain.com/v1` |
| Ollama（本地） | `http://localhost:11434/v1` |

上表中的地址是否长期有效取决于服务商自己的变更，如果按表填写后构建报错「请求失败」，请到服务商控制台查看最新文档，复制它的 base URL 即可。

**验证接口是否正常工作**

`custom` 模式下最常见的错误是 `baseURL` 填错导致请求 404。你可以在构建前先用手动 curl 测试一次（把下面命令里的地址和 Key 换成你的）：

```bash
curl -X POST https://api.example.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的Key" \
  -H "Content-Type: application/json" \
  -d '{"model":"你的模型名","messages":[{"role":"user","content":"测试"}]}'
```

如果返回了正常的 JSON 响应（包含 `choices[0].message.content`），就说明接口正常，可以直接拿来填进 `baseURL`。如果返回 404 或地址无法访问，检查 base URL 是否多写了 `/chat/completions`，或是否需要加末尾的 `/v1`。

## 第四步：构建并验证

先找一篇**没填** `articleGPT` 的文章（或者临时删掉某篇文章的这行配置），然后执行：

```bash
pnpm build
```

留意终端输出，成功时会看到：

```text
🤖 [vitepress-theme-ninc] AI 摘要：缓存命中 0 篇，新生成 1 篇。
```

再执行 `pnpm preview` 打开那篇文章，顶部的摘要卡片会用打字机效果输出 AI 生成的摘要，右上角胶囊显示「DeepSeek」。

如果看到的是这样的提示，说明配置有问题：

```text
⚠️  [vitepress-theme-ninc] aiSummary 已启用，但以下配置缺失：
   apiKey、model
   已自动降级为不生成 AI 摘要，构建将继续，文章页摘要回退到 description。
```

按提示检查 `.env.local` 是否存在、变量名有没有拼错、改完配置后有没有重新构建。即使配置错了也**不会构建失败**，文章页会回退显示 `description`，这是故意的兜底设计。

::: tip 哪些文章不会生成
- 已经手动填了 `articleGPT` 的文章（手动优先，不浪费 token）
- 加密文章（避免内容发送到第三方接口）
- 正文太短的文章（清洗后不足 50 字，没什么好摘要的）
- 命中 `exclude` 排除规则的文章
:::

## 第五步：部署时做什么

部署和本地只有一件事不同：本地用 `.env.local` 存 Key，线上要在部署平台里配环境变量。另外建议把缓存文件提交到仓库，CI 构建时能省下重复生成的费用。

### 1. 提交缓存文件

首次构建成功后，项目里会多出一个 `.vitepress/ai-summary-cache.json`，里面存着每篇文章的摘要和内容哈希。**把它提交到 git**：

```bash
git add .vitepress/ai-summary-cache.json
git commit -m "chore: add ai summary cache"
```

这样 CI 拉代码后直接复用缓存，只有新增或修改过的文章才会调用大模型。如果你不希望它进仓库，把它加进 `.gitignore` 即可，代价是每次 CI 构建都重新生成（多费一点 token）。

### 2. 在部署平台配置环境变量

| 平台 | 配置位置 |
| --- | --- |
| Vercel | Project Settings → Environment Variables，添加 `DEEPSEEK_API_KEY` |
| Netlify | Site settings → Environment variables，添加同名变量 |
| GitHub Actions | 仓库 Settings → Secrets and variables → Actions 添加同名 Secret，工作流里通过 `secrets` 上下文注入 |
| 自有服务器 | 构建前 `export DEEPSEEK_API_KEY=sk-xxx`，或把 `.env.local` 放到服务器项目目录 |

GitHub Actions 的完整示例：

```yaml
- name: Build
  run: pnpm build
  env:
    DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
```

::: warning 变量必须在构建环境里
VitePress 的摘要是在 `pnpm build` 时生成的，Key 必须在**构建环境**可用。在 Nginx、宝塔这类运行环境配变量没有意义。
:::

### 3. 检查构建日志

部署完成后看一眼平台的构建日志，确认出现「新生成 N 篇」或「缓存命中 N 篇」而不是「配置缺失」警告，就说明线上生成正常。

完整的平台部署流程（Node 版本、SPA 回退、HTTPS 等）见 [部署指南](./deployment.md)。

## 可选：CLI 预生成（构建零耗时）

默认模式下摘要在 `pnpm build` 时生成。文章多、接口慢（部分中转站单篇要 30 秒以上）时，首次全量生成会明显拉长构建。如果你希望构建永远保持原速，可以把生成动作挪到本地手动执行：

```ts
aiSummary: {
  enable: true,
  provider: 'deepseek',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  model: 'deepseek-chat',
  buildGenerate: false // 构建期只读缓存，绝不调用大模型
}
```

之后的工作流变成：

::: code-group

```bash [npm]
# 写完文章后本地跑一次（只处理新增与修改过的文章）
npm run summary

# 缓存文件提交 git，之后本地与 CI 构建都零耗时复用
git add .vitepress/ai-summary-cache.json
```

```bash [yarn]
# 写完文章后本地跑一次（只处理新增与修改过的文章）
yarn run summary

# 缓存文件提交 git，之后本地与 CI 构建都零耗时复用
git add .vitepress/ai-summary-cache.json
```

```bash [pnpm]
# 写完文章后本地跑一次（只处理新增与修改过的文章）
pnpm run summary

# 缓存文件提交 git，之后本地与 CI 构建都零耗时复用
git add .vitepress/ai-summary-cache.json
```

:::

命令会自动读取 `.vitepress/themeConfig.ts` 和 `.env.local`，与构建期共用同一套生成与缓存逻辑。换模型或 prompt 后加 `--force` 全量重新生成。命令的完整用法见 [CLI 命令行工具](/guide/cli#summary-预生成-ai-摘要)，字段说明见 [配置参考 - CLI 预生成](/config/ai-summary#cli-预生成)。

## 可选：运行时代理（流式生成）

构建期生成已经能覆盖绝大多数场景。只有当你的站点**经常新增文章但很少重新构建**时，才需要考虑运行时代理 —— 它让浏览器在打开文章时实时请求一个代理接口生成摘要，**逐字流式输出**，效果和 ChatGPT 一样。

**为什么不能直接在浏览器里调大模型**：那样 API Key 会打进前端产物，任何人打开开发者工具就能拿走你的 Key 去刷量。运行时代理的原理是把 Key 放在你自己部署的代理服务上，浏览器只跟代理通信。

部署不用写代码，一条命令生成完整的代理项目（Cloudflare / Vercel 二选一）：

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

接下来每一步（注册平台账号、装部署工具、填环境变量）都有面向零基础的图文指引：**[AI 摘要代理部署](/guide/ai-summary-proxy)**。

部署完把代理地址填进配置即可：

```ts
aiSummary: {
  enable: true,
  // ...provider / apiKey / model 保持不变
  runtime: {
    enable: true,
    endpoint: 'https://你的代理地址.workers.dev'
  }
}
```

代理不可用时页面会自动回退到 `description` 或你配置的兜底文案，不会有任何报错提示打扰读者；生成成功后摘要缓存在访客浏览器里，同一访客对同一篇文章只调用一次代理。

## 常见问题

### 构建时提示配置缺失

`enable: true` 但 `apiKey` / `model` / `baseURL` 没配齐。检查 `.env.local` 是否存在、变量名是否拼对、部署平台的环境变量是否已添加。系统会自动降级为不生成摘要，构建不会失败。

### 自定义服务请求失败或 404

`baseURL` 填错是最常见的原因。对照检查：是否以 `/v1`（或服务商要求的版本路径）结尾；是否多写了 `/chat/completions`（主题会自动拼接，多写会变成两个）；本地服务（Ollama 等）是否已启动。排查方法见第三步的 [验证接口是否正常工作](#使用其他-ai-服务-自定义)。

### 改了文章，摘要没更新

只有正文变化才会重新生成。只改 frontmatter（标题、标签等）不会触发。想强制全部重新生成，临时设置 `force: true` 构建一次，然后改回来。

### 想换模型或调整摘要风格

直接改 `model` 或自定义 `prompt`（见 [配置参考](/config/ai-summary#字段说明)）。换了之后记得用 `force: true` 重新生成一次，否则会一直命中旧缓存。

### 生成的摘要不满意

对个别文章，手动在 frontmatter 填 `articleGPT` 即可，手动内容永远优先于 AI 生成。

### 运行时代理失败了会怎样

浏览器端请求代理失败（网络错误、超时、代理挂了）时，组件会静默回退到文章的 `description` 或你配置的 `fallbackText`，不弹错误提示、不影响阅读。
