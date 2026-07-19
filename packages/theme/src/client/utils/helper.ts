import { mainStore } from '../store'
import { throttle } from 'lodash-es'

// 全局消息组件（由 unplugin-auto-import 注入），此处仅作类型占位
declare const $message: any

/**
 * 计算滚动高度和滚动百分比
 */
export const calculateScroll = throttle(
  () => {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') return false
      const store = mainStore()
      const scrollY = window.scrollY || window.pageYOffset
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = ((scrollY / totalHeight) * 100).toFixed(0)
      // 判断滚动方向
      const scrollDirection = scrollY > store.scrollData.height ? 'down' : 'up'
      // 储存计算结果
      store.scrollData = {
        height: Number(scrollY.toFixed(0)),
        percentage: Number(scrollPercentage),
        direction: scrollDirection
      }
      store.scrollDataProgress = (scrollY / totalHeight) * 100
    } catch (error) {
      console.error('计算滚动时出现错误：', error)
    }
  },
  50
)

/**
 * 平滑滚动至目标高度或元素
 * @param target - 目标高度或元素
 */
export const smoothScrolling = (target: number | HTMLElement | string = 0): boolean | void => {
  try {
    if (typeof window === 'undefined') return false
    if (typeof target === 'number') {
      // 滚动至指定高度
      window.scrollTo({ top: target, behavior: 'smooth' })
    } else if (target instanceof HTMLElement) {
      // 滚动至元素
      const top = target.getBoundingClientRect().top - 80
      window.scrollTo({ top, behavior: 'smooth' })
    } else if (typeof target === 'string' && target.startsWith('#')) {
      // 滚动至 ID
      const element = document.querySelector(target)
      if (element) {
        const top = (element as HTMLElement).getBoundingClientRect().top - 80
        window.scrollTo({ top, behavior: 'smooth' })
      }
    } else {
      // 滚动至顶部
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (error) {
    console.error('平滑滚动出错：', error)
  }
}

/**
 * 格式化时间戳为相应的日期格式
 * @param timestamp - 时间戳（以毫秒为单位）
 * @return 返回日期格式的字符串
 */
export const formatTimestamp = (timestamp: number): string => {
  let now = new Date()
  // 获取今天0点
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  // 获取昨天0点
  let yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24)
  let targetDate = new Date(timestamp)
  // 是否为昨天
  if (targetDate >= yesterday && targetDate < today) {
    return '1天前'
  } else {
    let difference = Math.floor((today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24))
    if (difference <= 0) {
      return '今日内'
    } else if (difference < 7) {
      return `${difference}天前`
    } else {
      let year = targetDate.getFullYear()
      let month = targetDate.getMonth() + 1
      let day = targetDate.getDate()
      if (year === now.getFullYear()) {
        return `${year}-${month}-${day}`
      } else {
        return `${year}-${month}-${day}`
      }
    }
  }
}

/**
 * 计算给定日期与当前日期相差的天数
 * @param dateStr - 要计算差值的日期，为字符串形式
 * @returns 天数差值
 */
export const daysFromNow = (dateStr: string): number => {
  const currentDate = new Date()
  const inputDate = new Date(dateStr)
  const timeDiff = currentDate.getTime() - inputDate.getTime()
  const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  return dayDiff
}

interface PostItem {
  regularPath?: string
  [key: string]: any
}

let lastIndex = -1
/**
 * 随机前往一篇文章
 * @param postData - 文章数据
 * @returns 随机文章路径
 */
export const shufflePost = (postData: PostItem[]): string => {
  let randomIndex: number
  do {
    // 随机生成一个索引值
    randomIndex = Math.floor(Math.random() * postData.length)
  } while (randomIndex === lastIndex && postData.length > 1)
  // 更新上一次的索引值
  lastIndex = randomIndex
  // 随机文章
  const randomPost = postData[randomIndex]
  // 跳转到随机文章
  return randomPost.regularPath as string
}

/**
 * 复制文本到剪贴板
 * @param data 要复制到剪贴板的文本
 */
export const copyText = async (data: string): Promise<void> => {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(data)
      $message.success('复制成功，在转载时请标注本文地址')
    } catch (error) {
      console.error('复制出错：', error)
      $message.error('复制出现错误，请重试')
    }
  } else {
    // 如果浏览器不支持 navigator.clipboard
    const textArea = document.createElement('textarea')
    textArea.value = data
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      $message.success('复制成功，在转载时请标注本文地址')
    } catch (err) {
      console.error('复制出错：', err)
      $message.error('复制出现错误，请重试')
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

/**
 * 图片 URL 复制到剪贴板
 * @param imageURL 要复制到剪贴板的图片的URL
 */
export const copyImage = async (imageURL: string): Promise<void> => {
  if (!navigator.clipboard) {
    console.error('浏览器不支持 Clipboard API')
    return
  }
  try {
    const response = await fetch(imageURL)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ])
    $message.success('图片已复制到剪贴板')
  } catch (error) {
    console.error('复制图片出错：', error)
    $message.error('复制图片错误，请重试')
  }
}

