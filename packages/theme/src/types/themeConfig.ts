// 主题配置类型 - 对应 assets/themeConfig.mjs 的所有字段
// 这些类型用于 defineThemeConfig 的参数与返回值，提供 IDE 提示与校验

/** VitePress head 配置项格式 */
export type HeadConfig = [string, Record<string, any>] | [string, Record<string, any>, string]

/** 站点作者信息 */
export interface AuthorInfo {
  name: string
  cover?: string
  email?: string
  link?: string
}

/** 站点元信息 */
export interface SiteMeta {
  /** 站点标题 */
  title: string
  /** 站点描述 */
  description: string
  /** 头像路径 */
  avatar: string
  /** 站点 logo 路径 */
  logo: string
  /** 站点完整地址（用于 SEO、RSS） */
  site: string
  /** VitePress base 路径 */
  base: string
  /** 站点语言 */
  lang: string
  /** 作者信息 */
  author: AuthorInfo
}

/** 首页顶部 banner 配置 */
export interface HomeTopBanner {
  tip: string
  title: string
  image: string
  darkImage?: string
  recommendUrl: string
  newTab?: boolean
}

/** 首页顶部快捷分类项 */
export interface HomeTopCategoryItem {
  name: string
  path: string
  shadow: string
  icon: string
  class: string
}

/** 首页顶部配置 */
export interface HomeTopConfig {
  title: string
  subtitle: string
  link: string
  banner: HomeTopBanner
  category: HomeTopCategoryItem[]
  /** 技能图标数据（首页顶部 + 关于页面共用） */
  creativity: CreativityGroup[]
}

/** 技能图标单项 */
export interface CreativityItem {
  /** 技能名称 */
  name: string
  /** 图标背景色（CSS 颜色值） */
  color: string
  /** 图标图片路径，放在 public/images/icon/ 下；图片缺失时显示名称首字母 */
  icon: string
}

/** 技能图标分组 */
export interface CreativityGroup {
  /** 分组名称 */
  class_name: string
  /** 技能列表 */
  creativity_list: CreativityItem[]
}

/** 页面注入配置（VitePress head） */
export interface InjectConfig {
  header: HeadConfig[]
}

/** 导航栏菜单项 */
export interface NavItem {
  text: string
  link: string
  icon?: string
}

/** 导航栏下拉菜单 */
export interface NavGroup {
  text: string
  items: NavItem[]
}

/** 左侧更多菜单 - 单条链接 */
export interface NavMoreLink {
  icon: string
  iconType?: 'img' | 'iconfont'
  name: string
  url: string
  target?: string
}

/** 左侧更多菜单 - 分组 */
export interface NavMoreGroup {
  name: string
  list: NavMoreLink[]
}

/** 封面显示配置 */
export interface CoverShowConfig {
  enable: boolean
  coverLayout: 'left' | 'right' | 'both'
  defaultCover: string[]
}

/** 封面配置 */
export interface CoverConfig {
  twoColumns: boolean
  showCover: CoverShowConfig
}

/** 页脚社交链接 */
export interface FooterSocial {
  icon: string
  link: string
}

/** 页脚徽标 */
export interface FooterBadge {
  leftText: string
  rightText: string
  color: string
  tooltip?: string
  link: string
  logo: string
  style?: string
}

/** 页脚 sitemap 分组 */
export interface FooterSitemapGroup {
  text: string
  items: (FooterSitemapItem & { newTab?: boolean })[]
}

/** 页脚 sitemap 单条 */
export interface FooterSitemapItem {
  text: string
  link: string
}

/** 页脚配置 */
export interface FooterConfig {
  social: FooterSocial[]
  badge: FooterBadge[]
  sitemap: FooterSitemapGroup[]
}

/** Twikoo 评论配置 */
export interface TwikooConfig {
  envId: string
  region?: string
  lang?: string
}

/** 评论系统配置 */
export interface CommentConfig {
  enable: boolean
  twikoo: TwikooConfig
}

/** 侧边栏 - 站点简介 */
export interface AsideHello {
  enable: boolean
  text: string
}

