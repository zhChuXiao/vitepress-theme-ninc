#!/usr/bin/env node
// vitepress-theme-ninc CLI
//   init       — 交互式脚手架：在用户项目根目录生成 VitePress + 本主题的最小可用配置
//   summary    — 本地预生成 AI 摘要到缓存文件（配合 aiSummary.buildGenerate: false 使用）
//   init-proxy — 生成 AI 摘要运行时代理脚手架（Cloudflare / Vercel），无需手写代理代码
// 运行：npx vitepress-theme-ninc <command> 或 pnpm dlx vitepress-theme-ninc <command>
import * as clack from '@clack/prompts'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pc from 'picocolors'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ============== 交互工具（基于 @clack/prompts）==============

/** 检查用户是否取消（Ctrl+C），取消则优雅退出 */
function handleCancel(value) {
  if (clack.isCancel(value)) {
    clack.cancel('初始化已取消')
    process.exit(0)
  }
  return value
}

/** 文本输入，支持默认值与占位提示 */
async function question(prompt, defaultValue = '') {
  const result = await clack.text({
    message: prompt,
    initialValue: defaultValue || undefined,
    placeholder: defaultValue || undefined,
  })
  const val = handleCancel(result)
  return val || defaultValue
}

/** 是/否确认，支持默认值 */
async function confirm(prompt, defaultValue = false) {
  const result = await clack.confirm({
    message: prompt,
    initialValue: defaultValue,
  })
  return handleCancel(result)
}

/** 单选列表（上下箭头选择），options 为 { value, label, desc? } 数组 */
async function select(prompt, options, defaultIndex = 0) {
  const result = await clack.select({
    message: prompt,
    initialValue: options[defaultIndex]?.value,
    options: options.map(opt => ({
      value: opt.value,
      label: opt.label,
      hint: opt.desc,
    })),
  })
  return handleCancel(result)
}

/** 多选列表（上下箭头 + 空格选择），返回选中值数组 */
async function multiselect(prompt, options) {
  const result = await clack.multiselect({
    message: prompt,
    required: false,
    options: options.map(opt => ({
      value: opt.value,
      label: opt.label,
      hint: opt.desc,
    })),
  })
  return handleCancel(result)
}

/** 安全写文件：目录不存在则创建，文件已存在则询问覆盖 */
async function writeFile(filePath, content, force = false) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  if (fs.existsSync(filePath) && !force) {
    const overwrite = await confirm(`${filePath} 已存在，是否覆盖？`, false)
    if (!overwrite) {
      console.log(pc.dim(`  跳过 ${filePath}`))
      return false
    }
  }
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(pc.green(`  ✓`) + pc.dim(` ${filePath}`))
  return true
}

/** 检测当前目录是否为 VitePress 项目根目录 */
function detectVitePressRoot() {
  return fs.existsSync('.vitepress') || fs.existsSync('index.md')
}

// ============== 文件模板 ==============

function tplIndexMd(cfg) {
  return `---
layout: home
title: 首页
---

欢迎来到 ${cfg.title}
`
}

function tplConfigMts(cfg) {
  const pwaLine = cfg.pwa === false
    ? '    pwa: false  // 关闭 PWA（如需启用改为 true 或删除此行）\n'
    : ''

  return `// VitePress 配置 —— 由 vitepress-theme-ninc init 生成
// 文档：https://theme.ninc.top/guide/configuration
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from './themeConfig'
// 如需代码组图标，取消下行注释并创建 groupIconConfig.json
// import groupIconConfig from './groupIconConfig.json'

export default defineConfig(
  // ── 第一参数：VitePress 顶层配置 ──
  {
    sitemap: { hostname: ${JSON.stringify(cfg.site)} }
  },
  // ── 第二参数：主题配置（来自 themeConfig.ts）──
  themeConfig,
  // ── 第三参数：构建选项 ──
  {
${pwaLine}    // 文章目录（默认为项目根目录下的 posts）
    // postsDir: new URL('../posts', import.meta.url).pathname,
    // RSS 输出路径（默认为 dist/rss.xml）
    // rssOutput: new URL('./dist/rss.xml', import.meta.url).pathname,
    // SVG 图标扫描目录（默认为 public/svg）
    // svgIconDirs: [new URL('../public/svg', import.meta.url).pathname],
    // 代码组图标配置（需在顶部 import groupIconConfig from './groupIconConfig.json'）
    // groupIconConfig,
    // 按需关闭 Vite 插件（autoImport / components 为硬依赖，不可关闭）
    // plugins: { compression: false, codeInspector: false }
  }
)
`
}

function tplThemeIndex() {
  return `// 主题入口 —— 由 vitepress-theme-ninc init 生成
import Theme from 'vitepress-theme-ninc'

export default Theme
`
}

