<p align="center">
  <img src="https://theme.ninc.top/images/avatar.jpg" width="110" height="110" alt="vitepress-theme-ninc" style="border-radius: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.12)" />
</p>

<h1 align="center">VitePress Theme Ninc</h1>

<p align="center">
  <a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=18&pause=1000&color=646cff&center=true&vCenter=true&random=false&width=440&lines=%E5%BC%80%E7%AE%B1%E5%8D%B3%E7%94%A8%E7%9A%84+VitePress+%E4%B8%BB%E9%A2%98;Made+with+%E2%9D%A4+by+%E5%91%A2%E5%96%83Ninc" alt="Typing SVG" /></a>
</p>

<p align="center">
  一个功能丰富的 VitePress 主题 — 开箱即用的博客、文档与工具站。<br />
  配好就能跑，想改哪里就改哪里。
</p>

<p align="center">
  <a href="https://theme.ninc.top" target="_blank">使用文档</a> ·
  <a href="https://blog.ninc.top" target="_blank">在线演示</a> ·
  <a href="https://github.com/zhChuXiao/vitepress-theme-ninc/issues" target="_blank">问题反馈</a> ·
  <a href="https://github.com/zhChuXiao/vitepress-theme-ninc/blob/main/CHANGELOG.md" target="_blank">更新日志</a>
</p>

---

<p align="center">
  <img src="https://img.shields.io/npm/v/vitepress-theme-ninc?style=flat-square&logo=npm&logoColor=white&color=CB3837" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/vitepress-theme-ninc?style=flat-square&logo=npm&logoColor=white&color=CB3837" alt="npm downloads" />
  <img src="https://img.shields.io/npm/l/vitepress-theme-ninc?style=flat-square&logo=opensource&logoColor=white&color=blue" alt="license" />
  <img src="https://img.shields.io/github/stars/zhChuXiao/vitepress-theme-ninc?style=flat-square&logo=github&logoColor=white&color=brightgreen" alt="GitHub stars" />
  <img src="https://img.shields.io/github/issues/zhChuXiao/vitepress-theme-ninc?style=flat-square&logo=github&logoColor=white" alt="GitHub issues" />
  <img src="https://img.shields.io/github/last-commit/zhChuXiao/vitepress-theme-ninc?style=flat-square&logo=github&logoColor=white" alt="last commit" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square&logo=github&logoColor=white" alt="PRs welcome" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.5-42b883?style=flat-square&logo=vuedotjs&logoColor=white" alt="Vue" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/VitePress-1.6.4-646cff?style=flat-square&logo=vitepress&logoColor=white" alt="VitePress" />
  <img src="https://img.shields.io/badge/Vite-5+-646cff?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/pnpm-9+-f69220?style=flat-square&logo=pnpm&logoColor=white" alt="pnpm" />
  <img src="https://img.shields.io/badge/Node.js-%3E%3D20-5fa04e?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
</p>

---

<p align="center">
  <img src="https://theme.ninc.top/images/image-light.webp" alt="首页 - 浅色" />
  <img src="https://theme.ninc.top/images/image-dark.webp" alt="首页 - 深色" />
</p>

## 为什么造这个轮子

用 VitePress 搭文档的人不少，但是搭建博客的人却寥寥无几，毕竟默认主题太素了。市面上的主题要么功能略有残缺，要么改起来费劲。我想要的是一个零基础可配置**装上就能用、不用折腾插件**的主题。

