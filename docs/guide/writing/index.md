# 写作工作流

[Frontmatter 字段](../frontmatter.md) 提供了 17 个字段的完整参考表，[文章管理](../posts.md) 讲了目录组织与各类文章的放置约定。但在实际写作中，多数困惑不是「某个字段是什么」，而是「我要写的这篇文章该用哪些字段、它们怎么配合」。

本节从「我要写一篇文章」的视角出发，按典型场景给出 frontmatter 的组合用法。每个场景包含场景描述、推荐字段组合、可直接复制的完整示例，以及各字段在该场景下的作用说明。字段级的完整定义参考 [Frontmatter 字段](../frontmatter.md)，目录组织细节参考 [文章管理](../posts.md)，本节不重复这两部分内容。

## 写文章前的准备

文章统一放在项目根目录的 `posts/` 下，主题会递归扫描该目录的所有 `.md` 文件。子目录名可按内容类型自定义（如 `articles/`、`notes/`、`tutorials/`），完整目录约定见 [文章管理 - 目录结构](../posts.md#目录结构)。

文件名使用 kebab-case，便于路由映射与跨平台一致：

```text
posts/
└─ articles/
   ├─ vue3-composition-api.md     # → /posts/articles/vue3-composition-api
   ├─ css-selector-specificity.md
   └─ git-rebase-guide.md
```

最小可用的 frontmatter 只需 `title` 与 `date`：

```md
---
title: 我的第一篇文章
date: 2025-01-01
---

# 我的第一篇文章

正文内容...
```

`date` 缺失会导致文章无法正确排序，归档页也会出现异常，建议每篇文章都填写。其余字段按需追加，各子页面按场景说明。

典型的 `posts/` 目录结构示意如下：

```text
posts/
├── my-first-post.md       # 我的第一篇文章（最小 frontmatter）
├── standard.md             # 标准技术文章：含封面、描述、标签、分类
├── pinned.md              # 置顶与推荐文章：top / recommend 字段
├── encrypted.md           # 加密文章：crypto 字段加密正文
├── reprint.md             # 转载文章：reprint 字段标注原文来源
├── references.md          # 带参考资料的文章：references 字段渲染参考区块
└── tool-page.md           # 工具页 / 速查表：isPage / aside / fullWidth 组合
```

每篇文章都是独立的 Markdown 文件，文件名即访问路径（例如 `posts/standard.md` 对应路由 `/posts/standard.html`）。VitePress 会根据 `date` 字段自动排序，归档页、分类页、标签页会基于 frontmatter 中的 `categories` 与 `tags` 字段自动聚合。

## 子页面索引

| 场景 | 文件 | 说明 |
| --- | --- | --- |
| 标准技术文章 | [standard.md](./standard.md) | 最常见的博客文章写法，含封面、描述、标签、分类 |
| 置顶与推荐文章 | [pinned.md](./pinned.md) | `top` 与 `recommend` 字段的使用 |
| 加密文章 | [encrypted.md](./encrypted.md) | `crypto` 字段加密正文，密钥文件 + 密码双重验证 |
| 转载文章 | [reprint.md](./reprint.md) | `reprint` 字段标注原文信息，渲染来源卡片 |
| 带参考资料的文章 | [references.md](./references.md) | `references` 字段在文末渲染参考资料区块 |
| 工具页 / 速查表 | [tool-page.md](./tool-page.md) | `isPage`、`aside`、`fullWidth`、`cbx` 字段的组合使用 |

## 字段组合速查表

下表汇总各场景的字段组合，便于快速对照：

| 场景 | 必用字段 | 可选字段 | 关键开关 |
| --- | --- | --- | --- |
| 标准技术文章 | `title` `date` | `tags` `categories` `description` `articleGPT` `cover` `mainColor` | — |
| 置顶与推荐文章 | 标准字段 | `top` `recommend` | `top: true` / `recommend: true` |
| 加密文章 | `title` `date` `crypto` | `articleGPT`（建议填写） | `crypto.enable: true` |
| 转载文章 | `title` `date` `reprint` | `cover` `description` | — |
| 带参考资料的文章 | `title` `date` `references` | `top` `recommend` | — |
| 工具页 / 速查表 | `title` `date` | `cover` `description` | `isPage: true` `aside: false` `fullWidth: true` |
| 代码密集型文章 | 标准字段 | — | `cbx: true` |

各场景之间并非互斥。一篇加密的转载文章、一篇带参考资料的置顶文章、一篇全宽的代码密集型速查表，都是合法的组合。字段之间没有冲突，按需叠加即可。

## SEO 与分享优化

frontmatter 中有四个字段直接影响文章在搜索引擎与社交平台的展示效果：

- **`description`**：写入 HTML `<meta name="description">`，用于搜索引擎结果摘要、文章列表卡片文案、社交分享卡片描述。未填写时回退到正文摘要。
- **`articleGPT`**：显示在文章页顶部作为摘要（主题仅模仿 GPT 摘要的展示样式，内容需手动填写，或开启 [aiSummary AI 文章摘要](../../config/ai-summary.md) 接入大模型自动生成），不写入 SEO meta，不影响搜索结果。
- **`cover`**：作为社交分享卡片的图片（Open Graph `og:image`）。未设置时使用默认封面。
- **`mainColor`**：控制列表卡片与封面的主色调，影响站内视觉，不影响 SEO。

::: tip description 与 articleGPT 的分工
`description` 面向外部（搜索引擎、社交平台、列表卡片），`articleGPT` 面向读者（文章页顶部摘要）。两者职责不同，建议每篇文章都填写 `description`，需要单独的页内摘要时再填写 `articleGPT`。未填 `articleGPT` 时回退到 `description`，不会出现空白。
:::

推荐做法：每篇文章都填写 `description` 与 `cover`。`description` 控制在 80-120 字，概括文章主题；`cover` 使用与内容相关的图片，提升列表与分享卡片的辨识度。

