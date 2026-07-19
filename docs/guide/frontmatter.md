# Frontmatter 字段

Frontmatter 是 Markdown 文件顶部的 YAML 元数据块，用于向主题传递每篇文章的标题、标签、封面、加密状态等信息。本主题在 VitePress 原生 frontmatter 之上扩展了一系列字段，覆盖加密、转载、参考资料、布局控制等场景。

本页列出全部可用字段，并给出 5 种典型文章的完整写法。

## Frontmatter 简介

每篇 Markdown 文件以两行 `---` 包裹的 YAML 块作为开头，即为 frontmatter。`---` 之外的内容才是正文：

```md
---
title: 文章标题
date: 2025-05-14
---

# 这里才是正文

正文内容...
```

::: tip 字段顺序无关
YAML 中字段的书写顺序不影响解析结果，可按个人习惯排列。下文示例为可读性采用了「标题 → 标签 → 分类 → 时间 → 显示选项 → 封面 → 描述」的顺序。
:::

## 完整字段表

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `string` | :done: | — | 文章标题，显示在文章页与列表中 |
| `tags` | `string[] \| string` | :fail: | `[]` | 标签，支持数组 `[Vue, CSS]` 或单值 |
| `categories` | `string[] \| string` | :fail: | `[]` | 分类，支持数组或单值 |
| `date` | `string` | :done: | — | 发布日期，格式 `YYYY-MM-DD`，用于排序与归档 |
| `top` | `boolean` | :fail: | `false` | 是否置顶，置顶文章排在列表最前 |
| `recommend` | `boolean` | :fail: | `false` | 是否在「推荐文章」区域展示 |
| `mainColor` | `string` | :fail: | 随机 | 封面主色，如 `#dda3bf`，控制封面渐变背景 |
| `cover` | `string` | :fail: | 默认封面 | 封面图路径，未设置时从 `cover.showCover.defaultCover` 随机选取 |
| `description` | `string` | :fail: | 正文摘要 | 文章描述，用于 SEO、列表卡片与分享卡片 |
| `articleGPT` | `string` | :fail: | `description` | 文章页顶部摘要（主题仅模仿 GPT 摘要的展示样式，内容需手动填写，可自行二开接入大模型 API 自动生成） |
| `cbx` | `boolean` | :fail: | `false` | 是否默认折叠该文章所有代码块，点击后展开 |
| `cbf` | `boolean` | :fail: | `false` | 是否折叠**单个代码块**（仅作用于当前块，与 `cbx` 全文折叠互补） |
| `reprint` | `object` | :fail: | — | 转载信息，见下方转载文章示例 |
| `crypto` | `object` | :fail: | — | 文章加密配置，见下方加密文章示例 |
| `references` | `array` | :fail: | `[]` | 参考资料，每项为 `{ title, url }` |
| `copyright` | `boolean` | :fail: | `true` | 是否在文章页显示版权声明组件 |
| `aside` | `boolean` | :fail: | `true` | 是否显示侧边栏，`false` 隐藏 |
| `isPage` | `boolean` | :fail: | `false` | 是否按「普通页面」渲染（不视为文章，不计入列表/归档） |
| `fullWidth` | `boolean` | :fail: | `false` | 是否启用全宽布局，配合 `aside: false` 用于工具页/速查表 |
| `card` | `boolean` | :fail: | `false` | 是否启用卡片背景样式，常用于纯文字页面（版权/隐私等） |
| `comment` | `boolean` | :fail: | `false` | 是否在该页面渲染评论组件，留言板设为 `true` |
| `layout` | `string` | :fail: | — | 页面布局名；首页填 `home`，由主题 `App.vue` 据此渲染首页视图 |

::: warning title 与 date 建议必填
虽然 `title` 之外的字段都有默认值，但 `date` 缺失会导致文章无法正确排序，归档页也会出现异常。建议每篇文章都填写 `title` 与 `date`。
:::


### 对象/数组字段的结构

`reprint`、`crypto`、`references` 三个字段的内部结构如下：

