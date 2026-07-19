<!-- AI 摘要（FakeGPT / 大模型 双模式） -->
<template>
  <div v-if="showCard" class="article-gpt s-card">
    <div class="title">
      <span class="name" @click="router.go('/posts/2024/0218')">
        <i class="iconfont icon-robot"></i>
        文章摘要
        <i class="iconfont icon-up"></i>
      </span>
      <span :class="['logo', { loading }]" @click="showOther"> {{ logoText }} </span>
    </div>
    <div class="content s-card">
      <TextGenerateEffect
        v-if="animate && abstractData"
        :key="abstractData"
        :words="abstractData"
        class="text"
        @done="loading = false"
      />
      <template v-else>
        <span class="text">{{ abstractData === "" ? "加载中..." : abstractData }}</span>
        <span v-if="loading" class="point">|</span>
      </template>
    </div>
    <div class="meta">
      <span class="tip">{{ tipText }}</span>
      <a href="javascript:void(0)" class="report">投诉</a>
    </div>
    <canvas id="articleGPT-bg" class="articleGPT-bg" ref="articleGPTBg"></canvas>
  </div>
</template>

<script setup>
import TextGenerateEffect from "../../TextGenerateEffect.vue";

const { frontmatter, theme, page } = useData();
const router = useRouter();

// AI 摘要配置（themeConfig.aiSummary，构建期已剔除 apiKey 等敏感字段）
const aiSummary = computed(() => theme.value?.aiSummary || {});
// 总开关：启用大模型
const aiEnable = computed(() => aiSummary.value.enable === true);
// 运行时代理开关：浏览器端为没有摘要的文章实时生成（需配置 endpoint）
const runtimeEnable = computed(
  () => aiEnable.value && aiSummary.value.runtime?.enable === true && !!aiSummary.value.runtime?.endpoint,
);
// 是否已有摘要内容（手动 articleGPT 或构建期注入的 AI 摘要）
const hasContent = computed(() => !!frontmatter.value.articleGPT);
// 卡片渲染条件：AI 已开启时始终显示（无摘要时显示"摘要生成失败"）；未开启时需有手动摘要
const showCard = computed(() => aiEnable.value || hasContent.value);

// provider 显示名（logo 胶囊默认文案）
const PROVIDER_NAMES = {
  openai: "OpenAI",
  deepseek: "DeepSeek",
  kimi: "Kimi",
  glm: "GLM",
  qwen: "通义千问",
  minimax: "MiniMax",
  mimo: "小米 MiMo",
  "mimo-token-plan": "小米 MiMo",
  doubao: "豆包",
  "volcengine-coding": "火山方舟",
  shengsuanyun: "胜算云",
  stepfun: "StepFun",
  custom: "AI",
};
const logoText = computed(() => {
  if (!aiEnable.value) return "FakeGPT";
  return aiSummary.value.logoText || PROVIDER_NAMES[aiSummary.value.provider] || "AI";
});
const tipText = computed(
  () =>
    aiSummary.value.tip ||
    "此内容根据文章生成，并经过人工审核，仅用于文章内容的解释与总结",
);

// 摘要数据
const loading = ref(true);
const waitTimeOut = ref(null);
const abstractData = ref("");
// 是否用渐入动画展示摘要（完整文本一次性展示时为 true；流式逐段到达时为 false，直接显示累积文本）
const animate = ref(false);
const showType = ref(false);
// 当前展示的完整文本（手动摘要或运行时生成的摘要）
const currentText = ref(frontmatter.value.articleGPT || "");
// 组件卸载标记 / 运行时请求中断控制器（避免卸载后继续写状态、请求悬挂）
const isUnmounted = ref(false);
let runtimeAbort = null;

// 摘要渐入动画由 <TextGenerateEffect> 组件接管（逐字 blur+opacity 渐入），
// 不再用递归 setTimeout 打字机；失败兜底文案也走渐入或直接显示
// 初始化摘要：模拟思考延迟后，把完整摘要交给渐入组件一次性展示
const initAbstract = () => {
  waitTimeOut.value = setTimeout(
    () => {
      if (isUnmounted.value) return;
      abstractData.value = currentText.value;
      animate.value = true;
      // loading 由 <TextGenerateEffect @done> 关闭
    },
    Math.random() * (3800 - 2500) + 2500,
  );
};

