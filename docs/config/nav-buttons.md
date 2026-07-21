# navButtons 导航栏右侧自定义按钮

在导航栏右侧添加自定义按钮，例如主题文档链接、GitHub 仓库入口、外链等。按钮位置固定在「搜索」按钮之后、「中控台」按钮之前，与默认按钮共用同一组样式。

![nav-buttons](/images/article/nav-icon.png)

## 字段说明

### navButtons 主表（NavButtonConfig 数组）

`navButtons` 为 `NavButtonConfig[]` 数组，每一项代表一个自定义按钮，按数组顺序从左到右渲染。

| 字段       | 类型                  | 默认值       | 说明                                                                                                                                |
| ---------- | --------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `name`     | `string`              | —            | 按钮名称。hover 时显示在站点标题位（与默认按钮一致的提示效果），同时作为 `title` 鼠标提示                                           |
| `iconType` | `'iconfont' \| 'img'` | `'iconfont'` | 图标类型：`iconfont` 走字体图标或 SVG 图标，`img` 走图片 URL                                                                        |
| `icon`     | `IconField`           | —            | 图标字段。`iconType='img'` 时为图片 URL；否则支持三种写法（字符串 / `'svg:文件名'` / 对象），详见 [图标使用指南](../guide/icons.md) |
| `url`      | `string`              | —            | 跳转链接。站内路径（以 `/` 开头）走路由跳转，外链走 `window.open`                                                                   |
| `target`   | `'_blank' \| '_self'` | `'_blank'`   | 链接打开方式。默认 `_blank` 新窗口打开                                                                                              |

默认 `navButtons` 值为 `[]`（空数组，不渲染任何自定义按钮）。

## 示例

### 基础示例：主题文档 + GitHub 仓库

最常见的用法，在导航栏右侧加两个外链按钮：

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  navButtons: [
    {
      name: '我的工具站',
      iconType: 'img',
      icon: '/images/tool.png', // 放在 public/images/ 下
      url: 'https://tool.example.com'
    },
    {
      name: 'GitHub 仓库',
      iconType: 'iconfont',
      icon: 'github',
      url: 'https://github.com/zhChuXiao/vitepress-theme-ninc',
      target: '_blank'
    }
  ]
})
```

### 使用图片图标

如果 iconfont 项目里没有合适的图标，可以用图片：

```ts
navButtons: [
  {
    name: '我的工具站',
    iconType: 'img',
    icon: '/images/tool.png', // 放在 public/images/ 下
    url: 'https://tool.example.com'
  }
]
```

### 站内跳转

把 `url` 改为站内路径，`target` 设为 `_self`：

```ts
navButtons: [
  {
    name: '在线工具',
    iconType: 'iconfont',
    icon: 'tool',
    url: '/pages/tools',
    target: '_self'
  }
]
```

## 渲染效果

---

`navButtons` 渲染为导航栏右侧的圆形按钮组，交互细节如下：

- **位置**：固定在「搜索」按钮之后、「中控台」按钮之前，与默认按钮共用 `.menu-btn.nav-btn` 样式。
- **图标**：`iconType=iconfont` 渲染 `<i class="iconfont icon-xxx">`；`iconType=img` 渲染 `<img>`，尺寸自适应到 20×20。
- **hover 效果**：与默认按钮一致——背景变主题色、图标缩放 1.1 倍、站点标题位显示 `name`。
- **点击行为**：`target='_blank'` 用 `window.open` 打开新窗口；`target='_self'` 走 Vue Router 站内跳转。

## 注意事项

::: tip icon 字段支持三种写法
`iconType=iconfont`（默认）时，`icon` 字段支持三种写法（详见 [图标使用指南](../guide/icons.md)）：

- 字符串：iconfont 图标名（如 `'github'`、`'list'`），主题自动加 `icon-` 前缀
- `'svg:文件名'`：引用 `public/svg/` 下的 SVG 文件（如 `'svg:bilibili'`）
- 对象：`{ type: 'svg' | 'font', name: 'xxx' }` —— 显式声明类型与名称

如需用主题内置 iconfont 之外的品牌 logo，推荐把 `.svg` 文件丢进 `public/svg/` 后用 SVG 写法。
:::

::: warning 不会自动合并默认值
`navButtons` 默认值是空数组 `[]`。你在 `themeConfig` 中写入的数组会**整体替换**默认值，不会拼接。这是设计上的取舍：右侧按钮是个性化的，没有「默认该有」的按钮。
:::

::: tip 与 nav 区分

- [`nav`](./nav.md) 是顶部居中的下拉菜单分组（文库、我的等），用于站内导航。
- `navButtons` 是顶部右侧的图标按钮，用于外链或快捷入口。两者互不影响。
  :::

## 相关配置

- [`icon` 图标字段](./icons.md) — `icon` 字段类型定义与字段参考
- [`nav` 顶部导航栏](./nav.md) — 顶部居中的下拉菜单分组
- [`navMore` 更多菜单](./nav-more.md) — 折叠到侧边抽屉的链接列表
- [`travellings` 开往](./travellings.md) — 右侧「开往」友链接力按钮（同样是右侧自定义入口，但是独立字段）
