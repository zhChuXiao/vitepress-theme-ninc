// 客户端运行时通用工具（无 Node 依赖）
// 包含：generateId、loadScript、loadCSS、jumpRedirect（仅 isDom=true 客户端分支）
// 注意：与 node/utils/commonTools.mjs 拆分，避免客户端引入 cheerio 这个 Node 包

interface LoadScriptOption {
  async?: boolean
  reload?: boolean
  callback?: (error: any, el?: HTMLScriptElement) => void
}

interface LoadCSSOption {
  reload?: boolean
  callback?: (error: any, el?: HTMLLinkElement) => void
}

/**
 * 从文件名生成数字 ID
 * @param fileName - 文件名
 * @returns 生成的数字ID
 */
export const generateId = (fileName: string): number => {
  let hash = 0
  for (let i = 0; i < fileName.length; i++) {
    hash = (hash << 5) - hash + fileName.charCodeAt(i)
  }
  return Math.abs(hash % 10000000000)
}

/**
 * 动态加载脚本
 * @param src - 脚本 URL
 * @param option - 配置
 */
export const loadScript = (
  src: string,
  option: LoadScriptOption = {}
): Promise<HTMLScriptElement> | boolean => {
  if (typeof document === 'undefined' || !src) return false
  const { async = false, reload = false, callback } = option
  const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
  if (existingScript) {
    if (!reload) {
      callback && callback(null, existingScript)
      return false
    }
    existingScript.remove()
  }
  return new Promise<HTMLScriptElement>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    if (async) script.async = true
    script.onload = () => {
      resolve(script)
      callback && callback(null, script)
    }
    script.onerror = (error) => {
      reject(error)
      callback && callback(error)
    }
    document.head.appendChild(script)
  })
}

/**
 * 动态加载样式表
 * @param href - 样式表 URL
 * @param option - 配置
 */
export const loadCSS = (
  href: string,
  option: LoadCSSOption = {}
): Promise<HTMLLinkElement> | boolean => {
  if (typeof document === 'undefined' || !href) return false
  const { reload = false, callback } = option
  const existingLink = document.querySelector<HTMLLinkElement>(`link[href="${href}"]`)
  if (existingLink) {
    if (!reload) {
      callback && callback(null, existingLink)
      return false
    }
    existingLink.remove()
  }
  return new Promise<HTMLLinkElement>((resolve, reject) => {
    const link = document.createElement('link')
    link.href = href
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.onload = () => {
      resolve(link)
      callback && callback(null, link)
    }
    link.onerror = (error) => {
      reject(error)
      callback && callback(error)
    }
    document.head.appendChild(link)
  })
}

/**
 * 客户端跳转中转（运行时遍历 DOM 替换 a 标签）
 * 注意：此函数仅处理 isDom=true 模式（客户端 DOM 操作）
 * Node 侧的 transformHtml 处理请使用 node/utils/commonTools.mjs 中的 jumpRedirect
 *
 * @param _html - 未使用（保持与原签名兼容）
 * @param themeConfig - 主题配置
 * @param isDom - 必须为 true（仅客户端模式）
 */
export const jumpRedirect = (_html: string, themeConfig: any, isDom = true): boolean | void => {
  try {
    if (!themeConfig?.jumpRedirect?.enable) return false
    if (typeof window === 'undefined' || typeof document === 'undefined') return false
    const redirectPage = '/redirect'
    const excludeClass: string[] = themeConfig.jumpRedirect.exclude || []
    const allLinks = [...document.getElementsByTagName('a')]
    if (allLinks?.length === 0) return false
    allLinks.forEach((link) => {
      if (link.getAttribute('target') === '_blank') {
        if (excludeClass.some((className) => link.classList.contains(className))) {
          return false
        }
        const linkHref = link.getAttribute('href')
        if (linkHref && !linkHref.includes(redirectPage)) {
          const encodedHref = btoa(linkHref)
          const redirectLink = `${redirectPage}?url=${encodedHref}`
          link.setAttribute('original-href', linkHref)
          link.setAttribute('href', redirectLink)
        }
      }
    })
  } catch (error) {
    console.error('处理链接时出错：', error)
  }
}
