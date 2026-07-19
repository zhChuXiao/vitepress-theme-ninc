<template>
  <div class="topGroup" @mouseleave="showTodayCard">
    <div v-for="(item, index) in topGroupList" :key="index" ref="recentPostItemRef" class="recent-post-item"
      @click="navigateTo(item.regularPath)">
      <div class="post_cover left_radius">
        <a :href="item.path" :title="item.title">
          <span class="recent-post-top-text">荐</span>
          <img class="post_bg" :src="item.cover" alt="cover" @error="handleImageError" />
        </a>
      </div>
      <div class="recent-post-info">
        <a class="article-title" :href="item.path" :title="item.title">{{ item.title }}</a>
      </div>
    </div>
    <a id="todayCard" class="todayCard" ref="todayCardRef" @click="todayCardClick" style="z-index: 1">
      <div class="todayCard-info">
        <div class="todayCard-tips">{{ bannerDetails.tip }}</div>
        <div class="todayCard-title">{{ bannerDetails.title }}</div>
      </div>
      <img class="todayCard-cover" :src="bannerCover" alt="封面"
        @error="handleImageError" />
      <div class="banner-button-group">
        <div class="banner-button" @click.stop.prevent="hideTodayCard">
          <i class="iconfont icon-fire"></i>
          <span class="banner-button-text">更多推荐</span>
        </div>
      </div>
    </a>
  </div>
</template>

<!-- <script>
import { useRouter } from 'vitepress'
export default {
  name: 'TopGroup',
  setup() {
    const router = useRouter()
    return {
      router
    }
  },
  props: {
    topGroupList: {
      type: Array,
      default: () => []
    },
    topGroupBannerTips: String,
    topGroupBannerTitle: String,
    topGroupBannerImage: String,
    topGroupBannerLink: String
  },
  methods: {
    navigateTo(path) {
      // 使用 pjax 进行导航
      pjax.loadUrl(path)
    },
    handleImageError(event) {
      event.target.src = this.$themeConfig.error_img.post_page
    },
    // 隐藏今日卡片
    hideTodayCard: function () {
      if (this.$refs.todayCardRef) {
        this.$refs.todayCardRef.classList.add('hide')
        const topGroup = document.querySelector('.topGroup')
        const recentPostItems = topGroup.querySelectorAll('.recent-post-item')
        recentPostItems.forEach(item => {
          item.style.display = 'flex'
        })
      }
    },
    showTodayCard: function () {
      if (this.$refs.todayCardRef) {
        this.$refs.todayCardRef.classList.remove('hide')
        this.$refs.todayCardRef.style.zIndex = 1
      }
    },
    todayCardClick: function (event) {
      if(this.topGroupBannerLink === '/') {
        event.preventDefault()
        this.$router.push('/')
      }
    }
  }
}
</script> -->
<script setup lang="jsx">
import { ref, h, computed } from 'vue'
import { useRouter, useData } from 'vitepress'
const { theme } = useData()
import { mainStore } from '../../store'
const store = mainStore()
// 定义 props
const props = defineProps({
  topGroupList: {
    type: Array,
    default: () => []
  },
  bannerDetails: Object,
  topGroupBannerTips: String,
  topGroupBannerTitle: String,
  topGroupBannerImage: String,
  topGroupBannerLink: String
})

const router = useRouter()

// 推荐站点封面图：dark 模式优先 darkImage，未配置时回退到 image（与文档约定一致）
const bannerCover = computed(() => {
  const dark = props.bannerDetails?.darkImage
  const light = props.bannerDetails?.image
  return store.isDark ? (dark || light || '') : (light || dark || '')
})

const todayCardRef = ref(null)

// 跳转
const navigateTo = path => {
  router.go(path)
}

// 图片错误
const handleImageError = event => {
  event.target.src = theme.value.error_img || ''
}

// 隐藏今日卡片
const hideTodayCard = () => {
  if (todayCardRef.value) {
    todayCardRef.value.classList.add('hide')
    const topGroup = document.querySelector('.topGroup')
    const recentPostItems = topGroup.querySelectorAll('.recent-post-item')
    recentPostItems.forEach(item => {
      item.style.display = 'flex'
    })
  }
}

const showTodayCard = () => {
  if (todayCardRef.value) {
    todayCardRef.value.classList.remove('hide')
    todayCardRef.value.style.zIndex = 1
  }
}

// 今日卡片点击
const todayCardClick = event => {
  event.preventDefault()
  let path = props.bannerDetails.recommendUrl
  let isNewTab = props.bannerDetails.newTab
  if (!path || path === '/') {
    $vmessage.info(
      <div style={{ color: '#1b1c20' }}>
        暂无推荐项目，点击左下角 <span style={{ color: '#8e5cd9', fontWeight: 'bold' }}>更多推荐</span> 按钮查看全部置顶文章
      </div>
    )
    return
  }
  isNewTab ? window.open(path) : router.go(path)
}
</script>

<style scoped lang="scss">
.todayCard-title {
  font-family: Arial, Helvetica, sans-serif;
}

.todayCard-title,
.todayCard-tips,
.topGroup .banner-button {
  color: var(--main-font-color);
}

.topGroup {
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: calc(600px + 1.5rem);
  position: relative;
  align-content: space-between;
}

.topGroup .todayCard {
  position: absolute;
  width: calc(600px + 1rem);
  height: 100%;
  z-index: 1;
  top: 0;
  left: 0;
  margin-left: 0.5em;
  background: var(--main-card-background);
  border-radius: 12px;
  overflow: hidden;
  transition: 0.3s;
  display: flex;
  cursor: var(--main-pointer-cursor);
  pointer-events: all;
}

