import { nextTick, watch } from 'vue'
let themeChangeObserve = null
/**
 * 设置代码块折叠功能
 * @param frontmatter 前言
 * @param defaultAllFold 默认全部折叠
 * @param height 高度
 */
const cbf = (frontmatter, defaultAllFold, height) => {
  // 获取前言值
  let fm = true
  if (frontmatter.value && frontmatter.value.cbf !== undefined) {
    fm = frontmatter.value.cbf
  }
  // 获取文章里的所有代码块
  const codeblocks = document.querySelectorAll('.vp-adaptive-theme[class*="language-"]')
  // 遍历给代码块添加折叠
  codeblocks.forEach((el, index) => {
    const element = el
    if (element.offsetHeight === 0) {
      return
    }
    if (element.offsetHeight <= height) {
      return
    }
    if (Array.isArray(fm)) {
      // 如果是数组
      if (defaultAllFold) {
        if (fm.indexOf(index + 1) === -1) {
          judge(element, height)
        }
      } else {
        if (fm.indexOf(index + 1) !== -1) {
          judge(element, height)
        }
      }
    } else {
      // 如果是布尔值
      if (defaultAllFold && fm) {
        judge(element, height)
      }
    }
  })
  // 使用高刷新率动画定位到锚点
  let time = codeblocks.length
  function step() {
    if (time !== 0) {
      window.requestAnimationFrame(() => {
        jumpHashLink()
        step()
      })
      time--
    }
  }
  window.requestAnimationFrame(step)
  !themeChangeObserve && themeChangeObserver()
}
/**
 * 兼容代码块组
 * @param el 元素
 * @param height 限制高度
 */
const observer = (el, height) => {
  new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      const _el = mutation.target
      if (mutation.attributeName === 'class' && _el.classList.contains('active') && _el.offsetHeight > height) {
        fold(el, height)
      }
    })
  }).observe(el, {
    attributeFilter: ['class']
  })
}
/**
 * 判断是否是代码块组中未显示的代码块
 * @param el 元素
 * @param height 高度
 */
const judge = (el, height) => {
  const displayStatus = window.getComputedStyle(el, null).getPropertyValue('display')
  const isDetailBlock = el.parentElement.classList.contains('details')
  if (displayStatus === 'none' || isDetailBlock) {
    observer(el, height)
  } else {
    fold(el, height)
  }
}
/**
 * 折叠与展开
 * @param el 代码块元素
 * @param height 限制高度
 */
const fold = (el, height) => {
  if (el.classList.contains('fold')) {
    return
  }
  el.classList.add('fold')
  const pres = el.querySelectorAll('pre')
  pres.forEach(pre => {
    pre.style.height = height + 'px'
    pre.style.overflow = 'hidden'
  })
  el.style.marginBottom = '8px'
  el.style.borderRadius = '8px 8px 8px 8px'
  el.style.overflow = 'hidden'
  const foldBtn = document.createElement('div')
  const mask = document.createElement('div')
  mask.style.backgroundImage =
    'linear-gradient(-180deg, rgba(0, 0, 0, 0) 0%, var(--vp-code-block-bg) 100%)'
  mask.className = 'codeblocks-mask'
  // foldBtn.style.backgroundColor = 'var(--vp-code-block-bg)'
  foldBtn.className = 'fold-btn'
  foldBtn.insertAdjacentHTML(
    'afterbegin',
    `<svg t="1741706556838" class="fold-btn-icon" viewBox="0 0 1755 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4121" width="200" height="200"><path d="M220.462811 44.617143L877.431954 715.337143l665.6-679.497143A124.050286 124.050286 0 0 1 1630.071954 0c69.193143 0 125.366857 57.344 125.366857 128 0 34.523429-13.458286 65.828571-35.108571 88.795429v0.146285l-752.347429 768v-0.146285A123.904 123.904 0 0 1 877.724526 1024h-0.585143a123.904 123.904 0 0 1-90.258286-39.204571v0.146285L34.533669 216.941714l0.292571-0.438857A129.170286 129.170286 0 0 1 0.01024 128C0.01024 57.344 56.183954 0 125.377097 0c38.034286 0 72.118857 17.261714 95.085714 44.617143z" p-id="4122"></path></svg>`
  )
  el.appendChild(mask)
  el.appendChild(foldBtn)
  // 添加折叠事件
  foldBtn.onclick = () => {
    const maskElement = el.querySelector('.codeblocks-mask')
    const iconElement = el.querySelector('.fold-btn-icon')
    pres.forEach(pre => {
      foldBtnEvent({ pre, foldBtn, iconElement, maskElement }, height)
    })
  }
}
/**
 * 折叠事件
 * @param els 元素对象
 * @param height 高度
 */
