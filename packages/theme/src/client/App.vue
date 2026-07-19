<template>
  <!-- 背景图片 -->
  <Background />
  <!-- 加载提示 -->
  <Loading />
  <!-- 滚动进度条 -->
  <ScrollProgress />
  <!-- 中控台 -->
  <Control />
  <!-- 导航栏 -->
  <Nav :is-util-page="isUtilPage" />
  <!-- 主内容 -->
  <main
    :class="[
      'mian-layout',
      {
        loading: loadingStatus,
        'is-post': isPostPage,
        'full-width': frontmatter.fullWidth || page.isNotFound,
        'is-util': isUtilPage,
      },
    ]"
  >
    <!-- 404 -->
    <NotFound v-if="page.isNotFound" />
    <!-- 首页 -->
    <Home v-if="frontmatter.layout === 'home'" showHeader />
    <!-- 页面 -->
    <template v-else>
      <!-- 文章页面 -->
      <!-- <PostHeader v-if="isPostPage" /> -->
      <Post v-if="isPostPage" />
      <!-- 普通页面 -->
      <Page v-else-if="!page.isNotFound" />
    </template>
  </main>
  <!-- 页脚 -->
  <FooterLink
    v-show="!loadingStatus && !isUtilPage && !page.isNotFound"
    :showBar="isPostPage && !page.isNotFound"
  />
  <FooterBadge v-show="!loadingStatus && !isUtilPage && !page.isNotFound" />
  <FooterAnimals v-show="!loadingStatus && !isUtilPage && !page.isNotFound" />
  <Footer v-show="!loadingStatus && !isUtilPage && !page.isNotFound" />
  <!-- 悬浮菜单 -->
  <Teleport to="body">
    <!-- 左侧菜单 -->
    <div :class="['left-menu', { hidden: footerIsShow }]">
      <!-- 全局设置 -->
      <Settings v-if="theme.settingButton" />
      <!-- 全局播放器 -->
      <Player />
    </div>
  </Teleport>
  <!-- 右键菜单 -->
  <RightMenu ref="rightMenuRef" />
  <!-- 全局消息 -->
  <Message />
  <!-- 背景画布 -->
  <!-- <BackgroundCanvas v-if="themeType !== 'light'" /> -->
  <BackgroundCanvas2d v-show="showCanvas" />
</template>

<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from './store';
import { calculateScroll, specialDayGray } from './utils/helper';
import ScrollProgress from "./components/ScrollProgress.vue";
import BackgroundCanvas from "./views/BackgroundCanvas.vue";
import BackgroundCanvas2d from "./views/BackgroundCanvas2d.vue";
const route = useRoute();
const isProd = import.meta.env.PROD;
const showCanvas = computed(() => {
  const disabledRoutePath = ['/pages/nes']
  return isDark.value && isProd && !disabledRoutePath.includes(route.path);
});
const store = mainStore();
const { frontmatter, page, theme } = useData();
const {
  loadingStatus,
  footerIsShow,
  themeValue,
  themeType,
  backgroundType,
  fontFamily,
  fontSize,
  isLandscape,
  isMobile,
  isDark,
} = storeToRefs(store);

// 右键菜单
const rightMenuRef = ref(null);

// 判断是否为文章页面
const isPostPage = computed(() => {
  const routePath = decodeURIComponent(route.path);
  return routePath.includes("/posts/");
});
const isUtilPage = computed(() => {
  const routePath = decodeURIComponent(route.path);
  // return routePath.includes('/utils/')
  return false;
});

// 开启右键菜单
const openRightMenu = (e) => {
  rightMenuRef.value?.openRightMenu(e);
};

// 复制时触发
const copyTip = () => {
  const copiedText = window.getSelection().toString();
  // 检查文本内容是否不为空
  if (copiedText.trim().length > 0 && typeof $message !== "undefined") {
    $message.success("复制成功，在转载时请标注本文地址");
  }
};

