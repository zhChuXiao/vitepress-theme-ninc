# fancybox 灯箱

配置文章图片灯箱功能（基于 Fancybox 5），点击图片可放大查看并支持图片画廊、手势缩放等交互，CDN 资源地址可自定义。

## 字段说明

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 是否启用图片灯箱 |
| `js` | `string` | `'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.umd.min.js'` | Fancybox JS CDN 地址 |
| `css` | `string` | `'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.min.css'` | Fancybox CSS CDN 地址 |

## 示例

### 使用默认 CDN（jsDelivr）

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  fancybox: {
    enable: true
    // js / css 不填则使用默认 jsDelivr 地址
  }
})
```

### 自定义 CDN（使用 cdnjs）

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  fancybox: {
    enable: true,
    js: 'https://cdnjs.cloudflare.com/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.umd.min.js',
    css: 'https://cdnjs.cloudflare.com/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.min.css'
  }
})
```

### 自定义 CDN（国内镜像）

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  fancybox: {
    enable: true,
    js: 'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.umd.min.js',
    css: 'https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/fancyapps-ui/5.0.36/fancybox/fancybox.min.css'
  }
})
```

## 渲染效果

---

`fancybox` 默认启用，文章中的图片会自动绑定灯箱效果，交互细节：

- **点击放大**：点击文章内任意图片，全屏覆盖层展示放大后的图片，背景半透明遮罩。
- **导航控件**：弹层右上角提供关闭按钮，同一页面多张图片时出现左右箭头，支持键盘 ←/→ 切换。
- **手势缩放**：移动端支持双指缩放与拖动，便于查看高清细节。
- **画廊模式**：同一页面内的多张图片自动归为画廊，可连续浏览。

::: tip 常见配置组合
- **默认**：使用 jsDelivr CDN（主题默认值），开箱即用，无需额外配置。
- **国内加速**：替换为 `mirrors.sustech.edu.cn` 南科大镜像，提升国内加载速度。
- **海外站点**：替换为 `cdnjs.cloudflare.com`，提升海外加载速度。
- **极致加速**：将 Fancybox 资源下载到 `public` 目录，`js`/`css` 改为本地路径，完全脱离 CDN 依赖。
:::

::: warning 与打赏码弹窗的协同
[`rewardData`](./reward.md) 的打赏弹窗内图片也会被 Fancybox 接管，点击二维码可二次放大。若不希望打赏码被灯箱处理，需在打赏组件中排除对应选择器（需修改组件实现）。
:::

## 注意事项

::: tip 默认启用
`fancybox` 默认 `enable: true`，文章中的图片会自动绑定灯箱效果，点击即可放大查看，无需额外操作。
:::

::: tip 默认使用 jsDelivr CDN
默认 `js` 与 `css` 使用 jsDelivr（`cdn.jsdelivr.net`）。如遇访问问题或希望使用其他 CDN，可替换为 cdnjs、南科大镜像（`mirrors.sustech.edu.cn`）、unpkg 等地址，**但需保证 JS 与 CSS 版本一致**。
:::

::: warning JS 与 CSS 版本必须一致
`js` 与 `css` 必须使用同一版本的 Fancybox 资源（默认均为 `5.0.36`），版本不一致可能导致样式与脚本不匹配，灯箱无法正常工作。升级时请同时更新两者的版本号。
:::

::: tip 推荐使用稳定 CDN
面向国内用户的站点可使用 `mirrors.sustech.edu.cn` 或 `cdn.jsdelivr.net`；面向海外用户的站点可使用 `cdnjs.cloudflare.com`。切换时请同步更换 `js` 与 `css` 两个地址。
:::

::: warning enable 关闭后图片不可放大
当 `enable: false` 时，主题不会加载 Fancybox 的 JS 与 CSS，文章图片将以原生方式展示，点击无放大效果。如不需要灯箱功能可关闭以减少资源加载。
:::

## 相关配置

- [`aside` 侧边栏](./aside.md) — 侧边栏模块配置
- [`rewardData` 打赏](./reward.md) — 打赏码图片也可通过灯箱放大
- [`comment` 评论](./comment.md) — 文章页评论系统配置