function tplThemeConfig(cfg) {
  const year = new Date().getFullYear()
  const commentBlock = cfg.comment
    ? `  // 评论系统（Twikoo）—— 已启用，请在下方填写你的 envId
  comment: {
    enable: true,
    twikoo: {
      envId: ${JSON.stringify(cfg.twikooEnvId || 'https://your-twikoo.example.com')},
      lang: 'zh-CN'
    }
  },`
    : `  // 评论系统（Twikoo）—— 如需启用，将 enable 改为 true 并填写 envId
  comment: {
    enable: false,
    twikoo: {
      envId: '',
      lang: 'zh-CN'
    }
  },`

  // NES 模拟器导航项（仅当用户启用 NES 页面时插入"工具"分组）
  const navNesBlock = cfg.nes
    ? `    {
      text: '工具',
      items: [
        { text: 'NES 模拟器', link: '/pages/nes', icon: 'game' }
      ]
    },`
    : ''

  return `// 主题配置 —— 由 vitepress-theme-ninc init 生成
// 文档：https://theme.ninc.top/guide/configuration
// 所有字段会与主题内置默认值深合并（defu），只需写想改的字段
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  // ━━━ 站点元信息 ━━━
  siteMeta: {
    title: ${JSON.stringify(cfg.title)},
    description: ${JSON.stringify(cfg.description)},
    // 站点头像（侧边栏 Clock 中心头像、关于页头像等共用）
    // 默认使用主题作者提供的网络图片，开箱即用
    // 替换为自己的头像：把图片放到 public/images/ 下，改为 '/images/your-avatar.jpg'
    avatar: 'http://blog.ninc.top/images/cxLogo/avatar2.jpg',
    logo: '/images/logo.svg',
    site: ${JSON.stringify(cfg.site)},
    base: '/',
    lang: 'zh-CN',
    author: {
      name: ${JSON.stringify(cfg.author)},
      // 作者头像（Clock 中心头像优先使用此字段，未配置时回退到 siteMeta.avatar）
      cover: 'http://blog.ninc.top/images/cxLogo/avatar2.jpg',
      email: ${JSON.stringify(cfg.email)},
      // 作者主页链接（如 GitHub），填写后侧边栏 hello 卡片会显示 GitHub 图标入口；留空则不显示
      link: ''
    }
  },

  // ━━━ 首页顶部区域 ━━━
  homeTop: {
    title: ${JSON.stringify(cfg.title)},
    subtitle: ${JSON.stringify(cfg.description)},
    link: ${JSON.stringify(cfg.site.replace(/^https?:\/\//, ''))},
    // 推荐站点卡片（首页顶部右侧大图）
    banner: {
      tip: '推荐站点：',
      title: ${JSON.stringify(cfg.title)},
      // 推荐站点封面图默认使用主题作者提供的网络图片，开箱即用
      // 替换为自己的图：放到 public/images/ 下，改为 '/images/your-banner.jpg'
      image: 'http://blog.ninc.top/images/cover/003405.jpeg',
      // 暗色模式封面图（不配置时与 image 相同）
      darkImage: '',
      recommendUrl: 'https://blog.ninc.top',
      newTab: true
    }
  },

  // ━━━ 基础设置 ━━━
  // 备案号（国内站点需要，格式如 "粤ICP备XXXXXXXX号"）
  icp: '',
  // 建站日期（用于页脚版权年份计算）
  since: ${JSON.stringify(String(year))},
  // 每页文章数
  postSize: 10,
  // 左下角个性化设置面板
  settingButton: false,

  // ━━━ 全局 head 标签注入 ━━━
  inject: {
    header: [
      // favicon
      ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
      // 防盗链
      ['meta', { name: 'referrer', content: 'no-referrer' }],
      // SEO
      ['meta', { name: 'author', content: ${JSON.stringify(cfg.author)} }],
      ['meta', { name: 'description', content: ${JSON.stringify(cfg.description)} }],
      // 移动端适配
      ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
      ['meta', { name: 'theme-color', content: '#ffffff' }]
    ]
  },

  // ━━━ 导航栏 ━━━
  // 数组会与默认值 concat 合并（用户项在前），所以需完整给出
  nav: [
    {
      text: '文库',
      items: [
        { text: '文章列表', link: '/pages/archives', icon: 'article' },
        { text: '全部分类', link: '/pages/categories', icon: 'folder' },
        { text: '全部标签', link: '/pages/tags', icon: 'hashtag' }
      ]
    },
    {
      text: '专栏',
      items: [
        { text: '随笔笔记', link: '/pages/categories/随笔笔记', icon: 'article' },
        { text: '技术教程', link: '/pages/categories/技术教程', icon: 'code' }
      ]
    },
${navNesBlock}
    {
      text: '我的',
      items: [
        { text: '留言板', link: '/pages/comments', icon: 'chat' },
        { text: '关于本站', link: '/pages/about', icon: 'contacts' }
      ]
    }
  ],

  // ━━━ 左侧「更多内容」菜单 ━━━
  navMore: [
    {
      name: '博客',
      list: [
        { icon: 'article', iconType: 'iconfont', name: '文章归档', url: '/pages/archives' },
        { icon: 'folder', iconType: 'iconfont', name: '全部分类', url: '/pages/categories' },
        { icon: 'hashtag', iconType: 'iconfont', name: '全部标签', url: '/pages/tags' }
      ]
    },
    {
      name: '我的',
      list: [
        { icon: 'chat', iconType: 'iconfont', name: '留言板', url: '/pages/comments' },
        { icon: 'contacts', iconType: 'iconfont', name: '关于本站', url: '/pages/about' }
      ]
    }
  ],

  // ━━━ 文章封面 ━━━
  cover: {
    twoColumns: true,
    showCover: {
      enable: true,
      coverLayout: 'both',
      // 默认封面：留空数组时，无封面文章会渲染主题内置的 HTML 设计感占位（基于分类色的渐变 + 首字）
      // 如需使用自己的默认图，把图片放到 public/images/ 下，并填入路径：defaultCover: ['/images/cover.png']
      defaultCover: []
    }
  },

  // ━━━ 页脚 ━━━
  footer: {
    // 社交链接（请确保为偶数个）
    social: [
      { icon: 'email', link: ${JSON.stringify('mailto:' + cfg.email)} },
      { icon: 'github', link: 'https://github.com/' }
    ],
    // 徽标（shields.io 动态生成，leftText/rightText 中的 - 和空格会自动转义，直接写原文即可）
    badge: [
      {
        leftText: '',
        rightText: 'VitePress',
        color: '#646CFF',
        tooltip: '博客框架：VitePress',
        link: 'https://vitepress.dev/',
        style: 'for-the-badge',
        logo: 'vitepress'
      },
      {
        leftText: 'CopyRight',
        rightText: 'BY-NC-SA 4.0',
        color: '#ae3b37',
        tooltip: '知识共享 署名-非商业性使用-相同方式共享 4.0',
        link: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
        style: 'for-the-badge',
        logo: 'creativecommons'
      }
    ],
    // 页脚站点地图
    sitemap: [
      {
        text: '博客',
        items: [
          { text: '近期文章', link: '/' },
          { text: '全部分类', link: '/pages/categories' },
          { text: '全部标签', link: '/pages/tags' },
          { text: '文章归档', link: '/pages/archives' }
        ]
      },
      {
        text: '专栏',
        items: [
          { text: '随笔笔记', link: '/pages/categories/随笔笔记' },
          { text: '技术教程', link: '/pages/categories/技术教程' }
        ]
      },
      {
        text: '协议',
        items: [
          { text: '隐私政策', link: '/pages/privacy' },
          { text: '版权协议', link: '/pages/cc' },
          { text: 'Cookies', link: '/pages/cookies' }
        ]
      }
    ]
  },

${commentBlock}

  // ━━━ 侧边栏 ━━━
  aside: {
    // 站点简介
    hello: {
      enable: true,
      text: '欢迎来到 <strong>${cfg.title}</strong>，这里记录我的所思所学。'
    },
    // 欢迎卡片
    welcome: {
      enable: true,
      text1: '👋🏻 Hi，我是 ${cfg.author}，欢迎你！',
      text2: '本站采用 <strong>VitePress</strong> 搭建',
      text3: '主题使用 vitepress-theme-ninc',
      email: ${JSON.stringify(cfg.email)},
      // 经纬度 [lng, lat]，为空则不渲染地图
      address: []
    },
    // 文章目录
    toc: { enable: true },
    // 标签云
    tags: { enable: true },
    // 倒计时
    countDown: {
      enable: false,
      data: { name: '示例倒计时', date: '${year + 1}-01-01' }
    },
    // 站点数据统计
    siteData: { enable: true }
  },

  // ━━━ 友链 / 留言板 ━━━
  friends: {
    comments: {
      title: '留言板',
      author: ${JSON.stringify(cfg.author)},
      cover: 'https://blog.ninc.top/images/cover/003405.jpeg',
      message: ['欢迎光临 ${cfg.title}！想聊什么都可以～'],
      bottom: '感谢你的留言'
    }
  },

  // ━━━ 关于本站 ━━━
  // 所有字段会与主题内置默认值深合并，只需写想改的字段
  // 以下为完整示例，实际使用时按需修改即可
  about: {
    // 头像两侧技能标签
    avatarSkills: {
      left: ['💻 专注前端开发', '🚀 技术狂热分子', '🛠️ 喜欢折腾新技术', '📚 持续学习践行者'],
      right: ['轻微社恐但靠谱 🤫', '代码洁癖患者 ✨', '独立解决问题 🤔', '细节强迫症 🔍']
    },
    // 介绍区域
    hello: {
      text1: '你好，很高兴认识你👋',
      text2: '我是 ${cfg.author}',
      text3: '是一名 前端开发工程师'
    },
    // 追求区域（word 数组会循环轮播显示）
    pursuit: {
      tips: '信仰',
      title1: '用代码',
      title2: '去构建心中的',
      word: ['未来', '逻辑', '价值', '创意']
    },
    // 技能区域（技能图标数据来自 homeTop.creativity）
    skills: { tip: '技能', title: '开启创造力' },
    // 生涯区域
    career: {
      tip: '生涯',
      title: '无限进步',
      list: [
        { text: '计算机应用技术', color: '#357ef5' },
        { text: '前端开发工程师', color: '#eb372a' }
      ]
    },
    // 性格区域（mbtiIcon 为 SVG 图标路径，缺失时不显示）
    character: {
      tip: '性格',
      title: '探险家',
      mbti: 'ISFP-T',
      mbtiIcon: '/images/icon/ISFP.svg',
      desc: '在 16personalities 了解更多关于',
      link: 'https://www.16personalities.com/ch/isfp-%E4%BA%BA%E6%A0%BC',
      linkText: '探险家'
    },
    // 座右铭
    motto: { tip: '座右铭', title1: '以乐观为笔，', title2: '绘就多彩生活。' },
    // 关注偏好（image 为背景图路径，color 为叠加色）
    preference: { image: 'https://blog.ninc.top/images/cover/003405.jpeg', color: '#00000022', tip: '关注偏好', title: '数码科技', desc: '手机、电脑及软硬件' },
    // 音乐偏好
    musicPreference: { image: 'https://blog.ninc.top/images/cover/003405.jpeg', color: '#ffffff22', tip: '音乐偏好', title: '欧美、KPOP、R&B', desc: '一起欣赏更多音乐' },
    // 数据统计（需配合 tongji.51la 配置使用）
    statistics: { color: '#0f1114', image: '', tip: '数据', title: '访问统计', desc: '统计信息来自', source: '51la', sourceLink: 'https://v6.51.la/' },
    // 信息区域（mapImage 为地图图片，address 为居住地址，items 为信息项）
    info: {
      mapImage: '/images/address.png',
      address: '你的地址',
      items: [
        { name: '生于', value: '2000', color: '#43a6c6' },
        { name: '现在职业', value: '前端开发工程师', color: '#dfac46' }
      ]
    }
  },

  // ━━━ 图片灯箱（已启用，使用公共 CDN）━━━
  fancybox: {
    enable: true,
    js: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.umd.min.js',
    css: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.min.css'
  },

  // ━━━ 外链中转（已启用，防止权重流失）━━━
  jumpRedirect: {
    enable: true
  },

  // ━━━ 以下为可选功能，按需启用 ━━━

  // 音乐播放器
  // music: {
  //   enable: true,
  //   url: 'https://api.injahow.cn/meting/',
  //   id: '你的歌单ID',
  //   server: 'netease',
  //   type: 'playlist'
  // },

  // 搜索（需在 Algolia 申请 appId/apiKey）
  // search: {
  //   enable: true,
  //   appId: 'YOUR_APP_ID',
  //   apiKey: 'YOUR_API_KEY',
  //   indexName: 'your_index_name'
  // },

  // 打赏二维码
  // rewardData: {
  //   enable: true,
  //   wechat: '/images/reward-wechat.png',
  //   alipay: '/images/reward-alipay.png'
  // },

  // 站点统计
  // tongji: {}

  // 开往-友链接力按钮（默认关闭，开启后导航栏右侧显示“开往”图标）
  // travellings: { enable: true }
})
`
}

