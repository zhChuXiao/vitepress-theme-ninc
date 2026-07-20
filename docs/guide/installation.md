# 安装

本页是 `vitepress-theme-ninc` 的**安装参考**，覆盖环境要求、可选依赖说明与安装排查。一键初始化和手动搭建的完整教程请看 [快速上手](./quick-start.md)。

::: tip 想要完整的新手教程？
如果你是第一次搭建博客，建议直接看 [从零开始：5 分钟搭建你的博客](./quick-start.md)，那个教程更详细、手把手带你从零到第一篇文章。
:::

::: tip 两条路径，二选一即可
- <span style="display: inline-block; padding: 2px 10px; border-radius: 4px; background: #3c8772; color: #fff; font-size: 13px; font-weight: 600;">推荐</span> **一键初始化** — 一行命令生成全部文件，适合绝大多数人，[查看教程](./quick-start.md#快速初始化-推荐)
- <span style="display: inline-block; padding: 2px 10px; border-radius: 4px; background: #d97706; color: #fff; font-size: 13px; font-weight: 600;">手动</span> **逐步安装** — 适合喜欢折腾、想了解每个文件作用的人，[查看教程](./quick-start.md)
:::

## 前置条件

::: info 手动安装路径
以下内容仅在走手动安装路径时需要，使用一键初始化的用户可以直接跳到 [快速上手](./quick-start.md) 看完整教程。
:::

在开始手动安装前，请确认你的环境已满足以下条件：

| 工具 | 最低版本 | 检查命令 | 用途 |
|------|---------|---------|------|
| [Node.js](https://nodejs.org/) | ≥ 20 | `node -v` | 运行 VitePress + npx 初始化（唯一必需） |
| [pnpm](https://pnpm.io/) | ≥ 9 | `pnpm -v` | 安装依赖包（推荐，也可用 npm） |
| 代码编辑器 | — | — | 推荐 [VS Code](https://code.visualstudio.com/) |

::: info 还没装好环境？
Node.js 和 pnpm 的详细安装步骤（含验证命令、VS Code 推荐配置）见 [快速上手 · 第一步：准备工具](./quick-start.md#第一步-准备工具-只需做一次)，本页不再重复。
:::

手动安装的完整步骤（创建 VitePress 项目 → 安装主题 → 配置博客信息 → 写第一篇文章 → 启动验证）请看 [快速上手教程](./quick-start.md)，本页不再重复。

---

## 可选依赖说明

本主题将一部分功能依赖声明为 `optionalDependencies`。**与 npm 不同，pnpm 默认会安装 `optionalDependencies`**，因此 `pnpm add vitepress-theme-ninc` 之后这些功能即可开箱即用，无需额外操作。

如果某些功能你确定不需要，可以精简安装以减小 `node_modules` 体积。下表列出关键可选依赖及其用途：

| 依赖 | 用途 | 移除后影响 |
|------|------|-----------|
| `@vite-pwa/vitepress` | PWA 离线支持 | 不会生成 Service Worker，主题自动降级跳过 PWA |
| `twikoo` | 文章评论 | 评论组件不渲染 |
| `algoliasearch` + `instantsearch.js` + `vue-instantsearch` | 站内搜索 | 搜索框不可用 |
| `aplayer` | 音乐播放器 | 音乐卡片不渲染 |
| `element-plus` | UI 组件库（页脚徽标、设备展示等核心组件依赖） | 依赖它的组件失效 |
| `lottie-web` | Lottie 动画（页脚徽标、首页动效） | 动效降级为静态 |
| `three` | 3D 场景渲染（BackgroundCanvas 组件） | 3D 特效不可用 |
| `cheerio` | RSS / 数据处理辅助 | 部分构建期数据处理受限 |

::: tip 不确定要不要移除？
如果你刚开始用，**不要移除任何依赖**。等功能都跑起来、熟悉之后，再根据实际需要精简。
:::

### 精简安装（pnpm）

pnpm 下跳过全部可选依赖：

```bash
pnpm add vitepress-theme-ninc --no-optional
```

或在项目根目录 `.npmrc` 中长期关闭可选依赖安装：

```ini
optional=false
```

::: warning 谨慎精简
`element-plus`、`@vueuse/core` 等是主题核心组件运行所必需的依赖（声明在 `dependencies`，不会被上面的可选开关影响）。仅当明确知道某项 `optionalDependencies` 对应的功能不会用到时才精简，否则可能造成页面组件失效。
:::

::: warning 关于 PWA 自动降级
若你未安装 `@vite-pwa/vitepress`，主题不会报错，而是在构建时打印一条警告并跳过 PWA 包装。你无需为此做任何额外处理。也可以在 `defineConfig` 第三参数中显式设置 `pwa: false` 以关闭警告。
:::

### 关于扩展页面与小工具

主题包本身只提供博客与文档的核心能力（首页布局、文章页、归档、标签、评论、搜索等）。NES 游戏模拟器、Sass 转 CSS、代码差异对比、键盘键码值查询、KMS 激活脚本、妙控键盘等扩展页面属于演示站点的额外内容，**不再随主题包分发**，相应的扩展依赖（`nes-vue`、`v-code-diff`、`sass.js`、`codejar` 等）也已从主题包中移除。

如果你希望在自己的站点实现类似功能，可以参考本仓库 `blog/` 目录下的实现方式：在 `.vitepress/theme/views/` 下自行创建扩展页面组件，并按需安装对应的依赖。主题内置的 `unplugin-vue-components` 自动注册机制会扫描该目录，组件可直接在 Markdown 中通过标签名使用，无需手动 `import`。

---

## 安装失败排查

如果安装过程中遇到错误，试试以下方法：

```bash
# 方法一：清除缓存后重试
pnpm store prune
pnpm install

# 方法二：删除 lockfile 后重试
rm pnpm-lock.yaml
pnpm install

# 方法三：使用 npm 代替 pnpm
npm install vitepress-theme-ninc
```

::: details 不是通过脚手架创建的项目？
通过 `pnpm vitepress init` 初始化的项目已经自带 `vitepress` 和 `vue`，无需额外操作。如果你是手动搭建的项目或 `package.json` 中缺少这两个依赖，执行以下命令补装：

```bash
pnpm add vitepress@^1.6.4 vue@^3.5.0
```
:::

---

## 常见问题

<details>
<summary><b>Q: pnpm 命令找不到（command not found: pnpm）</b></summary>

**Mac**：在终端执行 `npm install -g pnpm`，然后重启终端。

**Windows**：以管理员身份打开 PowerShell，执行 `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`，然后再安装 pnpm。

</details>

<details>
<summary><b>Q: pnpm install 很慢</b></summary>

可能是因为默认 registry 在国外。可以临时使用国内镜像加速下载（注意：发布 npm 包时需要改回官方 registry）：

```bash
pnpm config set registry https://registry.npmmirror.com/
pnpm install
```

</details>

<details>
<summary><b>Q: ERR_PNPM_OUTDATED_LOCKFILE</b></summary>

lockfile 与 package.json 不匹配。删除 lockfile 重新安装：

```bash
rm pnpm-lock.yaml
pnpm install
```

</details>

<details>
<summary><b>Q: 安装后报 Cannot find module</b></summary>

1. 确认 Node.js ≥ 20（`node -v`）
2. 确认 pnpm ≥ 9（`pnpm -v`）
3. 删除 `node_modules` 和 lockfile，重新安装：

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

</details>
