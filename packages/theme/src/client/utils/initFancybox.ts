import { loadScript, loadCSS } from './commonTools'

// Fancybox 由外部脚本运行时挂载到全局，此处仅作类型占位
declare const Fancybox: any

const initFancybox = (themeConfig: any): boolean | void => {
  try {
    const option = themeConfig.fancybox
    if (!option.enable) return false
    // 引入css及js（CSS 加载失败同样产生 Promise reject，无 callback 可接，静默兜底）
    const cssLoading = loadCSS(option.css)
    if (cssLoading && typeof (cssLoading as Promise<HTMLLinkElement>).catch === 'function') {
      ;(cssLoading as Promise<HTMLLinkElement>).catch(() => {})
    }
    // loadScript 加载失败时其返回的 Promise 会 reject——error 已由 callback 记录，
    // 此处接住 Promise 仅防止 unhandledrejection 噪音（CDN 不可达场景）
    const loading = loadScript(option.js, {
      callback: (error: any) => {
        if (error) {
          console.error('图片灯箱初始化失败', error)
          return false
        }
        // 路由往返会重复触发本回调（loadScript 对已缓存脚本也每次执行 callback），
        // 先 unbind 同选择器再 bind，保证全局只有一个委托绑定，避免一次点击弹出多层灯箱
        Fancybox.unbind('[data-fancybox]')
        Fancybox.bind('[data-fancybox]', {
          hideScrollbar: true,
          Carousel: {
            transition: 'slide'
          },
          Hash: false,
          Toolbar: {
            display: {
              left: ['infobar'],
              middle: ['zoomIn', 'zoomOut', 'toggle1to1', 'rotateCCW', 'rotateCW', 'flipX', 'flipY'],
              right: ['slideshow', 'thumbs', 'close']
            }
          },
          l10n: {
            PANUP: '上移',
            PANDOWN: '下移',
            PANLEFT: '左移',
            PANRIGHT: '右移',
            ZOOMIN: '放大',
            ZOOMOUT: '缩小',
            TOGGLEZOOM: '切换缩放级别',
            TOGGLE1TO1: '切换缩放级别',
            ITERATEZOOM: '切换缩放级别',
            ROTATECCW: '逆时针旋转',
            ROTATECW: '顺时针旋转',
            FLIPX: '水平翻转',
            FLIPY: '垂直翻转',
            FITX: '水平适应',
            FITY: '垂直适应',
            RESET: '重置',
            TOGGLEFS: '切换全屏',
            CLOSE: '关闭',
            NEXT: '下一个',
            PREV: '上一个',
            MODAL: '使用 ESC 键关闭',
            ERROR: '发生了错误，请稍后再试',
            IMAGE_ERROR: '找不到图像',
            ELEMENT_NOT_FOUND: '找不到 HTML 元素',
            AJAX_NOT_FOUND: '载入 AJAX 时出错: 未找到',
            AJAX_FORBIDDEN: '载入 AJAX 时出错: 被阻止',
            IFRAME_ERROR: '加载页面出错',
            TOGGLE_ZOOM: '切换缩放级别',
            TOGGLE_THUMBS: '切换缩略图',
            TOGGLE_SLIDESHOW: '切换幻灯片',
            TOGGLE_FULLSCREEN: '切换全屏',
            DOWNLOAD: '下载'
          }
        })
      }
    })
    // 接住 reject（错误已在 callback 中记录，此处仅防 unhandledrejection）
    if (loading && typeof (loading as Promise<HTMLScriptElement>).catch === 'function') {
      ;(loading as Promise<HTMLScriptElement>).catch(() => {})
    }
  } catch (error) {
    console.error('图片灯箱初始化失败', error)
  }
}

export default initFancybox
