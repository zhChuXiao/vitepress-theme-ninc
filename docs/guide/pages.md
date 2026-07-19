# 自定义页面

一个完整的博客除了文章列表，还需要首页、归档页、分类页、标签页、关于页、留言板等。本主题将这些页面分为三类：**组件页面**、**动态路由页面**、**纯文字页面**。

::: tip 设计原则：主题与博客解耦
本主题所有内置页面组件都从 `vitepress-theme-ninc/views` 导出入口统一导出，**不使用** `@/views/xxx.vue` 这类依赖主题内部目录结构的别名导入。这样你的博客代码与主题包完全解耦，主题升级时内部目录调整不会影响你的页面文件。
:::

## 页面类型总览

| 类型 | 特征 | 是否需要 import | 示例 |
| --- | --- | --- | --- |
| 组件页面 | md 文件中使用主题内置组件 | 是，从 `vitepress-theme-ninc/views` 导入 | 关于、归档、分类、标签、留言板、赞赏名单、装备 |
| 动态路由页面 | 路径含 `[参数]`，需 `paths.mjs` 配合 | 是，从 `vitepress-theme-ninc/views` 导入 | 分类详情、标签详情、分页 |
| 纯文字页面 | 纯 Markdown 内容，无组件 | 否 | 版权协议、隐私政策、Cookies |

::: warning 组件必须显式导入
主题内置组件**不会自动注册到 md 文件中**，所有组件页面都必须在 `<script setup>` 中显式导入：

```md
<script setup>
import { About } from 'vitepress-theme-ninc/views'
</script>

<About />
```

这是为了保证博客与主题包解耦，避免使用 `@/views/xxx.vue` 这种暴露主题内部路径的写法。
:::

---

## 组件页面

组件页面是最常见的页面类型——Markdown 文件中通过 `<script setup>` 显式导入主题组件，再用标签渲染。

### 关于页（About）

```md
---
title: 关于本站
aside: false
---

<script setup>
import { About } from 'vitepress-theme-ninc/views'
</script>

<About />
```
![关于本站](/images/scrollShowcase/about-light.png)

`About` 组件的内容来自 [themeConfig](./theme-config.md) 中的站点信息和侧边栏欢迎信息配置。如果你需要完全自定义关于页内容，可以直接在 md 中写 Markdown，不用组件。

### 归档页（Archives）

```md
---
title: 全部文章
aside: true
---

<script setup>
import { Archives } from 'vitepress-theme-ninc/views'
</script>

<Archives />
```
![归档页渲染效果](/images/scrollShowcase/archives-light.png)

归档页自动从 `posts/` 目录读取所有文章并按年月分组展示。

### 分类页（Categories）

```md
---
title: 全部分类
aside: false
---

<script setup>
import { CatOrTag } from 'vitepress-theme-ninc/views'
</script>

<CatOrTag />
```
![分类页渲染效果](/images/article/categories.png)

### 标签页（Tags）

```md
---
title: 全部标签
aside: false
---

<script setup>
import { CatOrTag } from 'vitepress-theme-ninc/views'
</script>

<CatOrTag type="tags" />
```
![标签页渲染效果](/images/article/tags.png)

分类页和标签页共用 `CatOrTag` 组件，通过 `type="tags"` 区分。不传 `type` 默认为分类模式。

### 留言板（Comments）

```md
---
title: 留言板
aside: true
card: false
comment: true
---

<script setup>
import { CommentsView } from 'vitepress-theme-ninc/views'
</script>

<CommentsView />
```
![留言板渲染效果](/images/scrollShowcase/comments-dark.png)