.todayCard:hover .todayCard-cover {
  transform: scale(1.01);
}

.topGroup .todayCard .todayCard-info {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  z-index: 2;
  color: var(--main-font-color);
  max-width: 60%;
  transition: 0.3s;
}

.topGroup .todayCard .todayCard-info .todayCard-tips {
  opacity: 0.8;
  font-size: 12px;
}

.topGroup .todayCard .todayCard-info .todayCard-title {
  font-size: 26px;
  font-weight: bold;
  line-height: 36px;
}

.topGroup .todayCard .todayCard-cover {
  position: absolute;
  object-fit: contain;
  height: auto;
  top: -20px;
  left: 0;
  z-index: -1;
  transition: 0.3s;
  background-image: var(--top-group-gradient);
}

.topGroup .banner-button-group {
  position: absolute;
  right: 2rem;
  bottom: 2rem;
  display: flex;
  transition: 0.3s;
}

.topGroup .todayCard.hide .todayCard-cover {
  transform: scale(1.2);
}

.topGroup .banner-button {
  background: var(--main-banner-button-color);
  border-radius: 20px;
  color: var(--main-font-color);
  display: flex;
  align-items: center;
  z-index: 1;
  transition: 0.3s;
  cursor: var(--main-pointer-cursor);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transform: translateZ(0);
  height: 40px;
  width: 125px;
  justify-content: center;
}

.topGroup .banner-button-group .banner-button .banner-button-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topGroup .banner-button i,
.topGroup .banner-button svg {
  margin-right: 8px;
  font-size: 22px;
}

.topGroup .todayCard::after {
  position: absolute;
  content: '';
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition: all 0.3s;
  box-shadow: 0 -109px 133px -9px var(--main-mask-background) inset;
}

.topGroup .todayCard.hide {
  opacity: 0;
  pointer-events: none;
}

.topGroup .todayCard img {
  object-fit: cover;
  width: 100%;
  height: 80px;
  background: var(--main-card-second-background);
  border-radius: 12px 12px 0 0;
}

.topGroup .recent-post-item:nth-child(4),
.topGroup .recent-post-item:nth-child(5),
.topGroup .recent-post-item:nth-child(6) {
  margin-bottom: 0;
  margin-top: 0;
}

.topGroup .recent-post-item {
  display: none;
  width: 100px;
  flex-direction: column;
  align-items: flex-start;
  background: var(--main-card-background);
  border-radius: 12px;
  overflow: hidden;
  min-width: 200px;
  height: 164px !important;
  max-height: 164px;
  border: 1px solid var(--main-card-border);
  transition: 0.3s;
  position: relative;
  box-shadow: var(--main-shadow-border);
  margin-left: 0.5rem;
  margin-right: 0px;
  margin-bottom: 0.5rem;
  cursor: var(--main-pointer-cursor);
}

.topGroup .recent-post-item:hover .recent-post-info .article-title {
  color: var(--main-color);
}

.topGroup .recent-post-item .post_cover {
  width: 100%;
}

.topGroup .recent-post-item .post_cover a {
  height: 100px;
  overflow: hidden;
  display: flex;
}

.topGroup span.recent-post-top-text {
  position: absolute;
  top: 0;
  left: -40px;
  display: flex;
  z-index: 1;
  background: var(--main-color);
  color: var(--main-font-color);
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 12px 0 12px 0;
  transition: 0.3s;
  cursor: var(--main-pointer-cursor);
}

.topGroup .recent-post-item .post_cover img {
  object-fit: cover;
  width: 100%;
  background: var(--main-card-second-background);
  border-radius: 12px 12px 0 0;
}

.topGroup .recent-post-item .recent-post-info {
  padding: 0.3rem 0.5rem 0.3rem 0.5rem;
  transition: 0.3s;
}

.topGroup .recent-post-item .recent-post-info .article-title {
  -webkit-line-clamp: 2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-height: 1.5;
  justify-content: center;
  align-items: flex-end;
  align-content: center;
  padding-top: 0.5rem;
  font-weight: bold;
  font-size: 0.9rem !important;
  padding: 0 !important;
}

.topGroup .recent-post-item:hover .recent-post-top-text {
  left: 0;
}

@media screen and (max-width: 1200px) {
  .topGroup .todayCard {
    background: #0e57d5;
  }

  div#bannerGroup {
    height: auto;
    width: auto;
  }

  .topGroup .recent-post-item {
    display: flex;
  }

  .categoryGroup .categoryItem:nth-child(3) {
    display: none;
  }

  .categoryGroup {
    flex-direction: column;
    height: 95%;
  }

  .topGroup {
    display: flex;
    flex-wrap: nowrap;
    width: auto;
    height: auto;
  }

  .topGroup .todayCard {
    display: none;
  }

  .swiper_container_card {
    display: flex;
    flex-direction: row !important;
    justify-content: flex-start !important;
    flex-wrap: nowrap;
    width: 100%;
    overflow-x: scroll;
  }

  .categoryItem {
    height: 48%;
    min-width: 200px;
    box-shadow: none !important;
  }

  .categoryGroup {
    display: flex !important;
  }

  #bbTimeList {
    margin: 0 1.5rem;
    max-width: 100%;
    width: auto;
  }
}

.swiper_container_card::-webkit-scrollbar {
  display: none;
}

.topGroup .banner-button:hover {
  background: var(--main-color-bg4);
  color: var(--main-font-color);
}
</style>
