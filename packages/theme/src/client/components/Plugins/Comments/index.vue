<!-- 评论 -->
<template>
  <div
    v-if="theme.comment.enable"
    :key="router.route.path"
    ref="mainCommentRef"
    id="main-comment"
    class="comment vp-raw"
    :class="[page === 'page' ? 's-card' : '']"
  >
    <div v-if="!fill" class="title">
      <span class="name">
        <i class="iconfont icon-chat"></i>
        {{ title }}
      </span>
      <div class="tool-container">
        <span class="tool random-comment" @click="addRandomCommentInfo"> 匿名{{ title }} </span>
        <span class="tool" @click="router.go('/pages/privacy')"> 隐私政策 </span>
      </div>
    </div>
    <div class="comment-tips" id="comment-tips">
      <i class="iconfont icon-star"></i>
      <span>&nbsp;&nbsp;你无需删除空行，直接评论以获取最佳展示效果</span>
    </div>
    <!-- 评论系统：Twikoo -->
    <Suspense>
      <Twikoo :fill="fill" />
    </Suspense>
  </div>
</template>

<script setup>
const { theme } = useData()
const router = useRouter()
// 异步导入Twikoo组件
const Twikoo = defineAsyncComponent(() => import('./Twikoo.vue'))

const props = defineProps({
  // 填充评论区
  fill: {
    type: [Boolean, String],
    default: false
  },
  // 页面类型
  page: {
    type: String,
    default: 'post'
  },
  title: {
    type: String,
    default: '评论'
  }
})
const mainCommentRef = ref(null)

// 滚动至评论
const scrollToComments = () => {
  if (!mainCommentRef.value) return false
  const elementRect = mainCommentRef.value.getBoundingClientRect()
  const elementTop = elementRect.top + window.scrollY
  window.scrollBy({ top: elementTop - 80, behavior: 'smooth' })
}

const addRandomCommentInfo = () => {
  // 将两个值组合成一个字符串
  const name = `匿名`
  const visitorMail = `000@000.000`

  function dr_js_autofill_commentinfos() {
    var lauthor = [
        '#author',
        "input[name='comname']",
        '#inpName',
        "input[name='author']",
        '#ds-dialog-name',
        '#name',
        "input[name='nick']",
        '#comment_author'
      ],
      lmail = [
        '#mail',
        '#email',
        "input[name='commail']",
        '#inpEmail',
        "input[name='email']",
        '#ds-dialog-email',
        "input[name='mail']",
        '#comment_email'
      ],
      lurl = [
        '#url',
        "input[name='comurl']",
        '#inpHomePage',
        '#ds-dialog-url',
        "input[name='url']",
        "input[name='website']",
        '#website',
        "input[name='link']",
        '#comment_url'
      ]
    for (var i = 0; i < lauthor.length; i++) {
      var author = document.querySelector(lauthor[i])
      if (author != null) {
        author.value = name
        author.dispatchEvent(new Event('input'))
        author.dispatchEvent(new Event('change'))
        break
      }
    }
    for (var j = 0; j < lmail.length; j++) {
      var mail = document.querySelector(lmail[j])
      if (mail != null) {
        mail.value = visitorMail
        mail.dispatchEvent(new Event('input'))
        mail.dispatchEvent(new Event('change'))
        break
      }
    }
    for (var k = 0; k < lurl.length; k++) {
      var url = document.querySelector(lurl[k])
      if (url != null) {
        url.value = ''
      }
    }
    return !1
  }

  dr_js_autofill_commentinfos()
  var input = document.getElementsByClassName('el-textarea__inner')[0]
  input.focus()
  input.setSelectionRange(-1, -1)
}

defineExpose({ scrollToComments })
</script>

<style lang="scss" scoped>
.page-comment {
  margin-top: 0;
}
.comment {
  cursor: var(--main-default-cursor);
  margin-top: 2rem;
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 1.5rem 0 1rem 0;
    padding: 0 6px;
    .name {
      display: flex;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      .iconfont {
        font-size: 26px;
        font-weight: normal;
        margin-right: 8px;
      }
    }
    .tool-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      .tool {
        opacity: 0.6;
        font-size: 14px;
        cursor: var(--main-pointer-cursor);
        transition: opacity 0.3s, color 0.3s;
        &:hover {
          opacity: 1;
          color: var(--main-color);
        }
        &.random-comment {
          color: var(--main-color);
          border: 1px solid var(--main-color);
          padding: 0 10px;
          border-radius: 100px;
          background-color: var(--main-color-bg);
        }
      }
    }
  }
  .comment-tips {
    background-color: rgba(103, 194, 58, 0.13);
    border: 1px solid var(--main-success-color);
    color: var(--main-success-color);
    border-radius: 8px;
    padding: 8px 12px;
    margin-top: 0.5rem;
    display: none;
    width: 100%;
    .iconfont {
      color: var(--main-success-color);
      font-size: 1.2em;
    }
    &.show{
      display: flex;
    }
  }
}
</style>
