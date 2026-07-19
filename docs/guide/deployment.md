# 部署指南

本页介绍如何将基于 `vitepress-theme-ninc` 构建的博客部署到 Vercel、Netlify 或自有服务器（Nginx）。同时涵盖 PWA 缓存、自定义域名与环境变量等部署期注意事项。

## 构建命令

无论选择哪种部署平台，构建产物都由 VitePress 生成，命令与产物目录是统一的：

| 命令 | 作用 |
| --- | --- |
| `pnpm install` | 安装依赖（含主题的 `postinstall` 自动应用 nes-vue 补丁） |
| `pnpm build` | 构建静态站点，产物输出到 `.vitepress/dist` |
| `pnpm preview` | 本地预览构建产物 |

::: tip 确认 package.json 脚本
确保项目 `package.json` 的 `scripts` 中包含 `"build": "vitepress build"`。若站点根目录就是项目根目录，默认产物路径为 `.vitepress/dist`；若你自定义了 VitePress 的 `outDir`，请相应调整部署平台的发布目录。
:::

本地完整验证一次构建，可避免大部分部署失败：

```bash
pnpm install
pnpm build
pnpm preview
```

## 部署到 Vercel

Vercel 原生支持 VitePress 项目，可自动识别框架。若自动识别失败或需要精细控制，可在项目根目录新建 `vercel.json`：

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".vitepress/dist",
  "installCommand": "pnpm install",
  "framework": null
}
```

::: warning Node 版本
Vercel 默认 Node 版本可能低于主题要求的 `>= 20`。请在项目根目录添加 `.nvmrc` 文件，内容为 `20`，或在 Vercel 项目设置 → General → Node.js Version 中选择 `20.x`。
:::

### Monorepo 部署

若你的项目是 monorepo（主题仓库的 `blog/` 或 `docs/` 作为子目录部署），需要在 Vercel 项目设置中：

1. 将 **Root Directory** 设置为 `blog/`（或 `docs/`）。
2. 确保 `vercel.json` 位于该子目录下，`outputDirectory` 相对该子目录解析。

## 部署到 Netlify

在项目根目录新建 `netlify.toml`：

```toml
[build]
  command = "pnpm build"
  publish = ".vitepress/dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

::: tip SPA 回退
`[[redirects]]` 段把所有未命中静态资源的请求回退到 `index.html`，避免刷新动态路由（如 `/page/2`、`/pages/categories/xxx`）时出现 404。VitePress 默认开启 `cleanUrls`，配合此重定向可保证路由可用。
:::

### Monorepo 部署

在 Netlify 项目设置中：

1. **Base directory** 设置为 `blog/`（或 `docs/`）。
2. **Build command** 保持 `pnpm build`。
3. **Publish directory** 设置为 `.vitepress/dist`（相对 base directory）。

::: warning Node 版本
在 `netlify.toml` 中或站点设置里指定 Node 版本：
```toml
[build.environment]
  NODE_VERSION = "20"
```
:::

## 部署到自有服务器（Nginx）

### Step 1：构建产物

在本地或 CI 中执行构建，并将 `.vitepress/dist` 目录上传到服务器，例如 `/var/www/my-blog`：

```bash
pnpm install
pnpm build
# 上传到服务器
rsync -avz --delete .vitepress/dist/ user@your-server:/var/www/my-blog/
```

### Step 2：Nginx 配置

```nginx
server {
    listen 80;
    server_name xxx.xxx.com;
    root /var/www/my-blog;
    index index.html;

    # gzip（主题构建已产出 .gz，可直接启用 gzip_static）
    gzip_static on;

    # brotli（若已安装 ngx_brotli 模块）
    # brotli_static on;

    # SPA 回退：动态路由刷新不报 404
    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }

    # 静态资源长缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|webp|svg|woff2?|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTML 不缓存，保证更新即时生效
    location ~* \.html$ {
        add_header Cache-Control "no-cache";
    }

    # service worker 不缓存自身
    location = /sw.js {
        add_header Cache-Control "no-cache";
    }
    location = /registerSW.js {
        add_header Cache-Control "no-cache";
    }
}
```

配置完成后重载 Nginx：

```bash
sudo nginx -t
sudo nginx -s reload
```

