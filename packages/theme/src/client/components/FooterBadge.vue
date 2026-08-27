<template>
  <div class="badge-container vp-raw">
    <!-- ElTooltip 的 popper Teleport 容器 id 含运行时计数器，SSR 与客户端序列不一致
         必然触发 hydration mismatch（dev 版 Vue 实证）——故 tooltip 仅在挂载后激活：
         SSR/hydration 时刻均渲染裸 img（结构一致），mounted 后切换为 ElTooltip 分支 -->
    <template v-for="item in theme.footer.badge" :key="item.rightText">
      <el-tooltip v-if="mounted && item.tooltip" :content="item.tooltip" placement="top">
        <img
          class="badge-img"
          :src="badgeSrc(item)"
          :alt="item.tooltip"
          @click="toLink(item.link)"
        />
      </el-tooltip>
      <img
        v-else
        class="badge-img"
        :src="badgeSrc(item)"
        :alt="item.tooltip || item.rightText"
        @click="toLink(item.link)"
      />
    </template>
  </div>
</template>

<script setup>
import { ElTooltip } from 'element-plus'
const { theme } = useData()

// 挂载标记：tooltip 延迟到 hydration 完成后激活（见模板注释）
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const toLink = link => {
  if (link) window.open(link, '_blank', 'noopener')
}

// shields.io badge URL 中 - 是字段分隔符，_ 会被解析为空格。
// 用户配置的原始文本（如 "BY-NC-SA 4.0"）需按 shields.io 规则转义：
//   _  → __  （必须先转义 _，避免后续空格转义被破坏）
//   -  → --  （转义连字符，避免被当作分隔符）
//   空格 → _  （空格用 _ 表示）
// 这样用户配置时直接写原始文本即可，无需手动转义。
const escapeShieldText = (text) => {
  if (!text) return ''
  return String(text)
    .replace(/_/g, '__')
    .replace(/-/g, '--')
    .replace(/\s/g, '_')
}

const badgeSrc = (item) => {
  const left = escapeShieldText(item.leftText)
  const right = escapeShieldText(item.rightText)
  const color = (item.color || '').replace('#', '')
  const style = item.style || 'for-the-badge'
  const logo = item.logo || ''
  return `https://img.shields.io/badge/${left}-${right}-${color}?style=${style}&logo=${logo}`
}
</script>

<style lang="scss" scoped>
.badge-container {
  background-color: var(--main-card-background-opacity2);
  display: flex;
  justify-content: center;
  padding: 0 10px 50px 10px;
  gap: 15px;
  flex-wrap: wrap;
  .badge-img {
    height: 25px;
    border-radius: 5px;
  }
  // @media screen and (max-width: 768px) {
  //   .badge-img {
  //     width: auto;
  //   }
  // }
}
</style>