// ============== 极简配置模板 ==============

function tplThemeConfigMinimal(cfg) {
  const year = new Date().getFullYear()
  return `// 主题配置 —— 极简模式（由 vitepress-theme-ninc init 生成）
// ⚠ 极简配置仅保证项目可运行，更多配置请参考官方文档逐条添加：
//    https://theme.ninc.top/guide/configuration
// 所有字段会与主题内置默认值深合并（defu），只需写想改的字段
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  // ━━━ 站点元信息（必填）━━━
  siteMeta: {
    title: ${JSON.stringify(cfg.title)},
    description: ${JSON.stringify(cfg.description)},
    // 站点头像默认使用主题作者提供的网络图片，开箱即用
    // 替换方法：把图片放到 public/images/ 下，改为 '/images/your-avatar.jpg'
    avatar: 'http://blog.ninc.top/images/cxLogo/avatar2.jpg',
    logo: '/images/logo.svg',
    site: ${JSON.stringify(cfg.site)},
    base: '/',
    lang: 'zh-CN',
    author: {
      name: ${JSON.stringify(cfg.author)},
      cover: 'http://blog.ninc.top/images/cxLogo/avatar2.jpg',
      email: ${JSON.stringify(cfg.email)},
      // 作者主页链接（如 GitHub），填写后侧边栏 hello 卡片会显示 GitHub 图标入口；留空则不显示
      link: ''
    }
  },

  // ━━━ 首页顶部区域 ━━━
  homeTop: {
    title: ${JSON.stringify(cfg.title)},
    subtitle: ${JSON.stringify(cfg.description)},
    link: ${JSON.stringify(cfg.site.replace(/^https?:\/\//, ''))}
  },

  // ━━━ 基础设置 ━━━
  since: ${JSON.stringify(String(year))},
  postSize: 10,

  // ━━━ 图片灯箱（默认启用，使用公共 CDN）━━━
  fancybox: {
    enable: true,
    js: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.umd.min.js',
    css: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.min.css'
  },

  // ━━━ 外链中转（默认启用，防止权重流失）━━━
  jumpRedirect: { enable: true }

  // ━━━ 以下为常用配置，按需取消注释并填写 ━━━
  // 完整字段说明请参考官方文档：https://theme.ninc.top/guide/configuration

  // 备案号（国内站点需要，格式如 "粤ICP备XXXXXXXX号"）
  // icp: '',

  // 左下角个性化设置面板
  // settingButton: false,

  // 全局 head 标签注入（favicon / SEO / 移动端适配等）
  // inject: {
  //   header: [
  //     ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  //     ['meta', { name: 'referrer', content: 'no-referrer' }],
  //     ['meta', { name: 'author', content: '博主' }],
  //     ['meta', { name: 'description', content: '博客描述' }]
  //   ]
  // },

  // 导航栏菜单（数组会与默认值 concat 合并，需完整给出）
  // nav: [
  //   { text: '文库', items: [
  //     { text: '文章列表', link: '/pages/archives', icon: 'article' },
  //     { text: '全部分类', link: '/pages/categories', icon: 'folder' },
  //     { text: '全部标签', link: '/pages/tags', icon: 'hashtag' }
  //   ]},
  //   { text: '我的', items: [
  //     { text: '留言板', link: '/pages/comments', icon: 'chat' },
  //     { text: '关于本站', link: '/pages/about', icon: 'contacts' }
  //   ]}
  // ],

  // 左侧「更多内容」菜单
  // navMore: [{ name: '博客', list: [...] }],

  // 文章封面
  // cover: {
  //   twoColumns: true,
  //   showCover: { enable: true, coverLayout: 'both', defaultCover: ['/images/cover.svg'] }
  // },

  // 页脚（社交链接 / 徽标 / sitemap）
  // footer: { social: [], badge: [], sitemap: [] },

  // 评论系统（Twikoo）
  // comment: { enable: false, twikoo: { envId: '', lang: 'zh-CN' } },

  // 侧边栏（hello / welcome / toc / tags / countDown / siteData）
  // aside: { hello: { enable: true, text: '欢迎来到我的博客' } },

  // 留言板
  // friends: { comments: { title: '留言板', author: '博主', message: ['欢迎光临！'] } },

  // 关于本站（完整字段较多，建议从文档复制示例后修改）
  // about: { ... },

  // 音乐播放器 / 搜索 / 打赏 / 站点统计（详见文档）
})
`
}

// ============== 示例文章模板 ==============

function tplPinnedPost(cfg) {
  const today = new Date().toISOString().slice(0, 10)
  return `---
title: 欢迎使用 ${cfg.title}！从这里开始你的博客之旅
tags: [公告, 教程]
categories: [随笔笔记]
date: ${today}
top: true
recommend: true
description: 恭喜你成功初始化了 vitepress-theme-ninc 主题！这篇置顶文章帮你快速了解主题的全部功能。
---

# 欢迎使用 ${cfg.title}！

恭喜！你已经成功初始化了 **vitepress-theme-ninc** 主题。这是一篇**置顶文章**（\`top: true\`），会始终显示在文章列表最前方。

## 快速上手

### 1. 创建文章

在 \`posts/articles/\` 目录下创建新的 \`.md\` 文件即可发布文章。每篇文章需要在顶部填写 frontmatter：

\`\`\`yaml
---
title: 文章标题
tags: [标签1, 标签2]
categories: [分类名]
date: 2024-01-01
description: 文章描述（显示在列表和搜索引擎中）
---
\`\`\`

### 2. 文章排序

- \`top: true\` — 置顶文章，始终排在最前
- \`recommend: true\` — 推荐文章，排在置顶之后、普通文章之前
- 不设置 — 按 \`date\` 降序排列

### 3. 主题配置

编辑 \`.vitepress/themeConfig.ts\` 定制站点外观：导航栏、侧边栏、页脚、评论等。

## 常用链接

- [全部文章](/pages/archives) — 查看所有文章列表
- [全部分类](/pages/categories) — 按分类浏览
- [全部标签](/pages/tags) — 按标签浏览
- [留言板](/pages/comments) — 给我留言
- [关于本站](/pages/about) — 了解更多

## 下一步

1. 替换 \`public/images/\` 下的占位图片为自己的头像、Logo、封面
2. 在 \`posts/articles/\` 目录下创建更多文章
3. 参考[官方文档](https://theme.ninc.top)了解更多配置项

---

::: tip 📚 完整文档
更多配置项、组件用法、写作指南请查阅主题官方文档：<https://theme.ninc.top>
:::
`
}

