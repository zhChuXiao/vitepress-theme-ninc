# NES 模拟器

主题内置了一个 NES（任天堂红白机）模拟器页面，打开页面就能在浏览器里直接玩经典 NES 游戏，支持存档/读档、TAS 录像播放、双人键盘控制、手柄输入。

`init` 命令生成的项目默认自带超级马里奥 ROM，开箱即用，不需要任何额外配置。本页从零开始，带你完成「生成 → 试玩 → 加游戏 → 配录像」的完整流程。如果你只想查配置字段，直接看 [配置参考](/config/nes)。

![NES 模拟器界面](/images/article/nes.png)

## 先了解一件事

**NES 模拟器是怎么工作的**：

- 游戏画面通过 WebGL 渲染到 `<canvas>` 上，声音通过 Web Audio API 输出，都在浏览器本地完成，不需要服务器
- ROM 文件（`.nes`）放在项目的 `public/nes-rom/` 目录下，通过 HTTP 静态加载
- 存档数据保存在浏览器的 IndexedDB 里，不会上传服务器，清除浏览器数据会丢失
- TAS 录像文件（`.fm2`）可选，放在 `public/nes-fm2/` 下，用于回放精确到帧的操作记录

## 第一步：生成 NES 页面

### 方式 A：init 命令自动生成

如果你在用 `npx vitepress-theme-ninc init` 创建新项目，CLI 会询问是否生成 NES 模拟器页面，选择「是」即可：

- 自动创建 `public/nes-rom/` 目录
- 自动复制 `超级马里奥.nes` 到该目录
- 自动生成 `pages/nes.md` 页面
- 自动在导航栏添加「工具」→「NES 模拟器」入口

生成的 `pages/nes.md` 内容极简，组件由主题包提供：

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

::: tip 为什么需要 ClientOnly
NES 模拟器依赖浏览器的 WebGL 和 Web Audio API，在 SSR（服务端渲染）环境下无法运行。用 `<ClientOnly>` 包裹后，组件只在浏览器端渲染，避免构建报错。
:::

### 方式 B：手动添加到已有项目

如果你的项目已经存在，手动加 3 步即可：

1. 把 `超级马里奥.nes` 放到 `public/nes-rom/` 目录下
2. 在 `pages/` 下创建 `nes.md`，内容同上
3. 在导航栏添加入口（可选）：

```ts
// .vitepress/themeConfig.ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  nav: [
    {
      text: '工具',
      items: [
        { text: 'NES 模拟器', link: '/pages/nes', icon: 'game' }
      ]
    }
  ]
})
```

## 第二步：试玩超级马里奥

启动 dev 服务器后访问 `/pages/nes`：

1. 点击游戏画面中央的「点击屏幕中央加载游戏」提示
2. 游戏加载完成后，按 `Enter` 键开始
3. 使用 WASD 控制移动，`K` 跳跃，`J` 攻击

### P1 键盘控制

| 按键 | NES 手柄 | 说明 |
| --- | --- | --- |
| `W` `A` `S` `D` | ↑ ↓ ← → | 移动 |
| `K` | A | 跳跃 / 确认 |
| `J` | B | 攻击 / 取消 |
| `I` | C（连发） | 连续跳跃 |
| `U` | D（连发） | 连续攻击 |
| `Enter` | START | 开始 / 暂停 |
| `右 Shift` | SELECT | 选择 |

### 功能快捷键

| 按键 | 功能 |
| --- | --- |
| `N` | 快速存档 |
| `M` | 快速读档 |
| `R` | 重置游戏 |
| `P` | 游戏截图 |
| `O` | 暂停 / 继续 |
| `Shift + 1` / `Shift + 3` | 存档到槽位 1 / 2 |
| `Shift + 2` / `Shift + 4` | 从槽位 1 / 2 读档 |
| `Shift + Q` | 清空存档 |

::: tip 防误触模式
游戏画面右侧有「防误触模式」开关。开启后所有功能键（N/M/R/P/O 等）需要配合 `Shift` 才能触发，避免玩游戏时误按导致存档丢失。
:::

::: info P2 玩家控制
支持双人游戏。P2 使用方向键移动，数字小键盘的 `1`（B）、`2`（A）、`4`（C 连发）、`5`（D 连发）。连接手柄后可直接使用，无需额外配置。
:::