// 更改正确主题类别
const changeSiteThemeType = () => {
  // 主题 class
  // const themeClasses = {
  //   dark: "dark",
  //   light: "light",
  //   auto: "auto",
  // };
  // 必要数据
  const htmlElement = document.documentElement;
  // console.log('当前模式：', themeType.value)
  // 清除所有 class 原主题切换
  // Object.values(themeClasses).forEach(themeClass => {
  //   htmlElement.classList.remove(themeClass)
  // })
  // 添加新的 class 原主题切换
  // if (themeType.value === 'auto') {
  //   // 根据当前操作系统颜色方案更改明暗主题
  //   const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  //   const autoThemeClass = systemPrefersDark ? themeClasses.dark : themeClasses.light
  //   htmlElement.classList.add(autoThemeClass)
  //   themeValue.value = autoThemeClass
  // } else if (themeClasses[themeType.value]) {
  //   htmlElement.classList.add(themeClasses[themeType.value])
  //   themeValue.value = themeClasses[themeType.value]
  // }
  if (backgroundType.value === "image") {
    htmlElement.classList.add("image");
  } else {
    htmlElement.classList.remove("image");
  }
};

// 切换系统字体样式
const changeSiteFont = () => {
  try {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove("JinBuTi", "hmos");
    htmlElement.classList.add(fontFamily.value);
    htmlElement.style.fontSize = fontSize.value + "px";
  } catch (error) {
    console.error("切换系统字体样式失败", error);
  }
};
const mediaQuery =
  typeof window !== "undefined"
    ? window.matchMedia("(orientation: landscape)")
    : null;
isLandscape.value = mediaQuery?.matches;
const handleOrientationChange = (e) => {
  isLandscape.value = e.matches;
};
// 检测开发者工具打开
const detectDevTools = () => {
  // 检测是否为 Mac 设备
  const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

  // 监听常用的开发者工具快捷键
  window.addEventListener("keydown", (e) => {
    // F12 (通用)
    // Windows: Ctrl+Shift+I
    // Mac: Command+Option+I
    if (
      e.key === "F12" ||
      (!isMac && e.ctrlKey && e.shiftKey && e.code === "KeyI") ||
      (isMac && e.metaKey && e.altKey && e.code === "KeyI")
    ) {
      if (typeof $message !== "undefined") {
        $message.warning(`开发者模式已打开，请遵循GPL协议`);
      }
    }
  });
};

// 监听设置变化
watch(
  // () => [themeType.value, backgroundType.value],
  () => [backgroundType.value],
  () => changeSiteThemeType()
);
watch(
  () => fontFamily.value,
  () => changeSiteFont()
);

onMounted(() => {
  loadingStatus.value = false;
  // 全站置灰
  specialDayGray();
  // 检测开发者工具
  detectDevTools();
  // 获取用户位置（支持通过 aside.welcome.ipLocation 自定义接口）
  store.getUserLocation(theme.value?.aside?.welcome?.ipLocation)
  // 更改主题类别
  changeSiteThemeType();
  // 切换系统字体样式
  changeSiteFont();
  // 滚动监听
  window.addEventListener("scroll", calculateScroll);
  // 右键监听
  window.addEventListener("contextmenu", openRightMenu);
  // 复制监听
  window.addEventListener("copy", copyTip);
  // 监听系统颜色
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", changeSiteThemeType);
  // 监听横屏竖屏
  mediaQuery?.addEventListener("change", handleOrientationChange);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", calculateScroll);
  window.removeEventListener("contextmenu", openRightMenu);
  mediaQuery?.removeEventListener("change", handleOrientationChange);
});
</script>

<style lang="scss" scoped>
.mian-layout {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  // 手动实现加载动画
  animation: show 0.5s forwards;
  animation-duration: 0.5s;
  display: block;
  &.loading {
    display: none;
  }
  &.full-width {
    max-width: 100%;
  }
  &.is-util {
    padding: 0;
  }
  @media (max-width: 768px) {
    padding: 1rem 0.5em;
    &.is-post {
      padding: 0;
    }
  }
}
.left-menu {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 1002;
  transition: opacity 0.3s, transform 0.3s;
  &.hidden {
    opacity: 0;
    transform: translateY(100px);
  }
}
</style>
