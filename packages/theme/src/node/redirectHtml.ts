// 外链中转静态页生成与注入
//
// 背景：原项目在 public/redirect.html 放置独立中转页，VitePress 原样输出到站点根目录，
// 访问 /redirect 不依赖文件系统路由，dev/build 均可直通。
// 副本重构时改为 Redirect.vue 组件却未注册路由，导致 /redirect 404。
//
// 本模块回归“独立 html”方案，但由主题包自动注入：
// - dev：通过 Vite 中间件拦截 /redirect 请求返回中转页
// - build：通过 generateBundle 输出 redirect.html 到 dist
// 用户配置 jumpRedirect.enable: true 即开箱可用，无需手动创建任何文件。
//
// 白名单/黑名单从 themeConfig.jumpRedirect.whitelist / blacklist 读取，
// 默认值见 defaultThemeConfig.ts。
import type { PluginOption } from 'vite'
import type { ThemeConfig } from '../types/index.ts'

/** 域名白名单默认值（安全站点，自动跳转） */
export const DEFAULT_REDIRECT_WHITELIST = [
  'gitee.com',
  'github.com',
  'baidu.com',
  'bing.cn',
  'npmjs.com',
  'cnblogs.com',
  'csdn.net',
  'jianshu.com',
  'zhihu.com',
  'juejin.cn',
  'segmentfault.com',
  'v2ex.com',
  'google.com',
  'google.cn',
  'google.com.*',
  'vuejs.org'
]

/** 域名黑名单默认值（购物站点，危险警告，不自动跳转） */
export const DEFAULT_REDIRECT_BLACKLIST = [
  'taobao.com',
  'jd.com',
  'tmall.com',
  '1688.com',
  'pinduoduo.com',
  'amazon.com'
]

/** 将字符串转义为可安全注入 HTML 的文本 */
const escapeHtml = (str: string): string =>
  String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/**
 * 生成外链中转页 HTML
 *
 * 站点名 / 头像 / ICP 从 themeConfig 读取并转义注入，
 * 白/黑名单以 JSON 形式注入到页面脚本中。
 *
 * @param themeConfig 主题配置
 * @returns 完整的 HTML 字符串
 */
