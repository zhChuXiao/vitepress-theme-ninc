# 属性语法

属性语法来自 [`markdown-it-attrs`](https://github.com/arve0/markdown-it-attrs) 插件，可在任意 Markdown 元素后追加 `{.class #id key=value}`，为其添加 HTML 属性。本主题已默认启用，无需额外配置。

## 语法

```
[文本](链接){target=_blank}
# 标题 {.my-class}
一段文本 {.highlight}
```

::: tip 图片元素上的属性：白名单透传
主题重写了 Markdown 图片渲染规则（用于 fancybox 灯箱与 `loading="lazy"`），渲染时会透传白名单属性：**`class`、`id`、`width`、`height`**。例如 `![图片](src){width=200 .rounded}` 会把 `width="200"` 与 `class="rounded"` 写到 `<img>` 上（fancybox 开启时自定义 class 会并入 `post-img` 一同生效）。白名单以外的键（如 `onerror` 等事件属性）会被安全丢弃，防止注入。
:::

## 渲染效果与源码

下方每个示例上方为渲染效果，下方为对应源码。

链接添加 `target` 属性（在新窗口打开）：

[在新窗口打开 VitePress 官网](https://vitepress.dev){target=_blank}

````md
[在新窗口打开 VitePress 官网](https://vitepress.dev){target=_blank}
````

标题添加 class：

#### 自定义标题 {.my-title-class}

````md
#### 自定义标题 {.my-title-class}
````

## 属性写法

| 写法 | 含义 |
| --- | --- |
| `.className` | 添加 class |
| `#idName` | 添加 id |
| `key=value` | 添加任意属性 |
| `{.a .b #c}` | 同时添加多个 class 与 id |

## 用途

- 给元素添加自定义 class，配合 [自定义样式](../custom-styles.md) 实现特殊视觉效果
- 链接添加 `target=_blank`、`rel=noopener`
- 锚点跳转所需的 id
- 图片添加尺寸/样式属性（`width`、`height`、`class`、`id` 白名单内生效，见上方说明）

