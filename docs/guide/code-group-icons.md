# 代码组图标

本主题集成了 [vitepress-plugin-group-icons](https://github.com/sapphi-red/vitepress-plugin-group-icons)，可在 VitePress 的代码组（code group）标签上自动显示对应的语言 / 文件类型图标，**开箱即用，无需任何配置**。

## 效果预览

在 Markdown 中使用 `::: code-group` 语法编写代码组时，标签页会自动匹配并显示图标。下面是实际渲染效果：

::: code-group

```ts
const x: number = 1
```

```js
const x = 1
```

:::

::: code-group

```sh [pnpm]
pnpm install
```

```sh [npm]
npm install
```

```sh [yarn]
yarn install
```

:::

上面代码组的 Markdown 源码如下：

````md
::: code-group

```ts
const x: number = 1
```

```js
const x = 1
```

:::

::: code-group

```sh [pnpm]
pnpm install
```

```sh [npm]
npm install
```

```sh [yarn]
yarn install
```

:::
````

## 工作原理

主题包内置了 58 条 **语言 / 文件类型 → iconify 图标** 的默认映射（见 [defaultGroupIconConfig.ts](https://github.com/zhChuXiao/vitepress-theme-ninc/blob/main/packages/theme/src/node/defaultGroupIconConfig.ts)）。插件会根据代码组中每个代码块的 **标签文本** 或 **语言标识符** 匹配映射表，匹配成功后在标签前渲染对应的 iconify 图标。

### 匹配规则

插件按以下优先级匹配：

1. **标签文本完全匹配**：` ```sh [pnpm] ` 中的 `pnpm`
2. **语言标识符匹配**：` ```ts ` 中的 `ts`、` ```js ` 中的 `js`

例如，以下代码组中 `ts` 标签会匹配到 `logos:typescript-icon` 图标：

````md
::: code-group

```ts [TypeScript]
const x: number = 1
```

```js [JavaScript]
const x = 1
```

:::
````

## 默认支持的图标

安装主题后，以下语言 / 文件类型**自动显示图标**，无需配置。下方每个代码组都是实际渲染效果，可直接参考。

### 编程语言

::: code-group

```javascript [javascript]
const message = 'Hello JavaScript'
```

```js [js]
const message = 'Hello JS'
```

```ts [ts]
const message: string = 'Hello TS'
```

```java [java]
String message = "Hello Java";
```

```py [py]
message = 'Hello Python'
```

```rust [rust]
let message = "Hello Rust";
```

```sql [sql]
SELECT 'Hello SQL' AS message;
```

```sh [sh]
echo "Hello Shell"
```

:::

### C / C++ / Go / C# / PHP

这些图标通过**文件扩展名**匹配，代码块标签需写成文件名形式（如 `[main.c]`）：

::: code-group

```c [main.c]
int main(void) { return 0; }
```

```c [header.h]
int add(int, int);
```

```cpp [main.cpp]
int main() { return 0; }
```

```cpp [header.hpp]
int add(int, int);
```

```go [main.go]
package main
func main() {}
```

```csharp [Program.cs]
class Program { static void Main() {} }
```

```php [index.php]
<?php echo 'Hello PHP';
```

```objc [main.mm]
int main() { return 0; }
```

:::

### Web 与样式

::: code-group

```css [css]
.btn { color: #42b883; }
```

```scss [scss]
.btn { color: #42b883; }
```

```sass [sass]
.btn color: #42b883
```

```less [less]
@primary: #42b883;
.btn { color: @primary; }
```

```html [html]
<button class="btn">Click</button>
```

```xml [xml]
<item key="value">Hello</item>
```

:::

### React（.jsx / .tsx）

通过**文件扩展名**匹配：

::: code-group

```jsx [App.jsx]
export default function App() {
  return <div>Hello React</div>
}
```

```tsx [App.tsx]
export default function App(): JSX.Element {
  return <div>Hello React + TS</div>
}
```

:::

### 数据与文档

::: code-group

```json [package.json]
{ "name": "demo", "version": "1.0.0" }
```

```yaml [config.yaml]
name: demo
version: 1.0.0
```

```yaml [config.yml]
name: demo
version: 1.0.0
```

```md [readme.md]
# Hello Markdown
```

```mdx [page.mdx]
# Hello MDX
```

```txt [notes.txt]
Hello plain text
```

:::

### 配置与工程文件

工程类文件通过**文件名**匹配，代码块标签需写成完整文件名：

::: code-group

```gitignore [.gitignore]
node_modules
dist
```

```dockerignore [.dockerignore]
node_modules
.git
```

```dockerfile [Dockerfile]
FROM node:20
```

```nginx [nginx.conf]
server {
  listen 80;
}
```

```json [vercel.json]
{ "builds": [{ "src": "index.js" }] }
```

```text [LICENSE]
MIT License
Copyright (c) 2026
```

```js [commitlint.config.js]
module.exports = { extends: ['@commitlint/config-conventional'] }
```

```js [.prettierrc.js]
module.exports = { semi: false }
```

```js [.stylelintrc.js]
module.exports = { extends: ['stylelint-config-standard'] }
```

```text [robots.txt]
User-agent: *
Disallow: /admin
```

:::

### 包管理器

`pnpm` / `yarn` / `npm` 通过**标签文本**匹配，属于自定义映射示例（见下一节）：

::: code-group

```sh [pnpm]
pnpm install
```

```sh [yarn]
yarn install
```

```sh [npm]
npm install
```

:::

### Vue / Nuxt

通过**标签文本**匹配，同样是自定义映射示例：

::: code-group

```vue [vue]
<template><div>Hello Vue</div></template>
```

```vue [nuxt]
<template><div>Hello Nuxt</div></template>
```

:::

### Angular 文件类型

Angular 的各类文件通过**关键词**匹配（`component`、`module`、`service`、`directive`、`pipe`、`guard`、`interceptor`、`routing`），标签文本中包含这些关键词即会显示对应图标：

::: code-group

```ts [app.component.ts]
@Component({ selector: 'app-root', template: '<div/>' })
export class AppComponent {}
```

```ts [app.module.ts]
@NgModule({ declarations: [] })
export class AppModule {}
```

```ts [app.service.ts]
@Injectable({ providedIn: 'root' })
export class AppService {}
```

```ts [app.directive.ts]
@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {}
```

:::

::: code-group

```ts [app.pipe.ts]
@Pipe({ name: 'appFilter' })
export class FilterPipe implements PipeTransform {}
```

```ts [app.guard.ts]
@Injectable()
export class AuthGuard implements CanActivate {}
```

```ts [app.interceptor.ts]
@Injectable()
export class LogInterceptor implements HttpInterceptor {}
```

```ts [app.routing.ts]
const routes: Routes = [{ path: '', component: HomeComponent }]
```

:::

### 完整对照表

| 类别 | 支持的标识 |
|------|-----------|
| **语言** | `javascript` / `js`、`ts`、`java`、`py`、`rust`、`css`、`html`、`xml`、`sql`、`sh` |
| **C / C++ / Go / C# / PHP / ObjC** | `.c`、`.h`、`.cpp`、`.hpp`、`.go`、`.cs`、`.php`、`.mm` |
| **React** | `.jsx`、`.tsx` |
| **样式** | `sass`、`scss`、`less`、`css` |
| **数据格式** | `json`、`yaml` / `yml`、`md` / `mdx`、`.txt` |
| **工程文件** | `gitignore`、`dockerignore`、`dockerfile`、`nginx.conf`、`vercel`、`license`、`commitlint`、`.prettier`、`.stylelint`、`robots.txt` |
| **Angular** | `component`、`module`、`service`、`directive`、`pipe`、`guard`、`interceptor`、`routing`（关键词匹配） |
| **包管理器（自定义示例）** | `pnpm`、`yarn`、`npm` |
| **Vue 生态（自定义示例）** | `vue`、`nuxt` |

::: tip 两种匹配方式
- **语言标识符匹配**：代码块开头的 ` ```ts `，直接匹配 `ts` key
- **标签文本匹配**：` ```sh [pnpm] ` 中的 `pnpm`，或 ` ```c [main.c] ` 中的 `main.c`（文件扩展名类 key 会做后缀匹配）
:::


## 自定义图标映射

如果默认映射不满足需求，你可以在 `defineConfig` 的第三参数中传入 `groupIconConfig` 来 **覆盖或追加** 映射项。传入的配置会与默认配置合并（用户配置优先）。

### 示例：添加 Vue 和 Nuxt 图标

```ts
// .vitepress/config.mts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from './themeConfig'

export default defineConfig(
  {
    // VitePress 顶层配置
  },
  themeConfig,
  {
    // 追加自定义图标映射（与默认配置合并，同名 key 会覆盖默认值）
    groupIconConfig: {
      vue: 'logos:vue',
      nuxt: 'logos:nuxt-icon',
      pnpm: 'vscode-icons:file-type-pnpm',
      yarn: 'vscode-icons:file-type-yarn',
      npm: 'vscode-icons:file-type-npm'
    }
  }
)
```

配置后，在代码组中使用这些标识即可显示对应图标。本文档站已配置了 `pnpm` / `yarn` / `npm` 图标，效果如下：

::: code-group

```sh [pnpm]
pnpm install
```

```sh [yarn]
yarn install
```

```sh [npm]
npm install
```

:::

对应的 Markdown 源码：

````md
::: code-group

```sh [pnpm]
pnpm install
```

```sh [yarn]
yarn install
```

```sh [npm]
npm install
```

:::
````

### 示例：从 JSON 文件导入

如果你的映射较多，可以将配置放在单独的 JSON 文件中：

```json
// .vitepress/my-icons.json
{
  "vue": "logos:vue",
  "nuxt": "logos:nuxt-icon",
  "pnpm": "vscode-icons:file-type-pnpm"
}
```

```ts
// .vitepress/config.mts
import { defineConfig } from 'vitepress-theme-ninc/defineConfig'
import { themeConfig } from './themeConfig'
import myIcons from './my-icons.json'

export default defineConfig(
  {},
  themeConfig,
  {
    groupIconConfig: myIcons
  }
)
```

## 查找 iconify 图标名称

图标使用 [iconify](https://iconify.design/) 图标集，格式为 `图标集名:图标名`。常用的图标集有：

| 图标集 | 说明 | 示例 |
|--------|------|------|
| `logos` | 品牌Logo（彩色） | `logos:vue`、`logos:typescript-icon`、`logos:javascript` |
| `vscode-icons` | VS Code 文件类型图标 | `vscode-icons:file-type-json`、`vscode-icons:file-type-python` |

### 查找方法

1. 访问 [iconify.design](https://iconify.design/)
2. 在搜索框输入关键词（如 `vue`、`python`、`json`）
3. 找到合适的图标后，复制其完整名称（如 `logos:vue`）
4. 将名称填入 `groupIconConfig` 的值中

::: tip 图标集前缀很重要
`logos:vue` 和 `vscode-icons:vue` 是不同的图标。`logos` 是彩色品牌 Logo，`vscode-icons` 是 VS Code 风格的文件图标。根据你的视觉偏好选择。
:::

## 关闭代码组图标

如果你不需要代码组图标功能，可以在 `defineConfig` 第三参数中关闭该插件：

```ts
export default defineConfig(
  {},
  themeConfig,
  {
    plugins: {
      groupIcons: false  // 关闭代码组图标插件
    }
  }
)
```

关闭后，代码组仍然正常工作，只是标签前不会显示图标。

## 配置项参考

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `groupIconConfig` | `Record<string, string>` | 内置 58 条映射 | 自定义图标映射，与默认配置合并 |
| `plugins.groupIcons` | `false` | — | 设为 `false` 关闭代码组图标插件 |

## 常见问题

### Q: 为什么我的代码组没有显示图标？

**排查步骤**：

1. 检查代码组语法是否正确（`::: code-group` 包裹）
2. 检查代码块的标签文本或语言标识符是否在映射表中
3. 如果使用了自定义映射，检查 iconify 图标名称是否正确（格式：`图标集:图标名`）
4. 重启 dev server（`Ctrl+C` 后重新 `pnpm dev`）

### Q: 标签文本和语言标识符哪个优先？

标签文本（`[pnpm]` 中的 `pnpm`）优先于语言标识符（` ```sh ` 中的 `sh`）。如果标签文本在映射表中找到匹配，则使用该图标；否则回退到语言标识符匹配。

### Q: 可以用自定义 SVG 图标吗？

`vitepress-plugin-group-icons` 仅支持 iconify 图标集。如果你需要使用自定义 SVG，可以：
1. 将 SVG 上传到 iconify 作为自定义图标集
2. 或使用主题的 [SVG 雪碧图功能](./configuration.md) 在其他位置展示自定义图标
