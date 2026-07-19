# 置顶与推荐

希望某篇文章在列表中靠前展示，或在「推荐文章」区域单独出现时，在标准字段基础上追加 `top` 与 `recommend`。本页说明两个开关的作用、独立与组合使用方式，以及推荐展示位置受主题配置控制的细节。

## 推荐字段组合

标准字段（见[标准文章](./standard.md)）+ `top` / `recommend`

## 完整示例

```md
---
title: Oh My Zsh 安装与命令行高亮配置
tags: [Terminal, zsh]
categories: [经验分享]
date: 2025-01-21
top: true
recommend: true
mainColor: '#6A7DA2'
cover: /images/cover/oh_my_zsh.jpg
description: Oh My Zsh 是一款社区驱动的命令行工具，基于 zsh 提供主题配置与插件机制。
articleGPT: 文章介绍 Oh My Zsh 安装与配置，先讲 zsh 优点，再分 macOS、ubuntu 说明安装方法。
---

# Oh My Zsh 安装与命令行高亮配置

正文内容...
```

## 字段在此场景的作用

- **`top: true`**：让文章在文章列表中排在最前，常用于公告、重要更新。
- **`recommend: true`**：让文章出现在主题的「推荐文章」区域（首页或列表页的推荐位）。
- 两者可独立使用，也可组合使用。只置顶不推荐、只推荐不置顶都可行。

推荐文章的具体展示位置与数量由 `themeConfig` 的推荐规则控制，参考 [主题配置详解](../theme-config.md)。

![置顶文章效果](/images/article/top.png)

> 上图展示了置顶文章的渲染效果，置顶文章会显示在文章列表最前，并带有置顶标识。

---

