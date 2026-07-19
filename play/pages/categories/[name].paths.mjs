import { getAllPosts, getAllCategories } from 'vitepress-theme-ninc/utils'

const postData = await getAllPosts()
const categoriesData = getAllCategories(postData)

export default {
  paths() {
    return Object.keys(categoriesData).map(key => ({
      params: { name: key.toString() }
    }))
  }
}
