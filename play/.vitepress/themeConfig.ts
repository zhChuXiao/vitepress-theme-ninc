// 主题配置 —— 由 vitepress-theme-ninc init 生成
// 文档：https://theme.ninc.top/guide/configuration
// 所有字段会与主题内置默认值深合并（defu），只需写想改的字段
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  // ━━━ 站点元信息 ━━━
  siteMeta: {
    title: "我的博客",
    description: "博主的小站",
    // 站点头像（侧边栏 Clock 中心头像、关于页头像等共用）
    // 默认使用主题作者提供的网络图片，开箱即用
    // 替换为自己的头像：把图片放到 public/images/ 下，改为 '/images/your-avatar.jpg'
    avatar: 'http://blog.ninc.top/images/cxLogo/avatar2.jpg',
    logo: '/images/logo.svg',
    site: "https://example.com",
    base: '/',
    lang: 'zh-CN',
    author: {
      name: "博主",
      // 作者头像（Clock 中心头像优先使用此字段，未配置时回退到 siteMeta.avatar）
      cover: 'http://blog.ninc.top/images/cxLogo/avatar2.jpg',
      email: "blog@example.com",
      // 作者主页链接（如 GitHub），填写后侧边栏 hello 卡片会显示 GitHub 图标入口；留空则不显示
      link: ''
    }
  },

  // ━━━ 首页顶部区域 ━━━
  homeTop: {
    title: "我的博客",
    subtitle: "博主的小站",
    link: "example.com",
    // 推荐站点卡片（首页顶部右侧大图）
    banner: {
      tip: '推荐站点：',
      title: "我的博客",
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
  since: "2026",
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
      ['meta', { name: 'author', content: "博主" }],
      ['meta', { name: 'description', content: "博主的小站" }],
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
    {
      text: '工具',
      items: [
        { text: 'NES 模拟器', link: '/pages/nes', icon: 'game' }
      ]
    },
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
      { icon: 'email', link: "mailto:blog@example.com" },
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

  // 评论系统（Twikoo）—— 如需启用，将 enable 改为 true 并填写 envId
  comment: {
    enable: false,
    twikoo: {
      envId: '',
      lang: 'zh-CN'
    }
  },

  // ━━━ 侧边栏 ━━━
  aside: {
    // 站点简介
    hello: {
      enable: true,
      text: '欢迎来到 <strong>我的博客</strong>，这里记录我的所思所学。'
    },
    // 欢迎卡片
    welcome: {
      enable: true,
      text1: '👋🏻 Hi，我是 博主，欢迎你！',
      text2: '本站采用 <strong>VitePress</strong> 搭建',
      text3: '主题使用 vitepress-theme-ninc',
      email: "blog@example.com",
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
      data: { name: '示例倒计时', date: '2027-01-01' }
    },
    // 站点数据统计
    siteData: { enable: true }
  },

  // ━━━ 友链 / 留言板 ━━━
  friends: {
    comments: {
      title: '留言板',
      author: "博主",
      cover: 'https://blog.ninc.top/images/cover/003405.jpeg',
      message: ['欢迎光临 我的博客！想聊什么都可以～'],
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
      text2: '我是 博主',
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
