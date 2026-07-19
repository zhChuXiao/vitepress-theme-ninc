---
title: 欢迎使用 我的博客！从这里开始你的博客之旅
tags: [公告, 教程]
categories: [随笔笔记]
date: 2026-07-19
top: true
recommend: true
description: 恭喜你成功初始化了 vitepress-theme-ninc 主题！这篇置顶文章帮你快速了解主题的全部功能。
---

# 欢迎使用 我的博客！

恭喜！你已经成功初始化了 **vitepress-theme-ninc** 主题。这是一篇**置顶文章**（`top: true`），会始终显示在文章列表最前方。

## 快速上手

### 1. 创建文章

在 `posts/articles/` 目录下创建新的 `.md` 文件即可发布文章。每篇文章需要在顶部填写 frontmatter：

```yaml
---
title: 文章标题
tags: [标签1, 标签2]
categories: [分类名]
date: 2024-01-01
description: 文章描述（显示在列表和搜索引擎中）
---
```

### 2. 文章排序

- `top: true` — 置顶文章，始终排在最前
- `recommend: true` — 推荐文章，排在置顶之后、普通文章之前
- 不设置 — 按 `date` 降序排列

### 3. 主题配置

编辑 `.vitepress/themeConfig.ts` 定制站点外观：导航栏、侧边栏、页脚、评论等。

## 常用链接

- [全部文章](/pages/archives) — 查看所有文章列表
- [全部分类](/pages/categories) — 按分类浏览
- [全部标签](/pages/tags) — 按标签浏览
- [留言板](/pages/comments) — 给我留言
- [关于本站](/pages/about) — 了解更多

## 下一步

1. 替换 `public/images/` 下的占位图片为自己的头像、Logo、封面
2. 在 `posts/articles/` 目录下创建更多文章
3. 参考[官方文档](https://theme.ninc.top)了解更多配置项

---

::: tip 📚 完整文档
更多配置项、组件用法、写作指南请查阅主题官方文档：<https://theme.ninc.top>
:::