留言板页面的评论功能依赖 [评论系统配置](./theme-config.md#评论系统)。`comment: true` 确保评论组件在此页面渲染。

### 赞赏名单（Thanks）

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

赞赏名单页展示 `rewardData.list` 中的赞赏记录，包含统计概览与赞赏者列表。数据来源与配置方式见 [打赏配置](../config/reward.md)。

### 装备页（Equipment）

```md
---
title: 我的装备
aside: false
comment: true
---

<script setup>
import { Equipment } from 'vitepress-theme-ninc/views'
</script>

<Equipment />
```
![装备页渲染效果](/images/scrollShowcase/equipment-dark.png)

装备页展示博主使用的设备清单，数据来自 [themeConfig](./theme-config.md) 中的 `equipment` 配置。

### 首页重定向（index.md）

如果博客首页不在根目录 `index.md` 而在 `pages/index.md`，可以创建一个重定向页面：

```md
---
title: 正在重定向
---

<script setup>
import { onMounted } from "vue"
import { useRouter } from "vitepress"

const router = useRouter();

onMounted(() => router.go("/"));
</script>
```

::: tip 首页位置
通常首页就是根目录的 `index.md`，通过 `layout: home` 标识。首页顶部的标题、副标题、横幅等通过 [themeConfig.homeTop](./theme-config.md#首页配置) 配置。
:::

---

## 动态路由页面

当页面路径包含动态参数时（如 `/pages/categories/技术分享`、`/pages/tags/Vue`），需要使用 VitePress 的 [动态路由](https://vitepress.dev/zh/guide/routing#dynamic-routes) 机制。

动态路由由两个文件组成：

```text
pages/categories/
├─ [name].md            # 页面模板，使用 params.name 引用参数
└─ [name].paths.mjs     # 路由生成器，返回所有可能的参数列表
```

::: warning 动态路由页面也需要显式导入
动态路由页面中的 `<Home>` 组件同样需要显式导入，与组件页面保持一致。
:::

### 分类详情页

::: code-group

```md [pages/categories/[name].md]
---
title: 分类
aside: false
padding: false
---

<script setup>
import { onMounted } from "vue";
import { useData } from "vitepress"
import { Home } from 'vitepress-theme-ninc/views'

const { params, site } = useData();

onMounted(() => {
  document.title = `分类：${params.value.name} | ${site.value.title}`;
});
</script>

<Home :showHeader="false" :showCategories="params.name" />
```

```js [pages/categories/[name].paths.mjs]
import { getAllPosts, getAllCategories } from "vitepress-theme-ninc/utils";

const postData = await getAllPosts();
const categoriesData = getAllCategories(postData);

export default {
  paths() {
    const pages = [];
    Object.keys(categoriesData).forEach((key) => {
      pages.push({ params: { name: key.toString() } });
    });
    return pages;
  },
};
```

:::

### 标签详情页

::: code-group

```md [pages/tags/[name].md]
---
title: 标签
aside: false
padding: false
---

<script setup>
import { onMounted } from "vue";
import { useData } from "vitepress"
import { Home } from 'vitepress-theme-ninc/views'

const { params, site } = useData();

onMounted(() => {
  document.title = `标签：${params.value.name} | ${site.value.title}`;
});
</script>

<Home :showHeader="false" :showTags="params.name" />
```

```js [pages/tags/[name].paths.mjs]
import { getAllPosts, getAllType } from "vitepress-theme-ninc/utils";

const postData = await getAllPosts();
const tagsData = getAllType(postData);

export default {
  paths() {
    const pages = [];
    Object.keys(tagsData).forEach((key) => {
      pages.push({ params: { name: key.toString() } });
    });
    return pages;
  },
};
```

:::

### 分页页

::: code-group

```md [page/[num].md]
---
aside: false
padding: false
---

<script setup>
import { useData } from "vitepress"
import { Home } from 'vitepress-theme-ninc/views'

const { params } = useData();
</script>

<Home :showHeader="false" :page="Number(params.num)" />
```

```js [page/[num].paths.mjs]
import { getAllPosts } from "vitepress-theme-ninc/utils";
import { themeConfig } from "../.vitepress/themeConfig.ts";

const postData = await getAllPosts();
const postsPerPage = themeConfig.postSize;
const totalPages = Math.ceil(postData.length / postsPerPage);

export default {
  paths() {
    const pages = [];
    for (let pageNum = 2; pageNum <= totalPages; pageNum += 1) {
      pages.push({ params: { num: pageNum.toString() } });
    }
    return pages;
  },
};
```

:::

第 1 页对应首页 `/`，由 `index.md` 渲染，所以 `paths()` 从第 2 页开始生成。

### paths.mjs 可用的工具函数

本主题在 `vitepress-theme-ninc/utils` 中导出了以下 Node 端工具函数，可在 `paths.mjs` 中调用：

| 函数 | 作用 |
| --- | --- |
| `getAllPosts()` | 读取 `posts/` 下所有文章，返回 PostData 数组 |
| `getAllType(posts)` | 从文章中提取所有标签，返回 `{ 标签名: 文章列表 }` |
| `getAllCategories(posts)` | 从文章中提取所有分类，返回 `{ 分类名: 文章列表 }` |
| `getAllArchives(posts)` | 按年月归档文章 |
| `getUnencryptedPosts()` | 返回未加密的文章列表 |

---

## 纯文字页面

版权协议、隐私政策、Cookies 政策等页面包含大量文字内容，需要完整的 Markdown 语法支持，不适合放在 `themeConfig` 中配置。这类页面**不内置在主题包中**，由用户自行创建并编写内容。

::: tip 为什么不放进 themeConfig？
这些页面内容动辄上千字、需要多层标题、列表、链接、强调等 Markdown 语法。如果塞进 `themeConfig` 的字符串字段，会带来三个问题：

1. **可读性差**：长字符串在 JS 配置文件中难以维护，转义和换行繁琐
2. **丢失语法**：Markdown 的标题层级、代码块、表格等语法无法直接表达
3. **耦合度高**：内容修改要改配置文件并重启，不如直接编辑 md 文件直观

因此这类页面采用「**用户自行创建 md 文件 + frontmatter 控制外观**」的方式，既保留完整 Markdown 语法，又能复用主题的布局能力。
:::

主题提供了 frontmatter 字段来控制这些页面的外观：

| 字段 | 作用 | 推荐值 |
| --- | --- | --- |
| `card` | 启用卡片背景样式 | `true` |
| `aside` | 隐藏侧边栏 | `false` |
| `comment` | 启用评论 | `true`（如需用户反馈） |

### 版权协议页模板

```md
---
title: 版权协议
aside: false
card: true
---

# 版权协议

本站所有原创内容均采用 **[知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh)**（简称 CC BY-NC-SA 4.0）。

## 一、适用范围
（此处写你的协议内容……）

## 二、用户权利
（此处写你的协议内容……）
```

### 隐私政策页模板

```md
---
title: 隐私政策
aside: false
card: true
---

# 隐私政策

**更新日期：2024 年 12 月 02 日**

欢迎来到本站。本站非常重视您的隐私和个人信息保护……

## 信息收集与使用
（此处写你的隐私政策内容……）
```

### Cookies 政策页模板

```md
---
title: Cookies
aside: false
card: true
---

# Cookies 政策

为了确保网站的可靠性、安全性和个性化，我使用 Cookies……

## 什么是 Cookies？
（此处写你的 Cookies 政策内容……）
```

::: tip 完整示例
本仓库 `blog/pages/` 目录下有完整的版权协议（`cc.md`）、隐私政策（`privacy.md`）、Cookies 政策（`cookies.md`）页面文件，可直接复制到你的项目中修改使用。
:::

---

## 自定义组件页面

如果你想创建主题没有内置的页面（如项目展示、工具页等），可以在 `.vitepress/theme/components/` 目录下创建自己的 Vue 组件。用户自定义组件可自动注册，详见 [覆盖组件 - 组件自动注册机制](./override-components.md#组件自动注册机制)。

```md
---
title: 我的项目
aside: false
---

<MyProject />
```

如果页面需要传递动态数据，可以在 `<script setup>` 中获取：

```md
---
title: 我的项目
---

<script setup>
import { useData } from "vitepress"
const { theme } = useData()
</script>

<MyProject :data="theme.postData" />
```

---

## 可导出的主题组件列表

所有主题内置页面组件都从 `vitepress-theme-ninc/views` 统一导出，在 `<script setup>` 中按需导入即可：

```ts
import { About, Home } from 'vitepress-theme-ninc/views'
```

| 组件名 | 用途 | 常用 props |
| --- | --- | --- |
| `About` | 关于页 | — |
| `Archives` | 归档页 | — |
| `CatOrTag` | 分类/标签页 | `type="tags"` 切换为标签模式 |
| `CommentsView` | 留言板 | — |
| `Equipment` | 装备展示 | — |
| `Home` | 首页/文章列表 | `:showCategories`、`:showTags`、`:page`、`:showHeader` |
| `Post` | 文章详情页 | — |
| `Page` | 普通页面布局 | — |
| `Project` | 项目展示页 | — |
| `Redirect` | 重定向组件 | — |
| `Thanks` | 赞赏名单页 | — |
| `BackgroundCanvas` | 3D 粒子背景（依赖 three.js） | — |
| `BackgroundCanvas2d` | 2D 星空背景（默认启用） | — |

::: warning 不要使用 @ 别名导入
请始终通过 `vitepress-theme-ninc/views` 导入组件，**不要**使用 `@/views/About.vue` 这类直接引用主题内部路径的写法。`@` 别名指向主题包内部目录，可能在未来版本调整，使用导出入口可保证兼容性。
:::

---

## 布局控制

通过 frontmatter 可以控制页面的布局形态：

| 字段 | 作用 | 适用场景 |
| --- | --- | --- |
| `aside` | `false` 隐藏侧边栏 | 工具页、分类页、标签页 |
| `fullWidth` | `true` 启用全宽布局 | 速查表、表格密集型页面 |
| `padding` | `false` 去除内容区内边距 | 全屏组件式页面 |
| `card` | `true` 启用卡片背景 | 版权协议、隐私政策等文字页面 |
| `comment` | `true` 启用评论 | 留言板 |
| `layout` | `home` / `doc` 等 | 首页用 `home` |

::: tip 完整 frontmatter 字段
布局相关字段的完整说明见 [Frontmatter 字段](./frontmatter.md)。
:::

---

## 页面文件速查表

| 页面 | 文件路径 | 核心内容 | 依赖配置 |
| --- | --- | --- | --- |
| 首页 | `index.md` | `layout: home` | [homeTop](./theme-config.md#首页配置) |
| 关于 | `pages/about.md` | `<About />` | 站点信息 + 侧边栏欢迎信息 |
| 归档 | `pages/archives.md` | `<Archives />` | 自动读取 posts |
| 分类 | `pages/categories.md` | `<CatOrTag />` | 自动读取 posts |
| 标签 | `pages/tags.md` | `<CatOrTag type="tags" />` | 自动读取 posts |
| 分类详情 | `pages/categories/[name].md` + `.paths.mjs` | `<Home :showCategories="params.name" />` | paths.mjs 调用 `getAllCategories` |
| 标签详情 | `pages/tags/[name].md` + `.paths.mjs` | `<Home :showTags="params.name" />` | paths.mjs 调用 `getAllType` |
| 留言板 | `pages/comments.md` | `<CommentsView />` | [评论系统](./theme-config.md#评论系统) + [friends.comments](./theme-config.md#友情链接) |
| 赞赏名单 | `pages/thanks.md` | `<Thanks />` | [rewardData.list](../config/reward.md) |
| 装备 | `pages/equipment.md` | `<Equipment />` | equipment 配置 |
| 版权协议 | `pages/cc.md` | 纯 Markdown | 无 |
| 隐私政策 | `pages/privacy.md` | 纯 Markdown | 无 |
| Cookies | `pages/cookies.md` | 纯 Markdown | 无 |
| 分页 | `page/[num].md` + `.paths.mjs` | `<Home :page="Number(params.num)" />` | [postSize](./theme-config.md#基础配置) |

::: tip 统一约定
所有使用主题组件的页面（组件页面 + 动态路由页面）都需要在 `<script setup>` 中从 `vitepress-theme-ninc/views` 显式导入对应组件。纯文字页面无需导入任何组件。
:::

