# nav 顶部导航栏

配置站点顶部的导航栏菜单，以分组下拉形式组织菜单项，每个分组包含菜单名与下拉项数组。

## 字段说明

### nav 主表（NavGroup 数组）

`nav` 为 `NavGroup[]` 数组，每一项代表一个下拉菜单分组。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `text` | `string` | — | 分组菜单名，显示在导航栏 |
| `items` | `NavItem[]` | — | 下拉菜单项数组 |

### items 子表（NavItem）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `text` | `string` | — | 菜单项文字 |
| `link` | `string` | — | 站内路径，如 `/pages/archives` |
| `icon` | `string?` | — | iconfont 图标名，可选 |

默认 `nav` 值：

```ts
nav: [
  {
    text: '文库',
    items: [
      { text: '文章列表', link: '/pages/archives', icon: 'article' },
      { text: '全部分类', link: '/pages/categories', icon: 'folder' },
      { text: '全部标签', link: '/pages/tags', icon: 'hashtag' }
    ]
  },
  {
    text: '我的',
    items: [
      { text: '留言板', link: '/pages/comments', icon: 'chat' },
      { text: '关于本站', link: '/pages/about', icon: 'contacts' }
    ]
  }
]
```

## 示例

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  nav: [
    {
      text: '文库',
      items: [
        { text: '文章列表', link: '/pages/archives', icon: 'article' },
        { text: '全部分类', link: '/pages/categories', icon: 'folder' },
        { text: '全部标签', link: '/pages/tags', icon: 'hashtag' }
      ]
    },
    {
      text: '我的',
      items: [
        { text: '留言板', link: '/pages/comments', icon: 'chat' },
        { text: '关于本站', link: '/pages/about', icon: 'contacts' }
      ]
    },
    {
      text: '工具',
      items: [
        { text: '在线工具集', link: '/pages/tools', icon: 'tool' },
        { text: '友情链接', link: '/pages/friends', icon: 'link' }
      ]
    }
  ]
})
```

## 渲染效果

---

`nav` 渲染为顶部固定导航栏，交互细节如下：

- **分组展示**：每个 `NavGroup` 渲染为一个可点击的菜单名（`text`），鼠标悬浮或点击触发下拉。
- **下拉项**：`items` 渲染为下拉面板中的列表项，`icon` 显示在文字左侧（可选），`link` 决定点击跳转的站内路径。
- **响应式收起**：窄屏下顶部导航会折叠，部分分组进入 [`navMore`](./nav-more.md) 的抽屉菜单。

::: tip 常见配置组合
- **内容型博客**：「文库」+「我的」两个分组，覆盖文章/分类/标签/留言/关于。
- **工具型站点**：增加「工具」分组放置在线工具与友链入口。
- **多语言/多栏目**：按栏目划分分组（如「前端」「后端」「生活」），每组 3-5 个下拉项。
:::

::: warning 分组数量建议
顶部导航分组建议 2-4 个，过多会导致窄屏提前折叠。单层链接（非下拉）请放到 [`navMore`](./nav-more.md) 中。
:::

## 注意事项

::: tip link 使用站内路径
`link` 字段填写站内绝对路径（以 `/` 开头，如 `/pages/archives`），主题会将其作为站内路由处理。外链请配置到 [`navMore`](./nav-more.md) 中。
:::

::: tip icon 可选且使用 iconfont
`icon` 字段为可选项，填写 iconfont 图标名（如 `article`、`folder`）。需确保图标已在 iconfont 项目中引入，否则不会显示。
:::

::: warning 分组形式
`nav` 仅支持分组（`NavGroup`）形式，每个分组必须有 `text` 与 `items`。若需要单层链接（非下拉菜单），可考虑通过 [`navMore`](./nav-more.md) 或自定义组件实现。
:::

::: tip 与 VitePress nav 区分
此处 `nav` 为主题自定义配置，与 VitePress 原生 `themeConfig.nav` 不同，请勿混淆。主题会基于此配置渲染导航栏。
:::

## 相关配置

- [`navMore` 左侧更多菜单](./nav-more.md) — 侧边更多链接分组
- [`homeTop` 首页顶部区域](./home-top.md) — 首页顶部快捷分类入口
- [`footer` 页脚](./footer.md) — 页脚站点地图导航
