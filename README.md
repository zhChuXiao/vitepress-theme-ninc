<p align="center">
  <img src="docs/public/images/avatar.jpg" width="100" height="100" alt="vitepress-theme-ninc" style="border-radius: 20px" />
</p>

<h1 align="center">VitePress Theme Ninc</h1>

<p align="center">
  一个功能丰富的 VitePress 主题 — 开箱即用的博客、文档与工具站。本仓库为 monorepo，包含主题包、示例站点与文档站。
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vitepress-theme-ninc"><img src="https://img.shields.io/npm/v/vitepress-theme-ninc?style=flat-square&color=646cff" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/vitepress-theme-ninc"><img src="https://img.shields.io/npm/dm/vitepress-theme-ninc?style=flat-square" alt="npm downloads" /></a>
  <a href="https://github.com/zhChuXiao/vitepress-theme-ninc/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/vitepress-theme-ninc?style=flat-square" alt="license" /></a>
  <a href="https://github.com/zhChuXiao/vitepress-theme-ninc/stargazers"><img src="https://img.shields.io/github/stars/zhChuXiao/vitepress-theme-ninc?style=flat-square" alt="stars" /></a>
</p>

<p align="center">
  <a href="https://theme.ninc.top">使用文档</a> ·
  <a href="https://blog.ninc.top">在线演示</a> ·
  <a href="https://github.com/zhChuXiao/vitepress-theme-ninc/issues">问题反馈</a>
</p>

---

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/public/images/home-dark.png" />
  <source media="(prefers-color-scheme: light)" srcset="docs/public/images/image-light.png" />
  <img src="docs/public/images/image-light.png" alt="vitepress-theme-ninc 首页预览" width="100%" />
</picture>

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
| **NES 模拟器** | 内置红白机模拟器页面（对，真的能玩） |
| **代码组图标** | 按语言自动配图标 |
| **等等等...** | 更多功能请看 [使用文档](https://theme.ninc.top) |

<details>
<summary>还有这些</summary>

更多功能请看 [使用文档](https://theme.ninc.top)

</details>

## 界面预览

<p align="center">
  <img src="docs/public/images/scrollShowcase/article-light.png" width="49%" alt="文章页" />
  <img src="docs/public/images/scrollShowcase/about-light.png" width="49%" alt="关于页" />
</p>

<p align="center">
  <img src="docs/public/images/scrollShowcase/comments-dark.png" width="49%" alt="评论页" />
  <img src="docs/public/images/scrollShowcase/home-footer-dark.png" width="49%" alt="页脚" />
</p>

## 手动安装

不想用脚手架也行：

在现有的VitePress项目中安装：

```bash
pnpm add vitepress-theme-ninc
```

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-ninc'
export default Theme
```

```ts
// .vitepress/config.mts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from './themeConfig'

export default defineConfig(
  { sitemap: { hostname: 'https://your-site.com' } },
  themeConfig,
)
```

详细的配置说明在 [文档](https://theme.ninc.top) 里，从站点元信息到每个小组件的开关，一共 17 篇配置参考 + 12 篇使用指南。

## 环境要求

- Node.js >= 20
- pnpm >= 9（推荐，npm/yarn 也行）
- VitePress ^1.6.4

## 项目结构

```
├── packages/theme/    主题包源码（发布到 npm 的就是它）
├── docs/               使用文档站点
├── play/               开发调试用的示例站点
├── blog/               我自己的博客（submodule，私有仓库）
└── demo/              另一个示例
```

## 贡献

有想法？有 bug？欢迎提 [Issue](https://github.com/zhChuXiao/vitepress-theme-ninc/issues) 或 PR。


## 致谢

- [VitePress](https://vitepress.dev/) — 底层框架
- [imsyy/vitepress-theme-curve](https://github.com/imsyy/vitepress-theme-curve) — 本主题的前身，感谢 imsyy 的开源
- [Twikoo](https://twikoo.js.org/) — 评论系统
- [APlayer](https://aplayer.js.org/) — 音乐播放器

## License

[MIT](LICENSE) © 2025-present [呢喃Ninc](https://blog.ninc.top)