这个主题基于 [imsyy/vitepress-theme-curve](https://github.com/imsyy/vitepress-theme-curve) 二次开发。curve 的底子很好，我在此基础上做了大量重构和扩展：抽成 npm 包、重写配置系统、梳理使用文档、以及加了大量功能和样式，让它真正能开箱即用。

## 三分钟上手

```bash
# 用脚手架创建项目（推荐）
npx vitepress-theme-ninc init

# 跟着提示走：填站点名、选极简 or 完整配置
# 完事之后：
cd your-blog && pnpm install && pnpm dev
```

打开 `http://localhost:5173`，博客跑起来了。想改配置？看 [使用文档](https://theme.ninc.top)，每个字段都有截图和说明。

## 内置的功能

| | |
|---|---|
| **评论系统** | Twikoo，支持表情、图片、邮件通知 |
| **全站搜索** | Algolia DocSearch + 本地搜索双模式 |
| **音乐播放器** | APlayer + MetingJS，挂网易云平台歌单 |
| **AI 文章摘要** | 接入 OpenAI 兼容 API，构建时自动生成摘要 |
| **文章加密** | 密码保护指定文章，HMAC-SHA256 |
| **PWA 离线** | 自动生成 Service Worker，断网也能看 |
| **图片灯箱** | Fancybox，点击放大、缩放、拖拽 |
| **RSS 订阅** | 构建时自动生成 rss.xml |
| **暗色模式** | 跟随系统 + 手动切换，View Transitions 动画 |
| **NES 模拟器** | 内置红白机模拟器页面，init 自带超级马里奥（对，真的能玩） |
| **代码组图标** | 按语言自动配图标 |
| **外链中转** | 自动转换外链为中转页跳转，保护隐私、提升 SEO |
| **装备编年史** | 数据可视化页面，ECharts 驱动 |
| **等等等...** | 更多功能请看 [使用文档](https://theme.ninc.top) |

<details>
<summary>还有这些</summary>

- **首页 Banner + 波浪动画 + 技能图标墙**
- **打赏按钮**（微信 / 支付宝二维码）
- **不蒜子访问量 / 访客数 / 文章阅读量**
- **自定义鼠标光标、Mac 风格卡片、Safari 模拟器**
- **Lottie / GSAP / 三维粒子背景**
- **SVG 雪碧图、Gzip + Brotli 压缩**
- **Vue API 与组件全自动导入**
- **组件 Demo 插件、代码定位（Alt+Shift 点击跳源码）**
- **TypeScript 类型完备，配置项有完整提示**

更多功能请看 [使用文档](https://theme.ninc.top)

</details>

## 界面预览

### 文章页 & 关于页

<p align="center">
  <img src="https://theme.ninc.top/images/scrollShowcase/article-light.png" width="49%" alt="文章页 - 浅色" />
  <img src="https://theme.ninc.top/images/scrollShowcase/about-light.png" width="49%" alt="关于页 - 浅色" />
</p>

### 归档页 & 评论页

<p align="center">
  <img src="https://theme.ninc.top/images/scrollShowcase/archives-light.png" width="49%" alt="归档页 - 浅色" />
  <img src="https://theme.ninc.top/images/scrollShowcase/comments-dark.png" width="49%" alt="评论页 - 深色" />
</p>

### 页脚 & 装备页

<p align="center">
  <img src="https://theme.ninc.top/images/scrollShowcase/home-footer-light.png" width="49%" alt="页脚 - 浅色" />
  <img src="https://theme.ninc.top/images/scrollShowcase/equipment-dark.png" width="49%" alt="装备页 - 深色" />
</p>

## 手动安装

不想用脚手架也行，在现有的 VitePress 项目中安装：

```bash
pnpm add vitepress-theme-ninc
# 或
npm install vitepress-theme-ninc
# 或
yarn add vitepress-theme-ninc
```

`.vitepress/theme/index.ts`：

```ts
import Theme from 'vitepress-theme-ninc'
export default Theme
```

`.vitepress/config.mts`：

```ts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from './themeConfig'

export default defineConfig(
  { sitemap: { hostname: 'https://your-site.com' } },
  themeConfig,
)
```

`.vitepress/themeConfig.ts`（最小配置）：

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  siteMeta: {
    title: 'My Blog',
    description: 'powered by ninc',
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
| `npx vitepress-theme-ninc summary` | 本地预生成 AI 摘要到缓存文件 |
| `npx vitepress-theme-ninc init-proxy` | 生成 AI 摘要运行时代理脚手架（Cloudflare / Vercel） |

后两条也可在 `init` 生成的项目里通过 `pnpm run summary` / `pnpm run init-proxy` 调用。完整用法见 [CLI 文档](https://theme.ninc.top/guide/cli)。

## 包导出

| 子路径 | 用途 |
| --- | --- |
| `vitepress-theme-ninc` | 主题入口（默认导出 Theme 对象） |
| `vitepress-theme-ninc/defineConfig` | VitePress 配置工厂 |
| `vitepress-theme-ninc/defineThemeConfig` | 主题配置工厂（defu 深合并） |
| `vitepress-theme-ninc/node` | Node 侧工具聚合 |
| `vitepress-theme-ninc/utils` | Node 侧 utils（getAllPosts 等） |
| `vitepress-theme-ninc/views` | 客户端视图组件（NesGame 等） |
| `vitepress-theme-ninc/components` | 客户端组件 |
| `vitepress-theme-ninc/store` | Pinia store |
| `vitepress-theme-ninc/styles` | 全局样式入口（scss） |
| `vitepress-theme-ninc/types` | TypeScript 类型声明 |

## 环境要求

- Node.js >= 20
- pnpm >= 9（推荐，npm/yarn 也行）
- VitePress ^1.6.4
- Vue ^3.5.0

## 文档

完整文档在 [theme.ninc.top](https://theme.ninc.top)：

- [使用指南](https://theme.ninc.top/guide/getting-started) — 从安装到部署的完整流程
- [配置参考](https://theme.ninc.top/config/site-meta) — 所有配置项的字段说明
- [组件总览](https://theme.ninc.top/components/overview) — 内置组件一览
- [FAQ](https://theme.ninc.top/faq) — 常见问题与坑

想看实际效果，[作者博客](https://blog.ninc.top) 就是这个主题在跑。

## 技术架构

几个关键决定：

- **直接发布源码**：不预构建，VitePress 在用户项目通过 Vite 处理 `.ts / .mjs / .vue`。主题入口面向 VitePress / Vite 构建链，不支持在纯 Node.js 20 里直接执行源码。
- **defu 深合并**：用 `defu` 替代 `Object.assign`，嵌套配置不会被整体覆盖，用户只填想改的字段就行。
- **双工厂函数**：`defineConfig` 管 VitePress 配置，`defineThemeConfig` 管主题配置，两边解耦。
- **patch-package**：对 `nes-vue` 的运行时补丁通过 `postinstall` 自动应用，安装即可使用 NES 模拟器。

## 反馈与贡献

遇到问题：

- 先翻 [FAQ](https://theme.ninc.top/faq) 和 [Issues](https://github.com/zhChuXiao/vitepress-theme-ninc/issues?q=is%3Aissue)
- 没找到答案就[提个 Issue](https://github.com/zhChuXiao/vitepress-theme-ninc/issues/new)，贴上复现步骤和配置文件

欢迎 PR，大的改动建议先开 Issue 讨论一下方向再动手。

## 致谢

- [VitePress](https://vitepress.dev/) — 底层框架
- [imsyy/vitepress-theme-curve](https://github.com/imsyy/vitepress-theme-curve) — 本主题的前身，感谢 imsyy 的开源
- [Twikoo](https://twikoo.js.org/) — 评论系统
- [APlayer](https://aplayer.js.org/) — 音乐播放器
- [nes-vue](https://github.com/huangye217/nes-vue) — NES 模拟器组件

## License

[MIT](./LICENSE) © 2023-present [呢喃Ninc](https://blog.ninc.top)
