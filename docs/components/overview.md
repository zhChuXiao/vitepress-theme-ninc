# 组件总览

> vitepress-theme-ninc 内置的全部组件与页面视图，按功能分类索引。
> 所有组件均在主题包 `src/client/components/` 与 `src/client/views/` 下，通过 `unplugin-vue-components` 自动注册，用户无需手动 import。

## 自动注册机制

主题包通过 `unplugin-vue-components` 扫描以下目录，自动注册所有 `.vue` 组件：

| 扫描目录 | 说明 |
|----------|------|
| `vitepress-theme-ninc/client/components/` | 主题包内置组件 |
| `vitepress-theme-ninc/client/views/` | 主题包内置页面视图 |
| `<你的项目>/.vitepress/theme/components/` | 用户自定义组件 |
| `<你的项目>/.vitepress/theme/views/` | 用户自定义视图 |

::: tip 在 Markdown 中使用
组件自动注册后，可在任意 `.md` 或 `.vue` 文件中直接使用，无需 import：

```vue
<SvgIcon name="github" />
```

也可通过 `@/` 别名导入主题组件（`@` 指向主题包 `src/client/`）：

```vue
<script setup>
import Home from '@/views/Home.vue'
</script>
```
:::

## 布局视图

位于 `views/` 目录，作为 VitePress 的 Layout 组件，由主题入口 `client/index.ts` 统一调度。

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| Home | `views/Home.vue` | 首页布局（文章列表 + 侧边栏 + 顶部区域） |
| Post | `views/Post.vue` | 文章详情页布局 |
| Page | `views/Page.vue` | 普通页面布局（无文章信息） |
| NotFound | `views/NotFoundPage/NotFound.vue` | 404 页面 |
| Redirect | `views/Redirect.vue` | 外链中转页 |
| Archives | `views/Archives.vue` | 归档页 |
| CatOrTag | `views/CatOrTag.vue` | 分类/标签页（动态路由） |
| Equipment | `views/Equipment.vue` | 装备展示页 |
| CommentsView | `views/CommentsView.vue` | 留言板页 |
| About | `views/About.vue` | 关于页 |
| Project | `views/Project.vue` | 项目展示页 |

## 首页顶部

位于 `views/home_top/`，构成首页顶部的展示区域。

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| HomeTop | `views/home_top/HomeTop.vue` | 顶部区域容器（标题 + 横幅 + 快捷分类） |
| TopGroup | `views/home_top/TopGroup.vue` | 顶部横幅推荐站点 |
| TagsGroupAll | `views/home_top/TagsGroupAll.vue` | 快捷分类入口标签组 |

## 导航与菜单

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| Nav | `components/Nav.vue` | 顶部导航栏（含下拉菜单与左侧更多菜单） |
| MobileMenu | `components/MobileMenu.vue` | 移动端汉堡菜单 |
| Pagination | `components/Pagination.vue` | 文章分页 |
| NextPost | `components/NextPost.vue` | 下一篇文章导航 |
| RelatedPost | `components/RelatedPost.vue` | 相关文章推荐 |
| ScrollProgress | `components/ScrollProgress.vue` | 页面滚动进度条 |
| RightMenu | `components/RightMenu.vue` | 右键上下文菜单 |
| Search | `components/Search.vue` | 全站搜索（Algolia） |
| Settings | `components/Settings.vue` | 左下角个性化设置面板 |

## 侧边栏

位于 `components/Aside/`，由 `Aside/index.vue` 统一调度各 Widget。

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| Aside | `components/Aside/index.vue` | 侧边栏容器 |
| Hello | `components/Aside/Widgets/Hello.vue` | 站点简介 |
| Welcome | `components/Aside/Widgets/Welcome.vue` | 欢迎信息（含地图） |
| Toc | `components/Aside/Widgets/Toc.vue` | 文章目录 |
| Tags | `components/Aside/Widgets/Tags.vue` | 标签云 |
| Countdown | `components/Aside/Widgets/Countdown.vue` | 倒计时 |
| SiteData | `components/Aside/Widgets/SiteData.vue` | 站点统计 |
| Clock | `components/Aside/Widgets/Clock.vue` | 时钟 |
| Date | `components/Aside/Widgets/Date.vue` | 日期 |
| ArticleGPT | `components/Aside/Widgets/ArticleGPT.vue` | 文章摘要（模仿 GPT 样式，内容手动填写） |
| WeiXinCark | `components/Aside/Widgets/WeiXinCark.vue` | 微信二维码卡片 |

## 文章相关

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| PostHeader | `views/PostHeader.vue` | 文章头部（标题 + 元信息 + 封面） |
| Copyright | `components/Copyright.vue` | 版权声明 |
| References | `components/References.vue` | 参考资料 |
| CryptoContent | `components/CryptoContent.vue` | 加密文章内容（密码验证后显示） |
| RewardBtn | `components/RewardBtn.vue` | 打赏按钮 |

## 列表

位于 `components/List/`。

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| PostList | `components/List/PostList.vue` | 文章列表项 |
| TypeBar | `components/List/TypeBar.vue` | 分类/标签筛选条 |

## 评论系统