/**
 * 下载图片
 * @param imageUrl 要下载的图片的URL地址
 */
export const downloadImage = (imageUrl: string): void => {
  try {
    // 获取当前日期并转换为字符串形式，作为文件名
    const date = new Date()
    const timestamp = date.toISOString().replace(/[:.]/g, '-')
    const imageName = `image-${timestamp}.jpg`
    const anchor = document.createElement('a')
    anchor.download = imageName
    anchor.href = imageUrl
    anchor.target = '_blank'
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  } catch (error) {
    console.error('下载图片出错：', error)
    $message.error('下载图片错误，请重试')
  }
}

/**
 * 获取根据当前时间的问候语
 * @returns 当前时间对应的问候语
 */
export const getGreetings = (): string => {
  const hour = new Date().getHours()
  let hello: string
  if (hour < 6) {
    hello = '凌晨好，昨晚睡得怎么样？'
  } else if (hour < 9) {
    hello = '早上好，今天也要开心哦！'
  } else if (hour < 12) {
    hello = '上午好，今天也要加油哦！'
  } else if (hour < 14) {
    hello = '中午好，吃饱了精神好！'
  } else if (hour < 17) {
    hello = '下午好，继续加油！'
  } else if (hour < 19) {
    hello = '傍晚好，是时候放松一下了！'
  } else if (hour < 22) {
    hello = '晚上好，是时候休息了！'
  } else {
    hello = '夜深了，明天继续加油！'
  }
  return hello
}

// 打乱数组 - Fisher-Yates 洗牌算法
export const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    // 解构赋值进行元素互换
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// 特殊纪念日置灰
export const specialDayGray = (): void => {
  const specialDays = [
    // { date: '4-4', name: '清明节' },
    { date: '5-12', name: '汶川大地震纪念日' },
    { date: '7-7', name: '中国人民抗日战争纪念日' },
    { date: '9-18', name: '九·一八事变纪念日' },
    { date: '12-13', name: '南京大屠杀死难者国家公祭日' }
  ]
  // 获取当天日期
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const currentDate = `${month}-${day}`
  // 查找纪念日
  const specialDay = specialDays.find((d) => d.date === currentDate)
  if (specialDay) {
    document.documentElement.classList.add('gray')
    if (typeof $message !== 'undefined') {
      $message.info(`今天是${specialDay.name}，特此默哀`, {
        duration: 8000,
        close: true
      })
    }
  }
}

/**
 * 获取图片的主色调
 * @param imageUrl - 图片的URL地址
 * @param callback - 回调函数，返回主色调的RGB字符串
 */
export const getDominantColor = (imageUrl: string, callback: (color: string) => void): void => {
  const img = new Image()
  img.crossOrigin = 'Anonymous' // 允许跨域加载图片

  img.onload = function () {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    const shrinkFactor = Math.max(img.width, img.height) > 300 ? Math.max(img.width, img.height) / 300 : 1
    const width = img.width / shrinkFactor
    const height = img.height / shrinkFactor
    canvas.width = width
    canvas.height = height
    context.drawImage(img, 0, 0, width, height)

    const imageData = context.getImageData(0, 0, width, height)
    const data = imageData.data
    const colors: number[][] = []

    for (let i = 0; i < data.length; i += 4) {
      colors.push([data[i], data[i + 1], data[i + 2]])
    }

    const dominantColor = medianCut(colors, 1)[0]
    callback(`rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`)
  }

  img.src = imageUrl
}

/**
 * 获取图片的主色调并添加透明度
 * @param imageUrl - 图片的URL地址
 * @param callback - 回调函数，返回主色调的RGBA字符串
 * @param alpha - 透明度值（0到1之间）
 * @param method - 获取主色调的方法，可选值为'mostFrequent'或'medianCut'
 */
