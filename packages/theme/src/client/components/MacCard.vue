<template>
  <div class="mac-card">
    <div class="mac-card-header">
      <div class="dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <span class="title">
        <slot name="title">{{ title }}</slot>
      </span>
    </div>
    <div class="mac-card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.mac-card {
  background: var(--main-card-background);
  border: 1px solid var(--main-card-border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;

  &:hover {
    border-color: var(--main-color);
    box-shadow: var(--main-shadow-blue);
  }
}

.mac-card-header {
  background: var(--main-card-second-background);
  padding: 0.8rem 1rem;
  border-bottom: 1px solid var(--main-card-border);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dots {
  display: flex;
  gap: 0.5rem;

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;

    &.red {
      background-color: #fc625d;
    }
    &.yellow {
      background-color: #fdbc40;
    }
    &.green {
      background-color: #35cd4b;
    }
  }
}

.title {
  color: var(--main-font-color);
  font-size: 0.9rem;
  font-weight: 500;
  width: 100%;
}

.mac-card-content {
  padding: 1rem;
}
</style>