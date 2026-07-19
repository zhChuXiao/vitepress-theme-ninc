<template>
  <footer id="main-footer" class="main-footer">
    <div class="footer-content">
      <div class="copyright">
        <span class="time">@ {{ startYear }} - {{ thisYear }} By </span>
        <a :href="theme.siteMeta.author.link" class="author link" target="_blank">
          {{ theme.siteMeta.author.name }}
        </a>
        <a v-if="theme.icp" class="icp link" href="https://beian.miit.gov.cn/" target="_blank">
          <i class="iconfont icon-safe" />
          {{ theme.icp }}
        </a>
      </div>
      <div class="meta">
        <a class="power link" href="https://vitepress.dev/" target="_blank">
          <span class="by">Powered by</span>
          <span class="name">
            <!-- VitePress logo：内联 SVG，避免硬编码 /images/icon/vitepress.svg 导致 SSR build 解析失败 -->
            <svg class="name-img" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M29.8836 6.14561L16.1162 29.8544a.7249.7249 0 0 1-1.2326 0L1.01639 6.14561a.725.725 0 0 1 .8695-1.0536l13.9306 3.4493a.7248.7248 0 0 0 .3507 0l13.9305-3.4493a.725.725 0 0 1 .8695 1.0536Z" fill="url(#vp_paint0_linear)" />
              <path d="M22.0692 1.456L11.4766 3.5318a.3578.3578 0 0 0-.2892.3359l-.6500 11.0426a.3577.3577 0 0 0 .4316.3674l2.9444-.6783a.3578.3578 0 0 1 .4311.4193l-.8745 4.2828a.3577.3577 0 0 0 .4544.4139l1.8203-.8764a.3577.3577 0 0 1 .4543.4139l-1.3925 6.736c-.2697 1.3054 1.4707 1.8984 2.0671.6917l.1391-.2814L29.111 7.2155c.3264-.6575-.2017-1.4104-.8863-1.2326l-3.0328.7844a.3578.3578 0 0 1-.4311-.4194l.9669-4.3991a.3578.3578 0 0 0-.4318-.4194Z" fill="url(#vp_paint1_linear)" />
              <defs>
                <linearGradient id="vp_paint0_linear" x1="16" y1="29.8544" x2="16" y2="2.71045" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#41D1FF" />
                  <stop offset="1" stop-color="#BD34FE" />
                </linearGradient>
                <linearGradient id="vp_paint1_linear" x1="15.0641" y1="6.45832" x2="20.5493" y2="20.1693" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#FFEA83" />
                  <stop offset=".0833" stop-color="#FFDD35" />
                  <stop offset="1" stop-color="#FFA800" />
                </linearGradient>
              </defs>
            </svg>
            <span class="name-text">VitePress</span>
          </span>
        </a>
        <a class="cc link" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans" target="_blank">
          <i class="iconfont icon-line" />
          <i class="iconfont icon-by-line" />
          <i class="iconfont icon-nc-line" />
          <i class="iconfont icon-nd-line" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { mainStore } from '../store'

const store = mainStore()
const { theme } = useData()
const { footerIsShow } = storeToRefs(store)

// 视窗监听器
const observer = ref(null)

// 实时年份
const thisYear = computed(() => new Date().getFullYear())

// 建站起始年份（从 since 配置中提取年份，回退到当前年份）
const startYear = computed(() => {
  const since = theme.value?.since
  if (!since) return thisYear.value
  const year = String(since).split('-')[0]
  return year || thisYear.value
})

// 监听页脚视窗
const isShowFooter = () => {
  const footerDom = document.getElementById('main-footer')
  if (!footerDom) return false
  if (observer.value) observer.value?.disconnect()
  observer.value = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      footerIsShow.value = entry.isIntersecting ? true : false
    })
  })
  // 添加监视器
  observer.value?.observe(footerDom)
}

onMounted(() => {
  isShowFooter()
})

onBeforeUnmount(() => {
  if (observer.value) observer.value?.disconnect()
})
</script>

<style lang="scss" scoped>
.main-footer {
  display: flex;
  // margin-top: 1rem;
  padding: 1rem 0;
  background-color: var(--main-site-background);
  // border-top: 1px solid var(--main-card-border);
  overflow: hidden;
  animation: show 0.3s backwards;
  transition: color 0.3s, border 0.3s, background-color 0.3s;
  .footer-content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
    color: var(--main-font-color);
    line-height: 1;
    min-height: 32px;
    .copyright {
      .icp {
        .iconfont {
          font-size: 20px;
          opacity: 0.6;
        }
      }
      .upyun {
        .iconfont {
          font-size: 20px;
          font-weight: normal;
        }
      }
    }
    .meta {
      display: flex;
      flex-direction: row;
      align-items: center;
      .power {
        margin-right: 4px;
        .by {
          font-weight: normal;
          opacity: 0.8;
          margin-right: 6px;
        }
        .name {
          display: flex;
          flex-direction: row;
          align-items: center;

          gap: 4px;
          .name-text {
            background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .name-img {
            width: 20px;
          }
        }
      }
      .rss {
        margin-right: 4px;
        .iconfont {
          font-weight: normal;
          margin-right: 6px;
        }
      }
      .cc {
        .iconfont {
          margin: 0 2px;
          font-weight: normal;
        }
      }
    }
    .link {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      font-weight: bold;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      padding: 8px;
      margin: 0 2px;
      height: 38px;
      border-radius: 12px;
      transition: color 0.3s, background-color 0.3s;
      cursor: var(--main-pointer-cursor);
      .iconfont {
        font-size: 22px;
        margin-right: 4px;
        transition: color 0.3s;
      }
      &:hover {
        color: var(--main-color);
        background-color: var(--main-color-bg);
        .iconfont {
          color: var(--main-color);
        }
      }
    }
    @media (max-width: 768px) {
      font-size: 14px;
      .meta {
        display: none;
      }
    }
    @media (max-width: 420px) {
      .copyright {
        .icp {
          .iconfont {
            display: none;
          }
        }
      }
    }
  }
}
</style>
