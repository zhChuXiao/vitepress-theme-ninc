<script setup lang="ts">
// 导航栏版本徽标
// 版本号由 docs/.vitepress/config.mts 在构建时从 packages/theme/package.json 读取，
// 经 vite.define 注入为编译期常量 __THEME_VERSION__，发版后自动同步，无需手动维护。
// 注意：该组件渲染在 VitePress 默认主题的 nav-bar-title-after 插槽中，
// 该插槽位于站点标题的 <a> 链接内部，因此根元素必须是 <span>，不能再用 <a>。
const version = __THEME_VERSION__
</script>

<template>
  <span class="version-badge" :title="`当前主题版本 v${version}`">v{{ version }}</span>
</template>

<style scoped>
.version-badge {
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
  white-space: nowrap;
}
</style>
