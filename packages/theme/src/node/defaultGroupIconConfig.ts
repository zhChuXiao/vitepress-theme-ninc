/**
 * 代码组图标默认配置
 *
 * 映射代码语言/文件类型到 iconify 图标，由 vitepress-plugin-group-icons 渲染。
 * 用户可在 defineConfig 第三参数中通过 groupIconConfig 覆盖或扩展。
 */
export const defaultGroupIconConfig: Record<string, string> = {
  javascript: 'logos:javascript',
  java: 'logos:java',
  ts: 'logos:typescript-icon',
  js: 'logos:javascript',
  md: 'vscode-icons:file-type-markdown',
  json: 'vscode-icons:file-type-json',
  sass: 'vscode-icons:file-type-sass',
  less: 'vscode-icons:file-type-less',
  scss: 'vscode-icons:file-type-scss',
  css: 'logos:css-3',
  xml: 'vscode-icons:file-type-xml',
  html: 'vscode-icons:file-type-html',
  sh: 'vscode-icons:file-type-shell',
  py: 'vscode-icons:file-type-python',
  sql: 'vscode-icons:file-type-sql',
  '.c': 'vscode-icons:file-type-c',
  '.h': 'vscode-icons:file-type-c',
  '.cpp': 'vscode-icons:file-type-cpp',
  '.hpp': 'vscode-icons:file-type-cpp',
  '.go': 'vscode-icons:file-type-go',
  '.cs': 'vscode-icons:file-type-csharp',
  license: 'vscode-icons:file-type-license',
  '.php': 'vscode-icons:file-type-php3',
  rust: 'vscode-icons:file-type-rust',
  '.txt': 'vscode-icons:file-type-text',
  mdx: 'vscode-icons:file-type-mdx',
  'robots.txt': 'vscode-icons:file-type-robots',
  gitignore: 'vscode-icons:file-type-git',
  dockerignore: 'vscode-icons:file-type-docker',
  vercel: 'vscode-icons:file-type-vercel',
  'nginx.conf': 'vscode-icons:file-type-nginx',
  dockerfile: 'vscode-icons:file-type-docker',
  yaml: 'vscode-icons:file-type-yaml',
  yml: 'vscode-icons:file-type-yaml',
  commitlint: 'vscode-icons:file-type-commitlint',
  '.prettier': 'vscode-icons:file-type-prettier',
  '.stylelint': 'vscode-icons:file-type-stylelint',
  // Angular 文件类型：使用关键词匹配（不含点），避免被 ts/js 关键词拦截
  // 插件按 key 长度降序匹配关键词，component(9) 等比 ts(2) 长，会优先匹配
  // .ts/.js 版本统一用 .ts 版本图标（Angular 主推 TypeScript，图标差异极小）
  component: 'vscode-icons:file-type-ng-component-ts2',
  module: 'vscode-icons:file-type-ng-module-ts2',
  service: 'vscode-icons:file-type-ng-service-ts2',
  directive: 'vscode-icons:file-type-ng-directive-ts2',
  pipe: 'vscode-icons:file-type-ng-pipe-ts2',
  guard: 'vscode-icons:file-type-ng-guard-ts',
  interceptor: 'vscode-icons:file-type-ng-interceptor-ts',
  routing: 'vscode-icons:file-type-ng-routing-ts2',
  '.jsx': 'vscode-icons:file-type-reactjs',
  '.tsx': 'vscode-icons:file-type-reactts',
  '.mm': 'vscode-icons:file-type-objectivec'
}
