# navMore 左侧更多菜单

配置左侧抽屉式「更多」菜单，以分组形式展示外部链接与站内资源入口，支持图片图标与 iconfont 图标两种类型。

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
| `iconType` | `'img' \| 'iconfont'?` | `'img'` | 图标类型。`'img'`=图片 URL，`'iconfont'`=字体图标或 SVG 图标（默认） |
| `name` | `string` | — | 链接显示名称 |
| `url` | `string` | — | 链接地址，可为外链或站内路径 |
| `target` | `string?` | — | 打开方式，如 `'_blank'` 表示新标签页 |

默认 `navMore` 值：

```ts
navMore: [
  {
    name: '博客',
    list: [
      { icon: '/images/avatar.png', iconType: 'img', name: '我的主页', url: 'https://example.com', target: '_blank' }
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
        { icon: 'icon-github', iconType: 'iconfont', name: 'GitHub', url: 'https://github.com/your-name', target: '_blank' },
        { icon: 'icon-weibo', iconType: 'iconfont', name: '微博', url: 'https://weibo.com/your-name', target: '_blank' },
        { icon: 'icon-email', iconType: 'iconfont', name: '邮箱', url: 'mailto:you@example.com' }
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

`navMore` 渲染为左侧抽屉式面板，通过顶部「更多」按钮触发，展示效果：

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
- `'img'`（默认）：`icon` 字段填写图片路径（如 `/images/avatar.png`），指向 `public` 目录
- `'iconfont'`（或不填）：`icon` 字段支持三种写法 ——
  - 字符串：iconfont 图标名（如 `'github'`、`'icon-github'`）
  - `'svg:文件名'`：引用 `public/svg/` 下的 SVG 文件（如 `'svg:bilibili'`）
  - 对象：`{ type: 'svg' | 'font', name: 'xxx' }`

如需使用主题内置 iconfont 之外的图标，推荐用 SVG 写法，把 `.svg` 文件丢进 `public/svg/` 即可。
:::

> 图片路径以 `/` 开头，对应 `public/` 下的文件，如 `/images/xxx.png` 对应 `public/images/xxx.png`。

::: tip target 控制打开方式
`target` 字段遵循 HTML 规范：
- `'_blank'`：在新标签页打开
- `'_self'`：在当前标签页打开（默认行为，省略时）
站内路径通常无需设置 `target`，外链建议设置为 `'_blank'`。
:::

::: tip 内外链均可
`url` 既支持外链（`https://` 开头），也支持站内路径（`/` 开头）。站内路径建议配合 [`nav`](./nav.md) 顶部导航使用，此处更适用于友情链接与外部资源。
:::

## 相关配置

- [`icon` 图标字段](./icons.md) — `icon` 字段类型定义与字段参考
- [`nav` 顶部导航栏](./nav.md) — 顶部下拉菜单配置
- [`footer` 页脚](./footer.md) — 页脚社交链接（同样使用图标字段）
- [`siteMeta` 站点信息](./site-meta.md) — 站点地址与作者信息
