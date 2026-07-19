# VitePress 原生扩展

VitePress 自身已内置丰富的 Markdown 扩展，本主题完全兼容。本页给出各扩展的源码与渲染效果，便于直接对照。完整字段说明请参考 [VitePress 官方文档](https://vitepress.dev/zh/guide/markdown)。

## 自定义容器

VitePress 内置 `tip`、`info`、`warning`、`danger`、`details` 五种容器，均基于 `markdown-it-container` 实现，用 `::: 容器名` 开启、`:::` 结束。`details` 容器渲染为可折叠的 `<details>` 元素。容器名后可追加自定义标题，例如 `::: tip 操作提示` 会把「操作提示」作为容器标题。

源码示例：

````md
::: tip
这是一个提示
:::

::: info
这是一个信息
:::

::: warning
这是一个警告
:::

::: danger
这是一个危险警告
:::

::: details
这是一个详情块
:::
````

渲染效果：

![自定义容器渲染效果](/images/article/container.png)



## 代码组

用 `::: code-group` 包裹多个代码块，可为每个代码块通过 `[标签名]` 指定标签，渲染为可切换的标签页。本主题已集成代码组图标，标签名匹配内置映射时会自动显示对应语言图标，详见 [代码组图标](../code-group-icons.md)。

源码示例：

````md
::: code-group

```ts [ts]
const x: number = 1
```

```js [js]
const x = 1
```

:::
````

渲染效果：

::: code-group

```typescript [ts]
const x: number = 1
```

```js [js]
const x = 1
```

:::

## 代码块行高亮

在代码块语言标识后用 `{行号}` 指定高亮行，支持单行 `1`、范围 `3-4`、步进 `1,3,5` 等写法，多种写法可组合使用。

源码示例：

````md
```js{1,3-4}
const a = 1
const b = 2
const c = 3
const d = 4
```
````

渲染效果：

```js{1,3-4}
const a = 1
const b = 2
const c = 3
const d = 4
```

## 导入代码块

用 `<<<` 可将外部文件内容作为代码块导入，路径以 `@` 表示项目根目录（即 VitePress `srcDir`）。可在路径后追加 `{行号}` 实现行高亮，或用 `#区域名` 导入文件中 `#region` 与 `#endregion` 之间的片段。

源码示例：

````md
<<< @/snippets/example.ts

<<< @/snippets/example.ts{1,3-4}

<<< @/snippets/example.ts#region
````

导入代码块依赖磁盘上的实际文件，需先在项目中创建对应文件才能正常渲染，渲染结果与普通代码块一致，本页不再单独展示。

## Emoji

VitePress 内置 emoji 语法，用冒号包裹 emoji 名称即可渲染为对应字符。完整列表参考 [markdown-it-emoji 数据表](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json)。

源码示例：

````md
:tada: :100: :rocket: :heart: :thumbsup:
````

渲染效果：

:tada: :100: :rocket: :heart: :thumbsup:

## 目录

`[[toc]]` 会根据当前页面的标题层级自动生成目录链接，常用于文章开头的导航。

源码示例：

````md
[[toc]]
````

渲染效果：

[[toc]]

## 数学公式

主题已启用 Markdown 数学公式扩展（`markdown.math: true`），底层使用 `markdown-it-mathjax3`，支持行内公式与块级公式。行内公式用单个 `$` 包裹，块级公式用 `$$` 包裹并独占一段。

源码示例：

````md
行内公式：$E = mc^2$

块级公式：

$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$
````

渲染效果：

![数学公式渲染效果](/images/article/math.png)



## 表格

标准 Markdown 表格语法，无需额外配置。主题会自动为所有表格包裹 `<div class="table-container">`，列数较多或单元格内容较长时可横向滚动，详见 [表格自动包裹](./containers.md#表格自动包裹)。

源码示例：

````md
| 方法 | 说明 | 返回值 |
| --- | --- | --- |
| `get()` | 读取数据 | `any` |
| `set()` | 写入数据 | `void` |
| `has()` | 判断是否存在 | `boolean` |
````

渲染效果：

| 方法 | 说明 | 返回值 |
| --- | --- | --- |
| `get()` | 读取数据 | `any` |
| `set()` | 写入数据 | `void` |
| `has()` | 判断是否存在 | `boolean` |

::: tip 主题扩展容器与原生容器共用语法
本主题的 `timeline`、`radio`、`button`、`card` 容器与 VitePress 原生 `tip`、`info`、`warning`、`danger`、`details` 容器都基于 `markdown-it-container`，写法一致，可在同一文档中混用。
:::

## 代码组图标

本主题集成了 `vitepress-plugin-group-icons`，在 `::: code-group` 代码组的标签上自动显示语言或文件类型图标，开箱即用，内置 58 种默认映射，并可通过 `defineConfig` 第三参数自定义追加。

完整说明见 [代码组图标](../code-group-icons.md)。

::: code-group

```sh [pnpm]
pnpm install
```

```sh [npm]
npm install
```

:::


