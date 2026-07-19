<!-- 链接卡片 -->
<template>
  <div class="link-card-container">
    <a :href="redirectUrl" :original-href="url" :target="isOutLink ? '_blank' : null" class="link-card s-card hover">
      <span v-if="isOutLink" class="link-tip">Tip：本文为转载文章，原文来自于：</span>
      <div class="link-data">
        <div class="link-icon">
          <img v-if="icon" class="link-img" :src="icon" alt="link-img" />
          <img
            v-else-if="siteInfo?.iconUrl"
            :src="siteInfo.iconUrl"
            class="link-img"
            alt="link-img"
            @error="siteInfo.iconUrl = null"
          />
          <i v-else class="iconfont icon-link"></i>
        </div>
        <div class="link-desc">
          <!-- 标题 -->
          <span v-if="title" class="link-title">{{ title }}</span>
          <span v-else class="link-title">{{ siteInfo?.title || '暂无标题' }}</span>
          <!-- 描述 -->
          <span v-if="desc" class="link-description">{{ desc }}</span>
          <span v-else class="link-description">{{ siteInfo?.description || '暂无站点描述' }}</span>
        </div>
        <i class="link-go iconfont icon-up"></i>
      </div>
    </a>
    <div class="dashed-line"></div>
  </div>
</template>

<script setup>
import { getSiteInfo } from '../../api'

const props = defineProps({
  // 地址
  url: {
    type: String,
    default: ''
  },
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 描述
  desc: {
    type: String,
    default: ''
  },
  // 图标
  icon: {
    type: String,
    default: ''
  }
})

// 站点数据
const siteInfo = ref(null)

// 是否为站内链接
const isOutLink = computed(() => {
  const link = props.url
  if (!link) return false
  // 是否为站内链接
  return !link.startsWith('/') && (link.startsWith('http://') || link.startsWith('https://'))
})

const redirectUrl = computed(() => {
  if (isOutLink.value) {
    const encodedHref = btoa(props.url)
    const redirectPage = '/redirect'
    return `${redirectPage}.html?url=${encodedHref}`
  }
  return props.url
})

// 获取站点数据
const getSiteInfoData = async () => {
  const url = props.url
  if (!url) return false
  if (props.title || props.desc || props.icon) return false
  // 获取数据
  const result = await getSiteInfo(url)
  siteInfo.value = result
}

onMounted(() => {
  getSiteInfoData()
})
</script>

<style lang="scss" scoped>
.link-card {
  display: block;
  width: 100%;
  margin: 2rem 0;
  padding: 1rem;
  padding-top: 0.5rem;
  box-shadow: unset;
  background-color: var(--main-card-second-background);
  user-select: none;
  cursor: var(--main-pointer-cursor);
  .link-tip {
    display: inline-block;
    width: 100%;
    font-size: 12px;
    opacity: 0.6;
    padding-bottom: 0.5rem;
    margin-bottom: 0.8rem;
    border-bottom: 2px dashed var(--main-card-border);
    cursor: var(--main-pointer-cursor);
  }
  .link-data {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    .link-icon {
      width: 40px;
      height: 40px;
      min-width: 40px;
      margin-right: 0.8rem;
      border-radius: 6px;
      overflow: hidden;
      .link-img {
        width: 100%;
        height: 100%;
      }
      .iconfont {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
        background-color: var(--main-card-border);
      }
    }
    .link-desc {
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      .link-title {
        margin-bottom: 4px;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow-wrap: break-word;
        cursor: var(--main-pointer-cursor);
      }
      .link-description {
        color: var(--main-font-second-color);
        font-size: 12px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        transition: color 0.3s;
        cursor: var(--main-pointer-cursor);
      }
    }
    .link-go {
      display: flex;
      margin-left: 12px;
      transform: rotate(90deg);
      transition: color 0.3s;
    }
  }
  &:hover {
    color: var(--main-card-background);
    background-color: var(--main-color);
    .link-data {
      .link-desc {
        .link-description {
          color: var(--main-card-background);
          opacity: 0.6;
        }
      }
      .link-go {
        color: var(--main-card-background);
      }
    }
  }
}
.dashed-line {
  width: 100%;
  height: 2px;
  margin: 2rem 0;
  border-bottom: 2px dashed var(--main-card-border);
}
</style>