function tplMarkdownGuide(cfg) {
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  return `---
title: Markdown 与 VitePress 语法完全指南
tags: [Markdown, VitePress, 语法, 教程]
categories: [技术教程]
date: ${yesterday}
description: 全面展示 VitePress 内置语法与主题所有扩展功能，包括文本格式化、代码高亮、容器、代码组、徽标、标签页、时间线、按键块、数学公式、Emoji、Vue 组件等。
---

# Markdown 与 VitePress 语法完全指南

本文全面展示 VitePress 内置 Markdown 语法与主题扩展功能，方便写作时随时查阅。

::: tip 如何使用本文
本文既是语法参考，也是**渲染效果预览**。每段代码源码可在文章源文件 \`posts/articles/markdown-guide.md\` 中查看，对照源码与渲染结果学习最快。
:::

## 一、文本格式化

**粗体文本**  
*斜体文本*  
***粗斜体文本***  
~~删除线文本~~  
\`行内代码\`  
==高亮文本==  
H~2~O 下标  
2^10^ 上标

## 二、标题与锚点

### 自定义锚点 {#custom-anchor}

为标题指定自定义锚点，可通过 \`[链接](#custom-anchor)\` 跳转：

[跳转到上面的自定义锚点](#custom-anchor)

## 三、段落与换行

段落之间需空一行分隔。

行末加两个空格或反斜杠可强制换行。  
这是换行后的文字。

## 四、引用

> 这是一段引用文字，适合放置重要提示。
>
> 引用可以包含多段文字。
>
> > 引用可以嵌套。

### GitHub 风格提醒

> [!NOTE]
> 这是一个 Note 提醒，用于强调重要信息。

> [!TIP]
> 这是一个 Tip 提醒，用于给出建议。

> [!IMPORTANT]
> 这是一个 Important 提醒，用于强调关键信息。

> [!WARNING]
> 这是一个 Warning 提醒，用于提醒注意事项。

> [!CAUTION]
> 这是一个 Caution 提醒，用于强调严重风险。

## 五、列表

### 无序列表

- 列表项 1
- 列表项 2
  - 嵌套项 2.1
  - 嵌套项 2.2
- 列表项 3

### 有序列表

1. 第一步
2. 第二步
3. 第三步

### 任务列表

- [x] 已完成的任务
- [ ] 未完成的任务

## 六、代码

### 行内代码

使用反引号包裹：\`const x = 1\`

包含反引号的代码：\`\`use \`code\` here\`\`

### 代码块（带语法高亮与行号）

\`\`\`js
// JavaScript 代码块（自动显示行号）
const greeting = 'Hello, ${cfg.title}!'
console.log(greeting)
\`\`\`

\`\`\`ts
// TypeScript 代码块
interface Post {
  title: string
  date: string
  tags: string[]
}
\`\`\`

\`\`\`vue
<!-- Vue 单文件组件 -->
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
\`\`\`

\`\`\`bash
# Shell 脚本
pnpm install
pnpm dev
\`\`\`

\`\`\`json
{
  "name": "my-blog",
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build"
  }
}
\`\`\`

\`\`\`html
<div class="container">
  <h1>Hello World</h1>
</div>
\`\`\`

\`\`\`css
.container {
  max-width: 800px;
  margin: 0 auto;
}
\`\`\`

\`\`\`python
# Python 代码
def greet(name):
    return f"Hello, {name}!"
\`\`\`

\`\`\`diff
+ 新增的行
- 删除的行
  未修改的行
\`\`\`

### 代码块行高亮

在语言后添加 \`{行号}\` 高亮指定行：

\`\`\`js{2}
const a = 1
const b = 2  // 这行会被高亮
const c = 3
\`\`\`

高亮多行（用逗号或范围）：

\`\`\`js{1,3-4}
const a = 1  // 高亮
const b = 2
const c = 3  // 高亮（范围起始）
const d = 4  // 高亮（范围结束）
const e = 5
\`\`\`

### 导入代码片段

使用 \`<<<\` 导入外部文件内容作为代码块：

\`\`\`md
<<< @/snippets/example.js
<<< @/snippets/example.js#snippet  {js}
\`\`\`

> 导入路径相对于项目根目录。\`#snippet\` 可只导入文件中 \`//#region snippet\` 与 \`//#endregion\` 之间的内容。

### 代码组（code-group）

在多个代码块之间切换：

::: code-group

\`\`\`js [config.js]
export default { title: 'My Blog' }
\`\`\`

\`\`\`ts [config.ts]
export default defineConfig({ title: 'My Blog' })
\`\`\`

\`\`\`json [package.json]
{ "name": "my-blog" }
\`\`\`

:::

### 代码组图标

主题集成 \`vitepress-plugin-group-icons\`，在代码组标签名中添加图标：

::: code-group

\`\`\`bash [pnpm]
pnpm install
\`\`\`

\`\`\`bash [yarn]
yarn install
\`\`\`

\`\`\`bash [npm]
npm install
\`\`\`

:::

> 代码组标签会自动匹配常见包管理器、框架图标。自定义图标请在 \`groupIconConfig.json\` 中配置。

### 组件 Demo

主题集成 \`vitepress-demo-plugin\`，可在 Markdown 中嵌入可交互的 Vue 组件 Demo：

\`\`\`md
::: demo

\`<template>
  <button @click="count++">点击 {{ count }} 次</button>
</template>

\`<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

:::
\`\`\`

> Demo 组件文件默认放在 \`posts/components/\` 目录下，也可通过 \`defineConfig\` 的 \`demoDir\` 选项自定义。

## 七、表格

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | — | 文章标题 |
| date | string | — | 发布日期 |
| tags | string[] | [] | 标签数组 |
| cover | string | — | 封面图片路径 |
| top | boolean | false | 是否置顶 |
| recommend | boolean | false | 是否推荐 |

表格内支持行内格式：**粗体**、\`代码\`、[链接](/)。

## 八、链接

### 普通链接

[内部链接](/pages/about)  
[外部链接](https://vitepress.dev)  
[带标题的链接](https://vitepress.dev "VitePress 官网")

### 自动链接

裸 URL 自动转为链接：<https://vitepress.dev>

### 引用式链接

[引用式链接][ref-id]

[ref-id]: https://vitepress.dev

## 九、图片

![占位图片](/images/cover.svg)

> 主题已启用图片灯箱（Fancybox），点击图片可放大查看。图片自动懒加载。

带 caption 的图片（通过 alt 文本显示在图片下方）：

![这是图片说明文字](/images/cover.svg)

## 十、分割线

---

以上是分割线。

## 十一、Emoji 表情

支持 GitHub 风格 Emoji 短码：

:tada: :rocket: :100: :sparkles: :heart: :thumbsup: :bulb: :warning: :bookmark: :fire:

> 完整列表见 [Emoji 速查表](https://github.com/markdown-it/markdown-it/blob/master/lib/index.js#L8)

## 十二、目录

在文中插入自动生成的目录（\`[[toc]]\`）：

[[toc]]

> 目录深度由 \`markdown.toc.level\` 控制，本主题设置为 \`[1, 2, 3, 4]\`。

## 十三、数学公式

主题已启用 MathJax3 渲染数学公式。

### 行内公式

质能方程 $E = mc^2$，欧拉公式 $e^{i\\pi} + 1 = 0$。

### 块级公式

$$
\\frac{n!}{k!(n-k)!} = \\binom{n}{k}
$$

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

$$
\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}
$$

## 十四、VitePress 内置容器

### info 信息

::: info 信息
这是一个信息容器，用于展示提示信息。
:::

### tip 提示

::: tip 提示
这是一个提示容器，用于给出建议。
:::

### warning 警告

::: warning 警告
这是一个警告容器，用于提醒注意事项。
:::

### danger 危险

::: danger 危险
这是一个危险容器，用于强调严重问题。
:::

### details 详情

::: details 点击展开详情
这是一个可折叠的详情容器，默认收起，点击展开。

支持 **Markdown** 格式内容。
:::

### 自定义标题

::: tip 我的自定义提示标题
容器标题可自定义，替换默认的类型名。
:::

## 十五、徽标 Badge

使用 VitePress 内置 \`<Badge>\` 组件为文字添加彩色标签：

- Vue <Badge type="info" text="3.x" />
- VitePress <Badge type="tip" text="推荐" />
- 主题 <Badge type="warning" text="Beta" />
- 已弃用 <Badge type="danger" text="Deprecated" />

## 十六、标签页 Tabs

使用 \`:::tabs\` 容器创建可切换的标签页：

::: tabs
== tab 第一个
标签页内容 A

支持 **Markdown** 格式。

== tab 第二个
标签页内容 B

\`\`\`js
console.log('tab B')
\`\`\`

== tab 第三个
标签页内容 C
:::

## 十七、时间线 Timeline

使用 \`::: timeline\` 容器创建时间线区块：

::: timeline 我的建站历程
- 2024-01-01 ：开始搭建个人博客
- 2024-03-15 ：完成主题开发
- 2024-06-01 ：正式上线
- 2024-09-20 ：发布首个正式版
:::

## 十八、单选点 Radio

使用 \`::: radio\` 容器创建带圆点的列表项，支持勾选状态：

::: radio checked
已完成的功能
:::

::: radio
待开发功能
:::

## 十九、按钮容器 Button

使用 \`::: button\` 容器创建按钮样式：

::: button primary
主要按钮
:::

::: button
普通按钮
:::

## 二十、卡片容器 Card

使用 \`::: card\` 容器创建卡片区块：

::: card
这是一个卡片容器，可以放置任意 Markdown 内容。

支持 **粗体**、*斜体*、\`代码\` 等格式。

| 字段 | 值 |
|------|----|
| 名称 | 测试 |
:::

## 二十一、按键块 Keybutton

使用 \`%%按键名%%\` 语法创建键盘按键样式：

按 %%Ctrl%% + %%C%% 复制，按 %%Ctrl%% + %%V%% 粘贴。  
快捷键 %%Cmd%% + %%K%% 打开搜索。  
%%Enter%% 确认，%%Esc%% 取消。

## 二十二、属性语法 markdown-it-attrs

为元素添加 CSS 类名、ID 或任意属性：

段落带类名 {.text-center}

段落带 ID {#my-paragraph}

[带类名的链接](https://vitepress.dev){.custom-link target=_blank}

![带类名的图片](/images/cover.svg){.rounded}

带多个属性 {class="highlight" id="sec1" data-value="42"}

## 二十三、在 Markdown 中使用 Vue

VitePress 支持在 Markdown 中直接使用 Vue 模板语法与组件。

### Vue 插值

当前日期：\{{ new Date().toLocaleDateString() \}}

1 + 1 = \{{ 1 + 1 \}}

### Vue 指令

\`<span v-for="i in 3">{{ i }} </span>\` 渲染为：
<span v-for="i in 3">{{ i }} </span>

### script setup

\`\`\`vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

## 计数器

当前值：\{{ count \}}，两倍：\{{ doubled \}}

<button @click="count++">+1</button>
\`\`\`

### 使用 VitePress 内置组件

\`\`\`vue
<ClientOnly>
  <div>这段内容仅在客户端渲染</div>
</ClientOnly>
\`\`\`

### 使用主题组件

\`\`\`vue
<script setup>
import { Badge } from 'vitepress'
// 或使用主题导出的组件
// import { ComponentName } from 'vitepress-theme-ninc/components'
</script>

<Badge type="tip" text="在 Markdown 中使用" />
\`\`\`

## 二十四、转义字符

使用反斜杠转义 Markdown 特殊字符：

\\\\\\* 不是斜体  
\\\\\\# 不是标题  
\\\\\\[ 不是链接  
\\\\\\\` 不是代码

## 二十五、Frontmatter 字段速查

\`\`\`yaml
---
title: 文章标题              # 必填，文章标题
date: 2024-01-01             # 必填，发布日期（YYYY-MM-DD）
tags: [标签1, 标签2]          # 标签数组
categories: [分类名]          # 分类数组
description: 文章描述          # 显示在列表和搜索引擎中
cover: https://blog.ninc.top/images/cover/003405.jpeg      # 封面图片路径
top: true                     # 置顶文章（排在列表最前）
recommend: true               # 推荐文章（排在置顶之后、普通文章之前）
aside: false                  # 是否显示侧边栏（true 显示，false 隐藏）
card: true                    # 是否使用卡片布局
comment: true                 # 是否启用评论
padding: false                # 是否启用页面内边距
# 文章加密
crypto:
  enable: true
  password: '你的密码'
---
\`\`\`

## 语法速查表

| 语法 | 用途 | 示例 |
|------|------|------|
| \`**粗体**\` | 加粗 | **粗体** |
| \`*斜体*\` | 斜体 | *斜体* |
| \`\`~~删除~~\`\` | 删除线 | ~~删除~~ |
| \`\`==高亮==\`\` | 高亮 | ==高亮== |
| \`\`~下标~\`\` | 下标 | H~2~O |
| \`\`^上标^\`\` | 上标 | 2^10^ |
| \`\`[文字](url)\`\` | 链接 | [链接](/) |
| \`\`![alt](url)\`\` | 图片 | — |
| \`\`> 引用\`\` | 引用块 | — |
| \`\`- 列表\`\` | 无序列表 | — |
| \`\`1. 列表\`\` | 有序列表 | — |
| \`\`- [x]\`\` | 任务列表 | — |
| \`\`\\\`代码\\\`\`\` | 行内代码 | — |
| \`\`\\\`\\\`\\\`lang\`\` | 代码块 | — |
| \`\`\\\`\\\`\\\`lang{1,3-5}\`\` | 行高亮 | — |
| \`\`<<< @/file\`\` | 导入代码 | — |
| \`\`::: code-group\`\` | 代码组 | — |
| \`\`::: tip\`\` | 提示容器 | — |
| \`\`::: details\`\` | 详情容器 | — |
| \`\`<Badge />\`\` | 徽标 | — |
| \`\`::: tabs\`\` | 标签页 | — |
| \`\`::: timeline\`\` | 时间线 | — |
| \`\`::: radio\`\` | 单选点 | — |
| \`\`::: button\`\` | 按钮 | — |
| \`\`::: card\`\` | 卡片 | — |
| \`\`%%按键%%\`\` | 按键块 | — |
| \`\`{.class}\`\` | 属性 | — |
| \`\`[[toc]]\`\` | 目录 | — |
| \`\`$公式$\`\` | 行内公式 | — |
| \`\`$$公式$$\`\` | 块级公式 | — |
| \`\`:emoji:\`\` | Emoji | — |
| \`> [!NOTE]\`\` | GitHub 提醒 | — |
| \`\`{{ 表达式 }}\`\` | Vue 插值 | — |

---

::: tip 📚 完整文档
更多语法细节、组件用法、写作指南请查阅主题官方文档：<https://theme.ninc.top>
:::
`
}

