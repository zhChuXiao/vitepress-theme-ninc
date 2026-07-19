<!-- 文章页面 -->
<template>
  <div v-if="postMetaData" class="post" :class="{ 'has-not-aside': frontmatter.aside === false }">
    <div class="post-meta post-header" v-if="isMounted && !frontmatter.isPage">
      <div class="post-header-bg">
        <section class="main-hero-waves-area waves-area">
          <svg
            class="waves-svg"
            xmlns="http://www.w3.org/2000/svg"
            xlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shape-rendering="auto"
          >
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352Z"></path>
            </defs>
            <g class="parallax">
              <use href="#gentle-wave" x="48" y="0"></use>
              <use href="#gentle-wave" x="48" y="3"></use>
              <use href="#gentle-wave" x="48" y="5"></use>
              <use href="#gentle-wave" x="48" y="7"></use>
            </g>
          </svg>
        </section>
        <div class="post-cover">
          <img :src="postCover" alt="cover" />
        </div>
      </div>
      <div class="meta">
        <div class="categories">
          <a v-for="(item, index) in postMetaData.categories" :key="index" :href="`/pages/categories/${item}`" class="cat-item">
            <i class="iconfont icon-folder" />
            <span class="name">{{ item }}</span>
          </a>
        </div>
        <div class="tags">
          <a v-for="(item, index) in postMetaData.tags" :key="index" :href="`/pages/tags/${item}`" class="tag-item">
            <i class="iconfont icon-hashtag" />
            <span class="name">{{ item }}</span>
          </a>
        </div>
      </div>
      <!-- 标题 -->
      <h1 class="title">
        {{ postMetaData.title || '未命名文章' }}
        <i v-if="postMetaData?.crypto && postMetaData.crypto.enable" class="iconfont icon-lock crypto-icon" title="加密文章"></i>
      </h1>
      <!-- 其他信息 -->
      <ClientOnly>
        <div class="other-meta">
          <span class="meta date">
            <i class="iconfont icon-date" />
            发表于&nbsp;{{ formatTimestamp(postMetaData.date) }}
          </span>
          <span class="update meta">
            <i class="iconfont icon-time" />
            更新于&nbsp;{{ formatTimestamp(page?.lastUpdated || postMetaData.lastModified) }}
          </span>
          <!-- 阅读量 -->
          <span v-if="busuanziEnable" class="read-time meta">
            <i class="iconfont icon-fire" />
            阅读量&nbsp;<span id="busuanzi_value_page_pv">0</span>
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
          <!-- 评论数量 -->
          <span class="read-time meta">
            <i class="iconfont icon-time_fill" />
            评论数量&nbsp;{{ commentCount }}条
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
      </ClientOnly>
    </div>
    <div class="post-content">
      <article class="post-article s-card">
        <ClientOnly>
          <!-- 过期提醒 -->
          <div class="expired s-card" v-if="postMetaData?.expired >= 180 && !postMetaData.crypto && !frontmatter.isPage">
            本文发表于
            <strong>{{ postMetaData?.expired }}</strong>
            天前，其中的信息可能已经时过境迁
          </div>
          <!-- AI 摘要 -->
          <ArticleGPT v-if="isMounted && !frontmatter.isPage" />
          <!-- 转载文章卡片 -->
          <!--   -->
          <LinkCardReprint
            v-if="postMetaData?.reprint && isMounted"
            :title="postMetaData?.reprint.title"
            :url="postMetaData?.reprint.url"
            :desc="postMetaData?.reprint.desc"
            :icon="postMetaData?.reprint.icon"
          />
        </ClientOnly>
        <!-- 文章内容 -->
        <template v-if="postMetaData?.crypto && postMetaData.crypto.enable">
          <CryptoContent :cryptoConfig="postMetaData.crypto">
            <Content ref="contentRef" id="page-content" class="markdown-main-style vp-doc" />
          </CryptoContent>
        </template>
        <template v-else>
          <Content ref="contentRef" id="page-content" class="markdown-main-style vp-doc" />
        </template>
        <ClientOnly>
          <!-- 参考资料 -->
          <References />
          <!-- 版权 -->
          <Copyright v-if="frontmatter.copyright !== false" :postData="postMetaData" />
          <!-- 其他信息 -->
          <div class="other-meta">
            <div class="all-tags">
              <a v-for="(item, index) in postMetaData.tags" :key="index" :href="`/pages/tags/${item}`" class="tag-item">
                <i class="iconfont icon-hashtag" />
                <span class="name">{{ item }}</span>
              </a>
            </div>
          </div>
          <!-- 打赏 -->
          <RewardBtn />
          <!-- 下一篇 -->
          <NextPost />
          <!-- 相关文章 -->
          <RelatedPost />
          <!-- 评论 -->

          <Comments ref="commentRef" v-if="isMounted" />
        </ClientOnly>
      </article>
      <ClientOnly>
        <Aside showToc v-if="isMounted" />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { formatTimestamp } from '../utils/helper'
