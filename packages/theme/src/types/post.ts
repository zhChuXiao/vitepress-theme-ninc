// 文章数据类型 - 对应 getPostData.mjs 返回的文章对象

/** 转载文章信息 */
export interface ReprintInfo {
  title: string
  desc: string
  url: string
  /** 来源图标路径 */
  icon?: string
}

/** 加密文章信息（密码已在构建期加密） */
export interface CryptoInfo {
  enable?: boolean
  password?: string
}

/** 单篇文章数据 */
export interface PostData {
  /** 文章唯一 ID（由文件路径生成） */
  id: string
  /** 文章标题 */
  title: string
  /** 发布时间（时间戳） */
  date: number
  /** 最后修改时间（时间戳） */
  lastModified: number
  /** 距今过期天数 */
  expired: number
  /** 标签列表 */
  tags?: string[] | string
  /** 分类列表 */
  categories?: string[] | string
  /** 文章描述 */
  description?: string
  /** 文章常规路径（.html） */
  regularPath: string
  /** 是否置顶 */
  top?: boolean
  /** 封面图片路径 */
  cover?: string
  /** 是否推荐 */
  recommend?: boolean
  /** 是否默认折叠所有代码块 */
  cbx?: boolean
  /** 是否折叠单个代码块（供代码折叠插件按块读取） */
  cbf?: boolean
  /** 页面布局名称，如 home */
  layout?: string
  /** 是否启用首页导航状态 */
  home?: boolean
  /** 是否显示侧边栏 */
  aside?: boolean
  /** 是否按普通页面渲染 */
  isPage?: boolean
  /** 是否启用全宽布局 */
  fullWidth?: boolean
  /** 是否启用卡片背景 */
  card?: boolean
  /** 是否显示评论 */
  comment?: boolean
  /** 是否显示版权声明 */
  copyright?: boolean
  /** 手动填写的文章摘要 */
  articleGPT?: string
  /** 参考资料列表 */
  references?: Array<{ title: string; url: string }>
  /** 转载文章信息 */
  reprint?: ReprintInfo
  /** 文章封面主色 */
  mainColor?: string
  /** 加密配置 */
  crypto: CryptoInfo
}

/** 标签/分类的统计项 */
export interface ArchiveStatItem {
  /** 该分组的文章数 */
  count: number
  /** 该分组的文章列表 */
  articles: PostData[]
}

/** 标签数据：{ [标签名]: { count, articles } } */
export type TagsData = Record<string, ArchiveStatItem>

/** 分类数据：{ [分类名]: { count, articles } } */
export type CategoriesData = Record<string, ArchiveStatItem>

/** 归档数据 */
export interface ArchivesData {
  /** 按年份分组的文章数据 */
  data: Record<string, ArchiveStatItem>
  /** 年份列表（降序） */
  year: string[]
}
