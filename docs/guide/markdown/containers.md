# 主题容器

本主题在 `markdown-it-container` 之上扩展了 `timeline`、`radio`、`button`、`card` 四种容器，并重写了表格渲染规则以自动包裹 `<div class="table-container">`。它们与 VitePress 原生 `tip` / `info` / `warning` / `danger` / `details` 容器写法一致，可在同一文档中混用。本页给出每种容器的语法说明、源码示例、渲染效果与典型用途。

## 时间线容器

### 语法

使用 `::: timeline 标题` 开启一个时间线块，以 `:::` 结束。`timeline` 关键字后跟随的文本会作为时间线节点标题：

````md
::: timeline 2025 年 6 月

正文内容，支持任意 Markdown 语法。

:::
````

渲染后的 HTML 结构：

```html
<div class="timeline">
  <span class="timeline-title">2025 年 6 月</span>
  <div class="timeline-content">
    <!-- 正文渲染结果 -->
  </div>
</div>
```

### 渲染效果

::: timeline 2025 年 6 月

发布 `vitepress-theme-ninc` v1.0，新增按键标记、时间线等扩展。

:::

::: timeline 2025 年 7 月

完善文档体系，新增 Markdown 扩展语法说明页。

:::

![时间线容器渲染效果](/images/article/timeline.png)


### 源码示例

````md
::: timeline 2025 年 6 月

发布 `vitepress-theme-ninc` v1.0，新增按键标记、时间线等扩展。

:::

::: timeline 2025 年 7 月

完善文档体系，新增 Markdown 扩展语法说明页。

:::
````

### 用途

- 版本更新记录、Changelog
- 编年史、个人履历
- 按时间线组织的事件序列

::: tip 标题会做 HTML 转义
`timeline` 后的标题文本经过 `md.utils.escapeHtml` 处理，可直接书写 `<`、`>` 等字符而不会破坏 HTML 结构。标题内部不支持 Markdown 语法，富文本内容请写在容器内部。
:::

## 单选容器

### 语法

使用 `::: radio` 开启一个单选项，以 `:::` 结束。`radio` 后可跟随一段文本，该文本会被 `md.renderInline` 渲染，并将结果作为 `radio-point` 元素的 class：

````md
::: radio checked
已完成的事项
:::

::: radio
未完成的事项
:::
````

渲染后的 HTML 结构：

```html
<div class="radio">
  <div class="radio-point checked" />
  已完成的事项
</div>
```

### 渲染效果

::: radio checked
阅读快速上手文档
:::

::: radio checked
安装主题依赖
:::

::: radio
部署站点到 Vercel
:::

![单选容器渲染效果](/images/article/radio.png)

> 上图展示了 radio 容器的渲染效果，已完成项显示带圆点的勾选状态，未完成项显示空心圆圈。

### 源码示例

````md
::: radio checked
阅读快速上手文档
:::

::: radio checked
安装主题依赖
:::

::: radio
部署站点到 Vercel
:::
````

### 用途

- 任务清单、TODO 列表
- 步骤完成状态展示
- 选项罗列

::: warning class 用法说明
`radio` 后的文本会被渲染为 HTML 字符串再拼接进 `class` 属性。为避免生成非法 HTML，建议只填写简单标识（如 `checked`、`done`）。如需给单选项添加富文本标签，请把内容写在容器内部。
:::

## 按钮容器

### 语法

使用 `::: button 类名` 开启一个按钮，以 `:::` 结束。`button` 后跟随的文本会作为附加 class 拼接到 `<button>` 元素上：

````md
::: button primary
立即开始
:::

::: button
普通按钮
:::
````

渲染后的 HTML 结构：

```html
<button class="button primary">立即开始</button>
<button class="button ">普通按钮</button>
```



### 源码示例

````md
::: button primary
立即开始
:::

::: button
普通按钮
:::
````

### 用途

- CTA（行动号召）按钮
- 操作指引、文档内的强调入口
- 文章末尾的下一步引导

::: tip 自定义按钮样式
`button` 后的类名会拼接为 `class="button xxx"`。可在自定义样式中针对 `.button.primary`、`.button.success` 等编写不同视觉风格，参考 [自定义样式](../custom-styles.md)。
:::

## 卡片容器

### 语法

使用 `::: card` 开启一个卡片容器，以 `:::` 结束。容器内部支持任意 Markdown 内容：

````md
::: card

## 卡片标题

卡片正文，支持 **加粗**、*斜体*、`代码`、[链接](https://example.com) 等任意 Markdown 语法。

:::
````

渲染后的 HTML 结构：

```html
<div class="card">
  <!-- 内部 Markdown 渲染结果 -->
</div>
```

### 渲染效果


![卡片容器渲染效果](/images/article/card.png)


### 源码示例

````md
::: card

## 卡片标题

卡片正文，支持 **加粗**、*斜体*、`代码`、[链接](https://example.com) 等任意 Markdown 语法。

:::
````

### 用途

- 信息块、提示卡片
- 内容分组
- 强调展示区域

::: tip card 不解析 info
`card` 容器不读取 `::: card` 后的文本，所有内容都应写在容器内部。如需给卡片附加 class，请配合 [属性语法](./attrs.md)。
:::

## 表格自动包裹

主题重写了 `table_open` 与 `table_close` 渲染规则，自动给所有 Markdown 表格包裹一层 `<div class="table-container">`，使表格在内容超出容器宽度时可以横向滚动，不会撑破文章布局。

### 说明

无需任何额外语法，按标准 Markdown 写表格即可：

````md
| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `string` | 是 | — | 文章标题 |
| `date` | `string` | 是 | — | 发布日期 |
| `tags` | `string[]` | 否 | `[]` | 标签列表 |
| `categories` | `string[]` | 否 | `[]` | 分类列表 |
| `description` | `string` | 否 | 正文摘要 | 文章描述 |
````


渲染后的 HTML 结构：

```html
<div class="table-container">
  <table>...</table>
</div>
```

当表格列数较多或单元格内容较长时，`.table-container` 会出现横向滚动条，避免表格溢出文章正文宽度。

![表格自动包裹效果](/images/article/table.png)


### 用途

- 长表格的横向滚动
- 数据密集型文档
- 保持布局不被宽表格撑破