/** 侧边栏 - 微信二维码 */
export interface AsideWechat {
  enable: boolean
  face: string
  back: string
}

/** 侧边栏 - 欢迎信息 */
export interface AsideWelcome {
  enable: boolean
  text1: string
  text2: string
  text3: string
  email: string
  address: [number, number] | []
  /** IP 定位服务配置（用于欢迎卡片展示访客位置，不配置则使用内置默认接口） */
  ipLocation?: {
    /** IP 查询接口地址（GET 请求，返回 JSON，含 data.ip 字段） */
    ipApi?: string
    /** IP 归属地查询地址模板（${ip} 为占位符，返回 JSON，含 data 字段） */
    locationApi?: string
  }
}

/** 侧边栏 - 目录 */
export interface AsideToc {
  enable: boolean
}

/** 侧边栏 - 标签 */
export interface AsideTags {
  enable: boolean
}

/** 侧边栏 - 倒计时 */
export interface AsideCountDown {
  enable: boolean
  data: {
    name: string
    date: string
  }
}

/** 侧边栏 - 站点数据 */
export interface AsideSiteData {
  enable: boolean
}

/** 侧边栏总配置 */
export interface AsideConfig {
  hello: AsideHello
  wechat: AsideWechat
  welcome: AsideWelcome
  toc: AsideToc
  tags: AsideTags
  countDown: AsideCountDown
  siteData: AsideSiteData
}

/** 动态友链配置 */
export interface DynamicLinkConfig {
  server: string
  app_token: string
  table_id: string
}

/** 留言板配置 */
export interface FriendsComments {
  title: string
  author: string
  cover: string
  message: string[]
  bottom: string
  /** 信封效果装饰图片（不配置则使用内置默认图） */
  envelope?: {
    /** 信封线条图 */
    line?: string
    /** 信封前景图（展开前） */
    before?: string
    /** 信封背景图（展开后） */
    after?: string
  }
}

/** 友链配置 */
export interface FriendsConfig {
  circleOfFriends: string
  dynamicLink: DynamicLinkConfig
  comments: FriendsComments
}

/** 装备页数据（自由结构） */
export type EquipmentConfig = Record<string, any>

/** 音乐播放器配置 */
export interface MusicConfig {
  enable: boolean
  url: string
  id: number | string
  server: 'netease' | 'tencent' | 'kugou'
  type: 'playlist' | 'album' | 'song'
}

/** 搜索配置（Algolia） */
export interface SearchConfig {
  enable: boolean
  appId: string
  apiKey: string
  indexName: string
}

/** 赞赏名单单项 */
export interface RewardListItem {
  /** 赞赏者昵称 */
  name: string
  /** 赞赏金额（数字，单位：元） */
  amount?: number
  /** 赞赏留言 */
  message?: string
  /** 赞赏时间（YYYY-MM-DD 或任意字符串） */
  date?: string
  /** 赞赏方式：wechat / alipay */
  method?: 'wechat' | 'alipay'
}

/** 打赏配置 */
export interface RewardConfig {
  enable: boolean
  /** 微信收款二维码（为空时使用主题内置默认图） */
  wechat?: string
  /** 支付宝收款二维码（为空时使用主题内置默认图） */
  alipay?: string
  /** 赞赏者名单（用于 /pages/thanks 页面展示，由用户提供） */
  list?: RewardListItem[]
}

/** 图片灯箱配置 */
export interface FancyboxConfig {
  enable: boolean
  js: string
  css: string
}

/** 开往-友链接力按钮配置 */
export interface TravellingsConfig {
  /** 是否在导航栏显示“开往”按钮（默认 false） */
  enable: boolean
  /** 开往跳转地址，默认官方 https://www.travellings.cn/go.html */
  url?: string
}

/** 外链中转配置 */
export interface JumpRedirectConfig {
  /** 是否启用外链中转 */
  enable: boolean
  /** 排除中转的链接 class 名数组（带这些 class 的链接直接打开） */
  exclude: string[]
  /** 域名白名单：匹配的链接显示“已信任”并自动跳转（支持通配符 *.xxx） */
  whitelist?: string[]
  /** 域名黑名单：匹配的链接显示危险警告，不自动跳转 */
  blacklist?: string[]
}

