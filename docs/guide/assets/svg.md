# SVG 雪碧图

本页讲解 SVG 图标的使用方式，包括 SvgIcon 组件、雪碧图的配置与多目录扫描，以及在 Markdown 和 Vue 组件中的引用示例。主题通过 [vite-plugin-svg-icons](https://github.com/vbenjs/vite-plugin-svg-icons) 实现 SVG 雪碧图，构建时扫描指定目录下的所有 `.svg` 文件，合并为单个 SVG symbol sprite，运行时通过 `<use>` 引用，避免重复请求与 DOM 膨胀。

::: tip 快速上手
如果你只是想在 `themeConfig` 的 `icon` 字段里用自定义 SVG 图标（如页脚社交链接、导航栏按钮），无需手写 `<SvgIcon>` 组件，直接用 `'svg:文件名'` 写法即可。详见 [图标使用指南](../icons.md)。
:::



## 工作原理

1. 构建阶段：插件扫描 `svgIconDirs` 下的所有 `.svg`，将每个文件转为 `<symbol id="文件名">` 并合并为雪碧图。
2. 运行时：主题入口已引入 `virtual:svg-icons-register`，自动把雪碧图注入到页面 `<body>` 起始处。
3. 渲染阶段：通过全局注册的 `<SvgIcon name="icon-name" />` 组件，渲染为 `<svg><use href="#icon-name" /></svg>`。

## 配置方式

`defineConfig` 第三参数 `options.svgIconDirs` 用于指定扫描目录，默认为 `<cwd>/public/svg`：

```ts
// .vitepress/config.mts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from '../themeConfig'

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

`svgIconDirs` 是字符串数组，可同时扫描多个目录。多目录的 symbol 会合并到同一张雪碧图中。若不同目录下存在同名 `.svg` 文件，后扫描的会覆盖前者：

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

<!-- 带尺寸与颜色 -->
<SvgIcon name="github" size="24" color="#181717" />
```

```vue
<!-- .vue 组件中 -->
<template>
  <SvgIcon name="email" :size="20" />
</template>
```

::: tip name 命名规则
`name` 直接对应文件名。若文件位于子目录（如 `public/svg/social/github.svg`），`name` 仍为 `github`（不带目录前缀）。建议保证扫描目录下文件名唯一，避免冲突。
:::

## 完整 config.mts 示例

```ts
// .vitepress/config.mts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from '../themeConfig'
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


