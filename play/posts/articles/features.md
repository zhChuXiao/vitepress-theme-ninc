---
title: 我的博客 的功能特性一览
tags: [功能, 介绍]
categories: [随笔笔记]
date: 2026-07-12
recommend: true
description: 了解 vitepress-theme-ninc 主题的丰富功能：暗色模式、文章加密、RSS、PWA、评论、搜索等。
---

# 我的博客 的功能特性一览

这是一篇**推荐文章**（`recommend: true`），会排在置顶文章之后、普通文章之前。

## 核心功能

### 暗色模式

主题内置暗色模式切换，点击导航栏的太阳/月亮图标即可切换。切换动画使用 View Transitions API，体验丝滑。

### 文章系统

- 支持 Markdown 编写
- 自动生成文章列表、分类页、标签页
- 支持置顶 (`top: true`) 和推荐 (`recommend: true`)
- 自动统计字数、阅读时间、图片数量
- 支持文章封面、分类、标签
- 支持下一篇、相关文章推荐

### RSS 订阅

构建时自动生成 `rss.xml`，读者可以通过 RSS 阅读器订阅你的博客。

### Sitemap

构建时自动生成 `sitemap.xml`，帮助搜索引擎索引你的站点。

### PWA 离线缓存

支持 PWA，安装后可离线访问已缓存的页面。

### 评论系统

支持 Twikoo 评论系统，配置 `comment.twikoo.envId` 即可启用。

### 文章加密

在 frontmatter 中添加 `crypto: { enable: true, password: '密码' }` 即可创建加密文章。

### 外链中转

外部链接自动通过中转页面跳转，防止权重流失。

### 图片灯箱

点击图片自动放大查看，支持键盘导航和触摸滑动。

## 页面一览

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 文章列表 |
| 全部文章 | `/pages/archives` | 按时间归档 |
| 全部分类 | `/pages/categories` | 分类总览 |
| 全部标签 | `/pages/tags` | 标签云 |
| 留言板 | `/pages/comments` | 站点留言 |
| 赞赏名单 | `/pages/thanks` | 赞赏者名单 |
| 关于本站 | `/pages/about` | 站点介绍 |

---

::: tip 📚 完整文档
更多功能介绍、配置项、组件用法请查阅主题官方文档：<https://theme.ninc.top>
:::
