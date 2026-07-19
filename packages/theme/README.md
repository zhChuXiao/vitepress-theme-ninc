# vitepress-theme-ninc

> 一个把 VitePress 包装成完整博客 / 文档站的主题，作者 [呢喃Ninc](https://blog.ninc.top)。

[![npm version](https://img.shields.io/npm/v/vitepress-theme-ninc?style=flat-square&color=3c8772)](https://www.npmjs.com/package/vitepress-theme-ninc)
[![npm downloads](https://img.shields.io/npm/dm/vitepress-theme-ninc?style=flat-square&color=3c8772)](https://www.npmjs.com/package/vitepress-theme-ninc)
[![license](https://img.shields.io/npm/l/vitepress-theme-ninc?style=flat-square&color=3c8772)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/zhChuXiao/vitepress-theme-ninc?style=flat-square&color=3c8772)](https://github.com/zhChuXiao/vitepress-theme-ninc)
[![GitHub issues](https://img.shields.io/github/issues/zhChuXiao/vitepress-theme-ninc?style=flat-square&color=3c8772)](https://github.com/zhChuXiao/vitepress-theme-ninc/issues)
[![last commit](https://img.shields.io/github/last-commit/zhChuXiao/vitepress-theme-ninc?style=flat-square&color=3c8772)](https://github.com/zhChuXiao/vitepress-theme-ninc/commits)
[![node](https://img.shields.io/node/v/vitepress-theme-ninc?style=flat-square&color=3c8772)](https://nodejs.org)
[![VitePress](https://img.shields.io/badge/VitePress-%5E1.6.4-646cff?style=flat-square)](https://vitepress.dev)
[![Vue](https://img.shields.io/badge/Vue-%5E3.5.0-42b883?style=flat-square)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square)](https://www.typescriptlang.org)

## 为什么有这个主题

VitePress 本身是个文档工具，拿来写博客要自己补不少东西：封面、评论、搜索、RSS、阅读量、AI 摘要、音乐播放器……每次都重写一遍没意思。这个主题把这些都打包好了，配好就能跑，想改哪里就改哪里。

适合的人：

- 想用 VitePress 写博客但不想从零搭
- 喜欢现成的评论 / 搜索 / 统计 / AI 摘要
- 能接受 TypeScript + Vue 3 + pnpm 这套技术栈

不适合的人：

- 想要极简到只有 Markdown 渲染的（直接用 VitePress 默认主题就行）
- 要兼容老浏览器 / IE 的（主题用了现代 CSS 和 ESM）

## 它能做什么

**内容相关**

- 文章 / 页面 / 归档 / 分类 / 标签 / 关于 / 友链 / 留言板 / 项目 / 装备，常用页面都内置
- Frontmatter 支持置顶、推荐、加密、转载、参考资料、过期提醒
- 自动生成 RSS、sitemap、外链中转页

**互动功能**

- Twikoo 评论（带评论数统计）
- Algolia DocSearch 全站搜索
- 不蒜子访问量 / 访客数 / 文章阅读量
- 打赏按钮（微信 / 支付宝）

**视觉与体验**

- 明暗模式切换（带 View Transitions 动画）
- 首页 Banner + 波浪动画 + 技能图标墙
- 图片灯箱（Fancybox）、代码折叠、代码组图标
- Lottie / GSAP / 三维粒子背景，想用就用
- 自定义鼠标光标、Mac 风格卡片、Safari 模拟器

**AI 文章摘要**

- 构建期生成：DeepSeek / OpenAI / Anthropic / 智谱 / 通义千问 任选
- 运行时代理：浏览器流式逐字输出，API Key 不进前端
- CLI 工具本地预生成，构建零耗时

**工程化**

- Vue API 与组件全自动导入
- SVG 雪碧图、PWA 离线、Gzip + Brotli 压缩
- 组件 Demo 插件、代码定位（Alt+Shift 点击跳源码）
- TypeScript 类型完备，配置项有完整提示

## 快速开始

只要 Node.js ≥ 20，不用提前建 `package.json`：

```bash
mkdir my-blog && cd my-blog
npx vitepress-theme-ninc init    # 交互式生成全部文件
pnpm install
pnpm dev
```

浏览器打开 `http://localhost:5173` 就能看到博客了。

## 配置入口

三个文件搞定，详细字段看[文档站](https://theme.ninc.top)。

`.vitepress/config.mts`：

```ts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from './themeConfig'

export default defineConfig({}, themeConfig, {})
```

`.vitepress/theme/index.ts`：

```ts
import Theme from 'vitepress-theme-ninc'

export default Theme
```

`.vitepress/themeConfig.ts`（最小配置）：

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  siteMeta: {
    title: 'My Blog',
    description: 'A blog powered by vitepress-theme-ninc',
    site: 'https://example.com',
    avatar: '/images/avatar.png',
    lang: 'zh-CN',
    author: {
      name: 'Your Name',
      email: 'you@example.com'
    }
  }
})
```

写一篇文章（`posts/hello.md`）：

```markdown
---
title: Hello World
tags: [随笔]
categories: [公告]
date: 2026-07-09
description: 我的第一篇文章
---

# Hello World

这是使用 vitepress-theme-ninc 搭建的博客的第一篇文章。
```

## CLI 命令

主题自带三个命令行工具：

| 命令 | 干什么 |
| --- | --- |
| `npx vitepress-theme-ninc init` | 从零生成一个完整的博客项目 |
| `pnpm run summary` | 本地预生成 AI 摘要到缓存文件 |
| `pnpm run init-proxy` | 生成 AI 摘要运行时代理脚手架（Cloudflare / Vercel） |

后两条需要先 `init` 生成项目（`package.json` 里自带这两个脚本）。完整用法见 [CLI 文档](https://theme.ninc.top/guide/cli)。

## 包导出

| 子路径 | 用途 |
| --- | --- |
| `vitepress-theme-ninc` | 主题入口（默认导出 Theme 对象） |
| `vitepress-theme-ninc/defineConfig` | VitePress 配置工厂 |
| `vitepress-theme-ninc/defineThemeConfig` | 主题配置工厂（defu 深合并） |
| `vitepress-theme-ninc/node` | Node 侧工具聚合 |
| `vitepress-theme-ninc/utils` | Node 侧 utils（getAllPosts 等） |
| `vitepress-theme-ninc/styles` | 全局样式入口（scss） |
| `vitepress-theme-ninc/types` | TypeScript 类型声明 |

## 环境要求

- Node.js >= 20
- pnpm >= 9
- VitePress ^1.6.4
- Vue ^3.5.0

## 文档

完整文档在 [theme.ninc.top](https://theme.ninc.top)，仓库里对应 `docs/` 目录：

- [使用指南](https://theme.ninc.top/guide/getting-started) — 从安装到部署的完整流程
- [配置参考](https://theme.ninc.top/config/site-meta) — 所有配置项的字段说明
- [组件总览](https://theme.ninc.top/components/overview) — 内置组件一览
- [FAQ](https://theme.ninc.top/faq) — 常见问题与坑

想看实际效果，[作者博客](https://blog.ninc.top)就是这个主题在跑。

## 技术架构

几个关键决定：

- **直接发布源码**：不预构建，VitePress 在用户项目通过 Vite 处理 `.ts / .mjs / .vue`。主题入口面向 VitePress / Vite 构建链，不支持在纯 Node.js 20 里直接执行源码。
- **defu 深合并**：用 `defu` 替代 `Object.assign`，嵌套配置不会被整体覆盖，用户只填想改的字段就行。
- **双工厂函数**：`defineConfig` 管 VitePress 配置，`defineThemeConfig` 管主题配置，两边解耦。
- **monorepo**：`packages/theme`（主题包）+ `demo`（示例站）+ `docs`（文档站），都在同一个仓库里。

## 反馈与贡献

遇到问题：

- 先翻 [FAQ](https://theme.ninc.top/faq) 和 [Issues](https://github.com/zhChuXiao/vitepress-theme-ninc/issues?q=is%3Aissue)
- 没找到答案就[提个 Issue](https://github.com/zhChuXiao/vitepress-theme-ninc/issues/new)，贴上复现步骤和配置文件

欢迎 PR，大的改动建议先开 Issue 讨论一下方向再动手。

## License

[MIT](./LICENSE) © 2023-present [呢喃Ninc](https://blog.ninc.top)
