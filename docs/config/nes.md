# nes NES 模拟器

内置 NES（任天堂红白机）模拟器页面，支持在浏览器中直接运行经典 NES 游戏。支持游戏选择、存档/读档、TAS 录像播放、键盘控制、手柄输入等功能。

`npx vitepress-theme-ninc init` 生成的项目默认自带超级马里奥 ROM，开箱即用。

![NES 模拟器](/images/article/nes.png)



## 字段说明

### NesConfig

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `roms` | `NesRomItem[]` | 见下方默认配置 | ROM 游戏列表，至少包含一项 |
| `defaultRomId` | `string?` | `roms[0].id` | 默认选中的游戏 ID |

### NesRomItem

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | — | 游戏唯一 ID，用于存档前缀和切换游戏 |
| `url` | `string` | — | ROM 文件路径，放在 `public/nes-rom/` 下 |
| `name` | `string` | — | 游戏显示名称 |
| `savePrefix` | `string` | — | 存档前缀，用于 IndexedDB 存档隔离，不同游戏不要重复 |
| `fm2` | `string?` | — | TAS 录像文件路径（可选），放在 `public/nes-fm2/` 下 |

## 默认配置

`defaultThemeConfig` 已内置超级马里奥作为默认游戏，`init` 命令会自动将 `超级马里奥.nes` 复制到 `public/nes-rom/`。无需任何配置即可使用。

```ts
// 主题内置默认值（无需手动填写）
nes: {
  roms: [
    {
      id: 'mario',
      url: '/nes-rom/超级马里奥.nes',
      name: '超级玛丽-原版',
      savePrefix: 'mario'
    }
  ],
  defaultRomId: 'mario'
}
```

## 示例

### 添加更多游戏

1. 将 `.nes` ROM 文件放到项目的 `public/nes-rom/` 目录下
2. 在 `themeConfig.ts` 中配置 `nes.roms` 数组

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  nes: {
    defaultRomId: 'mario',
    roms: [
      // 保留默认的超级马里奥
      { id: 'mario', url: '/nes-rom/超级马里奥.nes', name: '超级玛丽-原版', savePrefix: 'mario' },
      // 新增游戏：把 .nes 文件放到 public/nes-rom/ 下
      { id: 'contra', url: '/nes-rom/魂斗罗.nes', name: '魂斗罗', savePrefix: 'contra' },
      { id: 'tank', url: '/nes-rom/坦克大战.nes', name: '坦克大战', savePrefix: 'tank' }
    ]
  }
})
```

### 配置 TAS 录像

TAS（Tool-Assisted Speedrun）录像文件为 `.fm2` 格式，可在 NES 页面通过「上传 FM2 录像文件」按钮加载，也可在配置中预设：

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  nes: {
    roms: [
      {
        id: 'mario',
        url: '/nes-rom/超级马里奥.nes',
        name: '超级玛丽-原版',
        savePrefix: 'mario',
        // 把 .fm2 文件放到 public/nes-fm2/ 下
        fm2: '/nes-fm2/happylee-supermariobros,warped.fm2'
      }
    ]
  }
})
```

配置 `fm2` 后，游戏列表中该项会显示「默认 TAS 录像」按钮，点击即可播放预设录像。

## 文件路径要求

::: warning 路径必须以 `/` 开头
VitePress 的 `public/` 目录下的静态资源通过根路径访问，配置中的 `url` 和 `fm2` 字段必须以 `/` 开头，且省略 `public` 前缀。

- 正确：`/nes-rom/超级马里奥.nes`（对应文件 `public/nes-rom/超级马里奥.nes`）
- 错误：`nes-rom/超级马里奥.nes`（缺少前导 `/`）
- 错误：`/public/nes-rom/超级马里奥.nes`（不应包含 `public`）
:::

### 目录结构

```
public/
├── nes-rom/          ← ROM 文件目录
│   ├── 超级马里奥.nes
│   ├── 魂斗罗.nes
│   └── ...
└── nes-fm2/          ← TAS 录像目录（可选）
    └── happylee-supermariobros,warped.fm2
```

::: tip init 自动生成
运行 `npx vitepress-theme-ninc init` 时，若选择生成 NES 模拟器页面，会自动：
1. 创建 `public/nes-rom/` 目录
2. 复制 `超级马里奥.nes` 到该目录
3. 生成 `pages/nes.md` 页面
4. 在导航栏添加「工具」→「NES 模拟器」入口
:::

## 页面配置

NES 页面文件 `pages/nes.md` 由 init 命令自动生成，内容极简：

```md
---
title: NES 模拟器
fullWidth: true
comment: true
description: 在线NES模拟器...
card: false
---

<script setup>
import { NesGame } from 'vitepress-theme-ninc/views'
</script>

<ClientOnly>
    <NesGame />
</ClientOnly>
```

::: tip 全宽布局
`fullWidth: true` 让 NES 页面占满整个内容区宽度，避免侧边栏挤压游戏画面。`card: false` 关闭文章卡片样式。
:::

## 键盘控制

### P1 玩家

| 按键 | NES 手柄 | 说明 |
| --- | --- | --- |
| `W` `A` `S` `D` | 方向键 ↑↓←→ | 移动 |
| `K` | A | 跳跃 / 确认 |
| `J` | B | 攻击 / 取消 |
| `I` | C（连发） | 连续跳跃，适合射击类游戏 |
| `U` | D（连发） | 连续攻击 |
| `Enter` | START | 开始 / 暂停 |
| `右 Shift` | SELECT | 选择 |

### P2 玩家

| 按键 | NES 手柄 |
| --- | --- |
| `↑` `←` `↓` `→` | 方向键 |
| `2` `1` | A / B |
| `5` `4` | C（连发） / D（连发） |

### 功能快捷键

| 按键 | 功能 |
| --- | --- |
| `N` | 快速存档 |
| `M` | 快速读档 |
| `R` | 重置游戏 |
| `P` | 游戏截图 |
| `O` | 暂停 / 继续 |
| `Shift + 1` / `Shift + 3` | 存档到槽位 1 / 2 |
| `Shift + 2` / `Shift + 4` | 读档从槽位 1 / 2 |
| `Shift + Q` | 清空存档 |

::: tip 防误触模式
页面右侧有「防误触模式」开关，开启后所有功能键需配合 `Shift` 才能触发，避免游戏时误操作。
:::

## 注意事项

- **存档隔离**：不同游戏通过 `savePrefix` 隔离存档，请确保每个游戏的 `savePrefix` 唯一，否则存档会互相覆盖。
- **ROM 文件大小**：单个 NES ROM 通常在 24KB ~ 512KB 之间，不影响站点构建性能。
- **录像兼容性**：TAS 录像文件（`.fm2`）仅支持使用原版 ROM 播放。使用修改版 ROM（如无敌版）播放录像可能会出现操作不同步。
- **浏览器支持**：NES 模拟器依赖 WebGL 和 Web Audio API，请在现代浏览器中使用。
- **移动端**：移动端不支持键盘控制，建议使用外接蓝牙手柄。
- **存档存储**：存档数据保存在浏览器 IndexedDB 中，清除浏览器数据会丢失存档。

## 相关配置

- [`nav` 导航栏](./nav.md) — 添加 NES 页面到导航栏
- [`inject` 注入](./inject.md) — 页面 head 标签注入
