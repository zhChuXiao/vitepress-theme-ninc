# 安装

本页将引导你从零创建一个 VitePress 项目，并安装 `vitepress-theme-ninc` 主题。

::: tip 只装了 Node.js？直接用这个
无需提前 `pnpm init` 或 `pnpm add`，只需一行命令即可生成全部文件（含 `package.json`）：

```bash
mkdir my-blog && cd my-blog
npx vitepress-theme-ninc init
pnpm install
pnpm dev
```

详见下方 [一键初始化（推荐）](#一键初始化-推荐)。
:::

::: tip 第一次用？
如果你是第一次搭建博客，建议直接看 [从零开始：5 分钟搭建你的博客](./quick-start.md)，那个教程更详细、更适合新手。
:::

## 前置条件

在开始前，请确认你的环境已满足以下条件：

| 工具 | 最低版本 | 检查命令 | 用途 |
|------|---------|---------|------|
| [Node.js](https://nodejs.org/) | ≥ 20 | `node -v` | 运行 VitePress + npx 初始化（唯一必需） |
| [pnpm](https://pnpm.io/) | ≥ 9 | `pnpm -v` | 安装依赖包（推荐，也可用 npm） |
| 代码编辑器 | — | — | 推荐 [VS Code](https://code.visualstudio.com/) |

::: details 还没装好环境？看这里

### 安装 Node.js

1. 打开 [Node.js 官网](https://nodejs.org/)
2. 下载 **LTS 版**（版本号 ≥ 20）
3. 双击安装包，一路点「下一步」

### 安装 pnpm

Node.js 装好后，在终端执行：

```bash
npm install -g pnpm
```

验证：

```bash
pnpm -v   # 应显示 9.x.x 或更高
```

如果 pnpm 还是不可用，参考 [pnpm 安装指南](https://pnpm.io/zh/installation)。
:::

---

## Step 1：创建 VitePress 项目

VitePress 官方提供了脚手架，可一键生成项目骨架。

### 1.1 创建项目

在你想存放项目的目录下执行（把 `my-blog` 换成你想要的名字）：

::: code-group

```bash [新建目录项目]
mkdir my-blog && cd my-blog
pnpm add -D vitepress
pnpm vitepress init
```

```bash [当前目录初始化]
pnpm add -D vitepress
pnpm vitepress init
```

:::

### 1.2 按提示操作

执行后会看到交互式提示：

```text
┌  Welcome to VitePress!
│
◆  Where should VitePress initialize the config?
│  ▪ ./docs          ← 直接回车（在当前目录初始化）
│
◆  Site title:
│  ▪ My Blog         ← 输入你的博客名，回车
│
◆  Site description:
│  ▪ A VitePress site ← 输入博客描述，回车
│
◆  Theme:
│  ▪ Default Theme   ← 直接回车（后面会换成 ninc 主题）
│
◆  Use TypeScript for config and theme files?
│  ▪ Yes / No        ← 建议选 Yes
│
◆  Add VitePress npm scripts to package.json?
│  ▪ Yes / No        ← 建议选 Yes
│
└  Done! Now run pnpm install and start writing.
```

下图是 VitePress 官方脚手架的交互式提示界面：

![VitePress 脚手架交互提示](/images/guide/installation-overview.png)

::: tip 第一次见这些提示？
不用紧张，按照上面表格的说明逐项填写即可。完成后会自动生成项目骨架。
:::

### 1.3 进入项目并安装依赖

```bash
cd my-blog
pnpm install
```

等待依赖安装完成。完成后项目结构如下：

```text
my-blog/
├─ .vitepress/
│  ├─ config.mts       ← 站点配置文件
│  └─ theme/
│     └─ index.ts      ← 主题入口文件
├─ index.md            ← 首页
├─ package.json
└─ pnpm-lock.yaml
```

---

## Step 2：安装主题

在项目根目录执行：

```bash
pnpm add vitepress-theme-ninc
```

::: details 不是通过脚手架创建的项目？
通过 `pnpm vitepress init` 初始化的项目已经自带 `vitepress` 和 `vue`，无需额外操作。如果你是手动搭建的项目或 `package.json` 中缺少这两个依赖，执行以下命令补装：

```bash
pnpm add vitepress@^1.6.4 vue@^3.5.0
```
:::

### 一键初始化（推荐）

如果你只想快速搭建，无需先执行 Step 1 的 VitePress 脚手架，也无需手动 `pnpm add`。直接在空目录运行：

```bash
npx vitepress-theme-ninc init
```

命令会以交互方式（↑↓ 箭头选择）询问初始化模式与站点信息，自动生成 `package.json`（含 `dev`/`build`/`preview` 脚本与全部依赖）、`.vitepress/config.mts`、`.vitepress/theme/index.ts`、`.vitepress/themeConfig.ts`、首页 `index.md`、示例文章和占位图片。生成后只需 `pnpm install && pnpm dev` 即可启动。已存在的文件会先询问再覆盖。

::: tip 适合什么场景？
- **全新项目**：空目录直接 `npx vitepress-theme-ninc init`，跳过 Step 1 ~ Step 4 的全部手动步骤
- **已有 VitePress 项目**：在项目根目录运行，命令会检测已有文件并询问是否覆盖
- **从默认主题迁移**：init 会替换主题入口和配置文件，原有文章不受影响
:::

::: tip 为什么不需要手动配置 Vite 插件？
本主题的 `defineConfig` 工厂函数已经内置了自动导入、SVG 雪碧图、代码组图标、Gzip/Brotli 压缩、PWA 等全部 Vite 插件。你只需要在 `config.mts` 中调用它即可，详见 [配置详解](./configuration.md)。
:::

### 安装失败？

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

---

## Step 3：可选依赖说明

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

## Step 4：验证安装

### 4.1 检查 scripts

在 `package.json` 中确认存在开发脚本（脚手架默认已生成）：

```json
{
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build",
    "preview": "vitepress preview"
  }
}
```

### 4.2 启动开发服务器

```bash
pnpm dev
```

若终端输出类似下面的内容，说明安装成功：

```text
  vitepress v1.x.x  building for client...

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

启动成功后，终端会显示本地访问地址：

![启动开发服务器](/images/guide/quick-start-overview.png)

### 4.3 打开浏览器

访问 `http://localhost:5173/`，如果能看到 VitePress 默认页面，说明项目已就绪。

::: tip 此时还是默认主题
此时你看到的还是 VitePress 默认主题。接下来需要按照 [快速上手](./quick-start.md) 替换为本主题。
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
