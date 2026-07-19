# inject 注入

配置页面 head 注入项，将 meta 标签、favicon、字体、脚本等注入到 VitePress 的 `<head>` 中。

## 字段说明

### inject 主表

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `header` | `HeadConfig[]` | `[]` | 注入到 VitePress head 的配置项数组，**默认为空，需自行配置** |

### HeadConfig 元组格式

`header` 数组中每一项为元组，支持两种形式：

| 格式 | 说明 | 示例 |
| --- | --- | --- |
| `[tag, attrs]` | 标签 + 属性对象 | `['meta', { name: 'author', content: '示例博主' }]` |
| `[tag, attrs, innerHTML]` | 标签 + 属性 + 内联内容 | `['script', { id: 'la' }, 'console.log(1)']` |

::: warning 默认 header 为空
主题源码中 `defaultThemeConfig.inject.header` 默认值就是空数组 `[]`，**主题不预置任何 head 标签**。下面「推荐 head 模板」中的 favicon、SEO、Open Graph 等内容需要你按需复制到自己的 `themeConfig.ts` 中。如果你完全不配置 `inject.header`，站点仍可运行，只是不会自动生成 SEO meta 与 favicon。
:::

## 推荐 head 模板

下面这份模板涵盖 favicon、基础 SEO、Open Graph、Twitter Card、移动端优化与安全策略，可直接复制到 `themeConfig.ts` 中按需删改：

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  inject: {
    header: [
      // favicon
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      // 禁止来源泄露
      ['meta', { name: 'referrer', content: 'no-referrer' }],

      // SEO 基础标签
      ['meta', { name: 'author', content: '你的名字' }],
      ['meta', { name: 'description', content: '你的站点描述' }],

      // Open Graph 协议标签
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: '你的站点标题' }],
      ['meta', { property: 'og:description', content: '你的站点描述' }],
      ['meta', { property: 'og:url', content: 'https://your-site.com' }],
      ['meta', { property: 'og:image', content: 'https://your-site.com/avatar.png' }],
      ['meta', { property: 'og:site_name', content: '你的站点名' }],

      // Twitter 卡片标签
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:title', content: '你的站点标题' }],
      ['meta', { name: 'twitter:description', content: '你的站点描述' }],
      ['meta', { name: 'twitter:image', content: 'https://your-site.com/avatar.png' }],

      // 移动设备优化
      ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0' }],
      ['meta', { name: 'theme-color', content: '#ffffff' }],
      ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
      ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],

      // 升级不安全请求（CSP）
      ['meta', { httpEquiv: 'Content-Security-Policy', content: 'upgrade-insecure-requests' }]
    ]
  }
})
```

::: tip 完整参考实现
本仓库 `blog/.vitepress/themeConfig.ts` 中有一份投入生产的完整 `inject.header` 配置（含 iconfont、字体、RSS link、统计脚本等），可作为进阶参考。
:::

## 常见注入场景

### 场景一：站点统计

简单的 ID 类统计（51la）通过 [`tongji`](./tongji.md) 配置；需要复杂初始化脚本的服务则用 `inject.header` 手动注入：

```ts
inject: {
  header: [
    // Google Analytics（gtag.js）
    ['script', { async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX' }],
    ['script', {}, `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-XXXXXXXXXX');`],
    // Umami 自部署统计
    ['script', { src: 'https://umami.example.com/script.js', defer: true, 'data-website-id': 'your-website-id' }]
  ]
}
```

### 场景二：自定义字体

```ts
inject: {
  header: [
    // Fira Code 等宽字体
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap', crossorigin: 'anonymous' }],
    // LXGW WenKai 中文字体
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont/style.css' }]
  ]
}
```

### 场景三：SEO meta 补充

```ts
inject: {
  header: [
    ['meta', { name: 'keywords', content: '前端, VitePress, 博客, JavaScript' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['link', { rel: 'canonical', href: 'https://example.com/current-page' }]
  ]
}
```

### 场景四：安全策略

```ts
inject: {
  header: [
    ['meta', { 'http-equiv': 'Content-Security-Policy', content: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https:" }],
    ['meta', { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' }],
    ['meta', { 'http-equiv': 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }]
  ]
}
```

::: warning CSP 与第三方资源冲突
收紧 CSP（限制 `script-src`/`style-src`）可能导致 Fancybox、Twikoo、APlayer 等第三方脚本无法加载。修改 CSP 前请将所有外部资源域名加入白名单，并在变更后逐项验证功能。
:::

### 场景五：站点验证

搜索引擎站长平台（百度、Google Search Console、Bing）通常要求在 `<head>` 中添加验证 meta：

```ts
inject: {
  header: [
    // 百度站长平台验证
    ['meta', { name: 'baidu-site-verification', content: 'codeva-xxxxxxxx' }],
    // Google Search Console 验证
    ['meta', { name: 'google-site-verification', content: 'xxxxxxxxxxxxxxxx' }],
    // Bing 站长验证
    ['meta', { name: 'msvalidate.01', content: 'xxxxxxxxxxxxxxxx' }]
  ]
}
```

## 注意事项

::: warning HeadConfig 元组顺序不可变
每一项必须严格按 `[tag, attrs]` 或 `[tag, attrs, innerHTML]` 顺序填写。第一个元素为标签名（如 `'meta'`、`'link'`、`'script'`），第二个为属性对象，第三个（可选）为内联 HTML 字符串。
:::

::: tip 内联脚本使用第三参数
需要注入内联 JS 时，使用 `[tag, attrs, innerHTML]` 三元组形式，将脚本内容作为第三个参数的字符串传入（如上例中的 gtag 初始化代码），而非写在 `attrs` 中。
:::

::: warning 避免与统计配置重复注入
站点统计推荐通过 [`tongji`](./tongji.md) 配置，主题会自动注入 51la 脚本。若同时在 `inject.header` 中手动添加统计 `<script>`，可能导致脚本重复加载。
:::

## 渲染效果

---

## 相关配置

- [`tongji` 统计](./tongji.md) — 站点统计配置，51la 脚本会自动注入
- [`site-meta` 站点信息](./site-meta.md) — 站点标题、描述、作者等元信息
- [`footer` 页脚](./footer.md) — 页脚信息配置
