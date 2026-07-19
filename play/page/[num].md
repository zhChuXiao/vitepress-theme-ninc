---
aside: false
padding: false
---

<script setup>
import { useData } from 'vitepress'
import { Home } from 'vitepress-theme-ninc/views'

const { params } = useData()
</script>

<Home :showHeader="false" :page="Number(params.num)" />
