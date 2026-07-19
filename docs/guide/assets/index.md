# 静态资源管理

本主题中的静态资源主要分为四类：图片、SVG 图标、字体、CDN 远程资源。主题遵循 VitePress 原生的 `public/` 目录约定，并在此基础上集成了 SVG 雪碧图、字体打包、`inject.header` 远程资源注入等能力。本页为静态资源管理的总览，介绍 `public/` 目录约定、资源加载性能建议与常见问题；各类资源的详细用法见下方子页面索引。

## 子页面索引

| 主题 | 内容 |
| --- | --- |
| [图片资源](./images.md) | 图片存放位置、引用方式、灯箱效果、封面图配置 |
| [SVG 雪碧图](./svg.md) | SVG 图标使用、SvgIcon 组件、雪碧图配置 |
| [字体管理](./fonts.md) | 内置字体、自定义字体的两种方式、font.scss 说明 |
| [CDN 与外部资源](./cdn.md) | inject.header 注入、HeadConfig 格式、常见远程资源引入场景 |

## public 目录约定

VitePress 原生约定：项目根目录下的 `public/` 目录中的文件会被原样复制到构建产物的站点根目录，访问时路径不带 `public` 前缀。例如：

```text
public/images/avatar.png  →  /images/avatar.png
public/favicon.ico         →  /favicon.ico
public/svg/github.svg      →  /svg/github.svg
```

本主题中所有以静态文件形式引用的资源（头像、Logo、封面图、微信二维码、打赏码、favicon 等）都遵循这一规则，配置时只需写从站点根开始的绝对路径。


### 主题配置字段中的路径约定

下列主题配置字段均使用 `/` 开头的绝对路径，指向 `public/` 下的文件：

| 字段 | 用途 | 示例值 |
| --- | --- | --- |
| `siteMeta.avatar` | 站点头像 | `/images/avatar.png` |
| `siteMeta.logo` | 站点 Logo | `/images/logo.png` |
| `cover.showCover.defaultCover` | 默认封面图数组 | `['/images/cover/001.jpeg', ...]` |
| `wechat.face` | 微信头像 | `/images/weixin.png` |
| `wechat.back` | 微信二维码 | `/images/weixin-qrcode.png` |
| `rewardData.wechat` | 微信打赏码 | `/images/reward-wechat.png` |
| `rewardData.alipay` | 支付宝打赏码 | `/images/reward-alipay.png` |

文章 frontmatter 中的 `cover` 字段同样使用 `/` 开头的绝对路径。

### 推荐目录结构

一个典型的 `public/` 目录组织如下：

```text
public/
├─ images/
│  ├─ avatar.png         # 站点头像
│  ├─ logo.png           # 站点 Logo
│  ├─ cover/             # 默认封面图
│  │  ├─ 001.jpeg
│  │  ├─ 002.jpeg
│  │  └─ 003.jpeg
│  ├─ weixin.png         # 微信头像
│  └─ weixin-qrcode.png  # 微信二维码
├─ svg/                  # SVG 图标目录（用于雪碧图）
│  ├─ github.svg
│  └─ email.svg
├─ favicon.ico           # 站点图标
└─ robots.txt            # 爬虫规则
```

::: tip 目录命名自由
`public/` 下的子目录名并无强制要求，上表只是本主题 demo 站点的约定。只要在配置字段中写对绝对路径，文件可放在 `public/` 下任意位置。
:::

## 资源加载性能建议

### 图片格式选择

| 内容类型 | 推荐格式 | 说明 |
| --- | --- | --- |
| 照片、复杂图像 | JPEG / WebP | WebP 同等质量下体积更小，现代浏览器全支持 |
| 图标、线条图 | SVG | 矢量无损，可任意缩放，体积小 |
| 动画图 | WebP / APNG / GIF | WebP 与 APNG 体积更小、色彩更好 |
| 透明背景 | PNG / WebP | WebP 支持透明且体积更小 |

