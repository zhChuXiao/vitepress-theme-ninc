# 图标使用指南

本页讲解主题里所有「icon 字段」支持的图标类型、三种写法、以及如何添加自定义图标。

主题里很多配置项都接受 `icon` 字段：[导航栏菜单](../config/nav.md)、[更多菜单](../config/nav-more.md)、[页脚社交链接](../config/footer.md)、[右侧自定义按钮](../config/nav-buttons.md)、[首页顶部快捷分类](../config/home-top.md) 等。这些字段从 v0.x 起统一支持三种写法，让你既能用主题内置的 iconfont 字体图标，也能用任意图标库里的 SVG 文件。

## 支持的图标类型

| 类型 | 来源 | 扩展方式 | 适用场景 |
| --- | --- | --- | --- |
| **字体图标（iconfont）** | 主题内置 `iconfont.scss` + `.woff2` | 仅能用主题预置的图标，无法自行扩展 | 主题默认提供的常用图标 |
| **SVG 图标** | `public/svg/` 目录下的 `.svg` 文件 | 把任意 `.svg` 文件丢进目录即可使用 | 想用 iconfont 项目外的图标、品牌 logo、自定义插画 |
| **图片** | `public/images/` 下的图片文件 | 直接放图片到目录，URL 填到 `icon` 字段 | 不规则尺寸/彩色 logo、PNG 徽章 |

三种类型覆盖了「主题预置 → 自定义矢量 → 自定义位图」的完整扩展链路。日常推荐使用 SVG 图标，既能完美适配主题色与暗黑模式，又方便替换。

## icon 字段的三种写法

所有支持 `icon` 字段的配置项，都支持下面三种写法（按推荐顺序）：

### 1. 字符串（最简，字体图标）

直接填 iconfont 图标名（不含 `icon-` 前缀），主题会自动渲染为 `<i class="iconfont icon-xxx">`：

```ts
// themeConfig.ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  footer: {
    social: [
      { icon: 'github', link: 'https://github.com/zhChuXiao/vitepress-theme-ninc' },
      { icon: 'mail', link: 'mailto:blog@example.com' }
    ]
  }
})
```