## 第三步：添加更多游戏

默认只有超级马里奥，想加更多游戏只需两步：

### 1. 放 ROM 文件

把 `.nes` 文件放到项目的 `public/nes-rom/` 目录下：

```
public/
└── nes-rom/
    ├── 超级马里奥.nes              ← init 自带
    ├── 超级马里奥无敌版.nes         ← 你新加的
    ├── 魂斗罗1代30人S弹.nes         ← 你新加的
    ├── 松鼠大战无敌版.nes           ← 你新加的
    ├── 冒险岛无敌版.nes             ← 你新加的
    ├── 洛克人1无敌版.nes            ← 你新加的
    ├── 坦克大战加速汉化版.nes       ← 你新加的
    ├── 三目童子汉化版.nes           ← 你新加的
    ├── 恶魔城1无敌版.nes            ← 你新加的
    └── ...
```

::: tip ROM 文件从哪来
NES ROM 文件可以在网上搜索「NES ROM 下载」获取。单个文件通常在 24KB ~ 512KB 之间。请确保你有合法的使用权。
:::

::: tip 想看完整效果？
主题作者的 [blog.ninc.top/pages/nes](https://blog.ninc.top/pages/nes) 在线演示站内置了 27 款游戏（含马里奥、魂斗罗、松鼠大战、冒险岛、洛克人、坦克大战、三目童子、恶魔城等多个系列的原版与修改版），可直接体验各类游戏在模拟器中的表现。
:::

### 2. 配置 themeConfig

在 `.vitepress/themeConfig.ts` 的 `nes.roms` 数组里添加游戏信息：

```ts
import { defineThemeConfig } from 'vitepress-theme-ninc/defineThemeConfig'

export const themeConfig = defineThemeConfig({
  nes: {
    defaultRomId: 'mario',  // 默认选中的游戏 ID
    roms: [
      // 超级马里奥系列
      { id: 'mario', url: '/nes-rom/超级马里奥.nes', name: '超级玛丽-原版', savePrefix: 'mario' },
      { id: 'mario1', url: '/nes-rom/超级马里奥无敌版.nes', name: '超级玛丽-无敌版', savePrefix: 'mario1' },
      // 魂斗罗系列
      { id: 'contra', url: '/nes-rom/魂斗罗1代30人S弹.nes', name: '魂斗罗1代-30人S弹', savePrefix: 'contra' },
      { id: 'contras', url: '/nes-rom/超级魂斗罗无敌版.nes', name: '超级魂斗罗-无敌版', savePrefix: 'contras' },
      // 松鼠大战系列
      { id: 'songshu', url: '/nes-rom/松鼠大战无敌版.nes', name: '松鼠大战-无敌版', savePrefix: 'songshu' },
      { id: 'songshu2', url: '/nes-rom/松鼠大战2无敌版.nes', name: '松鼠大战2-无敌版', savePrefix: 'songshu2' },
      // 冒险岛系列
      { id: 'maoxiandao', url: '/nes-rom/冒险岛无敌版.nes', name: '冒险岛-无敌版', savePrefix: 'maoxiandao' },
      { id: 'maoxiandao4', url: '/nes-rom/冒险岛4无敌版.nes', name: '冒险岛4-无敌版', savePrefix: 'maoxiandao4' },
      // 洛克人系列
      { id: 'luoke1', url: '/nes-rom/洛克人1无敌版.nes', name: '洛克人1-无敌版', savePrefix: 'luoke1' },
      { id: 'luoke6', url: '/nes-rom/洛克人6无限血99人.nes', name: '洛克人6-无限血99人', savePrefix: 'luoke6' },
      // 其他经典
      { id: 'tanke', url: '/nes-rom/坦克大战加速汉化版.nes', name: '坦克大战-加速汉化版', savePrefix: 'tanke' },
      { id: 'sanmu', url: '/nes-rom/三目童子汉化版.nes', name: '三目童子-汉化版', savePrefix: 'sanmu' },
      { id: 'emocheng', url: '/nes-rom/恶魔城1无敌版.nes', name: '恶魔城1-无敌版', savePrefix: 'emocheng' }
    ]
  }
})
```

配置项说明：

| 字段 | 说明 | 示例 |
| --- | --- | --- |
| `id` | 游戏唯一 ID，用于切换和存档识别 | `'contra'` |
| `url` | ROM 文件路径，必须以 `/` 开头 | `'/nes-rom/魂斗罗.nes'` |
| `name` | 下拉菜单显示的名称 | `'魂斗罗'` |
| `savePrefix` | 存档前缀，**每个游戏必须不同** | `'contra'` |

::: warning 路径必须正确
- 以 `/` 开头，对应 `public/` 目录下的文件
- 不要写 `public/` 前缀
- 正确：`/nes-rom/魂斗罗.nes`
- 错误：`nes-rom/魂斗罗.nes`（缺前导 `/`）
- 错误：`/public/nes-rom/魂斗罗.nes`（多了 `public`）

路径错误会导致游戏加载失败，画面停在「点击屏幕中央加载游戏」。
:::

::: warning savePrefix 不能重复
存档通过 `savePrefix` 隔离。如果两个游戏用相同的 `savePrefix`，它们的存档会互相覆盖。建议直接用 `id` 作为 `savePrefix`。
:::

保存后刷新页面，游戏选择器下拉菜单里就能看到新加的游戏了。

## 第四步：配置 TAS 录像（可选）

TAS（Tool-Assisted Speedrun）是「工具辅助竞速」录像，记录了精确到每一帧的操作输入，可以回放完美通关过程。主题支持在页面上传 `.fm2` 录像文件，也可以在配置中预设。

### 预设录像

1. 把 `.fm2` 文件放到 `public/nes-fm2/` 目录下：

```
public/
└── nes-fm2/
    └── happylee-supermariobros,warped.fm2
```

2. 在 `themeConfig` 中给对应的 ROM 加 `fm2` 字段：

```ts
nes: {
  roms: [
    {
      id: 'mario',
      url: '/nes-rom/超级马里奥.nes',
      name: '超级玛丽-原版',
      savePrefix: 'mario',
      fm2: '/nes-fm2/happylee-supermariobros,warped.fm2'  // ← 加这一行
    }
  ]
}
```

配置后，游戏画面上方会显示「默认 TAS 录像」按钮，点击即可播放预设录像。

### 临时上传录像

页面右上角有「上传 FM2 录像文件」按钮，点击后选择本地 `.fm2` 文件即可临时播放，不会保存到配置里。

::: warning 录像必须匹配原版 ROM
TAS 录像是按帧记录的操作序列，必须配合**原版 ROM** 才能正常回放。如果你用的是修改版 ROM（如无敌版、无限命版），录像会出现操作不同步、角色乱跑等问题。

例：`happylee-supermariobros,warped.fm2` 只能配合 `超级马里奥.nes`（原版）使用，不能配合 `超级马里奥无敌版.nes`。
:::

## 上传自定义 ROM

除了配置里预设的游戏，访客还可以在页面上临时上传自己的 ROM：

游戏画面右侧有一个拖放区域，支持两种方式：

- **拖放**：把 `.nes` 文件拖到虚线框内
- **点击**：点击虚线框区域，选择文件

上传的 ROM 只在当前会话有效，刷新页面后会清除，不会修改你的配置。

## 常见问题

### 游戏画面停在「点击屏幕中央加载游戏」

检查以下几点：

1. ROM 文件是否存在于 `public/nes-rom/` 目录下
2. `themeConfig` 中的 `url` 路径是否正确（以 `/` 开头，不含 `public`）
3. 打开浏览器开发者工具的 Network 面板，查看 `.nes` 文件请求是否返回 200
4. 文件名包含中文时，确保 URL 编码正确（浏览器会自动处理，但配置里写原文即可）

### 切换游戏后存档没了

存档通过 `savePrefix` 隔离，切换游戏会读取新游戏的存档。如果新游戏没有存档，会显示空状态。切回原来的游戏，存档还在。

### 录像播放时角色乱跑

录像与 ROM 版本不匹配。TAS 录像只能配合原版 ROM 使用，修改版 ROM（无敌版等）无法正常回放。

### 移动端无法操作

NES 模拟器依赖键盘，移动端不支持。建议在桌面浏览器中使用，或连接蓝牙手柄。

## 下一步

- [配置参考：nes](/config/nes) — 所有配置字段的完整说明
- [CLI 命令行工具](/guide/cli) — init 命令的完整选项
- [自定义页面](/guide/pages) — 如何创建更多工具页面
