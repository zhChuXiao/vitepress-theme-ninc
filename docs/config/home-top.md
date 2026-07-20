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
| `image` | `string` | `'http://blog.ninc.top/images/cover/003405.jpeg'` | 浅色模式横幅图片路径，默认使用主题作者提供的网络图片，开箱即用；替换方法：把图片放到 `public/images/` 下，改为 `'/images/your-banner.jpg'` |
| `darkImage` | `string?` | `''` | 深色模式横幅图片路径，缺省回退到 `image`；如需深色模式专用图，同样放到 `public/images/` 下并填入路径 |
| `recommendUrl` | `string` | `'https://example.com/'` | 推荐站点跳转地址 |
| `newTab` | `boolean?` | `true` | 是否在新标签页打开推荐链接 |

### category 子表（数组项）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | — | 分类入口名称 |
| `path` | `string` | — | 分类页面路径，站内绝对路径 |
| `shadow` | `string` | `'var(--main-shadow-blue)'` | 悬浮阴影颜色 CSS 变量 |
| `icon` | `string` | `'icon-article'` | iconfont 图标名 |
| `class` | `string` | `'blue'` | 样式类名，控制卡片配色（如 `blue`/`red`/`green`） |

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

- **主标题区**：`title` 与 `subtitle` 构成大字号欢迎语，`link` 显示在主标题右侧。
- **推荐横幅**：`banner` 渲染为带前缀提示的卡片，点击跳转 `recommendUrl`，浅色/深色模式自动切换 `image`/`darkImage`。
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
`icon` 字段填写的是 iconfont 图标名（如 `icon-article`），需确保对应图标已通过 iconfont 项目引入，否则图标将无法显示。
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

::: tip 图标图片缺失时的处理
图标建议使用 SVG 格式，放在 `public/images/icon/` 目录下。如果图片文件缺失，组件会自动显示技能名称的首字母作为回退，不会出现破碎图片。
:::

::: warning 不配置时的行为
`creativity` 默认为空数组。不配置时，首页顶部和关于页面会回退到主题内置的默认技能数据。配置后会完全覆盖默认数据。
:::

### 渲染位置

技能图标在以下两个页面显示：

**1. 首页顶部**

技能图标以滚动动画的形式展示在首页顶部区域，位于主标题和推荐横幅之间。

---

关于页面的技能区域包含两部分：上方是滚动的技能图标动画，鼠标悬浮时切换为下方的完整技能列表（带图标和名称）。

---

## 相关配置

- [`siteMeta` 站点信息](./site-meta.md) — 站点标题与作者信息
- [`nav` 顶部导航栏](./nav.md) — 顶部菜单配置
- [`cover` 文章封面](./cover.md) — 首页文章列表封面配置
