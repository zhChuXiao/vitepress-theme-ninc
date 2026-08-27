# homeTop 首页顶部区域

配置首页顶部的展示区域，包括主标题、副标题、推荐站点横幅以及快捷分类入口卡片。

![首页顶部配置文档页](/images/article/hometop.png)

## 字段说明

### homeTop 主表

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `'Hello, World'` | 顶部主标题 |
| `subtitle` | `string` | `'powered by ninc'` | 副标题描述 |
| `link` | `string` | `'example.com'` | 主标题旁显示的链接文本 |
| `banner` | `HomeTopBanner` | 见下方子表 | 推荐站点横幅配置 |
| `category` | `HomeTopCategoryItem[]` | 见下方子表 | 快捷分类入口数组 |

### banner 子表

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `tip` | `string` | `'推荐站点：'` | 横幅前缀提示文字 |
| `title` | `string` | `'Example Site'` | 推荐站点标题 |
| `image` | `string` | `'https://blog.ninc.top/images/cover/003405.jpeg'` | 浅色模式横幅图片路径，默认使用主题作者提供的网络图片，开箱即用；替换方法：把图片放到 `public/images/` 下，改为 `'/images/your-banner.jpg'` |
| `darkImage` | `string?` | `''` | 深色模式横幅图片路径，缺省回退到 `image`；如需深色模式专用图，同样放到 `public/images/` 下并填入路径 |
| `recommendUrl` | `string` | `'https://example.com/'` | 推荐站点跳转地址 |
| `newTab` | `boolean?` | `true` | 是否在新标签页打开推荐链接 |

### category 子表（数组项）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | —（必填） | 分类入口名称 |
| `path` | `string` | —（必填） | 分类页面路径，站内绝对路径 |
| `shadow` | `string` | —（必填） | 悬浮阴影颜色 CSS 变量，如 `var(--main-shadow-blue)`；省略则无阴影 |
| `icon` | `string` | —（必填） | iconfont 类名（需含 `icon-` 前缀，如 `'icon-article'`）；省略则图标不显示 |
| `class` | `string` | —（必填） | 样式类名，控制卡片配色（如 `blue`/`red`/`green`）；省略则无配色 |

默认 `category` 值为空数组 `[]`，需用户自行配置。以下为推荐示例：

```ts
category: [
  { name: '归档', path: '/pages/archives', shadow: 'var(--main-shadow-blue)', icon: 'icon-article', class: 'blue' },
  { name: '分类', path: '/pages/categories', shadow: 'var(--main-shadow-red)', icon: 'icon-folder', class: 'red' },
  { name: '留言板', path: '/pages/comments', shadow: 'var(--main-shadow-blue)', icon: 'icon-chat', class: 'green' }
]
```

