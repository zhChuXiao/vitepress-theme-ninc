# SVG 雪碧图

本页讲解 SVG 图标的使用方式，包括 SvgIcon 组件、雪碧图的配置与多目录扫描，以及在 Markdown 和 Vue 组件中的引用示例。主题通过 [vite-plugin-svg-icons](https://github.com/vbenjs/vite-plugin-svg-icons) 实现 SVG 雪碧图，构建时扫描指定目录下的所有 `.svg` 文件，合并为单个 SVG symbol sprite，运行时通过 `<use>` 引用，避免重复请求与 DOM 膨胀。

::: tip 快速上手
如果你只是想在 `themeConfig` 的 `icon` 字段里用自定义 SVG 图标（如页脚社交链接、导航栏按钮），无需手写 `<SvgIcon>` 组件，直接用 `'svg:文件名'` 写法即可。详见 [图标使用指南](../icons.md)。
:::



## 工作原理

1. 构建阶段：插件扫描 `svgIconDirs` 下的所有 `.svg`，按 `icon-[dir]-[name]` 规则将每个文件转为 `<symbol>` 并合并为雪碧图。
2. 运行时：主题入口已引入 `virtual:svg-icons-register`，自动把雪碧图注入到页面 `<body>` 末尾（插件配置 `inject: 'body-last'`）。
3. 渲染阶段：通过全局注册的 `<SvgIcon name="icon-name" />` 组件，渲染为 `<svg><use href="#icon-name" /></svg>`。

## 配置方式

`defineConfig` 第三参数 `options.svgIconDirs` 用于指定扫描目录，默认为 `<cwd>/public/svg`：

```ts
// .vitepress/config.mts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from './themeConfig'

export default defineConfig(
  {},
  themeConfig,
  {
    // 默认值：path.resolve(process.cwd(), 'public/svg')
    svgIconDirs: ['public/svg']
  }
)
```

源码参考（`defineConfig.ts`）：

```ts
svgIconDirs: options.svgIconDirs || [path.resolve(cwd, 'public/svg')]
```

## 多目录配置

`svgIconDirs` 是字符串数组，可同时扫描多个目录。多目录的 symbol 会合并到同一张雪碧图中。若不同目录下存在同名 `.svg` 文件，两者的 symbol id 相同，**先扫描目录（数组中靠前）的那份生效**（浏览器对重复 id 的 `<symbol>` 取第一个）：

```ts
export default defineConfig(
  {},
  themeConfig,
  {
    svgIconDirs: ['public/svg', 'public/icons']
  }
)
```

## 使用方式

将 SVG 文件放入扫描目录后，在任意 Markdown 或 Vue 组件中通过 `<SvgIcon>` 组件渲染。`name` 是文件名（不含 `.svg` 后缀）：

```md
<!-- 引用 public/svg/github.svg -->
<SvgIcon name="github" />

<!-- 指定渲染尺寸（默认 16px × 16px） -->
<SvgIcon name="github" width="24px" height="24px" />
```

```vue
<!-- .vue 组件中 -->
<template>
  <SvgIcon name="email" width="20px" height="20px" />
</template>
```

`<SvgIcon>` 可用 props：`name`（必填，对应 symbol id 后缀）、`prefix`（默认 `'icon'`）、`width` / `height`（默认 `'16px'`）。图标颜色由 CSS 控制：svgo 压缩时已移除 SVG 文件中的 `fill`/`stroke` 属性（包括手写的 `fill="currentColor"`）；当前版本 `<SvgIcon>` 未内置 `fill` 样式，图标呈现为浏览器默认黑色——需要跟随文字颜色时，在自定义样式中加 `.svg-icon { fill: currentColor; }` 即可（详见 [图标使用指南](../icons.md#第三步-验证)）。（附注：组件源码中仍保留一个 `color` prop 定义，但未参与模板渲染，属于遗留代码，设置它不会有任何效果。）

::: tip name 命名规则
`symbolId` 格式为 `icon-[dir]-[name]`：位于扫描目录**根层级**的文件，`name` 即文件名（如 `public/svg/github.svg` → `<SvgIcon name="github" />`）；位于**子目录**的文件需带上目录前缀（如 `public/svg/social/github.svg` → `<SvgIcon name="social-github" />`，多级目录以此类推 `dir-dir2-icon1`）。建议保证扫描目录下最终 symbol id 唯一，避免冲突。
:::

## 完整 config.mts 示例

```ts
// .vitepress/config.mts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from './themeConfig'
import groupIconConfig from './groupIconConfig.json'

export default defineConfig(
  {
    sitemap: { hostname: 'https://example.com' }
  },
  themeConfig,
  {
    groupIconConfig,
    svgIconDirs: ['public/svg', 'public/icons']
  }
)
```

## 相关文档

- [图标使用指南](../icons.md) — 在 `themeConfig` 的 `icon` 字段里用 `'svg:文件名'` 写法引用 SVG 图标（无需手写 `<SvgIcon>`）
- [`icon` 图标字段](../../config/icons.md) — `IconField` 类型定义与所有支持三种写法的字段列表


