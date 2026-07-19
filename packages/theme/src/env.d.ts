/// <reference types="vite/client" />

// vite-plugin-svg-icons 与 vitepress-plugin-group-icons 未提供类型声明，
// 此处补全虚拟模块的副作用导入类型（二者均无导出）
declare module 'virtual:svg-icons-register'
declare module 'virtual:group-icons.css'