::: tip HTTPS
建议使用 [Certbot](https://certbot.eff.org/) 申请 Let's Encrypt 证书，将 `listen 80` 改为 `listen 443 ssl` 并配置证书路径，PWA 与 Service Worker 均要求 HTTPS 环境。
:::



## PWA 注意事项

主题通过 [@vite-pwa/vitepress](https://vite-pwa-org.netlify.app/) 提供 PWA 能力，构建产物包含 `sw.js`、`registerSW.js`、`manifest.webmanifest` 等。部署时需注意：

1. **必须 HTTPS**：Service Worker 只能在 HTTPS（或 `localhost`）下注册，HTTP 站点会静默失败。
2. **sw.js 不缓存自身**：如上方 Nginx 配置所示，`sw.js` 与 `registerSW.js` 必须设置 `no-cache`，否则用户更新站点后无法拿到新的 Service Worker，导致缓存陈旧。
3. **预缓存策略**：主题默认预缓存构建产物。若产物体积较大，可通过 `defineConfig` 第三参数的 `pwaWorkbox` 自定义运行时缓存规则，详见 [配置详解 - PWA 降级机制](./configuration.md#pwa-降级机制)。
4. **关闭 PWA**：若不需要 PWA，可在 `defineConfig` 第三参数设置 `pwa: false`，构建时不会生成 Service Worker，相关文件也无需部署。

::: warning 更新不生效？
PWA 站点更新后用户可能仍看到旧内容，这是 Service Worker 预缓存的表现。开发期可在浏览器 DevTools → Application → Service Workers 勾选「Update on reload」；生产环境确保 `sw.js` 不被 CDN/浏览器强缓存即可。
:::

## 自定义域名

### Vercel

在项目设置 → Domains 中添加自定义域名，按提示在你的域名服务商添加 CNAME（或 A）记录。Vercel 会自动签发并续期 HTTPS 证书。

### Netlify

在站点设置 → Domain management → Add custom domain 中添加域名，并按提示配置 DNS。Netlify 同样自动签发 Let's Encrypt 证书。

### 自有服务器

在域名服务商将 `xxx.xxx.com` 解析到服务器 IP，Nginx 配置 `server_name xxx.xxx.com` 并配合 Certbot 签发证书。

::: tip 配置站点地址
无论使用哪种平台，请确保 `themeConfig.siteMeta.site` 与 `defineConfig` 中 `sitemap.hostname` 都填写为最终线上域名（如 `https://xxx.xxx.com`），以保证 RSS、sitemap、Open Graph 等链接正确。
:::

## 环境变量

部分主题功能涉及密钥（Twikoo 评论、Algolia 搜索、统计代码等），**不要把这些密钥硬编码提交到仓库**。推荐使用环境变量注入。

### 在 themeConfig 中读取环境变量

```ts
// themeConfig.ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  comment: {
    twikoo: {
      envId: process.env.TWIKOO_ENV_ID || ''
    }
  },
  search: {
    enable: !!process.env.ALGOLIA_APP_ID,
    appId: process.env.ALGOLIA_APP_ID || '',
    apiKey: process.env.ALGOLIA_API_KEY || '',
    indexName: process.env.ALGOLIA_INDEX_NAME || ''
  },
  tongji: {
    '51la': process.env.LA_ID_51 || ''
  }
})
```

### 各平台配置环境变量

| 平台 | 配置位置 |
| --- | --- |
| Vercel | 项目设置 → Environment Variables |
| Netlify | 站点设置 → Environment variables（注意：构建期变量需在 `netlify.toml` 的 `[build.environment]` 中声明） |
| 自有服务器 / CI | 在构建脚本前 `export TWIKOO_ENV_ID=xxx`，或使用 `.env` 文件配合 `dotenv` |

::: warning 构建期 vs 运行期
VitePress 是**构建期**注入配置，环境变量在 `pnpm build` 时被读取并写死到产物中。因此所有密钥都必须在构建环境的变量中可用，运行期的服务器环境变量不会生效。
:::

::: tip AI 摘要的部署要点
开启了 [aiSummary AI 文章摘要](./ai-summary.md) 的站点，除配置大模型的 `apiKey` 环境变量外，建议将缓存文件 `.vitepress/ai-summary-cache.json` 提交到仓库，CI 构建时可直接复用缓存，避免对全部文章重复调用大模型。详细步骤见该页的「第五步：部署时做什么」。
:::

::: danger 不要提交 .env
将 `.env` 加入 `.gitignore`，仅保留 `.env.example` 作为模板提交到仓库，避免密钥泄露。
:::

## 部署检查清单

部署前请逐项确认：

-  本地 `pnpm build` 成功，无报错
-  `.vitepress/dist` 中包含 `rss.xml`、`sitemap.xml`（若启用）
-  `themeConfig.siteMeta.site` 与 `sitemap.hostname` 为线上域名
-  Node 版本 `>= 20`
-  HTTPS 已启用（PWA 必需）
-  `sw.js` 未被强缓存
-  敏感密钥通过环境变量注入，未硬编码
-  动态路由刷新不报 404（SPA 回退已配置）
