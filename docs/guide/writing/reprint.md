# 转载文章

转载他人文章时，通过 `reprint` 字段标注原文信息，文章页会显示转载来源卡片。本页说明 `reprint` 对象的四个子字段含义、来源卡片的渲染效果，以及与正文展示的关系。

## 推荐字段组合

`title` / `date` / `reprint`

## 完整示例

```md
---
title: 安装 oh-my-zsh 配置命令行高亮
tags: [转载内容]
categories: [转载内容]
date: 2024-03-11
reprint:
  title: 安装oh-my-zsh，配置命令行高亮
  desc: CSDN
  url: https://example.com/original-article
  icon: /svg/csdn.svg
cover: /images/cover/reprint-cover.jpg
description: 转载自 CSDN 的 oh-my-zsh 配置教程。
articleGPT: 本文转载介绍 oh-my-zsh 安装与命令行高亮配置方法。
---

# 安装 oh-my-zsh 配置命令行高亮

正文内容...
```

## 字段在此场景的作用

`reprint` 是一个对象，包含四个子字段：

| 子字段 | 说明 | 示例 |
| --- | --- | --- |
| `title` | 原文标题 | `安装oh-my-zsh，配置命令行高亮` |
| `desc` | 来源平台简称 | `CSDN`、`掘金`、`GitHub` |
| `url` | 原文链接 | `https://example.com/original-article` |
| `icon` | 来源图标路径（可选） | `/svg/csdn.svg` |

`icon` 为可选字段，不设置时来源卡片仅显示文字。图标文件放在 `public/svg/` 下，路径以 `/svg/` 开头。

转载文章的正文仍按普通文章渲染，`reprint` 只在文章页顶部追加来源卡片，不影响列表、归档、分类与标签的展示。

![转载文章来源卡片](/images/article/reprint.png)

> 上图展示了转载文章顶部显示的来源卡片，包含原文标题、来源平台与原文链接。