export function generateRedirectHtml(themeConfig: ThemeConfig): string {
  const siteName = escapeHtml(themeConfig?.siteMeta?.title || '本站')
  const avatar = escapeHtml(themeConfig?.siteMeta?.avatar || '')
  const icp = themeConfig?.icp ? String(themeConfig.icp) : ''
  const whitelist =
    themeConfig?.jumpRedirect?.whitelist && themeConfig.jumpRedirect.whitelist.length > 0
      ? themeConfig.jumpRedirect.whitelist
      : DEFAULT_REDIRECT_WHITELIST
  const blacklist =
    themeConfig?.jumpRedirect?.blacklist && themeConfig.jumpRedirect.blacklist.length > 0
      ? themeConfig.jumpRedirect.blacklist
      : DEFAULT_REDIRECT_BLACKLIST

  // 白/黑名单注入为 JSON 数组，避免拼接字符串引入的转义问题
  const whitelistJson = JSON.stringify(whitelist)
  const blacklistJson = JSON.stringify(blacklist)

  const icpHtml = icp
    ? `<a class="icp" href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer"> ${escapeHtml(icp)} </a>`
    : ''

  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex,nofollow" />
    <title>安全中心 | ${siteName}</title>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style>
      * {
        margin: 0;
        user-select: none;
        box-sizing: border-box;
      }
      :root {
        --main-site-background: #f7f9fe;
        --main-card-border: #e3e8f7;
        --main-card-background: #fff;
        --main-font-color: #363636;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --main-site-background: #18171d;
          --main-card-border: #3d3d3f;
          --main-card-background: #1b1c20;
          --main-font-color: #f7f7fa;
        }
      }
      a {
        text-decoration: none;
        color: var(--main-font-color);
      }
      body {
        background-color: var(--main-card-background);
        color: var(--main-font-color);
        font-family: 'PingFang SC', 'Open Sans', 'Microsoft YaHei', sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100vw;
        width: 100dvw;
        height: 100vh;
        height: 100dvh;
        overflow: hidden;
        transition: color 0.3s, background-color 0.3s;
      }
      header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;
      }
      header .logo {
        border-radius: 100px;
        width: 100px;
        height: 100px;
        border: 2px solid var(--main-font-color);
        overflow: hidden;
      }
      header .logo img {
        width: 100px;
        height: 100px;
      }
      header .title {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      header .title .site-name {
        font-size: 30px;
        font-weight: bold;
      }
      header .title .site-tip {
        font-size: 20px;
        margin-top: 8px;
        opacity: 0.6;
      }
      main {
        border-radius: 16px;
        padding: 30px;
        max-width: 768px;
        min-width: 380px;
      }
      main .tip {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        opacity: 0.4;
      }
      main #url {
        display: block;
        padding: 12px 20px;
        border-radius: 8px;
        width: 100%;
        text-align: center;
        border: 1px solid var(--main-card-border);
        background-color: var(--main-site-background);
        user-select: text;
        word-break: break-all;
        cursor: pointer;
        min-height: 50px;
      }
      main #site-info {
        display: inline-flex;
        width: 100%;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        font-size: 16px;
        font-weight: 600;
        gap: 5px;
      }
      main #jump-content.warn {
        color: #ffb02e;
      }
      main #jump-content.safe {
        color: #00d26a;
      }
      main #jump-content.danger {
        color: #f8312f;
      }
      main #jump-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 44px;
        width: 180px;
        margin: 30px auto 0;
        border-radius: 8px;
        color: var(--main-font-color);
        background-color: var(--main-card-border);
        transition: background-color 0.3s;
        cursor: pointer;
      }
      main #jump-button:hover {
        background-color: var(--main-site-background);
      }
      footer {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 0;
        margin: 20px;
        opacity: 0.6;
        font-size: 15px;
      }
      footer .icp::before {
        content: '|';
        margin: 0 8px;
        margin-left: 4px;
        opacity: 0.2;
      }
      .key-tip {
        font-family: inherit;
        background-color: var(--main-card-background);
        color: var(--main-font-color);
        border: 1px solid #a1a2b8;
        border-bottom: 2px solid #a1a2b8;
        box-shadow: 0 8px 16px -4px rgba(44, 45, 48, 0.047);
        border-radius: 0.25rem;
        font-weight: 500;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 20px;
        padding: 0 4px;
        gap: 2px;
      }
      .key-tip-arrow {
        height: 100%;
        font-size: 9px;
        display: flex;
        align-items: flex-end;
      }
    </style>
  </head>

  <body>
    <header>
      <div class="logo">
        ${avatar ? `<img src="${avatar}" alt="logo" />` : ''}
      </div>
      <div class="title">
        <span class="site-name">${siteName}</span>
        <span class="site-tip">安全提示</span>
      </div>
    </header>
    <div class="mockup-browser border-base-300 border max-w-[768px] min-w-[380px]">
      <div class="mockup-browser-toolbar"></div>
      <div class="border-t bg-[var(--main-card-background)]">
        <main>
          <span class="tip">您即将离开本站，前往</span>
          <div class="tooltip w-full tooltip-top">
            <div class="tooltip-content h-8 w-25 flex items-center justify-center">
              <div class="text-[12px] m-4 font-black">点击复制链接</div>
            </div>
            <span id="url"></span>
          </div>
          <div id="jump-content" class="warn">
            <span id="site-info">
              <svg class="icon" viewBox="0 0 1024 1024" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M512 0c285.257143 0 512 226.742857 512 512s-226.742857 512-512 512-512-226.742857-512-512 226.742857-512 512-512z m-7.314286 614.4c43.885714 0 73.142857-29.257143 73.142857-73.142857v-292.571429c0-43.885714-29.257143-73.142857-73.142857-73.142857s-73.142857 29.257143-73.142857 73.142857v292.571429c0 43.885714 36.571429 73.142857 73.142857 73.142857z m0 73.142857c-43.885714 0-73.142857 29.257143-73.142857 73.142857s29.257143 73.142857 73.142857 73.142857 73.142857-29.257143 73.142857-73.142857c0-36.571429-29.257143-73.142857-73.142857-73.142857z" fill="#FFB55E"></path>
              </svg>
              <span>该网址安全性未知，请注意您的帐号和财产安全</span>
            </span>
            <div id="jump-button">
              <span>继续前往</span>
              <div class="key-tip">
                Enter
                <div class="key-tip-arrow">&crarr;</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    <footer>
      <a class="power" href="javascript:void(0)">
        ©
        <script>document.write(new Date().getFullYear())</script>
        ${siteName}
      </a>
      ${icpHtml}
    </footer>
    <div id="toast-container" class="fixed top-4 z-50 flex flex-col gap-2"></div>
    <script>
      // 跳转网址
      let jumpLink
      let interval
      const urlDom = document.getElementById('url')
      const urlTip = document.getElementById('site-info')
      const jumpContent = document.getElementById('jump-content')
      const jumpButton = document.getElementById('jump-button')
      // 网址白名单（从主题配置注入）
      const whitelist = ${whitelistJson}
      // 网址黑名单（从主题配置注入）
      const blacklist = ${blacklistJson}
      // 提示文本
      const tipText = {
        safe: '<svg class="icon" viewBox="0 0 1024 1024" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M512.564498 13.54796c-276.60419 0-500.710033 224.105843-500.710033 500.710033s224.105843 500.710033 500.710033 500.710033 500.145535-224.105843 500.145535-500.710033S788.60419 13.54796 512.564498 13.54796zM789.168688 447.647189C632.802646 536.837927 476.436604 790.297685 476.436604 790.297685c-134.350606-164.269019-241.040794-197.574421-241.040794-197.574421l134.350606-77.900772c63.223815 60.401323 106.690187 103.867696 106.690187 103.867696 176.123484-336.441014 312.732084-379.907387 312.732084-379.907387L789.168688 447.647189z" fill="#00d26a"></path></svg><span>该网址已信任，即将跳转</span>',
        danger: '<svg class="icon" viewBox="0 0 1024 1024" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M512 0c285.257143 0 512 226.742857 512 512s-226.742857 512-512 512-512-226.742857-512-512 226.742857-512 512-512z m-7.314286 614.4c43.885714 0 73.142857-29.257143 73.142857-73.142857v-292.571429c0-43.885714-29.257143-73.142857-73.142857-73.142857s-73.142857 29.257143-73.142857 73.142857v292.571429c0 43.885714 36.571429 73.142857 73.142857 73.142857z m0 73.142857c-43.885714 0-73.142857 29.257143-73.142857 73.142857s29.257143 73.142857 73.142857 73.142857 73.142857-29.257143 73.142857-73.142857c0-36.571429-29.257143-73.142857-73.142857-73.142857z" fill="#d81e06"></path></svg><span>您即将跳转购物网站，请注意您的财产安全</span>'
      }
      // 自动跳转
      const autoJump = () => {
        let count = 2
        const updateContent = () => {
          jumpButton.innerHTML = count + ' 秒后自动跳转'
          count--
          if (count < 0) {
            clearInterval(interval)
            jumpButton.innerHTML = '正在跳转'
            window.location.replace(jumpLink)
          }
        }
        updateContent()
        interval = setInterval(updateContent, 1000)
      }
      // 获取跳转网址
      const getJumpUrl = () => {
        try {
          const urlParams = new URLSearchParams(window.location.search)
          const encodedUrl = urlParams.get('url')
          jumpLink = atob(encodedUrl)
          urlDom.innerHTML = jumpLink
          const urlHostname = new URL(jumpLink).hostname
          // 黑名单优先判断
          for (let i = 0; i < blacklist.length; i++) {
            const blackPattern = blacklist[i].replace(/\\*/g, '.*')
            if (urlHostname.match(blackPattern)) {
              urlTip.innerHTML = tipText.danger
              jumpContent.className = 'danger'
              return true
            }
          }
          // 白名单判断
          for (let i = 0; i < whitelist.length; i++) {
            const whitePattern = whitelist[i].replace(/\\*/g, '.*')
            if (urlHostname.match(whitePattern)) {
              urlTip.innerHTML = tipText.safe
              jumpContent.className = 'safe'
              autoJump()
              return true
            }
          }
        } catch (error) {
          console.error(error)
          jumpContent.remove()
          urlDom.innerHTML = '获取跳转链接失败'
        }
      }
      document.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
          clearInterval(interval)
          jumpButton.innerHTML = '正在跳转'
          if (jumpLink) window.location.replace(jumpLink)
        }
      })
      jumpButton.addEventListener('click', () => {
        clearInterval(interval)
        jumpButton.innerHTML = '正在跳转'
        if (jumpLink) window.location.replace(jumpLink)
      })
      urlDom.addEventListener('click', () => {
        if (navigator.clipboard) {
          navigator.clipboard
            .writeText(urlDom.innerHTML)
            .then(() => showToast('链接已复制到剪贴板', 'default'))
            .catch(() => showToast('复制失败，请手动复制', 'error'))
        } else {
          try {
            const tempInput = document.createElement('input')
            tempInput.value = urlDom.innerHTML
            document.body.appendChild(tempInput)
            tempInput.select()
            document.execCommand('copy')
            document.body.removeChild(tempInput)
            showToast('链接已复制到剪贴板', 'default')
          } catch (err) {
            showToast('复制失败，请手动复制', 'error')
          }
        }
      })
      window.addEventListener('DOMContentLoaded', getJumpUrl)
      // Toast
      function showToast(message, type = 'info', duration = 2000) {
        const toast = document.createElement('div')
        toast.className = 'flex text-sm items-center border-2 text-black px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out translate-x-full opacity-0'
        switch (type) {
          case 'success':
            toast.classList.add('bg-green-600', 'text-green-100', 'border-green-200')
            break
          case 'error':
            toast.classList.add('bg-red-600', 'text-red-100', 'border-red-200')
            break
          case 'warning':
            toast.classList.add('bg-yellow-600', 'text-yellow-100', 'border-yellow-200')
            break
          default:
            toast.classList.add('bg-blue-600', 'text-blue-100', 'border-blue-200')
        }
        toast.innerHTML = message
        const container = document.getElementById('toast-container')
        container.appendChild(toast)
        setTimeout(() => {
          toast.classList.add('translate-x-0')
          toast.classList.remove('translate-x-full')
          toast.classList.add('opacity-100')
          toast.classList.remove('opacity-0')
        }, 10)
        setTimeout(() => {
          toast.classList.add('translate-x-full')
          toast.classList.remove('translate-x-0')
          toast.classList.add('opacity-0')
          toast.classList.remove('opacity-100')
          setTimeout(() => container.removeChild(toast), 300)
        }, duration)
        return toast
      }
    </script>
  </body>
