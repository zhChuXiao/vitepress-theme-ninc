---
title: 标签
aside: false
padding: false
---

<script setup>
import { onMounted } from 'vue'
import { useData } from 'vitepress'
import { Home } from 'vitepress-theme-ninc/views'

const { params, site } = useData()

onMounted(() => {
  document.title = `标签：${params.value.name} | ${site.value.title}`
})
</script>

<Home :showHeader="false" :showTags="params.name" />