/** AI 摘要 - 大模型服务商预设 */
export type AiSummaryProvider =
  | 'openai'
  | 'deepseek'
  | 'kimi'
  | 'glm'
  | 'qwen'
  | 'minimax'
  | 'mimo'
  | 'mimo-token-plan'
  | 'doubao'
  | 'volcengine-coding'
  | 'shengsuanyun'
  | 'stepfun'
  | 'custom'

/** AI 摘要 - 缓存配置 */
export interface AiSummaryCacheConfig {
  /** 是否启用内容哈希缓存（默认 true，正文不变时不重复调用大模型） */
  enable?: boolean
  /** 缓存文件路径（相对项目根目录，默认 .vitepress/ai-summary-cache.json，建议提交 git 供 CI 复用） */
  file?: string
}

/** AI 摘要 - 运行时代理配置（可选，浏览器端为没有摘要的文章实时生成） */
export interface AiSummaryRuntimeConfig {
  /** 是否启用运行时代理（默认 false） */
  enable?: boolean
  /** 用户自部署的代理地址（Cloudflare Worker / serverless），API Key 保存在代理端 */
  endpoint?: string
  /** 是否使用 SSE 流式传输（默认 true，代理不支持时会自动降级为一次性 JSON 返回） */
  stream?: boolean
  /** 请求超时时间 ms（默认 30000，流式生成整体耗时较长） */
  timeout?: number
  /** 代理失败时的兜底文案（默认回退到文章 description，无 description 时显示该文案） */
  fallbackText?: string
}

/** AI 文章摘要配置（构建期调用大模型生成，默认关闭，关闭时保持 FakeGPT 行为） */
export interface AiSummaryConfig {
  /** 总开关（默认 false） */
  enable: boolean
  /** 服务商预设（默认 'custom'），预设会自动填充 baseURL，可用 baseURL 覆盖 */
  provider?: AiSummaryProvider
  /** OpenAI 兼容接口地址，provider 为 custom 时必填 */
  baseURL?: string
  /** API Key（仅构建期在 Node 侧使用，不会注入浏览器；推荐写 process.env.XXX 引用环境变量） */
  apiKey?: string
  /** 模型名称，如 'deepseek-chat'、'gpt-4o-mini' */
  model?: string
  /** 自定义 system prompt，为空时使用内置 prompt（输出 80-120 字纯文本中文摘要） */
  prompt?: string
  /** 发送给大模型的正文最大字符数（默认 2000，节省输入 token） */
  maxInputLength?: number
  /** 并发数（默认 3） */
  concurrency?: number
  /** 单篇请求超时时间 ms（默认 30000） */
  timeout?: number
  /** 失败重试次数，指数退避（默认 2） */
  retries?: number
  /** 为 true 时忽略缓存强制全部重新生成（默认 false） */
  force?: boolean
  /**
   * 构建期是否调用大模型生成摘要（默认 true）。
   * 设为 false 时构建只读取缓存文件，绝不发起请求，构建耗时不增加；
   * 摘要改由 CLI 命令 npx vitepress-theme-ninc summary 在本地预生成，缓存文件提交 git 后 CI 直接复用
   */
  buildGenerate?: boolean
  /** 排除生成的 glob 数组（相对项目根目录，如 ['posts/encrypted/**']；加密文章始终自动排除） */
  exclude?: string[]
  /** 缓存配置 */
  cache?: AiSummaryCacheConfig
  /** 运行时代理配置（可选） */
  runtime?: AiSummaryRuntimeConfig
  /** 组件右上角胶囊文案，默认取 provider 名称；enable 为 false 时固定显示 'FakeGPT' */
  logoText?: string
  /** 组件底部说明文案，为空时使用内置文案 */
  tip?: string
}

/** 不蒜子统计配置 */
export interface BusuanziConfig {
  /** 是否启用不蒜子统计（站点总访问量、总访客数、文章阅读量），默认 true */
  enable?: boolean
  /** 不蒜子脚本地址，默认为官方 https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js */
  scriptUrl?: string
}