import { generateId } from '../utils/commonTools'
import initFancybox from '../utils/initFancybox'
import { countWord } from '../utils/countWord'
import codeblocksFold from '../utils/codeblocks-fold/index.js'
import { useRoute } from 'vitepress'
import { useData } from 'vitepress'
import LinkCardReprint from '../components/Tags/LinkCardReprint.vue'
import CryptoContent from '../components/CryptoContent.vue'
const { page, theme, frontmatter } = useData()
import { mainStore } from '../store'
import { loadScript } from '../utils/commonTools'
import { getDominantColorWithAlpha, isLightColor, LightenDarkenColor, colorHex } from '../utils/helper'
const contentRef = ref(null)
// 标记组件为仅客户端渲染
const isMounted = ref(false)

// 不蒜子统计配置
const busuanziConfig = computed(() => theme.value?.tongji?.busuanzi || {})
const busuanziEnable = computed(() => busuanziConfig.value.enable !== false)
const busuanziScript = computed(
  () => busuanziConfig.value.scriptUrl || 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
)
onMounted(() => {
  isMounted.value = true
})
// 评论元素
const commentRef = ref(null)
const route = useRoute()
const store = mainStore()
// 获取对应文章数据
const postMetaData = computed(() => {
  const postId = generateId(page.value.relativePath)
  // console.log(theme.value.postData.find((item) => item.id === postId),'-----------------')
  return theme.value.postData.find(item => item.id === postId)
})
// 文章封面图（带默认封面回退）
const postCover = computed(() => {
  if (postMetaData.value?.cover) return postMetaData.value.cover
  const defaultCover = theme.value?.cover?.showCover?.defaultCover
  if (Array.isArray(defaultCover) && defaultCover.length) {
    return defaultCover[Math.floor(Math.random() * defaultCover.length)]
  }
  return ''
})
// 获取文章主色调

const getMainColor = () => {
  // console.log(postMetaData.value?.mainColor, "-----------------mainColor");
  if (postMetaData.value?.mainColor) {
    const root = document.querySelector(':root')
    root.style.setProperty('--main-bar-bg', postMetaData.value?.mainColor)
  } else {
    getDominantColorWithAlpha(
      postMetaData.value?.cover,
      color => {
        const root = document.querySelector(':root')
        let formatColor = ''
        // if (isLightColor(color)) {
        //   formatColor = LightenDarkenColor(colorHex(color), -60)
        // } else {
        //   formatColor = color
        // }
        // if (formatColor === '#000000') {
        formatColor = color
        // }
        root.style.setProperty('--main-bar-bg', formatColor)
      },
      1
    )
  }
}
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
  return counts > 1000 ? (counts > 10000 ? `${(counts / 10000).toFixed(1)}w` : `${(counts / 1000).toFixed(1)}k`) : counts
})
// 图片数量
const imageCount = computed(() => {
  const content = contentRef.value
  const images = content?.$el?.querySelectorAll('img')
  return images?.length || 0
})

