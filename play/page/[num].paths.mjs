import { getAllPosts } from 'vitepress-theme-ninc/utils'
import { themeConfig } from '../.vitepress/themeConfig.ts'

const postData = await getAllPosts()
const postsPerPage = themeConfig.postSize
const totalPages = Math.ceil(postData.length / postsPerPage)

export default {
  paths() {
    const pages = []
    for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
      pages.push({ params: { num: pageNum.toString() } })
    }
    return pages
  }
}
