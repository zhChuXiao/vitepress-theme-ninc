# 标准文章

最常见的博客文章写法：一篇技术分享或经验总结，需要出现在文章列表、归档、分类与标签中，并且有封面、描述、摘要。本页给出标准技术文章的完整 frontmatter 示例，并说明 `tags`/`categories` 与 `description`/`articleGPT` 两组易混字段的区别。

## 推荐字段组合

`title` / `date` / `tags` / `categories` / `description` / `articleGPT` / `cover` / `mainColor`

## 完整示例

```md
---
title: Vue3 Composition API 完全指南
tags: [Vue, 前端, Composition API]
categories: [前端开发]
date: 2024-03-15
mainColor: '#dda3bf'
cover: /images/cover/vue3-cover.jpg
description: 全面介绍 Vue3 Composition API 的核心概念，包括 setup、ref、reactive、computed、watch 等。
articleGPT: 本文系统性地介绍了 Vue3 Composition API 的核心用法，从 setup 函数、响应式数据到生命周期钩子，配合代码示例帮助开发者从 Options API 平滑过渡。
---

# Vue3 Composition API 完全指南

正文内容...
```

## 字段在此场景的作用

- **`tags` 与 `categories` 的区别**：`tags` 是关键词，粒度较细（如 `Vue`、`Composition API`、`ref`）；`categories` 是大类，粒度较粗（如 `前端开发`、`经验分享`）。一篇文章通常有多个标签、一个分类。两者都支持数组 `[Vue, CSS]` 或多行写法。
- **`description` 与 `articleGPT` 的区别**：`description` 用于 SEO meta、文章列表卡片与社交分享卡片，不显示在文章正文区域；`articleGPT` 显示在文章页顶部作为摘要。未填写 `articleGPT` 时回退到 `description`。两者都填写能让列表卡片与文章页摘要各司其职。

::: tip articleGPT 的命名由来
字段名含「GPT」只是模仿 AI 生成摘要的展示样式，摘要内容默认需手动填写。如需接入大模型自动生成摘要，可直接开启主题内置的 [aiSummary AI 文章摘要](../../config/ai-summary.md)，无需修改主题源码。
:::

- **`cover`**：封面图路径。未设置时，主题从 `themeConfig` 的 `cover.showCover.defaultCover` 列表中随机选取一张。
- **`mainColor`**：封面渐变背景主色，控制列表卡片与封面的色调。值以 `#` 开头时需用单引号包裹，否则 YAML 会将其解析为注释：

  ```yaml
  # 正确
  mainColor: '#dda3bf'
  # 错误：会被解析为注释
  mainColor: #dda3bf
  ```
