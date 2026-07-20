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

![功能快捷键 + 防误触模式](/images/article/nes-tas-shortcuts.png)

::: info P2 玩家控制
支持双人游戏。P2 使用方向键移动，数字小键盘的 `1`（B）、`2`（A）、`4`（C 连发）、`5`（D 连发）。连接手柄后可直接使用，无需额外配置。
:::


### 自定义按键

如果默认按键不顺手，可以在页面上直接改键，无需改配置文件：

1. 点击「键盘按键说明」区域右上角的 **自定义** 按钮，进入改键模式
2. 点击想改的按键（边框会高亮，提示「按新键…」）
3. 按下键盘上的任意键，立即生效
4. 改完后点击 **完成** 退出，或点击 **恢复默认** 一键还原

::: tip 改键说明
- 改键记录保存在浏览器 `localStorage` 里，刷新页面不会丢失
- 不同游戏（按 `savePrefix` 区分）的改键记录相互独立
- 支持字母、数字、方向键、小键盘、F1-F12、标点符号、修饰键等几乎所有键盘按键
- 修饰键显示为符号：`⇧L`/`⇧R`（左右 Shift）、`⌃L`/`⌃R`（左右 Ctrl）、`⌥L`/`⌥R`（左右 Alt）、`⌘L`/`⌘R`（左右 Meta）
:::

![键盘按键说明面板](/images/article/nes-keymap-custom.png)


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
作者的 [blog.ninc.top/pages/nes](https://blog.ninc.top/pages/nes) 在线演示站内置了 27 款游戏（含马里奥、魂斗罗、松鼠大战、冒险岛、洛克人、坦克大战、三目童子、恶魔城等多个系列的原版与修改版），可直接体验各类游戏在模拟器中的表现。
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

## 第五步：金手指（可选）

金手指（Cheat Code）用于修改游戏内存中的数值，实现无敌、无限命、跳关等效果。主题兼容 `VirtuaNES` 的金手指格式：`XXXX-YY-ZZ`。

| 段 | 含义 | 示例 |
| --- | --- | --- |
| `XXXX` | 内存地址（16 进制 4 位） | `079F` |
| `Y` | 修改类型（0=直接写、1=每帧写、2=比较后再写、3=每帧比较后再写） | `0` |
| `Z` | 数值长度（1 或 2 字节） | `1` |
| `ZZ` | 实际数值（16 进制，长度需匹配 `Z`） | `01` |

例：`079F-01-01` 表示「每帧把地址 `0x079F` 写为 `0x01`」（超级马里奥无敌）。

![金手指浮层面板](/images/article/nes-cheats.png)

### 运行时使用金手指

1. 点击游戏画面上方的 **金手指** 按钮，弹出浮层面板
2. 在输入框中填入金手指代码（格式 `XXXX-YY-ZZ`）和备注（可选），点击 **添加**
3. 列表中点击 **开启** / **关闭** 切换金手指生效状态
4. 点击 **删除** 按钮移除单个金手指，或 **全部关闭** 一键关闭所有已启用的金手指（列表本身保留，便于再次开启）

::: tip 金手指存储
- 金手指列表保存在浏览器 `localStorage` 里，按 `savePrefix` 隔离，不同游戏互不影响
- 关闭浏览器或刷新页面后，金手指列表仍在，但启用状态会重置为关闭，需要重新点击「开启」才会生效
- 同时启用的金手指数量没有限制，但建议只开必要的，避免游戏异常
:::

### 在 themeConfig 中预设金手指

如果你想让所有访客都能直接用某些金手指（不用自己查代码），可以在 `themeConfig` 里给 ROM 配置预设：

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
        // 预设金手指，首次进入页面时会自动加入金手指列表（默认关闭）
        cheats: [
          { code: '079F-01-01', name: '无敌', desc: '马里奥持续无敌' },
          { code: '07F5-01-09', name: '9 条命', desc: '生命数锁定为 9' },
          { code: '075A-02-0032', name: '时间锁定 50', desc: '每关时间保持 50' }
        ]
      }
    ]
  }
})
```

配置后，访客首次打开该游戏时，预设金手指会**自动出现在金手指列表里（默认关闭）**，用户只需点击「开启」即可生效，无需手动输入代码。访客可以自由删除不需要的预设，也可以在列表里继续添加自定义金手指。

::: warning 金手指代码兼容性
- 金手指代码与 ROM 版本强相关，修改版 ROM（如无敌版、汉化版）使用原版金手指可能无效或导致游戏崩溃
- 配置预设金手指前，请先用对应 ROM 测试代码是否有效
- 金手指格式参考 VirtuaNES 标准，可在网上搜索「游戏名 + 金手指代码」获取
:::

## 上传自定义 ROM

除了配置里预设的游戏，访客还可以在页面上临时上传自己的 ROM：

游戏画面右侧有一个拖放区域，支持两种方式：

- **拖放**：把 `.nes` 文件拖到虚线框内
- **点击**：点击虚线框区域，选择文件

![上传自定义 ROM 区域](/images/article/nes-upload-rom.png)

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

