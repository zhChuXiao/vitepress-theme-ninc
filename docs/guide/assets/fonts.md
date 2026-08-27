# 字体管理

本页讲解主题内置字体的打包方式，以及自定义字体的两种途径（本地字体文件与远程字体 CDN），并说明 `font.scss` 配置文件的作用。主题内置字体随 npm 包分发，开箱即用；自定义字体则通过覆盖 CSS 变量 `--main-font-family` 实现。

## 主题内置字体

主题包内置以下字体文件，位于 `packages/theme/src/client/styles/fonts/`：

| 文件 | `@font-face` 字体名 | 用途 |
| --- | --- | --- |
| `DingTalk-JinBuTi.woff2` | `JinBuTi` | 中文展示字体（全站默认字体，中控台可切换「进步体」/系统字体） |
| `title.ttf` | `Site Title` | 已声明但当前版本未在任何样式中引用（预留，浏览器不会下载） |
| `galvji-bold.ttf` | `galv-bold` | 已声明但当前版本未在任何样式中引用（预留，浏览器不会下载） |

字体声明集中在 `packages/theme/src/client/styles/font.scss`，通过 `@font-face` 引用：

```scss
@font-face {
  font-family: 'JinBuTi';
  src: url('./fonts/DingTalk-JinBuTi.woff2');
}
```

`url()` 使用相对路径（`./fonts/...`），发布到 npm 后字体文件随包体一起分发，无需用户额外下载或配置，开箱即用。

::: tip 浏览器按需下载
`@font-face` 声明本身不会触发字体文件下载——只有当页面元素实际使用该 `font-family` 时浏览器才会拉取对应字体文件。因此主题同时声明多套字体不会造成额外的首屏流量。
:::

## 自定义字体

主题内置字体不一定满足所有场景。自定义字体有两种方式，按需选择。

### 方式一：本地字体文件

适合字体体积较小、希望离线可用的场景。

1. 将字体文件放入 `public/fonts/`：

```text
public/
└─ fonts/
   └─ LXGW-WenKai-Screen.woff2
```

2. 在覆盖 SCSS 中用 `@font-face` 声明，并覆盖 `--main-font-family` 变量：

```scss
// .vitepress/theme/styles/override.scss
@font-face {
  font-family: 'LXGW WenKai Screen';
  src: url('/fonts/LXGW-WenKai-Screen.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

:root {
  --main-font-family: 'LXGW WenKai Screen', 'PingFang SC', sans-serif;
}
```

3. 在主题入口引入覆盖文件：

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-ninc'
import './styles/override.scss'

export default Theme
```

::: tip 路径写法
`public/` 下的资源使用 `/` 开头的绝对路径（如 `/fonts/xxx.woff2`），与主题配置中的图片路径规则一致。
:::

### 方式二：远程字体 CDN

适合字体体积较大、希望利用 CDN 加速的场景。通过 `inject.header` 注入 `<link>` 标签，再覆盖 `--main-font-family`：

```ts
// themeConfig.ts
inject: {
  header: [
    [
      'link',
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap' }
    ]
  ]
}
```

```scss
// .vitepress/theme/styles/override.scss
:root {
  --main-font-family: 'Noto Sans SC', 'PingFang SC', sans-serif;
}
```

关于字体变量覆盖的更多细节（如 `--main-font-family` 在明暗主题下的差异），见 [自定义样式 - 常用变量速查](../custom-styles.md#常用变量速查)。

