<template>
  <div class="lottie-container" ref="container" :style="containerStyle"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";

// 定义组件属性
const props = defineProps({
  animationData: {
    type: Object,
    required: true,
  },
  loop: {
    type: Boolean,
    default: true,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  width: {
    type: [String, Number],
    default: "100%",
  },
  height: {
    type: [String, Number],
    default: "100%",
  },
  speed: {
    type: Number,
    default: 1,
  },
  direction: {
    type: Number,
    default: 1,
    validator: (value) => value === 1 || value === -1,
  },
  segments: {
    type: Array,
    default: null,
  },
  // 通过父组件传入renderer决定渲染器
  renderer: {
    type: String,
    default: "svg",
    validator: (value) => ["svg", "canvas", "html"].includes(value),
  },
  rendererSettings: {
    type: Object,
    default: () => ({}),
  },
  initialSegment: {
    type: Array,
    default: null,
  },
});

// 计算样式
const containerStyle = computed(() => {
  const width =
    typeof props.width === "number" ? `${props.width}px` : props.width;
  const height =
    typeof props.height === "number" ? `${props.height}px` : props.height;

  return {
    width,
    height,
    overflow: "hidden",
  };
});

// 定义事件
const emit = defineEmits([
  "complete",
  "loopComplete",
  "enterFrame",
  "segmentStart",
  "config_ready",
  "data_ready",
  "data_failed",
  "loaded_images",
  "DOMLoaded",
  "destroy",
  "error",
]);

const container = ref(null);
let animation = ref(null);
let lottie = null;

// 定义控制方法
const play = () => {
  animation.value?.play();
};

const pause = () => {
  animation.value?.pause();
};

const stop = () => {
  animation.value?.stop();
};

const setSpeed = (speed) => {
  if (animation.value) {
    animation.value.setSpeed(speed);
  }
};

const setDirection = (direction) => {
  if (animation.value) {
    animation.value.setDirection(direction);
  }
};

const goToAndPlay = (value, isFrame = true) => {
  if (animation.value) {
    animation.value.goToAndPlay(value, isFrame);
  }
};

const goToAndStop = (value, isFrame = true) => {
  if (animation.value) {
    animation.value.goToAndStop(value, isFrame);
  }
};

const setSegment = (startFrame, endFrame) => {
  if (animation.value) {
    animation.value.setSegment(startFrame, endFrame);
  }
};

const playSegments = (segments, forceFlag) => {
  if (animation.value) {
    animation.value.playSegments(segments, forceFlag);
  }
};

const getDuration = (inFrames = true) => {
  if (animation.value) {
    return animation.value.getDuration(inFrames);
  }
  return 0;
};

// 暴露方法给父组件
defineExpose({
  play,
  pause,
  stop,
  setSpeed,
  setDirection,
  goToAndPlay,
  goToAndStop,
  setSegment,
  playSegments,
  getDuration,
  lottieInstance: animation,
});

// 初始化 Lottie 动画
const initLottie = async () => {
  if (!container.value || !props.animationData) return;

  if (!lottie) {
    const lottieModule = await import("lottie-web/build/player/lottie_light");
    lottie = lottieModule.default || lottieModule;
  }

  animation.value = lottie.loadAnimation({
    container: container.value,
    renderer: props.renderer,
    loop: props.loop,
    autoplay: props.autoplay,
    animationData: props.animationData,
    rendererSettings: props.rendererSettings,
    initialSegment: props.initialSegment,
  });

  // 设置初始速度和方向
  animation.value.setSpeed(props.speed);
  animation.value.setDirection(props.direction);

  // 设置初始分段
  if (props.segments) {
    animation.value.playSegments(props.segments, true);
  }

  // 注册事件监听
  animation.value.addEventListener("complete", () => emit("complete"));
  animation.value.addEventListener("loopComplete", () => emit("loopComplete"));
  animation.value.addEventListener("enterFrame", (e) => emit("enterFrame", e));
  animation.value.addEventListener("segmentStart", (e) =>
    emit("segmentStart", e)
  );
  animation.value.addEventListener("config_ready", () => emit("config_ready"));
  animation.value.addEventListener("data_ready", () => emit("data_ready"));
  animation.value.addEventListener("data_failed", (e) =>
    emit("data_failed", e)
  );
  animation.value.addEventListener("loaded_images", () =>
    emit("loaded_images")
  );
  animation.value.addEventListener("DOMLoaded", () => emit("DOMLoaded"));
  animation.value.addEventListener("destroy", () => emit("destroy"));
  animation.value.addEventListener("error", (e) => emit("error", e));
};

// 监听属性变化
watch(
  () => props.speed,
  (newSpeed) => {
    if (animation.value) {
      animation.value.setSpeed(newSpeed);
    }
  },
  { immediate: false }
);

watch(
  () => props.direction,
  (newDirection) => {
    if (animation.value) {
      animation.value.setDirection(newDirection);
    }
  },
  { immediate: false }
);

watch(
  () => props.segments,
  (newSegments) => {
    if (animation.value && newSegments) {
      animation.value.playSegments(newSegments, true);
    }
  },
  { immediate: false, deep: true }
);

onMounted(() => {
  // 监听动画数据变化，重新加载动画
  watch(
    () => props.animationData,
    (newData) => {
      if (animation.value) {
        animation.value.destroy();
      }

      if (newData && container.value) {
        initLottie();
      }
    },
    { deep: true }
  );
  initLottie();
});

onUnmounted(() => {
  if (animation.value) {
    // 移除所有事件监听
    animation.value.removeEventListener("complete");
    animation.value.removeEventListener("loopComplete");
    animation.value.removeEventListener("enterFrame");
    animation.value.removeEventListener("segmentStart");
    animation.value.removeEventListener("config_ready");
    animation.value.removeEventListener("data_ready");
    animation.value.removeEventListener("data_failed");
    animation.value.removeEventListener("loaded_images");
    animation.value.removeEventListener("DOMLoaded");
    animation.value.removeEventListener("destroy");
    animation.value.removeEventListener("error");

    // 销毁动画实例
    animation.value.destroy();
    animation.value = null;
  }
});
</script>

<style lang="scss" scoped>
.lottie-container {
  display: inline-block;
}
</style>
