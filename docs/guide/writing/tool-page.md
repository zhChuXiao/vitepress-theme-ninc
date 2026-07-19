# 工具页与全宽布局

Steam 等级速查表、HTTP 状态码大全、键码值对照表这类内容，目标是「全宽展示、不被当作文章」；源码分析这类文章代码块很多，需要默认折叠。本页说明 `isPage`、`aside`、`fullWidth` 三个布局字段的组合使用，`cbx` 代码块折叠开关，以及 `posts/` 与 `pages/` 目录的取舍依据。

## 工具页 / 速查表

Steam 等级速查表、HTTP 状态码大全、键码值对照表这类内容，目标是「全宽展示、不被当作文章」，需要关闭侧边栏并启用全宽布局。

### 推荐字段组合

`title` / `date` / `aside: false` / `isPage: true` / `fullWidth: true`

### 完整示例

```md
---
title: Steam 等级计算速查表
tags: [Steam, 游戏, 速查表]
categories: [资料速查]
recommend: true
date: 2025-10-25
mainColor: '#6A7DA2'
aside: false
isPage: true
fullWidth: true
cover: /images/cover/steam-cover.jpg
references:
  - title: SteamDB
    url: https://example.com/steamdb
description: 完整的 Steam 徽章速查指南，包含等级计算、游戏收藏徽章、年限徽章和特殊徽章。
articleGPT: 本文提供了全面的 Steam 徽章查询指南，详细介绍了 Steam 平台上的各类徽章系统。
---

# Steam 等级计算速查表

正文以全宽布局展示，适合放置宽表格与多列对照...
```

### 字段在此场景的作用

- **`isPage: true`**：让该文件不被当作文章。设置后不会进入文章列表、归档、分类与标签体系，但仍可通过 `/posts/...` 路径访问。
- **`aside: false`**：隐藏侧边栏（目录导航），让内容区占满文章栏宽度。
- **`fullWidth: true`**：启用全宽布局，内容区进一步扩展到接近视口宽度，适合放置宽表格。

三者通常组合使用。`isPage` 决定身份（不是文章），`aside` 与 `fullWidth` 决定布局（全宽无侧边栏）。若只想要全宽但仍计入文章列表，可省略 `isPage`，只保留 `aside: false` 与 `fullWidth: true`。

这类页面也可直接放在 `pages/` 目录而非 `posts/`，两种做法的区别见 [文章与页面的取舍](#文章与页面的取舍)。动态路由页面（分类页、标签页、分页页）的布局控制参考 [自定义页面 - 布局控制](../pages.md#布局控制)。

![工具页全宽布局](/images/article/isPage.png)

> 上图展示了启用 `aside: false` + `fullWidth: true` 后的全宽布局，适合速查表、工具页等需要展示宽表格或多列内容的场景。

## 代码密集型文章

源码分析、完整配置文件讲解这类文章代码块很多，默认展开会让正文变得很长。通过 `cbx` 字段让所有代码块默认折叠，点击后展开。

### 推荐字段组合

标准字段（见[标准文章](./standard.md)）+ `cbx: true`

### 完整示例

````md
---
title: Vite 构建流程源码分析
tags: [Vite, 源码, Node]
categories: [前端开发]
date: 2025-03-20
cbx: true
mainColor: '#6A7DA2'
cover: /images/cover/vite-source.jpg
description: 逐行分析 Vite 开发服务器启动流程，从 CLI 入口到中间件组装。
articleGPT: 本文从 Vite 的 CLI 入口出发，分析 dev server 的创建过程，涵盖依赖预构建、模块图、HMR 三个核心模块。
---

# Vite 构建流程源码分析

正文中的代码块会默认折叠：

```ts
// 这段代码默认折叠，点击「展开」查看完整内容
export function createServer(config: InlineConfig): Promise<ViteDevServer> {
  // ...
}
```
````

### 字段在此场景的作用

- **`cbx: true`**：该文章内所有代码块默认折叠，渲染为带「展开」按钮的折叠块，点击后展开显示完整内容。
- 仅作用于当前文章，不影响其他文章的代码块渲染。
- 适合代码示例多、单段代码长、不希望代码块占据过多版面的长文。

`cbx` 是文章级开关。如果只想折叠某个代码块而非全文，参考 [Markdown 扩展语法 - 代码块默认折叠](../markdown/#代码块默认折叠)。

## 文章与页面的取舍

`.md` 文件放在 `posts/` 还是 `pages/`，以及是否设置 `isPage`，决定它的身份：

| 位置 / 设置 | 进入文章列表 | 进入归档/分类/标签 | 典型场景 |
| --- | --- | --- | --- |
| `posts/` 普通文章 | :done: | :done: | 博客文章、技术分享 |
| `posts/` + `isPage: true` | :fail: | :fail: | 放在 posts 下但不是文章的工具页 |
| `pages/` | :fail: | :fail: | 关于、留言、友链、独立工具页 |

三者访问路径不同：`posts/` 下的文章路径为 `/posts/...`，`pages/` 下的页面路径为 `/pages/...`。`isPage: true` 不改变路径，只改变身份。

选择依据：

- 内容需要进入文章体系（列表、归档、分类、标签）→ 放 `posts/`，不设 `isPage`。
- 内容是工具页、速查表，但仍想用 `/posts/...` 路径访问 → 放 `posts/`，设 `isPage: true`。
- 内容与博客文章体系无关（关于、留言、友链）→ 放 `pages/`。

`pages/` 目录的页面类型与动态路由机制详见 [自定义页面](../pages.md)。

---

[← 上一篇：参考资料](./references.md)
