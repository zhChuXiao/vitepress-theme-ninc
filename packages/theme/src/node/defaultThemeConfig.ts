// 默认主题配置 - 已剥离所有个人数据
// 用户通过 defineThemeConfig(...) 传入的配置会与此默认值深合并
import type { ThemeConfig } from '../types/index.ts'

export const defaultThemeConfig: ThemeConfig = {
  // 站点信息
  siteMeta: {
    title: 'My Blog',
    description: 'powered by ninc',
    // 站点头像默认使用主题作者提供的网络图片，开箱即用
    // 替换为自己的头像：把图片放到 public/images/ 下，改为 '/images/your-avatar.jpg'
    avatar: 'http://blog.ninc.top/images/cxLogo/avatar2.jpg',
    logo: '',
    site: 'https://example.com',
    base: '/',
    lang: 'zh-CN',
    author: {
      name: 'Your Name',
      // 作者头像（侧边栏 Clock 中心头像优先使用此字段，未配置时回退到 siteMeta.avatar）
      // 替换方法同上：放到 public/images/ 下，改为 '/images/your-avatar.jpg'
      cover: 'http://blog.ninc.top/images/cxLogo/avatar2.jpg',
      email: 'you@example.com',
      link: ''
    }
  },
  // 首页顶部信息
  homeTop: {
    title: 'Hello, World',
    subtitle: 'powered by ninc',
    link: 'example.com',
    banner: {
      tip: '推荐站点：',
      title: 'Example Site',
      // 推荐站点封面图默认使用主题作者提供的网络图片，开箱即用
      // 替换为自己的图：放到 public/images/ 下，改为 '/images/your-banner.jpg'
      image: 'http://blog.ninc.top/images/cover/003405.jpeg',
      darkImage: '',
      recommendUrl: 'https://example.com/',
      newTab: true
    },
    // 首页顶部快捷分类卡片，由用户在 themeConfig 中提供
    // 注意：defu 对数组是 concat 合并，此处必须为空数组，避免与用户配置重复
    category: [],
    // 技能图标数据（首页顶部 + 关于页面共用，由用户提供）
    // 为空时回退到主题内置的默认数据
    creativity: []
  },
  // 备案信息
  icp: '',
  // 建站日期
  since: '2024-01-01',
  // 每页文章数据
  postSize: 10,
  // 是否开启左下角个性化配置
  settingButton: false,
  // 页面注入
  // 注意：以下所有数组字段均为"内容型"，由用户在 themeConfig 中提供。
  // defu 对数组是 concat 合并（而非覆盖），若此处给默认值会与用户配置拼接导致重复，
  // 因此全部设为空数组。推荐的基础 head 标签（favicon/viewport/SEO 等）请见文档。
  inject: {
    header: []
  },
  // 导航栏菜单（由用户提供）
  nav: [],
  // 导航栏菜单 - 左侧（由用户提供）
  navMore: [],
  // 封面配置
  cover: {
    twoColumns: true,
    showCover: {
      enable: true,
      coverLayout: 'both',
      // 默认封面列表（由用户提供；为空时文章需自行指定 cover）
      defaultCover: []
    }
  },
  // 页脚信息（social/badge/sitemap 均由用户提供）
  footer: {
    social: [],
    badge: [],
    sitemap: []
  },
  // 评论
  comment: {
    enable: false,
    twikoo: {
      envId: '',
      lang: 'zh-CN'
    }
  },
  // 侧边栏
  aside: {
    hello: {
      enable: true,
      text: '欢迎来到我的博客，这里有一些关于<strong>开发</strong>相关的问题和看法。'
    },
    wechat: {
      enable: false,
      face: '',
      back: ''
    },
    welcome: {
      enable: true,
      text1: '👋🏻 Hi，欢迎你！',
      text2: '本站采用 <strong>VitePress</strong> 搭建',
      text3: '使用 vitepress-theme-ninc 主题',
      email: 'you@example.com',
      // 经纬度坐标对 [lng, lat]，由用户提供（为空则不渲染地图）
      address: []
    },
    toc: {
      enable: true
    },
    tags: {
      enable: true
    },
    countDown: {
      enable: false,
      data: {
        name: '示例倒计时',
        date: '2027-01-01'
      }
    },
    siteData: {
      enable: true
    }
  },
  // 友链
  friends: {
    circleOfFriends: '',
    dynamicLink: {
      server: '',
      app_token: '',
      table_id: ''
    },
    comments: {
      title: '留言板',
      author: 'Your Name',
      cover: '',
      // 留言板欢迎语列表，由用户提供
      message: [],
      bottom: '感谢你的留言'
    }
  },
  // 我的装备
  equipment: {},
  // 关于本站
  // 注意：数组字段必须为空 []，由用户在 themeConfig 中提供，否则 defu 合并会拼接导致重复
  about: {
    // 头像两侧技能标签
    avatarSkills: {
      left: [],
      right: []
    },
    // 介绍区域
    hello: {
      text1: '你好，很高兴认识你👋',
      text2: '我是 博主',
      text3: '是一名 前端开发工程师'
    },
    // 追求区域
    pursuit: {
      tips: '信仰',
      title1: '用代码',
      title2: '去构建心中的',
      word: []
    },
    // 技能区域
    skills: {
      tip: '技能',
      title: '开启创造力'
    },
    // 生涯区域
    career: {
      tip: '生涯',
      title: '无限进步',
      list: []
    },
    // 性格区域
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
    motto: {
      tip: '座右铭',
      title1: '以乐观为笔，',
      title2: '绘就多彩生活。'
    },
    // 关注偏好
    preference: {
      image: '',
      color: '#00000022',
      tip: '关注偏好',
      title: '数码科技',
      desc: '手机、电脑及软硬件'
    },
    // 音乐偏好
    musicPreference: {
      image: '',
      color: '#ffffff22',
      tip: '音乐偏好',
      title: '欧美、KPOP、R&B',
      desc: '一起欣赏更多音乐'
    },
    // 数据统计
    statistics: {
      color: '#0f1114',
      image: '',
      tip: '数据',
      title: '访问统计',
      desc: '统计信息来自',
      source: '51la',
      sourceLink: 'https://v6.51.la/'
    },
    // 信息区域
    info: {
      mapImage: '',
      address: '',
      items: []
    }
  },
  // 音乐播放器
  music: {
    enable: false,
    url: 'https://api.injahow.cn/meting/',
    id: '0000000',
    server: 'netease',
    type: 'playlist'
  },
  // 搜索（Algolia）
  search: {
    enable: false,
    appId: '',
    apiKey: '',
    indexName: ''
  },
  // 打赏
  // 注意：list 为内容型数组，defu 会 concat 合并，此处必须为空 []
  rewardData: {
    enable: false,
    wechat: '',
    alipay: '',
    list: []
  },
  // 图片灯箱
  fancybox: {
    enable: true,
    js: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.umd.min.js',
    css: 'https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.min.css'
  },
  // 外链中转
  jumpRedirect: {
    enable: true,
    exclude: [
      'cf-friends-link',
      'upyun',
      'icp',
      'author',
      'rss',
      'cc',
      'power',
      'social-link',
      'link-text',
      'travellings',
      'post-link',
      'report',
      'more-link',
      'skills-item',
      'right-menu-link',
      'link-card'
    ],
    // 域名白名单：安全站点，进入中转页后显示“已信任”并自动跳转（支持通配符 *.xxx）
    whitelist: [
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
    ],
    // 域名黑名单：购物站点，显示危险警告，不自动跳转
    blacklist: ['taobao.com', 'jd.com', 'tmall.com', '1688.com', 'pinduoduo.com', 'amazon.com']
  },
  // AI 文章摘要（默认关闭，关闭时保持 FakeGPT 手动摘要行为）
  aiSummary: {
    enable: false,
    provider: 'custom',
    baseURL: '',
    apiKey: '',
    model: '',
    prompt: '',
    maxInputLength: 2000,
    concurrency: 3,
    timeout: 30000,
    retries: 2,
    force: false,
    buildGenerate: true,
    exclude: [],
    cache: {
      enable: true,
      file: '.vitepress/ai-summary-cache.json'
    },
    runtime: {
      enable: false,
      endpoint: '',
      timeout: 15000,
      fallbackText: 'AI 摘要暂时不可用，请直接阅读正文。'
    },
    logoText: '',
    tip: ''
  },
  // 站点统计
  tongji: {
    busuanzi: {
      enable: true,
      scriptUrl: 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
    }
  },
  // 开往-友链接力按钮（默认关闭，可在 themeConfig 中开启）
  travellings: {
    enable: false,
    url: 'https://www.travellings.cn/go.html'
  },
  // NES 模拟器（/pages/nes 页面）
  // 默认内置超级马里奥，ROM 文件由 init 命令复制到 public/nes-rom/
  nes: {
    roms: [
      {
        id: 'mario',
        url: '/nes-rom/超级马里奥.nes',
        name: '超级玛丽-原版',
        savePrefix: 'mario',
        // 主题内置金手指预设（兼容 VirtuaNES 格式 XXXX-YY-ZZ）
        cheats: [
          { code: '079F-01-09', name: '金身无敌', desc: '碰到敌人不掉血，但掉坑仍然会死' },
          { code: '075A-01-09', name: '9 条命', desc: '生命数锁定为 9' },
          { code: '0756-01-02', name: '能发子弹', desc: '吃蘑菇后可发射火球' },
          { code: '0706-01-FF', name: '跳跃轻松', desc: '跳跃高度大幅提升' },
          { code: '0039-01-03', name: '顶出红蘑菇', desc: '撞砖块固定掉落红蘑菇（变大）' },
          { code: '07FA-01-09', name: '时间不变', desc: '关卡时间锁定' },
          { code: '0791-01-10', name: '刀枪不入', desc: '受伤不掉血' }
        ]
      }
    ],
    defaultRomId: 'mario'
  }
}
