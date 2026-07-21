<template>
  <!-- 字体图标：渲染为 <i class="iconfont icon-xxx"> -->
  <i v-if="resolved?.type === 'font'" :class="`iconfont icon-${resolved.name}`" />
  <!-- SVG 图标：用 SvgIcon 渲染 <svg><use xlink:href="#icon-xxx" /></svg> -->
  <SvgIcon
    v-else-if="resolved?.type === 'svg'"
    :name="resolved.name"
    :width="size"
    :height="size"
  />
  <!-- 无图标或解析失败：不渲染 -->
</template>

<script setup>
import { computed } from 'vue'
import SvgIcon from './SvgIcon.vue'
import { resolveIcon } from '../utils/icon'

const props = defineProps({
  /** 图标字段，支持三种写法：字符串 / 'svg:文件名' 前缀字符串 / 对象 { type, name } */
  icon: {
    type: [String, Object],
    default: ''
  },
  /** SVG 图标尺寸（仅对 svg 类型生效，字体图标用 font-size 控制） */
  size: {
    type: String,
    default: '20px'
  }
})

const resolved = computed(() => resolveIcon(props.icon))
</script>
