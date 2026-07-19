# about 关于本站

配置「关于本站」页面内容。该页面由主题的 `About` 视图渲染，所有展示内容均来自 `themeConfig.about`，与默认值深合并，只需填写想修改的字段。

![关于页配置文档页](/images/scrollShowcase/about-light.png)

## 页面结构

关于页自上而下由以下区域组成，每个区域对应 `about` 中的一个字段：

| 区域 | 字段 | 说明 |
| --- | --- | --- |
| 头像 + 两侧技能标签 | `avatarSkills` | 头像居中，左右各展示一列技能标签 |
| 介绍 | `hello` | 三行欢迎文字 |
| 追求 | `pursuit` | 标语 + 轮播关键词 |
| 技能 | `skills` | 技能图标滚动条 + 完整列表（数据来自 `homeTop.creativity`） |
| 生涯 | `career` | 生涯节点列表 |
| 性格 | `character` | MBTI 性格介绍 |
| 座右铭 | `motto` | 两行座右铭 |
| 关注偏好 | `preference` | 带背景图的偏好卡片 |
| 音乐偏好 | `musicPreference` | 带背景图的偏好卡片 |
| 数据统计 | `statistics` | 访问统计卡片（数据来自 `tongji`） |
| 信息 | `info` | 地图 + 个人信息项 |

## 字段说明

### avatarSkills 头像两侧技能标签

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `left` | `string[]` | 头像左侧标签数组 |
| `right` | `string[]` | 头像右侧标签数组 |

### hello 介绍区域

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `text1` | `string` | 第一行（欢迎语） |
| `text2` | `string` | 第二行（博主名，大标题样式） |
| `text3` | `string` | 第三行（职业/身份） |

### pursuit 追求区域

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `tips` | `string` | 小标题（如「信仰」） |
| `title1` | `string` | 主标题前半段 |
| `title2` | `string` | 主标题后半段 |
| `word` | `string[]` | 轮播关键词数组，会循环显示 |

### skills 技能区域

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `tip` | `string` | 小标题（如「技能」） |
| `title` | `string` | 主标题（如「开启创造力」） |

