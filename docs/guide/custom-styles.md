# 自定义样式

`vitepress-theme-ninc` 全部视觉表现都基于 CSS 自定义属性（CSS Variables）驱动，主色、字体、阴影、卡片背景、边框等均可通过覆盖变量来调整，无需修改主题源码。本页讲解三种覆盖方式，并给出覆盖主色、字体与阴影的完整示例。

## 样式架构简介

主题样式位于主题包的 `src/client/styles/` 目录，通过子路径 `vitepress-theme-ninc/styles` 暴露入口文件 `index.scss`。整体由以下几部分组成：

| 文件 | 职责 |
| --- | --- |
| `var.css` | VitePress 默认变量（`--vp-c-*` 系列），提供基础色板与组件变量 |
| `main.scss` | 主题核心变量（`--main-color`、`--main-shadow-*`、卡片背景、字体等），含明暗两套 |
| `index.scss` | 样式聚合入口，`@use`/`@import` 各子样式文件 |
| `post.scss` / `code/*` / `custom-block.scss` 等 | 文章正文、代码块、自定义容器等局部样式 |
| `font.scss` / `cursor.scss` / `animation.scss` | 字体、光标、动画 |

::: tip 入口路径
`vitepress-theme-ninc/styles` 在包的 `exports` 中映射到 `src/client/styles/index.scss`，可直接 `import 'vitepress-theme-ninc/styles'`。
:::

主题运行时（`src/client/index.ts`）已经按顺序引入了 `index.scss` 与 `main.scss`，因此**默认情况下你无需手动引入主题样式**，主题入口会自动注入。自定义样式的核心思路是：在主题样式**之后**引入你自己的覆盖文件，利用 CSS 变量的层叠优先级完成覆盖。

## 方式一：覆盖 CSS 变量

最推荐的方式是在 `.vitepress/theme/` 下创建一个自定义 SCSS 文件，用 `:root` 选择器覆盖变量。由于 CSS 变量遵循后定义优先，只要你的文件在主题样式之后加载即可生效。

### Step 1：创建自定义样式文件

```scss
// .vitepress/theme/styles/override.scss
:root {
  // 覆盖主题主色（默认 #425aef）
  --main-color: #16a34a;
  // 主色对应的半透明背景，建议同步覆盖
  --main-color-bg: #16a34a0d;
  --main-color-bg2: #16a34a40;
  --main-color-bg3: #16a34a80;

  // 覆盖正文字体
  --main-font-family: "LXGW WenKai Screen", "PingFang SC", sans-serif;

  // 覆盖阴影
  --main-shadow-blue: 0 8px 12px -3px rgba(22, 163, 74, 0.2);
  --main-shadow-red: 0 8px 12px -3px rgba(239, 68, 68, 0.25);
}
```

### Step 2：在主题入口中引入

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-ninc'
// 在主题样式之后引入自定义覆盖
import './styles/override.scss'

export default Theme
```

::: warning 顺序很重要
自定义 SCSS 必须在 `import Theme` 之后引入。VitePress 会按 import 顺序合并样式，后引入的文件中的同名变量会覆盖先前的。若发现覆盖未生效，多半是引入顺序反了。
:::

## 方式二：新增全局 SCSS

如果你需要覆盖的不仅是变量，还想新增整段样式（例如调整某个组件的布局），直接在主题入口中引入你的自定义文件即可。主题入口已经自动导入全部主题样式，**不要再次 `import 'vitepress-theme-ninc/styles'`**，否则会重复打包同一批 CSS。

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-ninc'
// 主题样式已由 Theme 内部加载，只引入你的自定义文件
import './styles/global.scss'

export default Theme
```

```scss
// .vitepress/theme/styles/global.scss
// 直接使用主题暴露的 CSS 变量编写新规则
.post-content {
  a {
    color: var(--main-color);
    border-bottom: 1px dashed var(--main-color-bg);

    &:hover {
      background-color: var(--main-color-bg);
    }
  }
}

// 调整卡片圆角与边框
.vp-doc div[class*='language-'] {
  border-radius: 12px;
  border: var(--style-border);
  box-shadow: var(--main-shadow-border);
}
```

::: tip 何时选择方式二
当你需要编写**非变量级**的样式（如新增动画、调整某组件 DOM 结构的间距）时，方式二比单纯覆盖变量更灵活。注意只需引入你的自定义文件，主题样式由入口自动加载。
:::

## 方式三：通过 themeConfig 注入

