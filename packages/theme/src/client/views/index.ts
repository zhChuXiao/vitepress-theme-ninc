/**
 * 主题页面组件集中导出
 *
 * 所有主题内置页面组件都必须从此入口显式导入，以保证博客与主题包解耦，
 * 避免使用 @/views/xxx.vue 这类暴露主题内部路径的写法。
 *
 * 用法：
 *
 * ```md
 * ---
 * title: 关于本站
 * ---
 *
 * <script setup>
 * import { About } from 'vitepress-theme-ninc/views'
 * </script>
 *
 * <About />
 * ```
 */
export { default as About } from './About.vue'
export { default as Archives } from './Archives.vue'
export { default as CatOrTag } from './CatOrTag.vue'
export { default as CommentsView } from './CommentsView.vue'
export { default as Equipment } from './Equipment.vue'
export { default as Home } from './Home.vue'
export { default as NesGame } from './NesGame.vue'
export { default as Post } from './Post.vue'
export { default as Page } from './Page.vue'
export { default as Project } from './Project.vue'
export { default as Redirect } from './Redirect.vue'
export { default as Thanks } from './Thanks.vue'
export { default as BackgroundCanvas2d } from './BackgroundCanvas2d.vue'
export { default as BackgroundCanvas } from './BackgroundCanvas.vue'
