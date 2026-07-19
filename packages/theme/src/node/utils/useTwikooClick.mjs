// 存储事件监听器和DOM元素的引用
let equipment_good_things = null
let nameBox = null
let nameList = null
let boundItems = new Map()


const itemClick = (item) => () => {
  // 点击的blockquote里的标题
  let text = item.querySelector('p strong').textContent
  let index = nameList.indexOf(text)

  let goodDom = nameBox[index]
  // 先移除所有元素的闪烁类
  nameBox.forEach(box => box.classList.remove('flash-highlight'))

  // 滚动到目标位置
  goodDom.scrollIntoView({ behavior: 'smooth', block: 'center' })

  // 等待滚动完成后添加闪烁效果
  setTimeout(() => {
    goodDom.classList.add('flash-highlight')
    // 动画结束后移除类
    setTimeout(() => {
      goodDom.classList.remove('flash-highlight')
    }, 3000) // 3000ms = 3次闪烁的总时间
  }, 500) // 给滚动预留1000ms的时间
}

const twikooClick = () => {
  // 清理之前的事件绑定
  cancelTwikooClick()
  
  // 重新获取DOM元素
  equipment_good_things = document.querySelectorAll('.tk-content-expand blockquote')
  nameBox = document.querySelectorAll('.equipment-item-content-item')
  nameList = Array.from(nameBox).map(i => i.querySelector('.equipment-item-content-item-name').textContent)

  // 绑定事件
  equipment_good_things.forEach(item => {
    item.style.cursor = 'var(--main-pointer-cursor)'
    const handler = itemClick(item)
    boundItems.set(item, handler)
    item.addEventListener('click', handler)
  })
}

const cancelTwikooClick = () => {
  if (equipment_good_things) {
    equipment_good_things.forEach(item => {
      const handler = boundItems.get(item)
      if (handler) {
        item.removeEventListener('click', handler)
        boundItems.delete(item)
      }
    })
  }
  // 清理引用
  equipment_good_things = null
  nameBox = null
  nameList = null
}

export { twikooClick, cancelTwikooClick }

