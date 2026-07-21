// 文档站配置
// 使用 VitePress 默认主题（不引入 vitepress-theme-ninc），保持文档独立性
import { defineConfig } from 'vitepress'
import { groupIconVitePlugin, groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import groupIconConfig from './groupIconConfig.json'
import markdownExtensions from './markdownExtensions.mjs'
import { localIconsPlugin, getLocalIconSVG } from './local-icons'

export default defineConfig({
  title: 'vitepress-theme-ninc',
  description: '一个功能丰富的 VitePress 主题 - 开箱即用的博客、文档与工具站',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  sitemap: { hostname: 'https://theme.ninc.top' },
  head: [
    // favicon
    ['link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],
    // 防盗链
    ['meta', { name: 'referrer', content: 'no-referrer' }],

    // ── 网站验证（保持已验证状态，请勿移除）──
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { name: 'msvalidate.01', content: 'B5E748CCE4066C5BC620DF47B8B7CFD0' }],             // Bing
    ['meta', { name: 'google-site-verification', content: 'j5zzxqII7Tz7FHIGA57uuNbAcjls-rbtYAXwAjS0i6g' }], // Google
    ['meta', { name: 'baidu-site-verification', content: 'codeva-M50ML3mOpG' }],                  // 百度
    ['meta', { name: 'sogou_site_verification', content: '2NhJVhps8H' }],                         // 搜狗
    ['meta', { name: '360-site-verification', content: '808df229eb8394536e63072fabaebb03' }],     // 360
    ['meta', { name: 'bytedance-verification-code', content: 'BmHHws52YyxhB8FYI4E3' }],            // 字节跳动

    // ── SEO 基础标签 ──
    ['meta', { name: 'author', content: '呢喃Ninc' }],
    ['meta', { name: 'description', content: '一个功能丰富的 VitePress 主题 - 开箱即用的博客、文档与工具站' }],
    ['meta', { name: 'keywords', content: 'VitePress,VitePress 主题,博客主题,博客框架,文档主题,vitepress-theme-ninc,ninc,呢喃' }],

    // ── Open Graph 协议标签（微信/QQ/Facebook/Twitter 分享卡片）──
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'vitepress-theme-ninc' }],
    ['meta', { property: 'og:description', content: '一个功能丰富的 VitePress 主题 - 开箱即用的博客、文档与工具站' }],
    ['meta', { property: 'og:url', content: 'https://theme.ninc.top' }],
    ['meta', { property: 'og:image', content: 'https://theme.ninc.top/images/avatar.jpg' }],
    ['meta', { property: 'og:site_name', content: 'vitepress-theme-ninc' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],

    // ── Twitter 卡片标签 ──
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'vitepress-theme-ninc' }],
    ['meta', { name: 'twitter:description', content: '一个功能丰富的 VitePress 主题 - 开箱即用的博客、文档与工具站' }],
    ['meta', { name: 'twitter:image', content: 'https://theme.ninc.top/images/avatar.jpg' }],

    // ── 移动设备优化 ──
    ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'vitepress-theme-ninc' }],

    // ── 安全策略：自动升级 http → https ──
    ['meta', { httpEquiv: 'Content-Security-Policy', content: 'upgrade-insecure-requests' }],

    // ── 51la 网站统计（异步引入，避免阻塞页面首屏渲染）──
    [
      'script',
      {},
      `!function(p){"use strict";!function(t){var s=window,e=document,i=p,c="".concat("https:"===e.location.protocol?"https:":"http://","sdk.51.la/js-sdk-pro.min.js"),n=e.createElement("script"),r=e.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=c,n.id="LA_COLLECT",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:"3QcVpJx63jNB0VwV",ck:"3QcVpJx63jNB0VwV"});`
    ]
  ],
  vite: {
    plugins: [
      // 本地图标插件：构建时从 @iconify-json/* 提取用到的图标，避免运行时在线请求
      localIconsPlugin(),
      groupIconVitePlugin({ customIcon: groupIconConfig }),
      // 代码定位插件：开发环境下按住 alt+shift 点击页面元素即可在 IDE 中打开对应源码
      codeInspectorPlugin({
        bundler: 'vite'
      })
    ]
  },
  markdown: {
    preConfig(md) {
      md.use(groupIconMdPlugin)
    },
    config(md) {
      markdownExtensions(md)
    }
  },
  themeConfig: {
    siteTitle: 'vitepress-theme-ninc',
    nav: [
      { text: '指南', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: '配置参考', link: '/config/site-meta', activeMatch: '/config/' },
      { text: '组件', link: '/components/overview', activeMatch: '/components/' },
      { text: 'FAQ', link: '/faq' },
      { text: 'GitHub', link: 'https://github.com/zhChuXiao/vitepress-theme-ninc' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
            { text: '快速上手', link: '/guide/quick-start' }
          ]
        },
        {
          text: '核心概念',
          items: [
            { text: '双配置体系', link: '/guide/configuration' },
            { text: '主题配置讲解', link: '/guide/theme-config' },
            { text: '配置导览', link: '/guide/config-tour' },
            { text: 'Frontmatter', link: '/guide/frontmatter' }
          ]
        },
        {
          text: '写作',
          collapsed: false,
          items: [
            { text: '写作工作流', link: '/guide/writing/' },
            { text: '标准文章', link: '/guide/writing/standard' },
            { text: '置顶与推荐', link: '/guide/writing/pinned' },
            { text: '加密文章', link: '/guide/writing/encrypted' },
            { text: '转载文章', link: '/guide/writing/reprint' },
            { text: '参考资料', link: '/guide/writing/references' },
            { text: '工具页与全宽布局', link: '/guide/writing/tool-page' }
          ]
        },
        {
          text: '内容管理',
          collapsed: false,
          items: [
            { text: '文章目录', link: '/guide/posts' },
            { text: '自定义页面', link: '/guide/pages' },
            {
              text: '静态资源',
              items: [
                { text: '概述', link: '/guide/assets/' },
                { text: '图片资源', link: '/guide/assets/images' },
                { text: 'SVG 雪碧图', link: '/guide/assets/svg' },
                { text: '字体管理', link: '/guide/assets/fonts' },
                { text: 'CDN 与外部资源', link: '/guide/assets/cdn' }
              ]
            }
          ]
        },
        {
          text: 'Markdown 扩展',
          collapsed: false,
          items: [
            { text: '概述', link: '/guide/markdown/' },
            { text: 'VitePress 原生扩展', link: '/guide/markdown/native' },
            { text: '主题容器', link: '/guide/markdown/containers' },
            { text: '按键标记', link: '/guide/markdown/keybutton' },
            { text: '属性语法', link: '/guide/markdown/attrs' }
          ]
        },
        {
          text: '进阶',
          items: [
            { text: '自定义样式', link: '/guide/custom-styles' },
            { text: '覆盖组件', link: '/guide/override-components' },
            { text: '图标使用指南', link: '/guide/icons' },
            { text: '代码组图标', link: '/guide/code-group-icons' },
            { text: 'NES 模拟器', link: '/guide/nes' },
            { text: 'AI 文章摘要', link: '/guide/ai-summary' },
            { text: 'AI 摘要代理部署', link: '/guide/ai-summary-proxy' },
            { text: 'CLI 命令行工具', link: '/guide/cli' },
            { text: '部署', link: '/guide/deployment' }
          ]
        }
      ],
      '/config/': [
        {
          text: '基础配置',
          items: [
            { text: 'siteMeta 站点信息', link: '/config/site-meta' },
            { text: 'nav 导航栏', link: '/config/nav' },
            { text: 'cover 封面', link: '/config/cover' },
            { text: 'aside 侧边栏', link: '/config/aside' },
            { text: 'footer 页脚', link: '/config/footer' }
          ]
        },
        {
          text: '通用字段',
          items: [
            { text: 'icon 图标字段', link: '/config/icons' }
          ]
        },
        {
          text: '功能配置',
          items: [
            { text: 'comment 评论', link: '/config/comment' },
            { text: 'search 搜索', link: '/config/search' },
            { text: 'aiSummary AI 摘要', link: '/config/ai-summary' },
            { text: 'homeTop 首页顶部', link: '/config/home-top' },
            { text: 'navMore 更多菜单', link: '/config/nav-more' },
            { text: 'navButtons 右侧自定义按钮', link: '/config/nav-buttons' },
            { text: 'about 关于本站', link: '/config/about' }
          ]
        },
        {
          text: '扩展功能',
          items: [
            { text: 'nes NES 模拟器', link: '/config/nes' },
            { text: 'friends 留言板', link: '/config/friends' },
            { text: 'reward 打赏', link: '/config/reward' },
            { text: 'music 音乐', link: '/config/music' },
            { text: 'fancybox 灯箱', link: '/config/fancybox' },
            { text: 'jumpRedirect 外链中转', link: '/config/jump-redirect' },
            { text: 'equipment 装备', link: '/config/equipment' },
            { text: 'tongji 统计', link: '/config/tongji' },
            { text: 'travellings 开往', link: '/config/travellings' },
            { text: 'inject 注入', link: '/config/inject' }
          ]
        }
      ],
      '/components/': [
        {
          text: '组件总览',
          items: [{ text: 'Overview', link: '/components/overview' }]
        }
      ],
    },
    socialLinks: [
      // 使用本地 simple-icons 集合中的 GitHub SVG，避免 VitePress 默认主题对 api.iconify.design 的在线请求
      { icon: { svg: getLocalIconSVG('simple-icons', 'github') }, link: 'https://github.com/zhChuXiao/vitepress-theme-ninc' }
    ],
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '清除查询条件',
                backButtonTitle: '返回上一级',
                noResultsText: '无法找到相关结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '输入',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'esc'
                }
              }
            }
          }
        }
      }
    },
    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2023-2026 呢喃Ninc'
    },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdatedText: '最后更新',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    notFound: {
      title: '页面不存在',
      quote: '看起来你访问的页面不存在，或者已经被移动。',
      linkText: '返回首页'
    }
  }
})