## 示例

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  homeTop: {
    title: 'Hello, World',
    subtitle: '一个由 vitepress-theme-ninc 驱动的个人博客',
    link: 'example.com',
    banner: {
      tip: '推荐站点：',
      title: '南风志',
      image: '/images/banner.png',
      darkImage: '/images/banner-dark.png',
      recommendUrl: 'https://example.com/',
      newTab: true
    },
    category: [
      { name: '归档', path: '/pages/archives', shadow: 'var(--main-shadow-blue)', icon: 'icon-article', class: 'blue' },
      { name: '分类', path: '/pages/categories', shadow: 'var(--main-shadow-red)', icon: 'icon-folder', class: 'red' },
      { name: '标签', path: '/pages/tags', shadow: 'var(--main-shadow-green)', icon: 'icon-hashtag', class: 'green' },
      { name: '留言板', path: '/pages/comments', shadow: 'var(--main-shadow-purple)', icon: 'icon-chat', class: 'purple' }
    ]
  }
})
```

## 渲染效果

---

`homeTop` 控制首页首屏的视觉焦点，渲染区域自上而下依次为：

- **主标题区**：`title` 与 `subtitle` 各占一行构成大字号欢迎语，`link` 以小字显示在副标题下方。
- **推荐横幅**：`banner` 渲染为右侧带前缀提示的卡片，点击跳转 `recommendUrl`（`newTab` 决定打开方式），深色模式优先使用 `darkImage`、未配置时回退到 `image`。
- **快捷分类入口**：`category` 渲染为带 iconfont 图标的多列卡片，悬浮时呈现 `shadow` 对应颜色的阴影，`class` 决定卡片配色。

::: tip 常见配置组合
- **极简首屏**：`title` + `subtitle` + 3 个 `category`，不配置 `banner`，突出内容入口。
- **推荐导向**：启用 `banner` 指向主推站点，配合 4 个 `category` 平衡首屏信息密度。
- **多色彩分类**：为每个 `category` 设置不同 `class`（`blue`/`red`/`green`/`purple`），形成色彩对比。
:::

::: warning 排版建议
`category` 数量建议控制在 3-6 个之间，过少首屏显得空旷，过多会挤压文章列表。卡片在窄屏下会自动堆叠，无需额外适配。
:::

## 注意事项

::: tip shadow 使用 CSS 变量
`shadow` 字段应填写 CSS 变量（如 `var(--main-shadow-blue)`），便于在主题样式中统一管理阴影配色。自定义变量需在 `:root` 中预先定义。
:::

::: tip icon 使用 iconfont 图标名
`category` 的 `icon` 字段填写的是 iconfont 图标类名（需含 `icon-` 前缀，如 `'icon-article'`），渲染为卡片右侧的装饰性大图标。需确保对应图标已在主题内置 iconfont 中，否则图标将无法显示。注意 `category` 的 `icon` 字段属于 **iconfont 类名语义**，暂未支持 `IconField` 三种写法（与 [`nav`](./nav.md)、[`footer.social`](./footer.md) 等的 `icon` 字段不同）；[`creativity`](#技能图标) 的图标才是图片路径语义。统一的图标字段说明见 [`icon` 图标字段](./icons.md)。
:::

::: warning class 控制配色
`class` 字段决定分类卡片的整体配色风格（背景、文字、边框），内置支持 `blue`/`red`/`green` 等预设类名。自定义类名需自行在样式中实现对应规则。
:::

::: tip darkImage 适配深色模式
建议为横幅准备深色模式专用图片并配置 `darkImage`，避免浅色图片在深色背景下产生刺眼效果。若省略，将自动回退到 `image`。
:::

## 技能图标

首页顶部和关于页面都会展示一组滚动的技能图标（如 Vue、React、CSS 等）。关于页面鼠标悬浮在技能区域时还会显示完整的技能列表。

### 配置方式

在 `themeConfig.homeTop.creativity` 中配置，数据格式如下：

```ts
homeTop: {
  creativity: [
    {
      class_name: '开启创造力',
      creativity_list: [
        { name: 'Vue', color: '#b8f0ae', icon: '/images/icon/vue.svg' },
        { name: 'React', color: '#222', icon: '/images/icon/react.svg' },
        { name: 'CSS', color: '#2c51db', icon: '/images/icon/css3.svg' },
        { name: 'HTML', color: '#e9572b', icon: '/images/icon/html5.svg' }
        // ...继续添加
      ]
    }
  ]
}
```

### 字段说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `class_name` | `string` | 分组名称 |
| `creativity_list` | `array` | 技能列表 |
| `creativity_list[].name` | `string` | 技能名称 |
| `creativity_list[].color` | `string` | 图标背景色 |
| `creativity_list[].icon` | `string` | 图标图片路径，放在 `public/images/icon/` 下 |
| `creativity_list[].link` | `string`（可选） | 技能详情链接。配置后关于页完整技能列表中的该项可点击、新标签打开；未配置的项渲染为纯展示（无手型、不可点击） |

::: tip 列表项数与滚动配对
技能图标滚动区按「上下两格一组」配对渲染。列表为**奇数**长度时，最后一项会与自身配对（上下两格显示同一图标），不会丢失。
:::

::: warning 图标图片需确保存在
图标建议使用 SVG 格式，放在 `public/images/icon/` 目录下。路径写错或文件缺失时，组件会隐藏破碎的 `<img>`、仅保留 `color` 底色块（不会出现浏览器破碎图标志），但技能图标仍会缺失——配置后请逐个核对文件是否存在。
:::

::: warning 不配置时的行为
`creativity` 默认为空数组。不配置时，首页顶部和关于页面会回退到主题内置的默认技能数据。配置后会完全覆盖默认数据。
:::

### 渲染位置

技能图标在以下两个页面显示：

**1. 首页顶部**

技能图标以滚动动画的形式展示在首页顶部左侧卡片中，位于主标题区下方、「随便逛逛」按钮与快捷分类入口上方。

---

关于页面的技能区域包含两部分：上方是滚动的技能图标动画，鼠标悬浮时切换为下方的完整技能列表（带图标和名称）。

---

## 相关配置

- [`icon` 图标字段](./icons.md) — `icon` 字段类型定义与字段参考
- [`siteMeta` 站点信息](./site-meta.md) — 站点标题与作者信息
- [`nav` 顶部导航栏](./nav.md) — 顶部菜单配置
- [`cover` 文章封面](./cover.md) — 首页文章列表封面配置
