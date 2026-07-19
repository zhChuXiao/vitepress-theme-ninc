<template>
  <div class="about">
    <div class="author-box">
      <div class="author-tag-left" v-if="aboutConfig.avatarSkills">
        <span class="author-tag" v-for="tagItem in aboutConfig.avatarSkills.left" :key="tagItem">{{ tagItem }}</span>
      </div>
      <div class="author-img">
        <img class="no-lightbox" :src="theme.siteMeta.avatar" alt="avatar" />
      </div>
      <div class="author-tag-right" v-if="aboutConfig.avatarSkills">
        <span class="author-tag" v-for="tagItem in aboutConfig.avatarSkills.right" :key="tagItem">{{ tagItem }}</span>
      </div>
    </div>
    <h1 class="title">关于本站</h1>
    <div class="subtitle">{{ theme.siteMeta.description }}</div>
    <div class="about-content" style="grid-template-columns: 3fr 2fr">
      <!-- 介绍 -->
      <div class="about-item hello">
        <span class="text1">{{ aboutConfig.hello?.text1 }}</span>
        <span class="text2 title2">{{ aboutConfig.hello?.text2 }}</span>
        <span class="text3">{{ aboutConfig.hello?.text3 }}</span>
      </div>
      <!-- 追求 -->
      <div class="about-item pursuit">
        <span class="tip">{{ aboutConfig.pursuit?.tips }}</span>
        <span class="title1">{{ aboutConfig.pursuit?.title1 }}</span>
        <span class="title2">{{ aboutConfig.pursuit?.title2 }}</span>
        <div class="mask">
          <span
            v-for="(wordItem, index) in aboutConfig.pursuit?.word"
            :key="index"
            :class="index === 0 ? 'first-tips' : ''"
            :data-up="index === aboutConfig.pursuit.word.length - 2 ? '' : undefined"
            :data-show="index === aboutConfig.pursuit.word.length - 1 ? '' : undefined"
            >{{ wordItem }}</span
          >
        </div>
      </div>
    </div>
    <!-- 预留 -->
    <!-- <div class="about-content" style="grid-template-columns: 1fr">
      <div class="about-item"></div>
    </div> -->
    <div class="about-content" style="grid-template-columns: 2fr 2fr">
      <!-- 技能 -->
      <div class="about-item skills">
        <span class="tip">{{ aboutConfig.skills?.tip }}</span>
        <span class="title2">{{ aboutConfig.skills?.title }}</span>
        <TagsGroupAll class="skills-swiper" :creativity-data="creativityData" />
        <div class="skills-list">
          <a
            v-for="(item, index) in creativityData[0].creativity_list"
            :key="index"
            :style="{ '--color': item.color }"
            :href="item.link"
            class="skills-item"
            target="_blank"
          >
            <div class="skills-logo">
              <img :src="item.icon" :alt="item.name" />
            </div>
            <span class="skills-name">{{ item.name }}</span>
          </a>
        </div>
      </div>

      <!-- 生涯 -->
      <div class="about-item career">
        <span class="tip">{{ aboutConfig.career?.tip }}</span>
        <span class="title2">
          <i>{{ aboutConfig.career?.title }}</i>
        </span>
        <div class="list">
          <span
            v-for="(item, index) in aboutConfig.career?.list"
            :key="index"
            class="list-item"
            :style="{ '--color': item.color }"
          >{{ item.text }}</span>
        </div>
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 3fr 2fr">
      <!-- 性格 -->
      <div class="about-item character" style="--color: rgb(228 174 58)">
        <span class="tip">{{ aboutConfig.character?.tip }}</span>
        <span class="title2">{{ aboutConfig.character?.title }}</span>
        <span class="title2" style="color: var(--color)">{{ aboutConfig.character?.mbti }}</span>
        <span class="more">
          {{ aboutConfig.character?.desc }}
          <a :href="aboutConfig.character?.link" target="_blank">{{ aboutConfig.character?.linkText }}</a>
        </span>
        <img v-if="!mbtiIconError && mbtiIconSrc" :src="mbtiIconSrc" alt="male" class="male" @error="mbtiIconError = true" />
      </div>
      <!-- 座右铭 -->
      <div class="about-item">
        <span class="tip">{{ aboutConfig.motto?.tip }}</span>
        <span class="title1" style="margin-top: 20px">{{ aboutConfig.motto?.title1 }}</span>
        <span class="title2">{{ aboutConfig.motto?.title2 }}</span>
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 1fr 1fr">
      <div
        class="about-item like image like1"
        :style="{ '--color': aboutConfig.preference?.color, background: `url(${aboutConfig.preference?.image}) top/cover no-repeat` }"
      >
        <div class="image-content">
          <span class="tip">{{ aboutConfig.preference?.tip }}</span>
          <span class="title2">{{ aboutConfig.preference?.title }}</span>
          <div class="image-desc">
            <span class="left">{{ aboutConfig.preference?.desc }}</span>
          </div>
        </div>
      </div>
      <div
        class="about-item like image"
        :style="{ '--color': aboutConfig.musicPreference?.color, backgroundImage: `url(${aboutConfig.musicPreference?.image})` }"
      >
        <div class="image-content">
          <span class="tip">{{ aboutConfig.musicPreference?.tip }}</span>
          <span class="title2">{{ aboutConfig.musicPreference?.title }}</span>
          <div class="image-desc">
            <span class="left">{{ aboutConfig.musicPreference?.desc }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="about-content" style="grid-template-columns: 2fr 3fr">
      <!-- 数据 -->
      <div class="about-item static image" :style="{ '--color': aboutConfig.statistics?.color, backgroundImage: `url(${aboutConfig.statistics?.image || ''})` }">
        <div class="image-content">
          <span class="tip">{{ aboutConfig.statistics?.tip }}</span>
          <span class="title2">{{ aboutConfig.statistics?.title }}</span>
          <div class="static-data">
            <div v-for="(item, key, index) in statisticsData" :key="index" class="static-item">
              <span class="static-name">{{ key }}</span>
              <span class="static-num">{{ item }}</span>
            </div>
          </div>
          <div class="image-desc opacity">
            <span class="left"> {{ aboutConfig.statistics?.desc }} <a :href="aboutConfig.statistics?.sourceLink" target="_blank">{{ aboutConfig.statistics?.source }}</a> </span>
          </div>
        </div>
      </div>
      <!-- 信息 -->
      <div class="about-item child">
        <div class="about-item map image" :style="{ backgroundImage: `url(${aboutConfig.info?.mapImage})` }" @click="toMap">
          <span class="position">我现在住在 <strong>{{ aboutConfig.info?.address }}</strong></span>
        </div>
        <div class="about-item info">
          <div v-for="(item, index) in aboutConfig.info?.items" :key="index" class="info-item">
            <span class="info-name">{{ item.name }}</span>
            <span class="info-num" :style="{ '--color': item.color }">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 心路历程 -->
    <!-- <div class="about-content" style="display: flex">
      <div class="about-item">
        <span class="tip">心路历程</span>
        <span class="title2">为什么建站？</span>
        <p class="text">
          在<strong>知识记录</strong>与<strong>分享</strong>的旅程中，我曾面临诸多痛点。过往，我的笔记皆存放于本地，犹如被<strong>禁锢在一方狭小天地</strong>。且本地所支持的 <strong>Markdown</strong> 语法极为有限，宛如一道无形的枷锁，束缚了我对笔记功能拓展的想象。
       
          那些渴望融入笔记的<strong>丰富功能</strong>，恰似遥不可及的星辰，难以实现，我能做的，仅仅是往其中添加<strong>图片</strong>聊以慰藉。
        </p>
        <p class="text">
          直至我邂逅了 <strong>VitePress</strong>，仿若在黑暗中寻得了一束熠熠生辉的光。<strong>VitePress</strong> 不仅打破了语法的局限，更赋予我直接使用 <strong>Vue</strong> 组件的强大能力，让笔记不再是单调的文字与图片堆砌，而是充满交互性与灵动性的知识载体。
        </p>
        <p class="text">
          基于此，我毅然决定用  <strong>VitePress</strong> 创建个人博客站点，开启一段<strong>知识自由表达与分享</strong>的全新征程，让知识摆脱本地的桎梏，在更广阔的网络空间绽放光彩。
          同时也想能够有一个自己能够<strong>积累知识</strong>、<strong>积累兴趣</strong>的地方。和他人分享，会让这些成为<strong>积累和沉淀</strong>。如果能够帮助到更多的人，帮助更多人解决问题，那一定是非常棒的事情。
        </p>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { getStatistics } from '../api'
import TagsGroupAll from './home_top/TagsGroupAll.vue'
import creativity from '../config/creativity'
import { onBeforeUnmount } from 'vue'
const { theme } = useData()
const creativityData = theme.value.homeTop.creativity?.length
  ? theme.value.homeTop.creativity
  : creativity

// 关于页面配置（从 themeConfig.about 读取，与默认值深合并）
const aboutConfig = computed(() => theme.value.about || {})

// MBTI 性格图标，缺失时不显示
const mbtiIconSrc = computed(() => aboutConfig.value.character?.mbtiIcon || '')
const mbtiIconError = ref(false)
import { mainStore } from '../store'
import { storeToRefs } from 'pinia'
const store = mainStore()
const { userLocation } = storeToRefs(store)

// 轮播文字
let pursuitInterval = ref(null)
const initPursuit = () => {
  pursuitInterval.value = setInterval(function () {
    const show = document.querySelector('span[data-show]')
    const next = show.nextElementSibling || document.querySelector('.first-tips')
    const up = document.querySelector('span[data-up]')

    if (up) {
      up.removeAttribute('data-up')
    }

    show.removeAttribute('data-show')
    show.setAttribute('data-up', '')

    next.setAttribute('data-show', '')
  }, 2000)
}

// 站点统计数据
const statisticsData = ref(null)

// 获取站点统计数据
const getStatisticsData = async () => {
  const result = await getStatistics(theme.value.tongji['51la'])
  statisticsData.value = result
}

// 将Geolocation API封装为Promise
function getUserLocationPromise() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持Geolocation API'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const locationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        resolve(locationData)
      },
      error => {
        let errorMessage = '获取位置失败'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '用户拒绝了位置请求'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置信息不可用'
            break
          case error.TIMEOUT:
            errorMessage = '获取用户位置超时'
            break
          case error.UNKNOWN_ERROR:
            errorMessage = '发生未知错误'
            break
        }
        reject(new Error(errorMessage))
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  })
}

