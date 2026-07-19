<template>
  <span :class="['VPBadge', type]">{{ text }}</span>
</template>
<script setup>
defineProps({
  type: {
    type: String,
    default: "info",
  },
  text: {
    type: String,
    default: "",
  },
});
</script>
<style lang="scss" scoped>
.VPBadge {
  display: inline-block;
  margin-left: 2px;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 0 10px;
  line-height: 22px;
  font-size: 12px;
  font-weight: 500;
  transform: translateY(-2px);
  &.info {
    border-color: var(--vp-badge-info-border);
    color: var(--vp-badge-info-text);
    background-color: var(--vp-badge-info-bg);
  }
  &.tip {
    border-color: var(--vp-badge-tip-border);
    color: var(--vp-badge-tip-text);
    background-color: var(--vp-badge-tip-bg);
  }
  &.warning {
    border-color: var(--vp-badge-warning-border);
    color: var(--vp-badge-warning-text);
    background-color: var(--vp-badge-warning-bg);
  }
  &.danger {
    border-color: var(--vp-badge-danger-border);
    color: var(--vp-badge-danger-text);
    background-color: var(--vp-badge-danger-bg);
  }
}
</style>
