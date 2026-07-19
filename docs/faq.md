# 常见问题

> 收集 vitepress-theme-ninc 使用过程中的高频问题与解决方案。

## 新手入门

### Q: 我完全没有编程基础，能用这个主题吗？

可以。本主题面向普通用户，跟着[快速上手](/guide/quick-start)教程一步步操作即可搭建属于自己的博客，整个过程不需要你手写复杂的代码，只需要复制粘贴几条命令、修改一些简单的配置文件即可。

如果你在操作过程中遇到不懂的术语（比如"终端"、"pnpm"、"Markdown"），可以继续看下面的解释。

### Q: 什么是终端？怎么打开？

终端（Terminal）是一个用文字命令操作电脑的工具，安装依赖、启动项目都需要在终端里执行命令。

- **Mac**：按 `Command + 空格` 打开"聚焦搜索"，输入 `终端` 或 `Terminal`，回车打开即可。也可以在"应用程序 → 实用工具"里找到"终端"。
- **Windows**：按 `Win + R` 打开"运行"，输入 `powershell` 回车打开 PowerShell；或者在开始菜单搜索 `PowerShell`。推荐使用 Windows Terminal（可在 Microsoft Store 免费安装）。

打开后会看到一个等待输入命令的窗口，把教程里的命令（如 `pnpm install`）复制粘贴进去，按回车执行即可。

### Q: 什么是 pnpm？为什么要用它？

pnpm 是一个"包管理器"，可以理解为电脑上的"软件管家"。一个前端项目会用到很多别人写好的工具包（称为"依赖"），pnpm 负责帮你自动下载、管理这些工具包，让你不必手动一个个去找。

之所以推荐 pnpm 而不是 npm 或 yarn，是因为它速度快、节省磁盘空间，并且本主题的配置是基于 pnpm 制作和测试的，使用 pnpm 能最大程度避免环境问题。