// 跳转地图
const toMap = () => {
  let title = theme.value.siteMeta.title
  let themeAddress = theme.value?.aside?.welcome?.address
  let address = aboutConfig.value.info?.address || ''
  let origin_region = userLocation.value?.city || '中国'
  let url =
    userLocation.value?.country === '中国'
      ? `http://api.map.baidu.com/direction?origin=latlng:${userLocation.value.lat},${userLocation.value.lng}|name:我家&destination=latlng:${themeAddress[1]},${themeAddress[0]}|name:${address}&origin_region=${origin_region}&destination_region=${address}&mode=driving&output=html&src=webapp.companyName.appName&coord_type=bd09ll`
      : `http://api.map.baidu.com/marker?location=${themeAddress.join(',')}&title=${title}&content=${title}&output=html&src=webapp.baidu.openAPIdemo&coord_type=bd09ll`
  getUserLocationPromise()
    .then(res => {
      userLocation.value.lat = res.lat
      userLocation.value.lng = res.lng
    })
    .finally(() => {
      window.open(url)
    })
}

onMounted(() => {
  initPursuit()
  getStatisticsData()
})
onBeforeUnmount(() => {
  clearInterval(pursuitInterval.value)
})
</script>

<style lang="scss" scoped>
.about {
  .author-box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 16px 0;
    color: var(--main-font-second-color);
    .author-tag-left {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      @media screen and (max-width: 768px) {
        display: none;
      }
      .author-tag:first-child,
      .author-tag:last-child {
        margin-right: -16px;
      }
    }
    .author-tag-right {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      @media screen and (max-width: 768px) {
        display: none;
      }
      .author-tag:first-child,
      .author-tag:last-child {
        margin-left: -16px;
      }
    }
    .author-tag {
      transform: translate(0, -4px);
      padding: 5px 8px;
      background: var(--main-card-background);
      border: 1px solid var(--main-card-border);
      border-radius: 40px;
      margin-top: 6px;
      font-size: 14px;
      font-weight: 700;
      box-shadow: 0 5px 12px -5px rgba(102, 68, 68, 0);
      animation: 6s ease-in-out 0s infinite normal none running floating;
      &:nth-child(1) {
        animation-delay: 0s;
      }
      &:nth-child(2) {
        animation-delay: 0.6s;
      }
      &:nth-child(3) {
        animation-delay: 1.2s;
      }
      &:nth-child(4) {
        animation-delay: 1.8s;
      }
    }
    .author-img {
      margin: 0 30px;
      border-radius: 50%;
      width: 180px;
      height: 180px;
      position: relative;
      background: var(--main-card-second-background);
      user-select: none;
      transition: 0.3s;
      @media screen and (max-width: 768px) {
        width: 120px;
        height: 120px;
      }
      img {
        border-radius: 50%;
        overflow: hidden;
        width: 180px;
        height: 180px;
        @media screen and (max-width: 768px) {
          width: 120px;
          height: 120px;
        }
      }
      &:hover {
        transform: scale(1.1);
      }
      &:before {
        content: '';
        transition: 1s;
        width: 30px;
        height: 30px;
        background: #57bd6a;
        position: absolute;
        border-radius: 50%;
        border: 5px solid var(--main-card-background);
        bottom: 5px;
        right: 10px;
        z-index: 2;
        @media screen and (max-width: 768px) {
          bottom: -5px;
          right: -5px;
        }
      }
    }
  }
  .title {
    font-size: 2.4rem;
    text-align: center;
    border: none;
    padding-bottom: 0;
    margin-bottom: 0.5em;
  }
  .subtitle {
    text-align: center;
    margin-bottom: 20px;
    color: var(--main-font-second-color);
    &::before {
      content: '"';
      margin-right: 10px;
    }
    &::after {
      content: '"';
      margin-left: 10px;
    }
  }
  .about-content {
    display: grid;
    grid-template-columns: auto auto;
    gap: 20px;
    margin-bottom: 20px;
    .about-item {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 1.2rem 2rem;
      border-radius: 12px;
      background-color: var(--main-card-background);
      border: 1px solid var(--main-card-border);
      box-shadow: 0 8px 12px -4px var(--main-border-shadow);
      overflow: hidden;
      .tip {
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 12px;
      }
      .title1 {
        font-size: 36px;
        font-weight: bold;
        opacity: 0.6;
      }
      .title2 {
        font-size: 36px;
        font-weight: bold;
        margin-right: 4rem;
      }
      .mask {
        font-size: 36px;
        height: 38px;
        position: relative;
        overflow: hidden;
        margin-top: 4px;
      }

      .mask span {
        display: block;
        box-sizing: border-box;
        position: absolute;
        top: 38px;
        padding-bottom: var(--offset);
        background-size: 100% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        background-repeat: no-repeat;
      }

      .mask span[data-show] {
        transform: translateY(-100%);
        transition: 0.5s transform ease-in-out;
      }

      .mask span[data-up] {
        transform: translateY(-200%);
        transition: 0.5s transform ease-in-out;
      }

      .mask span:nth-child(1) {
        background-image: linear-gradient(45deg, #0ecffe 50%, #07a6f1);
      }

      .mask span:nth-child(2) {
        background-image: linear-gradient(45deg, #18e198 50%, #0ec15d);
      }

      .mask span:nth-child(3) {
        background-image: linear-gradient(45deg, #8a7cfb 50%, #633e9c);
      }

      .mask span:nth-child(4) {
        background-image: linear-gradient(45deg, #fa7671 50%, #f45f7f);
      }
      .text {
        font-size: 18px;
        margin: 0.6rem 0;
      }
      &.child {
        background-color: transparent;
        border: none;
        box-shadow: none;
        padding: 0;
        gap: 20px;
        .about-item {
          height: 100%;
        }
      }
      &.hello {
        justify-content: center;
        padding: 2rem;
        color: #fff;
        background-image: linear-gradient(120deg, #5b27ff 0%, #00d4ff 100%);
        background-size: 200% 200%;
        animation: gradientFlow 6s ease infinite;
        .title2 {
          line-height: 2;
        }
      }
      &.pursuit {
        .title2 {
          line-height: 1.2;
          &:last-child {
            display: inline-block;
            background-size: 100% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-repeat: no-repeat;
            background-image: linear-gradient(45deg, #fa7671 50%, #f45f7f);
          }
        }
      }
      &.character {
        min-height: 220px;
        cursor: var(--main-pointer-cursor);
        .more {
          margin-top: auto;
          font-size: 14px;
          color: var(--main-color-gray);
          a {
            color: var(--main-color-gray);
            &:hover {
              color: var(--color);
            }
          }
        }
        .male {
          position: absolute;
          top: 20px;
          right: -10px;
          height: 140%;
          width: auto;
          transition: transform 0.5s;
          transform-origin: top center;
          @media (max-width: 768px) {
            height: 80%;
          }
        }
        &:hover {
          .male {
            transform: scale(1.2);
          }
        }
      }
      &.skills {
        position: relative;
        height: 400px;
        .skills-swiper {
          margin-bottom: 40px;
          position: absolute;
          top: 20%;
          left: 0;
          pointer-events: none;
          :deep(img) {
            border-radius: 0 !important;
          }
        }
        .skills-list {
          margin-top: 12px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          opacity: 0;
          transition: all 0.3s ease;
          .skills-item {
            display: flex;
            align-items: center;
            margin-right: 10px;
            margin-top: 10px;
            padding: 8px 12px 8px 8px;
            border-radius: 40px;
            background-color: var(--main-site-background);
            border: 1px solid var(--main-card-border);
            box-shadow: 0 8px 12px -4px var(--main-border-shadow);
            transition: background-color 0.3s;
            cursor: var(--main-pointer-cursor);
            .skills-logo {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 32px;
              height: 32px;
              margin-right: 8px;
              border-radius: 50%;
              background-color: var(--color);
              .iconfont {
                color: #fff;
              }
              img {
                position: relative;
                z-index: 1;
                width: 16px;
                border-radius: 0 !important;
              }
            }
            .skills-name {
              font-weight: bold;
              transition: color 0.3s;
            }
            &:hover {
              background-color: var(--main-card-background);
            }
          }
        }
        &:hover {
          .skills-swiper {
            opacity: 0;
          }
          .skills-list {
            opacity: 1;
          }
        }
      }
      &.career {
        .title2 {
          letter-spacing: 0.2rem;
          font-size: 40px;
        }
        .list {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          .list-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 12px;
            color: var(--main-font-second-color);
            &::before {
              content: '';
              display: block;
              width: 16px;
              height: 16px;
              background-color: var(--color);
              border-radius: 50%;
              margin-right: 8px;
            }
          }
        }
        .career-img {
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 100%;
          @media (max-width: 768px) {
            position: static;
          }
        }
      }
      &.game {
        min-height: 300px;
        @media (max-width: 768px) {
          min-height: 240px;
        }
      }
      &.like {
        min-height: 400px;
        @media (max-width: 768px) {
          min-height: 300px;
        }
      }
      &.image {
        background-size: cover;
        background-repeat: no-repeat;
        .image-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          z-index: 2;
          color: #fff;
          .image-desc {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-top: auto;
            &.opacity {
              font-size: 14px;
              color: #eee;
              opacity: 0.8;
              a {
                color: #eee;
                &:hover {
                  color: var(--main-color);
                }
              }
            }
          }
        }
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          box-shadow: inset 0 -70px 204px 10px var(--color);
          z-index: 0;
        }
      }

      &.static {
        .static-data {
          display: grid;
          gap: 12px;
          grid-template-columns: 1fr 1fr;
          margin: 20px 0;
          .static-item {
            display: flex;
            flex-direction: column;
            .static-name {
              font-size: 15px;
              opacity: 0.8;
            }
            .static-num {
              font-size: 34px;
              font-weight: bold;
            }
          }
        }
      }
      &.map {
        min-height: 170px;
        background-size: 105%;
        transition: background 1.5s ease-in-out;
        cursor: var(--main-pointer-cursor);
        @media (max-width: 768px) {
          background-size: cover;
          pointer-events: none;
        }
        .position {
          display: block;
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          padding: 10px 30px;
          color: #fff;
          background-color: #383838cb;
          font-size: 20px;
          transition: bottom 1.5s;
        }
        &:hover {
          background-size: 120%;
          background-position-x: 90%;
          background-position-y: 36%;
          .position {
            bottom: -80px;
          }
        }
      }
      &.info {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        .info-item {
          display: flex;
          flex-direction: column;
          margin-right: 32px;
          .info-name {
            font-size: 14px;
            margin-bottom: 8px;
            color: var(--main-font-second-color);
          }
          .info-num {
            font-size: 34px;
            font-weight: bold;
            color: var(--color);
          }
        }
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
    }
  }
}
@keyframes floating {
  0% {
    transform: translate(0, -4px);
  }
  50% {
    transform: translate(0, 4px);
  }
  100% {
    transform: translate(0, -4px);
  }
}
</style>