// 运行时缓存读写（localStorage 不可用，如隐私模式时静默降级为无缓存）
const readRuntimeCache = (key) => {
  try {
    return localStorage.getItem(key) || "";
  } catch {
    return "";
  }
};
const writeRuntimeCache = (key, value) => {
  try {
    if (value) localStorage.setItem(key, value);
  } catch {
    // 缓存写入失败不影响展示
  }
};

// 解析 SSE 流，逐段回调最新全文，返回完整摘要
// 兼容两种数据格式：代理转发的 { text: "片段" } 与 OpenAI 原始 delta 格式
const consumeSSEStream = async (res, onChunk) => {
  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let full = "";
  const handleLine = (line) => {
    if (!line.startsWith("data:")) return;
    const payload = line.slice(5).trim();
    if (!payload || payload === "[DONE]") return;
    try {
      const json = JSON.parse(payload);
      const piece = json.text ?? json.choices?.[0]?.delta?.content ?? "";
      if (piece) {
        full += piece;
        onChunk(full);
      }
    } catch {
      // 忽略非 JSON 行（如心跳注释）
    }
  };
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) handleLine(line.replace(/\r$/, ""));
  }
  buffer += decoder.decode();
  if (buffer) handleLine(buffer.replace(/\r$/, ""));
  return full;
};

// 运行时代理：浏览器端实时生成摘要（优先 SSE 流式，代理不支持时自动降级为 JSON 一次性返回）
// 失败时静默回退到 description / fallbackText，不弹错误提示、不阻断页面
const fetchRuntimeSummary = async (onChunk) => {
  const runtime = aiSummary.value.runtime || {};
  const fallbackText = runtime.fallbackText || "AI 摘要暂时不可用，请直接阅读正文。";
  const fallback = () => (frontmatter.value.description || "").trim() || fallbackText;
  // localStorage 缓存：同一访客对同一版本文章只调用一次代理（v1 为协议版本号）
  const cacheKey = `ai-summary:v1:${page.value.relativePath}:${page.value.lastUpdated || ""}`;

  const cached = readRuntimeCache(cacheKey);
  if (cached) return { summary: cached, fromCache: true };

  // 提取正文（不足 50 字直接兜底，不浪费请求）
  const doc = document.querySelector(".vp-doc");
  const maxLen = aiSummary.value.maxInputLength || 2000;
  const text = (doc?.textContent || "").replace(/\s+/g, " ").trim().slice(0, maxLen);
  if (text.length < 50) return { summary: fallback(), fromCache: false };

  // 流式开关：runtime.stream !== false 且浏览器支持 ReadableStream
  const useStream = runtime.stream !== false && typeof ReadableStream !== "undefined";
  runtimeAbort = new AbortController();
  // 流式生成整体耗时较长，默认超时放宽到 30s
  const timer = setTimeout(() => runtimeAbort?.abort(), runtime.timeout || 30000);
  try {
    const res = await fetch(runtime.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: useStream ? "text/event-stream" : "application/json",
      },
      body: JSON.stringify({ content: text, path: page.value.relativePath, stream: useStream }),
      signal: runtimeAbort.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") || "";
    let summary = "";
    if (useStream && contentType.includes("text/event-stream") && res.body) {
      summary = (await consumeSSEStream(res, onChunk)).trim();
    } else {
      // 代理未开启流式：兼容旧版 JSON 响应 { summary }
      const data = await res.json();
      summary = (data?.summary || "").trim();
      if (summary && onChunk) onChunk(summary);
    }
    if (!summary) throw new Error("empty summary");
    writeRuntimeCache(cacheKey, summary);
    return { summary, fromCache: false };
  } catch (error) {
    // 组件卸载导致的主动中断不做兜底处理，直接向上抛
    if (error?.name === "AbortError" && isUnmounted.value) throw error;
    console.warn("[vitepress-theme-ninc] 运行时 AI 摘要生成失败，已回退兜底文案：", error);
    return { summary: fallback(), fromCache: false };
  } finally {
    clearTimeout(timer);
    runtimeAbort = null;
  }
};

