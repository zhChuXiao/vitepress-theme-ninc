# cover 文章封面

配置首页文章列表的封面展示，包括双栏布局开关、封面显示开关、封面布局方向以及无封面文章的默认封面图。

![封面配置文档页](/images/article/cover.png)

## 字段说明

### cover 主表

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `twoColumns` | `boolean` | `true` | 是否启用双栏布局 |
| `showCover` | `CoverShowConfig` | 见下方子表 | 封面显示配置 |

### showCover 子表

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enable` | `boolean` | `true` | 是否启用封面显示 |
| `coverLayout` | `'left' \| 'right' \| 'both'` | `'both'` | 封面布局方向：左/右/双向 |
| `defaultCover` | `string[]` | `[]` | 默认封面图数组，需用户自行提供；为空且文章未配置 `cover` 时不显示默认封面 |

默认 `cover` 值：

```ts
cover: {
  twoColumns: true,
  showCover: {
    enable: true,
    coverLayout: 'both',
    defaultCover: []
  }
}
```

## 示例

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  cover: {
    twoColumns: true,
    showCover: {
      enable: true,
      coverLayout: 'both',
      defaultCover: [
        '/images/cover/default-1.jpg',
        '/images/cover/default-2.jpg',
        '/images/cover/default-3.jpg',
        '/images/cover/default-4.jpg',
        '/images/cover/default-5.jpg'
      ]
    }
  }
})
```

::: warning 默认不内置封面图片
`defaultCover` 默认为空数组。若希望未填写 `frontmatter.cover` 的文章也显示封面，请将图片放到 `public/images/cover/`，并像上例一样显式配置 `defaultCover`。图片路径不包含 `public` 前缀。
:::

关闭封面显示的示例：

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  cover: {
    twoColumns: false,
    showCover: {
      enable: false,
      coverLayout: 'right',
      defaultCover: ['/images/cover/default-1.jpg']
    }
  }
})
```

## 渲染效果

---

`cover` 决定首页文章列表的卡片形态，三种 `coverLayout` 的视觉差异：

- **`left`**：封面固定在卡片左侧，文字摘要在右，整体偏「图集」风格。
- **`right`**：封面固定在卡片右侧，文字摘要在左，适合先阅读标题再浏览配图。
- **`both`（默认）**：封面在左右两侧交替排布，形成上下错落的视觉节奏，信息密度最高。

`twoColumns` 开启时卡片双栏并排，关闭后单栏铺满，长图文阅读体验更佳。

::: tip 常见配置组合
- **图文并茂型**：`twoColumns: true` + `coverLayout: 'both'`，首屏信息量最大，适合更新频繁的博客。
- **极简阅读型**：`twoColumns: false` + `coverLayout: 'right'`，单栏 + 右侧封面，突出正文摘要。
- **纯文字型**：`showCover.enable: false` + `twoColumns: false`，去除封面聚焦内容，加载更快。
:::

::: warning 封面图准备建议
`defaultCover` 建议准备 3-5 张风格统一的横版图片（推荐 800×500、16:9 或 3:2），统一压缩到 100KB 以内。封面图风格不一致会让 `both` 布局显得杂乱。
:::

## 注意事项

::: tip coverLayout 三种布局
`coverLayout` 支持三种取值：
- `'left'`：封面固定在文章卡片左侧
- `'right'`：封面固定在文章卡片右侧
- `'both'`（默认）：封面在左右两侧交替显示，形成错落有致的视觉效果
:::

::: warning defaultCover 随机选取
当文章未设置封面（frontmatter 中无 `cover` 字段）时，主题会从 `defaultCover` 数组中随机选取一张作为封面。建议准备 3 张以上的高质量配图以避免重复感。
:::

::: tip twoColumns 双栏布局
`twoColumns` 控制文章列表是否双栏并排展示。开启后可在首屏展示更多文章，适合文章数量较多的站点；关闭后采用单栏布局，更适合图文并茂的长文章。
:::

> 图片路径以 `/` 开头，对应 `public/` 下的文件，如 `/images/xxx.png` 对应 `public/images/xxx.png`。

::: tip enable 与 coverLayout 配合
`enable` 为总开关，关闭后无论 `coverLayout` 如何设置都不会显示封面。`coverLayout` 仅在 `enable: true` 时生效。
:::

## 相关配置

- [`homeTop` 首页顶部区域](./home-top.md) — 首页顶部横幅与快捷分类
- [`siteMeta` 站点信息](./site-meta.md) — 站点基础信息
- [`footer` 页脚](./footer.md) — 页脚配置
