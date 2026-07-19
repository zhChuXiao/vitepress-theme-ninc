# 加密文章

私有笔记、内部文档等不希望被陌生人随意看到的内容，可通过 `crypto` 字段加密。本主题的加密机制采用**密钥文件 + 密码**双重验证，访问时需先上传本地密钥文件，再输入密码，两者都正确才会显示正文。

::: warning 纯前端加密并非绝对安全
本主题的加密在浏览器端完成，站点密钥与密码都存储在前端。它的作用是**提高陌生人访问门槛**，并非真正的安全方案。请勿用于存放密码、密钥、财务信息、个人隐私等重要数据。重要信息请使用专用的密码管理器或加密存储。

加密机制的局限性：
- 站点密钥虽然不再硬编码在主题源码中，但仍以明文形式存在你的本地密钥文件里，密钥文件泄露即等于密钥泄露
- frontmatter 中的明文密码会进入 Git 历史，源码仓库泄露即等于密码泄露
- 构建产物中虽然只存哈希值，但无法抵御同时掌握密钥文件与 Git 历史的攻击者

适合存放：技术草稿、未发布的想法、临时笔记。不适合存放：任何一旦泄露会造成实际损失的信息。
:::

## 推荐字段组合

`title` / `date` / `crypto` / `articleGPT`

## 完整示例

```md
---
title: 个人工作笔记
tags: [个人笔记]
categories: [个人笔记]
date: 2024-08-02
crypto:
  enable: true
  password: your-password
mainColor: '#84afca'
cover: /images/cover/notes-cover.jpg
description: 博主个人使用的私有文档
articleGPT: 当前文档为加密文章不提供摘要
---

# 个人工作笔记

这部分正文会被加密，未输入密码前不可见。
```

## 字段在此场景的作用

- **`crypto.enable`**：是否启用加密，设为 `true` 才会触发加密逻辑。
- **`crypto.password`**：访问密码。在 frontmatter 中写明文，构建时主题会用**站点密钥**和 HMAC-SHA256 算法将其转为哈希值，构建产物中不再包含明文密码。
- **`articleGPT` 的特殊用法**：加密仅作用于文章正文，frontmatter 中的 `title`、`description`、`cover` 仍会出现在文章列表与 SEO 中。为避免摘要泄露内容，加密文章建议显式填写 `articleGPT: 当前文档为加密文章不提供摘要`，覆盖默认回退到 `description` 的行为。

::: warning 加密仅限正文
`crypto` 不会加密 frontmatter 元信息。如果文章标题或描述本身包含敏感信息，需要在写作时自行规避，不要写进 `title` 或 `description`。
:::

## 密钥文件

加密文章采用**站点私有密钥**机制：每个站点使用自己的密钥字符串，主题不再内置任何固定密钥。这意味着 npm 包源码公开后，陌生人无法从中获取你的密钥——只有掌握你本地密钥文件的人才能解锁加密文章。

### 第一步：在站点配置中指定密钥文件

在 `.vitepress/config.mts` 的 `defineConfig` 第三参数 `options` 中配置 `cryptoSecretKeyFile`，指向一个本地文本文件路径（相对于项目根目录，也支持绝对路径）：

```ts
// .vitepress/config.mts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from './themeConfig'

export default defineConfig(
  { sitemap: { hostname: 'https://example.com' } },
  themeConfig,
  {
    cryptoSecretKeyFile: 'secret.key'  // [!code highlight]
  }
)
```

主题在构建期会读取该文件的全部内容作为站点密钥（首尾空白会被自动 `trim`），并用它对 frontmatter 中所有 `crypto.enable: true` 文章的明文密码做 HMAC-SHA256 哈希。

::: tip 未配置密钥时使用兜底密钥
若文章中存在 `crypto.enable: true`，但 `options.cryptoSecretKeyFile` 未配置，主题会使用内置的**兜底密钥**让项目正常启动，并在控制台打印警告。兜底密钥公开在 npm 包源码中，不具真正的安全保护作用——仅保证"能跑起来"。请务必配置自己的 `cryptoSecretKeyFile` 以获得真正的加密保护。
:::

### 第二步：创建本地密钥文件

在项目根目录下新建一个文本文件（文件名可自定义，但需与 `cryptoSecretKeyFile` 配置的路径一致），写入一段你自定义的字符串作为密钥内容。推荐使用足够长的随机字符串（如 32 字节以上的十六进制串或 Base64 串）。

```bash
# 示例：用 openssl 生成一段 32 字节随机字符串作为密钥
openssl rand -hex 32 > secret.key
```

也可以手动写入任意字符串，例如：

```
my-blog-secret-key-2024-please-keep-private-9f3a7c2e1b8d
```

::: danger 密钥文件必须本地妥善保管
- **不要提交到 Git 仓库**：将密钥文件路径加入 `.gitignore`（如 `secret.key`）
- **不要放在 `public/` 目录下**：`public/` 下的文件会被打包到站点，任何人都能下载
- **不要在文档、截图、日志中泄露密钥内容**
- **密钥一旦泄露，应立即更换**：重新生成密钥文件后重新构建站点，旧密钥文件无法解锁新构建的加密文章
:::

### 第三步：创建访问用的密钥文件副本

**访问者**（包括博主自己）访问加密文章时，需上传一份**内容与站点密钥完全一致**的密钥文件。建议：

- 博主本地保留一份密钥文件副本（与站点配置中指向的文件内容一致），用于自己访问加密文章
- 若需要让他人访问某些加密文章，可通过私密渠道（不是公开渠道）把密钥文件传给他们
- 密钥文件支持 `.key`、`.txt`、`.json` 三种格式：
  - `secret.key`（推荐）：文件全部内容即密钥字符串
  - `secret.txt`：同上
  - `secret.json`：`{"key": "你的密钥字符串"}` 或 `{"secretKey": "..."}` 或 `{"secret": "..."}`，主题会自动识别这三个字段

### 密钥存储

访问者上传密钥后，密钥会被加密存入浏览器的 `localStorage["global_article_secret_key"]`，有效期 7 天，绑定浏览器指纹（userAgent、语言、屏幕分辨率、时区、平台）。同一浏览器在 7 天内访问其他加密文章无需重复上传。点击页面上的「重置密钥」按钮可清除已存储的密钥。

## 访问流程

1. 访问加密文章，页面显示「文章已加密」提示
2. 上传密钥文件（拖拽到上传区或点击选择文件）
3. 密钥验证通过后，密码输入框出现
4. 输入密码，点击「解锁」
5. 密码正确则显示正文；密码错误则提示剩余尝试次数

## 防暴力破解机制

- 连续 5 次密码错误后，输入框锁定 30 秒
- 锁定状态记录在 `localStorage`，刷新页面无法绕过
- 尝试次数绑定浏览器指纹，换设备访问不共享计数
- 解密成功后，密码会被加密存入 `sessionStorage`（24 小时有效），同一浏览器会话内刷新页面无需重新输入

::: tip 解密状态与会话
密码存储在 `sessionStorage` 而非 `localStorage`，关闭浏览器标签页后即失效，下次访问需重新输入。这是有意设计，避免他人借用设备时直接看到加密内容。
:::

加密功能由 `crypto.enable: true` 触发，与文件所在目录无关。加密文章可放在 `posts/` 下任意子目录。

![加密文章访问流程](/images/article/crypto.png)


---

