# jumpRedirect 外链中转

配置外链中转跳转功能，将站内点击的外部链接转换为通过中转页跳转，以保护用户隐私并提示即将离开本站。

![外链中转配置文档页](/images/article/redirect.png)

## 中转页自动注入

启用 `jumpRedirect.enable: true` 后，主题会**自动注入中转页**，无需手动创建 `redirect.md` 或 `public/redirect.html`：

- **dev**：通过 Vite 中间件拦截 `/redirect` 请求，直接返回中转页 HTML。
- **build**：输出 `redirect.html` 到站点根目录，配合 `cleanUrls` 可通过 `/redirect` 访问。

中转页内置域名白/黑名单判断：白名单站点显示「已信任」并自动跳转，黑名单站点显示危险警告且不自动跳转，其余站点显示安全提示由用户确认。

::: tip 链接自动改写仅生产环境生效
中转页本身在 dev 与 build 均可直接访问 `/redirect?url=<base64>`。但链接的**自动改写**（把外链 href 替换为中转地址）仅在生产环境生效，开发环境保持原链接以便调试。开发期可手动构造 `/redirect?url=<base64编码的目标URL>` 来测试中转页。
:::

## 字段说明

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 是否启用外链中转 |
| `exclude` | `string[]` | 见下方说明 | 排除中转的链接 class 名数组 |
| `whitelist` | `string[]` | 见下方说明 | 域名白名单，匹配后自动跳转（支持通配符 `*.xxx`） |
| `blacklist` | `string[]` | 见下方说明 | 域名黑名单，匹配后显示危险警告，不自动跳转 |

默认 `exclude` 值：

```ts
exclude: [
  'cf-friends-link', 'upyun', 'icp', 'author', 'rss', 'cc', 'power',
  'social-link', 'link-text', 'travellings', 'post-link', 'report',
  'more-link', 'skills-item', 'right-menu-link', 'link-card'
]
```

默认 `whitelist` 值（安全站点，进入中转页后自动跳转）：

```ts
whitelist: [
  'gitee.com', 'github.com', 'baidu.com', 'bing.cn', 'npmjs.com',
  'cnblogs.com', 'csdn.net', 'jianshu.com', 'zhihu.com', 'juejin.cn',
  'segmentfault.com', 'v2ex.com', 'google.com', 'google.cn',
  'google.com.*', 'vuejs.org'
]
```

默认 `blacklist` 值（购物站点，显示危险警告，不自动跳转）：

```ts
blacklist: ['taobao.com', 'jd.com', 'tmall.com', '1688.com', 'pinduoduo.com', 'amazon.com']
```

## 示例

### 使用默认配置

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  jumpRedirect: {
    enable: true
    // exclude / whitelist / blacklist 均使用默认值
  }
})
```

### 关闭外链中转

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  jumpRedirect: {
    enable: false
  }
})
```

### 自定义白/黑名单

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  jumpRedirect: {
    enable: true,
    // 追加信任站点（注意：传入会整体替换默认数组）
    whitelist: [
      'gitee.com', 'github.com', 'baidu.com', 'bing.cn', 'npmjs.com',
      'cnblogs.com', 'csdn.net', 'jianshu.com', 'zhihu.com', 'juejin.cn',
      'segmentfault.com', 'v2ex.com', 'google.com', 'google.cn',
      'google.com.*', 'vuejs.org',
      'my-trusted-site.com' // 新增自定义信任站点
    ]
  }
})
```

### 新增 exclude 排除项

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  jumpRedirect: {
    enable: true,
    exclude: [
      'cf-friends-link', 'upyun', 'icp', 'author', 'rss', 'cc', 'power',
      'social-link', 'link-text', 'travellings', 'post-link', 'report',
      'more-link', 'skills-item', 'right-menu-link', 'link-card',
      'my-custom-link' // 新增自定义排除项
    ]
  }
})
```

## 渲染效果

---

`jumpRedirect` 启用后，站内点击的外部链接不会直接跳转，而是先进入中转页：

- **中转提示页**：展示「即将离开本站」提示，显示目标链接地址。
- **白名单自动跳转**：目标域名命中白名单时，页面显示「已信任」并倒计时自动跳转。
- **黑名单警告**：目标域名命中黑名单时，页面显示危险警告，需用户手动确认。
- **确认按钮**：用户点击「继续前往」或按 Enter 键后跳转到目标外链。
- **复制链接**：点击目标链接地址可复制到剪贴板。

::: tip 常见配置组合
- **默认启用**：开箱即用，默认 `exclude` / `whitelist` / `blacklist` 已覆盖常见场景。
- **追加自定义排除**：在自定义组件中使用 `link-card` 等类名时，将类名追加到 `exclude`（注意必须保留默认项）。
- **完全关闭**：`enable: false` 适合纯内链站点或对中转页无需求的场景。
:::

::: warning 数组整体替换
由于 `defu` 对数组合并的策略，传入 `exclude` / `whitelist` / `blacklist` 时会**整体替换**默认数组，而非追加。新增项时务必把默认项一并写入，否则会丢失默认规则。建议复制默认数组后再追加。
:::

## 注意事项

::: tip 外链中转保护用户隐私
启用后，站内点击的外部链接不会直接跳转，而是先进入中转页（提示「即将离开本站」），再由用户确认跳转。这能避免 `Referer` 头泄露本站地址，保护访客隐私，同时给用户一次反悔机会，防止误触与钓鱼链接。
:::

::: tip exclude 基于 class 名匹配
`exclude` 数组中的每一项是 **链接元素的 class 名**。带这些 class 的链接（无论是否外链）都会跳过中转页直接打开。默认排除项覆盖了友链、ICP 备案、作者、RSS、CC 协议、社交链接、开往、文章链接、举报、更多链接、技能项、右键菜单链接、链接卡片等内部或友好链接场景。
:::

::: tip whitelist / blacklist 基于域名匹配
`whitelist` / `blacklist` 在**中转页内**对目标 URL 的 hostname 做匹配，支持 `*` 通配符（如 `google.com.*`）。黑名单优先于白名单判断。这两个数组在中转页 HTML 生成时注入，修改后需重新构建。
:::

::: tip 默认启用
`jumpRedirect` 默认 `enable: true`，新站点开箱即得外链中转保护。若希望外链直接跳转可设为 `enable: false`。
:::

::: tip 自定义链接卡片需加入 exclude
若在文章中使用 `link-card` 等自定义组件并希望其中的链接直接跳转，请确保对应 class 名已存在于 `exclude` 中。默认已包含 `link-card`。
:::

## 相关配置

- [`footer` 页脚](./footer.md) — 页脚链接通常需要排除中转
- [`nav` 顶部导航栏](./nav.md) — 导航栏外链配置
- [`navMore` 左侧更多菜单](./nav-more.md) — 侧边链接分组配置
