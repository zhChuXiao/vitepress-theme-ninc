<template>
  <div>
    <div v-if="postMetaData" class="post post-header">
      <div class="post-meta">
        <div class="meta">
          <div class="categories">
            <a
              v-for="(item, index) in postMetaData.categories"
              :key="index"
              :href="`/pages/categories/${item}`"
              class="cat-item"
            >
              <i class="iconfont icon-folder" />
              <span class="name">{{ item }}</span>
            </a>
          </div>
          <div class="tags">
            <a
              v-for="(item, index) in postMetaData.tags"
              :key="index"
              :href="`/pages/tags/${item}`"
              class="tag-item"
            >
              <i class="iconfont icon-hashtag" />
              <span class="name">{{ item }}</span>
            </a>
          </div>
        </div>
        <h1 class="title">
          {{ postMetaData.title || '未命名文章' }}
        </h1>
        <div class="other-meta">
          <span class="meta date">
            <i class="iconfont icon-date" />
            发表于&nbsp;{{ formatTimestamp(postMetaData.date) }}
          </span>
          <span class="update meta">
            <i class="iconfont icon-time" />
            更新于&nbsp;{{ formatTimestamp(page?.lastUpdated || postMetaData.lastModified) }}
          </span>
          <!-- 字数总计 -->
          <span class="word-count meta">
            <i class="iconfont icon-text" />
            字数总计&nbsp;{{ formatWordCount }}
          </span>
          <!-- 阅读时间 -->
          <span class="read-time meta">
            <i class="iconfont icon-time_fill" />
            阅读时长&nbsp;{{ readTime }}分钟
          </span>
          <!-- 图片数量 -->
          <span v-if="imageCount > 0" class="image-count meta">
            <i class="iconfont icon-img" />
            图片数量&nbsp;{{ imageCount }}张
          </span>
          <!-- 热度
        <span class="hot meta">
          <i class="iconfont icon-fire" />
          <span id="twikoo_visitors" class="artalk-pv-count">0</span>
        </span>
        评论数
        <span class="chat meta hover" @click="commentRef?.scrollToComments">
          <i class="iconfont icon-chat" />
          <span id="twikoo_comments" class="artalk-comment-count">0</span>
        </span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatTimestamp } from '../utils/helper'
import { generateId } from '../utils/commonTools'
import { countWord } from '../utils/countWord'
const { page, theme, frontmatter } = useData()
// 获取对应文章数据
const postMetaData = computed(() => {
  const postId = generateId(page.value.relativePath)
  // console.log(theme.value.postData.find((item) => item.id === postId),'-----------------')
  return theme.value.postData.find(item => item.id === postId)
})

// 字数总计
const wordCount = computed(() => {
  const content = contentRef.value
  const text = content?.$el?.textContent || content?.$el?.innerText || ''
  const counts = countWord(text)
  return counts
})
// 字数总计格式化
const formatWordCount = computed(() => {
  const counts = wordCount.value
  return counts > 1000
    ? counts > 10000
      ? `${(counts / 10000).toFixed(1)}w`
      : `${(counts / 1000).toFixed(1)}k`
    : counts
})
// 图片数量
const imageCount = computed(() => {
  const content = contentRef.value
  const images = content?.$el?.querySelectorAll('img')
  return images?.length || 0
})

// 文字阅读时间
const wordTime = computed(() => {
  const counts = wordCount.value
  return (counts / 275) * 60
})
// 图片阅读时间
const imageTime = computed(() => {
  const n = imageCount.value
  if (imageCount.value <= 10) {
    // 等差数列求和
    return n * 13 + (n * (n - 1)) / 2
  }
  return 175 + (n - 10) * 3
})
// 阅读时间
const readTime = computed(() => {
  return Math.ceil((wordTime.value + imageTime.value) / 60)
})
</script>

<style lang="scss" scoped>
.post {
  width: 100%;
  display: flex;
  flex-direction: column;
  animation: fade-up 0.6s 0.1s backwards;
  .post-meta {
    padding: 2rem 0 3rem 18px;
    width: 100%;
    .meta {
      display: flex;
      flex-direction: row;
      align-items: center;
      .categories {
        margin-right: 12px;
        .cat-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 6px 12px;
          font-size: 14px;
          font-weight: bold;
          border-radius: 8px;
          background-color: var(--main-mask-Inverse-background);
          opacity: 0.8;
          .iconfont {
            margin-right: 6px;
          }
          &:hover {
            color: var(--main-color);
            background-color: var(--main-color-bg);
            .iconfont {
              color: var(--main-color);
            }
          }
        }
      }
      .tags {
        display: flex;
        flex-direction: row;
        align-items: center;
        .tag-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 6px 12px;
          font-size: 14px;
          font-weight: bold;
          border-radius: 8px;
          opacity: 0.8;
          .iconfont {
            margin-right: 4px;
            opacity: 0.6;
            font-weight: normal;
          }
          &:hover {
            color: var(--main-color);
            background-color: var(--main-color-bg);
            .iconfont {
              color: var(--main-color);
            }
          }
        }
      }
    }
    .title {
      font-size: 2.2rem;
      line-height: 1.2;
      color: var(--main-font-color);
      margin: 1.4rem 0;
    }
    .other-meta {
      display: flex;
      flex-direction: row;
      align-items: center;
      .meta {
        font-weight: bold;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 6px 12px;
        font-size: 14px;
        border-radius: 8px;
        opacity: 0.8;
        .iconfont {
          margin-right: 6px;
          transition: color 0.3s;
        }
        &.date {
          padding-left: 0;
        }
        &.hot {
          .iconfont {
            font-size: 18px;
          }
        }
        &.hover {
          transition: color 0.3s, background-color 0.3s;
          cursor: var(--main-pointer-cursor);
          &:hover {
            color: var(--main-color);
            background-color: var(--main-color-bg);
            .iconfont {
              color: var(--main-color);
            }
          }
        }
      }
    }
  }
}
</style>