function tplRecommendedPost(cfg) {
  const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
  return `---
title: ${cfg.title} 的功能特性一览
tags: [功能, 介绍]
categories: [随笔笔记]
date: ${lastWeek}
recommend: true
description: 了解 vitepress-theme-ninc 主题的丰富功能：暗色模式、文章加密、RSS、PWA、评论、搜索等。
---

# ${cfg.title} 的功能特性一览

这是一篇**推荐文章**（\`recommend: true\`），会排在置顶文章之后、普通文章之前。

## 核心功能

### 暗色模式

主题内置暗色模式切换，点击导航栏的太阳/月亮图标即可切换。切换动画使用 View Transitions API，体验丝滑。

### 文章系统

- 支持 Markdown 编写
- 自动生成文章列表、分类页、标签页
- 支持置顶 (\`top: true\`) 和推荐 (\`recommend: true\`)
- 自动统计字数、阅读时间、图片数量
- 支持文章封面、分类、标签
- 支持下一篇、相关文章推荐

### RSS 订阅

构建时自动生成 \`rss.xml\`，读者可以通过 RSS 阅读器订阅你的博客。

### Sitemap

构建时自动生成 \`sitemap.xml\`，帮助搜索引擎索引你的站点。

### PWA 离线缓存

支持 PWA，安装后可离线访问已缓存的页面。

### 评论系统

支持 Twikoo 评论系统，配置 \`comment.twikoo.envId\` 即可启用。

### 文章加密

在 frontmatter 中添加 \`crypto: { enable: true, password: '密码' }\` 即可创建加密文章。

### 外链中转

外部链接自动通过中转页面跳转，防止权重流失。

### 图片灯箱

点击图片自动放大查看，支持键盘导航和触摸滑动。

## 页面一览

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | \`/\` | 文章列表 |
| 全部文章 | \`/pages/archives\` | 按时间归档 |
| 全部分类 | \`/pages/categories\` | 分类总览 |
| 全部标签 | \`/pages/tags\` | 标签云 |
| 留言板 | \`/pages/comments\` | 站点留言 |
| 赞赏名单 | \`/pages/thanks\` | 赞赏者名单 |
| 关于本站 | \`/pages/about\` | 站点介绍 |

---

::: tip 📚 完整文档
更多功能介绍、配置项、组件用法请查阅主题官方文档：<https://theme.ninc.top>
:::
`
}

// ============== 页面文件模板 ==============

function tplAboutMd() {
  return `---
title: 关于本站
aside: false
---

<script setup>
import { About } from 'vitepress-theme-ninc/views'
</script>

<About />
`
}

function tplCommentsMd() {
  return `---
title: 留言板
aside: true
card: false
comment: true
---

<script setup>
import { CommentsView } from 'vitepress-theme-ninc/views'
</script>

<CommentsView />
`
}

