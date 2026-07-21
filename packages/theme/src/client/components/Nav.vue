<template>
  <header v-show="!props.isUtilPage" class="main-header">
    <nav :class="['main-nav', scrollData.direction, { top: scrollData.height === 0 && !store.showNavSiteTitle }]">
      <div class="nav-all">
        <!-- 导航栏左侧 -->
        <div class="left-nav">
          <div class="more-menu nav-btn" title="更多内容">
            <i class="iconfont icon-menu" />
            <div class="more-card s-card">
              <div v-for="(item, index) in theme.navMore" :key="index" class="more-item">
                <span class="more-name">{{ item.name }}</span>
                <div class="more-list">
                  <a v-for="(link, i) in item.list" :key="i" class="more-link" @click="handleClick($event, link)">
                    <img v-if="link.iconType === 'img'" class="link-icon" :src="link.icon" :alt="link.name" />
                    <span class="link-name">
                      <ThemeIcon v-if="link.iconType !== 'img'" :icon="link.icon" class="link-icon" />
                      {{ link.name }}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="site-name" @click="router.go('/')">
            <img v-if="theme.siteMeta.logo" class="site-logo" :src="theme.siteMeta.logo" :alt="site.title" />
            {{ site.title }}
          </div>
        </div>
        <!-- 导航栏菜单 -->
        <div class="nav-center">
          <div class="site-menu">
            <div v-for="(item, index) in theme.nav" :key="index" class="menu-item">
              <span class="link-btn"> {{ item.text }}</span>
              <div v-if="item.items" class="link-child">
                <span
                  v-for="(child, childIndex) in item.items"
                  :key="childIndex"
                  class="link-child-btn"
                  @click="router.go(child.link)"
                >
                  <ThemeIcon v-if="child.icon" :icon="child.icon" />
                  {{ child.text }}
                </span>
              </div>
            </div>
          </div>
          <span
            class="site-title"
            @click="smoothScrolling"
            @mouseenter="store.showNavSiteTitle = true, store.navSiteTitle = '返回顶部'"
            @mouseleave="store.showNavSiteTitle = false"
          >
            {{ (frontmatter.home ? site.description : page.title) || site.description }}
            <span class="site-title-after" :style="{ opacity: store.showNavSiteTitle ? 1 : 0 }">{{ store.navSiteTitle }}</span>
          </span>
        </div>
        <div class="right-nav">
          <!-- 切换主题 -->
          <div
            class="menu-btn nav-btn"
            title="切换主题"
            @click="toggleTheme"
            @mouseenter="menuBtnEnter('theme')"
            @mouseleave="menuBtnLeave('theme')"
          >
            <i class="iconfont" :class="store.isDark ? 'icon-dark' : 'icon-light'" />
          </div>
          <!-- 开往 -->
          <a
            v-if="theme.travellings?.enable"
            class="menu-btn nav-btn travellings"
            title="开往-友链接力"
            :href="theme.travellings?.url || 'https://www.travellings.cn/go.html'"
            target="_blank"
            @mouseenter="menuBtnEnter('travellings')"
            @mouseleave="menuBtnLeave('travellings')"
          >
            <i class="iconfont icon-subway"></i>
          </a>
          <!-- 随机文章 -->
          <div
            class="menu-btn nav-btn"
            title="随机前往一篇文章"
            @click="router.go(shufflePost(theme.unencryptedData))"
            @mouseenter="menuBtnEnter('shuffle')"
            @mouseleave="menuBtnLeave('shuffle')"
          >
            <i class="iconfont icon-shuffle"></i>
          </div>
          <!-- 搜索 -->
          <div
            v-if="theme.search.enable"
            class="menu-btn nav-btn"
            title="全站搜索"
            @click="store.changeShowStatus('searchShow')"
            @mouseenter="menuBtnEnter('search')"
            @mouseleave="menuBtnLeave('search')"
          >
            <i class="iconfont icon-search"></i>
          </div>
          <!-- 自定义按钮（来自 themeConfig.navButtons） -->
          <div
            v-for="(btn, idx) in navButtons"
            :key="'nav-btn-' + idx"
            class="menu-btn nav-btn custom-btn"
            :title="btn.name"
            @click="handleNavButtonClick(btn)"
            @mouseenter="menuBtnEnter('custom', btn)"
            @mouseleave="menuBtnLeave('custom')"
          >
            <img
              v-if="btn.iconType === 'img'"
              class="nav-btn-img"
              :src="btn.icon"
              :alt="btn.name"
            />
            <ThemeIcon v-else :icon="btn.icon" />
          </div>
          <!-- 中控台 -->
          <div
            id="open-control"
            class="menu-btn nav-btn pc"
            title="打开中控台"
            @click="store.changeShowStatus('controlShow')"
            @mouseenter="menuBtnEnter('control')"
            @mouseleave="menuBtnLeave('control')"
          >
            <i class="iconfont icon-dashboard" />
          </div>
          <!-- 返回顶部 -->
          <div
            :class="['to-top', 'menu-btn', { hidden: scrollData.height === 0, long: scrollData.percentage > 90 }]"
            title="返回顶部"
            @click="smoothScrolling"
            @mouseenter="menuBtnEnter('to-top')"
            @mouseleave="menuBtnLeave('to-top')"
          >
            <div class="to-top-btn">
              <Transition name="fade" mode="out-in">
                <span :key="scrollData.percentage > 90" class="num">
                  {{ scrollData.percentage <= 90 ? scrollData.percentage : '返回顶部' }}
                </span>
              </Transition>
              <i class="iconfont icon-up"></i>
            </div>
          </div>
          <!-- 移动端菜单 -->
          <div class="menu-btn nav-btn mobile" title="打开菜单" @click="store.changeShowStatus('mobileMenuShow')">
            <i class="iconfont icon-toc" />
          </div>
        </div>
      </div>
    </nav>
    <!-- 移动端菜单 -->
    <MobileMenu />
    <!-- 全局搜索 -->
    <ClientOnly>
      <Search v-if="theme.search.enable" />
    </ClientOnly>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import { mainStore } from '../store'
