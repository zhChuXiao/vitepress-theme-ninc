# 图片资源

本页讲解图片资源的存放位置、在文章与配置中的引用方式、默认封面图与文章封面的配置，以及图片灯箱（fancybox）效果与防盗链处理。所有图片路径均遵循 [public 目录约定](./index.md#public-目录约定)，使用 `/` 开头的绝对路径。

## 路径前缀

所有图片路径以 `/` 开头，对应 `public/` 下的实际文件位置。例如 `public/images/avatar.png` 在配置中写为 `/images/avatar.png`。

## 默认封面图

`themeConfig.cover.showCover.defaultCover` 是一个字符串数组，主题会从数组中随机选取一张作为未显式声明 `cover` 字段的文章的封面：

```ts
// themeConfig.ts
cover: {
  showCover: {
    enable: true,
    coverLayout: 'both',
    defaultCover: [
      '/images/cover/001.jpeg',
      '/images/cover/002.jpeg',
      '/images/cover/003.jpeg'
    ]
  }
}
```

::: warning 数组整体替换
`defaultCover` 是数组字段，会与默认值整体替换而非拼接。请确保写入你需要的完整列表，详见 [配置详解](../configuration.md#options-字段表)。
:::

## 文章封面

单篇文章可在 frontmatter 中通过 `cover` 字段指定封面，覆盖默认列表：

```md
---
title: 示例文章
date: 2025-01-01
cover: /images/cover/custom.jpeg
---

# 示例文章
```

![文章封面](/images/article/cover.png)


未设置 `cover` 时，主题从 `defaultCover` 列表中随机选取一张。详见 [Frontmatter 字段](../frontmatter.md)。

## 图片灯箱

主题通过 `fancybox` 配置控制图片灯箱行为。启用后，文章正文中的图片会自动包裹 `<a class="img-fancybox" data-fancybox="gallery">` 链接，支持点击放大、画廊浏览、键盘导航；图片 `alt` 文本会自动作为下方说明（`.post-img-tip`）。

```ts
// themeConfig.ts
fancybox: {
  enable: true,
  js: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5/dist/fancybox/fancybox.umd.min.js',
  css: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5/dist/fancybox/fancybox.min.css'
}
```

未启用时，图片仅渲染为普通 `<img loading="lazy">`。灯箱字段的完整说明见 [主题配置 - fancybox](../theme-config.md#fancybox)，渲染细节见 [Markdown 扩展 - 图片](../markdown/#图片渲染与灯箱)。

![图片灯箱](/images/article/fancybox.png)


## 防盗链

部分图床（如新浪图床）会校验 `Referer` 字段，从自有站点引用图片时可能因 Referer 不匹配而 403。可在 `inject.header` 中注入 `no-referrer` 策略，让浏览器不发送 Referer：

```ts
// themeConfig.ts
inject: {
  header: [
    ['meta', { name: 'referrer', content: 'no-referrer' }]
  ]
}
```

`inject.header` 的更多用法见 [CDN 与外部资源](./cdn.md)。


