# search 搜索

配置基于 Algolia 的全站搜索功能，需要在 Algolia 控制台创建索引并配置爬虫后，将凭据填入主题配置。

![搜索配置文档页](/images/article/search.png)

## 字段说明

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | 是否启用搜索 |
| `appId` | `string` | `''` | Algolia Application ID |
| `apiKey` | `string` | `''` | Algolia Search-Only API Key |
| `indexName` | `string` | `''` | Algolia 索引名称 |

## 示例

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  search: {
    enable: true,
    appId: 'YourAlgoliaAppId',
    apiKey: 'YourSearchOnlyApiKey',
    indexName: 'your-blog-index'
  }
})
```

## 渲染效果

---

`search` 基于 Algolia DocSearch / InstantSearch 渲染，启用后提供全站搜索体验：

- **搜索入口**：导航栏区域出现搜索框/搜索按钮，点击或快捷键聚焦输入框。
- **实时下拉结果**：输入关键词后，下方实时展示匹配的文章标题、摘要与高亮关键词，点击直达对应页面。
- **分页与分类**：结果列表支持分页加载，可按命中度排序。

::: tip 常见配置组合
- **个人博客搜索**：Algolia 免费套餐 + 配置爬虫定时同步，`appId`/`apiKey`/`indexName` 三件套。
- **多语言索引**：为不同语言创建独立 index，通过 `indexName` 切换（需主题支持动态切换）。
- **本地搜索替代**：若不想依赖 Algolia，可考虑 VitePress 内置的 local search（需调整主题，非本配置范围）。
:::

::: warning 爬虫同步频率
Algolia 免费套餐爬虫频率有限（通常每月数千次），文章更新后可能需要数小时才被索引。建议在发布重要文章后手动触发爬虫，或在 Algolia 控制台调整爬取计划。
:::

## 注意事项

::: warning 使用前需注册 Algolia 并创建索引
搜索功能依赖 [Algolia](https://www.algolia.com/) 提供的搜索服务，使用前需完成以下步骤：
1. 注册 Algolia 账号并创建一个应用
2. 在 Algolia 控制台创建索引（Index）
3. 配置爬虫（Crawler）将站点内容同步到索引，参考 [Algolia Crawler 文档](https://www.algolia.com/doc/tools/crawler/getting-started/overview/)
4. 在控制台获取 `appId`、`apiKey`（Search-Only API Key）、`indexName` 三项填入配置
:::

::: warning 三个字段均为必填
`appId`、`apiKey`、`indexName` 三个字段缺一不可，且必须与 Algolia 控制台中的值完全一致，否则搜索组件无法正确加载索引数据。
:::

::: tip 仅使用 Search-Only API Key
`apiKey` 必须使用 Algolia 控制台中的 **Search-Only API Key**（仅具备搜索权限），切勿使用 Admin API Key，以避免密钥泄露导致索引被恶意篡改。
:::

::: tip 可选依赖
搜索功能依赖以下三个库：`algoliasearch`、`instantsearch.js`、`vue-instantsearch`。主题包已将它们声明为 `optionalDependencies`，启用搜索前请确保这些依赖已安装到项目中：
```bash
pnpm add algoliasearch instantsearch.js vue-instantsearch
```
:::

::: tip enable 关闭后不渲染搜索入口
当 `enable: false` 时，主题不会加载任何 Algolia 相关资源，对页面性能无影响。仅在确需启用搜索时再开启。
:::

## 相关配置

- [`nav` 顶部导航栏](./nav.md) — 搜索入口通常位于导航栏
- [`aside` 侧边栏](./aside.md) — 文章页侧边栏模块配置
- [`music` 音乐](./music.md) — 音乐播放器配置