export const getDominantColorWithAlpha = (
  imageUrl: string,
  callback: (color: string) => void,
  alpha = 1,
  method: 'mostFrequent' | 'medianCut' = 'medianCut'
): void => {
  const img = new Image()
  img.crossOrigin = 'Anonymous' // 允许跨域加载图片

  img.onload = function () {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    const shrinkFactor = Math.max(img.width, img.height) > 300 ? Math.max(img.width, img.height) / 300 : 1
    const width = img.width / shrinkFactor
    const height = img.height / shrinkFactor
    canvas.width = width
    canvas.height = height
    context.drawImage(img, 0, 0, width, height)

    const imageData = context.getImageData(0, 0, width, height)
    const data = imageData.data
    const colors: number[][] = []

    for (let i = 0; i < data.length; i += 4) {
      colors.push([data[i], data[i + 1], data[i + 2]])
    }

    let dominantColor: number[]

    if (method === 'mostFrequent') {
      dominantColor = getMostFrequentColor(colors)
    } else {
      // 默认使用中值切割算法
      dominantColor = medianCut(colors, 1)[0]
    }

    callback(`rgba(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]}, ${alpha})`)
  }

  img.src = imageUrl
}

/**
 * 获取颜色数组中出现最多的颜色
 * @param colors - 颜色数组
 * @returns 出现最多的颜色的RGB数组
 */
function getMostFrequentColor(colors: number[][]): number[] {
  // 用于存储颜色及其出现次数
  const colorCounts: Record<string, { count: number; r: number; g: number; b: number }> = {}

  // 合并相似颜色以减少计算量
  // 这里将RGB值向下取整到最接近的10的倍数
  colors.forEach((color) => {
    const r = Math.floor(color[0] / 10) * 10
    const g = Math.floor(color[1] / 10) * 10
    const b = Math.floor(color[2] / 10) * 10

    const colorKey = `${r},${g},${b}`

    if (colorCounts[colorKey]) {
      colorCounts[colorKey].count++
      // 累加实际的RGB值以便后续计算平均值
      colorCounts[colorKey].r += color[0]
      colorCounts[colorKey].g += color[1]
      colorCounts[colorKey].b += color[2]
    } else {
      colorCounts[colorKey] = {
        count: 1,
        r: color[0],
        g: color[1],
        b: color[2]
      }
    }
  })

  // 找出出现次数最多的颜色
  let maxCount = 0
  let mostFrequentColor = [0, 0, 0]

  for (const colorKey in colorCounts) {
    const colorInfo = colorCounts[colorKey]

    if (colorInfo.count > maxCount) {
      maxCount = colorInfo.count
      // 计算这个颜色组的平均RGB值
      mostFrequentColor = [
        Math.round(colorInfo.r / colorInfo.count),
        Math.round(colorInfo.g / colorInfo.count),
        Math.round(colorInfo.b / colorInfo.count)
      ]
    }
  }

  return mostFrequentColor
}

/**
 * 使用中值切割算法获取主色调
 * @param colors - 颜色数组
 * @param depth - 递归深度
 * @returns 主色调的RGB数组
 */
function medianCut(colors: number[][], depth: number): number[][] {
  if (colors.length === 0) return [[0, 0, 0]]

  if (depth === 0 || colors.length === 1) {
    const r = colors.reduce((sum, color) => sum + color[0], 0) / colors.length
    const g = colors.reduce((sum, color) => sum + color[1], 0) / colors.length
    const b = colors.reduce((sum, color) => sum + color[2], 0) / colors.length
    return [[Math.round(r), Math.round(g), Math.round(b)]]
  }

  const componentIndex = getComponentIndex(colors)
  colors.sort((a, b) => a[componentIndex] - b[componentIndex])

  const mid = colors.length >> 1
  return [...medianCut(colors.slice(0, mid), depth - 1), ...medianCut(colors.slice(mid), depth - 1)]
}

/**
 * 获取颜色数组中变化最大的分量索引
 * @param colors - 颜色数组
 * @returns 变化最大的分量索引
 */
function getComponentIndex(colors: number[][]): number {
  const ranges = colors.reduce(
    (acc, color) => {
      acc[0] = Math.max(acc[0], color[0]) - Math.min(acc[0], color[0])
      acc[1] = Math.max(acc[1], color[1]) - Math.min(acc[1], color[1])
      acc[2] = Math.max(acc[2], color[2]) - Math.min(acc[2], color[2])
      return acc
    },
    [0, 0, 0]
  )

  return ranges.indexOf(Math.max(...ranges))
}