function tplPrivacyMd() {
  return `---
title: 隐私政策
aside: false
card: true
---

# 隐私政策

**更新日期：${new Date().toISOString().slice(0, 10)}**

欢迎来到本站。本站非常重视您的隐私和个人信息保护。您在使用网站时，本站可能会收集和使用您的相关信息。通过本页面向您说明在您访问本站时，本站是如何收集、使用、保存、共享和转让这些信息的。

## 信息收集与使用

### 在您访问时

本站可能通过以下方式收集访问信息（不限于）：

- **网络身份标识信息**（浏览器 UA、IP 地址等）
- **设备信息**（设备型号、设备操作系统等）
- **浏览过程**（操作方式、浏览方式与时长、性能与网络加载情况等）
- **地理位置**：根据 IP 地址推算的省份/城市（精确到省级）

> 如启用了站点统计（如 51la、百度统计），相关第三方会按其隐私政策收集访问信息，详情请参考对应服务的隐私协议。

### 在您评论时

如启用评论系统，评论采用无登陆系统的匿名评论机制，您可以自愿填写真实或虚构的信息作为评论展示信息。建议您填写真实邮箱以便收到回复（**您的邮箱信息不会被公开**）。

评论时可能额外收集：

- **邮箱**：用于回复通知（不会公开）
- **网址**：用于点击头像跳转
- **IP 地址**：作为反垃圾判别依据（不会公开 IP，可能公开 IP 所在城市）
- **浏览器代理**：用于展示系统/浏览器版本

### Cookie 与本地存储

本站为实现深色模式切换、个性化配置、评论等功能，会在您的浏览器中进行本地存储。您可以随时清除浏览器中保存的所有 Cookies 与 LocalStorage，不会影响正常使用。

## 信息的分享和披露

本站不会出售、交易或出租您的个人身份信息给外部的公司或个人，除非得到您的许可、需要遵从法律要求、保护本站的权利和财产或在紧急情况下保护个人安全。

## 第三方网站

本站可能包含链接到其他网站。本站不对这些第三方网站的隐私政策或内容负责，请您在离开本站访问其他网站时阅读其隐私政策。

## 安全性

本站采取适当的安全措施，以保护存储在本站系统中的个人信息不受未经授权的访问或泄露。若您是未成年人，请在监护人指导下使用服务。

## 隐私政策的变更

本站保留随时更新或更改本隐私政策的权利。本隐私政策最新的修订日期将会在本页顶部显示。

## 联系本站

如果您对本隐私政策有任何疑问，请通过以下方式与本站取得联系：

- **邮箱**：[请替换为您的邮箱](mailto:your-email@example.com)
- **评论系统**：通过任意文章评论区留言（注明"隐私咨询"）
`
}

function tplCcMd() {
  return `---
title: 版权协议
aside: false
card: true
---

# 版权协议

本站所有原创内容均采用 **[知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh)**（简称 CC BY-NC-SA 4.0）进行许可。

---

## 一、适用范围

1. **适用对象**：本站所有标注「原创」标识的文章、图片、图表等创作内容。
2. **标识说明**：原创内容在文章顶部和结尾处均带有「本文采用 CC BY-NC-SA 4.0 协议」标识及协议链接。

---

## 二、用户权利

在遵守本协议的前提下，您可行使以下权利：

| 权利类型 | 具体说明 |
| --- | --- |
| **复制与传播** | 通过任何媒介无限制地复制、分享完整内容 |
| **非商业使用** | 用于个人学习、教学演示、内部参考等非盈利场景 |
| **片段引用** | 摘录不超过原文 20% 的内容（需明确标注出处） |

---

## 三、用户义务

### 3.1 署名要求

- **位置要求**：在转载内容起始位置或显著位置标注来源
- **格式规范**：需包含「原文标题」+「带超链接的原文地址」，示例：
  \`本文转载自《文章标题》（[https://example.com/path](https://example.com/path)）\`

### 3.2 共享要求

协议继承：所有衍生作品必须：

- 采用相同的 CC BY-NC-SA 4.0 协议发布
- 明确标注修改痕迹（如"改编自 XXX"）

### 3.3 禁止行为

以下行为构成侵权：

- 🔞 **商业性使用**：包括但不限于在转载页面插入广告、通过付费墙限制访问、用于商业培训等盈利场景
- ⚠️ **技术规避**：禁止去除文章版权标识、屏蔽反爬虫机制、篡改文章元数据

---

## 四、侵权处理

发现侵权行为时，请通过以下方式告知：

- **投诉邮箱**：[请替换为您的邮箱](mailto:your-email@example.com)

---

## 五、协议变更

1. 修订版本将在本站公告栏公示 7 日
2. 重大变更将通过邮件通知已授权合作伙伴
3. 继续使用本站内容视为接受修订后的协议

---

## 六、法律适用

1. 本协议解释权归本站所有
2. 争议解决适用中华人民共和国法律
3. 诉讼管辖地为本站服务器所在地人民法院

---

**提示**：本协议是 CC BY-NC-SA 4.0 的补充说明，若内容冲突以 CC 协议条款为准。
`
}

function tplCookiesMd() {
  const today = new Date().toISOString().slice(0, 10)
  return `---
title: Cookies
aside: false
card: true
---

# Cookies 政策

**本政策的最近更新日期为：${today}**

为了确保网站的可靠性、安全性和个性化，本站使用 Cookies。当你接受 Cookies 时，这有助于通过识别你的身份、记住你的偏好或提供个性化用户体验来帮助我改善网站。

本政策应与[隐私政策](/pages/privacy)一起阅读，该隐私政策解释了本站如何使用个人信息。

如果你想管理你的 Cookies，请按照下面"如何管理 Cookies"部分中的说明进行操作。

## 什么是 Cookies？

Cookies 是一种小型文本文件，当你访问网站时，网站可能会将这些文件放在你的计算机或设备上。Cookies 会帮助网站或其他网站在你下次访问时识别你的设备。网站信标、像素或其他类似文件也可以做同样的事情。本政策中使用术语"Cookies"来指代以这种方式收集信息的所有文件。

Cookies 提供许多功能。例如，它们可以记住你喜欢深色模式还是浅色模式，分析网站的效果。

大多数 Cookies 收集一般信息，例如访问者如何到达和使用本站、使用的设备、互联网协议地址（IP 地址）、正在查看的页面及其大致位置。

## Cookies 的目的

| 用途 | 说明 |
| :--- | :---: |
| 授权 | 访问本站时，可通过 Cookie 提供正确信息，打造个性化的体验 |
| 安全措施 | 通过 Cookie 启用及支持安全功能，监控和防止可疑活动、欺诈性流量 |
| 偏好、功能和服务 | 使用功能性 Cookies 来记住偏好，或保存用户提供的喜好信息 |
| 网站性能、分析和研究 | 用于监控网站性能，识别和解决问题以提供高质量体验 |

## 网站上的第三方 Cookies

本站可能使用属于上述类别的第三方 Cookies，用于：帮助监控流量、识别欺诈或非人为性流量、协助市场调研、改善网站功能、监督版权协议和隐私政策的遵守情况。

| 第三方服务商 | 用途 |
| :--- | :---: |
| 第三方统计 | 用于统计站内访问情况，进行针对性优化 |

## 如何管理 Cookies？

在将 Cookie 放置在你的计算机或设备上之前，系统会显示一个弹出窗口，要求你同意设置这些 Cookie。通过同意放置 Cookies，你可以让本站提供最佳的体验和服务。如果你愿意，可以通过浏览器设置关闭本站的 Cookie 来拒绝同意放置 Cookies；但是，本站的部分功能可能无法完全或按预期运行。

除了本站提供的控件之外，你还可以选择在 Internet 浏览器中启用或禁用 Cookie。大多数互联网浏览器还允许你选择是要禁用所有 Cookie 还是仅禁用第三方 Cookie。默认情况下，大多数互联网浏览器都接受 Cookie，但这可以更改。有关详细信息，请参阅 Internet 浏览器中的帮助菜单或设备随附的文档。

以下链接提供了有关如何在所有主流浏览器中控制 Cookie 的说明：

- [Google Chrome](https://support.google.com/chrome/answer/95647?hl=en)
- [Safari（mac 桌面版）](https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac)
- [Safari（移动版）](https://support.apple.com/en-us/HT201265)
- [火狐浏览器](https://support.mozilla.org/en-US/kb/Cookies-information-websites-store-on-your-computer)
- [Android 浏览器](http://support.google.com/ics/nexus/bin/answer.py?hl=en&answer=2425067)

如你使用其他浏览器，请参阅浏览器制造商提供的文档。

有关 Cookies 以及如何管理 Cookies 的更多信息，请访问：
[wikipedia.org](https://zh.wikipedia.org/wiki/Cookie)、[allaboutcookies.org](https://www.allaboutcookies.org/) 或 [aboutcookies.org](https://www.aboutcookies.org/)

## 更多信息

有关数据处理的更多信息，请参阅[隐私政策](/pages/privacy)。

## 对此 Cookie 政策的更改

本站可能对此 Cookie 政策所做的任何更改都将发布在此页面上。如果更改很重要，会在主页上明确指出该政策已更新。

---

📚 **完整文档**：更多页面配置与法律协议模板说明，请查阅主题官方文档：<https://theme.ninc.top>
`
}