// 初始化运行时代理摘要：模拟思考延迟后发起请求
// 流式响应直接逐段渲染（打字机效果由流本身呈现）；缓存命中则走打字机复现
const initRuntimeAbstract = () => {
  waitTimeOut.value = setTimeout(
    async () => {
      if (isUnmounted.value) return;
      try {
        const { summary, fromCache } = await fetchRuntimeSummary((partial) => {
          if (!isUnmounted.value) {
            // 流式响应：逐段累积显示，不走渐入动画（保持流式打字感）
            animate.value = false;
            abstractData.value = partial;
          }
        });
        if (isUnmounted.value) return;
        currentText.value = summary;
        if (fromCache) {
          // 缓存命中：完整文本走渐入动画
          animate.value = true;
          abstractData.value = summary;
        } else {
          // 流式完成：已逐步显示，无需再动画；失败兜底且 abstractData 仍空时直接显示
          if (!abstractData.value) {
            abstractData.value = summary;
            animate.value = true;
          }
          loading.value = false;
        }
      } catch {
        // 卸载中断等场景，静默处理
      }
    },
    Math.random() * (3800 - 2500) + 2500,
  );
};

// 输出摘要介绍
const showOther = () => {
  if (loading.value) return false;
  const text = aiEnable.value
    ? `如你所见，摘要由 AI 大模型${aiSummary.value.model ? `（${aiSummary.value.model}）` : ""}根据文章内容生成，仅供参考，请批判性阅读。`
    : "如你所见，这是一个假的 GPT，所有文本皆源于本地书写的内容。我在这里只负责显示，并仿照 GPT 的形式输出。";
  loading.value = true;
  if (!showType.value) {
    // 切换到介绍文案
    showType.value = true;
    abstractData.value = text;
  } else {
    // 切回文章摘要
    showType.value = false;
    abstractData.value = currentText.value;
  }
  // abstractData 变化触发 :key 重挂载，TextGenerateEffect 重新渐入
  animate.value = true;
};

const articleGPTBg = ref(null)
onMounted(() => {
  if (!showCard.value) return
  // 有现成摘要内容走原逻辑；运行时代理可用时实时生成；都没有则显示失败提示
  if (hasContent.value) {
    initAbstract()
  } else if (runtimeEnable.value) {
    initRuntimeAbstract()
  } else {
    // AI 已开启但无摘要内容且无运行时代理：直接显示失败（缓存缺失或 buildGenerate: false 且未预生成）
    abstractData.value = '摘要生成失败'
    animate.value = false
    loading.value = false
  }
  const canvas = articleGPTBg.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const img = new Image()
  img.src = '/images/cover/bg-hd.png'
  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
  }
})

onBeforeUnmount(() => {
  isUnmounted.value = true;
  clearTimeout(waitTimeOut.value);
  // 中断进行中的运行时请求，避免悬挂
  try {
    runtimeAbort?.abort();
  } catch {
    // 忽略中断异常
  }
});
</script>

<style lang="scss" scoped>
.article-gpt {
  margin-top: 1.2rem;
  background-color: var(--main-card-second-background);
  user-select: none;
  position: relative;
  cursor: auto;
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.8rem;
    padding: 0 8px;
    .name {
      display: flex;
      align-items: center;
      color: var(--main-color);
      font-weight: bold;
      cursor: var(--main-pointer-cursor);
      .icon-robot {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: normal;
        width: 26px;
        height: 26px;
        color: var(--main-card-background);
        background-color: var(--main-color);
        border-radius: 50%;
        margin-right: 8px;
      }
      .icon-up {
        font-weight: normal;
        font-size: 12px;
        margin-left: 6px;
        opacity: 0.6;
        color: var(--main-color);
        transform: rotate(90deg);
      }
    }
    .logo {
      padding: 4px 10px;
      font-size: 12px;
      color: var(--main-card-background);
      background-color: var(--main-color);
      border-radius: 25px;
      font-weight: bold;
      cursor: var(--main-pointer-cursor);
      &.loading {
        animation: loading 1s infinite;
        cursor: not-allowed;
      }
    }
  }
  .content {
    cursor: auto;
    .text {
      position: relative;
      z-index: 100;
    }
    .point {
      color: var(--main-color);
      font-weight: bold;
      margin-left: 4px;
      animation: loading 0.8s infinite;
    }
  }
  .meta {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 1rem;
    padding: 0 8px;
    font-size: 12px;

    .tip {
      opacity: 0.6;
    }
    .report {
      white-space: nowrap;
      margin-left: 12px;
      opacity: 0.8;
    }
  }
}
.articleGPT-bg {
  position: absolute;
  top: -112px;
  right: 5%;
  width: 180px;
  // top: -175px;
  // right: 5%;  
  // width: 280px;
  pointer-events: none;
}
.dark .articleGPT-bg {
  filter: brightness(0.8);
}
</style>
