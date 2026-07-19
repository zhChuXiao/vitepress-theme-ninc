# 覆盖组件

`vitepress-theme-ninc` 遵循 VitePress 的 Theme 约定，默认导出一个包含 `Layout`、`enhanceApp`、`setup` 三个字段的主题对象。当你想替换首页布局、新增全局弹窗或调整某个区域时，可以通过「扩展 Theme + 重写 Layout」来实现，而无需 fork 主题源码。本页讲解覆盖机制、组件自动注册规则与 `@/` 别名，并给出可直接复制的示例。

## Theme 对象结构

主题默认导出的对象结构如下：

```ts
import Theme from 'vitepress-theme-ninc'
// Theme = { Layout, enhanceApp, setup }
```

| 字段 | 作用 |
| --- | --- |
| `Layout` | 根布局组件，渲染为 `() => h(App)`，负责背景、导航、首页/文章/页面分发、页脚、播放器、右键菜单等 |
| `enhanceApp` | 应用增强：注册 Pinia、InstantSearch、全局组件 `LazyLoader`、tabs 客户端、路由守卫、51la 统计 |
| `setup` | 主题 setup 钩子，预留全局 `onMounted` 逻辑 |

::: warning 不要丢掉 enhanceApp / setup
`enhanceApp` 中注册了 Pinia、搜索、路由守卫等主题运行必需的能力，`setup` 是主题预留钩子。覆盖时务必通过 `...Theme` 展开保留这两个字段，只替换 `Layout`，否则主题将无法正常工作。
:::

## 基础覆盖：重写 Layout

最常见的需求是用自己的组件替换默认根布局。做法是用对象展开 `...Theme` 保留 `enhanceApp` 与 `setup`，再覆盖 `Layout` 字段。

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-ninc'
import MyLayout from './MyLayout.vue'

export default {
  ...Theme,
  Layout: MyLayout
}
```

```vue
<!-- .vitepress/theme/MyLayout.vue -->
<template>
  <div class="my-layout">
    <h1>这是我的自定义布局</h1>
    <p>这里可以渲染任何你想要的内容。</p>
  </div>
</template>
```

::: tip 完整替换 vs 局部增强
直接替换 `Layout` 会**完全接管**页面渲染，主题原本的导航、页脚、播放器都不会出现。如果你只想在主题布局基础上「加东西」，请使用下面「高级用法」中的组合方式。
:::

## 高级用法：组合主题布局

实际场景中，更常见的做法是在自定义 Layout 中**先渲染主题的原始布局**，再叠加你自己的内容（如全局弹窗、顶部公告、侧边悬浮卡片）。由于主题 `Layout` 是一个渲染函数组件，你可以直接在模板中使用它。

```vue
<!-- .vitepress/theme/MyLayout.vue -->
<script setup>
import Theme from 'vitepress-theme-ninc'
// 主题原始 Layout 可作为组件直接使用
const ThemeLayout = Theme.Layout
</script>

<template>
  <!-- 先渲染主题完整布局：背景 / 导航 / 首页 / 文章 / 页脚 / 播放器 ... -->
  <ThemeLayout />

  <!-- 再叠加你的全局组件 -->
  <AnnouncementBanner />
  <GlobalDialog />
</template>
```

```vue
<!-- .vitepress/theme/components/AnnouncementBanner.vue -->
<template>
  <div class="announcement">
    <Icon icon="lucide:party-popper" /> 欢迎来到我的博客，本站使用 vitepress-theme-ninc 主题。
  </div>
</template>

