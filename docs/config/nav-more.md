# navMore 左侧更多菜单

配置导航栏左侧「更多内容」菜单，以分组形式展示外部链接与站内资源入口，支持图片图标与 iconfont 图标两种类型。窄屏（≤512px）下该菜单按钮隐藏。

![左侧更多菜单配置文档页](/images/article/navmore.png)

## 字段说明

### navMore 主表（NavMoreGroup 数组）

`navMore` 为 `NavMoreGroup[]` 数组，每一项代表一个链接分组。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | — | 分组名称 |
| `list` | `NavMoreLink[]` | — | 链接数组 |

### list 子表（NavMoreLink）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `icon` | `IconField` | — | 图标字段。`iconType='img'` 时为图片 URL；否则支持三种写法（字符串 / `'svg:文件名'` / 对象），详见 [图标使用指南](../guide/icons.md) |
| `iconType` | `'img' \| 'iconfont'?` | `'iconfont'` | 图标类型。`'img'`=图片 URL；`'iconfont'`=字体图标或 SVG 图标（默认，省略时按此处理） |
| `name` | `string` | — | 链接显示名称 |
| `url` | `string` | — | 链接地址，可为外链或站内路径 |
| `target` | `string?` | — | 打开方式，如 `'_blank'` 表示新标签页 |

::: tip 默认值说明
主题包内置默认 `navMore: []`（空数组）。以下为 `npx vitepress-theme-ninc init` 脚手架生成的初始 `navMore` 配置（defu 对数组为 concat 合并，故脚手架需完整给出）：
:::

```ts
navMore: [
  {
    name: '博客',
    list: [
      { icon: 'article', iconType: 'iconfont', name: '文章归档', url: '/pages/archives' },
      { icon: 'folder', iconType: 'iconfont', name: '全部分类', url: '/pages/categories' },
      { icon: 'hashtag', iconType: 'iconfont', name: '全部标签', url: '/pages/tags' }
    ]
  },
  {
    name: '我的',
    list: [
      { icon: 'chat', iconType: 'iconfont', name: '留言板', url: '/pages/comments' },
      { icon: 'contacts', iconType: 'iconfont', name: '关于本站', url: '/pages/about' }
    ]
  }
]
```

## 示例

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  navMore: [
    {
      name: '博客',
      list: [
        { icon: '/images/avatar.png', iconType: 'img', name: '我的主页', url: 'https://example.com', target: '_blank' }
      ]
    },
    {
      name: '社交',
      list: [
        { icon: 'github', iconType: 'iconfont', name: 'GitHub', url: 'https://github.com/your-name', target: '_blank' },
        { icon: 'bilibili', iconType: 'iconfont', name: '哔哩哔哩', url: 'https://space.bilibili.com/your-id', target: '_blank' },
        { icon: 'email', iconType: 'iconfont', name: '邮箱', url: 'mailto:you@example.com', target: '_blank' }
      ]
    },
    {
      name: '工具',
      list: [
        { icon: '/images/tool.png', iconType: 'img', name: '在线工具', url: '/pages/tools' },
        { icon: '/images/friend.png', iconType: 'img', name: '友情链接', url: '/pages/friends' }
      ]
    }
  ]
})
```

## 渲染效果

---

`navMore` 渲染为导航栏左侧「更多内容」按钮的悬浮卡片，鼠标悬浮按钮时展开（纯 CSS `:hover` 触发），展示效果：

- **分组标题**：每个 `NavMoreGroup` 的 `name` 作为分组小标题，分隔不同类别。
- **链接列表**：`list` 中每一项渲染为「图标 + 名称」的横向条目，点击按 `target` 决定打开方式。
- **图标类型**：`iconType: 'img'` 渲染为圆形图片头像（适合友链/个人主页），`iconType: 'iconfont'` 渲染为矢量图标（适合社交平台）。

::: tip 常见配置组合
- **社交聚合**：一个 `社交` 分组，用 iconfont 图标收纳 GitHub/微博/邮箱/Twitter。
- **资源导航**：一个 `工具` 分组，用 img 图标放置常用在线工具与友链。
- **站内入口**：一个 `博客` 分组，用 img 头像放置个人主页与关于页。
:::

::: tip 与 nav 的分工
[`nav`](./nav.md) 用于站内下拉菜单，`navMore` 更适合外部链接与单层入口。两者搭配可让顶部保持简洁，复杂链接收纳到抽屉。
:::

## 注意事项

::: tip iconType 区分图标类型
`iconType` 用于区分图标来源（详见 [图标使用指南](../guide/icons.md)）：
- `'iconfont'`（默认，省略时按此处理）：`icon` 字段支持三种写法 ——
  - 字符串：iconfont 图标名，**不含 `icon-` 前缀**（如 `'github'`、`'bilibili'`），主题渲染时自动拼接为 `icon-xxx`
  - `'svg:文件名'`：引用 `public/svg/` 下的 SVG 文件（如 `'svg:bilibili'`）
  - 对象：`{ type: 'svg' | 'font', name: 'xxx' }`
- `'img'`：`icon` 字段填写图片路径（如 `/images/avatar.png`），指向 `public` 目录

如需使用主题内置 iconfont 之外的图标，推荐用 SVG 写法，把 `.svg` 文件丢进 `public/svg/` 即可。
:::

> 图片路径以 `/` 开头，对应 `public/` 下的文件，如 `/images/xxx.png` 对应 `public/images/xxx.png`。

::: tip target 控制打开方式
`target` 字段遵循 HTML 规范：
- `'_blank'`：在新标签页打开（`window.open`）
- `'_self'` 或省略：走**站内路由**（`router.go`）——仅适用于 `/` 开头的站内路径；对 `mailto:`/`tel:` 等协议类链接会跳转失败（见下方 warning）

站内路径通常无需设置 `target`，外链建议设置为 `'_blank'`。
:::

::: warning 协议类链接（mailto:/tel:）必须加 `target: '_blank'`
省略 `target` 时点击走**站内路由**（`router.go`），该路径仅适用于站内 `/` 开头的路径。`mailto:`、`tel:` 等协议类链接若省略 `target` 会被当作站内路径处理而跳转失败，必须显式设置 `target: '_blank'`（浏览器将调用系统邮件/拨号客户端）。
:::

::: tip 内外链均可
`url` 既支持外链（`https://` 开头），也支持站内路径（`/` 开头）。站内路径建议配合 [`nav`](./nav.md) 顶部导航使用，此处更适用于友情链接与外部资源。
:::

## 相关配置

- [`icon` 图标字段](./icons.md) — `icon` 字段类型定义与字段参考
- [`nav` 顶部导航栏](./nav.md) — 顶部下拉菜单配置
- [`footer` 页脚](./footer.md) — 页脚社交链接（同样使用图标字段）
- [`siteMeta` 站点信息](./site-meta.md) — 站点地址与作者信息