/** 站点统计配置 */
export interface TongjiConfig {
  /** 51la V6 统计 ID；配置后主题自动注入 51la 脚本 */
  '51la'?: string
  /** 不蒜子统计配置（站点访问量、访客数、文章阅读量） */
  busuanzi?: BusuanziConfig
  /** 索引签名：允许扩展键，运行时仅处理已内置的 key */
  [key: string]: any
}

/** 关于页面 - 头像两侧技能标签 */
export interface AboutAvatarSkills {
  left?: string[]
  right?: string[]
}

/** 关于页面 - 介绍区域 */
export interface AboutHello {
  text1?: string
  text2?: string
  text3?: string
}

/** 关于页面 - 追求区域 */
export interface AboutPursuit {
  tips?: string
  title1?: string
  title2?: string
  word?: string[]
}

/** 关于页面 - 技能区域 */
export interface AboutSkills {
  tip?: string
  title?: string
}

/** 关于页面 - 生涯列表项 */
export interface AboutCareerItem {
  text?: string
  color?: string
}

/** 关于页面 - 生涯区域 */
export interface AboutCareer {
  tip?: string
  title?: string
  list?: AboutCareerItem[]
}

/** 关于页面 - 性格区域 */
export interface AboutCharacter {
  tip?: string
  title?: string
  mbti?: string
  mbtiIcon?: string
  desc?: string
  link?: string
  linkText?: string
}

/** 关于页面 - 座右铭 */
export interface AboutMotto {
  tip?: string
  title1?: string
  title2?: string
}

/** 关于页面 - 偏好卡片（关注/音乐） */
export interface AboutPreference {
  image?: string
  color?: string
  tip?: string
  title?: string
  desc?: string
}

/** 关于页面 - 数据统计 */
export interface AboutStatistics {
  color?: string
  image?: string
  tip?: string
  title?: string
  desc?: string
  source?: string
  sourceLink?: string
}

/** 关于页面 - 信息项 */
export interface AboutInfoItem {
  name?: string
  value?: string
  color?: string
}

/** 关于页面 - 信息区域 */
export interface AboutInfo {
  mapImage?: string
  address?: string
  items?: AboutInfoItem[]
}

/** 关于页面完整配置（所有字段可选，与默认值深合并） */
export interface AboutConfig {
  /** 头像两侧技能标签 */
  avatarSkills?: AboutAvatarSkills
  /** 介绍区域 */
  hello?: AboutHello
  /** 追求区域 */
  pursuit?: AboutPursuit
  /** 技能区域 */
  skills?: AboutSkills
  /** 生涯区域 */
  career?: AboutCareer
  /** 性格区域 */
  character?: AboutCharacter
  /** 座右铭 */
  motto?: AboutMotto
  /** 关注偏好 */
  preference?: AboutPreference
  /** 音乐偏好 */
  musicPreference?: AboutPreference
  /** 数据统计 */
  statistics?: AboutStatistics
  /** 信息区域 */
  info?: AboutInfo
}

/** 完整的主题配置 */
export interface ThemeConfig {
  siteMeta: SiteMeta
  homeTop: HomeTopConfig
  icp: string
  since: string
  postSize: number
  settingButton: boolean
  inject: InjectConfig
  nav: NavGroup[]
  navMore: NavMoreGroup[]
  cover: CoverConfig
  footer: FooterConfig
  comment: CommentConfig
  aside: AsideConfig
  friends: FriendsConfig
  about: AboutConfig
  equipment: EquipmentConfig
  music: MusicConfig
  search: SearchConfig
  rewardData: RewardConfig
  fancybox: FancyboxConfig
  jumpRedirect: JumpRedirectConfig
  aiSummary: AiSummaryConfig
  tongji: TongjiConfig
  /** 开往-友链接力按钮（导航栏右侧，默认关闭） */
  travellings: TravellingsConfig
}

/** 用户传入的主题配置（所有字段可选，会与默认值深合并） */
export type UserThemeConfig = Partial<ThemeConfig> & Record<string, any>
