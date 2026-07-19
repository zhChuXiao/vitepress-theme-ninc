---
title: Markdown 与 VitePress 语法完全指南
tags: [Markdown, VitePress, 语法, 教程]
categories: [技术教程]
date: 2026-07-18
description: 全面展示 VitePress 内置语法与主题所有扩展功能，包括文本格式化、代码高亮、容器、代码组、徽标、标签页、时间线、按键块、数学公式、Emoji、Vue 组件等。
---

# Markdown 与 VitePress 语法完全指南

本文全面展示 VitePress 内置 Markdown 语法与主题扩展功能，方便写作时随时查阅。

::: tip 如何使用本文
本文既是语法参考，也是**渲染效果预览**。每段代码源码可在文章源文件 `posts/articles/markdown-guide.md` 中查看，对照源码与渲染结果学习最快。
:::

## 一、文本格式化

**粗体文本**  
*斜体文本*  
***粗斜体文本***  
~~删除线文本~~  
`行内代码`  
==高亮文本==  
H~2~O 下标  
2^10^ 上标

## 二、标题与锚点

### 自定义锚点 {#custom-anchor}

为标题指定自定义锚点，可通过 `[链接](#custom-anchor)` 跳转：

[跳转到上面的自定义锚点](#custom-anchor)

## 三、段落与换行

段落之间需空一行分隔。

行末加两个空格或反斜杠可强制换行。  
这是换行后的文字。

## 四、引用

> 这是一段引用文字，适合放置重要提示。
>
> 引用可以包含多段文字。
>
> > 引用可以嵌套。

### GitHub 风格提醒

> [!NOTE]
> 这是一个 Note 提醒，用于强调重要信息。

> [!TIP]
> 这是一个 Tip 提醒，用于给出建议。

> [!IMPORTANT]
> 这是一个 Important 提醒，用于强调关键信息。

> [!WARNING]
> 这是一个 Warning 提醒，用于提醒注意事项。

> [!CAUTION]
> 这是一个 Caution 提醒，用于强调严重风险。

## 五、列表

### 无序列表

- 列表项 1
- 列表项 2
  - 嵌套项 2.1
  - 嵌套项 2.2
- 列表项 3

### 有序列表

1. 第一步
2. 第二步
3. 第三步

### 任务列表

- [x] 已完成的任务
- [ ] 未完成的任务

## 六、代码

### 行内代码

使用反引号包裹：`const x = 1`

包含反引号的代码：``use `code` here``

### 代码块（带语法高亮与行号）

```js
// JavaScript 代码块（自动显示行号）
const greeting = 'Hello, 我的博客!'
console.log(greeting)
```

```ts
// TypeScript 代码块
interface Post {
  title: string
  date: string
  tags: string[]
}
```

```vue
<!-- Vue 单文件组件 -->
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

```bash
# Shell 脚本
pnpm install
pnpm dev
```

```json
{
  "name": "my-blog",
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build"
  }
}
```

```html
<div class="container">
  <h1>Hello World</h1>
</div>
```

```css
.container {
  max-width: 800px;
  margin: 0 auto;
}
```

```python
# Python 代码
def greet(name):
    return f"Hello, {name}!"
```

```diff
+ 新增的行
- 删除的行
  未修改的行
```

### 代码块行高亮

在语言后添加 `{行号}` 高亮指定行：

```js{2}
const a = 1
const b = 2  // 这行会被高亮
const c = 3
```

高亮多行（用逗号或范围）：

```js{1,3-4}
const a = 1  // 高亮
const b = 2
const c = 3  // 高亮（范围起始）
const d = 4  // 高亮（范围结束）
const e = 5
```

### 导入代码片段

使用 `<<<` 导入外部文件内容作为代码块：

```md
<<< @/snippets/example.js
<<< @/snippets/example.js#snippet  {js}
```

> 导入路径相对于项目根目录。`#snippet` 可只导入文件中 `//#region snippet` 与 `//#endregion` 之间的内容。

### 代码组（code-group）

在多个代码块之间切换：

::: code-group

```js [config.js]
export default { title: 'My Blog' }
```

```ts [config.ts]
export default defineConfig({ title: 'My Blog' })
```

```json [package.json]
{ "name": "my-blog" }
```

:::

### 代码组图标

主题集成 `vitepress-plugin-group-icons`，在代码组标签名中添加图标：

::: code-group

```bash [pnpm]
pnpm install
```

```bash [yarn]
yarn install
```

```bash [npm]
npm install
```

:::

> 代码组标签会自动匹配常见包管理器、框架图标。自定义图标请在 `groupIconConfig.json` 中配置。

### 组件 Demo

