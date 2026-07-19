# 介绍

> 想拥有一个属于自己的博客？不需要懂很多代码，`vitepress-theme-ninc` 帮你搞定。

## 这是什么

`vitepress-theme-ninc` 是一个基于 [VitePress](https://vitepress.dev/) 的博客主题。简单来说，它是一套「开箱即用」的博客模板 —— 你安装它、写文章，就能得到一个功能完整、外观漂亮的博客网站。

**你不需要关心**：Vite 插件配置、Markdown 扩展、SSR 兼容、PWA 缓存策略、RSS 生成……这些底层细节主题都帮你处理好了。

**你只需要关心**：写文章、配导航栏、选个喜欢的颜色。

## 它能做什么

| 功能 | 说明 |
|------|------|
| <Icon icon="lucide:message-circle" /> **评论系统** | 内置 Twikoo，访客可以留言互动 |
| <Icon icon="lucide:search" /> **全站搜索** | Algolia 驱动，毫秒级全文检索 |
| <Icon icon="lucide:smartphone" /> **PWA 离线** | 支持离线访问，可安装到手机桌面 |
| <Icon icon="lucide:music" /> **音乐播放器** | 在文章或侧边栏插入音乐卡片 |
| <Icon icon="lucide:image" /> **图片灯箱** | 点击图片自动放大，支持相册浏览 |
| <Icon icon="lucide:rss" /> **RSS 订阅** | 自动生成 RSS，读者可订阅更新 |
| <Icon icon="lucide:link" /> **外链中转** | 保护隐私，提升 SEO |
| <Icon icon="lucide:moon" /> **暗色模式** | 一键切换，跟随系统偏好 |
| <Icon icon="lucide:sparkles" /> **丰富动画** | 首页曲线、页面切换流畅动效 |
| <Icon icon="lucide:puzzle" /> **自动导入** | Vue API 和组件全自动导入，无需手写 import |
| <Icon icon="lucide:tag" /> **代码组图标** | 代码块自动匹配语言图标 |
| <Icon icon="lucide:file-archive" /> **Gzip+Brotli** | 构建产物双重压缩，极致性能 |
| <Icon icon="lucide:search" /> **点击定位** | 开发时点击页面元素直达源码 |

## 功能预览

下图展示了**配置完善后**的博客首页效果，帮助你了解主题能达到的最终视觉效果。

![配置完善后的效果](/images/home-dark.png)

下图展示了**最基础**的博客首页效果，无任何配置时，主题默认渲染效果如下：

![最基础的默认效果](/images/article/home-dark-init.png)

::: tip 在线预览
想看实际运行效果？访问 [blog.ninc.top](https://blog.ninc.top) 体验完整的博客站点。
:::

## 适合谁用

- **想写博客但不想从零开发的人** — 安装即用，专注写作
- **有前端基础想定制的人** — 全部配置开放，组件可覆盖
- **正在用 VitePress 默认主题的人** — 无缝迁移，功能升级

## 它长什么样

本主题提供了一套完整的示例站点（play），包含首页、文章列表、分类、标签、归档、关于、留言板、友链、工具页等全部页面类型。你可以把它当作参考模板，也可以直接复制来修改。

::: tip 想先看看效果？
你可以直接访问 [blog.ninc.top](https://blog.ninc.top) 在线预览主题实际效果，或者跳到 [从零开始](./quick-start.md) 跟着教程走，5 分钟就能在本地看到效果。
:::

## 环境要求

在开始之前，请确保你的电脑装了这些工具：

| 工具 | 最低版本 | 用途 | 安装方式 |
|------|---------|------|---------|
| [Node.js](https://nodejs.org/) | ≥ 20 | 运行 VitePress + npx 初始化 | 官网下载 LTS 版 |
| [pnpm](https://pnpm.io/) | ≥ 9 | 安装依赖（推荐，也可用 npm） | `npm install -g pnpm` |
| [VS Code](https://code.visualstudio.com/) | 任意 | 编辑代码和文章 | 官网下载（推荐） |

::: tip 只装了 Node.js 就能开始
`npx` 随 Node.js 自带，运行 `npx vitepress-theme-ninc init` 无需提前安装 pnpm 或任何依赖。初始化完成后，依赖安装用 `npm install` 也可以，不一定非要 pnpm。
:::

::: details 不确定是否已安装？在终端运行：
```bash
node -v   # 应显示 v20.x.x 或更高
pnpm -v   # 应显示 9.x.x 或更高（没有也能用 npm 代替）
```

如果 pnpm 未安装：
```bash
npm install -g pnpm
```
:::

## 核心概念（30 秒理解）

本主题只有两个核心概念，理解了它们就能上手：

### 1. `defineConfig` — 「怎么构建」

放在 `.vitepress/config.mts` 中，负责工程层配置：注入 Vite 插件、Markdown 扩展、PWA、RSS 等。你通常只需要写几行代码：

```ts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from '../themeConfig'

export default defineConfig({}, themeConfig)
```

### 2. `defineThemeConfig` — 「长什么样」

放在 `themeConfig.ts` 中，负责外观和功能配置：站点标题、导航栏、评论、搜索、侧边栏等。你只需要填写想自定义的字段，其余自动使用默认值：

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  siteMeta: {
    title: '我的博客',
    description: '记录生活与技术'
  }
  // 其他字段按需添加，不填就用默认值
})
```

::: tip 一句话总结
`defineConfig` 决定「怎么构建」，`defineThemeConfig` 决定「长什么样、有什么功能」。
:::
