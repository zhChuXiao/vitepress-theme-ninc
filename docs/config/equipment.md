# equipment 装备

配置「我的装备」页面数据。该页面由主题的 `Equipment` 视图渲染，数据按「分组 → 分组内装备列表」两级结构组织。

![我的装备配置文档页](/images/scrollShowcase/equipment-dark.png)

## 数据结构

`equipment` 类型为 `Record<string, any>`，主题未做强约束，但内置 `Equipment.vue` 实际读取以下结构：

```text
equipment = {
  top_background: '封面图路径',
  class_name: '分组名（如 我的装备）',
  description: '分组主描述',
  subDescription: '分组副描述',
  tip: '分组提示文字',
  good_things: [
    {
      name: '小分组标题',
      description: '小分组描述',
      equipment_list: [
        {
          name: '设备名称',
          specification: '规格（可用 | 分隔两段，如 键盘 | 红轴）',
          description: '设备描述',
          image: '设备图片路径',
          link: '详情链接（站内路径或外链）',
          large: false,        // 是否大图
          largeHeight: false,  // 是否大高度
          full: false          // 是否铺满
        }
      ]
    }
  ]
}
```

::: warning 必须匹配上述结构
`Equipment.vue` 固定读取 `top_background` / `class_name` / `description` / `good_things[].equipment_list[]` 等字段。若按其他结构（如以 `keyboard`/`mouse` 为顶层 key 的数组）配置，页面将无法渲染。
:::

## 字段说明

### equipment 顶层

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `top_background` | `string` | 顶部封面背景图路径 |
| `class_name` | `string` | 分组名称 |
| `description` | `string` | 分组主描述 |
| `subDescription` | `string?` | 分组副描述 |
| `tip` | `string?` | 分组提示文字 |
| `good_things` | `GoodThingGroup[]` | 小分组数组 |

### good_things 数组项

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 小分组标题 |
| `description` | `string` | 小分组描述 |
| `equipment_list` | `EquipmentItem[]` | 该小分组下的设备列表 |

### equipment_list 数组项

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 设备名称 |
| `specification` | `string` | 规格；含 `|` 时按「左 | 右」两段展示 |
| `description` | `string` | 设备描述 |
| `image` | `string` | 设备图片路径 |
| `link` | `string` | 详情链接；外链在新标签打开，站内路径在当前页跳转 |
| `large` | `boolean?` | 是否大图 |
| `largeHeight` | `boolean?` | 是否大高度 |
| `full` | `boolean?` | 是否铺满 |

## 示例

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  equipment: {
    top_background: '/images/equipment-bg.jpg',
    class_name: '我的装备',
    description: '记录当下使用的设备',
    subDescription: '数码党的自我修养',
    tip: '仅供参考，按需选择',
    good_things: [
      {
        name: '输入设备',
        description: '键盘与鼠标',
        equipment_list: [
          {
            name: 'Keychron K3 Pro',
            specification: '键盘 | 矮轴红轴',
            description: '矮轴机械键盘，办公利器',
            image: '/images/equipment/k3pro.jpg',
            link: 'https://www.keychron.com/',
            large: false
          },
          {
            name: 'MX Master 3S',
            specification: '鼠标 | 静音微动',
            description: '静音微动，多设备切换',
            image: '/images/equipment/mx3s.jpg',
            link: ''
          }
        ]
      },
      {
        name: '音频设备',
        description: '耳机',
        equipment_list: [
          {
            name: 'AirPods Pro 2',
            specification: '耳机 | 主动降噪',
            description: '主动降噪，空间音频',
            image: '/images/equipment/airpods.jpg',
            link: ''
          }
        ]
      }
    ]
  }
})
```

## 渲染效果

---

`equipment` 渲染为「我的装备」页面：

- **顶部封面**：`top_background` 作为整页封面背景，叠加 `class_name`、`description`、`subDescription`、`tip`。
- **装备分组**：`good_things` 每一项渲染为一个区块，标题为 `name`，描述为 `description`。
- **设备卡片**：`equipment_list` 每一项渲染为一张卡片，展示 `image`、`name`、`specification`、`description`，点击名称可复制，`link` 渲染为「详情」入口。

## 注意事项

::: warning 默认为空对象
`defaultThemeConfig.equipment` 默认值为 `{}`。若不配置 `equipment`，`<Equipment />` 页面不会渲染任何装备内容。
:::

::: tip 与导航配合
在 [`nav`](./nav.md) 中添加指向 `/pages/equipment` 的入口，并在 `pages/equipment.md` 中显式导入 `Equipment` 组件，才能访问装备页。详见 [自定义页面 - 装备页](../guide/pages.md#装备页equipment)。
:::

> 配置会与默认值深合并，只需填写想修改的字段，详见 [主题配置详解 - defu 深合并机制](../guide/theme-config#defu-深合并机制)。

## 相关配置

- [`aside` 侧边栏](./aside.md) — 侧边栏模块配置
- [`nav` 导航](./nav.md) — 导航栏菜单配置，可添加装备页入口
- [`cover` 封面](./cover.md) — 文章封面配置