</html>`
}

/**
 * 创建外链中转页 Vite 插件
 *
 * - dev：拦截 /redirect 与 /redirect.html 请求，直接返回中转页 HTML
 * - build：输出 redirect.html 到 dist 根目录，配合 cleanUrls 可通过 /redirect 访问
 *
 * 仅在 jumpRedirect.enable 为 true 时由 defineConfig 注入。
 *
 * @param themeConfig 主题配置
 * @returns Vite 插件
 */
export function createRedirectHtmlPlugin(themeConfig: ThemeConfig): PluginOption {
  const html = generateRedirectHtml(themeConfig)

  return {
    name: 'vitepress-theme-ninc:redirect-html',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url ? req.url.split('?')[0] : ''
        if (pathname === '/redirect' || pathname === '/redirect.html') {
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.statusCode = 200
          res.end(html)
          return
        }
        next()
      })
    }
  }
}

/**
 * 创建外链中转页构建产物输出插件
 *
 * 在 build 阶段将 redirect.html 输出到 dist 根目录。
 * 与 createRedirectHtmlPlugin 分离，因为 dev 用中间件、build 用 emitFile。
 *
 * @param themeConfig 主题配置
 * @returns Vite 插件
 */
export function createRedirectHtmlBuildPlugin(themeConfig: ThemeConfig): PluginOption {
  const html = generateRedirectHtml(themeConfig)

  return {
    name: 'vitepress-theme-ninc:redirect-html-build',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'redirect.html',
        source: html
      })
    }
  }
}