::: tip 技能图标数据来源
技能图标滚动条与完整列表的数据来自 [`homeTop.creativity`](./home-top.md#creativity)，而非 `about.skills`。`about.skills` 仅控制该区域的小标题与主标题文案。`homeTop.creativity` 为空时回退到主题内置的默认技能数据。
:::

### career 生涯区域

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `tip` | `string` | 小标题（如「生涯」） |
| `title` | `string` | 主标题（如「无限进步」） |
| `list` | `AboutCareerItem[]` | 生涯节点列表 |

#### list 数组项（AboutCareerItem）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `text` | `string` | 节点文字 |
| `color` | `string` | 节点颜色（CSS 颜色值，用于左侧圆点与文字高亮） |

### character 性格区域

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `tip` | `string` | 小标题（如「性格」） |
| `title` | `string` | 主标题（如「探险家」） |
| `mbti` | `string` | MBTI 类型（如 `ISFP-T`） |
| `mbtiIcon` | `string` | MBTI 图标路径；为空时不显示 |
| `desc` | `string` | 描述文字 |
| `link` | `string` | 详情链接（如 16personalities 页面） |
| `linkText` | `string` | 链接文字 |

### motto 座右铭

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `tip` | `string` | 小标题（如「座右铭」） |
| `title1` | `string` | 第一行 |
| `title2` | `string` | 第二行 |

### preference / musicPreference 偏好卡片

`preference`（关注偏好）与 `musicPreference`（音乐偏好）结构相同：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `image` | `string` | 背景图路径 |
| `color` | `string` | 叠加色（CSS 颜色值，建议带透明度如 `#00000022`） |
| `tip` | `string` | 小标题 |
| `title` | `string` | 主标题 |
| `desc` | `string` | 描述文字 |

### statistics 数据统计

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `color` | `string` | 叠加色（CSS 颜色值） |
| `image` | `string` | 背景图路径；为空时仅显示纯色背景 |
| `tip` | `string` | 小标题 |
| `title` | `string` | 主标题 |
| `desc` | `string` | 描述文字（统计来源说明） |
| `source` | `string` | 数据源名称（如 `51la`） |
| `sourceLink` | `string` | 数据源链接 |

::: tip 统计数据来源
统计数字（访问量等）来自 [`tongji`](./tongji.md) 配置，而非 `about.statistics`。`about.statistics` 仅控制卡片的样式与文案。
:::

### info 信息区域

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `mapImage` | `string` | 地图图片路径 |
| `address` | `string` | 居住地址 |
| `items` | `AboutInfoItem[]` | 信息项列表 |

#### items 数组项（AboutInfoItem）

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 信息名（如「生于」） |
| `value` | `string` | 信息值（如「2000」） |
| `color` | `string` | 值的颜色（CSS 颜色值） |

## 示例

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
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
    preference: {
      image: '/images/cover.svg',
      color: '#00000022',
      tip: '关注偏好',
      title: '数码科技',
      desc: '手机、电脑及软硬件'
    },
    // 音乐偏好
    musicPreference: {
      image: '/images/cover.svg',
      color: '#ffffff22',
      tip: '音乐偏好',
      title: '欧美、KPOP、R&B',
      desc: '一起欣赏更多音乐'
    },
    // 数据统计（需配合 tongji 配置使用）
    statistics: {
      color: '#0f1114',
      image: '',
      tip: '数据',
      title: '访问统计',
      desc: '统计信息来自',
      source: '51la',
      sourceLink: 'https://v6.51.la/'
    },
    // 信息区域（mapImage 为地图图片，address 为居住地址，items 为信息项）
    info: {
      mapImage: '/images/address.png',
      address: '你的地址',
      items: [
        { name: '生于', value: '2000', color: '#43a6c6' },
        { name: '现在职业', value: '前端开发工程师', color: '#dfac46' }
      ]
    }
  }
})
```

## 渲染效果

---

`about` 渲染为「关于本站」页面（`/pages/about`）：

- **头像 + 技能标签**：`siteMeta.avatar` 居中展示，左右两侧分别显示 `avatarSkills.left` / `avatarSkills.right` 标签。
- **介绍**：`hello` 三行文字依次展示。
- **追求**：`pursuit` 标语 + `word` 关键词轮播动画。
- **技能**：`homeTop.creativity` 图标滚动条，鼠标悬浮切换为完整列表。
- **生涯**：`career.list` 每项渲染为带彩色圆点的节点。
- **性格**：`character` MBTI 信息 + 可选图标。
- **座右铭**：`motto` 两行文字。
- **关注/音乐偏好**：两张带背景图的卡片，`color` 叠加在背景图上。
- **数据统计**：`tongji` 统计数据 + `statistics` 文案。
- **信息**：`info.mapImage` 地图卡片 + `info.items` 信息项列表。

## 注意事项

::: tip 配置会与默认值深合并
`about` 使用 `defu` 深合并，默认值已包含所有字段的通用占位内容。只需填写想修改的字段，未填写的字段会自动使用默认值。
:::

::: warning 头像来自 siteMeta
关于页头像使用 [`siteMeta.avatar`](./site-meta.md)，不在 `about` 中配置。修改头像请编辑 `siteMeta.avatar` 字段。
:::

> 图片路径以 `/` 开头，对应 `public/` 下的文件，如 `/images/xxx.png` 对应 `public/images/xxx.png`。

::: tip 与导航配合
在 [`nav`](./nav.md) 中添加指向 `/pages/about` 的入口，并在 `pages/about.md` 中显式导入 `About` 组件，才能访问关于页。详见 [自定义页面 - 关于页](../guide/pages.md#关于页about)。
:::

## 相关配置

- [`siteMeta` 站点信息](./site-meta.md) — 头像、作者等基础信息
- [`homeTop` 首页顶部](./home-top.md) — `creativity` 技能图标数据（关于页技能区域共用）
- [`tongji` 统计](./tongji.md) — 访问统计数据源（关于页数据统计区域共用）
- [`nav` 导航](./nav.md) — 导航栏菜单配置，可添加关于页入口
