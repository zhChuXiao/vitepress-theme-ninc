# 配置导览

主题内置的默认配置已经能跑起来一个完整的博客。但你想让它真正成为「你的」博客 —— 换头像、配导航、开评论 —— 就需要了解这些配置模块。

本页按使用场景分组，带你逐个认识 `themeConfig` 的全部配置项。得益于 defu 深合并机制，你只需声明想改的字段，其余自动沿用默认值，不必把整个配置抄一遍。

各模块的完整字段表请参考 [配置参考](/config/site-meta)，本页侧重「怎么用」。

## 站点门面

### siteMeta — 站点信息

博客的「身份证」：标题、描述、头像、logo、作者信息。这些信息出现在浏览器标签页、导航栏、页脚、RSS 订阅和搜索引擎结果中。

- `avatar` 显示在侧边栏和关于页，`logo` 显示在导航栏站点名左侧
- `site` 是完整域名，用于 RSS、SEO 和外链中转
- 图片放在 `public/images/` 下，路径以 `/` 开头

完整字段说明见 [siteMeta 配置](/config/site-meta)。

---
### homeTop — 首页顶部

访客打开博客第一眼看到的区域：主标题、副标题、推荐横幅、快捷分类入口、技能图标动画。

- `banner` 是首页的推荐横幅卡片，点击跳转指定链接
- `category` 是快捷分类入口，点击直达对应页面
- `creativity` 是技能图标数据，首页顶部和关于页面共用。图片缺失时自动显示名称首字母

详见 [homeTop 配置参考](/config/home-top)。

---

### nav — 导航栏

顶部导航菜单，支持下拉分组。

`icon` 对应 iconfont 图标类名，主题已内置一套常用图标。详见 [nav 配置参考](/config/nav)。

---

### navMore — 更多菜单

左下角折叠的快捷链接面板，适合放外部站点入口和工具集。

`iconType` 为 `img` 时 `icon` 是图片路径，为 `iconfont` 时是图标类名。详见 [navMore 配置参考](/config/nav-more)。

---

## 文章体验

### cover — 文章封面

控制首页文章列表是否显示封面图、布局方式（单栏/双栏）和默认封面。

文章 frontmatter 中可通过 `cover` 字段指定单独的封面图。详见 [cover 配置参考](/config/cover)。

---

### aside — 侧边栏

文章页右侧的模块化侧边栏，每个模块可独立开关。

各模块说明：

| 模块 | 作用 |
| --- | --- |
| `hello` | 站点简介卡片 |
| `wechat` | 微信二维码 |
| `welcome` | 博主欢迎语 + 坐标地图 |
| `toc` | 文章目录 |
| `tags` | 标签云 |
| `countDown` | 倒计时 |
| `siteData` | 站点统计（文章数、标签数、建站天数） |

详见 [aside 配置参考](/config/aside)。

---

### postSize — 分页大小

首页文章列表每页显示数量。默认 10 篇，超出后底部出现分页导航。

完整字段说明见 [主题配置 - 顶层字段总览](/guide/theme-config#顶层字段总览)。

## 互动功能

### comment — 评论

基于 Twikoo 的评论系统，支持文章页和留言板。

`envId` 是 Twikoo 环境地址，参考 [Twikoo 文档](https://twikoo.js.org/) 部署自己的环境。设为 `enable: false` 可完全关闭评论。详见 [comment 配置参考](/config/comment)。

---

### search — 全站搜索

基于 Algolia DocSearch 的全站搜索。

需要在 [Algolia](https://www.algolia.com/) 申请账号并配置爬虫。详见 [search 配置参考](/config/search)。

---

### rewardData — 打赏

文章底部的微信/支付宝打赏二维码。

完整字段说明见 [rewardData 配置](/config/reward)。

---

### friends — 友链与留言板

留言板的信封动画和欢迎语配置。

详见 [friends 配置参考](/config/friends)。

---

## 视觉增强

### footer — 页脚

页脚的社交链接、徽标和站点地图。

详见 [footer 配置参考](/config/footer)。

---

### fancybox — 图片灯箱

点击文章中的图片弹出大图查看。

默认启用，CDN 地址可替换为自己偏好的镜像。详见 [fancybox 配置参考](/config/fancybox)。

---

### music — 音乐播放器

左下角悬浮的音乐播放器，基于 Meting API。

详见 [music 配置参考](/config/music)。

---

### equipment — 装备页

「我的装备」页面数据。默认为空对象 `{}`，需自行按 `Equipment` 组件约定的结构配置。

详见 [equipment 配置参考](/config/equipment)。

---

## SEO 与工程

### inject — 全局注入

向所有页面的 `<head>` 注入标签，用于 favicon、字体、SEO meta、CDN 样式等。

详见 [inject 配置参考](/config/inject)。

### jumpRedirect — 外链中转

将站内外链转为中转跳转，避免直接暴露目标 URL。启用后主题会自动注入中转页（dev 拦截 `/redirect`、build 输出 `redirect.html`），无需手动创建任何路由文件。中转页内置域名白/黑名单：白名单站点显示「已信任」并自动跳转，黑名单站点显示危险警告。

::: tip 开发环境也可访问中转页
中转页本身在 dev 与 build 均可直接访问 `/redirect?url=<base64>`。但链接的**自动改写**（把外链 href 替换为中转地址）仅在生产环境生效，开发环境保持原链接以便调试。
:::

::: warning exclude / whitelist / blacklist 会整体替换默认值
由于 `defu` 对数组合并的策略，传入这三个数组时都会**整体替换**默认数组而非追加。新增项时务必把默认项一并写入，完整默认值见 [jumpRedirect 配置参考](/config/jump-redirect)。
:::

详见 [jumpRedirect 配置参考](/config/jump-redirect)。

### tongji — 站点统计

目前支持 51la 统计，仅生产环境注入。

详见 [tongji 配置参考](/config/tongji)。

### icp / since / settingButton

三个标量配置项集中说明：`icp` 为备案号（为空则页脚不显示），`since` 为建站日期（用于页脚版权年份），`settingButton` 控制左下角个性化设置按钮是否显示。

完整字段说明见 [主题配置 - 顶层字段总览](/guide/theme-config#顶层字段总览)。
