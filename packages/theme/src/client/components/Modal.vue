<!-- 弹窗组件 -->
<template>
  <Teleport to="body">
    <Transition name="fade" mode="out-in">
      <div v-if="show" class="modal">
        <div class="modal-mask" @click.stop="maskClick" />
        <div
          :style="{
            maxWidth: typeof maxWidth === 'string' ? maxWidth : `${maxWidth}px`,
          }"
          class="modal-main s-card"
          @click.stop
        >
          <!-- 标题 -->
          <div v-if="title" class="title">
            <div class="title-left">
              <i v-if="titleIcon" :class="`iconfont icon-${titleIcon}`"></i>
              <span class="title-text">{{ title }}</span>
            </div>
            <!-- 关闭按钮 -->
            <i v-if="showClose" class="iconfont icon-close close" @click="modalClose" />
          </div>
          <!-- 弹窗内容 -->
          <div class="modal-content" :style="{ '--height': maxHeight + 'vh' }">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onKeyStroke } from "@vueuse/core";
// 滚动锁与 store 共享模块级计数：store 覆盖层（设置/搜索/中控台/移动菜单）
// 与 Modal 可能同时持锁，计数归 0 时才解锁，互不越权
import { lockBodyScroll, unlockBodyScroll } from "../store";

const props = defineProps({
  // 是否显示
  show: {
    type: Boolean,
    default: false,
  },
  // 标题
  title: {
    type: String,
    default: "",
  },
  // 标题图标
  titleIcon: {
    type: String,
    default: "",
  },
  // 是否显示关闭按钮
  showClose: {
    type: Boolean,
    default: true,
  },
  // 最大宽度
  maxWidth: {
    type: [Number, String],
    default: 800,
  },
  // 最大高度
  maxHeight: {
    type: Number,
    default: 80,
  },
});

// 发射事件
const emit = defineEmits(["mask-click", "modal-close"]);

// 遮罩层事件
const maskClick = () => emit("mask-click");
const modalClose = () => emit("modal-close");

// Esc 键关闭（仅本弹窗开启时响应；onKeyStroke 随组件卸载自动清理监听）
onKeyStroke("Escape", () => {
  if (props.show) modalClose();
});

// 本实例当前是否持有滚动锁（保证加锁/解锁严格配对，不与其它实例互相干扰）
let instanceLocked = false;

// 监听开启（immediate 覆盖"挂载时 show 即为 true"的边界，保证计数平衡）
watch(
  () => props.show,
  (val) => {
    if (val && !instanceLocked) {
      lockBodyScroll();
      instanceLocked = true;
    } else if (!val && instanceLocked) {
      unlockBodyScroll();
      instanceLocked = false;
    }
  },
  { immediate: true },
);

// 组件卸载时若本实例仍持有锁，归还计数，避免整站无法滚动
onBeforeUnmount(() => {
  if (instanceLocked) {
    unlockBodyScroll();
    instanceLocked = false;
  }
});
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  z-index: 2000;
  .modal-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: var(--main-mask-background);
  }
  .modal-main {
    position: absolute;
    padding: 0;
    animation: fade-up 0.5s forwards;
    width: calc(100% - 40px);
    overflow: hidden;
    background-color: var(--main-card-background);
    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem;
      padding: 20px;
      height: 64px;
      background-color: var(--main-card-background);
      border-bottom: 1px solid var(--main-card-border);
      .title-left {
        width: 100%;
        .iconfont {
          font-size: 1.25rem;
          margin-right: 8px;
        }
      }
      .close {
        position: absolute;
        right: 20px;
        margin-right: 0;
        font-size: 1rem;
        border-radius: 8px;
        padding: 8px;
        transition: background-color 0.3s;
        cursor: var(--main-pointer-cursor);
        &:hover {
          background-color: var(--main-card-border);
        }
      }
    }
    .modal-content {
      max-height: calc(var(--height) - 46px);
      padding: 20px;
      overflow: auto;
    }
  }
}
</style>