位于 `components/Plugins/Comments/`。

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| Comments | `components/Plugins/Comments/index.vue` | 评论容器（Twikoo） |
| Twikoo | `components/Plugins/Comments/Twikoo.vue` | Twikoo 评论 |

## 多媒体与插件

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| Player | `components/Player.vue` | 音乐播放器（APlayer + MetingJS） |
| LottieIcon | `components/LottieIcon.vue` | Lottie 动画图标 |
| SvgIcon | `components/SvgIcon.vue` | SVG 雪碧图图标 |
| Banner | `components/Banner.vue` | 横幅广告位 |

::: tip 组件 Demo 不是独立组件
文章中的组件演示由 [vitepress-demo-plugin](https://www.npmjs.com/package/vitepress-demo-plugin) 以 Markdown 插件形式提供（在 `defineConfig` 内部通过 `md.use(vitepressDemoPlugin)` 注册），主题包内不存在 `Demo.vue` 文件。在 Markdown 中用 `::: demo` 容器即可嵌入交互式 demo，无需手动导入组件。
:::

## 页脚

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| Footer | `components/Footer.vue` | 页脚容器 |
| FooterAnimals | `components/FooterAnimals.vue` | 页脚动物动画 |
| FooterBadge | `components/FooterBadge.vue` | 页脚徽标（shields.io） |
| FooterLink | `components/FooterLink.vue` | 页脚站点地图链接 |

## 通用组件

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| Background | `components/Background.vue` | 背景装饰 |
| Badge | `components/Badge.vue` | 通用徽标 |
| Control | `components/Control.vue` | 控制面板 |
| LazyLoader | `components/LazyLoader.vue` | 懒加载容器 |
| Loading | `components/Loading.vue` | 加载动画 |
| LoadingCapsule | `components/LoadingCapsule.vue` | 胶囊加载动画 |
| MacCard | `components/MacCard.vue` | Mac 风格卡片 |
| Message | `components/Message.vue` | 全局消息提示 |
| Modal | `components/Modal.vue` | 模态框 |
| SafariMockUp | `components/SafariMockUp.vue` | Safari 浏览器模型框 |
| UtilPageTitle | `components/UtilPageTitle.vue` | 工具页标题 |

## 标签与卡片

位于 `components/Tags/`。

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| LinkCard | `components/Tags/LinkCard.vue` | 链接卡片 |
| LinkCardReprint | `components/Tags/LinkCardReprint.vue` | 转载链接卡片 |
| Checkbox | `components/Tags/Checkbox.vue` | 复选框标签 |
| Slider | `components/Tags/Slider.vue` | 滑块标签 |

## 工具页视图（不随主题包分发）

::: warning 工具页不在主题包内
以下工具页（NES 模拟器、代码对比、键码速查、KMS、妙控键盘、SCSS 转 CSS）**不随主题包分发**，仅作为本仓库 `blog/` 站点的演示内容存在。它们依赖的 `nes-vue`、`v-code-diff`、`sass.js`、`codejar` 等扩展依赖也未列入主题包。

若你希望实现类似功能，可参考 `blog/.vitepress/theme/views/util-pages/` 下的实现：在 `.vitepress/theme/views/` 下自行创建扩展页面组件，按需安装对应依赖，并在 Markdown 中显式导入使用。详见 [安装 - 关于扩展页面与小工具](../guide/installation.md#关于扩展页面与小工具)。
:::

下表列出 `blog/` 中的工具页组件，供参考实现：

| 组件 | blog 内路径 | 说明 |
|------|----------|------|
| AllKeyCode | `blog/.vitepress/theme/views/util-pages/AllKeyCode.vue` | 全键盘按键码速查 |
| CodeCompare | `blog/.vitepress/theme/views/util-pages/CodeCompare.vue` | 代码对比工具 |
| KmsWindows | `blog/.vitepress/theme/views/util-pages/KmsWindows.vue` | KMS 激活密钥查询 |
| MagicKeyboard | `blog/.vitepress/theme/views/util-pages/MagicKeyboard.vue` | Magic Keyboard 键位图 |
| NesGame | `blog/.vitepress/theme/views/util-pages/NesGame.vue` | NES 游戏模拟器 |
| SassToCssContainer | `blog/.vitepress/theme/views/util-pages/SassToCssContainer.vue` | SCSS 转 CSS 工具 |

## 404 页面

位于 `views/NotFoundPage/`。

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| NotFound | `views/NotFoundPage/NotFound.vue` | 404 主页面 |
| Code | `views/NotFoundPage/Code.vue` | 404 代码动画 |
| NotFoundNum | `views/NotFoundPage/NotFoundNum.vue` | 404 数字动画 |

## 覆盖组件

如需覆盖主题组件，请在 `.vitepress/theme/index.ts` 中扩展 Theme 对象：

```ts
import Theme from 'vitepress-theme-ninc'
import MyLayout from './MyLayout.vue'

export default {
  ...Theme,
  Layout: MyLayout
}
```

详见 [覆盖组件指南](/guide/override-components)。

## 相关文档

- [快速上手](/guide/quick-start)
- [覆盖组件](/guide/override-components)
- [Frontmatter 配置](/guide/frontmatter)
- [FAQ 常见问题](/faq)
