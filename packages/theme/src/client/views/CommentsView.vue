<template>
  <MacCard>
    <template #title>
      <h3 class="comments-title">
        <i class="iconfont icon-chat"></i>
        {{ theme.friends.comments.title }}
      </h3>
    </template>
    <div class="comments-container">
      <div id="maincontent">
        <div id="form-wrap" ref="formWrap">
          <img id="beforeimg" class="no-lightbox" :src="beforeimg" ref="beforeimgRef" />
          <div id="envelope" ref="envelope">
            <div class="formmain" ref="formmain">
              <img class="headerimg no-lightbox" :src="cover" ref="headerImg" />
              <div class="comments-main" ref="commentsMain">
                <div class="title3" ref="title">来自{{ author }}的留言:</div>
                <div class="comments" ref="comments">
                  <div
                    v-for="(item, index) in message"
                    :key="index"
                    :style="{ animationDelay: `${0.1 * index}s` }"
                    class="message-item"
                  >
                    {{ item }}
                  </div>
                </div>
                <div class="bottomcontent" ref="bottomcontent">
                  <img class="bottomimg no-lightbox" :src="line" />
                </div>
                <div class="bottomhr" ref="bottomhr">{{ bottom }}</div>
              </div>
            </div>
          </div>
          <img id="afterimg" class="no-lightbox" :src="afterimg" ref="afterimgRef" />
        </div>
      </div>
    </div>
    <hr />
  </MacCard>
  <!-- <SafariMockUp class="safari-container" url="https://ninc.top" src="/images/cover/003405.jpeg" /> -->
  <!-- <Comments title="留言" /> -->
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
const { theme } = useData()

// 配置信息，直接对应 index.js 中的变量
const author = theme.value.friends.comments.author
const cover = theme.value.friends.comments.cover
const envelopeConfig = theme.value.friends.comments.envelope || {}
const line = ref(envelopeConfig.line || 'https://npm.elemecdn.com/hexo-butterfly-envelope/lib/line.png')
const beforeimg = ref(envelopeConfig.before || 'https://npm.elemecdn.com/hexo-butterfly-envelope/lib/before.png')
const afterimg = ref(envelopeConfig.after || 'https://npm.elemecdn.com/hexo-butterfly-envelope/lib/after.png')
const message = theme.value.friends.comments.message
const bottom = theme.value.friends.comments.bottom
const height = ref('1050px')

// 元素引用
const formWrap = ref(null)
const envelope = ref(null)
const formmain = ref(null)
const commentsMain = ref(null)
const title = ref(null)
const comments = ref(null)
const bottomcontent = ref(null)
const bottomhr = ref(null)
const beforeimgRef = ref(null)
const afterimgRef = ref(null)
const headerImg = ref(null)

