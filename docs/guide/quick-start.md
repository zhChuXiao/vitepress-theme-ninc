# 从零开始：5 分钟搭建你的博客

> 不要被「配置主题」吓到 —— 本教程会逐步带你完成每一步。即使你从未接触过代码，只要跟着操作，也能拥有一个功能完整的博客。

## 你将获得什么

完成本教程后，你将拥有：

- <Icon icon="lucide:home" /> 一个漂亮的博客首页（自带文章列表、动画效果）
- <Icon icon="lucide:file-text" /> 一篇可以正常访问的文章
- <Icon icon="lucide:moon-star" /> 明暗主题一键切换
- <Icon icon="lucide:smartphone" /> 手机/电脑自适应布局
- <Icon icon="lucide:message-circle" /> 评论系统（可选）
- <Icon icon="lucide:search" /> 全站搜索（可选）

下面从准备工具开始。

---

## 快速初始化（推荐）

只需安装 [Node.js](https://nodejs.org/)（≥ 20），无需提前手动创建 `package.json` 或安装任何依赖 —— 主题内置的交互式初始化命令会一键生成全部文件（含 `package.json`、配置文件、示例文章、占位图）。

### 1. 创建空目录

```bash
mkdir my-blog && cd my-blog
```

### 2. 运行初始化命令

```bash
npx vitepress-theme-ninc init
```

命令会以交互方式（↑↓ 箭头选择）询问初始化模式、站点标题、描述、URL、作者等信息，并自动生成以下文件：

```text
my-blog/
├─ .vitepress/
│  ├─ config.mts          ← 站点配置（已注入 defineConfig）
│  ├─ theme/
│  │  └─ index.ts         ← 主题入口
│  └─ themeConfig.ts      ← 主题配置（含你输入的站点信息）
├─ posts/
│  └─ articles/
│     └─ hello-world.md   ← 示例文章
├─ public/
│  ├─ images/
│  │  ├─ avatar.svg       ← 占位头像
│  │  ├─ logo.svg         ← 占位 Logo
│  │  └─ cover.svg        ← 占位封面
│  └─ favicon.svg         ← 站点图标
├─ index.md               ← 首页
└─ package.json           ← 含 dev/build/preview 脚本与全部依赖
```

![command-line](/images/ninc-init.png)

### 3. 安装依赖并启动

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:5173/` 即可看到博客页面。

::: tip 没有 pnpm？
`npx` 随 Node.js 自带，无需额外安装。依赖安装也可用 `npm install`，启动用 `npm run dev`。若想使用 pnpm，执行 `npm install -g pnpm` 即可。
:::

::: tip 已经有 VitePress 项目？
在已有项目根目录直接运行 `npx vitepress-theme-ninc init` 即可。命令会检测已存在的文件并询问是否覆盖，不会静默损坏你的配置。
:::

---

<div class="migration-banner">
  <div class="migration-icon"><Icon icon="lucide:route" /></div>
  <div class="migration-body">
    <span class="migration-label">可选路径 · 已有项目</span>
    <h2>已有 VitePress 文档？手动接入</h2>
    <p>无需重新脚手架，在已有项目上追加主题依赖、复制配置项即可平滑迁移。如果你用 <code>init</code> 创建了新项目，可跳过下面的分步教程。</p>
  </div>
</div>

---

## 第一步：准备工具（只需做一次）

就像做饭需要锅碗瓢盆，写博客也需要一些基础工具。下面的工具只需安装一次，以后就不用再装了。

### 1.1 安装 Node.js

Node.js 是运行 JavaScript 代码的环境，VitePress 依赖它。

1. 打开 [Node.js 官网](https://nodejs.org/)
2. 下载 **LTS（长期支持版）**，版本号需要 ≥ 20
3. 双击安装包，一路点「下一步」即可
4. 验证安装：打开**终端**（Mac 在「启动台」搜「终端」；Windows 按 `Win+R` 输入 `cmd`），输入：

```bash
node -v
```

如果显示类似 `v20.18.0`，说明安装成功 :done:

### 1.2 安装 pnpm

pnpm 是一个包管理器，用来安装各种代码库。Node.js 自带 npm，可以用它来安装 pnpm。

在终端输入：

```bash
npm install -g pnpm
```

验证安装：

```bash
pnpm -v
```

显示类似 `10.33.0` 这种版本号即成功 :done:

### 1.3 安装代码编辑器

推荐使用 [VS Code](https://code.visualstudio.com/)（免费），下载后一路下一步安装即可。如果你有一定的编程基础，也可以选择 [Cursor](https://cursor.com/) 等 AI 辅助编程工具。

::: tip 什么是终端？
终端就是用文字操作电脑的工具。别害怕，本教程中你只需要复制粘贴命令即可。
- **Mac**：在「启动台」搜索「终端」并打开
- **Windows**：按 `Win + R`，输入 `cmd`，回车
:::

---

## 第二步：创建博客项目

### 2.1 创建项目

在终端中，先切换到你想存放博客的文件夹（比如桌面）：

```bash
# Mac
cd ~/Desktop

# Windows
cd %USERPROFILE%\Desktop
```

然后运行以下命令创建项目（把 `my-blog` 换成你想要的名字）：

```bash
mkdir my-blog && cd my-blog
pnpm add -D vitepress
pnpm vitepress init
```

按提示操作：
- **Language** → 选择 `zh-CN`（中文）
- 其他选项回车使用默认值即可

### 2.2 进入项目并安装依赖

```bash
cd my-blog
pnpm install
```

等待片刻，终端会下载必要的文件。完成后你会看到项目结构如下：

```text
my-blog/
├─ .vitepress/
│  ├─ config.mts       ← 站点配置文件
│  └─ theme/
│     └─ index.ts      ← 主题入口文件
├─ index.md            ← 首页文件
├─ package.json
└─ pnpm-lock.yaml
```

::: tip 不懂这些文件是干什么的？
没关系！你只需要知道：
- `config.mts` 是「总配置」，控制站点的基本行为
- `theme/index.ts` 是「主题入口」，决定站点长什么样
- `index.md` 是「首页内容」
:::

---

## 第三步：安装本主题

现在你的项目使用的是 VitePress 默认主题。我们来换成 `vitepress-theme-ninc`。

### 3.1 安装主题包

在终端（确保还在 `my-blog` 目录下）运行：

```bash
pnpm add vitepress-theme-ninc
```

### 3.2 替换主题入口

用 VS Code 打开项目文件夹，找到 `.vitepress/theme/index.ts`，把内容**全部替换**为：

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-ninc'

export default Theme
```

这一步的意思是：「我的博客要用 vitepress-theme-ninc 这个主题」。

### 3.3 替换站点配置

找到 `.vitepress/config.mts`，把内容**全部替换**为：

```ts
// .vitepress/config.mts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from './themeConfig'

export default defineConfig(
  // 这里可以覆盖 VitePress 的默认配置
  {},
  // 主题配置（外观、功能等）
  themeConfig
)
```

::: tip defineConfig 是什么？
这是本主题提供的配置工厂。它会在后台帮你处理所有复杂的事情：
- 自动注入 Vite 插件（压缩、PWA、SVG 图标等）
- 自动配置 Markdown 扩展（代码组图标、组件 Demo 等）
- 自动生成 RSS 订阅源和站点地图

你只需要写这两行代码，剩下的交给主题处理。
:::

---

## 第四步：配置博客信息

### 4.1 创建主题配置文件

在 `.vitepress/` 目录下（与 `config.mts` 同级）创建一个新文件，命名为 `themeConfig.ts`，写入以下内容：

```ts
// .vitepress/themeConfig.ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  // 站点基本信息
  siteMeta: {
    title: '我的博客',              // ← 改成你的博客名
    description: '记录生活与技术',    // ← 改成你的博客描述
    site: 'https://example.com',    // ← 改成你的域名（没有就先写这个）
    avatar: '',                     // ← 头像路径（可以先留空）
    logo: ''                        // ← Logo 路径（可以先留空）
  }
})
```

::: warning themeConfig.ts 放在 .vitepress/ 下
本主题约定 `themeConfig.ts` 与 `config.mts` 同放在 `.vitepress/` 目录中，`config.mts` 里用 `import { themeConfig } from './themeConfig'` 引入。这也是官方 `blog/` 的组织方式，便于 `page/[num].paths.mjs` 等动态路由用相对路径 `../.vitepress/themeConfig.ts` 读取 `postSize` 等字段。若放在项目根目录，分页等动态路由将无法引用。
:::

::: tip 不懂 TypeScript？
没关系！你只需要把引号里的中文改成你自己的信息就行。其他部分照抄即可。
:::

### 4.2 准备静态资源（推荐）

主题允许 `avatar`、`logo` 暂时留空，因此不影响启动；但加载页、首页横幅、PWA 图标与 SVG 图标需要你提供对应文件。建议先准备以下目录：

```text
public/
├─ images/
│  ├─ avatar.png             ← siteMeta.avatar
│  ├─ logo.png               ← siteMeta.logo
│  └─ cxLogo/
│     ├─ favicon-32x32.webp  ← PWA 图标
│     ├─ favicon-96x96.webp
│     ├─ favicon-256x256.webp
│     └─ favicon-512x512.webp
└─ svg/                      ← SvgIcon 雪碧图源文件
```

配置示例：

```ts
siteMeta: {
  // ...
  avatar: '/images/avatar.png',
  logo: '/images/logo.png'
}
```

::: warning 留空时的表现
`avatar: ''` / `logo: ''` 适合首次验证启动，但部分 `<img>` 仍可能向当前页面发起空地址请求，首页推荐横幅也不会显示图片。正式上线前请补齐资源。若不需要 PWA，可在 `.vitepress/config.mts` 的第三参数中设置 `{ pwa: false }`，这样无需准备 PWA 图标。
:::

### 4.3 创建首页

找到项目根目录的 `index.md`，替换为：

```md
---
layout: home
---
```

就这一行。首页的具体内容（文章列表、侧边栏等）由主题自动渲染，你不需要手动写。

---

## 第五步：写第一篇文章

### 5.1 创建文章目录

在项目根目录创建 `posts` 文件夹：

```bash
mkdir posts
```

### 5.2 创建第一篇文章

在 `posts` 文件夹中创建 `hello.md`，写入：

```md
---
title: 你好，世界
date: 2024-01-01
description: 这是我的第一篇博客文章。
tags:
  - 随笔
categories:
  - 开始
---

# 你好，世界

欢迎来到我的博客！

## 这是正文

你可以在这里写任何你想写的内容。支持所有 Markdown 语法：

- 列表项一
- 列表项二
- 列表项三

**粗体文字**、*斜体文字*、`行内代码` 都支持。

代码块也没问题：

```js
console.log('Hello from my blog!')
```

享受写作吧！
```

写完文章后启动 `pnpm dev`，第一篇文章在博客中长这样：

![第一篇文章在博客中的展示](/images/scrollShowcase/article-light.png)

::: tip 什么是 Markdown？
Markdown 是一种简单的排版语法，用符号来表示格式：
- `#` 表示标题（`#` 一级标题，`##` 二级标题）
- `-` 表示列表项
- `**文字**` 表示粗体
- `*文字*` 表示斜体
- `` `代码` `` 表示行内代码

花 5 分钟看一篇 [Markdown 教程](https://markdown.com.cn/) 就能掌握。
:::

### 5.3 文章的 frontmatter 是什么？

文章开头 `---` 之间的部分叫 **frontmatter**（前置信息），用来告诉主题这篇文章的元数据：

| 字段 | 作用 | 必填 |
|------|------|------|
| `title` | 文章标题，显示在文章页和列表中 | :done: 建议 |
| `date` | 发布日期，决定文章排序 | :done: 建议 |
| `description` | 文章描述，显示在列表和搜索引擎中 | 可选 |
| `tags` | 标签，用于标签页分类 | 可选 |
| `categories` | 分类，用于分类页归类 | 可选 |
| `cover` | 封面图路径 | 可选 |

下图展示了一篇文章顶部各 frontmatter 字段在页面上的渲染位置：

![文章 frontmatter 字段渲染位置](/images/scrollShowcase/article-dark.png)

---

## 第六步：启动博客

在终端运行：

```bash
pnpm dev
```

等待几秒钟，终端会显示：

```text
  ➜  Local:   http://localhost:5173/
```

用浏览器打开这个地址，就能看到博客页面了。



::: tip 至此你已经完成
你的博客已经可以正常访问。下一步可以根据 [配置导航栏](#配置导航栏) 添加菜单，或继续完善其他页面。
:::

---

## 常见问题

### Q: 启动后页面空白

**检查项**：
1. 确认 `themeConfig.ts` 文件在 `.vitepress/` 目录（与 `config.mts` 同级）
2. 确认 `config.mts` 中的导入路径是 `'./themeConfig'`（注意一个点）
3. 查看终端是否有红色错误信息

### Q: 终端报 `Cannot find module 'vitepress-theme-ninc'`

**解决**：在项目根目录重新运行 `pnpm install`，然后重试。

### Q: 文章不显示在首页

**检查项**：
1. 文章是否放在 `posts/` 目录下（不是 `pages/`）
2. 文章文件是否以 `.md` 结尾
3. 文章是否有 `date` 字段

### Q: 页面样式错乱

**解决**：清除浏览器缓存（`Ctrl+Shift+R` 或 `Cmd+Shift+R`），然后刷新页面。

---

## 完整项目结构

完成基础配置后，你的项目结构应该是这样的：

```text
my-blog/
├─ .vitepress/
│  ├─ config.mts          ← 站点配置（已修改）
│  ├─ themeConfig.ts      ← 主题配置（已创建）
│  └─ theme/
│     └─ index.ts         ← 主题入口（已修改）
├─ posts/
│  └─ hello.md            ← 你的第一篇文章
├─ index.md               ← 首页（layout: home）
├─ package.json
└─ pnpm-lock.yaml
```

::: tip 这是「最小可运行」结构
上面的结构只能跑通首页 + 文章详情页。要让分类、标签、归档、分页等页面可用，还需按 [自定义页面](./pages.md) 补齐 `pages/` 与 `page/` 下的 `.md` 及对应 `.paths.mjs` 动态路由文件——否则点击导航中的分类/标签/分页链接会 404。
:::
