# siteMeta 站点信息

配置站点的元信息，包括标题、描述、头像、Logo、站点地址、语言以及作者信息等，用于站点展示、SEO 与 RSS 生成。

## 字段说明

### siteMeta 主表

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `'My Blog'` | 站点标题，显示在浏览器标签页与站点头部 |
| `description` | `string` | `'powered by ninc'` | 站点描述，用于 SEO meta 与 RSS |
| `avatar` | `string` | 见下方 | 站点头像路径，指向 `public` 目录下的文件或任意可访问的网络图片；侧边栏 Clock 中心头像、关于页头像等共用此字段 |
| `logo` | `string` | `''` | 站点 Logo 路径，指向 `public` 目录下的文件；留空则不显示 Logo |
| `site` | `string` | `'https://example.com'` | 站点完整地址，用于 SEO、RSS 与社交分享卡片 |
| `base` | `string` | `'/'` | VitePress `base` 路径，需与 VitePress 配置保持一致 |
| `lang` | `string` | `'zh-CN'` | 站点语言，影响 `<html lang>` 属性 |
| `author` | `AuthorInfo` | 见下方子表 | 作者信息对象 |

::: tip avatar 默认值
`http://blog.ninc.top/images/cxLogo/avatar2.jpg`（作者自己的头像，替换方法见说明列）
:::

### author 子表

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | `'Your Name'` | 作者名称 |
| `cover` | `string?` | 同 `avatar` | 作者头像，**侧边栏 Clock 中心头像优先使用此字段**，未配置时回退到 `siteMeta.avatar`；替换方法：把图片放到 `public/images/` 下，改为 `'/images/your-avatar.jpg'` |
| `email` | `string?` | `'you@example.com'` | 作者邮箱，用于联系与 RSS；同时作为侧边栏 `hello` 卡片邮箱图标的链接 |
| `link` | `string?` | `''` | 作者主页链接（如 GitHub 个人主页），同时作为侧边栏 `hello` 卡片 GitHub 图标与页脚作者名的链接；未配置时为空链接 |

::: tip 📌 Clock 中心头像配置
侧边栏 `hello` 卡片中的 Clock 动画中心头像通过 `siteMeta.author.cover` 配置，未配置时回退到 `siteMeta.avatar`。这两个字段都默认使用主题作者自己的头像，让新项目开箱即用。**这不是写死的**，请按上面表格中的说明替换为自己的头像。
:::

## 示例

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  siteMeta: {
    title: '南风志',
    description: '记录前端开发与生活随笔的个人博客',
    avatar: '/images/avatar.png',   // 自行提供，需放在 public/images/avatar.png
    logo: '/images/logo.png',       // 自行提供，需放在 public/images/logo.png
    site: 'https://example.com',
    base: '/',
    lang: 'zh-CN',
    author: {
      name: '南风',
      cover: '/images/avatar.png',
      email: 'demo@example.com',
      link: 'https://example.com/about'
    }
  }
})
```

## 渲染效果

---

`siteMeta` 中的字段会在站点多处同步渲染，理解其作用范围有助于一次性配置到位：

- **浏览器标签页**：`title` 作为页面标题，搭配 [`inject.header`](./inject.md) 默认注入的 `/favicon.ico`（`logo` 作为站点图标）。
- **站点头部**：`title` 与 `logo` 组成顶部品牌区，`avatar` 用于作者相关卡片。
- **页脚区域**：`author.name` 与 `site` 用于版权信息与 RSS 链接生成。
- **SEO 卡片**：`title`、`description`、`site`、`avatar` 共同决定 Open Graph 与 Twitter Card 的分享卡片样式。
- **RSS 订阅**：`site`、`author.email`、`lang` 参与生成 RSS channel 元信息。

::: tip 常见配置组合
- **个人博客**：`title` 与 `author.name` 保持一致风格，`avatar` 使用清晰正方形头像，`site` 填写 Pages 部署地址。
- **团队站点**：`title` 填写站点名，`author` 填写主理人，`logo` 使用团队徽标，`author.cover` 单独设置团队封面。
:::

## 注意事项

::: warning 资源需自行准备
`avatar` 与 `logo` 默认为空字符串，主题不预置任何图片。请将图片放到 `public/images/` 下，再填入对应路径（不含 `public` 前缀）。例如文件位于 `public/images/avatar.png` 时，配置为 `/images/avatar.png`。留空时对应位置不渲染图片。
:::

::: warning base 与 VitePress 配置同步
`base` 字段必须与 VitePress 配置文件中 `defineConfig({ base })` 保持完全一致，否则将导致 RSS 链接、社交分享卡片等生成错误地址。
:::

::: tip site 用于 SEO 与 RSS
`site` 字段必须填写完整地址（包含协议 `https://` 且不要带末尾斜杠），它会被用于生成 RSS 订阅链接、Open Graph 与 Twitter Card 等元信息。
:::

::: tip author.link 与 author.email 用于侧边栏 hello 卡片社交入口
`author.link` 与 `author.email` 除了用于 RSS 与页脚版权区，还作为文章页侧边栏 `hello` 卡片的社交图标链接：

- `author.link` 填写后，点击 GitHub 图标跳转到配置的链接（通常填 GitHub 个人主页）。
- `author.email` 填写后，点击邮箱图标调起邮件客户端。
- 两者均默认为占位值，未配置时图标仍会展示但为空链接，建议替换为真实地址。

::: details 配置示例
```ts
author: {
  name: '南风',
  email: 'demo@example.com',
  link: 'https://github.com/your-username'
}
```
:::
:::

::: warning author.link 默认值为空
`author.link` 默认值为空字符串，未配置时页脚作者名与侧边栏 GitHub 图标会渲染为空链接。请在此填入你的 GitHub 主页地址以启用跳转。
:::

## 相关配置

- [`homeTop` 首页顶部区域](./home-top.md) — 首页标题与推荐站点横幅
- [`nav` 顶部导航栏](./nav.md) — 顶部导航菜单
- [`footer` 页脚](./footer.md) — 页脚社交链接与版权徽标
