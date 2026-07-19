# 参考资料

技术文章常需引用官方文档、开源项目等外部资料。通过 `references` 字段，主题会在文章末尾自动渲染「参考资料」区块，无需手动维护列表。本页说明 `references` 数组的结构、渲染效果，以及与转载字段 `reprint` 的共存关系。

## 推荐字段组合

`title` / `date` / `references`

## 完整示例

```md
---
title: 从零搭建 Vite + Vue3 工程模板
tags: [Vite, Vue, 工程化]
categories: [前端开发]
date: 2025-02-10
top: true
recommend: true
cover: /images/cover/vite-template.jpg
references:
  - title: Vite 官方文档
    url: https://vitejs.dev/
  - title: Vue3 官方文档
    url: https://vuejs.org/
  - title: vitepress-theme-ninc
    url: https://example.com/theme-repo
description: 介绍如何从零搭建一个 Vite + Vue3 + TypeScript 的工程模板。
articleGPT: 本文从项目初始化开始，逐步集成 TypeScript、ESLint、Pinia、Vue Router，最终产出一个可复用的工程模板。
---

# 从零搭建 Vite + Vue3 工程模板

正文内容...
```

## 字段在此场景的作用

- **`references`** 是数组，每项必须包含 `title` 与 `url` 两个属性。
- 主题在文章末尾自动渲染「参考资料」区块，按数组顺序列出所有条目，每项渲染为可点击的链接。
- 该字段不替代正文中的行内引用。正文中提到的具体资料仍按 Markdown 链接语法书写，`references` 用于汇总文末的整体参考清单。

`references` 与 [reprint](./reprint.md) 互不冲突：转载文章同时引用了其他资料时，可同时填写两个字段，文章页会分别渲染来源卡片与参考资料区块。

![参考资料区块](/images/article/reference.png)

> 上图展示了文章底部自动渲染的参考资料区块，每项包含标题与链接。


