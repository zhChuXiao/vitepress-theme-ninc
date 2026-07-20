# aiSummary AI 摘要

![AI 摘要](/images/article/ai.png)

构建时调用大模型，为没有手动填写 `articleGPT` 的文章自动生成摘要。本页是配置字段参考，从零接入的完整教程（申请 Key、环境变量、部署）见 [指南 - AI 文章摘要](/guide/ai-summary)。

::: info 默认关闭
`aiSummary.enable` 默认为 `false`。不开启时摘要行为与旧版本一致：只有手动填写 `articleGPT` 的文章才显示摘要卡片。
:::

## 字段说明

### aiSummary 主表

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | 总开关，开启后才生成 AI 摘要 |
| `provider` | `string` | `'custom'` | 服务商预设：`openai` / `deepseek` / `kimi` / `glm` / `qwen` / `minimax` / `mimo` / `mimo-token-plan` / `doubao` / `volcengine-coding` / `shengsuanyun` / `stepfun` / `custom` |
| `baseURL` | `string` | `''` | OpenAI 兼容接口地址；预设 provider 自动填充，可用此字段覆盖；`custom` 时必填。填到版本路径（如 `/v1`）为止，不要带 `/chat/completions`，主题会自动拼接 |
| `apiKey` | `string` | `''` | API Key。仅在构建期 Node 侧使用，不会注入浏览器产物；推荐用环境变量引用 |
| `model` | `string` | `''` | 模型名称，如 `deepseek-chat`、`glm-4-flash`、`gpt-4o-mini` |
| `prompt` | `string` | `''` | 自定义 system prompt，为空时使用内置 prompt（输出 80-120 字中文摘要） |
| `maxInputLength` | `number` | `2000` | 发送给大模型的正文最大字符数 |
| `concurrency` | `number` | `3` | 构建期并发请求数 |
| `timeout` | `number` | `30000` | 单篇请求超时（毫秒） |
| `retries` | `number` | `2` | 失败重试次数，指数退避（1s / 2s / 4s） |
| `force` | `boolean` | `false` | `true` 时忽略缓存全部重新生成（换模型或 prompt 后用一次） |
| `buildGenerate` | `boolean` | `true` | 构建期是否调用大模型。设为 `false` 时构建只读缓存、绝不发起请求（构建零耗时），摘要改由 CLI 命令 `pnpm run summary` 本地预生成，详见 [CLI 预生成](#cli-预生成) |
| `exclude` | `string[]` | `[]` | 排除生成的 glob 数组，如 `['posts/draft/**']`；加密文章始终自动排除 |
| `cache` | `object` | 见子表 | 内容哈希缓存配置 |
| `runtime` | `object` | 见子表 | 运行时代理配置（可选） |
| `logoText` | `string` | `''` | 摘要卡片右上角胶囊文案，默认取 provider 名称；`enable: false` 时固定显示 `FakeGPT` |
| `tip` | `string` | `''` | 摘要卡片底部说明文案 |

### cache 子表

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 是否启用内容哈希缓存 |
| `file` | `string` | `'.vitepress/ai-summary-cache.json'` | 缓存文件路径（相对项目根目录），建议提交 git 供 CI 复用 |

### runtime 子表

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | 是否启用浏览器端实时生成 |
| `endpoint` | `string` | `''` | 自部署的代理地址，API Key 保存在代理端；可用 `pnpm run init-proxy` 生成代理项目，部署教程见 [AI 摘要代理部署](/guide/ai-summary-proxy) |
| `stream` | `boolean` | `true` | 是否使用 SSE 流式传输（逐字输出）；代理不支持流式时会自动降级为一次性 JSON 返回，无需手动关闭 |
| `timeout` | `number` | `30000` | 浏览器端请求超时（毫秒），流式生成整体耗时较长 |
| `fallbackText` | `string` | `'AI 摘要暂时不可用，请直接阅读正文。'` | 代理失败时的兜底文案（文章有 `description` 时优先用 `description`） |

## 内置 provider 预设

| provider | 自动填充的 baseURL |
| --- | --- |
| `openai` | `https://api.openai.com/v1` |
| `deepseek` | `https://api.deepseek.com` |
| `kimi` | `https://api.moonshot.cn/v1` |
| `glm` | `https://open.bigmodel.cn/api/coding/paas/v4` |
| `qwen` | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| `minimax` | `https://api.minimaxi.com/v1` |
| `mimo` | `https://api.xiaomimimo.com/v1` |
| `mimo-token-plan` | `https://token-plan-cn.xiaomimimo.com/v1` |
| `doubao` | `https://ark.cn-beijing.volces.com/api/v3` |
| `volcengine-coding` | `https://ark.cn-beijing.volces.com/api/coding/v3` |
| `shengsuanyun` | `https://router.shengsuanyun.com/api/v1` |
| `stepfun` | `https://api.stepfun.com/step_plan/v1` |

::: warning 套餐类端点的使用限制
`glm`、`volcengine-coding`、`mimo-token-plan`、`stepfun` 均为各平台的**订阅套餐（Coding Plan / Token Plan / Step Plan）专属端点**，按平台规则仅限官方支持的编码工具中使用，且需要对应的套餐 API Key（如小米 Token Plan 的 Key 为 `tp-` 开头）。按量付费场景请改用对应的标准端点（通过 `baseURL` 覆盖），例如智谱标准端点 `https://open.bigmodel.cn/api/paas/v4`、火山方舟标准端点 `https://ark.cn-beijing.volces.com/api/v3`。
:::

## 示例

### 基础用法（DeepSeek）

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  aiSummary: {
    enable: true,
    provider: 'deepseek',
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    model: 'deepseek-chat'
  }
})
```

### 自定义接口（任意 OpenAI 兼容服务）

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  aiSummary: {
    enable: true,
    provider: 'custom',
    baseURL: 'https://your-openai-compatible-api.com/v1',
    apiKey: process.env.MY_API_KEY || '',
    model: 'your-model-name',
    prompt: '你是一位技术博客摘要助手，请用 2 句话概括文章核心要点，控制在 60 字以内。',
    maxInputLength: 1500,
    retries: 3,
    logoText: 'AI'
  }
})
```

