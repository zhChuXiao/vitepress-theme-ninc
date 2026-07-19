# footer 页脚

配置站点页脚区域，包括社交链接、shields.io 徽标以及站点地图导航分组。

![页脚配置文档页](/images/scrollShowcase/home-footer-light.png)

## 字段说明

### footer 主表

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `social` | `FooterSocial[]` | 见下方子表 | 社交链接数组 |
| `badge` | `FooterBadge[]` | 见下方子表 | shields.io 徽标数组 |
| `sitemap` | `FooterSitemapGroup[]` | 见下方子表 | 站点地图分组数组 |

### social 子表（FooterSocial）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `icon` | `string` | — | 社交图标名（iconfont） |
| `link` | `string` | — | 社交链接地址 |

默认 `social` 值：

```ts
social: [
  { icon: 'email', link: 'mailto:you@example.com' },
  { icon: 'github', link: 'https://github.com/your-name' }
]
```

### badge 子表（FooterBadge）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `leftText` | `string` | `'CopyRight'` | 徽标左侧文字 |
| `rightText` | `string` | `'BY-NC-SA 4.0'` | 徽标右侧文字 |
| `color` | `string` | `'#ae3b37'` | 徽标颜色 |
| `tooltip` | `string?` | `'知识共享 署名-非商业性使用-相同方式共享 4.0 国际许可协议'` | 鼠标悬停提示 |
| `link` | `string` | `'https://creativecommons.org/licenses/by-nc-sa/4.0/'` | 徽标跳转链接 |
| `logo` | `string` | `'creativecommons'` | shields.io 徽标 logo |
| `style` | `string?` | `'for-the-badge'` | shields.io 徽标样式 |

默认 `badge` 值：

```ts
badge: [
  {
    leftText: 'CopyRight',
    rightText: 'BY-NC-SA 4.0',
    color: '#ae3b37',
    tooltip: '知识共享 署名-非商业性使用-相同方式共享 4.0 国际许可协议',
    link: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    logo: 'creativecommons',
    style: 'for-the-badge'
  }
]
```

### sitemap 子表（FooterSitemapGroup 数组）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `text` | `string` | — | 分组名称 |
| `items` | `FooterSitemapItem[]` | — | 分组下链接项数组 |

### sitemap items 子表（FooterSitemapItem）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `text` | `string` | — | 链接文字 |
| `link` | `string` | — | 链接地址 |
| `newTab` | `boolean?` | — | 是否在新标签页打开 |

默认 `sitemap` 值：

```ts
sitemap: [
  {
    text: '博客',
    items: [
      { text: '近期文章', link: '/' },
      { text: '全部分类', link: '/pages/categories' },
      { text: '全部标签', link: '/pages/tags' },
      { text: '文章归档', link: '/pages/archives' }
    ]
  },
  {
    text: '协议',
    items: [
      { text: '隐私政策', link: '/pages/privacy' },
      { text: '版权协议', link: '/pages/cc' },
      { text: 'Cookies', link: '/pages/cookies' }
    ]
  }
]
```

