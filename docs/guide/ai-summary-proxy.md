# AI 摘要代理部署

这篇文章手把手教你把「AI 摘要代理」部署到互联网上，全程不需要写任何代码。跟着做大约需要 10 分钟。

**先弄清楚你要部署的是什么**：一个很小型的中转服务。它的唯一工作就是 —— 接收你博客访客浏览器发来的文章正文，转发给大模型生成摘要，再把摘要传回浏览器。你的 API Key 保存在这个中转服务上，访客接触不到，不会被偷走刷量。

部署完成后，把它得到的网址填进主题配置，文章页就能实时流式生成摘要了（逐字出现，像 ChatGPT 一样）。

::: tip 你需要先有什么
- 一个大模型平台的 API Key（还没有？先看 [AI 文章摘要 - 第一步](/guide/ai-summary#第一步-获取-api-key)）
- 一个能正常运行的博客项目
- 本文所有命令都在**博客项目的根目录**（有 `package.json` 的那个文件夹）里执行
:::

## 第一步：用一条命令生成代理项目

主题自带了代理的完整代码，用 CLI 命令直接生成一份到你的项目里：

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

命令会问两个问题，用键盘 ↑ ↓ 选择、回车确认：

1. **部署到哪个平台**：选 `Cloudflare Workers`（推荐，免费额度每天用不完，国内也能访问）或 `Vercel Serverless`。
2. **放在哪个目录**：直接回车用默认的 `proxy/cloudflare-ai-proxy`（或 `proxy/vercel-ai-proxy`）即可。

完成后项目里会多出一个 `proxy/` 文件夹，里面就是代理的全部代码 —— 你**不需要打开或修改它**。

::: warning 别忘了
`proxy/` 文件夹建议提交到 git 一起管理，换电脑后重新部署还用得上。但它和博客构建没有任何关系，`pnpm build` 不会碰它。
:::

接下来按你选择的平台，看对应的小节。

## 部署到 Cloudflare（推荐）

### 1. 注册 Cloudflare 账号

打开 [dash.cloudflare.com](https://dash.cloudflare.com/)，用邮箱注册并登录。免费套餐即可，不需要绑卡。

### 2. 安装部署工具

```bash
cd proxy/cloudflare-ai-proxy
pnpm add -D wrangler
```

`wrangler` 是 Cloudflare 官方的命令行工具，用来把代码传上去。

### 3. 登录并部署

```bash
pnpm wrangler login
```

执行后会自动打开浏览器，点「Allow」授权，然后回到终端，继续执行：

```bash
pnpm wrangler deploy
```

看到类似下面的输出就是成功了：

```text
Deployed ninc-ai-summary-proxy triggers
  https://ninc-ai-summary-proxy.你的账号.workers.dev
```

**把这个 `https://` 开头的网址复制下来**，最后一步要用。

### 4. 配置环境变量（填入你的 API Key）

回到 [Cloudflare 控制台](https://dash.cloudflare.com/)，按这个路径点进去：

**Workers & Pages → 点 `ninc-ai-summary-proxy` → 顶部 Settings → 左侧 Variables → 点 + Add**

依次添加下面这些变量（类型都选默认的 Text 即可，`OPENAI_API_KEY` 建议选 Secret 更安全）：

| 变量名 | 填什么 | 必填 |
| --- | --- | --- |
| `OPENAI_API_KEY` | 你的大模型 API Key，如 `sk-xxxx` | 是 |
| `OPENAI_BASE_URL` | 接口地址，如 `https://api.deepseek.com` | 否，默认 OpenAI 官方地址 |
| `OPENAI_MODEL` | 模型名，如 `deepseek-chat` | 否，默认 `gpt-4o-mini` |
| `CORS_ORIGIN` | 你的博客域名，如 `https://blog.example.com` | 否，默认 `*`（建议上线后改成你的域名，防止别人蹭用） |

各家平台的 `OPENAI_BASE_URL` 填法和主题配置里的 `baseURL` **完全一样**，对照表见 [配置参考 - 内置 provider 预设](/config/ai-summary#内置-provider-预设)。

加完每个变量后，按页面提示点 **Deploy**（或 Save and deploy）让它生效。

## 部署到 Vercel

### 1. 注册 Vercel 账号

打开 [vercel.com](https://vercel.com/)，用 GitHub 账号一键登录。免费套餐即可。

### 2. 安装部署工具

```bash
cd proxy/vercel-ai-proxy
pnpm add -D vercel
```

### 3. 登录并部署

```bash
pnpm vercel login
```

按提示选择登录方式（会发一封邮件，点邮件里的按钮确认）。回到终端后执行：

```bash
pnpm vercel --prod
```

首次执行会问几个确认问题（项目名、是否关联现有项目等），一路回车用默认值即可。成功后输出类似：

```text
✅ Production: https://vercel-ai-proxy-xxx.vercel.app
```

你的代理接口地址是：**这个网址 + `/api/summary`**，例如 `https://vercel-ai-proxy-xxx.vercel.app/api/summary`。复制下来，最后一步要用。

### 4. 配置环境变量

回到 [Vercel 控制台](https://vercel.com/dashboard)，点进你的项目，按这个路径：

**顶部 Settings → 左侧 Environment Variables**

添加的变量和上面 Cloudflare 那张表**一模一样**（`OPENAI_API_KEY`、`OPENAI_BASE_URL`、`OPENAI_MODEL`、`CORS_ORIGIN`）。每个变量添加时勾选 Production、Preview、Development 三个环境。

::: warning 改完变量要重新部署
Vercel 的环境变量改完后**必须重新部署一次**才生效：回到终端再执行一遍 `pnpm vercel --prod`。
:::

## 最后一步：填进主题配置

打开博客的 `.vitepress/themeConfig.ts`，把刚才复制的地址填进 `runtime.endpoint`：

::: code-group

```ts [Cloudflare]
aiSummary: {
  enable: true,
  // ...你已有的 provider / apiKey / model 配置
  runtime: {
    enable: true,
    endpoint: 'https://ninc-ai-summary-proxy.你的账号.workers.dev'
  }
}
```

```ts [Vercel]
aiSummary: {
  enable: true,
  // ...你已有的 provider / apiKey / model 配置
  runtime: {
    enable: true,
    endpoint: 'https://你的项目名.vercel.app/api/summary'
  }
}
```

:::

重新执行 `pnpm dev`，打开一篇**没有手动填 `articleGPT`、也没有构建期摘要**的文章：稍等两三秒，摘要卡片就会开始**逐字输出** AI 实时生成的内容，和 ChatGPT 的打字效果一样。

## 它是怎么工作的

了解原理有助于排查问题，整个链路是这样的：

1. 访客打开文章页，浏览器把文章正文 POST 给你的代理
2. 代理带上你保存的 API Key 请求大模型，拿到流式响应
3. 代理把响应原样流式转发回浏览器，摘要逐字出现在卡片里
4. 生成完成后，浏览器把摘要缓存在访客自己的 localStorage 里 —— **同一访客再次打开同一篇文章，不再请求代理，直接显示缓存**
5. 文章内容更新后（构建时间戳变化）缓存自动失效，重新生成

任何一步出错（代理挂了、网络超时、Key 失效），卡片都会静默回退到文章的 `description` 或你配的 `fallbackText`，访客看不到报错。

::: tip 构建期摘要 vs 运行时摘要
两者是互补关系：构建期已生成的文章直接用现成摘要（零请求），只有「构建时没生成」的文章才会走运行时代理。想控制代理调用量，就多用 [CLI 预生成](/guide/cli#summary-预生成-ai-摘要)，让运行时只处理漏网之鱼。
:::

## 常见问题

### 打开文章后摘要卡片一直「加载中」然后显示兜底文案

说明浏览器请求代理失败了。按 F12 打开开发者工具 → Console（控制台），能看到 `[vitepress-theme-ninc]` 开头的黄色警告，里面有具体原因：

- **HTTP 500 / missing API Key**：平台后台的 `OPENAI_API_KEY` 没配或没生效。Cloudflare 检查变量是否保存；Vercel 检查配完变量后有没有重新部署。
- **HTTP 502 / Upstream error**：代理能访问，但大模型接口报错了。检查 `OPENAI_BASE_URL` 和 `OPENAI_MODEL` 是否填对，账户是否欠费。
- **Failed to fetch / CORS**：跨域被拦截。把 `CORS_ORIGIN` 配成你的博客完整域名（含 `https://`，不带结尾斜杠），或临时改回 `*` 测试。
- **超时**：把 `runtime.timeout` 调大（默认 30000 毫秒），部分中转站响应较慢。

### 摘要是整段一下出现的，不是逐字的

说明你的代理还是旧版代码（不支持流式）。重新执行 `pnpm run init-proxy` 生成最新模板再部署一次即可。前端做了自动降级处理，新旧代理都能用，只是显示效果不同。

### 想限制别人盗用我的代理

两件事一起做：把 `CORS_ORIGIN` 配成你的博客域名（别人从其他网站调用会被浏览器拦截）；Cloudflare 用户还可以在 Worker 的 Settings → Domains & Routes 里绑定自己的域名并开启速率限制。浏览器端缓存也能挡住绝大部分重复请求 —— 真实访客对每篇文章只调一次。

### 部署后要花多少钱

Cloudflare Workers 免费套餐每天 10 万次请求，个人博客远远用不完，**长期零费用**。Vercel 免费套餐每月 100GB 流量，摘要接口单次传输只有几百字节，同样用不完。大模型 token 费用另算，和构建期生成一致（参考 [AI 文章摘要 - 会花多少钱](/guide/ai-summary#先了解两件事)）。
