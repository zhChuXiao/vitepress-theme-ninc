# travellings 开往-友链接力

配置导航栏右侧“开往”按钮，点击后随机跳转至加入[开往-友链接力](https://www.travellings.cn/)计划的博客。默认关闭，开启后会在导航栏主题切换按钮与随机文章按钮之间显示一个开往图标。

## 字段说明

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | 是否在导航栏显示“开往”按钮 |
| `url` | `string?` | `'https://www.travellings.cn/go.html'` | 开往跳转地址，留空使用官方地址 |

## 示例

### 启用开往按钮（使用官方地址）

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  travellings: {
    enable: true
    // url 不填则使用官方 https://www.travellings.cn/go.html
  }
})
```

### 自定义跳转地址

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  travellings: {
    enable: true,
    url: 'https://example.com/my-travellings.html'
  }
})
```

## 渲染效果

开启后导航栏右侧会在“切换主题”与“随机文章”按钮之间出现一个开往图标（`icon-subway`），鼠标悬浮时底部状态栏显示“随机前往一个开往项目网站”，点击后在新标签页打开跳转地址。

::: tip 默认关闭
`travellings` 默认 `enable: false`，导航栏不会出现开往按钮。如需展示请在 `themeConfig` 中显式设置 `enable: true`。
:::

::: warning 需先加入开往计划
开往按钮跳转的目标地址默认为官方 `https://www.travellings.cn/go.html`，只有已加入开往计划的站点才会被随机分配。如你的站点尚未加入，请先前往 [travellings.cn](https://www.travellings.cn/) 申请，避免按钮点击后跳转到无关站点。
:::

## 注意事项

- 开往按钮的 `travellings` class 已默认加入 [`jumpRedirect.exclude`](./jump-redirect.md) 排除列表，点击时不会被外链中转页拦截。
- 若关闭开往按钮（`enable: false`），导航栏不会渲染该图标，对页面布局无影响。

## 相关配置

- [`navMore` 左侧更多菜单](./nav-more.md) — 导航栏左侧“更多”菜单配置
- [`nav` 导航栏菜单](./nav.md) — 顶部导航栏菜单项配置
- [`jumpRedirect` 外链中转](./jump-redirect.md) — 外链中转页排除项配置
