# tongji 统计

配置站点访问统计服务。主题内置支持 **不蒜子**（站点访问量、访客数、文章阅读量）与 **51la V6**；其他统计服务需通过 [`inject.header`](./inject.md) 手动注入脚本。

## 字段说明

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `'51la'` | `string?` | — | 51la V6 统计 ID；配置后主题自动注入 51la 脚本 |
| `busuanzi` | `object?` | 见下表 | 不蒜子统计配置 |
| `[key: string]` | `any?` | — | 索引签名允许扩展键，运行时仅处理已内置的 key |

### busuanzi 子表

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 是否启用不蒜子统计。关闭后侧边栏不显示访问量/访客数，文章页不显示阅读量 |
| `scriptUrl` | `string` | 见下方 | 不蒜子脚本地址。官方服务不可时可换自建镜像 |

::: tip scriptUrl 默认值
`https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js`，更换方法见「[更换脚本地址](#更换脚本地址)」。
:::

## 不蒜子

不蒜子是一个免费的网站访问量统计服务，无需注册账号，引入脚本即可使用。主题在不蒜子官方默认开启，提供三处数据展示：

- 侧边栏「站点数据」卡片：总访问量、总访客数
- 文章页元信息：单篇阅读量

### 关闭不蒜子

如果不需要访问量统计，关闭即可：

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  tongji: {
    busuanzi: {
      enable: false
    }
  }
})
```

关闭后，侧边栏站点数据卡片只显示文章总数和建站天数，文章页不显示阅读量。

### 更换脚本地址

不蒜子官方域名 `busuanzi.ibruce.info` 偶尔不稳定，可以换成自建镜像或 CDN：

```ts
tongji: {
  busuanzi: {
    enable: true,
    scriptUrl: 'https://your-cdn.example.com/busuanzi/2.3/busuanzi.pure.mini.js'
  }
}
```

脚本内容需要与官方一致，主题通过 `busuanzi_value_site_pv`、`busuanzi_value_site_uv`、`busuanzi_value_page_pv` 三个元素 ID 获取数据。

::: tip 不蒜子无需申请
不蒜子不提供后台管理面板，也没有统计 ID 的概念。它通过脚本自动统计，数据存储在不蒜子服务器上。访问 [busuanzi.ibruce.info](http://busuanzi.ibruce.info/) 可了解更多。
:::

## 51la V6

51la 是国内常用的免费站点统计服务，提供访客地域、来源、页面热度等数据，有完整的后台面板。

### 接入步骤

1. 前往 [51la 官网](https://www.51la.com/) 注册账号并添加站点。
2. 在「统计配置」或「获取代码」页面找到 V6 统计 ID。
3. 将 ID 填入 `tongji['51la']`：

```ts
export const themeConfig = defineThemeConfig({
  tongji: {
    '51la': '3LVLQW4ONx5FhkiE'
  }
})
```

4. 生产构建后，主题会自动从 51la 官方 CDN（`https://sdk.51.la/js-sdk-pro.min.js`）加载 SDK，并调用 `window.LA.init({ id, ck: id, autoTrack: true })`。**无需手动下载 SDK 文件**，配置好 ID 即可生效。

::: tip SDK 从官方 CDN 加载
主题直接从 `https://sdk.51.la/js-sdk-pro.min.js` 加载 51la SDK，用户无需把 `js-sdk-pro.min.js` 放到 `public/` 目录。如果你之前手动放了一份到 `public/`，可以删除（不影响功能）。
:::

::: tip 仅生产环境注入
主题只在 `import.meta.env.PROD` 且非 SSR 阶段注入统计脚本。`pnpm dev` 开发服务器中看不到脚本属于正常现象，请用 `pnpm build && pnpm preview` 验证。
:::

::: warning 类型开放不等于运行时支持
`TongjiConfig` 通过索引签名 `[key: string]: any` 允许填写任意 key，但当前源码只处理 `tongji['51la']` 和 `tongji.busuanzi`。填写 `baidu`、`google`、`umami` 等 key **不会自动注入任何脚本**。这些服务请改用 [`inject.header`](./inject.md)。
:::

## 百度统计

主题目前**不会**读取 `tongji.baidu`，也不会自动注入百度统计 `hm.js`。请把百度统计提供的完整脚本配置到 `inject.header`：

```ts
export const themeConfig = defineThemeConfig({
  inject: {
    header: [
      ['script', {}, `
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement('script');
          hm.src = 'https://hm.baidu.com/hm.js?你的百度统计ID';
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(hm, s);
        })();
      `]
    ]
  }
})
```

## 其他统计服务

Google Analytics、Umami 等需要复杂初始化脚本的服务，同样使用 [`inject.header`](./inject.md)：

| 服务 | tongji key | 推荐方式 |
| --- | --- | --- |
| 51la V6 | `'51la'` | 内置支持 |
| 百度统计 | 不支持 | `inject.header` 手动注入 hm.js |
| Google Analytics | 不支持 | `inject.header` 手动注入 gtag |
| Umami | 不支持 | `inject.header` 手动注入 script |

## 验证

生产预览时打开浏览器开发者工具：

1. Network 面板搜索 `js-sdk-pro.min.js`，确认返回 200。
2. Console 执行 `window.LA`，确认对象存在。
3. 51la 后台通常需等待数分钟后才会显示访问数据。

## 注意事项

::: tip 统计 ID 不是私钥
统计 ID 通常会出现在最终网页源码中，不属于真正的秘密。不过仍可通过构建环境变量管理不同环境的 ID：

```ts
tongji: {
  '51la': process.env.TONGJI_51LA || ''
}
```
:::

> 配置会与默认值深合并，只需填写想修改的字段，详见 [主题配置详解 - defu 深合并机制](../guide/theme-config#defu-深合并机制)。

## 渲染效果

---

## 相关配置

- [`inject` 注入](./inject.md) — 手动接入百度统计、Google Analytics、Umami 等服务
- [`footer` 页脚](./footer.md) — 页脚信息配置
- [`site-meta` 站点信息](./site-meta.md) — 站点元信息配置
