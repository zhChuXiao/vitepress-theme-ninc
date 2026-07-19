import { getAllPosts, getAllType } from 'vitepress-theme-ninc/utils'

const postData = await getAllPosts()
const tagsData = getAllType(postData)

// 标签动态路由
export default {
  paths() {
    return Object.keys(tagsData).map(key => ({
      params: { name: key.toString() }
    }))
  }
}
