// 默认技能图标数据（首页 HomeTop 与关于页 About 共用）
//
// 当用户未在 themeConfig.homeTop.creativity 中配置时，使用此处的默认数据。
// 图标资源已内置在主题包 src/client/assets/icons/creativity/ 下，
// 用户无需在自己的 public 目录中放置 SVG 文件即可获得默认展示效果。
//
// 如需自定义图标，在 themeConfig.homeTop.creativity 中覆盖即可，
// icon 字段填写用户项目 public 目录下的图片路径（如 '/images/icon/vue.svg'）。

import vueIcon from '../assets/icons/creativity/vue.svg?url'
import reactIcon from '../assets/icons/creativity/react.svg?url'
import cssIcon from '../assets/icons/creativity/css3.svg?url'
import htmlIcon from '../assets/icons/creativity/html5.svg?url'
import typescriptIcon from '../assets/icons/creativity/typescript.svg?url'
import javascriptIcon from '../assets/icons/creativity/javascript.svg?url'
import sassIcon from '../assets/icons/creativity/sass.svg?url'
import nuxtIcon from '../assets/icons/creativity/nuxt.svg?url'
import tailwindcssIcon from '../assets/icons/creativity/tailwindcss.svg?url'
import gitIcon from '../assets/icons/creativity/git.svg?url'
import dockerIcon from '../assets/icons/creativity/docker.svg?url'
import photoshopIcon from '../assets/icons/creativity/photoshop.svg?url'
import nodeIcon from '../assets/icons/creativity/nodejs.svg?url'
import webpackIcon from '../assets/icons/creativity/webpack.svg?url'
import piniaIcon from '../assets/icons/creativity/pinia.svg?url'
import viteIcon from '../assets/icons/creativity/vite.svg?url'
import nginxIcon from '../assets/icons/creativity/nginx.svg?url'

import type { CreativityGroup } from '../../types/index'

const creativity: CreativityGroup[] = [
  {
    class_name: '开启创造力',
    creativity_list: [
      { name: 'Vue', color: '#b8f0ae', icon: vueIcon },
      { name: 'React', color: '#222', icon: reactIcon },
      { name: 'CSS', color: '#2c51db', icon: cssIcon },
      { name: 'HTML', color: '#e9572b', icon: htmlIcon },
      { name: 'TypeScript', color: '#007acc', icon: typescriptIcon },
      { name: 'JS', color: '#f7cb4f', icon: javascriptIcon },
      { name: 'Sass', color: '#CF649A', icon: sassIcon },
      { name: 'Nuxt', color: '#fff', icon: nuxtIcon },
      { name: 'TailwindCSS', color: '#4DB6AC', icon: tailwindcssIcon },
      { name: 'Git', color: '#df5b40', icon: gitIcon },
      { name: 'Docker', color: '#57b6e6', icon: dockerIcon },
      { name: 'Photoshop', color: '#4082c3', icon: photoshopIcon },
      { name: 'Node', color: '#333', icon: nodeIcon },
      { name: 'Webpack', color: '#2e3a41', icon: webpackIcon },
      { name: 'Pinia', color: '#fff', icon: piniaIcon },
      { name: 'Vite', color: '#937df7', icon: viteIcon },
      { name: 'Nginx', color: '#4a9a35', icon: nginxIcon }
    ]
  }
]

export default creativity