JPEG 适合色彩丰富的照片，PNG 适合需要透明通道的图标与截图，SVG 适合纯矢量图形。WebP 在多数场景下可替代 JPEG 与 PNG。

### 图片懒加载

主题已默认为文章正文图片添加 `loading="lazy"` 属性，浏览器会在图片进入视口附近时才发起请求，减少首屏带宽占用。无需额外配置。

### 字体加载策略

`@font-face` 声明中应使用 `font-display: swap`，让浏览器在字体加载完成前先用回退字体渲染文本，避免文字长时间不可见：

```scss
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/my-font.woff2') format('woff2');
  font-display: swap; /* 关键 */
}
```

主题内置字体的 `@font-face` 均已设置 `font-display: swap`，自定义字体时建议沿用。

### CDN 选择

引入远程资源时，CDN 节点位置直接影响加载速度：

| CDN | 适用场景 | 备注 |
| --- | --- | --- |
| jsDelivr (`cdn.jsdelivr.net`) | 海外用户优先 | 国内访问不稳定，部分时段可能被墙 |
| bootcdn (`cdn.bootcdn.net`) | 国内用户优先 | 国内节点丰富，速度快 |
| 字节跳动 CDN (`lf3-cdn-tos.bytecdntp.com`) | 国内用户 | 国内大厂 CDN，稳定性较好 |
| Google Fonts (`fonts.googleapis.com`) | 海外用户 | 国内访问需走代理 |

::: tip 国内用户优先
若站点主要面向国内用户，建议把 `cdn.jsdelivr.net` 替换为国内 CDN 镜像，或自行托管字体文件到 `public/`。
:::

## 常见问题

### Q: 图片显示 404

**原因**：路径写错，或文件未放到 `public/` 下。

**排查步骤**：

1. 确认文件实际位于 `public/images/xxx.png`。
2. 确认配置中路径以 `/` 开头且不带 `public` 前缀，如 `/images/xxx.png`。
3. 浏览器开发者工具 Network 面板查看实际请求 URL，对比 `public/` 下文件路径。
4. 检查文件名大小写，部分服务器（如 Linux）对大小写敏感。

### Q: SVG 图标不显示

**原因**：`svgIconDirs` 未配置、文件未放入扫描目录、或 `name` 写错。

**排查步骤**：

1. 确认 `.svg` 文件位于 `svgIconDirs` 指定的目录下（默认 `public/svg`）。
2. 确认 `<SvgIcon name="github" />` 的 `name` 与文件名一致（不含 `.svg` 后缀）。
3. 浏览器开发者工具 Elements 面板检查 `<body>` 起始处是否有 `<svg style="display:none">` 雪碧图节点。
4. 若多目录配置下存在同名文件，后者会覆盖前者，确认 `name` 唯一。

### Q: 字体不生效

**原因**：`@font-face` 未声明、变量未覆盖、或字体文件路径错误。

**排查步骤**：

1. 本地字体：确认 `@font-face` 中的 `src` 路径指向 `public/` 下实际文件，且以 `/` 开头。
2. 远程字体：确认 `inject.header` 中的 `<link>` 已生效（Network 面板查看 CSS 是否加载）。
3. 确认已覆盖 `--main-font-family` 变量，且覆盖 SCSS 在 `import Theme` 之后引入。
4. 浏览器开发者工具 Elements 面板检查目标元素的 `font-family` 计算值是否包含自定义字体名。
5. 详见 [自定义样式 - 覆盖顺序](../custom-styles.md#方式一覆盖-css-变量)。

### Q: CDN 资源加载慢

**原因**：CDN 节点距离用户远，或所选 CDN 在用户所在地区被屏蔽。

**排查步骤**：

1. 浏览器 Network 面板查看请求耗时与状态码。
2. 国内用户优先切换到国内 CDN（bootcdn、字节跳动 CDN）。
3. 体积大的字体文件建议本地化（放入 `public/fonts/`），避免依赖远程 CDN。
4. 使用 `font-display: swap` 避免字体加载阻塞文本渲染。


