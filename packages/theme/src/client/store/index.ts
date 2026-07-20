import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'
import { ref, reactive, computed, type Ref } from 'vue'

// 全局消息组件（由 unplugin-auto-import 注入），此处仅作类型占位
declare const $message: any

export const mainStore = defineStore('main', () => {
  // 主题相关
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: 'light',
    // 首次访问（localStorage 无记录）跟随系统 prefers-color-scheme：
    //   - 系统是 dark → 进入 dark 主题
    //   - 系统是 light → 进入 light 主题
    // 已访问的用户从 localStorage 恢复其上次手动选择的主题
    initialValue: 'auto'
  })
  const toggleDark = useToggle(isDark)
  const themeType = computed(() => (isDark.value ? 'dark' : 'light'))
  const themeValue = computed(() => (isDark.value ? 'dark' : 'light'))

  // 基础状态
  const isLandscape = ref(true)
  const isMobile = ref(false)
  const bannerType = ref('half')
  const loadingStatus = ref(true)
  const scrollData = reactive({
    height: 0,
    percentage: 0,
    direction: 'down'
  })
  const navSiteTitle = ref('返回顶部')
  const showNavSiteTitle = ref(false)
  const scrollDataProgress = ref(0)
  const footerIsShow = ref(false)
  const controlShow = ref(false)
  const searchShow = ref(false)
  const showSeetings = ref(false)

  // 播放器相关
  const playState = ref(false)
  const playerShow = ref(true)
  const playerVolume = ref(0.7)
  const playerData = reactive({
    name: '未知曲目',
    artist: '未知艺术家'
  })

  // 其他UI状态
  const mobileMenuShow = ref(false)
  const useRightMenu = ref(true)
  const backgroundBlur = ref(false)
  const fontFamily = ref('JinBuTi')
  const fontSize = ref(16)
  const infoPosition = ref('normal')
  const lastScrollY = ref(0)
  const backgroundType = ref('patterns')
  const backgroundUrl = ref('/public/images/bg.png')

  // 评论数量
  const commentCount = reactive(new Map<string, number>())

  // 用户地理位置
  const userLocation = ref<any>()

  // 可被 changeShowStatus 切换的布尔状态集合
  // 替代原 eval 实现：避免动态求值（CSP 风险、严格模式报错、可读性差）
  const toggleStates: Record<string, Ref<boolean>> = {
    isLandscape,
    isMobile,
    loadingStatus,
    showNavSiteTitle,
    footerIsShow,
    controlShow,
    searchShow,
    showSeetings,
    playState,
    playerShow,
    mobileMenuShow,
    useRightMenu,
    backgroundBlur
  }

  // Actions
  // 切换应用状态
  function changeShowStatus(value: string, blur = true) {
    const target = toggleStates[value]
    // 仅处理布尔类型的状态 ref，未知名称或非布尔值直接忽略（比原 eval 更安全）
    if (!target || typeof target.value !== 'boolean') return
    target.value = !target.value
    // 阻止滚动
    document.body.style.overflowY = target.value ? 'hidden' : ''
    // 全局模糊
    const globalApp = document.getElementById('app')
    if (!globalApp) return
    if (target.value && backgroundBlur.value && blur) {
      globalApp.classList.add('blur')
    } else {
      globalApp.classList.remove('blur')
    }
  }

  // 更改字体大小
  function changeFontSize(isAdd = false) {
    if (isAdd) {
      if (fontSize.value < 20) fontSize.value++
    } else {
      if (fontSize.value > 14) fontSize.value--
    }
    document.documentElement.style.fontSize = fontSize.value + 'px'
  }

  // 切换明暗模式
  function changeThemeType(event: MouseEvent) {
    // 禁止壁纸模式切换明暗
    if (backgroundType.value === 'image') {
      $message.warning('无法在壁纸模式下切换明暗模式', { duration: 1500 })
      return false
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    // 兼容性处理：不支持 View Transitions API 时直接切换
    const startViewTransition = (document as any).startViewTransition
    if (typeof startViewTransition !== 'function') {
      toggleDark()
      return
    }

    // 注入 CSS 变量供 @keyframes vt-expand / vt-collapse 使用
    // 动画完全由 CSS 定义，避免 WAAPI 启动时序窗口导致的 dark→light 闪白
    const root = document.documentElement
    root.style.setProperty('--vt-x', `${x}px`)
    root.style.setProperty('--vt-y', `${y}px`)
    root.style.setProperty('--vt-r', `${endRadius}px`)

    startViewTransition.call(document, async () => {
      toggleDark()
    })
  }

  // 获取用户位置
  // 必须通过 themeConfig.aside.welcome.ipLocation 配置 IP 查询与归属地接口
  // 文档：https://theme.ninc.top/config/aside#welcome
  async function getUserLocation(ipLocationConfig?: { ipApi?: string; locationApi?: string }) {
    const ipApiUrl = ipLocationConfig?.ipApi || ''
    const locationApiTemplate = ipLocationConfig?.locationApi || ''
    if (!ipApiUrl || !locationApiTemplate) {
      throw new Error('[VitePress Theme Ninc] 未配置 IP 归属地接口，请在 themeConfig.aside.welcome.ipLocation 中设置 ipApi 和 locationApi')
    }
    let response = await fetch(ipApiUrl)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    let {
      data: { ip }
    } = await response.json()
    let addressRes = await fetch(locationApiTemplate.replace('${ip}', ip))
    if (!addressRes.ok) {
      throw new Error('Network response was not ok')
    }
    let addressData = await addressRes.json()
    userLocation.value = addressData.data
  }

  // 设置评论数量
  function setCommentCount(count: { url: string; count: number }) {
    commentCount.set(count.url, count.count)
  }

  // 获取评论数量
  function getCommentCount(url: string): number {
    return commentCount.get(url) || 0
  }

  return {
    // 状态
    isLandscape,
    isMobile,
    isDark,
    themeType,
    themeValue,
    toggleDark,
    bannerType,
    loadingStatus,
    scrollData,
    scrollDataProgress,
    footerIsShow,
    controlShow,
    searchShow,
    showSeetings,
    navSiteTitle,
    showNavSiteTitle,
    playState,
    playerShow,
    playerVolume,
    playerData,
    mobileMenuShow,
    useRightMenu,
    backgroundBlur,
    fontFamily,
    fontSize,
    infoPosition,
    lastScrollY,
    backgroundType,
    backgroundUrl,
    commentCount,

    // 方法
    changeShowStatus,
    changeFontSize,
    changeThemeType,
    setCommentCount,
    getCommentCount,
    userLocation,
    getUserLocation
  }
}, {
  // 数据持久化
  persist: [
    {
      key: 'siteData',
      paths: [
        'bannerType',
        'useRightMenu',
        'playerShow',
        'playerVolume',
        'backgroundBlur',
        'backgroundType',
        'fontFamily',
        'fontSize',
        'infoPosition',
        'backgroundUrl'
      ]
    }
  ]
})
