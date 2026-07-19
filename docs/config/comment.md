# comment 评论

配置文章页评论系统。本主题集成 Twikoo 评论系统，由 `enable` 统一开关。Twikoo 是一款开源自部署的评论服务，数据完全由自己掌控，部署与使用方式参考 [Twikoo 文档](https://twikoo.js.org/)。

![评论配置文档页](/images/article/comment.png)

## 字段说明

### comment 主表

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | 是否启用评论系统 |
| `twikoo` | `TwikooConfig` | 见下方子表 | Twikoo 评论配置 |

### twikoo 子表（TwikooConfig）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `envId` | `string` | `''` | Twikoo 环境 ID 或服务地址 |
| `region` | `string?` | — | 地域（如 `ap-shanghai`），仅云函数部署时使用 |
| `lang` | `string?` | `'zh-CN'` | 评论界面语言 |

## 示例

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  comment: {
    enable: true,
    twikoo: {
      envId: 'https://your-twikoo-env.vercel.app/',
      lang: 'zh-CN'
    }
  }
})
```

## 渲染效果

---

`comment` 渲染在文章正文末尾，启用后展示完整的 Twikoo 评论区：

- **评论输入框**：顶部为昵称/邮箱/网站输入区与正文 textarea，访客信息写入 `localStorage["twikoo"]`。
- **评论列表**：按时间倒序展示已发布评论，包含头像、昵称、楼层、内容与时间。
- **回复交互**：每条评论支持嵌套回复，形成树状讨论结构。
- **管理入口**：博主可通过 Twikoo 后台管理评论、标记垃圾评论、设置关键词过滤。

::: tip 常见配置组合
- **个人博客轻量评论**：Vercel 部署 Twikoo + `lang: 'zh-CN'`，零成本即可启用。
- **多语言站点**：根据 `siteMeta.lang` 同步设置 `twikoo.lang`（如 `en`、`zh-TW`）。
- **高可用部署**：腾讯云 CloudBase 部署 + 填写 `region`，搭配云数据库备份。
:::

::: warning 反垃圾与邮件通知
Twikoo 支持配置垃圾评论过滤（Akismet）与邮件通知（SMTP），需在 Twikoo 后台「配置管理」中单独设置，不在主题配置范围内。建议启用以避免垃圾评论泛滥。
:::

## 注意事项

::: warning 使用前需自建 Twikoo 服务
Twikoo 为开源自部署方案，使用前需先部署服务端。常见部署方式：
- **Vercel 部署**：Fork Twikoo 仓库后一键部署到 Vercel，部署完成后将得到的访问地址填入 `twikoo.envId`。
- **腾讯云 CloudBase 部署**：基于云函数部署，参考 [Twikoo 文档](https://twikoo.js.org/) 中的「云函数部署」章节。
:::

::: tip envId 的填写方式
`twikoo.envId` 的取值取决于部署方式：
- **Vercel 部署**：填部署后的访问地址（如 `https://your-twikoo-env.vercel.app/`）。
- **CloudBase 云函数部署**：填腾讯云 CloudBase 的环境 ID（形如 `env-xxxxxxxx`）。
:::

::: warning region 仅云函数部署时使用
`twikoo.region` 仅在使用腾讯云 CloudBase 云函数部署 Twikoo 时需要填写，取值为地域标识（如 `ap-shanghai`、`ap-guangzhou`）。使用 Vercel 部署时无需填写该字段。
:::

::: tip enable 为总开关
`comment.enable` 控制评论系统的整体启停。设为 `false` 时文章页不会渲染任何评论组件，即使 `twikoo.envId` 已填写也不会发起请求。
:::

> 配置会与默认值深合并，只需填写想修改的字段，详见 [主题配置详解 - defu 深合并机制](../guide/theme-config#defu-深合并机制)。

::: warning 自定义样式需使用 #twikoo 选择器
主题加载的是 `twikoo/dist/twikoo.nocss.js`（无 CSS 版本），Twikoo 自身的样式由主题包统一加载与定制。如需覆盖评论样式，应使用 `#twikoo` 选择器编写自定义 SCSS，并在主题样式之后导入，否则可能被主题样式覆盖。

```scss
#twikoo {
  .tk-input .el-textarea__inner {
    border-radius: 12px;
  }
}
```
:::

::: tip 用户信息存储位置
访客在评论框中填写的昵称、邮箱、网站等信息由 Twikoo 写入浏览器本地存储，键名为 `localStorage["twikoo"]`。清除该键即可重置访客信息。
:::

## 相关配置

- [`aside` 侧边栏](./aside.md) — 文章页侧边栏模块配置
- [`rewardData` 打赏](./reward.md) — 文章页打赏二维码配置
- [`fancybox` 灯箱](./fancybox.md) — 文章页图片灯箱配置
