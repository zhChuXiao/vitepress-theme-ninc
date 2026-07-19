# rewardData 打赏

配置文章页打赏功能，支持展示微信与支付宝收款码图片，由 `enable` 控制是否显示打赏入口。同时可通过 `list` 字段维护赞赏者名单，在 `/pages/thanks` 页面展示。

![打赏配置文档页](/images/article/rewardData.png)

## 字段说明

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | 是否启用打赏 |
| `wechat` | `string` | `''` | 微信收款码图片路径，为空时使用主题内置默认图 |
| `alipay` | `string` | `''` | 支付宝收款码图片路径，为空时使用主题内置默认图 |
| `list` | `RewardListItem[]` | `[]` | 赞赏者名单，用于 `/pages/thanks` 页面展示 |

### list 数组项字段

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | — | 赞赏者昵称（必填） |
| `amount` | `number` | — | 赞赏金额（单位：元） |
| `message` | `string` | — | 赞赏留言 |
| `date` | `string` | — | 赞赏时间（如 `2024-12-01`） |
| `method` | `'wechat' \| 'alipay'` | — | 赞赏方式 |

## 示例

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  rewardData: {
    enable: true,
    wechat: '/images/reward-wechat.png',
    alipay: '/images/reward-alipay.png',
    list: [
      { name: '张三', amount: 6.66, method: 'wechat', message: '文章写得很好！', date: '2024-12-01' },
      { name: '李四', amount: 8.88, method: 'alipay', message: '感谢分享', date: '2024-12-05' }
    ]
  }
})
```

## 渲染效果

---

`rewardData` 渲染在文章正文末尾（评论之上），交互流程：

- **打赏按钮**：文章底部出现「打赏」按钮，点击触发弹窗。
- **二维码弹窗**：弹窗中并排展示微信（`wechat`）与支付宝（`alipay`）收款码图片，读者扫码即可打赏。
- **赞赏名单入口**：弹窗底部「全部赞赏者名单」链接跳转至 `/pages/thanks` 页面。
- **灯箱联动**：弹窗中的二维码图片可借助 [`fancybox`](./fancybox.md) 进一步放大查看。

## 赞赏名单页（/pages/thanks）

打赏弹窗中的「全部赞赏者名单」会跳转到 `/pages/thanks`，该页面展示 `rewardData.list` 中的赞赏记录。

### 创建赞赏名单页

在 `pages/thanks.md` 中引入主题内置的 `Thanks` 组件：

```md
---
title: 赞赏名单
aside: false
---

<script setup>
import { Thanks } from 'vitepress-theme-ninc/views'
</script>

<Thanks />
```

### 页面功能

- **统计概览**：顶部卡片展示赞赏人数、累计金额、微信/支付宝笔数。
- **赞赏者列表**：每条记录显示昵称首字母头像、支付方式标签、留言、日期与金额。
- **空状态**：名单为空时显示引导文案。
- **底部打赏入口**：页面底部展示打赏按钮，方便读者直接扫码。

::: tip 名单数据维护
`list` 数组由用户在 `themeConfig` 中维护，defu 深合并时数组为 concat，因此默认值为空 `[]`，用户写入的即为完整名单。每次收到新的赞赏后手动追加一条记录即可。
:::

::: tip 常见配置组合
- **双码打赏**：同时配置 `wechat` 与 `alipay`，覆盖主流支付方式。
- **仅微信**：只配置 `wechat`，`alipay` 留空，适合个人轻量打赏。
- **配合评论引导**：在文章末尾文案中引导读者「觉得有用可打赏」，提升转化率。
:::

::: warning 收款码图片规范
建议使用 400×400 或 600×600 的方形图片，从微信/支付宝官方「收款码」截图后裁剪去除多余边框，保留纯二维码区域。带 logo 的收款码识别率更高。
:::

## 注意事项

> 图片路径以 `/` 开头，对应 `public/` 下的文件，如 `/images/xxx.png` 对应 `public/images/xxx.png`。

::: tip 二维码默认图
`wechat` 与 `alipay` 留空时，主题会使用内置的默认二维码占位图。如需替换为自己的收款码，只需在 `themeConfig` 中填入图片路径即可覆盖。
:::

::: tip enable 关闭后不显示打赏按钮
当 `enable: false` 时，文章页不会渲染打赏按钮与弹窗。配置图片路径但未开启 `enable` 时功能不会生效。
:::

::: warning 字段名为 rewardData 而非 reward
注意配置键名为 `rewardData`（带 `Data` 后缀），不要写成 `reward`，否则不会被主题识别。
:::

## 相关配置

- [`aside` 侧边栏](./aside.md) — 文章页侧边栏模块配置
- [`comment` 评论](./comment.md) — 文章页评论系统配置
- [`fancybox` 灯箱](./fancybox.md) — 图片灯箱配置（打赏码图片也可点击放大）