主题的 `themeConfig.inject.header` 字段会被注入到 VitePress 的 `head` 中（详见 [配置详解 - 主题配置顶层字段](./configuration.md#主题配置顶层字段一览)）。你可以借此引入远程 CSS 文件，例如字体 CDN、图标库或自定义皮肤。

```ts
// themeConfig.ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  inject: {
    header: [
      // 引入远程字体
      [
        'link',
        { rel: 'stylesheet', href: 'https://fonts.example.com/css?family=Noto+Sans+SC' }
      ],
      // 引入自定义远程皮肤
      [
        'link',
        { rel: 'stylesheet', href: 'https://cdn.example.com/my-skin.css' }
      ]
    ]
  }
})
```

::: warning 仅适合远程样式
`inject.header` 只能注入 `<link>` 标签，无法写入内联 CSS 变量覆盖。若需覆盖主题变量，请使用方式一或方式二。
:::

## 暗色模式适配

主题通过 [VueUse](https://vueuse.org/) 的 `useDark` 切换明暗模式：切换时会为 `<html>` 元素添加 `dark` 类，绝大多数暗色变量定义在 `html.dark` 选择器下。少数组件级样式（如部分首页模块、Twikoo 评论）也使用 `[data-theme='dark']` 选择器。

因此覆盖暗色模式变量时，请使用 `html.dark` 选择器；如果你的覆盖涉及到首页顶部模块或评论框，可同时补充 `[data-theme='dark']` 以保证一致。

```scss
// .vitepress/theme/styles/override.scss

// 亮色模式（默认）
:root {
  --main-color: #16a34a;
  --main-color-bg: #16a34a0d;
}

// 暗色模式：主色反向（主题默认暗色为 #dfac46）
html.dark {
  --main-color: #f59e0b;
  --main-color-bg: #f59e0b23;
  --main-color-bg2: #f59e0b40;
  --main-color-bg3: #f59e0b80;

  // 卡片背景与边框也可一并调整
  --main-card-background: #16181d;
  --main-card-border: #3a3a3f;
}

// 涉及首页顶部 / 评论框等组件时，补充 data-theme 选择器
[data-theme='dark'] {
  --main-color: #f59e0b;
}
```

::: tip 主色与反向色
主题内置一组「反向色」变量 `--main-color-reverse`，用于在明暗模式下互为补色的高亮场景（默认亮色为 `#425aef` ↔ 暗色为 `#dfac46`）。修改主色时建议同步调整反向色，保持视觉协调。
:::

## 常用变量速查

下表列出最常被覆盖的变量及其默认值（亮色 / 暗色）：

| 变量 | 亮色默认值 | 暗色默认值 | 用途 |
| --- | --- | --- | --- |
| `--main-color` | `#425aef` | `#dfac46` | 主题主色（链接、按钮、高亮） |
| `--main-color-bg` | `#4259ef0d` | `#f2b94b23` | 主色半透明背景 |
| `--main-color-reverse` | `#dfac46` | `#6ba5ed` | 反向主色 |
| `--main-font-color` | `#363636` | `#f7f7fa` | 正文文字颜色 |
| `--main-font-family` | 系统字体栈 | 系统字体栈 | 正文字体 |
| `--main-card-background` | `#fff` | `#1b1c20` | 卡片背景 |
| `--main-card-border` | `#e3e8f7` | `#3d3d3f` | 卡片边框 |
| `--main-site-background` | `#f7f9fe` | `#18171d` | 站点背景 |
| `--main-shadow-blue` | `0 8px 12px -3px rgba(40,109,234,.2)` | 同亮色 | 蓝色阴影 |
| `--main-shadow-red` | `0 8px 12px -3px #ee7d7936` | 同亮色 | 红色阴影 |
| `--main-shadow-border` | `0 8px 16px -4px rgba(44,45,48,.047)` | — | 卡片边框阴影 |
| `--style-border` | `1px solid var(--main-card-border)` | 同亮色 | 通用边框 |

::: info 完整变量清单
全部变量定义可在主题包 `src/client/styles/main.scss` 与 `var.css` 中查看。这两个文件是覆盖样式时的权威参考。
:::


## 完整示例

下面是一个综合覆盖主色（改为绿色系）、字体（霞鹜文楷）与阴影的完整示例：

```scss
// .vitepress/theme/styles/override.scss
:root {
  // 主色 → 绿色
  --main-color: #16a34a;
  --main-color-bg: #16a34a0d;
  --main-color-bg2: #16a34a40;
  --main-color-bg3: #16a34a80;
  --main-color-reverse: #db2777;

  // 字体 → 霞鹜文楷（需自行引入字体文件）
  --main-font-family: "LXGW WenKai Screen", "PingFang SC", sans-serif;

  // 阴影 → 与主色协调的绿色阴影
  --main-shadow-blue: 0 8px 12px -3px rgba(22, 163, 74, 0.2);
  --main-shadow-main: 0 8px 12px -3px rgba(22, 163, 74, 0.137);
  --main-theme-op: rgba(22, 163, 74, 0.137);
}

html.dark {
  // 暗色主色 → 琥珀色
  --main-color: #f59e0b;
  --main-color-bg: #f59e0b23;
  --main-color-bg2: #f59e0b40;
  --main-color-bg3: #f59e0b80;
  --main-color-reverse: #22c55e;

  --main-theme-op: rgba(245, 158, 11, 0.137);
}

[data-theme='dark'] {
  --main-color: #f59e0b;
}
```

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-ninc'
import './styles/override.scss'

export default Theme
```

::: tip 字体引入
若使用本地字体文件，请将字体放到 `public/fonts/` 目录，并在覆盖 SCSS 顶部用 `@font-face` 声明后，再把字体名写入 `--main-font-family`。
:::
