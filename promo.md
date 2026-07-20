# vitepress-theme-ninc：给 VitePress 用的博客主题

用 VitePress 搭文档的人不少，但是搭建博客的人却寥寥无几，毕竟默认主题太素了。市面上的主题要么功能略有残缺，要么改起来费劲。我想要的是一个零基础可配置**装上就能用、不用折腾插件**的主题。

![首页](https://theme.ninc.top/images/image-dark.webp)

这个主题基于 imsyy/vitepress-theme-curve 二次开发。curve 的底子很好，我在此基础上做了大量重构和扩展：抽成 npm 包、重写配置系统、梳理使用文档、以及加了大量功能和样式，让它真正能开箱即用。

## 相关链接

- 文档：[https://theme.ninc.top](https://theme.ninc.top)
- 演示：[https://blog.ninc.top](https://blog.ninc.top)
- GitHub：[https://github.com/zhChuXiao/vitepress-theme-ninc](https://github.com/zhChuXiao/vitepress-theme-ninc)
- npm：[https://npmjs.com/package/vitepress-theme-ninc](https://www.npmjs.com/package/vitepress-theme-ninc)

## 快速开始

```bash
mkdir my-blog && cd my-blog
npx vitepress-theme-ninc init
```

init 是交互式的，方向键选择、回车确认。会询问站点标题、描述、域名、作者，以及是否启用评论、PWA、NES 模拟器等选项。选择完成后生成完整的项目结构：

```text
my-blog/
├─ .vitepress/
│  ├─ config.mts
│  ├─ theme/index.ts
│  └─ themeConfig.ts
├─ posts/articles/hello-world.md
├─ public/images/
└─ index.md
```

`pnpm install && pnpm dev`，打开 `http://localhost:5173` 就能看到博客页面。

![首页](https://theme.ninc.top/images/image-light.webp)

## 配置系统

配置基于 `defu` 深合并，只需要声明想修改的字段，其余沿用默认值：

```ts
// .vitepress/themeConfig.ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  siteMeta: {
    title: '我的博客',
    site: 'https://example.com',
  },
  comment: {
    enable: true,
    twikoo: { envId: 'https://your-twikoo.example.com' }
  }
})
```

主题升级时默认值会同步更新，用户侧的覆盖不受影响。配置拆分为 17 个模块，全部字段附带 TypeScript 类型提示。

## 功能

以下功能默认内置，不需要额外安装插件：

- Twikoo 评论系统，支持表情、图片、邮件通知、反垃圾
- 全站搜索，Algolia DocSearch 与本地搜索双模式
- APlayer + MetingJS 音乐播放器，支持网易云、QQ 音乐等平台
- AI 文章摘要，接入 OpenAI 兼容 API，构建期自动生成
- 文章加密，HMAC-SHA256 密码保护指定文章
- PWA 离线支持，自动生成 Service Worker
- Fancybox 图片灯箱，支持放大、缩放、拖拽
- RSS 订阅，构建时生成 rss.xml
- 暗色模式，跟随系统或手动切换
- 代码组图标，按语言自动匹配对应图标
- 自定义光标，三种状态适配明暗主题
- 外链中转，自动转换为跳转页保护隐私

NES 模拟器是个附带的功能。init 时选上会内置超级马里奥，支持存档读档、TAS 录像、双人键盘与手柄控制。
![文章页](https://theme.ninc.top/images/article/nes.png)

![文章页](https://theme.ninc.top/images/scrollShowcase/article-dark.png)

![关于页](https://theme.ninc.top/images/scrollShowcase/about-dark.png)

## Markdown 扩展

在标准 Markdown 之上扩展了几种容器和语法：

```
::: timeline 2024
- 01-01 发布 1.0
- 03-15 支持 AI 摘要
:::

::: button 去 GitHub
https://github.com/zhChuXiao/vitepress-theme-ninc
:::
```

包含时间线、单选卡片、CTA 按钮、信息卡片，以及 `%%k%%` 按键标记、标签页、属性语法、代码组图标。在 Markdown 文件中直接使用 `::: type` 语法即可，不需要写 HTML。

Vue 组件也可以直接嵌入 Markdown，`<script setup>` 语法照常使用。

## 已有 VitePress 项目

已有的 VitePress 项目三步接入：

```bash
pnpm add vitepress-theme-ninc
```

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-ninc'
export default Theme
```

```ts
// .vitepress/config.mts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from './themeConfig'

export default defineConfig(
  { sitemap: { hostname: 'https://your-site.com' } },
  themeConfig
)
```

新建 `.vitepress/themeConfig.ts` 填写站点信息，重启 dev server 即可。


MIT 协议，遇到问题欢迎提 Issue。