import { smoothScrolling, shufflePost } from '../utils/helper'
import ThemeIcon from './ThemeIcon.vue'

// 异步加载 Search 组件：避免 algoliasearch / vue-instantsearch 拖慢首屏
// 同时通过 prefetchSearch 在浏览器空闲时和 hover 搜索按钮时主动预加载，
// 这样点击搜索按钮时组件通常已就绪，避免弹窗出现后几秒钟空白
const Search = defineAsyncComponent(() => import('./Search.vue'))

const router = useRouter()
const store = mainStore()
const { scrollData } = storeToRefs(store)
const { site, theme, frontmatter, page } = useData()
const props = defineProps({
  isUtilPage: {
    type: Boolean,
    default: false
  }
})
let direction

// 导航栏右侧自定义按钮
const navButtons = theme.value.navButtons || []

// 检查是否为移动端
const checkIsMobile = () => {
  store.isMobile = window.innerWidth <= 768
}

// 预加载 Search 组件（仅触发模块解析，不渲染）
// 触发时机：浏览器空闲 / hover 搜索按钮 / 首次打开搜索弹窗前
let searchPrefetched = false
const prefetchSearch = () => {
  if (searchPrefetched || !theme.value.search.enable) return
  searchPrefetched = true
  // 触发 defineAsyncComponent 的动态 import
  import('./Search.vue').catch(() => {})
}

// 组件挂载时初始化
onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
  // 首屏渲染完成后，在浏览器空闲时预加载搜索组件
  if ('requestIdleCallback' in window) {
    requestIdleCallback(prefetchSearch, { timeout: 4000 })
  } else {
    setTimeout(prefetchSearch, 2500)
  }
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile)
})

const toggleTheme = event => {
  store.changeThemeType(event)
}
// 点击链接
const handleClick = ($event, link) => {
  if (link.target === '_blank') {
    $event.preventDefault()
    window.open(link.url, '_blank')
  } else {
    router.go(link.url)
  }
}

// 自定义按钮点击：根据 target 决定打开方式（默认 _blank）
const handleNavButtonClick = (btn) => {
  const target = btn.target || '_blank'
  if (target === '_blank') {
    window.open(btn.url, '_blank')
  } else {
    router.go(btn.url)
  }
}

const menuBtnEnter = (name, btn) => {
  if (store.isMobile) return
  // hover 搜索按钮时立即预加载 Search 组件
  if (name === 'search') prefetchSearch()
  store.showNavSiteTitle = true
  direction = store.scrollData.direction
  store.scrollData.direction = 'down'
  switch (name) {
    case 'theme':
      store.navSiteTitle = '切换主题'
      break
    case 'travellings':
      store.navSiteTitle = '随机前往一个开往项目网站'
      break
    case 'shuffle':
      store.navSiteTitle = '随机前往一篇文章'
      break
    case 'search':
      store.navSiteTitle = '全站搜索'
      break
    case 'control':
      store.navSiteTitle = '打开中控台'
      break
    case 'to-top':
      store.navSiteTitle = '返回顶部'
      break
    case 'custom':
      // 自定义按钮：使用按钮的 name 作为提示
      store.navSiteTitle = btn?.name || ''
      break
  }
}

const menuBtnLeave = name => {
  if (store.isMobile) return
  store.scrollData.direction = direction
  store.showNavSiteTitle = false
}
</script>