// 页面初始化动画
onMounted(() => {
  // 设置初始展开状态
  if (formWrap.value) {
    formWrap.value.style.height = height.value
    formWrap.value.style.top = '-200px'
  }

  // 设置初始状态
  gsap.set([beforeimgRef.value, afterimgRef.value], { opacity: 0, scale: 0.8 })
  gsap.set(formmain.value, { opacity: 0, y: 20 })
  gsap.set([title.value, comments.value, bottomcontent.value, bottomhr.value], { opacity: 0, y: 10 })

  // 创建时间线
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      // console.log('动画完成')
      // 收起信封的动画
      gsap.to(formWrap.value, {
        height: '447px',
        top: '0px',
        duration: 0,
        ease: 'power2.inOut'
      })
    }
  })

  // 信封动画
  tl.to(beforeimgRef.value, { opacity: 1, scale: 1, duration: 0.6 })
    .to(afterimgRef.value, { opacity: 1, scale: 1, duration: 0.6 }, '-=0.3')
    .to(formmain.value, { opacity: 1, y: 0, duration: 0.8 }, '-=0.2')
    .to(title.value, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
    .to(comments.value, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
    .to([bottomcontent.value, bottomhr.value], { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')

  // 添加信封抖动效果
  // setTimeout(() => {
  //   shakeEnvelope()
  // }, 3000)

  // 监听鼠标移入移出
  if (formWrap.value) {
    formWrap.value.addEventListener('mouseenter', handleEnvelopeHover)
    formWrap.value.addEventListener('mouseleave', handleEnvelopeLeave)
  }
})

// // 信封抖动效果
// const shakeEnvelope = () => {
//   if (!envelope.value) return

//   gsap.to(envelope.value, {
//     rotation: -2,
//     duration: 0.1,
//     onComplete: () => {
//       gsap.to(envelope.value, {
//         rotation: 2,
//         duration: 0.2,
//         onComplete: () => {
//           gsap.to(envelope.value, {
//             rotation: 0,
//             duration: 0.1
//           })
//         }
//       })
//     }
//   })
// }

// 信封悬停效果
const handleEnvelopeHover = () => {
  gsap.to(title.value, { scale: 1.05, color: 'var(--main-color)', duration: 0.3 })
  gsap.to(headerImg.value, { scale: 1.03, duration: 0.5, ease: 'power1.out' })
}

// 信封离开效果
const handleEnvelopeLeave = () => {
  gsap.to(title.value, { scale: 1, duration: 0.3 })
  gsap.to(headerImg.value, { scale: 1, duration: 0.5, ease: 'power1.out' })
}
</script>

<style lang="scss" scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@media screen and (max-width: 600px) {
  #beforeimg,
  #afterimg {
    display: none !important;
  }
}

@media screen and (min-width: 600px) {
  #article-container img {
    margin: 0 auto 0rem;
  }

  #form-wrap {
    overflow: hidden;
    height: 447px;
    position: relative;
    top: 0px;
    transition: all 1s cubic-bezier(0.43, 0.13, 0.23, 0.96) 0.3s;
    z-index: 0;

    &:hover {
      height: v-bind(height) !important;
      top: -200px !important;

      .formmain {
        box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.3);
      }
    }
  }
  #beforeimg {
    position: absolute;
    bottom: 126px;
    left: 0px;
    background-repeat: no-repeat;
    width: 530px;
    height: 317px;
    z-index: -100;
    pointer-events: none;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }
  }

  #afterimg {
    position: absolute;
    bottom: -2px;
    left: 0;
    background-repeat: no-repeat;
    width: 530px;
    height: 259px;
    z-index: 100;
    pointer-events: none;
    transition: transform 0.3s ease;
  }

  #envelope {
    position: relative;
    overflow: visible;
    width: 500px;
    margin: 0px auto;
    transition: all 1s cubic-bezier(0.43, 0.13, 0.23, 0.96) 0.3s;
    padding-top: 200px;
    transform-origin: center center;
  }

  #maincontent {
    width: 530px;
    margin: 20px auto 0;
  }
}
@media screen and (max-width: 600px) {
  #form-wrap {
    height: 600px !important;
  }
}
.formmain {
  background: white;
  width: 95%;
  max-width: 800px;
  margin: auto auto;
  border-radius: 5px;
  border: 1px solid;
  overflow: hidden;
  -webkit-box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  transition: box-shadow 0.5s ease;
}

/* 从内联样式转移过来的样式 */
.formmain .headerimg {
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  width: 100%;
  height: 100%;
  border-radius: 0 0 50% 50% / 0 0 15% 15%;
  border: 2px solid #eee;
  transition: transform 0.5s ease;
}

.title3 {
  color: var(--main-color);
  font-size: 1.4rem;
  margin: 20px 0;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  transform-origin: center;
}

.comments {
  text-align: center;
  border-bottom: #ddd 1px solid;
  border-left: #ddd 1px solid;
  padding-bottom: 20px;
  background-color: #eee;
  margin: 15px 0px;
  padding-left: 20px;
  padding-right: 20px;
  border-top: #ddd 1px solid;
  border-right: #ddd 1px solid;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }
}

.message-item {
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;

  &:hover {
    color: var(--main-color);
  }
}

.bottomcontent {
  text-align: center;
  margin-top: 40px;
}

.bottomimg {
  width: 100%;
  margin: 5px auto 5px auto;
  display: block;
  pointer-events: none;
}

.comments-main .bottomhr {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin: 20px 0;
  animation: pulse 3s infinite ease-in-out;
}
.comments-title {
  text-decoration: none;
  font-size: 1.2rem;
  line-height: 1.2rem;
  margin: 0.1em;
  color: var(--main-color);
  i {
    color: var(--main-color);
    font-size: 1.2rem;
    line-height: 1.2rem;
    margin: 0.1em;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0px;
    left: 0;
    height: 10px;
    border-radius: 10px;
    background: var(--main-color) !important;
    transform-origin: center;
  }
}
.comments-container {
}

/* 夜间模式 */
.dark {
  .formmain {
    background: #323232;
  }

  .comments {
    background: #5a5a5a !important;

    &:hover {
      background: #666 !important;
    }
  }

  .headerimg {
    border-color: #444;
  }
}

/* 通用样式 */
.no-lightbox {
  pointer-events: none;
}

.safari-container {
  width: 100%;
}
</style>