::: warning <Icon> 需自行安装
上例中的 `<Icon>` 来自 [`@iconify/vue`](https://www.npmjs.com/package/@iconify/vue)，**主题包未内置、也未全局注册该组件**。若你要在自定义组件中使用 `<Icon>`，需先安装并在 `theme/index.ts` 中注册：

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-ninc'
import { Icon } from '@iconify/vue'

export default {
  ...Theme,
  enhanceApp(ctx) {
    Theme.enhanceApp?.(ctx)
    ctx.app.component('Icon', Icon)
  }
}
```

否则将报 `Failed to resolve component: Icon`。若不想引入额外依赖，可直接用 emoji 或主题自带的 `<SvgIcon>` 替代。
:::

<style scoped>
.announcement {
  position: fixed;
  top: 70px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  padding: 8px 16px;
  border-radius: 8px;
  background: var(--main-color-bg);
  color: var(--main-color);
  border: var(--style-border);
  box-shadow: var(--main-shadow-border);
}
</style>
```

对应入口：

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-ninc'
import MyLayout from './MyLayout.vue'

export default {
  ...Theme,
  Layout: MyLayout
}
```

::: tip 关于插槽
主题的根布局 `App.vue` 是一个完整页面装配组件，并未对外暴露具名插槽。因此「局部插入内容」推荐使用上面这种「渲染原 Layout + 叠加兄弟节点」的组合方式，而不是依赖 `<slot>`。若需替换某个具体模块（如导航、页脚），可在自定义 Layout 中通过 `@/` 别名引入主题子组件自行装配。
:::

## 组件自动注册机制

主题通过 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 实现组件自动导入，扫描以下目录下的 `.vue` 文件并自动注册为全局组件：

- `.vitepress/theme/components/`
- `.vitepress/theme/views/`
- 主题包内置的 `components/` 与 `views/`（已预注册）
- 通过 `defineConfig` 第三参数 `extraComponentDirs` 额外指定的目录

这意味着**你放在上述两个目录下的组件无需手动 `import` 即可在 Markdown 与 Vue 模板中直接使用**。

```text
.vitepress/theme/
├─ index.ts
├─ components/
│  └─ MyCard.vue        ← 自动注册为 <MyCard />
└─ views/
   └─ HomeBanner.vue    ← 自动注册为 <HomeBanner />
```

在任意 Markdown 文件中：

```md
---
layout: home
---

<MyCard title="hello" />

<HomeBanner />
```

::: warning 命名冲突
若你自定义的组件名与主题内置组件同名（如 `Nav.vue`、`Footer.vue`），自动注册会以**用户目录优先**，从而实现「覆盖」效果。但请确保你确实理解了原组件的职责，避免破坏页面结构。
:::

::: tip 关闭自动注册
如需关闭组件自动注册（不推荐），可在 `defineConfig` 第三参数 `plugins` 中设置 `components: false`，详见 [配置详解 - PluginSwitches](./configuration.md#pluginswitches-开关说明)。
:::

## `@/` 别名

主题在 Vite 中配置了 `@` 路径别名，指向主题包的 `src/client/` 目录。因此你可以在 Markdown 或 Vue 文件中直接 import 主题内置的组件与视图，用于自行装配页面。

```vue
<!-- 在自定义 Layout 中引用主题组件 -->
<script setup>
import Home from '@/views/Home.vue'
import Nav from '@/components/Nav.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <Nav />
  <main>
    <Home show-header />
  </main>
  <Footer />
</template>
```

常见可引用路径：

| 引用路径 | 对应主题文件 |
| --- | --- |
| `@/views/Home.vue` | 首页视图 |
| `@/views/Post.vue` | 文章页视图 |
| `@/views/Page.vue` | 普通页面视图 |
| `@/views/NotFound.vue` | 404 页面 |
| `@/components/Nav.vue` | 导航栏 |
| `@/components/Background.vue` | 背景层 |
| `@/components/ScrollProgress.vue` | 滚动进度条 |
| `@/store` | Pinia 主 store（`import { mainStore } from '@/store'`） |
| `@/utils/helper.mjs` | 运行时工具函数 |

::: warning @/ 指向主题包，不是你的项目
`@/` 在本主题中**指向主题包的 `src/client/`**，而非用户项目的 `.vitepress/theme/`。你自己的组件请用相对路径 import，或依赖自动注册机制。
:::

## 示例一：自定义首页 Layout

下面的示例展示如何用完全自定义的首页替换主题首页，同时保留主题的导航与页脚：

```vue
<!-- .vitepress/theme/CustomHome.vue -->
<script setup>
import { useData } from 'vitepress'
import Theme from 'vitepress-theme-ninc'
import Nav from '@/components/Nav.vue'
import Footer from '@/components/Footer.vue'

const ThemeLayout = Theme.Layout
const { frontmatter } = useData()

// 仅在首页 layout === 'home' 时使用自定义首页
const isHome = computed(() => frontmatter.value.layout === 'home')
</script>

<template>
  <template v-if="isHome">
    <Nav />
    <main class="custom-home">
      <h1>{{ frontmatter.heroTitle || '我的博客' }}</h1>
      <p>{{ frontmatter.heroSubtitle || '欢迎来到这里' }}</p>
      <a class="enter-btn" href="/pages/archives">进入文章列表</a>
    </main>
    <Footer />
  </template>
  <!-- 非首页沿用主题默认布局 -->
  <ThemeLayout v-else />
</template>

<style scoped>
.custom-home {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}
.enter-btn {
  margin-top: 24px;
  padding: 10px 24px;
  border-radius: 999px;
  background: var(--main-color);
  color: #fff;
  text-decoration: none;
}
</style>
```

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-ninc'
import CustomHome from './CustomHome.vue'

export default {
  ...Theme,
  Layout: CustomHome
}
```

## 示例二：添加全局弹窗

下面的示例在保留主题完整布局的前提下，叠加一个可关闭的全局公告弹窗：

```vue
<!-- .vitepress/theme/components/GlobalDialog.vue -->
<script setup>
import { ref } from 'vue'

const visible = ref(true)
const close = () => (visible.value = false)
</script>

<template>
  <div v-if="visible" class="global-dialog">
    <div class="dialog-mask" @click="close" />
    <div class="dialog-body">
      <h3>📢 公告</h3>
      <p>本站已升级至 vitepress-theme-ninc，享受全新体验。</p>
      <button @click="close">知道了</button>
    </div>
  </div>
</template>

<style scoped>
.global-dialog {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}
.dialog-body {
  position: relative;
  padding: 24px 32px;
  border-radius: 12px;
  background: var(--main-card-background);
  color: var(--main-font-color);
  border: var(--style-border);
  box-shadow: var(--main-shadow-border);
  text-align: center;
}
</style>
```

```vue
<!-- .vitepress/theme/MyLayout.vue -->
<script setup>
import Theme from 'vitepress-theme-ninc'
const ThemeLayout = Theme.Layout
</script>

<template>
  <ThemeLayout />
  <GlobalDialog />
</template>
```

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-ninc'
import MyLayout from './MyLayout.vue'

export default {
  ...Theme,
  Layout: MyLayout
}
```

::: tip GlobalDialog 无需手动 import
`GlobalDialog.vue` 位于 `.vitepress/theme/components/` 下，已被自动注册为全局组件，所以在 `MyLayout.vue` 中可直接使用 `<GlobalDialog />` 而无需 `import`。
:::


## 在 enhanceApp 中扩展

若你需要注册第三方插件、全局指令或额外全局组件，可以包装 `enhanceApp`：

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-ninc'
import MyLayout from './MyLayout.vue'
import MyGlobalComponent from './components/MyGlobalComponent.vue'

export default {
  ...Theme,
  Layout: MyLayout,
  enhanceApp(ctx) {
    // 先调用主题原 enhanceApp，保留 Pinia / 搜索 / 路由守卫等
    Theme.enhanceApp?.(ctx)
    const { app } = ctx
    // 注册你自己的全局组件
    app.component('MyGlobalComponent', MyGlobalComponent)
    // 注册第三方插件
    // app.use(SomePlugin)
  }
}
```