### 同时启用运行时代理

```ts
aiSummary: {
  enable: true,
  provider: 'deepseek',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  model: 'deepseek-chat',
  runtime: {
    enable: true,
    endpoint: 'https://your-worker.your-subdomain.workers.dev',
    timeout: 15000,
    fallbackText: 'AI 摘要暂时不可用，请直接阅读正文。'
  }
}
```

## 行为说明

以下文章不会调用大模型（不消耗 token）：

- frontmatter 已手动填写 `articleGPT` 的文章（手动优先，不会被覆盖）
- 加密文章（`crypto.enable`）
- 命中 `exclude` 规则的文章
- 清洗后正文不足 50 字符的文章

缓存以**清洗后的正文哈希**为键：只改 frontmatter（标题、标签）不会重新生成，改正文才会。任何一步失败（配置缺失、超时、限流）都会降级为跳过该文章或回退 `description`，绝不阻断构建。

## CLI 预生成

默认模式（`buildGenerate: true`）在 `pnpm build` 时调用大模型。文章多、接口慢时首次全量生成会明显拉长构建时间。CLI 预生成把「生成」从「构建」中剥离：

```ts
aiSummary: {
  enable: true,
  provider: 'deepseek',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  model: 'deepseek-chat',
  buildGenerate: false // 构建期只读缓存，绝不调用大模型
}
```

配置后在项目根目录运行：

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

命令会读取 `.vitepress/themeConfig.ts` 中的 `aiSummary` 配置（自动加载 `.env` / `.env.local`），扫描 `posts/` 目录，只处理新增与正文有变化的文章，生成的摘要写入缓存文件（默认 `.vitepress/ai-summary-cache.json`）。支持的参数：

| 参数 | 说明 |
| --- | --- |
| `--force` | 忽略缓存，全部重新生成（换模型或 prompt 后使用） |
| `--dir <路径>` | 自定义文章目录（默认 `posts`） |

推荐工作流：写完文章 → 本地跑一次 `pnpm run summary` → 把缓存文件提交 git → 推送。本地与 CI 的 `pnpm run build` 都只读缓存，构建耗时与不启用 AI 摘要完全一致。构建时若发现缓存缺失的文章，终端会提示待生成数量，对应文章回退显示 `description`。

::: tip 两种方式可以混用
`buildGenerate` 保持默认 `true` 时 CLI 命令同样可用（比如想在部署前先本地验证摘要质量）。两者使用同一套生成与缓存逻辑，缓存文件完全互通。
:::

## 运行时代理部署

`apiKey` 不可出现在前端代码中，浏览器端实时生成必须经过自部署代理。下面是一份可直接使用的 Cloudflare Worker：

```js
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }
    try {
      const { content } = await request.json()
      if (!content) {
        return Response.json({ error: 'content is required' }, { status: 400 })
      }
      const res = await fetch(`${env.BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.API_KEY}`
        },
        body: JSON.stringify({
          model: env.MODEL,
          messages: [
            {
              role: 'system',
              content:
                '你是一位专业的中文博客摘要撰写助手。请根据用户提供的文章正文，输出一段 80-120 字的中文摘要。要求：准确概括核心主题；简洁通顺，为一段连续文字，不使用 Markdown 语法；直接输出摘要正文，不加任何前后缀。'
            },
            { role: 'user', content: content.slice(0, 2000) }
          ],
          temperature: 0.3,
          stream: false
        })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const summary = data?.choices?.[0]?.message?.content?.trim()
      if (!summary) throw new Error('empty summary')
      return Response.json({ summary })
    } catch (error) {
      return Response.json({ error: error?.message || 'Unknown error' }, { status: 500 })
    }
  }
}
```

在 Worker 的环境变量中配置：

| 变量 | 说明 |
| --- | --- |
| `BASE_URL` | OpenAI 兼容接口地址，如 `https://api.deepseek.com/v1` |
| `API_KEY` | 你的 API Key |
| `MODEL` | 模型名称，如 `deepseek-chat` |

::: warning 跨域
站点域名与 Worker 域名不同源时，需要在 Worker 响应中加上 CORS 头（`Access-Control-Allow-Origin` 填你的站点域名），否则浏览器会拦截请求。
:::

部署后把 Worker 地址填入 `runtime.endpoint`（见上方示例）。代理失败时组件静默回退到 `description` 或 `fallbackText`，不弹错误提示。

## 安全提示

- `apiKey`、`baseURL`、`prompt` 会在构建时被自动剔除，不会进入浏览器端的 `themeConfig`。但仍建议通过环境变量引用 Key，不要把 Key 提交进仓库。
- 运行时代理必须自部署并持有 Key，不要试图在前端直接调大模型接口。
