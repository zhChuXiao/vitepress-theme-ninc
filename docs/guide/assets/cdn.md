# CDN 与外部资源

本主题涉及多种外部资源加载场景：图片灯箱、评论系统、音乐播放器、统计脚本、字体图标库等。本页将它们分成「主题内置」和「用户配置」两类，给出完整的清单、CDN 源选择建议、故障切换方案，以及 `inject.header` 的实战用法。

## 两类外部资源

| 类别 | 含义 | 配置方式 |
| --- | --- | --- |
| **主题内置** | 主题核心功能依赖的外部资源，开箱即用，用户通常无需操心 | 已写在 `defaultThemeConfig.ts` 或组件中，用户可通过 `themeConfig` 覆盖 |
| **用户配置** | 与站点个性化强相关的资源（字体、图标库、favicon 等），需要用户自行引入 | 通过 `themeConfig.inject.header` 注入到 `<head>` |

---

## 主题内置的 CDN 资源

### 资源清单

| 功能 | 加载方式 | 默认 CDN 源 | 配置字段 | 是否可覆盖 |
| --- | --- | --- | --- | --- |
| 图片灯箱（Fancybox） | 运行时 `loadScript` / `loadCSS` 动态加载 | `cdn.jsdelivr.net` | `themeConfig.fastjson.js` / `themeConfig.fastjson.css` | :done: 可改为任意 CDN 或本地路径 |
| 评论系统（Twikoo） | 源码直接打包在主题内（`twikoo.nocss.js`） | 无需 CDN | `themeConfig.comment.twikoo.envId` | :done: 仅需配置 envId |
| 音乐播放器（Meting API） | 后端 API 调用（非静态资源） | `api.injahow.cn` | `themeConfig.music.url` | :done: 可改为自建 API |
| 不蒜子站点统计 | 运行时 `loadScript` 动态加载 | `busuanzi.ibruce.info` | 无（硬编码） | :fail: 不可配置 |
| 51.la 统计 | 运行时 `fetch` 加载 widget | `v6-widget.51.la` | `themeConfig.tongji.LA.ck` | :done: 需用户提供 ck |

::: tip 为什么 Twikoo 不走 CDN？
Twikoo 评论脚本体积较大且版本敏感，主题将源码直接打包在 `packages/theme/src/client/utils/twikoo.nocss.js` 中。这样做的好处是：1）无需额外网络请求，加载更快；2）版本与主题严格匹配，避免 CDN 版本漂移导致的兼容问题；3）离线环境下也能渲染评论组件外壳。你只需要在 `themeConfig.comment.twikoo.envId` 中填入自己的 Twikoo 环境地址即可。
:::

### Fancybox CDN 配置详解

图片灯箱是主题的核心功能之一，默认启用并走 jsdelivr CDN。如果 jsdelivr 在你的部署区域不稳定，可改为其他 CDN 或本地路径：

```ts
// themeConfig.ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export default defineThemeConfig({
  fancybox: {
    enable: true,
    // 方案一：jsdelivr（默认）
    js: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.umd.min.js',
    css: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.min.css',
    // 方案二：unpkg
    // js: 'https://unpkg.com/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.umd.min.js',
    // css: 'https://unpkg.com/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.min.css',
    // 方案三：本地化（需自行下载文件到 public/ 目录）
    // js: '/libs/fancybox/fancybox.umd.min.js',
    // css: '/libs/fancybox/fancybox.min.css'
  }
})
```

::: warning 关闭灯箱
若你不希望使用图片灯箱功能，可将 `fancybox.enable` 设为 `false`，主题不会加载任何 Fancybox 资源。
:::

### Meting 音乐 API 配置

音乐播放器依赖一个 Meting API 后端来解析歌单。默认使用公共 API `api.injahow.cn`，但公共 API 可能不稳定或被限流。建议自建 API：

```ts
// themeConfig.ts
export default defineThemeConfig({
  music: {
    enable: true,
    // 自建 Meting API（推荐）
    url: 'https://your-domain.com/meting/',
    id: '歌单ID',
    server: 'netease', // 网易云：netease，QQ 音乐：tencent
    type: 'playlist'   // 歌单：playlist，单曲：song
  }
})
```



---

## CDN 源选择建议

不同 CDN 在全球可达性、中国大陆访问速度、稳定性上各有差异。下表列出常见 CDN 及其特点：

