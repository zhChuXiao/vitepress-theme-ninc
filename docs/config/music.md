# music 音乐

配置基于 APlayer + MetingJS 的音乐播放器，通过 Meting API 解析各音乐平台的歌单/专辑/单曲并在站点展示播放器。

![音乐播放器配置文档页](/images/article/music.png)

## 字段说明

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `false` | 是否启用音乐播放器 |
| `url` | `string` | `'https://api.injahow.cn/meting/'` | Meting API 地址 |
| `id` | `number \| string` | `'0000000'` | 歌单/专辑/单曲 ID |
| `server` | `'netease' \| 'tencent' \| 'kugou'` | `'netease'` | 音乐平台（网易云/QQ音乐/酷狗） |
| `type` | `'playlist' \| 'album' \| 'song'` | `'playlist'` | 资源类型（歌单/专辑/单曲） |

## 示例

### 网易云音乐歌单

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  music: {
    enable: true,
    url: 'https://api.injahow.cn/meting/',
    id: '123456789', // 网易云歌单 ID
    server: 'netease',
    type: 'playlist'
  }
})
```

### QQ 音乐歌单

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  music: {
    enable: true,
    url: 'https://api.injahow.cn/meting/',
    id: '87654321', // QQ 音乐歌单 ID
    server: 'tencent',
    type: 'playlist'
  }
})
```

### 酷狗单曲

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  music: {
    enable: true,
    url: 'https://api.injahow.cn/meting/',
    id: '1234567', // 酷狗单曲 ID
    server: 'kugou',
    type: 'song'
  }
})
```

## 渲染效果

---

`music` 基于 APlayer + MetingJS 渲染，启用后在页面中展示一个可折叠的音乐播放器：

- **播放器卡片**：左侧为专辑封面（旋转动画），右侧为歌曲名、歌手、进度条与播放控制按钮。
- **播放列表**：点击列表按钮展开歌单全部歌曲，支持切歌、循环模式切换。
- **吸底定位**：播放器通常吸附在页面底部，滚动时不遮挡内容。

::: tip 常见配置组合
- **网易云歌单**：`server: 'netease'` + `type: 'playlist'`，最常用，歌单 ID 从网页版 URL 获取。
- **QQ 音乐单曲**：`server: 'tencent'` + `type: 'song'`，适合插入特定 BGM。
- **自建 API**：替换 `url` 为自建 Meting API 地址，规避公共服务限流。
:::

::: warning 版权与可用性
受音乐平台版权策略影响，部分歌曲可能无法获取播放链接（列表显示但点击无响应）。建议选择公开歌单或自建 API 并配置 cookie 解析，以提升播放成功率。
:::

## 注意事项

::: warning 默认 Meting API 为公共服务
默认 `url` 指向 `https://api.injahow.cn/meting/`，这是一个公共服务，可能存在限流、不稳定或下线的风险。生产环境建议自建 Meting API，参考 [Meting 项目](https://github.com/metowolf/Meting) 与 [MetingJS 文档](https://github.com/metowolf/MetingJS)。
:::

::: tip server 与平台对应关系
- `netease`：网易云音乐
- `tencent`：QQ 音乐
- `kugou`：酷狗音乐

请根据歌单/单曲的来源平台正确填写 `server`，否则无法正确解析资源。
:::

::: tip type 与资源类型对应关系
- `playlist`：歌单（多首歌曲集合，常用）
- `album`：专辑
- `song`：单曲（仅一首）

`id` 必须与 `type` 匹配，例如 `type: 'song'` 时 `id` 应为单曲 ID。
:::

::: tip 如何获取歌单 ID
以网易云为例：打开网页版网易云音乐，进入目标歌单页面，URL 中 `id=` 后的数字即为歌单 ID（如 `https://music.163.com/#/playlist?id=123456789` 中的 `123456789`）。
:::

::: warning 部分歌单可能因版权无法播放
受音乐平台版权策略影响，部分歌曲可能无法通过 Meting API 获取播放链接，表现为播放器列表显示但点击无法播放。建议选择公开、无版权限制的歌单。
:::

::: tip enable 关闭后不加载播放器
当 `enable: false` 时，主题不会加载 APlayer 与 MetingJS 资源，避免引入不必要的网络请求。
:::

## 相关配置

- [`search` 搜索](./search.md) — 全站搜索配置
- [`aside` 侧边栏](./aside.md) — 侧边栏模块配置
- [`fancybox` 灯箱](./fancybox.md) — 图片灯箱配置
