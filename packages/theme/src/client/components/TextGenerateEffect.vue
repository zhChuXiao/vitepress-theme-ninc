<!--
  文字渐入效果
-->
<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from "vue";

const props = defineProps({
  words: { type: String, default: "" },
  filter: { type: Boolean, default: true },
  duration: { type: Number, default: 0.7 },
  delay: { type: Number, default: 0 },
  interval: { type: Number, default: 50 },
});

const emit = defineEmits(["done"]);

const scope = ref(null);
// 按字符分词（展开运算符正确处理 Unicode/emoji），适配中文场景
const chars = computed(() => [...props.words]);
const spanStyle = computed(() => ({
  opacity: 0,
  filter: props.filter ? "blur(10px)" : "none",
  transition: `opacity ${props.duration}s ease, filter ${props.duration}s ease`,
}));

let timers = [];
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};

// 触发渐入：逐字解除 blur+opacity:0
const run = () => {
  clearTimers();
  if (!scope.value) return;
  const spans = scope.value.querySelectorAll("span");
  if (!spans.length) {
    emit("done");
    return;
  }
  const startTimer = setTimeout(() => {
    spans.forEach((span, index) => {
      const t = setTimeout(() => {
        span.style.opacity = "1";
        span.style.filter = props.filter ? "blur(0px)" : "none";
        // 最后一个字符动画完成后通知父组件
        if (index === spans.length - 1) {
          const doneTimer = setTimeout(() => emit("done"), props.duration * 1000);
          timers.push(doneTimer);
        }
      }, index * props.interval);
      timers.push(t);
    });
  }, props.delay);
  timers.push(startTimer);
};

onMounted(run);
// 组件卸载时清理所有未触发的定时器，避免卸载后继续写 span 样式
onBeforeUnmount(clearTimers);
</script>

<template>
  <div class="text-generate-effect leading-snug tracking-wide">
    <div ref="scope">
      <span
        v-for="(char, idx) in chars"
        :key="idx"
        class="inline-block"
        :style="spanStyle"
      >{{ char }}</span>
    </div>
  </div>
</template>