// 评论数量
const commentCount = computed(() => {
  return store.getCommentCount(route.path)
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

const jumpRedirect = () => {
  // 等待DOM渲染完成
  nextTick(() => {
    if (!contentRef.value || !contentRef.value.$el) return

    // 获取文章内容中的所有链接
    const links = contentRef.value.$el.querySelectorAll('a[target="_blank"]')

    // 遍历所有链接
    links.forEach(link => {
      const href = link.getAttribute('href')

      // 判断是否为外部链接（不是以 / 或 # 开头，且不包含当前域名）
      if (href && !href.startsWith('/') && !href.startsWith('#') && !href.includes(window.location.hostname)) {
        // 创建新的跳转链接，将原始链接作为参数传递
        const redirectUrl = `/redirect.html?url=${encodeURIComponent(btoa(href))}`

        // 修改链接地址
        link.setAttribute('href', redirectUrl)

        // 添加提示和样式
        link.setAttribute('title', '这是一个外部链接')
        link.classList.add('external-link')

        // 可选：添加外部链接图标
        if (!link.querySelector('.external-icon')) {
          const iconSpan = document.createElement('span')
          iconSpan.className = 'external-icon iconfont icon-external-link'
          link.appendChild(iconSpan)
        }
      }
    })
  })
}

onMounted(() => {
  initFancybox(theme.value)
  getMainColor()
  // jumpRedirect()
  codeblocksFold({ route, frontmatter }, true, 400)
  watch(
    () => route.path,
    () => {
      getMainColor()
    }
  )
  // 不蒜子统计（文章阅读量）
  if (busuanziEnable.value) {
    loadScript(busuanziScript.value, {
      async: true,
      reload: true
    })
  }
})

onBeforeUnmount(() => {
  const root = document.querySelector(':root')
  root.style.setProperty('--main-bar-bg', 'var(--main-color-bg4)')
})
</script>

<style lang="scss" scoped>
@use '../styles/post.scss';

.post {
  width: 100%;
  display: flex;
  flex-direction: column;
  animation: fade-up 0.6s 0.1s backwards;
  .post-header {
    position: relative;
    height: 350px;
    .post-header-bg {
      position: absolute;
      z-index: -2;
      top: -75px;
      left: calc((100vw - 100%) / -2);
      width: 100vw;
      height: calc(100% + 70px);
      background-color: var(--main-bar-bg);
      overflow: hidden;
      filter: brightness(1.2);

      .main-hero-waves-area {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: -11px;
        z-index: 5;
        pointer-events: none;

        .waves-svg {
          width: 100%;
          height: 3.75rem;
        }

        //Animation
        .parallax > use {
          animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
          will-change: transform;
        }

        .parallax > use:nth-child(1) {
          animation-delay: -2s;
          animation-duration: 7s;
          fill: #f7f9febd;
        }

        .parallax > use:nth-child(2) {
          animation-delay: -3s;
          animation-duration: 10s;
          fill: #f7f9fe82;
        }

        .parallax > use:nth-child(3) {
          animation-delay: -4s;
          animation-duration: 13s;
          fill: #f7f9fe36;
        }
        .parallax > use:nth-child(4) {
          animation-delay: -5s;
          animation-duration: 20s;
          fill: #f7f9fe;
        }
        // 黑色模式背景
        :deep(.parallax) {
          html.dark & {
            & > use:nth-child(1) {
              fill: #18171dbd;
            }
            & > use:nth-child(2) {
              fill: #18171d82;
            }
            & > use:nth-child(3) {
              fill: #18171d36;
            }
            & > use:nth-child(4) {
              fill: #18171dff;
            }
          }
        }
      }
      .post-cover {
        width: 70%;
        height: 100%;
        position: relative;
        margin: 0 -20% 0 auto;
        margin-bottom: 0;
        transform: rotate(10deg) scale(1.3);
        will-change: transform;
        filter: blur(10px);
        overflow: hidden;
        img {
          width: 100%;
        }
        &::after {
          position: absolute;
          z-index: 2;
          content: '';
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          -webkit-box-shadow: 110px -130px 300px 60px var(--main-bar-bg) inset;
          box-shadow: 110px -130px 300px 60px var(--main-bar-bg) inset;
        }
      }
    }
  }
  .post-meta {
    padding: 2rem 0 6rem 18px;
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

      .crypto-icon {
        font-size: 2.2rem;
        margin-left: 0.5rem;
        color: var(--main-color);
        vertical-align: middle;
      }
    }
    .other-meta {
      display: flex;
      flex-wrap: wrap;
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
  .post-content {
    width: 100%;
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    animation: fade-up 0.6s 0.3s backwards;
    .post-article {
      // background-color: var(--main-card-second-background);
      width: calc(100% - 300px);
      padding: 1rem 2.2rem 2.2rem 2.2rem;
      user-select: text;
      cursor: var(--main-default-cursor);
      &:hover {
        border-color: var(--main-card-border);
      }
      .expired {
        margin: 1.2rem 0 2rem 0;
        padding: 0.8rem 1.2rem;
        border-left: 6px solid var(--main-warning-color);
        border-radius: 6px 16px 16px 6px;
        user-select: none;
        strong {
          color: var(--main-warning-color);
        }
      }
      .other-meta {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin: 2rem 0;
        opacity: 0.8;
        .all-tags {
          display: flex;
          flex-direction: row;
          align-items: center;
          .tag-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 4px 12px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 8px;
            background-color: var(--main-card-border);
            margin-right: 12px;
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
        .report {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 6px 12px;
          font-size: 14px;
          font-weight: bold;
          border-radius: 8px;
          background-color: var(--main-card-border);
          .iconfont {
            margin-right: 6px;
          }
          &:hover {
            color: #efefef;
            background-color: var(--main-error-color);
            .iconfont {
              color: #efefef;
            }
          }
        }
      }
    }
    .main-aside {
      width: 300px;
      padding-left: 1rem;
    }
    @media (max-width: 1200px) {
      .post-article {
        width: 100%;
      }
      .main-aside {
        display: none;
      }
    }
  }
  &.has-not-aside {
    animation: fade-up 0.6s 0.3s backwards;
    .post-article {
      width: 100%;
    }
    .main-aside {
      display: none;
    }
  }
  @media (max-width: 768px) {
    .post-meta {
      padding: 4rem 1.5rem;
      .meta {
        justify-content: center;
        .categories {
          margin-right: 0;
        }
        .tags {
          display: none;
        }
      }
      // 只显示前两个meta标签 其他的display none
      .meta {
        &:nth-child(n + 5) {
          display: none;
        }
      }
      .title {
        font-size: 1.6rem;
        text-align: center;
        line-height: 40px;
      }
      .other-meta {
        justify-content: center;
      }
    }
    .post-content {
      .post-article {
        border: none;
        padding: 20px 30px;
        .other-meta {
          margin: 1rem 0 2rem 0;
          flex-direction: column;
          .all-tags {
            flex-wrap: wrap;
            .tag-item {
              margin-top: 12px;
            }
          }
          .report {
            margin-top: 20px;
          }
        }
      }
    }
  }
}
//黑色模式背景
.dark {
  .post-header-bg {
    filter: brightness(0.8) !important;
  }
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}
</style>
