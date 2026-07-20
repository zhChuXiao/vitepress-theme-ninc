# 主题配置详解

本页讲解 `themeConfig.ts` 的写法、`defineThemeConfig` 的深合并机制，以及如何覆盖默认主题配置。理解这套机制后，你只需声明「想改的字段」，其余字段会自动沿用主题内置默认值，无需从零编写完整配置。

如果你还未跑起来项目，请先阅读 [快速上手](./quick-start.md)。

## themeConfig.ts 的作用

`themeConfig.ts` 是你与主题对话的「外观与功能层」配置文件。它通过 `defineThemeConfig` 工厂函数包装你传入的配置对象，再交由 `defineConfig` 透传给主题运行时。

引入路径固定为 `vitepress-theme-ninc/defineThemeConfig`：

```ts
// themeConfig.ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  // 仅声明需要覆盖的字段
  siteMeta: {
    title: '我的博客',
    description: '记录生活与技术'
  }
})
```

::: tip 与 .vitepress/config.mts 的分工
`config.mts` 中的 `defineConfig` 决定「怎么构建」（注入 Vite 插件、RSS、PWA 等），而 `themeConfig.ts` 中的 `defineThemeConfig` 决定「长什么样、有什么功能」（导航、评论、搜索、音乐、侧边栏等）。详见 [配置详解](./configuration.md#双工厂配置体系)。
:::

## defu 深合并机制

`defineThemeConfig` 内部使用 [defu](https://github.com/unjs/defu) 将你的配置与主题内置的 `defaultThemeConfig` 进行**递归深合并**。它遵循三条核心规则：

1. **用户配置覆盖默认值**：同名字段以用户传入的为准。
2. **嵌套对象递归合并**：`siteMeta.author.name` 这种多层结构会逐层合并，未声明的子字段保持默认。
3. **数组为 concat 拼接**：数组类型字段（如 `nav`、`inject.header`、`cover.showCover.defaultCover`）会与默认值**拼接**（用户项在前、默认项在后），而非整体替换。

::: warning 因为数组是拼接，内容型数组默认值必须为空
正因 `defu` 会拼接数组，主题把 `nav`、`navMore`、`inject.header`、`cover.showCover.defaultCover`、`aside.welcome.address`、`friends.comments.message`、`footer.social/badge/sitemap` 等「内容型数组」的默认值全部设为 `[]`。**这些字段不会开箱带默认数据**，需要你自行填写。若默认值非空，你的配置会被重复拼接到默认项之后。
:::

这意味着：标量/对象字段你只需关心「想改哪一段」，未声明就保持默认；数组字段则需完整给出你想要的内容。

### 合并示例

假设默认配置为：

```ts
// 主题内置 defaultThemeConfig（节选）
const defaultThemeConfig = {
  siteMeta: {
    title: 'Blog',
    description: 'A blog',
    author: { name: 'Anonymous', email: '', link: '' }
  },
  nav: [
    { text: '首页', link: '/' }
  ],
  postSize: 10
}
```

你只声明以下配置：

```ts
defineThemeConfig({
  siteMeta: {
    title: '示例博主',
    author: { name: '示例博主' }
  },
  nav: [
    { text: '文库', items: [{ text: '文章列表', link: '/pages/archives' }] }
  ]
})
```

最终合并结果为：

```ts
{
  siteMeta: {
    title: '示例博主',          // ← 用户覆盖
    description: 'A blog',       // ← 沿用默认
    author: { name: '示例博主', email: '', link: '' }  // ← author 递归合并
  },
  nav: [                          // ← 数组整体替换（不会和默认拼接）
    { text: '文库', items: [...] }
  ],
  postSize: 10                    // ← 沿用默认
}
```

## 覆盖策略

### 覆盖嵌套对象的某个字段

只需沿着路径声明到目标层，未提及的兄弟字段保留默认。例如只想改 `siteMeta.author.name`：

```ts
defineThemeConfig({
  siteMeta: {
    author: { name: '示例博主' }
    // author.email、author.link 自动沿用默认
  }
})
```

::: warning 不要写空对象占位
无需为了「补全层级」而写空对象。`defu` 会自动沿默认层级合并，缺省的层级会从默认值中补齐。
:::

### 完全替换数组

数组的合并语义是「替换而非拼接」。若你想自定义 `nav`，直接写完整的新数组即可，默认的导航项不会残留：

```ts
defineThemeConfig({
  nav: [
    { text: '文库', items: [
      { text: '文章列表', link: '/pages/archives', icon: 'article' },
      { text: '全部分类', link: '/pages/categories', icon: 'folder' }
    ] },
    { text: '关于', link: '/pages/about' }
  ]
})
```

### 关闭某个功能模块

多数功能模块通过 `enable: false` 关闭，而不是删除字段。例如关闭评论与音乐播放器：

```ts
defineThemeConfig({
  comment: { enable: false },
  music: { enable: false }
})
```

## 顶层字段总览

`defineThemeConfig` 接收的对象支持以下顶层字段。每个字段的详细子字段说明请参考 `/config/` 目录下对应的配置文档。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `siteMeta` | `object` | 站点元信息：标题、描述、头像、logo、站点地址、作者信息等 |
| `homeTop` | `object` | 首页顶部区域：主标题、副标题、横幅、快捷分类入口 |
| `icp` | `string` | ICP 备案号，显示在页脚 |
| `since` | `string` | 建站日期（如 `2023-11-28`），用于页脚版权年份计算 |
| `postSize` | `number` | 文章列表每页文章数，控制分页大小 |
| `aiSummary` | `object` | AI 文章摘要：构建时调用大模型为文章自动生成摘要 |
| `settingButton` | `boolean` | 是否显示左下角个性化设置按钮 |
| `inject` | `object` | 全局注入内容，`header` 为 VitePress head 标签数组 |
| `nav` | `array` | 顶部导航栏菜单项 |
| `navMore` | `array` | 折叠的「更多」导航项（侧边展开的链接列表） |
| `travellings` | `object` | 开往友链接力：导航栏「开往」按钮，点击随机跳转至参与计划的博客 |
| `about` | `object` | 关于本站页面内容：头像技能标签、介绍、追求、技能、项目、座右铭 |
| `cover` | `object` | 文章封面配置：双栏布局、封面布局方式、默认封面图列表 |
| `footer` | `object` | 页脚配置：社交链接、徽标、站点地图 |
| `comment` | `object` | 评论系统配置（Twikoo） |
| `aside` | `object` | 侧边栏模块：站点简介、微信二维码、欢迎语、目录、标签、倒计时、站点数据 |
| `friends` | `object` | 友链相关：朋友圈、动态友链、留言板 |
| `equipment` | `object` | 「我的装备」页面数据 |
| `nes` | `object` | NES 模拟器：内置红白机模拟器页面，支持游戏选择、存档、TAS 录像 |
| `music` | `object` | 音乐播放器配置：API 地址、歌单 ID、服务商 |
| `search` | `object` | Algolia 站内搜索配置：appId / apiKey / indexName |
| `rewardData` | `object` | 打赏二维码：微信、支付宝图片地址 |
| `fancybox` | `object` | 图片灯箱配置：JS / CSS CDN 地址 |
| `jumpRedirect` | `object` | 外链中转跳转配置：排除类名列表 |
| `tongji` | `object` | 站点统计代码配置（如 51la） |

## 快速字段说明

以下四个标量字段配置简单但作用明确，集中说明如下：

### icp

ICP 备案号，显示在页脚版权信息区域。仅适用于在中国大陆境内提供服务的网站。

```ts
export const themeConfig = defineThemeConfig({
  icp: '京ICP备12345678号-1'
})
```

![ICP 备案号](/images/article/icp.png)

未填写时页脚不显示备案信息。填写后页脚会渲染为带链接的备案号，点击跳转至工信部备案查询系统。

### since

站点创建年份，用于页脚版权年份计算。格式为 `YYYY-MM-DD` 或 `YYYY`。

```ts
export const themeConfig = defineThemeConfig({
  since: '2024-01-01'
})
```

页脚会显示 `© 2024 - 当前年份`（如当前是 2026 年，则显示 `© 2024 - 2026`）。若 `since` 与当前年份相同，则只显示一个年份。

### postSize

首页文章列表每页显示的文章数量，同时控制分页路由 `page/[num].paths.mjs` 的分页生成。

```ts
export const themeConfig = defineThemeConfig({
  postSize: 10
})
```
默认 10 篇。文章总数超过 `postSize` 时，首页底部出现分页导航，分页页面由 `page/[num].paths.mjs` 动态生成。修改此值后需同时确认 `page/[num].paths.mjs` 中的分页逻辑与之匹配。

![文章列表每页显示的文章数量](/images/article/postSize.png)


### settingButton

是否显示左下角个性化设置按钮。

```ts
export const themeConfig = defineThemeConfig({
  settingButton: true
})
```

启用后，页面左下角出现齿轮图标按钮，点击弹出设置面板，可切换：
- 主题模式（亮色/暗色/跟随系统）
- 字体大小
- 其他个性化选项

设置项持久化存储在浏览器的 `localStorage`，下次访问时自动恢复。

![个性化设置按钮](/images/article/settingButton.png)

## 配置示例

### 最小配置

仅设置站点基本信息，即可让博客跑起来：

```ts
// themeConfig.ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  siteMeta: {
    title: '我的博客',
    description: '记录生活与技术',
    site: 'https://example.com',
    avatar: '/images/avatar.jpg',
    logo: '/images/logo.png'
  },
  // 建站日期，用于页脚版权年份
  since: '2024-01-01',
  // 每页显示 10 篇文章
  postSize: 10
})
```

### 完整配置片段

下面是一份覆盖多个模块的完整示例，可直接复制后按需修改：

```ts
// themeConfig.ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  // 站点信息
  siteMeta: {
    title: '示例博主',
    description: '以乐观为笔，绘就多彩生活。',
    avatar: '/images/avatar.svg',
    logo: '/images/logo.svg',
    site: 'https://example.com',
    base: '/',
    lang: 'zh-CN',
    author: {
      name: '示例博主',
      cover: '/images/logo.svg',
      email: 'demo@example.com',
      link: 'javascript:void(0)'
    }
  },

  // 首页顶部
  homeTop: {
    title: '以乐观为笔',
    subtitle: '绘就多彩生活。',
    link: 'example.com',
    banner: {
      tip: '其他站点：',
      title: 'Apple设备编年史 | MacDb.cn',
      image: '/images/apple-1.webp',
      darkImage: '/images/apple-1.webp',
      recommendUrl: 'https://macdb.cn/',
      newTab: true
    },
    category: [
      {
        name: '键值码大全',
        path: '/pages/utils/allKeyCode',
        shadow: 'var(--main-shadow-blue)',
        icon: 'icon-daima',
        class: 'blue'
      }
    ]
  },

  // 备案与建站日期
  icp: '',
  since: '2023-11-28',

  // 分页与设置按钮
  postSize: 10,
  settingButton: false,

  // 头部注入（favicon、字体、统计等）
  inject: {
    header: [
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      ['meta', { name: 'referrer', content: 'no-referrer' }],
      ['meta', { name: 'author', content: '示例博主' }],
      [
        'meta',
        {
          name: 'description',
          content: '以乐观为笔，绘就多彩生活。'
        }
      ]
    ]
  },

  // 顶部导航栏
  nav: [
    {
      text: '文库',
      items: [
        { text: '文章列表', link: '/pages/archives', icon: 'article' },
        { text: '全部分类', link: '/pages/categories', icon: 'folder' },
        { text: '全部标签', link: '/pages/tags', icon: 'hashtag' }
      ]
    },
    {
      text: '我的',
      items: [
        { text: '留言板', link: '/pages/comments', icon: 'chat' },
        { text: '关于本站', link: '/pages/about', icon: 'contacts' }
      ]
    }
  ],

  // 封面配置
  cover: {
    twoColumns: true,
    showCover: {
      enable: true,
      coverLayout: 'both',
      defaultCover: [
        '/images/cover/003405.jpeg',
        '/images/cover/235950.jpeg',
        '/images/cover/003655.jpeg'
      ]
    }
  },

  // 评论（Twikoo）
  comment: {
    enable: true,
    twikoo: {
      envId: 'https://tk.example.com/',
      lang: 'zh-CN'
    }
  },

  // 侧边栏
  aside: {
    hello: { enable: true, text: '这里记录开发相关的分享。' },
    toc: { enable: true },
    tags: { enable: true },
    countDown: { enable: true, data: { name: '春节', date: '2027-02-06' } },
    siteData: { enable: true }
  },

  // 搜索（Algolia）
  search: {
    enable: true,
    appId: 'YOUR_APP_ID',
    apiKey: 'YOUR_API_KEY',
    indexName: 'YOUR_INDEX_NAME'
  },

  // 音乐播放器
  music: {
    enable: true,
    url: 'https://metingapi.example.com/api',
    id: 13664452049,
    server: 'netease',
    type: 'playlist'
  },

  // 打赏
  rewardData: {
    enable: true,
    wechat: '/images/reward-wechat.png',
    alipay: '/images/reward-alipay.png'
  },

  // 图片灯箱
  fancybox: {
    enable: true,
    js: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5/dist/fancybox/fancybox.umd.min.js',
    css: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5/dist/fancybox/fancybox.min.css'
  },

  // 外链中转
  jumpRedirect: {
    enable: true,
    exclude: ['social-link', 'link-card', 'post-link']
  }
})
```

::: warning 数组字段必须完整
上例中的 `nav`、`inject.header`、`cover.showCover.defaultCover`、`jumpRedirect.exclude` 都是数组，**会整体替换默认值**。请确保写入你需要的完整列表，不要假设会与默认项拼接。
:::




