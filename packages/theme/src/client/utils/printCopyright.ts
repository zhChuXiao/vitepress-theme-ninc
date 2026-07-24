// 主题版权输出

export function printCopyright() {
  if (import.meta.env.SSR) return

  // 延迟 2 秒输出，避免与 VitePress 启动日志混在一起
  setTimeout(() => {
    const title = 'vitepress-theme-ninc'
    const url = 'https://theme.ninc.top'
    const author = 'by 呢喃Ninc'

    // 用 bind 取 console.log 的引用，绕过 terser pure_funcs 的静态匹配
    const log = console.log.bind(console)

    // 三段式：标题（青绿渐变）→ URL（白底深字）→ 作者（青绿到珊瑚渐变）
    log(
      `%c ${title} %c ${url} %c ${author} `,
      'background:linear-gradient(to right, #38a3a5, #57cc99); color:white; font-size:16px; padding:8px 5px 5px 8px; border-radius:5px 0 0 5px; font-weight:bold; box-shadow:0 2px 5px rgba(0,0,0,0.2);',
      'background:#ffffff; color:#38a3a5; font-size:16px; padding:8px 5px 5px 5px; font-weight:bold; box-shadow:0 2px 5px rgba(0,0,0,0.2);',
      'background:linear-gradient(to right, #57cc99, #ff6b6b); color:white; font-size:16px; padding:8px 5px 5px 0; border-radius:0 5px 5px 0; font-weight:bold; box-shadow:0 2px 5px rgba(0,0,0,0.2);',
    )
  }, 2000)
}
