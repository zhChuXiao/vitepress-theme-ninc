# Markdown 扩展

本主题在 VitePress 原生 Markdown 扩展之上，通过 `packages/theme/src/node/utils/markdownConfig.mjs` 额外集成了按键标记、时间线、单选 / 按钮 / 卡片容器、标签页、属性语法、表格包裹与图片灯箱等扩展，全部开箱即用，无需手动注册插件。

本章节同时收录 **VitePress 原生扩展**与**主题独有扩展**两类语法。前者包括自定义容器、代码组、行高亮、Emoji、目录、数学公式等开箱即用能力；后者包括按键标记、时间线、单选 / 按钮容器、卡片、标签页与属性语法。每项扩展均给出源码示例与实际渲染效果，便于直接对照。

::: tip 配置入口
所有扩展在主题初始化时自动应用。若需调整某项行为（如开启图片灯箱），可参考 [主题配置详解](../configuration.md)。
:::

## 子页面索引

| 页面 | 内容 |
| --- | --- |
| [VitePress 原生扩展](./native.md) | 自定义容器、代码组、行高亮、导入代码块、Emoji、目录、数学公式、表格 |
| [主题容器](./containers.md) | timeline 时间线、radio 单选、button 按钮、card 卡片、表格自动包裹 |
| [按键标记](./keybutton.md) | `%%k%%` 语法与常见按键组合 |
| [属性语法](./attrs.md) | `markdown-it-attrs` 的 `{.class}` 与 `{:class="xxx"}` 写法 |

## 图片渲染与灯箱

主题重写了 `image` 渲染规则，根据主题配置中的 `fancybox` 开关，提供两种渲染模式。

### 启用 fancybox

当 `themeConfig.fancybox.enable` 为 `true` 时，图片会被包裹为可点击放大的灯箱链接：

```html
<a class="img-fancybox" href="图片地址" data-fancybox="gallery" data-caption="alt 文本">
  <img class="post-img" src="图片地址" alt="alt 文本" loading="lazy" />
  <span class="post-img-tip">alt 文本</span>
</a>
```

特点：

- 点击图片弹出灯箱查看大图
- 图片下方自动显示 alt 文本作为说明（`.post-img-tip`）
- 同一页面所有图片归入同一个 `gallery`，可在灯箱中切换浏览
- 图片启用懒加载（`loading="lazy"`）

### 未启用 fancybox

当 `fancybox.enable` 为 `false`（默认）时，仅渲染普通 `<img>`：

```html
<img src="图片地址" alt="alt 文本" loading="lazy">
```

此时图片不会显示下方说明文字，也不支持点击放大。

### 渲染效果

启用 fancybox 后，文章中的图片会渲染为如下结构（alt 文本作为图片说明展示在图片下方，点击图片可放大查看）：

```html
<a class="img-fancybox" href="图片地址" data-fancybox="gallery" data-caption="alt 文本">
  <img class="post-img" src="图片地址" alt="alt 文本" loading="lazy" />
  <span class="post-img-tip">alt 文本</span>
</a>
```


### 开启 fancybox

在 `themeConfig.ts` 中开启：

```ts
// themeConfig.ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  fancybox: {
    enable: true
  }
})
```

完整配置项参考 [主题配置详解](../configuration.md)。

::: warning alt 文本即图片说明
启用 fancybox 后，图片的 `alt` 文本会同时作为 `data-caption` 与下方 `.post-img-tip` 文本。若不希望显示说明文字，请将 alt 留空。
:::

## 代码块默认折叠

在文章 frontmatter 中设置 `cbx: true`，该文章内所有代码块默认折叠，点击「展开」按钮后查看完整内容。代码块折叠的 frontmatter 字段（cbx/cbf）详见 [Frontmatter - 代码块默认折叠](../frontmatter.md#代码块默认折叠)。

![代码块默认折叠](/images/article/cbx.png)
## 其他集成

除上述扩展外，主题还集成了以下能力，详情见对应文档：

- **vitepress-demo-plugin** — 在 Markdown 中嵌入可交互的 Vue 组件 demo，详见 [文章管理 - 组件 Demo 文章](../posts.md#组件-demo-文章)。
- **代码块默认折叠** — 通过 frontmatter `cbx` 字段控制，详见 [Frontmatter 字段 - 代码块默认折叠](../frontmatter.md#代码块默认折叠)。