const foldBtnEvent = (els, height) => {
  const { pre, foldBtn, iconElement, maskElement } = els
  if (pre.classList.contains('expand')) {
    // 折叠
    const oldPos = foldBtn.getBoundingClientRect().top
    pre.style.height = height + 'px'
    pre.style.overflow = 'hidden'
    pre.scrollTo(0, 0)
    pre.classList.remove('expand')
    maskElement.style.height = '48px'
    iconElement.classList.remove('turn')
    // 保持按钮位置并滚动页面
    window.scrollTo(0, foldBtn.getBoundingClientRect().top + window.scrollY - oldPos)
  } else {
    // 展开
    pre.style.height = 'auto'
    pre.style.overflow = 'auto'
    pre.classList.add('expand')
    maskElement.style.height = '0'
    iconElement.classList.add('turn')
  }
}
const rebindListener = height => {
  // console.log('重新绑定监听...')
  const codeblocks = document.querySelectorAll('.vp-doc [class*="language-"]')
  codeblocks.forEach(el => {
    const foldBtn = el.querySelector('.fold-btn')
    // console.log(`--->`, foldBtn?.onclick)
    if (foldBtn && !foldBtn.onclick) {
      foldBtn.onclick = () => {
        const pre = el.querySelector('pre')
        const maskElement = el.querySelector('.codeblocks-mask')
        const iconElement = el.querySelector('.fold-btn-icon')
        foldBtnEvent({ pre, foldBtn, iconElement, maskElement }, height)
      }
    }
  })
}
function isRGBA(value) {
  // 使用正则表达式匹配 RGBA 值的模式
  const rgbaPattern = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0(\.\d+)?|1(\.0+)?)\s*\)$/i
  // 使用 test 方法检查值是否符合模式
  return rgbaPattern.test(value)
}
const themeChangeObserver = () => {
  hideMask()
  themeChangeObserve = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'class') {
        // console.log(`hideMask---${new Date()}`)
        hideMask()
      }
    })
  })
  themeChangeObserve.observe(document.querySelector('html'), {
    attributeFilter: ['class']
  })
}
const hideMask = () => {
  if (document.querySelector('.vp-doc [class*="language-"]')) {
    let _isRGBA = isRGBA(
      window.getComputedStyle(document.querySelector('.vp-doc [class*="language-"]'), null).getPropertyValue('background-color')
    )
    // console.log(`isRGBA`, _isRGBA)
    if (_isRGBA) {
      nextTick(() => {
        document.querySelectorAll('.codeblocks-mask').forEach(item => {
          // console.log(`display`);
          item.style.display = 'none'
        })
      }).then()
    } else {
      nextTick(() => {
        document.querySelectorAll('.codeblocks-mask').forEach(item => {
          item.style.display = ''
        })
      }).then()
    }
  }
}
const jumpHashLink = () => {
  // 获取url中的锚点
  const hash = location.hash
  // 如果有锚点，滚动到锚点位置
  if (hash) {
    // hash解码
    const _hash = decodeURIComponent(hash)
    const target = document.querySelector(_hash)
    const headerHeight = document.querySelector('.VPNav')?.clientHeight ?? 0
    if (target) {
      // 不带动画滚动
      window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - headerHeight)
    }
  }
}
/**
 * Set codeblocks folding.  设置代码块折叠
 * @param {vitepressAPI} vitepressObj route and frontmatter.  路由与前言
 * @param [defaultAllFold] Collapse all by default?  默认全部折叠？
 * @param [height] The height of the folded codeblocks（default 400px）.  折叠后的代码块高度（默认 400px）
 */
const codeblocksFold = (vitepressObj, defaultAllFold = true, height = 400) => {
  const { frontmatter, route } = vitepressObj
  setTimeout(() => {
    nextTick(() => {
      cbf(frontmatter, defaultAllFold, height)
      rebindListener(height)
    }).catch()
  }, 1000)
  watch(
    () => route.path,
    () => {
      nextTick(() => {
        cbf(frontmatter, defaultAllFold, height)
        rebindListener(height)
      }).catch()
    }
  )
}
export default codeblocksFold
