<template>
  <div class="home-top">
    <div class="container_card_left">
      <div id="bannerGroup">
        <div id="random-banner">
          <div class="banners-title">
            <div class="banners-title-big">{{ theme.homeTop.title }}</div>
            <div class="banners-title-big">{{ theme.homeTop.subtitle }}</div>
            <div class="banners-title-small">{{ theme.homeTop.link }}</div>
          </div>
          <tags-group-all :creativity-data="creativityData" />
          <a id="random-hover" @click="router.go(shufflePost(recommendPost))">
            <i class="iconfont icon-paper-plane"></i>
            <div class="bannerText">
              <span>随便逛逛</span>
              <LottieIcon v-if="isClient" class="lottie-icon" width="140px" height="140px" loop autoplay :animationData="arrowRight" />
              <!-- <i class="iconfont icon-arrow-right2"></i> -->
            </div>
          </a>
        </div>

        <div class="categoryGroup">
          <div
            v-for="(item, index) in theme.homeTop.category"
            :key="index"
            class="categoryItem"
            :style="{ boxShadow: item.shadow }"
          >
            <a :href="item.path" class="categoryButton" :class="item.class">
              <span class="categoryButtonText">{{ item.name }}</span>
              <i class="iconfont" :class="item.icon"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- <LottieIcon class="lottie-icon2" width="180px" height="180px" loop autoplay :animationData="grayCat" /> -->
      <canvas id="bannerGroup-bg" class="bannerGroup-bg" ref="bannerGroupBg"></canvas>
    </div>
    <div class="container_card_right">
      <TopGroup
        :topGroupBannerTips="theme.homeTop.banner.tip"
        :topGroupBannerTitle="theme.homeTop.banner.title"
        :topGroupBannerImage="theme.homeTop.banner.image"
        :topGroupBannerLink="theme.homeTop.banner.link"
        :topGroupList="topGroupList"
        :bannerDetails="theme.homeTop.banner"
      />
      <!-- <LottieIcon class="lottie-icon2" width="240px" height="240px" loop autoplay :animationData="grayCat" /> -->
    </div>
  </div>
</template>

<script setup>
import TagsGroupAll from './TagsGroupAll.vue'
import TopGroup from './TopGroup.vue'
import creativityJson from '../../config/creativity'
import { useData } from 'vitepress'
import { ref, computed, onMounted } from 'vue'
import { shufflePost } from '../../utils/helper'
import { useRouter } from 'vitepress'
// const LottieIcon = () => import('../../components/LottieIcon.vue')
import arrowRight from '../../assets/lottie/arrow-right.json'
// import cat from '../../assets/lottie/cat.json'
// gray_cat 动画与上方模板中的两处 <LottieIcon grayCat> 同属被注释停用的装饰；
// 保留 import 会把该 JSON 打进首页 chunk，保持与模板一致的注释状态
// import grayCat from '../../assets/lottie/gray_cat.json'
const { theme } = useData()

// 推荐文章（"随便逛逛"与 TopGroup 列表同一份数据，复用同一 computed 避免两次 filter）
const recommendPost = computed(() => {
  return theme.value.postData.filter(item => item.recommend === true)
})
// 推荐
const topGroupList = recommendPost

const creativityData = ref(
  theme.value.homeTop.creativity?.length
    ? theme.value.homeTop.creativity
    : creativityJson
)
const router = useRouter()
const bannerGroupBg = ref(null)

const isClient = ref(false)
onMounted(() => {
  isClient.value = true
  const canvas = bannerGroupBg.value
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
  // 装饰图缺失时（如站点未在 public/images/cover/ 放置 bg-hd.png）隐藏 canvas，
  // 避免 0×0 画布留白占位且无任何报错提示
  img.onerror = () => {
    canvas.style.display = 'none'
  }
})
</script>

<style lang="scss">
@use './homeTop.scss';
@use './categoryGroup.scss';

.home-top {
  width: 100%;
  height: 100%;
  display: flex;
  // gap: 20px;
  .container_card_left {
    position: relative;
  }
  .container_card_right {
    display: flex;
    position: relative;
    overflow: visible;
  }
}
.lottie-icon2 {
  position: absolute;
  top: -90px;
  // left: -10px;
  left: 200px;
  z-index: 100;
  pointer-events: none;
}
.bannerGroup-bg {
  position: absolute;
  top: -112px;
  left: 170px;
  width: 180px;
  pointer-events: none;
  cursor: var(--main-pointer-cursor);
}
.dark .bannerGroup-bg {
  filter: brightness(0.8);
}
@media (max-width: 1200px) {
  .home-top {
    overflow-x: scroll;
  }
  .lottie-icon2 {
    top: -9999px;
  }
  .bannerGroup-bg {
    display: none;
  }
}
</style>