function tplArchivesMd() {
  return `---
title: 全部文章
aside: true
---

<script setup>
import { Archives } from 'vitepress-theme-ninc/views'
</script>

<Archives />
`
}

function tplThanksMd() {
  return `---
title: 赞赏名单
aside: false
---

<script setup>
import { Thanks } from 'vitepress-theme-ninc/views'
</script>

<Thanks />
`
}

function tplCategoriesMd() {
  return `---
title: 全部分类
aside: false
---

<script setup>
import { CatOrTag } from 'vitepress-theme-ninc/views'
</script>

<CatOrTag />
`
}

function tplTagsMd() {
  return `---
title: 全部标签
aside: false
---

<script setup>
import { CatOrTag } from 'vitepress-theme-ninc/views'
</script>

<CatOrTag type="tags" />
`
}

function tplNesMd() {
  return `---
title: NES 模拟器
fullWidth: true
comment: true
description: 在线NES(任天堂红白机)模拟器，小霸王模拟器，支持上传游戏ROM文件和Ms2录像文件。无需下载，直接在浏览器中运行经典NES游戏，并支持TAS录像的播放功能。支持存档/读档、按键配置等实用功能。兼容超级马里奥、魂斗罗、冒险岛、恶魔城、洛克人等经典红白机游戏。
card: false
---

<script setup>
import { NesGame } from 'vitepress-theme-ninc/views'
</script>

<ClientOnly>
    <NesGame />
</ClientOnly>
`
}

function tplCategoryDynamicMd() {
  return `---
title: 分类
aside: false
padding: false
---

<script setup>
import { onMounted } from 'vue'
import { useData } from 'vitepress'
import { Home } from 'vitepress-theme-ninc/views'

const { params, site } = useData()

onMounted(() => {
  document.title = \`分类：\${params.value.name} | \${site.value.title}\`
})
</script>

<Home :showHeader="false" :showCategories="params.name" />
`
}

function tplCategoryPathsMjs() {
  return `import { getAllPosts, getAllCategories } from 'vitepress-theme-ninc/utils'

const postData = await getAllPosts()
const categoriesData = getAllCategories(postData)

export default {
  paths() {
    return Object.keys(categoriesData).map(key => ({
      params: { name: key.toString() }
    }))
  }
}
`
}

function tplTagDynamicMd() {
  return `---
title: 标签
aside: false
padding: false
---

<script setup>
import { onMounted } from 'vue'
import { useData } from 'vitepress'
import { Home } from 'vitepress-theme-ninc/views'

const { params, site } = useData()

onMounted(() => {
  document.title = \`标签：\${params.value.name} | \${site.value.title}\`
})
</script>

<Home :showHeader="false" :showTags="params.name" />
`
}

function tplTagPathsMjs() {
  return `import { getAllPosts, getAllType } from 'vitepress-theme-ninc/utils'

const postData = await getAllPosts()
const tagsData = getAllType(postData)

// 标签动态路由
export default {
  paths() {
    return Object.keys(tagsData).map(key => ({
      params: { name: key.toString() }
    }))
  }
}
`
}

// ============== 分页文件模板 ==============

function tplPageIndexMd() {
  return `---
title: 正在重定向
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()

onMounted(() => router.go('/'))
</script>
`
}

function tplPageNumMd() {
  return `---
aside: false
padding: false
---

<script setup>
import { useData } from 'vitepress'
import { Home } from 'vitepress-theme-ninc/views'

const { params } = useData()
</script>

<Home :showHeader="false" :page="Number(params.num)" />
`
}

function tplPageNumPathsMjs() {
  return `import { getAllPosts } from 'vitepress-theme-ninc/utils'
import { themeConfig } from '../.vitepress/themeConfig.ts'

const postData = await getAllPosts()
const postsPerPage = themeConfig.postSize
const totalPages = Math.ceil(postData.length / postsPerPage)

export default {
  paths() {
    const pages = []
    for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
      pages.push({ params: { num: pageNum.toString() } })
    }
    return pages
  }
}
`
}

// ============== package.json 模板 ==============

function tplPackageJson(cfg) {
  // 用站点标题生成 npm 包名（小写、连字符、去特殊字符）
  const slug = cfg.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'my-blog'

  const pkg = {
    name: slug,
    version: '1.0.27',
    description: cfg.description,
    type: 'module',
    scripts: {
      dev: 'vitepress dev',
      build: 'vitepress build',
      preview: 'vitepress preview',
      // 主题 CLI：pnpm run summary 预生成 AI 摘要，pnpm run init-proxy 生成运行时代理脚手架
      summary: 'vitepress-theme-ninc summary',
      'init-proxy': 'vitepress-theme-ninc init-proxy'
    },
    dependencies: {
      vitepress: '^1.6.4',
      vue: '^3.5.0',
      'vitepress-theme-ninc': '^1.0.23'
    }
  }

  return JSON.stringify(pkg, null, 2) + '\n'
}

// ============== SVG 占位图模板 ==============

function tplAvatarSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <rect width="128" height="128" rx="32" fill="#42b883"/>
  <text x="64" y="82" font-size="64" text-anchor="middle" fill="#fff" font-family="system-ui,sans-serif">A</text>
</svg>
`
}

function tplLogoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <rect width="128" height="128" rx="32" fill="#42b883"/>
  <text x="64" y="82" font-size="64" text-anchor="middle" fill="#fff" font-family="system-ui,sans-serif">L</text>
</svg>
`
}

function tplCoverSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#42b883"/>
      <stop offset="1" stop-color="#35495e"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="600" y="340" font-size="72" text-anchor="middle" fill="#fff" font-family="system-ui,sans-serif">vitepress-theme-ninc</text>