/**
 * 将RGB或RGBA颜色转换为十六进制颜色
 * @param str - 颜色字符串，可以是RGB或RGBA格式
 * @returns 十六进制颜色字符串
 */
export const colorHex = (str: string): string => {
  const hexRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

  if (/^(rgb|RGB|rgba|RGBA)/.test(str)) {
    const aColor = str.replace(/(?:\(|\)|rgba|RGBA|rgb|RGB)*/g, '').split(',')
    const hexColor = aColor.slice(0, 3).reduce((acc, val) => {
      const hex = Number(val).toString(16).padStart(2, '0')
      return acc + hex
    }, '#')

    if (aColor.length === 4) {
      // 处理透明度
      const alpha = Math.round(parseFloat(aColor[3]) * 255).toString(16).padStart(2, '0')
      return hexColor + alpha
    }

    return hexColor
  }

  if (hexRegex.test(str)) {
    if (str.length === 4) {
      return Array.from(str.slice(1)).reduce((acc, val) => acc + val + val, '#')
    }
    return str
  }

  return str
}

/**
 * 调整颜色亮度，支持带透明度的十六进制颜色
 * @param col - 颜色字符串
 * @param amt - 调整量
 * @returns 调整后的颜色字符串
 */
export const LightenDarkenColor = (col: string, amt: number): string => {
  const usePound = col.startsWith('#')

  if (usePound) {
    col = col.slice(1)
  }

  let alpha = ''
  if (col.length === 8) {
    // 提取透明度部分
    alpha = col.slice(6)
    col = col.slice(0, 6)
  }

  let num = parseInt(col, 16)

  const processColor = (colorValue: number, amount: number): number => {
    colorValue += amount
    return colorValue > 255 ? 255 : colorValue < 0 ? 0 : colorValue
  }

  const r = processColor(num >> 16, amt)
  const g = processColor((num >> 8) & 0x00ff, amt)
  const b = processColor(num & 0x0000ff, amt)

  const newColor = (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0')

  return (usePound ? '#' : '') + newColor + alpha
}

/**
 * 判断颜色是否为浅色
 * @param color - 颜色字符串，可以是RGB或十六进制格式
 * @returns 如果是浅色则返回true，否则返回false
 */
export const isLightColor = (color: string): boolean => {
  let r: number, g: number, b: number

  if (/^(rgb|RGB)/.test(color)) {
    // RGB格式
    const rgbValues = color.match(/\d+/g)
    if (!rgbValues) throw new Error('Invalid color format')
    r = parseInt(rgbValues[0], 10)
    g = parseInt(rgbValues[1], 10)
    b = parseInt(rgbValues[2], 10)
  } else if (/^#([0-9a-fA-F]{3}){1,2}$/.test(color)) {
    // 十六进制格式
    if (color.length === 4) {
      r = parseInt(color[1] + color[1], 16)
      g = parseInt(color[2] + color[2], 16)
      b = parseInt(color[3] + color[3], 16)
    } else {
      r = parseInt(color.slice(1, 3), 16)
      g = parseInt(color.slice(3, 5), 16)
      b = parseInt(color.slice(5, 7), 16)
    }
  } else {
    throw new Error('Invalid color format')
  }

  // 计算亮度
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b
  return brightness > 128
}

function replaceAll(string: string, search: string, replace: string): string {
  return string.split(search).join(replace)
}

export const commentText = function (txt: string): void {
  const postCommentDom = document.getElementById('main-comment')
  if (!postCommentDom) return
  const domTop = postCommentDom.offsetTop
  window.scrollTo(0, domTop - 80)
  if (txt === 'undefined' || txt === 'null') txt = ' '
  function setText() {
    setTimeout(() => {
      const input = document.getElementsByClassName('el-textarea__inner')[0] as HTMLTextAreaElement | undefined
      if (!input) {
        setText()
        return
      }
      const evt = document.createEvent('HTMLEvents')
      evt.initEvent('input', true, true)
      const inputValue = replaceAll(txt, '\n', '\n> ')
      input.value = '> ' + inputValue + '\n\n'
      input.dispatchEvent(evt)
      input.focus()
      input.setSelectionRange(-1, -1)
      const tips = document.getElementById('comment-tips')
      if (tips) {
        tips.classList.add('show')
      }
    }, 100)
  }
  setText()
}
