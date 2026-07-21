# icon 图标字段参考

本页是主题里所有 `icon` 字段的类型定义与字段参考。如需了解使用方式与上手示例，请先看 [图标使用指南](../guide/icons.md)。

## 类型定义

主题里所有 `icon` 字段的 TypeScript 类型统一为 `IconField`：

```ts
// 主题源码：packages/theme/src/client/utils/icon.ts

/** 解析后的图标描述（对象写法的形状） */
export interface ResolvedIcon {
  /** 图标类型：font=字体图标，svg=SVG 图标 */
  type: 'font' | 'svg'
  /** 图标名（不含前缀）：字体图标对应 iconfont 类名，SVG 图标对应文件名 */
  name: string
}

/** icon 字段的合法类型（string 或对象） */
export type IconField = string | ResolvedIcon | undefined | null
```

### 三种写法对应表

| 写法 | 类型 | 渲染结果 | 示例 |
| --- | --- | --- | --- |
| 字符串 | `string` | 字体图标 `<i class="iconfont icon-xxx">` | `icon: 'github'` |
| `'svg:'` 前缀字符串 | `string` | SVG 雪碧图 `<svg><use href="#icon-xxx"/></svg>` | `icon: 'svg:bilibili'` |
| 对象 | `ResolvedIcon` | 根据 `type` 走字体或 SVG | `icon: { type: 'svg', name: 'bilibili' }` |
| 空 | `undefined \| null \| ''` | 不渲染 | `icon: undefined` |

### 解析规则

主题在渲染图标前会通过 `resolveIcon()` 把 `IconField` 统一解析为 `ResolvedIcon | null`：

```ts
resolveIcon('github')                            // { type: 'font', name: 'github' }
resolveIcon('svg:bilibili')                      // { type: 'svg',   name: 'bilibili' }
resolveIcon({ type: 'svg', name: 'bilibili' })   // { type: 'svg',   name: 'bilibili' }
resolveIcon({ type: 'font', name: 'github' })    // { type: 'font',  name: 'github' }
resolveIcon(undefined)                           // null
resolveIcon('')                                  // null
resolveIcon(null)                                // null
```

::: tip 字体图标与 SVG 图标的区别
- **字体图标**：依赖主题内置 `iconfont.scss` + `.woff2` 字体文件，类名 `.icon-{name}`。用户只能使用主题预置的图标，无法自行扩展（除非改源码）
- **SVG 图标**：依赖 `vite-plugin-svg-icons`，扫描用户项目 `public/svg/` 目录。用户只需把 `.svg` 文件丢进去就能用，文件名即图标名
:::

## 哪些配置项的 icon 字段支持三种写法

下列配置项的 `icon` 字段类型为 `IconField`，完整支持三种写法：

| 配置项 | 字段路径 | 接口 | 说明 |
| --- | --- | --- | --- |
| [`nav`](./nav.md) | `nav[].items[].icon` | `NavItem.icon` | 导航栏下拉菜单项的图标 |
| [`navMore`](./nav-more.md) | `navMore[].list[].icon` | `NavMoreLink.icon` | 左侧「更多」抽屉里的链接图标（`iconType='img'` 时走图片 URL） |
| [`navButtons`](./nav-buttons.md) | `navButtons[].icon` | `NavButtonConfig.icon` | 导航栏右侧自定义按钮图标（`iconType='img'` 时走图片 URL） |
| [`footer`](./footer.md) | `footer.social[].icon` | `FooterSocial.icon` | 页脚社交链接图标 |

## 仍使用图片路径的字段

下列字段历史上是「图片路径」语义，不属于 `IconField` 体系，仍只接受字符串图片 URL：

| 配置项 | 字段路径 | 类型 | 说明 |
| --- | --- | --- | --- |
| [`homeTop`](./home-top.md) | `homeTop.category[].icon` | `string` | 首页顶部快捷分类的图片路径 |
| [`homeTop`](./home-top.md) | `homeTop.creativity[].creativity_list[].icon` | `string` | 技能图标图片路径，放在 `public/images/icon/` 下 |

这两个字段的注释明确标注是「图片路径」，图片缺失时显示名称首字母。后续可能扩展支持 `IconField`，目前保持向后兼容。

## 与 iconType 字段的关系

`NavMoreLink` 与 `NavButtonConfig` 额外有 `iconType?: 'img' | 'iconfont'` 字段，用于区分图片 URL 和字体图标两种渲染路径：

| `iconType` 取值 | `icon` 字段含义 | 渲染方式 |
| --- | --- | --- |
| `'img'` | 图片 URL（字符串） | `<img src="...">` |
| `'iconfont'` 或不填 | `IconField`（支持三种写法） | 走 `ThemeIcon` 组件，根据解析结果渲染字体或 SVG |

```ts
// iconType='img' 时：icon 字段就是图片 URL 字符串
{
  name: '工具站',
  iconType: 'img',
  icon: '/images/tool.png',
  url: 'https://tool.example.com'
}

// iconType='iconfont' 或不填时：icon 支持 IconField 的三种写法
{
  name: 'Bilibili',
  iconType: 'iconfont',
  icon: 'svg:bilibili',   // SVG 写法（虽然字段叫 iconfont，但 svg 也走这条路径）
  url: 'https://www.bilibili.com'
}
```

::: tip 命名历史
`iconType` 的 `'iconfont'` 取值是历史遗留命名，实际涵盖「字体图标 + SVG 图标」两类（凡是「不是图片」的都走这条路径）。后续大版本可能会重命名为 `'icon'` 以避免歧义。
:::

## SVG 图标扫描目录

SVG 图标的扫描目录由 `defineConfig` 的第三参数 `svgIconDirs` 控制，默认为 `[<项目根>/public/svg]`：

```ts
// .vitepress/config.mts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from '../themeConfig'

export default defineConfig(
  {},
  themeConfig,
  {
    // 默认值：['public/svg']（基于 process.cwd() 解析）
    svgIconDirs: ['public/svg', 'public/icons']
  }
)
```

详见 [SVG 雪碧图](../guide/assets/svg.md)。

## 内置字体图标列表

主题内置的 iconfont 图标来源是固定的字体文件，主要覆盖：

- 导航栏常用图标：`menu` `close` `search` `light` `dark` `up` `toc` `dashboard` `shuffle` `subway`
- 社交平台：`github` `mail` `qq` `weixin` `weibo` `zhihu` `bilibili`（部分可能未内置）
- 通用图标：`list` `link` `image` `music` `message` `tag` `category` `archive` `time` `edit` `delete` `home` `user`

完整列表可查看主题包内 `packages/theme/src/client/styles/iconfont.scss` 中的 `.icon-{name}:before` 规则。

::: warning 无法新增字体图标
主题内置的 iconfont 字体文件在构建期已固化，用户无法自行新增字体图标。如需用主题预置之外的图标，请使用 SVG 图标（`'svg:文件名'` 写法）。
:::

## 相关配置

- [`nav` 导航栏](./nav.md)
- [`navMore` 更多菜单](./nav-more.md)
- [`navButtons` 右侧自定义按钮](./nav-buttons.md)
- [`footer` 页脚](./footer.md)
- [`homeTop` 首页顶部](./home-top.md)（`icon` 字段为图片路径，非 `IconField`）
- [图标使用指南](../guide/icons.md) — 上手教程与实战示例
- [SVG 雪碧图](../guide/assets/svg.md) — 在 Markdown 中直接使用 `<SvgIcon>` 组件