| CDN | 全球速度 | 中国大陆速度 | 稳定性 | 协议 | 适用场景 |
| --- | --- | --- | --- | --- | --- |
| **jsdelivr**（默认） | ★★★★★ | ★★★★☆ | ★★★★☆ | HTTPS | npm 包分发的首选，主题默认使用 |
| **unpkg** | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | HTTPS | jsdelivr 的备选，偶尔中国大陆慢 |
| **cdnjs** | ★★★★☆ | ★★★☆☆ | ★★★★☆ | HTTPS | 老牌 CDN，库覆盖稍逊于 jsdelivr |
| **_bootcdn** | ★★★☆☆ | ★★★★★ | ★★★☆☆ | HTTPS | 中国大陆最快，但库版本更新较慢 |
| **本地化** | ★★★★★ | ★★★★★ | ★★★★★ | HTTPS | 最稳定，但需自行管理资源文件 |

::: tip 如何选择？
- **面向全球用户**：使用 jsdelivr（默认），全球加速覆盖好
- **主要面向中国大陆用户**：可改用 _bootcdn，或将关键资源本地化
- **追求极致稳定**：将 Fancybox 等关键资源下载到 `public/libs/` 目录，使用本地路径
- **CDN 故障应急**：将 CDN 域名改为备用 CDN 或本地路径即可，无需修改代码
:::



### 本地化 CDN 资源

如果你希望完全脱离 CDN 依赖，可按以下步骤将资源本地化：

1. 从 CDN 下载对应文件到项目的 `public/libs/` 目录：

```bash
# 以 Fancybox 为例
mkdir -p public/libs/fancybox
curl -o public/libs/fancybox/fancybox.umd.min.js \
  https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.umd.min.js
curl -o public/libs/fancybox/fancybox.min.css \
  https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.min.css
```

2. 在 `themeConfig.ts` 中将 CDN URL 改为本地路径：

```ts
export default defineThemeConfig({
  fancybox: {
    enable: true,
    js: '/libs/fancybox/fancybox.umd.min.js',
    css: '/libs/fancybox/fancybox.min.css'
  }
})
```

::: warning 本地化注意事项
- 本地路径以 `/` 开头，对应 `public/` 目录根
- 升级 Fancybox 版本时需重新下载文件
- 本地化后无法享受 CDN 的全球加速，但稳定性最高
:::

---

## 用户配置：inject.header

`themeConfig.inject.header` 是一个 VitePress `HeadConfig[]` 数组，会被注入到所有页面的 `<head>` 中。它是引入远程 CSS、字体、图标库、皮肤，以及 SEO meta、Open Graph、favicon 等标签的统一入口。

字段定义详见 [配置详解 - inject](../../config/inject.md)。本节聚焦实战用法。

### HeadConfig 格式

数组中每个元素是一个三元组：

```ts
;[标签名, 属性对象, 内容?]
```

- `标签名`：HTML 标签名，如 `'link'`、`'meta'`、`'script'`。
- `属性对象`：标签的属性键值对。
- `内容`（可选）：标签的文本内容，用于 `<script>` 内联代码等。

### 常见用法

| 场景 | 标签 | 示例 |
| --- | --- | --- |
| 远程字体 CDN | `link` | `<link rel="stylesheet" href="...">` |
| 远程图标库（Font Awesome） | `link` | `<link rel="stylesheet" href="...font-awesome.min.css">` |
| 远程图标库（iconfont） | `link` | `<link rel="stylesheet" href="//at.alicdn.com/...">` |
| 远程皮肤 CSS | `link` | `<link rel="stylesheet" href="/skins/dark.css">` |
| favicon | `link` | `<link rel="icon" href="/favicon.ico">` |
| SEO meta | `meta` | `<meta name="description" content="...">` |
| Open Graph | `meta` | `<meta property="og:title" content="...">` |
| 防盗链 | `meta` | `<meta name="referrer" content="no-referrer">` |
| 内联脚本 | `script` | `['script', {}, 'console.log("hi")']` |

### 完整示例

```ts
// themeConfig.ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export default defineThemeConfig({
  inject: {
    header: [
      // favicon
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      // 远程字体（Google Fonts）
      [
        'link',
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap'
        }
      ],
      // Font Awesome 图标库
      [
        'link',
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/css/all.min.css'
        }
      ],
      // 防盗链（防止图片被其他站点引用时暴露 referrer）
      ['meta', { name: 'referrer', content: 'no-referrer' }],
      // SEO
      ['meta', { name: 'description', content: '个人技术博客' }],
      // Open Graph（社交分享时展示的卡片信息）
      ['meta', { property: 'og:site_name', content: 'My Blog' }],
      ['meta', { property: 'og:type', content: 'website' }]
    ]
  }
  // ...其余配置
})
```