安装 pnpm 见 [安装指南 - 安装 pnpm](/guide/installation#安装-pnpm)。

### Q: 什么是 Markdown？在哪里学？

Markdown 是一种用纯文本编写格式化文档的语法，博客文章就是用 Markdown 写的。它的语法非常简单，比如用 `#` 表示标题、用 `**` 包裹文字表示加粗、用 `-` 表示列表项。

Markdown 基础语法见 [快速上手 - Markdown 基础](/guide/quick-start#markdown-基础)。

### Q: 文章写在哪里？怎么写？

所有博客文章都放在项目根目录下的 `posts/` 文件夹里，文件后缀为 `.md`（例如 `posts/my-first-post.md`）。每篇文章的顶部需要写一段叫做 **frontmatter** 的配置信息，用三横线 `---` 包裹，用来告诉主题这篇文章的标题、日期、标签等。

最简单的文章示例：

```markdown
---
title: 我的第一篇文章
date: 2026-01-01
tags:
  - 随笔
---

这里开始写正文内容，使用 Markdown 语法即可。
```

保存文件后，启动 `pnpm dev`，刷新页面就能在首页看到这篇文章了。

### Q: 修改了配置但没生效怎么办？

按以下顺序排查：

1. **保存文件**：确认配置文件已经保存（编辑器标题栏没有"未保存"的小圆点）
2. **重启 dev server**：在终端按 `Ctrl + C` 停止当前运行的 `pnpm dev`，然后重新执行 `pnpm dev`
3. **清除浏览器缓存**：按 `Ctrl + Shift + R`（Mac 为 `Command + Shift + R`）强制刷新页面
4. **检查文件位置**：配置应写在 `.vitepress/config.ts` 或 `.vitepress/theme/` 下，确认路径正确
5. **检查语法**：配置文件中的引号、逗号、括号是否成对出现，有没有拼写错误

如果仍然无效，可以在终端查看是否有报错信息，对照本文档其他章节排查。

### Q: 怎么把博客放到网上让别人访问？

本地写的博客默认只有你自己能访问，要让别人访问需要"部署"到服务器上。本主题支持多种免费部署方案，详见[部署指南](/guide/deployment)。

最简单的方案是使用 Vercel 或 Netlify：把代码推送到 GitHub，连接平台账号后即可自动部署，几分钟后就能得到一个公网可访问的网址。

## 安装与启动

### Q: 启动时报 `Cannot find module 'vitepress-theme-ninc/defineConfig'`

**原因**：主题包未正确安装，或 Node.js 版本过低不支持 ESM 子路径导出。

**解决**：
1. 确认 Node.js 版本 ≥ 20（`node -v`）
2. 确认 pnpm 版本 ≥ 9（`pnpm -v`）
3. 重新安装依赖：`pnpm install`
4. 检查 `node_modules/vitepress-theme-ninc` 是否存在

### Q: 启动时报 `ERR_PNPM_OUTDATED_LOCKFILE`

**原因**：lockfile 与 package.json 不匹配（通常是修改了依赖版本后未同步）。

**解决**：
```bash
rm -f pnpm-lock.yaml
pnpm install
```

### Q: nes-vue 补丁应用失败 `Patch file found for package nes-vue`

**原因**：补丁基于 nes-vue 1.8.2 制作，但安装了其他版本。

**解决**：确保 `packages/theme/package.json` 中 `"nes-vue": "1.8.2"`（精确版本，非 `^1.8.2`），然后重新安装。

### Q: `pnpm.onlyBuiltDependencies` 报错

**原因**：pnpm 要求在 workspace 根 `package.json` 声明需要构建的原生依赖。

**解决**：在根 `package.json` 添加：
```json
{
  "pnpm": {
    "onlyBuiltDependencies": ["v-code-diff"]
  }
}
```

### Q: Mac 上提示 `command not found: pnpm` 怎么办？

**原因**：pnpm 未安装，或已安装但未添加到系统环境变量。

**解决**：

1. **确认是否安装**：在终端执行 `which pnpm`，若没有任何输出说明未安装
2. **安装 pnpm**（任选一种方式）：
   - 使用 npm：`npm install -g pnpm`
   - 使用 Homebrew：`brew install pnpm`
3. **安装后仍提示找不到**：可能是 pnpm 的可执行文件路径未加入 `PATH`。编辑 `~/.zshrc`（Mac 默认 shell），在末尾添加：
   ```bash
   export PNPM_HOME="$HOME/Library/pnpm"
   export PATH="$PNPM_HOME:$PATH"
   ```
   保存后执行 `source ~/.zshrc` 让配置生效，再执行 `pnpm -v` 验证。

### Q: Windows 上 PowerShell 报错"无法加载文件...因为在此系统上禁止运行脚本"怎么办？

**原因**：Windows PowerShell 默认禁止执行脚本，pnpm 等通过脚本启动的命令会被拦截。

**解决**：

以**管理员身份**打开 PowerShell，执行以下命令将执行策略改为允许本地脚本：

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

在提示中输入 `Y` 确认。之后重新打开 PowerShell，执行 `pnpm -v` 验证是否可用。

::: tip 安全说明
`RemoteSigned` 策略允许运行本地创建的脚本，从网络下载的脚本仍需数字签名，安全性有保障。
:::

## 评论系统

### Q: 评论不显示

**可能原因与解决**：

1. **未启用评论**：检查 `themeConfig.comment.enable` 是否为 `true`
2. **Twikoo envId 未配置**：检查 `themeConfig.comment.twikoo.envId` 是否填写了正确的环境 ID
3. **Twikoo 服务未部署**：需要先部署 Twikoo 服务（Vercel/CloudBase 等），参考 [Twikoo 文档](https://twikoo.js.org/)
4. **CORS 跨域问题**：Twikoo 服务需配置允许你的域名访问
5. **SSR 报错**：twikoo 已在主题包的 `ssr.noExternal` 中声明，如仍有问题请检查 VitePress 版本

```ts
// 正确的评论配置示例
comment: {
  enable: true,
  twikoo: {
    envId: '你的环境ID',
    lang: 'zh-CN'
  }
}
```

## 搜索

### Q: 搜索功能未生效

**可能原因与解决**：

1. **未启用搜索**：检查 `themeConfig.search.enable` 是否为 `true`
2. **Algolia 凭证缺失**：需填写 `appId` / `apiKey` / `indexName` 三个字段
3. **未创建 Algolia 索引**：需在 [Algolia](https://www.algolia.com/) 注册并创建索引，配置爬虫抓取你的站点
4. **索引为空**：确认 Algolia 爬虫已成功抓取页面

::: warning API Key 安全
使用 Search-Only API Key（非 Admin API Key），该 Key 仅允许搜索操作，无法修改索引数据。
:::

## PWA

### Q: PWA 缓存不更新

**可能原因与解决**：

1. **Service Worker 未更新**：主题默认配置 `registerType: 'autoUpdate'`，如需强制更新可关闭所有浏览器标签页后重新打开
2. **缓存策略问题**：检查 `defineConfig` 的 `options.pwaWorkbox` 配置，确认 `cleanupOutdatedCaches: true`
3. **未安装 @vite-pwa/vitepress**：主题会自动降级（跳过 PWA），控制台会有警告 `[vitepress-theme-ninc] @vite-pwa/vitepress 未安装`

```ts
// 关闭 PWA（如不需要）
export default defineConfig({}, themeConfig, {
  pwa: false
})
```

### Q: 构建时 PWA 报错

**解决**：主题包已将 PWA 设为可选（`options.pwa: false` 可跳过），未安装 `@vite-pwa/vitepress` 时会自动降级为不包裹 PWA，不影响构建。

## SSR 相关

### Q: SSR 报错 `window is not defined` 或 `document is not defined`

**原因**：某些浏览器端库在 SSR（服务端渲染）阶段被执行。

**解决**：主题已在 `createSsrNoExternal()` 中声明了 `lottie-web`、`codejar`、`twikoo` 等需 SSR 处理的包。如你引入了新的浏览器端库导致此错误，需在 `defineConfig` 的 `userConfig` 中补充：

```ts
export default defineConfig({
  vite: {
    ssr: {
      noExternal: ['你的浏览器端库']
    }
  }
}, themeConfig)
```

## 路径与别名

### Q: `@/` 路径导入失败

**原因**：`@` 别名由主题包的 `createResolveAlias()` 配置，指向主题包的 `src/client/` 目录。

**解决**：
- `@/views/Home.vue` → 导入主题包的视图组件（正确用法）
- `@/components/xxx.vue` → 导入主题包的组件（正确用法）
- 如需导入用户自定义组件，请使用相对路径或通过 `unplugin-vue-components` 自动注册

::: tip @ 指向哪里？
`@` 指向 `vitepress-theme-ninc` 包的 `src/client/` 目录，不是用户项目的 `.vitepress/theme/`。
:::

### Q: 动态路由 paths.mjs 报 `Could not resolve` 错误

**原因**：paths.mjs 引用了旧的 `.vitepress/theme/utils/` 路径。

**解决**：改为从 `vitepress-theme-ninc/utils` 导入：

```js
// 旧写法（已废弃）
import { getAllPosts } from '../.vitepress/theme/utils/getPostData.mjs'

// 新写法
import { getAllPosts } from 'vitepress-theme-ninc/utils'
```

## 文章与加密

### Q: 文章加密失败，密码输入后仍无法查看

**检查项**：
1. frontmatter 中 `crypto.enable` 是否为 `true`
2. `crypto.password` 是否填写
3. 访问时是否已上传密钥文件。本主题采用密钥文件 + 密码双重验证，未上传密钥时密码输入框不会出现。**访问者上传的密钥文件内容必须与 `cryptoSecretKeyFile` 指向的站点密钥文件内容完全一致**，支持 `.key` / `.txt` / `.json` 三种格式。详见 [写作工作流 - 加密文章](/guide/writing/encrypted)。

::: tip 未配置 cryptoSecretKeyFile 时的兜底行为
若你有加密文章但未配置 `cryptoSecretKeyFile`，主题会使用内置兜底密钥（公开在源码中）让项目正常启动，控制台会打印警告。此时访问者上传的密钥文件内容需为兜底密钥字符串（可从主题源码 `packages/theme/src/node/utils/getPostData.mjs` 中的 `FALLBACK_SECRET_KEY` 获取）。但强烈建议配置自己的密钥以获得真正保护。
:::

```yaml
---
title: 加密文章
crypto:
  enable: true
  password: your-password
---
```

### Q: 密钥文件怎么创建？放在哪里？

加密文章使用**站点私有密钥**机制，密钥完全由你自定义，不再硬编码在主题源码中。流程：

1. 在项目根目录创建一个文本文件（如 `secret.key`），写入你自定义的字符串作为密钥内容（推荐用 `openssl rand -hex 32 > secret.key` 生成随机字符串）
2. 在 `.vitepress/config.mts` 的 `defineConfig` 第三参数中配置 `cryptoSecretKeyFile: 'secret.key'`
3. 保留一份内容相同的密钥文件副本，用于访问加密文章时上传

密钥文件不要提交到 Git 仓库（加入 `.gitignore`），也不要放在 `public/` 目录下（会被打包到站点）。详见 [写作工作流 - 加密文章](/guide/writing/encrypted)。

### Q: 控制台出现「检测到加密文章但未配置站点密钥」警告

这不是错误，项目仍可正常运行。主题检测到你有 `crypto.enable: true` 的文章但未配置 `cryptoSecretKeyFile`，当前使用内置兜底密钥。兜底密钥公开在 npm 包源码中不具真正安全保护，请按上一题的步骤配置自己的密钥文件以消除警告并获得真正保护。

### Q: 加密文章安全吗？

本主题的加密在浏览器端完成，站点密钥与 frontmatter 中的明文密码都会进入前端/仓库历史。它的作用是提高陌生人访问门槛，并非真正的安全方案。请勿用于存放密码、密钥、财务信息、个人隐私等重要数据。

相比早期版本，主题已不再内置固定密钥——每个站点使用自己的私有密钥，npm 包源码公开后陌生人无法从中获取你的密钥。但密钥文件本身的保密仍是你的责任。

### Q: 密码输入错误多次后被锁定怎么办？

连续 5 次密码错误后，输入框会锁定 30 秒，倒计时结束后自动解锁。锁定状态记录在浏览器 `localStorage`，刷新页面无法绕过。如需立即重置，可点击页面上的「重置密钥」按钮清除本地存储的密钥和锁定状态。

### Q: 文章不显示在首页列表

**可能原因**：
1. 文章不在 `posts/` 目录下（默认扫描 `<cwd>/posts/`，可通过 `options.postsDir` 自定义）
2. 文章文件名或目录名以 `_` 开头（VitePress 会忽略）
3. 文章缺少 `date` frontmatter 字段（按日期排序需要）

### Q: 文章封面不显示

**检查项**：
1. frontmatter `cover` 字段是否填写了正确的图片路径
2. 图片是否在 `public/` 目录下
3. 如未设置 `cover`，主题会从 `cover.showCover.defaultCover` 数组中随机选取默认封面

### Q: 怎么给文章设置封面图？

在文章 frontmatter 中添加 `cover` 字段，填入图片路径即可：

```yaml
---
title: 我的一篇文章
date: 2026-01-01
cover: /images/my-cover.jpg
---
```

**说明**：
1. 图片需放在 `public/` 目录下，路径以 `/` 开头（例如把图片放在 `public/images/my-cover.jpg`，则 `cover` 写 `/images/my-cover.jpg`）
2. 也支持使用网络图片地址，如 `cover: https://example.com/cover.jpg`
3. 若不设置 `cover`，主题会从 `cover.showCover.defaultCover` 数组中随机选取一张默认封面
4. 可在 `themeConfig.cover` 中配置是否显示封面、默认封面池等

### Q: 文章排序规则是什么？

主题默认按 frontmatter 中的 `date` 字段**倒序**排列（最新的文章排在最前）：

1. 优先使用 frontmatter 中的 `date` 字段
2. 若 `date` 未填写，则该文章可能无法正确排序，建议每篇文章都显式填写 `date`
3. 日期格式推荐使用 `YYYY-MM-DD` 或 `YYYY-MM-DD HH:mm:ss`

如需调整每页显示的文章数量，可修改 `themeConfig.postSize`（默认 10 篇）。

## 样式与主题

### Q: 暗色模式样式异常

**原因**：主题通过 VueUse `useDark` 给 `<html>` 添加 `dark` 类来切换暗色模式。自定义样式需同时适配亮色和暗色。

**解决**：
```scss
// 亮色模式
.my-component {
  color: #333;
}

// 暗色模式
html.dark .my-component {
  color: #fff;
}
```

### Q: 自定义样式不生效

**解决**：确保自定义 SCSS 在主题样式之后导入：

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-ninc'
import './custom.scss'  // 主题样式已由 Theme 自动加载，此处只需引入自定义文件

export default Theme
```

### Q: 怎么修改主题的主色调？

主题的主色调通过 CSS 变量控制，覆盖对应变量即可修改。

**步骤**：

1. 在 `.vitepress/theme/` 下新建 `custom.scss` 文件
2. 覆盖主题的主色变量（变量名以主题实际定义为准，常见如下）：

```scss
:root {
  --main-color: #your-color;            /* 主色 */
  --main-color-light: #your-color-light; /* 主色浅色变体 */
}

html.dark {
  --main-color: #your-dark-color;        /* 暗色模式主色 */
}
```

3. 在 `.vitepress/theme/index.ts` 中于主题样式之后导入：

```ts
import Theme from 'vitepress-theme-ninc'
import './custom.scss'  // 主题样式已由 Theme 自动加载，无需手动 import styles

export default Theme
```

::: tip 查找完整变量列表
完整的 CSS 变量列表可在主题包的 `src/client/styles/` 目录下查看，按需覆盖即可。
:::

## 构建与部署

### Q: 构建产物中缺少 rss.xml

**原因**：`buildEnd` 钩子负责生成 RSS，可能在构建过程中出错。

**解决**：
1. 检查 `themeConfig.siteMeta.site` 是否填写了正确的站点地址
2. 确认 `posts/` 目录下有 `.md` 文章文件
3. 可通过 `options.rssOutput` 自定义 RSS 输出路径

### Q: 构建时内存溢出

**解决**：
```bash
# 增加 Node.js 内存限制
NODE_OPTIONS=--max-old-space-size=4096 pnpm build
```

### Q: 部署后页面空白

**可能原因**：
1. `base` 路径配置错误（如部署到子路径 `/blog/` 需设置 `themeConfig.siteMeta.base = '/blog/'`）
2. 部署平台未正确配置构建命令和输出目录

Vercel 配置详见 [部署指南](/guide/deployment)。

## 性能

### Q: 首页加载缓慢

**优化建议**：
1. 减少首页文章数量（`themeConfig.postSize`，默认 10）
2. 压缩 `public/` 目录下的图片
3. 关闭不需要的功能（如 PWA、音乐播放器）
4. 使用 CDN 加速静态资源

### Q: 开发模式热更新慢

**原因**：主题包包含大量组件和依赖，开发模式 Vite 需要处理大量模块。

**解决**：
1. 确认 `vite.optimizeDeps.include` 包含 `vue`、`pinia`、`element-plus`、`lodash-es`、`dayjs`（主题已默认配置）
2. 关闭不需要的 Vite 插件（通过 `options.plugins` 开关）

## 其他

### Q: 主题支持哪些浏览器？

主题使用现代 CSS 和 ES2022+ 特性，支持所有现代浏览器（Chrome 90+、Firefox 90+、Safari 15+、Edge 90+）。不支持 IE。

### Q: 如何贡献代码？

欢迎在 [GitHub](https://github.com/your-username/vitepress-theme-ninc) 提交 Issue 或 Pull Request。

## 相关文档

- [快速上手](/guide/quick-start)
- [配置体系](/guide/configuration)
- [部署指南](/guide/deployment)
- [组件总览](/components/overview)