主题集成 `vitepress-demo-plugin`，可在 Markdown 中嵌入可交互的 Vue 组件 Demo：

```md
::: demo

`<template>
  <button @click="count++">点击 {{ count }} 次</button>
</template>

`<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

:::
```

> Demo 组件文件默认放在 `posts/components/` 目录下，也可通过 `defineConfig` 的 `demoDir` 选项自定义。

## 七、表格

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | — | 文章标题 |
| date | string | — | 发布日期 |
| tags | string[] | [] | 标签数组 |
| cover | string | — | 封面图片路径 |
| top | boolean | false | 是否置顶 |
| recommend | boolean | false | 是否推荐 |

表格内支持行内格式：**粗体**、`代码`、[链接](/)。

## 八、链接

### 普通链接

[内部链接](/pages/about)  
[外部链接](https://vitepress.dev)  
[带标题的链接](https://vitepress.dev "VitePress 官网")

### 自动链接

裸 URL 自动转为链接：<https://vitepress.dev>

### 引用式链接

[引用式链接][ref-id]

[ref-id]: https://vitepress.dev

## 九、图片

![占位图片](/images/cover.svg)

> 主题已启用图片灯箱（Fancybox），点击图片可放大查看。图片自动懒加载。

带 caption 的图片（通过 alt 文本显示在图片下方）：

![这是图片说明文字](/images/cover.svg)

## 十、分割线

---

以上是分割线。

## 十一、Emoji 表情

支持 GitHub 风格 Emoji 短码：

:tada: :rocket: :100: :sparkles: :heart: :thumbsup: :bulb: :warning: :bookmark: :fire:

> 完整列表见 [Emoji 速查表](https://github.com/markdown-it/markdown-it/blob/master/lib/index.js#L8)

## 十二、目录

在文中插入自动生成的目录（`[[toc]]`）：

[[toc]]

> 目录深度由 `markdown.toc.level` 控制，本主题设置为 `[1, 2, 3, 4]`。

## 十三、数学公式

主题已启用 MathJax3 渲染数学公式。

### 行内公式

质能方程 $E = mc^2$，欧拉公式 $e^{i\pi} + 1 = 0$。

### 块级公式

$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

$$
\begin{pmatrix} a & b \\ c & d \end{pmatrix}
$$

## 十四、VitePress 内置容器

### info 信息

::: info 信息
这是一个信息容器，用于展示提示信息。
:::

### tip 提示

::: tip 提示
这是一个提示容器，用于给出建议。
:::

### warning 警告

::: warning 警告
这是一个警告容器，用于提醒注意事项。
:::

### danger 危险

::: danger 危险
这是一个危险容器，用于强调严重问题。
:::

### details 详情

::: details 点击展开详情
这是一个可折叠的详情容器，默认收起，点击展开。

支持 **Markdown** 格式内容。
:::

### 自定义标题

::: tip 我的自定义提示标题
容器标题可自定义，替换默认的类型名。
:::

## 十五、徽标 Badge

使用 VitePress 内置 `<Badge>` 组件为文字添加彩色标签：

- Vue <Badge type="info" text="3.x" />
- VitePress <Badge type="tip" text="推荐" />
- 主题 <Badge type="warning" text="Beta" />
- 已弃用 <Badge type="danger" text="Deprecated" />

## 十六、标签页 Tabs

使用 `:::tabs` 容器创建可切换的标签页：

::: tabs
== tab 第一个
标签页内容 A

支持 **Markdown** 格式。

== tab 第二个
标签页内容 B

```js
console.log('tab B')
```

== tab 第三个
标签页内容 C
:::

## 十七、时间线 Timeline

使用 `::: timeline` 容器创建时间线区块：

::: timeline 我的建站历程
- 2024-01-01 ：开始搭建个人博客
- 2024-03-15 ：完成主题开发
- 2024-06-01 ：正式上线
- 2024-09-20 ：发布首个正式版
:::

## 十八、单选点 Radio

使用 `::: radio` 容器创建带圆点的列表项，支持勾选状态：

::: radio checked
已完成的功能
:::

::: radio
待开发功能
:::

## 十九、按钮容器 Button

使用 `::: button` 容器创建按钮样式：

::: button primary
主要按钮
:::

::: button
普通按钮
:::

## 二十、卡片容器 Card

使用 `::: card` 容器创建卡片区块：

::: card
这是一个卡片容器，可以放置任意 Markdown 内容。

支持 **粗体**、*斜体*、`代码` 等格式。

| 字段 | 值 |
|------|----|
| 名称 | 测试 |
:::

## 二十一、按键块 Keybutton

使用 `%%按键名%%` 语法创建键盘按键样式：

按 %%Ctrl%% + %%C%% 复制，按 %%Ctrl%% + %%V%% 粘贴。  
快捷键 %%Cmd%% + %%K%% 打开搜索。  
%%Enter%% 确认，%%Esc%% 取消。

## 二十二、属性语法 markdown-it-attrs

为元素添加 CSS 类名、ID 或任意属性：

段落带类名 {.text-center}

段落带 ID {#my-paragraph}

[带类名的链接](https://vitepress.dev){.custom-link target=_blank}

![带类名的图片](/images/cover.svg){.rounded}

带多个属性 {class="highlight" id="sec1" data-value="42"}

## 二十三、在 Markdown 中使用 Vue

VitePress 支持在 Markdown 中直接使用 Vue 模板语法与组件。

### Vue 插值

当前日期：{{ new Date().toLocaleDateString() }}

1 + 1 = {{ 1 + 1 }}

### Vue 指令

`<span v-for="i in 3">{{ i }} </span>` 渲染为：
<span v-for="i in 3">{{ i }} </span>

### script setup

```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

## 计数器

当前值：{{ count }}，两倍：{{ doubled }}

<button @click="count++">+1</button>
```

### 使用 VitePress 内置组件

```vue
<ClientOnly>
  <div>这段内容仅在客户端渲染</div>
</ClientOnly>
```

### 使用主题组件

```vue
<script setup>
import { Badge } from 'vitepress'
// 或使用主题导出的组件
// import { ComponentName } from 'vitepress-theme-ninc/components'
</script>

<Badge type="tip" text="在 Markdown 中使用" />
```

## 二十四、转义字符

使用反斜杠转义 Markdown 特殊字符：

\\\* 不是斜体  
\\\# 不是标题  
\\\[ 不是链接  
\\\` 不是代码

## 二十五、Frontmatter 字段速查

```yaml
---
title: 文章标题              # 必填，文章标题
date: 2024-01-01             # 必填，发布日期（YYYY-MM-DD）
tags: [标签1, 标签2]          # 标签数组
categories: [分类名]          # 分类数组
description: 文章描述          # 显示在列表和搜索引擎中
cover: https://blog.ninc.top/images/cover/003405.jpeg      # 封面图片路径
top: true                     # 置顶文章（排在列表最前）
recommend: true               # 推荐文章（排在置顶之后、普通文章之前）
aside: false                  # 是否显示侧边栏（true 显示，false 隐藏）
card: true                    # 是否使用卡片布局
comment: true                 # 是否启用评论
padding: false                # 是否启用页面内边距
# 文章加密
crypto:
  enable: true
  password: '你的密码'
---
```

## 语法速查表

| 语法 | 用途 | 示例 |
|------|------|------|
| `**粗体**` | 加粗 | **粗体** |
| `*斜体*` | 斜体 | *斜体* |
| ``~~删除~~`` | 删除线 | ~~删除~~ |
| ``==高亮==`` | 高亮 | ==高亮== |
| ``~下标~`` | 下标 | H~2~O |
| ``^上标^`` | 上标 | 2^10^ |
| ``[文字](url)`` | 链接 | [链接](/) |
| ``![alt](url)`` | 图片 | — |
| ``> 引用`` | 引用块 | — |
| ``- 列表`` | 无序列表 | — |
| ``1. 列表`` | 有序列表 | — |
| ``- [x]`` | 任务列表 | — |
| ``\`代码\``` | 行内代码 | — |
| ``\`\`\`lang`` | 代码块 | — |
| ``\`\`\`lang{1,3-5}`` | 行高亮 | — |
| ``<<< @/file`` | 导入代码 | — |
| ``::: code-group`` | 代码组 | — |
| ``::: tip`` | 提示容器 | — |
| ``::: details`` | 详情容器 | — |
| ``<Badge />`` | 徽标 | — |
| ``::: tabs`` | 标签页 | — |
| ``::: timeline`` | 时间线 | — |
| ``::: radio`` | 单选点 | — |
| ``::: button`` | 按钮 | — |
| ``::: card`` | 卡片 | — |
| ``%%按键%%`` | 按键块 | — |
| ``{.class}`` | 属性 | — |
| ``[[toc]]`` | 目录 | — |
| ``$公式$`` | 行内公式 | — |
| ``$$公式$$`` | 块级公式 | — |
| ``:emoji:`` | Emoji | — |
| `> [!NOTE]`` | GitHub 提醒 | — |
| ``{{ 表达式 }}`` | Vue 插值 | — |

---

::: tip 📚 完整文档
更多语法细节、组件用法、写作指南请查阅主题官方文档：<https://theme.ninc.top>
:::
