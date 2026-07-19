# aside 侧边栏

配置文章页右侧侧边栏区域，包含 7 个可独立开关的子模块：站点简介、微信二维码、欢迎信息、文章目录、标签云、倒计时、站点统计。

![侧边栏配置文档页](/images/article/aside.png)

## 字段说明

### aside 主表

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `hello` | `AsideHello` | 见下方子表 | 站点简介模块 |
| `wechat` | `AsideWechat` | 见下方子表 | 微信二维码模块 |
| `welcome` | `AsideWelcome` | 见下方子表 | 欢迎信息模块 |
| `toc` | `AsideToc` | 见下方子表 | 文章目录模块 |
| `tags` | `AsideTags` | 见下方子表 | 标签云模块 |
| `countDown` | `AsideCountDown` | 见下方子表 | 倒计时模块 |
| `siteData` | `AsideSiteData` | 见下方子表 | 站点统计模块 |

### hello 子表（AsideHello）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 是否启用站点简介 |
| `text` | `string` | `'欢迎来到我的博客，这里有一些关于<strong>开发</strong>相关的问题和看法。'` | 简介文本，支持 HTML 标签 |

::: tip hello 卡片的社交入口来自 siteMeta.author
hello 卡片底部右侧的 GitHub 图标与邮箱图标**不在 `aside.hello` 中配置**，而是直接读取 [`siteMeta.author.link`](./site-meta.md#author-子表) 与 [`siteMeta.author.email`](./site-meta.md#author-子表)：

- `siteMeta.author.link` → GitHub 图标的跳转链接
- `siteMeta.author.email` → 邮箱图标的 `mailto:` 链接
- 未配置时图标仍会展示但为空链接，建议替换为真实地址

hello 卡片中的 Clock 动画中心头像通过 [`siteMeta.author.cover`](./site-meta.md#author-子表) 配置，未配置时回退到 [`siteMeta.avatar`](./site-meta.md#site-meta-主表)，两者默认使用主题作者提供的网络图片，开箱即用，替换方法见 [siteMeta 文档](./site-meta.md#author-子表)。

这样设计是为了避免作者社交入口在多处重复配置，站点作者信息集中维护在 `siteMeta.author` 中即可。
:::

### wechat 子表（AsideWechat）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | 是否启用微信二维码 |
| `face` | `string` | `''` | 正面图片路径（微信头像），需用户自行提供 |
| `back` | `string` | `''` | 背面图片路径（微信二维码），需用户自行提供 |

### welcome 子表（AsideWelcome）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 是否启用欢迎信息 |
| `text1` | `string` | `'👋🏻 Hi，欢迎你！'` | 欢迎语第一行，支持 HTML |
| `text2` | `string` | `'本站采用 <strong>VitePress</strong> 搭建'` | 欢迎语第二行，支持 HTML |
| `text3` | `string` | `'使用 vitepress-theme-ninc 主题'` | 欢迎语第三行，支持 HTML |
| `email` | `string` | `'you@example.com'` | 联系邮箱 |
| `address` | `[number, number] \| []` | `[]` | 经纬度坐标 `[lng, lat]`，为空时不渲染地图 |
| `ipLocation` | `object?` | 见下表 | 访客 IP 定位服务配置，不填则使用主题内置接口 |

#### welcome.ipLocation 子表

欢迎卡片默认会调用主题内置的 IP 查询与归属地接口，向访客展示其所在的省市信息。接口有调用频率限制，如有自建接口可在此覆盖。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `ipApi` | `string?` | `'https://www.mxnzp.com/api/ip/self?app_id=r9iwwighsmbtewxr&app_secret=yQ9jlmboL7sA57pzNvGZQNmSEoP3JtVd'` | 访客 IP 查询接口（GET，返回 JSON，需含 `data.ip` 字段） |
| `locationApi` | `string?` | `'https://v1.nsuuu.com/api/ipip?ip=${ip}&key=bf7164e3a2e82a6c'` | IP 归属地查询接口模板，`${ip}` 为占位符会被自动替换（GET，返回 JSON，需含 `data` 字段） |

::: warning 默认接口为共享资源
内置的两条接口来源于第三方公共服务，主题使用者共享同一份 `app_id`、`app_secret` 与 `key`，遇到调用高峰期可能超限。建议自行申请接口或部署代理后通过 `ipLocation` 覆盖，避免因共享限额导致访客位置展示失败。
:::

::: tip 自建接口示例
若已自建返回 `data.ip` 的 IP 查询接口与返回 `data.{province, city, ...}` 的归属地查询接口，可以这样配置：

```ts
aside: {
  welcome: {
    ipLocation: {
      ipApi: 'https://your-api.example.com/ip',
      // ${ip} 会被替换为 ipApi 返回的 IP
      locationApi: 'https://your-api.example.com/location?ip=${ip}'
    }
  }
}
```
:::

### toc 子表（AsideToc）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 是否启用文章目录 |

### tags 子表（AsideTags）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 是否启用标签云 |

### countDown 子表（AsideCountDown）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | 是否启用倒计时 |
| `data` | `{ name: string; date: string }` | `{ name: '示例倒计时', date: '2027-01-01' }` | 倒计时数据 |

#### countDown.data 子表

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | `string` | `'示例倒计时'` | 倒计时事件名称 |
| `date` | `string` | `'2027-01-01'` | 倒计时目标日期（YYYY-MM-DD） |

### siteData 子表（AsideSiteData）

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 是否启用站点统计 |

## 示例

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  aside: {
    // 站点简介
    hello: {
      enable: true,
      text: '欢迎来到我的博客，这里有一些关于<strong>开发</strong>相关的问题和看法。'
    },
    // 微信二维码
    wechat: {
      enable: true,
      face: '/images/weixin.png',
      back: '/images/weixin-qrcode.png'
    },
    // 欢迎信息
    welcome: {
      enable: true,
      text1: '👋🏻 Hi，欢迎你！',
      text2: '本站采用 <strong>VitePress</strong> 搭建',
      text3: '使用 vitepress-theme-ninc 主题',
      email: 'you@example.com',
      address: [120.146782, 35.982411]
    },
    // 文章目录
    toc: {
      enable: true
    },
    // 标签云
    tags: {
      enable: true
    },
    // 倒计时
    countDown: {
      enable: true,
      data: {
        name: '新年倒计时',
        date: '2027-01-01'
      }
    },
    // 站点统计
    siteData: {
      enable: true
    }
  }
})
```

## 渲染效果

---

`aside` 渲染在文章页右侧（窄屏下折叠到正文下方），7 个子模块自上而下依次排布：

- **hello 站点简介**：一段支持 HTML 的简介文本，常用于站点定位说明。卡片底部右侧展示作者社交入口（GitHub / 邮箱图标），链接来自 [`siteMeta.author.link`](./site-meta.md#author-子表) 与 [`siteMeta.author.email`](./site-meta.md#author-子表)，未配置时为空链接。
- **wechat 微信二维码**：默认显示 `face`（微信头像），悬浮翻转展示 `back`（二维码图片）。
- **welcome 欢迎信息**：三行欢迎语 + 联系邮箱 + 经纬度地图标记。
- **toc 文章目录**：自动读取当前文章的标题层级，生成可点击跳转的目录树，滚动时高亮当前章节。
- **tags 标签云**：聚合站点所有标签，按文章数量调整字号，点击跳转到对应标签页。
- **countDown 倒计时**：展示距 `data.date` 的剩余天数，适合节日、纪念日、版本发布倒计时。
- **siteData 站点统计**：展示文章数、分类数、标签数等汇总数据。

::: tip 常见配置组合
- **内容型博客**：开启 `hello` + `toc` + `tags` + `siteData`，关闭 `wechat` 与 `countDown`，聚焦阅读辅助。
- **个人互动型**：开启 `welcome` + `wechat` + `toc` + `tags`，突出作者联系方式与社交入口。
- **极简型**：仅开启 `toc`，最大化正文阅读宽度，窄屏体验最佳。
:::

::: warning 模块数量与正文宽度
开启的模块越多，侧边栏越高，正文可用宽度不变但视觉上会更拥挤。若文章代码块较宽，建议关闭 `wechat`、`countDown` 等非必要模块。
:::

## 注意事项

::: tip 使用 enable 控制每个模块
7 个子模块均通过 `enable` 字段独立开关，无需删除整段配置即可隐藏某个模块。配置会与默认值通过 `defu` 深合并，因此只覆盖需要修改的字段即可。
:::

::: tip hello 与 welcome 支持 HTML
`hello.text` 与 `welcome.text1/text2/text3` 均支持 HTML 标签（如 `<strong>`、`<em>`、`<a>`），可用于加粗重点文字或插入链接。请确保 HTML 标签闭合正确，避免破坏页面布局。
:::

> 图片路径以 `/` 开头，对应 `public/` 下的文件，如 `/images/xxx.png` 对应 `public/images/xxx.png`。

::: tip welcome.address 用于地图定位
`welcome.address` 是 `[经度, 纬度]` 形式的坐标数组，会用于在侧边栏渲染地图标记。可通过 [拾取坐标系统](https://lbs.qq.com/getPoint/) 获取所需经纬度。
:::

::: warning countDown.date 使用标准日期格式
`countDown.data.date` 必须使用 `YYYY-MM-DD` 格式（如 `2027-01-01`），否则可能无法正确计算剩余天数。
:::

::: tip siteData 站点统计
`siteData` 用于在侧边栏展示文章数、分类数、标签数等站点统计数据，统计内容由主题自动收集，无需额外配置字段。
:::

## 相关配置

- [`rewardData` 打赏](./reward.md) — 文章页打赏二维码配置
- [`comment` 评论](./comment.md) — 文章页评论系统配置
- [`fancybox` 灯箱](./fancybox.md) — 文章页图片灯箱配置