::: warning 数组整体替换
`inject.header` 是数组字段，会整体替换默认值（defu 对数组是 concat 合并，但主题默认值为空数组 `[]`）。你写入的每一项都会被注入到 `<head>` 中，不会与默认值冲突。
:::

### 常见配置场景

#### 引入 Google Fonts

```ts
inject: {
  header: [
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&family=Inter:wght@400;600&display=swap'
      }
    ]
  ]
}
```

::: tip 中国大陆访问 Google Fonts
Google Fonts 在中国大陆可能无法直接访问。可使用以下替代方案：
- **Google Fonts 镜像**：将 `fonts.googleapis.com` 替换为 `fonts.googleapis.cn`
- **本地化字体**：下载字体文件到 `public/fonts/`，用 `@font-face` 自行引入
- **使用主题内置字体**：主题已内置多款字体，详见 [字体管理](./fonts.md)
:::

#### 引入 Font Awesome

```ts
inject: {
  header: [
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6/css/all.min.css'
      }
    ]
  ]
}
```

引入后即可在 Markdown 或 Vue 组件中使用：

```html
<i class="fa-solid fa-house"></i> 首页
<i class="fa-brands fa-github"></i> GitHub
```

#### 引入 iconfont（阿里巴巴图标库）

```ts
inject: {
  header: [
    [
      'link',
      {
        rel: 'stylesheet',
        href: '//at.alicdn.com/w/font_xxxxxx_yyyyyy/iconfont.css'
      }
    ]
  ]
}
```

::: warning iconfont 项目地址
iconfont 的 URL 需要在 [iconfont.cn](https://www.iconfont.cn/) 创建自己的图标项目后获取，不能直接复制他人的地址。
:::



---

## CDN 故障排查

### 症状：图片灯箱不工作

**可能原因**：Fancybox CDN 加载失败

**排查步骤**：

1. 打开浏览器 DevTools → Network 面板
2. 筛选 `fancybox`，查看 JS/CSS 是否加载成功（状态码 200）
3. 若加载失败（404 或超时）：
   - 切换 CDN 源（jsdelivr → unpkg → cdnjs）
   - 或改为本地路径（见上文「本地化 CDN 资源」）

### 症状：统计数字不显示

**可能原因**：不蒜子或 51.la 服务不可用

**排查步骤**：

1. 不蒜子（`busuanzi.ibruce.info`）是免费公共服务，偶有宕机，属正常现象
2. 51.la 需在 `themeConfig.tongji.LA.ck` 中配置正确的 ck 值
3. 若长期不需要统计，可在 `themeConfig.aside.siteData.enable` 设为 `false` 关闭站点数据 widget

### 症状：字体未应用

**可能原因**：Google Fonts 被墙或 CDN 不稳定

**排查步骤**：

1. 改用 `fonts.googleapis.cn` 镜像
2. 或下载字体到 `public/fonts/` 本地化
3. 或使用主题内置字体（详见 [字体管理](./fonts.md)）

---

## 外部资源加载顺序

主题在页面加载时，会按以下顺序初始化外部资源：

```
1. VitePress 核心 CSS/JS（框架基础）
   ↓
2. themeConfig.inject.header（用户的 head 注入）
   ↓
3. 主题 CSS（样式渲染）
   ↓
4. 主题 JS（组件挂载）
   ↓
5. Fancybox（首次点击图片时懒加载）
   ↓
6. Twikoo（评论组件挂载时初始化）
   ↓
7. 不蒜子统计（站点数据 widget 渲染时加载）
```

::: tip 懒加载策略
Fancybox 采用懒加载策略 —— 只有当用户首次点击图片时才会加载 Fancybox 的 JS/CSS，避免首屏加载不必要的资源。Twikoo 虽然源码已打包，但评论数据的 fetch 请求会在评论组件进入视口时才触发。
:::



---


| 资源类型 | 内置方式 | 用户需要做什么 |
| --- | --- | --- |
| Fancybox 灯箱 | 默认 CDN，可覆盖 | 通常无需操作；CDN 不稳时改源或本地化 |
| Twikoo 评论 | 源码打包 | 配置 `comment.twikoo.envId` |
| Meting 音乐 | 默认 API，可覆盖 | 配置 `music.id` / `music.server`；建议自建 API |
| 不蒜子统计 | 硬编码加载 | 无需操作；不需要时关闭 `aside.siteData` |
| 51.la 统计 | 硬编码加载 | 配置 `tongji.LA.ck` |
| 字体 / 图标库 / favicon | 用户通过 `inject.header` 配置 | 按需引入 |