<style lang="scss" scoped>
.main-header {
  position: relative;
  width: 100%;
  height: 60px;
  overflow: hidden;
  z-index: 998;
  animation: show 0.3s backwards;
  .main-nav {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 60px;
    background-color: var(--main-card-background2);
    transition: background-color 0.3s, backdrop-filter 0.3s;
    &::after {
      content: '';
      position: absolute;
      height: 1px;
      width: 100%;
      left: 0;
      bottom: 0;
      background-color: var(--main-card-border);
      transition: opacity 0.3s;
    }
    &.top {
      background-color: transparent;
      // background-color: var(--main-site-background);
      outline: 0px;
      &::after {
        opacity: 0;
      }
    }
    &.top,
    &.up {
      .nav-all {
        .site-menu {
          transform: translateY(0);
          opacity: 1;
        }
        .site-title {
          transform: translateY(50px);
          opacity: 0;
        }
      }
      @media (max-width: 768px) {
        .nav-center {
          top: -80px;
        }
      }
    }
  }
  .nav-all {
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 1400px;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: minmax(200px, 1fr) auto minmax(200px, 1fr);
    align-items: center;
    .left-nav {
      display: flex;
      flex-direction: row;
      align-items: center;
      min-width: 200px;
      .more-menu {
        position: relative;
        margin-right: 4px;
        @media (max-width: 512px) {
          display: none;
        }
        .more-card {
          position: absolute;
          left: 0;
          top: 46px;
          opacity: 0;
          visibility: hidden;
          transform-origin: left top;
          background: var(--main-card-background2);
          transform: scale(0.8) translateY(-5px);
          .more-item {
            margin-top: 0.8rem;
            &:first-child {
              margin-top: 0;
            }
            .more-name {
              font-size: 14px;
              display: inline-block;
              color: var(--main-font-second-color);
              margin-bottom: 0.6rem;
            }
            .more-list {
              display: grid;
              gap: 0.8rem;
              grid-template-columns: 1fr 1fr;
              .more-link {
                display: flex;
                align-items: center;
                width: 160px;
                padding: 6px 8px;
                border-radius: 8px;
                .link-icon {
                  width: 24px;
                  height: 24px;
                  border-radius: 5px;
                  margin-right: 8px;
                }
                .iconfont {
                  font-size: 18px;
                  color: var(--main-font-color);
                }
                &:hover {
                  color: var(--main-card-background);
                  background-color: var(--main-color);
                  .iconfont {
                    color: var(--main-card-background);
                  }
                }
              }
            }
          }
          &::after {
            content: '';
            position: absolute;
            top: -20px;
            left: 0;
            width: 100%;
            height: 30px;
            z-index: 1;
          }
          &:hover {
            border-color: var(--main-color);
          }
        }
        &:hover {
          .more-card {
            opacity: 1;
            transform: scale(1) translateY(0);
            visibility: visible;
          }
        }
      }
      .site-name {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        height: 34px;
        padding: 0 6px;
        white-space: nowrap;
        .site-logo {
          width: 24px;
          height: 24px;
          margin-right: 6px;
          border-radius: 50%;
          object-fit: cover;
        }
        overflow: hidden;
        text-overflow: ellipsis;
        transition: transform 0.3s;
        cursor: var(--main-pointer-cursor);
        &::after {
          content: '\e032';
          font-family: 'iconfont';
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: var(--main-card-background);
          background-color: var(--main-color);
          font-size: 22px;
          border-radius: 25px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        @media (min-width: 768px) {
          &:hover {
            &::after {
              opacity: 1;
            }
          }
          &:active {
            transform: scale(0.95);
          }
        }
      }
    }
    .nav-center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      width: 100%;
      height: 60px;
      overflow: hidden;
      transition: top 0.3s;
      .site-menu {
        position: absolute;
        width: fit-content;
        min-height: 60px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        z-index: 10;
        opacity: 0;
        transform: translateY(-50px);
        transition: transform 0.3s, opacity 0.3s;
        .menu-item {
          position: relative;
          padding: 0 0.4rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: auto;
          cursor: var(--main-pointer-cursor);
          .link-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            letter-spacing: 0.2rem;
            padding: 0 0.8rem 0 1rem;
            font-weight: bold;
            height: 35px;
            line-height: 35px;
            border-radius: 50px;
            transition: color 0.3s, background-color 0.3s;
          }
          .link-child {
            position: absolute;
            top: 35px;
            margin-top: 8px;
            padding: 6px 2px;
            display: flex;
            flex-direction: row;
            align-items: center;
            background-color: var(--main-card-background);
            border: 1px solid var(--main-color);
            box-shadow: 0 8px 12px -3px var(--main-color-bg);
            border-radius: 50px;
            transform: translateY(-10px) scale(0.8);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
            &::before {
              content: '';
              position: absolute;
              top: -14px;
              left: 0;
              width: 100%;
              height: 20px;
            }
            .link-child-btn {
              display: flex;
              align-items: center;
              border-radius: 100px;
              margin: 0 4px;
              padding: 0.6rem 0.8rem;
              white-space: nowrap;
              transition: color 0.3s, padding 0.3s, background-color 0.3s, box-shadow 0.3s;
              .iconfont {
                margin-right: 8px;
                font-size: 20px;
                transition: color 0.3s;
              }
              &:hover {
                color: var(--main-card-background);
                background-color: var(--main-color);
                box-shadow: 0 8px 12px -3px var(--main-color-bg);
                padding: 0.6rem 1rem;
                .iconfont {
                  color: var(--main-card-background);
                }
              }
            }
          }
          &:first-child {
            .link-child {
              &::after {
                content: '';
                position: absolute;
                top: -60px;
                left: 0;
                width: 50%;
                height: 60px;
              }
            }
          }
          &:last-child {
            .link-child {
              &::after {
                content: '';
                position: absolute;
                top: -60px;
                right: 0;
                width: 50%;
                height: 60px;
              }
            }
          }
          &:hover {
            .link-btn {
              color: var(--main-card-background);
              background-color: var(--main-color);
            }
            .link-child {
              transform: translateY(0) scale(1);
              opacity: 1;
              visibility: visible;
            }
          }
        }
      }
      .site-title {
        position: relative;
        display: inline-block;
        width: 100%;
        min-width: 280px;
        height: 35px;
        font-weight: bold;
        font-size: 18px;
        padding: 4px 8px;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        transition: transform 0.3s, opacity 0.3s;
        cursor: var(--main-pointer-cursor);
        & .site-title-after {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 35px;
          font-size: 16px;
          border-radius: 50px;
          color: var(--main-card-background);
          background-color: var(--main-color);
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 1;
        }
        &:hover {
          & .site-title-after {
            opacity: 1 !important;
          }
        }
        &:active {
          transform: scale(0.95);
        }
        @media (max-width: 768px) {
          & .site-title-after {
            display: none;
          }
        }
      }
    }
    .right-nav {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      min-width: 200px;
      .menu-btn {
        margin-left: 0.5rem;
        &.mobile {
          display: none;
        }
        @media (max-width: 768px) {
          &.mobile {
            display: flex;
          }
          &.pc {
            display: none;
          }
        }
      }
      .to-top {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 35px;
        height: 35px;
        transition: all 0.3s;
        cursor: var(--main-pointer-cursor);
        .to-top-btn {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 25px;
          height: 25px;
          border-radius: 40px;
          background-color: var(--main-font-color);
          transition: width 0.3s, height 0.3s, background-color 0.3s;
          .num {
            position: absolute;
            font-size: 12px;
            color: var(--main-card-background);
            transition: opacity 0.1s;
          }
          .icon-up {
            position: absolute;
            color: var(--main-card-background);
            opacity: 0;
            transition: opacity 0.3s;
          }
        }

        &.hidden {
          width: 0;
          opacity: 0;
          transform: scale(0);
          margin: 0;
        }
        &.long {
          width: 80px;
          .to-top-btn {
            width: 70px;
          }
        }
        &:hover {
          .to-top-btn {
            width: 35px;
            height: 35px;
            background-color: var(--main-color);
            .num {
              opacity: 0;
            }
            .icon-up {
              opacity: 1;
            }
          }
          &.long {
            width: 80px;
            .to-top-btn {
              width: 80px;
              height: 35px;
            }
          }
        }
        &:active {
          transform: scale(0.9);
        }
      }
    }
    @media (max-width: 768px) {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      .left-nav,
      .right-nav {
        min-width: auto;
      }
      .nav-center {
        // display: none;
        position: absolute;
        top: 0;
        left: 0;
        background-color: var(--main-card-background);
        border-bottom: 1px solid var(--main-card-border);
        z-index: 100;
        .site-title {
          font-size: 15px;
          height: auto;
        }
      }
    }
  }
  .nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    padding: 0;
    transition: background-color 0.3s, transform 0.3s;
    border-radius: 50%;
    cursor: var(--main-pointer-cursor);
    .iconfont {
      font-size: 20px;
      line-height: 1;
      transition: color 0.3s, opacity 0.3s, transform 0.3s;
    }
    .nav-btn-img {
      width: 20px;
      height: 20px;
      object-fit: contain;
      transition: transform 0.3s;
    }
    &:hover {
      background-color: var(--main-color);
      transform: scale(1.1);
      .iconfont {
        color: var(--main-card-background);
        transform: scale(1.1);
      }
      .nav-btn-img {
        transform: scale(1.1);
      }
    }
  }
}
</style>
