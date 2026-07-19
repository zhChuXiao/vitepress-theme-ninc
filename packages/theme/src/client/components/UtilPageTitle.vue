<template>
  <div class="header-section">
      <div class="header-title">
        <h3 class="page-title">
          <slot v-if="$slots.title" name="title"></slot>
          <span v-else>{{ title }}</span>
        </h3>
        <span class="tip">
          <slot v-if="$slots.tip" name="tip"></slot>
          <span v-else>{{ tip }}</span>
        </span>
      </div>

      <div class="header-controls">
       <slot name="controls"></slot>
      </div>
    </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  tip: {
    type: String,
    default: ''
  }
})


</script>

<style lang="scss" scoped>

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--main-card-second-background);
  border: 1px solid var(--main-card-border);
  border-radius: 12px;
  .header-title {
    display: flex;
    align-items: flex-end;
    gap: 0.3rem;
    font-size: 0.9rem;
    color: var(--main-font-second-color);
    .tip {
      font-size: 0.8rem;
      color: var(--main-font-second-color);
    }
  }
  .page-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--main-color);
    margin: 0;
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}
@media screen and (max-width:1450px) {
  .header-section{
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    .header-title{
      width: 100%;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .header-controls{
      width: 100%;
      justify-content: center;
    }
  }
}
</style>