```yaml
# 转载信息
reprint:
  title: 原文标题
  desc: 来源说明（如 CSDN、掘金）
  url: https://example.com/original
  icon: /svg/csdn.svg      # 可选，来源图标

# 加密配置
crypto:
  enable: true              # 是否启用加密
  password: your-password   # 访问密码

# 参考资料
references:
  - title: 参考资料名称
    url: https://example.com
  - title: 另一份资料
    url: https://example.com/another
```

## 示例一：标准文章

最常见的文章写法，包含标题、标签、分类、封面与描述：

```md
---
title: Vue 组件开发中 CSS 的 BEM 规范完全指南
tags: [Vue, 前端, CSS, TypeScript]
categories: [经验分享]
date: 2025-05-14
top: false
recommend: true
mainColor: #dda3bf
cover: /images/cover/bem-cover.jpg
description: 这篇文章详细介绍了 BEM 命名规范在 Vue 组件开发中的应用，从基本概念到实际工具封装。
articleGPT: 本文是一份全面的 BEM 规范指南，专注于在 Vue 组件开发中的实践应用。
---

# Vue 组件开发中 CSS 的 BEM 规范完全指南

正文从这里开始...
```


::: tip tags / categories 的两种写法
YAML 数组既可用内联写法 `[Vue, CSS]`，也可用多行写法：

```yaml
tags:
  - Vue
  - CSS
```

两种写法等价，按个人偏好选择即可。
:::

## 示例二：加密文章

不希望被陌生人随意看到的内容可通过 `crypto` 字段加密。最小配置：

```md
---
crypto:
  enable: true
  password: your-password
---
```

加密文章访问时会出现密码输入框（图为示例文章的渲染效果）：

![加密文章访问效果](/images/article/crypto.png)

完整的加密文章使用方式（含密钥文件创建、安全须知、访问流程、防暴力破解机制）见 [写作工作流 - 加密文章](./writing/encrypted)。

::: tip mainColor 用引号包裹
当 `mainColor` 值以 `#` 开头时，YAML 会将其解析为注释。请用单引号包裹，如 `'#84afca'`，避免解析异常。
:::



## 示例三：转载文章

转载他人文章时，通过 `reprint` 字段标注原文信息，文章页会显示转载来源卡片：

```md
---
reprint:
  title: 原文标题
  url: https://example.com/original
---
```

转载文章会在文章页显示转载来源卡片：

![转载文章效果](/images/article/reprint.png)

`reprint` 各子字段（`title`/`desc`/`url`/`icon`）的完整说明见 [写作工作流 - 转载文章](./writing/reprint)。



## 示例四：页面式文章

工具页、速查表等不需要侧边栏的文章，可关闭侧边栏并启用全宽布局：

```md
---
aside: false
isPage: true
fullWidth: true
---
```

启用后文章以全宽布局展示，适合速查表类内容：

![全宽布局文章效果](/images/article/isPage.png)

`isPage: true` 使该文件被视作「普通页面」而非「文章」，不会出现在文章列表、归档与分类页中。工具页完整使用指南见 [写作工作流 - 工具页](./writing/tool-page)。

## 示例五：带参考资料的文章

技术文章常需引用外部资料，通过 `references` 字段在文末自动生成参考列表：

```md
---
references:
  - title: oh-my-zsh
    url: https://ohmyz.sh/
---
```

文末会自动渲染参考资料区块：

![参考资料区块渲染效果](/images/article/reference.png)

`references` 是数组，每项必须包含 `title` 与 `url`。完整说明见 [写作工作流 - 参考资料](./writing/references)。

## 代码块默认折叠

如果某篇文章代码量较大，可在 frontmatter 中设置 `cbx: true` 让**所有代码块**默认折叠：

```md
---
title: 大量代码示例的文章
cbx: true
date: 2025-06-01
---

正文中的代码块会默认折叠，点击「展开」按钮查看完整内容。
```

如果只想折叠**某一个代码块**，用 `cbf`：

````
```js{cbf=true}
// 仅这个代码块默认折叠
console.log('folded')
```
````

`cbx` 控制全文级折叠，`cbf` 控制单块级折叠，二者互补。

![代码块默认折叠](/images/article/cbx.png)