::: tip 字体图标的局限
主题内置的字体图标是固定的（来源于 [iconfont.cn](https://www.iconfont.cn) 项目），用户无法自行新增字体图标。如果需要的图标不在内置集合里，请改用 SVG 图标。
:::

### 2. `'svg:文件名'` 前缀字符串（最简，SVG 图标）

在字符串前加 `svg:` 前缀，主题会去 `public/svg/` 目录下查找同名 `.svg` 文件：

```ts
export const themeConfig = defineThemeConfig({
  footer: {
    social: [
      // 渲染 public/svg/bilibili.svg
      { icon: 'svg:bilibili', link: 'https://www.bilibili.com' },
      // 渲染 public/svg/rss.svg
      { icon: 'svg:rss', link: '/rss.xml' }
    ]
  }
})
```

这是**推荐的扩展方式**：只需把 `.svg` 文件丢到 `public/svg/` 下，文件名即图标名，无需修改源码、无需联网加载字体。

### 3. 对象写法（最明确）

显式声明 `type` 与 `name`，适合对可读性要求高的场景：

```ts
export const themeConfig = defineThemeConfig({
  footer: {
    social: [
      { icon: { type: 'font', name: 'github' }, link: 'https://github.com/...' },
      { icon: { type: 'svg', name: 'bilibili' }, link: 'https://www.bilibili.com' }
    ]
  }
})
```

- `type: 'font'`：走字体图标，`name` 是 iconfont 图标名
- `type: 'svg'`：走 SVG 雪碧图，`name` 是 `public/svg/` 下的文件名（不含后缀）

## 添加自定义 SVG 图标

### 第一步：放置图标文件

把 `.svg` 文件放到项目根目录的 `public/svg/` 下：

```
你的项目/
├─ public/
│  ├─ images/         # 图片资源
│  └─ svg/            # SVG 图标目录
│     ├─ bilibili.svg
│     ├─ rss.svg
│     └─ ...
├─ .vitepress/
└─ ...
```

文件名即图标名。比如 `bilibili.svg` 在配置里写 `icon: 'svg:bilibili'`。

::: tip 文件名规则
- 只能用半角字母、数字、`-`、`_`，**避免中文与空格**
- 文件名在扫描目录内需唯一，同名文件后扫描的会覆盖前者
- 不需要子目录，扁平结构最清晰
:::

### 第二步：在配置里引用

直接用 `'svg:文件名'` 写法即可：

```ts
// themeConfig.ts
export const themeConfig = defineThemeConfig({
  // 导航栏右侧自定义按钮
  navButtons: [
    {
      name: 'Bilibili 主页',
      icon: 'svg:bilibili',   // ← 引用 public/svg/bilibili.svg
      url: 'https://space.bilibili.com/xxx'
    }
  ],

  // 页脚社交链接
  footer: {
    social: [
      { icon: 'svg:bilibili', link: 'https://space.bilibili.com/xxx' },
      { icon: 'svg:zhihu', link: 'https://www.zhihu.com/people/xxx' }
    ]
  }
})
```

### 第三步：验证

启动 `pnpm dev`，对应位置的图标就会渲染为 SVG。SVG 图标会自动适配主题色（通过 `fill: currentColor`），无需为深浅色模式准备两份图标。

::: tip SVG 文件要求
- 建议使用单色 SVG（黑色或 `currentColor`），主题会通过 `fill` 控制颜色
- 主题构建时会自动移除 `fill` 与 `stroke` 属性（通过 `vite-plugin-svg-icons` 的 `removeAttrs` 插件），让图标完全继承父元素颜色
- 保留 `viewBox` 属性以便自适应缩放
- 多色 SVG 也能用，但颜色无法跟随主题切换
:::

## 在哪里获取 SVG 图标

- [iconfont.cn](https://www.iconfont.cn) — 阿里巴巴矢量图标库，可下载 SVG
- [Iconify](https://iconify.design) — 200+ 图标集聚合
- [simple-icons](https://simpleicons.org) — 2400+ 品牌 logo（GitHub、Bilibili、知乎等）
- [Lucide](https://lucide.dev) — 现代化图标库
- [Heroicons](https://heroicons.com) — Tailwind 团队出品

下载 `.svg` 文件后直接丢到 `public/svg/` 即可，无需任何额外处理。

## 使用图片图标

除了字体图标和 SVG，部分配置项还支持图片 URL（通过 `iconType: 'img'` 标识）：

```ts
export const themeConfig = defineThemeConfig({
  navButtons: [
    {
      name: '我的工具站',
      iconType: 'img',          // ← 标识用图片
      icon: '/images/tool.png', // ← 图片 URL，放在 public/images/ 下
      url: 'https://tool.example.com'
    }
  ],

  navMore: [
    {
      name: '友情站点',
      list: [
        {
          name: '某博客',
          iconType: 'img',
          icon: '/images/friend.png',
          url: 'https://blog.example.com'
        }
      ]
    }
  ]
})
```

::: warning 图片图标的局限
- 颜色无法跟随主题切换（彩色 logo 在深色模式下可能不协调）
- 需要单独准备 PNG/WebP 文件
- 渲染尺寸固定，缩放可能失真

推荐仅在 logo 必须保留原色时使用，其余场景优先用 SVG。
:::

## 实战示例

### 把页脚社交链接换成自己的图标集

```ts
// 1. 把 SVG 文件放到 public/svg/ 下：
//    public/svg/github.svg
//    public/svg/bilibili.svg
//    public/svg/zhihu.svg
//    public/svg/mail.svg
//    public/svg/rss.svg

// 2. 配置
export const themeConfig = defineThemeConfig({
  footer: {
    social: [
      { icon: 'svg:github', link: 'https://github.com/xxx' },
      { icon: 'svg:bilibili', link: 'https://space.bilibili.com/xxx' },
      { icon: 'svg:zhihu', link: 'https://www.zhihu.com/people/xxx' },
      { icon: 'svg:mail', link: 'mailto:blog@example.com' },
      { icon: 'svg:rss', link: '/rss.xml' }
    ]
  }
})
```

### 在导航栏菜单项上加图标

```ts
export const themeConfig = defineThemeConfig({
  nav: [
    {
      text: '文库',
      items: [
        { text: '前端笔记', link: '/fe/', icon: 'svg:frontend' },
        { text: '后端笔记', link: '/be/', icon: 'svg:backend' },
        { text: '工具集', link: '/tools/', icon: 'svg:tools' }
      ]
    }
  ]
})
```

### 在右侧自定义按钮上用品牌 logo

```ts
export const themeConfig = defineThemeConfig({
  navButtons: [
    {
      name: '我的 Bilibili',
      icon: 'svg:bilibili',
      url: 'https://space.bilibili.com/xxx'
    },
    {
      name: '我的知乎',
      icon: 'svg:zhihu',
      url: 'https://www.zhihu.com/people/xxx'
    }
  ]
})
```

## 进阶：多目录扫描与 Markdown 中直接使用

主题通过 [vite-plugin-svg-icons](https://github.com/vbenjs/vite-plugin-svg-icons) 实现 SVG 雪碧图，默认扫描 `<项目根>/public/svg` 目录。如需扫描多个目录（例如同时引用 iconify 下载的图标与团队设计稿），可在 `defineConfig` 的第三参数配置：

```ts
// .vitepress/config.mts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'

export default defineConfig(
  {},
  themeConfig,
  {
    svgIconDirs: ['public/svg', 'public/icons']  // 同时扫描两个目录
  }
)
```

也可以在 Markdown / Vue 组件中直接使用 `<SvgIcon>` 组件（不通过 `icon` 字段），详见 [SVG 雪碧图](./assets/svg.md)。

## 字段类型参考

`icon` 字段的 TypeScript 类型定义详见 [图标字段参考](../config/icons.md)。

## 相关配置

- [`nav` 导航栏](../config/nav.md) — `nav[].items[].icon`
- [`navMore` 更多菜单](../config/nav-more.md) — `navMore[].list[].icon`
- [`navButtons` 右侧自定义按钮](../config/nav-buttons.md) — `navButtons[].icon`
- [`footer` 页脚](../config/footer.md) — `footer.social[].icon`
- [SVG 雪碧图（进阶用法）](./assets/svg.md) — 在 Markdown 中直接使用 `<SvgIcon>` 组件