</svg>
`
}

// ============== 主流程 ==============

/** 打印后续步骤提示（依赖安装 + 启动命令） */
async function printNextSteps() {
  // 检测包管理器：pnpm > yarn > npm
  const mgr = fs.existsSync('pnpm-lock.yaml') ? 'pnpm'
    : fs.existsSync('yarn.lock') ? 'yarn'
    : 'npm'
  const installCmd = mgr === 'pnpm' ? 'pnpm install'
    : mgr === 'yarn' ? 'yarn'
    : 'npm install'
  const devCmd = mgr === 'pnpm' ? 'pnpm dev'
    : mgr === 'yarn' ? 'yarn dev'
    : 'npm run dev'

  clack.note(
    `${installCmd}\n${devCmd}`,
    '下一步'
  )

  clack.outro(pc.green('✨ 初始化完成！') + pc.dim('  文档：https://theme.ninc.top/'))
}

async function main() {
  clack.intro(pc.cyan(pc.bold(' vitepress-theme-ninc init ')))

  // 检测当前目录
  const isVpRoot = detectVitePressRoot()
  if (isVpRoot) {
    clack.log.warn('检测到当前目录已有 VitePress 配置，已存在文件会询问覆盖')
  }

  // 1. 选择配置模式：基础博客 vs 极简
  const mode = await select('请选择初始化模式', [
    {
      value: 'basic',
      label: '基础博客配置',
      desc: '生成完整博客站点（页面、示例文章、占位图），开箱即用'
    },
    {
      value: 'minimal',
      label: '极简配置',
      desc: '仅生成可运行的核心文件，配置项最少，适合从零搭建'
    }
  ], 0)

  // ─────────────────────────────────────────────────────
  // 极简模式：只生成核心配置 + 占位图片，并给出文档提醒
  // ─────────────────────────────────────────────────────
  if (mode === 'minimal') {
    const title = await question('站点标题', '我的博客')
    const description = await question('站点描述', '博主的小站')
    const site = await question('站点 URL', 'https://example.com')
    const author = await question('作者名称', '博主')
    const email = await question('作者邮箱', 'blog@example.com')

    // 用 note 展示极简配置提醒
    clack.note(
      '极简配置只保证项目可运行，\n后续配置（导航栏、页脚、侧边栏、评论、关于页等）\n需要参考官方文档逐条添加：\n\n  https://theme.ninc.top/guide/configuration',
      '提醒'
    )

    const cfg = { title, description, site, author, email, pwa: false, comment: false, twikooEnvId: '', nes: false }

    clack.log.step('生成文件')

    clack.log.message(pc.dim('核心配置'))
    await writeFile('package.json', tplPackageJson(cfg))
    await writeFile('index.md', tplIndexMd(cfg))
    await writeFile('.vitepress/config.mts', tplConfigMts(cfg))
    await writeFile('.vitepress/theme/index.ts', tplThemeIndex())
    await writeFile('.vitepress/themeConfig.ts', tplThemeConfigMinimal(cfg))

    clack.log.message(pc.dim('占位图片'))
    await writeFile('public/images/avatar.svg', tplAvatarSvg(), true)
    await writeFile('public/images/logo.svg', tplLogoSvg(), true)
    await writeFile('public/images/cover.svg', tplCoverSvg(), true)
    await writeFile('public/favicon.svg', tplLogoSvg(), true)

    await printNextSteps()
    return
  }

  // ─────────────────────────────────────────────────────
  // 基础博客模式：选择 默认配置 / 自定义配置
  // ─────────────────────────────────────────────────────
  const configMode = await select('请选择配置方式', [
    {
      value: 'default',
      label: '使用默认配置',
      desc: '采用合理默认值，仅需填写基础信息，快速生成'
    },
    {
      value: 'custom',
      label: '自定义配置',
      desc: '逐项询问功能开关与页面生成，灵活定制'
    }
  ], 0)

  // 收集基础信息（两种方式都需要）
  const title = await question('站点标题', '我的博客')
  const description = await question('站点描述', '博主的小站')
  const site = await question('站点 URL（用于 sitemap/RSS）', 'https://example.com')
  const author = await question('作者名称', '博主')
  const email = await question('作者邮箱', 'blog@example.com')

  // 功能选项与页面开关
  let pwa = false
  let comment = false
  let twikooEnvId = ''
  let createSample = true
  let enableAboutPage = true
  let enableCommentsPage = true
  let enableArchivesPage = true
  let enableCategoriesPage = true
  let enableTagsPage = true
  let enableThanksPage = true
  let enableNesPage = true

  if (configMode === 'custom') {
    // 功能开关
    pwa = await confirm('启用 PWA（离线缓存）？', false)
    comment = await confirm('启用评论系统（Twikoo）？', false)
    if (comment) {
      twikooEnvId = await question('Twikoo envId（部署地址）', 'https://your-twikoo.example.com')
    }

    // 页面生成（多选）
    const pages = await multiselect('选择要生成的页面（空格切换，回车确认）', [
      { value: 'about', label: '关于本站', desc: '/pages/about' },
      { value: 'comments', label: '留言板', desc: '/pages/comments' },
      { value: 'archives', label: '全部文章', desc: '/pages/archives' },
      { value: 'tags', label: '全部标签', desc: '/pages/tags（含动态路由）' },
      { value: 'thanks', label: '赞赏名单', desc: '/pages/thanks' },
      { value: 'nes', label: 'NES 模拟器', desc: '/pages/nes（自带超级马里奥）' },
    ])
    enableAboutPage = pages.includes('about')
    enableCommentsPage = pages.includes('comments')
    enableArchivesPage = pages.includes('archives')
    enableCategoriesPage = true  // 分类页面始终生成（专栏菜单依赖此页面）
    enableTagsPage = pages.includes('tags')
    enableThanksPage = pages.includes('thanks')
    enableNesPage = pages.includes('nes')

    // 示例文章
    createSample = await confirm('创建示例文章（含 Markdown 语法完全指南）？', true)
  } else {
    clack.log.info('采用默认配置：PWA=否，评论=否，生成所有页面与示例文章')
  }

  const cfg = { title, description, site, author, email, pwa, comment, twikooEnvId, nes: enableNesPage }

  // 2. 生成文件
  clack.log.step('生成文件')

  // 核心配置文件（始终生成）
  clack.log.message(pc.dim('核心配置'))
  await writeFile('package.json', tplPackageJson(cfg))
  await writeFile('index.md', tplIndexMd(cfg))
  await writeFile('.vitepress/config.mts', tplConfigMts(cfg))
  await writeFile('.vitepress/theme/index.ts', tplThemeIndex())
  await writeFile('.vitepress/themeConfig.ts', tplThemeConfig(cfg))

  // 基础页面（按用户选择生成）
  if (enableAboutPage || enableCommentsPage || enableArchivesPage || enableCategoriesPage || enableTagsPage || enableThanksPage) {
    clack.log.message(pc.dim('基础页面'))
  }
  if (enableAboutPage) await writeFile('pages/about.md', tplAboutMd())
  if (enableCommentsPage) await writeFile('pages/comments.md', tplCommentsMd())
  if (enableArchivesPage) await writeFile('pages/archives.md', tplArchivesMd())
  if (enableThanksPage) await writeFile('pages/thanks.md', tplThanksMd())

  // 隐私政策、版权协议与 Cookie 政策（始终生成，主题 RightMenu / Comments 等组件硬编码引用了 /pages/privacy 与 /pages/cc）
  clack.log.message(pc.dim('隐私政策 / 版权协议 / Cookie 政策'))
  await writeFile('pages/privacy.md', tplPrivacyMd(), true)
  await writeFile('pages/cc.md', tplCcMd(), true)
  await writeFile('pages/cookies.md', tplCookiesMd(), true)

  // 分类 / 标签动态路由（页面 + paths.mjs 配套生成）
  if (enableCategoriesPage) {
    await writeFile('pages/categories.md', tplCategoriesMd())
    await writeFile('pages/categories/[name].md', tplCategoryDynamicMd())
    await writeFile('pages/categories/[name].paths.mjs', tplCategoryPathsMjs())
  }
  if (enableTagsPage) {
    await writeFile('pages/tags.md', tplTagsMd())
    await writeFile('pages/tags/[name].md', tplTagDynamicMd())
    await writeFile('pages/tags/[name].paths.mjs', tplTagPathsMjs())
  }

  // NES 模拟器页面 + 自带超级马里奥 ROM（按用户选择生成）
  if (enableNesPage) {
    clack.log.message(pc.dim('NES 模拟器'))
    await writeFile('pages/nes.md', tplNesMd())
    // 复制自带超级马里奥 ROM 到用户项目的 public/nes-rom/
    const romDir = path.join(__dirname, 'templates', 'nes-rom')
    if (fs.existsSync(romDir)) {
      fs.mkdirSync('public/nes-rom', { recursive: true })
      for (const file of fs.readdirSync(romDir)) {
        if (file.endsWith('.nes')) {
          fs.copyFileSync(path.join(romDir, file), path.join('public', 'nes-rom', file))
          console.log(pc.green('  ✓') + pc.dim(` public/nes-rom/${file}`))
        }
      }
    }
  }

  // 文章分页（始终生成，分页是首页文章列表所必需的）
  clack.log.message(pc.dim('文章分页'))
  await writeFile('page/index.md', tplPageIndexMd())
  await writeFile('page/[num].md', tplPageNumMd())
  await writeFile('page/[num].paths.mjs', tplPageNumPathsMjs())

  // 占位图片（始终生成，避免封面 / 头像 / Logo 404）
  clack.log.message(pc.dim('占位图片'))
  await writeFile('public/images/avatar.svg', tplAvatarSvg(), true)
  await writeFile('public/images/logo.svg', tplLogoSvg(), true)
  await writeFile('public/images/cover.svg', tplCoverSvg(), true)
  await writeFile('public/favicon.svg', tplLogoSvg(), true)

  // 示例文章（可选）
  if (createSample) {
    clack.log.message(pc.dim('示例文章'))
    await writeFile('posts/articles/welcome.md', tplPinnedPost(cfg))
    await writeFile('posts/articles/markdown-guide.md', tplMarkdownGuide(cfg))
    await writeFile('posts/articles/features.md', tplRecommendedPost(cfg))
  }

  await printNextSteps()
}

// ============== 子命令分发 ==============

const command = process.argv[2] || 'init'

if (command === 'summary') {
  const { runSummary } = await import('./summary.mjs')
  runSummary().catch(err => {
    console.error(pc.red('\n  ✗ 摘要生成失败：'), err)
    process.exit(1)
  })
} else if (command === 'init-proxy') {
  const { runProxy } = await import('./init-proxy.mjs')
  runProxy().catch(err => {
    console.error(pc.red('\n  ✗ 代理脚手架生成失败：'), err)
    process.exit(1)
  })
} else {
  if (command !== 'init') {
    console.log(pc.yellow(`  未知命令 "${command}"，可用命令：init / summary / init-proxy，按 init 处理\n`))
  }
  main().catch(err => {
    console.error(pc.red('\n  ✗ 初始化失败：'), err)
    process.exit(1)
  })
}