## 示例

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  footer: {
    social: [
      { icon: 'email', link: 'mailto:you@example.com' },
      { icon: 'github', link: 'https://github.com/your-name' },
      { icon: 'twitter', link: 'https://twitter.com/your-name' },
      { icon: 'rss', link: 'https://example.com/rss.xml' }
    ],
    badge: [
      {
        leftText: 'CopyRight',
        rightText: 'BY-NC-SA 4.0',
        color: '#ae3b37',
        tooltip: '知识共享 署名-非商业性使用-相同方式共享 4.0 国际许可协议',
        link: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        logo: 'creativecommons',
        style: 'for-the-badge'
      },
      {
        leftText: 'Powered by',
        rightText: 'VitePress',
        color: '#42b883',
        tooltip: '由 VitePress 与 vitepress-theme-ninc 驱动',
        link: 'https://vitepress.dev/',
        logo: 'vitepress',
        style: 'for-the-badge'
      }
    ],
    sitemap: [
      {
        text: '博客',
        items: [
          { text: '近期文章', link: '/' },
          { text: '全部分类', link: '/pages/categories' },
          { text: '全部标签', link: '/pages/tags' },
          { text: '文章归档', link: '/pages/archives' }
        ]
      },
      {
        text: '协议',
        items: [
          { text: '隐私政策', link: '/pages/privacy' },
          { text: '版权协议', link: '/pages/cc' },
          { text: 'Cookies', link: '/pages/cookies' }
        ]
      },
      {
        text: '关于',
        items: [
          { text: '关于本站', link: '/pages/about' },
          { text: '友情链接', link: '/pages/friends', newTab: false },
          { text: 'GitHub 仓库', link: 'https://github.com/your-name/your-repo', newTab: true }
        ]
      }
    ]
  }
})
```

## 渲染效果

---

`footer` 自下而上（或按主题排版）渲染为三块区域：

- **社交链接（social）**：以 iconfont 图标形式横排展示，悬浮可见链接，建议偶数个保持两列对齐。
- **徽标区（badge）**：调用 shields.io 生成的 SVG 徽标横排展示，鼠标悬浮显示 `tooltip`，点击跳转 `link`。
- **站点地图（sitemap）**：以多列分组形式展示导航链接，分组标题在上、链接项在下，适合放置「博客」「协议」「关于」等入口。

::: tip 常见配置组合
- **极简页脚**：`social` 配 2 个（邮箱 + GitHub），`badge` 配 1 个版权徽标，`sitemap` 配 1 个分组。
- **完整页脚**：`social` 配 4-6 个常用平台，`badge` 配版权 + Powered by 两个徽标，`sitemap` 配 3 个分组（博客/协议/关于）。
- **外链友好**：`sitemap` 中的外链项设置 `newTab: true`，站内链接保持默认当前页打开。
:::

::: warning 徽标加载依赖 shields.io
`badge` 渲染依赖 shields.io 服务实时生成 SVG，若 shields.io 访问异常，徽标区域可能空白。生产环境可考虑自建 shields 服务或将徽标缓存为本地 SVG。
:::

## 注意事项

::: tip social 使用 iconfont 图标名
`social` 的 `icon` 字段填写 iconfont 图标名（如 `email`、`github`、`rss`），需确保对应图标已在 iconfont 项目中引入。常用社交图标包括 `email`、`github`、`twitter`、`weibo`、`rss` 等。
:::

::: warning social 建议为偶数个
为保证页脚社交链接区域的视觉对称与布局美观，建议 `social` 数组配置偶数个链接（如 2、4、6 个），主题会自动按两列排版。
:::

::: tip badge 使用 shields.io 徽标
`badge` 基于 [shields.io](https://shields.io/) 生成，`logo` 字段对应 shields.io 的 logo 名称（可在 [simpleicons.org](https://simpleicons.org/) 查询），`style` 支持 shields.io 提供的样式（如 `for-the-badge`、`flat`、`flat-square`、`plastic`）。
:::

::: tip sitemap 用于页脚导航
`sitemap` 以分组形式组织页脚导航链接，适合放置「博客」「协议」「关于」等分类入口。`items` 中的 `newTab` 默认为站内链接当前页打开，外链可设置为 `true` 在新标签页打开。
:::

::: warning color 使用合法颜色值
`badge` 的 `color` 字段需填写合法的 CSS 颜色值（如 `#ae3b37`、`rgb(174, 59, 55)`），将作为 shields.io 徽标的背景色传递。
:::

::: tip tooltip 增强可访问性
`badge` 的 `tooltip` 字段会在鼠标悬停时显示，建议填写徽标的完整说明（如版权协议的全称），既提升可访问性，也避免占用过多视觉空间。
:::

## 相关配置

- [`siteMeta` 站点信息](./site-meta.md) — 站点地址与作者信息（用于 RSS 与社交）
- [`nav` 顶部导航栏](./nav.md) — 顶部菜单配置
- [`navMore` 左侧更多菜单](./nav-more.md) — 侧边链接分组配置
