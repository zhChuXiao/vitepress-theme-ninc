<template>
  <div ref="commentRef" id="comment-dom" class="vp-raw" :class="['comment-content', 'twikoo', { fill }]" />
</template>

<script setup>
import { jumpRedirect } from '../../../utils/commonTools'
import { twikooClick, cancelTwikooClick } from '../../../utils/useTwikooClick'
// import initComments from '../../../utils/initComments'
// 使用异步导入方式

import { mainStore } from '../../../store'
const props = defineProps({
  // 填充评论区
  fill: {
    type: [Boolean, String],
    default: false
  }
})

const { theme } = useData()
const { comment } = theme.value

// 评论数据
const twikoo = ref(null)
const commentRef = ref(null)
const route = useRoute()
const store = mainStore()

// 初始化 Twikoo
const initTwikoo = async () => {
  if (import.meta.env.SSR) {
    return
  }
  const { init: TwikooInit, getCommentsCount } = await import('twikoo/dist/twikoo.nocss.js')
  try {
    await nextTick()
    // const Twikoo = await import('twikoo')
    twikoo.value = TwikooInit({
      el: commentRef.value || '#comment-dom',
      envId: comment.twikoo.envId,
      onCommentLoaded: async () => {
        // console.log('评论已加载完毕')
        // 装备页面点击评论跳转
        if (route.path === "/pages/equipment") {
          twikooClick()
        }
        if (props.fill) fillComments(props.fill)
        jumpRedirect(null, theme.value, true)
        // 获取评论数量
        getCommentsCount({
          envId: comment.twikoo.envId, // 环境 ID
          // region: 'ap-guangzhou', // 环境地域，默认为 ap-shanghai，如果您的环境地域不是上海，需传此参数
          urls: [route.path],
          includeReply: true // 评论数是否包括回复，默认：false
        }).then(res => {
          // 设置评论数量
          store.setCommentCount({
            url: route.path,
            count: res[0].count
          })
        })
      }
    })
    return twikoo.value
  } catch (error) {
    console.error('初始化评论出错：', error)
  }
}

// 填充评论区
const fillComments = data => {
  // console.log('填充评论：', data)
  // 获取评论元素
  const commentDom = document.querySelector('.tk-input.el-textarea')
  if (!commentDom) return false
  // 获取输入框
  const commentInput = commentDom.querySelector('textarea')
  // 写入内容
  commentInput.value = data + '\n\n'
  commentInput.focus()
}

onMounted(async () => {
  initTwikoo()
})

onUnmounted(() => {
  cancelTwikooClick()
})
</script>

<style lang="scss">
.OwO .OwO-body {
  min-width: 31.25rem;
}

.twikoo svg {
  color: var(--main-font-color);
}

/* 评论区表情放大 */
@keyframes owoIn {
  0% {
    transform: translate(0, -95%);
    opacity: 0;
  }

  100% {
    transform: translate(0, -112%);
    opacity: 1;
  }
}

#owo-big {
  position: fixed;
  align-items: center;
  background-color: rgb(255, 255, 255);
  border: 1px #aaa solid;
  border-radius: 10px;
  z-index: 9999;
  display: none;
  transform: translate(0, -112%);
  overflow: hidden;
  animation: owoIn 0.3s cubic-bezier(0.42, 0, 0.3, 1.11);

  img {
    width: 100%;
  }
}

.tk-expand {
  width: 100%;
  cursor: var(--main-pointer-cursor);
  padding: 0.75em;
  text-align: center;
  transition: all 0.5s;
  border: 1px solid var(--main-card-border);
  box-shadow: 0 8px 16px -4px #2c2d300c;
  border-radius: 50px;
  letter-spacing: 5px;
  background-color: var(--main-card-background);
}

#twikoo {
  .tk-comments>.tk-submit {
    overflow: visible !important;
  }

  .tk-comments {
    .OwO .OwO-body {
      border: 1px solid var(--main-card-border) !important;
      border-radius: 8px !important;
      overflow: hidden;
      background-color: var(--main-site-background) !important;
      color: var(--main-font-color);
      backdrop-filter: saturate(180%) blur(10px);
      cursor: auto;
      top: 2.1em !important;
      transform: translateZ(0);
      animation: 0.3s ease 0.1s 1 normal both running donate_effcet;

      .OwO-items-show {
        margin: 12px 8px;
      }
    }

    button.el-button.tk-cancel.el-button--default.el-button--small {
      background: var(--main-card-second-background);
      border-radius: 8px;
      color: var(--main-font-color);

      &:hover {
        background: var(--main-color);
        color: #fff;
      }
    }

    a.tk-submit-action-icon.__markdown {
      display: none;
    }

    &>div.tk-submit>div.tk-row.actions>a {
      display: none;
    }

    .el-button.tk-preview {
      display: none;
    }

    .el-button--primary.is-disabled,
    .el-button--primary.is-disabled:active,
    .el-button--primary.is-disabled:focus,
    .el-button--primary.is-disabled:hover {
      opacity: 0.2;
    }

    .el-button--primary {
      border-color: var(--main-font-color);
      color: var(--main-card-background);
      border-radius: 12px;
      box-shadow: 0 0 12px 4px rgba(0, 0, 0, 0.05);
      transition: 0.3s;
      width: 6.25rem;
      position: absolute;
      top: -43px;
      right: 0;
      margin-left: 0.5rem !important;
      height: 32px;
    }

    .tk-input {
      .el-textarea__inner {
        min-height: 130px !important;
        border-radius: 15px;
        display: block;
        resize: vertical;
        padding: 16px 16px 40px 16px;
        line-height: 1.5;
        box-sizing: border-box;
        width: 100%;
        font-size: inherit;
        color: var(--main-font-color);
        background-color: var(--main-card-second-background);
        border: 1px solid var(--main-card-border);
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
        box-shadow: none !important;
      }
    }

    .el-input__inner {
      background: var(--main-card-second-background) !important;
      border: none !important;
      color: var(--main-font-color) !important;
      padding-left: 8px;

      &:focus {
        border: none;
      }
    }

    .el-input-group__append,
    .el-input-group__prepend {
      background-color: var(--main-card-background);
      color: var(--main-font-color);
      border-color: var(--main-card-border);
      border: none;
      font-weight: 700;
      box-shadow: none !important;
    }

    .el-input-group--prepend .el-input__inner,
    .el-input-group__append {
      border-radius: 12px;
    }

    .el-input--small .el-input__inner {
      padding: 8px;
      padding-left: 16px;
    }

    .el-input-group--prepend .el-input__inner,
    .el-input-group__append {
      border-left-width: 0 !important;
    }

    .tk-meta-input {
      position: relative;
      margin-top: 8px;
      width: calc(100% - 6.875rem);

      .el-input.el-input--small.el-input-group.el-input-group--prepend {
        border-radius: 12px;
        background: var(--main-card-second-background);
        border: 1px solid var(--main-card-border);
      }

      .el-input .el-input-group__prepend {
        user-select: none;
        border-radius: 12px 0 0 12px;
        box-shadow: none !important;
      }

      .el-input--small.el-input-group.el-input-group--prepend:focus-within {
        border: 1px solid var(--main-color);
      }
    }

    .tk-row {
      .tk-avatar {
        display: none;
      }

      .tk-col {
        flex-direction: column-reverse;
      }

      &.actions {
        margin-bottom: 0;
        margin-left: 0;
        margin-top: 0;
        justify-content: space-around;
      }
    }

    .tk-admin {
      backdrop-filter: blur(5px);
    }

    .el-button {
      background-color: var(--main-font-color);
      border: 0 solid var(--main-color);
      color: var(--main-site-background);
    }

    .tk-tag-green {
      background-color: var(--main-color-bg2);
      border: 1px solid var(--main-color);
      border-radius: 4px;
      font-weight: 600;
      color: var(--main-color);
    }

    .tk-action-icon {
      color: var(--main-color);
      cursor: var(--main-pointer-cursor);
    }

    .tk-icon.__comments {
      color: var(--main-color);
    }

    .tk-actions {
      a {
        cursor: var(--main-pointer-cursor);
      }
    }

    .tk-meta {
      .tk-time {
        font-size: 0.7em;
      }
    }

    .tk-nick {
      line-height: 40px;
    }

    .tk-extras {
      margin-top: 0.5rem;
      padding-bottom: 0.5rem;
    }

    .tk-expand {
      &:hover {
        color: #fff;
        background-color: var(--main-color);
        border: none;
      }
    }

    .tk-content {
      p {
        margin: 0;
        display: flex;
        align-items: flex-end;

        img {
          display: inline-flex;
          margin: 0 2px;
          border-radius: 0;
          object-fit: cover;
        }
      }

      .code-toolbar {
        border: 1px solid var(--main-card-border);
        background: var(--main-card-second-background);

        pre {
          background: var(--main-card-second-background);
        }

        .toolbar {
          top: 10px;
          right: 10px;

          .toolbar-item {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
          }
        }

        .copy-to-clipboard-button {
          background: var(--main-color-bg);
          border: 1px solid var(--main-color);
          transition: all 0.5s;

          span {
            color: var(--main-color);
          }

          &::before {
            content: '\e01c';
            font-family: 'iconfont';
            margin-right: 4px;
            color: var(--main-color);
          }

          &:hover {
            transform: scale(1.03);
          }

          &:active {
            transform: scale(0.97);
          }
        }
      }
    }

    .tk-admin-config-input {
      .el-input__inner {
        background: transparent !important;
      }
    }
  }

  pre code {
    background: none;
  }

  code {
    padding: 2px 4px;
    background: var(--main-card-second-background);
    color: #f47466;
  }

  .tk-comment .tk-submit .tk-avatar,
  .tk-replies .tk-avatar {
    height: 2.5rem !important;
    width: 2.5rem !important;
  }

  .tk-comment {
    pre {
      background: #272822;
      padding: 1em;
      margin: 0.5em 0;
      overflow: auto;
      border-radius: 0.3em;
    }
  }

  @media (max-width: 768px) {
    .tk-comments-container .tk-comment {
      padding: 1rem;
      border: 1px solid var(--main-card-border);
      box-shadow: 0 8px 16px -4px #2c2d300c;
      background: var(--main-card-background);
    }

    .tk-replies .tk-comment {
      border: none;
      padding-left: 0;
      padding-right: 0;
    }
  }

  @media (max-width: 768px) {
    .tk-meta {
      .tk-time {
        // display: none;
        font-size: 0.7em !important;
      }
    }

    .tk-action {
      .tk-action-link:nth-child(1) {
        display: none;
      }
    }
  }

  .tk-avatar {
    border-radius: 50px;

    .tk-avatar-img {
      height: 2.5rem !important;
    }
  }
}

.tk-replies {
  max-height: 10rem !important;

  &.tk-replies-expand {
    max-height: none !important;
  }

  .tk-comment {
    border-top: var(--style-border-dashed);
    border-radius: 12px;
    padding: 1rem 0px 0px;
    margin-top: 0;
    transition: all 0.3s ease 0s;
  }

  .tk-content span:first-child:not(.token) {
    font-size: 0.75rem;
    color: var(--main-font-second-color);
  }
}

[data-theme='dark'] #owo-big {
  background-color: #4a4a4a;
}

.tk-comments-container .tk-submit {
  opacity: 1;
  height: auto;
  overflow: visible;
}

/* 输入提示 */
/* 设置文字内容 :nth-child(1)的作用是选择第几个 */
.el-input.el-input--small.el-input-group.el-input-group--prepend:nth-child(1):before {
  content: '输入QQ号会自动获取昵称和头像';
}

.el-input.el-input--small.el-input-group.el-input-group--prepend:nth-child(2):before {
  content: '收到回复将会发送到您的邮箱';
}

.el-input.el-input--small.el-input-group.el-input-group--prepend:nth-child(3):before {
  content: '可以通过昵称访问您的网站';
}

/* 当用户点击输入框时显示 */
.el-input.el-input--small.el-input-group.el-input-group--prepend:focus-within::before {
  display: block;
  animation: commonTipsIn 0.3s;
  z-index: 2;
}

.el-input.el-input--small.el-input-group.el-input-group--prepend:focus-within::after {
  display: block;
  animation: commonTriangleIn 0.3s;
  // z-index: 2
}

/* 主内容区 */
.el-input.el-input--small.el-input-group.el-input-group--prepend::before {
  display: none;
  position: absolute;
  top: -60px;
  white-space: nowrap;
  border-radius: 10px;
  left: 50%;
  transform: translate(-50%);
  padding: 14px 18px;
  background: #444;
  color: #fff;
  z-index: 100;
}

/* 小角标 */
.el-input.el-input--small.el-input-group.el-input-group--prepend::after {
  display: none;
  content: '';
  position: absolute;
  border: 12px solid transparent;
  border-top-color: #444;
  left: 50%;
  transform: translate(-50%, -46px);
}

/* 评论框  */
.vwrap {
  box-shadow: 2px 2px 5px #bbb;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 30px;
  margin: 30px 0px 30px 0px;
}

/* 设置评论框 */
.vcard {
  box-shadow: 2px 2px 5px #bbb;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 30px;
  margin: 30px 0px 0px 0px;
}

#twikoo .tk-extra {
  background: var(--main-card-background);
  border: 1px solid var(--main-card-border);
  padding: 4px 8px;
  border-radius: 8px;
  margin-right: 4px;
  color: var(--main-font-second-color);
  margin-top: 6px;
  font-size: 0.8rem;

  svg {
    fill: #6ba5ed;
  }
}

#twikoo .tk-extra-text {
  font-size: 0.75rem;
}

#twikoo .tk-replies .tk-content {
  font-size: 0.9rem;
}

#twikoo .tk-content {
  margin-top: 0;
}

.tk-content span a:not([data-fancybox='gallery']) {
  font-weight: 500;
  border-bottom: solid 2px var(--main-color);
  color: var(--main-font-color);
  padding: 0 0.2em;
  text-decoration: none;

  &:hover {
    color: #fff;
    background-color: var(--main-color);
    border-radius: 4px;
  }
}

.tk-main .tk-content span>a {
  border-bottom: none;
}

#post-comment .comment-head {
  font-size: 0.8em !important;
  margin-bottom: 0.5rem;
}

@keyframes commonTipsIn {
  0% {
    top: -50px;
    opacity: 0;
  }

  100% {
    top: -60px;
    opacity: 1;
  }
}

@keyframes commonTriangleIn {
  0% {
    transform: translate(-50%, -36px);
    opacity: 0;
  }

  100% {
    transform: translate(-50%, -46px);
    opacity: 1;
  }
}

@keyframes donate_effcet {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }

  100% {
    opacity: 1;
    filter: none;
    transform: translateY(0);
  }
}

#body-wrap.page .el-input__inner {
  background: var(--main-card-background);
  box-shadow: 0 8px 16px -4px #2c2d300c;
  color: var(--main-font-color);
}

#body-wrap.page .tk-admin-config .el-input__inner {
  color: currentColor;
}

#twikoo.twikoo {

  .el-input__inner:focus,
  .el-textarea__inner:focus {
    border-color: var(--main-color);
  }
}

.tk-comments-container>.tk-comment {
  margin-top: 0 !important;
  margin-bottom: 1rem !important;
  transition: 0.3s;
  border-radius: 12px;
  padding: 0;
  padding-top: 1rem;
  border: none;
  border-top: var(--style-border-dashed);
}

#post-comment .comment-tips {
  background-color: rgba(103, 194, 58, 0.13);
  border: 1px solid var(--main-card-border);
  border-color: #57bd6a;
  color: #57bd6a;
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 0.5rem;
  display: none;
  width: 100%;

  &.show {
    display: flex;
  }
}

#page .tk-comments-container>.tk-comment {
  background: var(--main-card-background);
  padding: 1rem;
  padding-bottom: 1rem;
  border: 1px solid var(--main-card-border);
  border-top: 1px solid var(--main-card-border);
  box-shadow: 0 8px 16px -4px #2c2d300c;

  animation: animate-in-and-out 1s linear forwards;
  animation-timeline: view();

  &:has(.OwO-open) {
    z-index: 1;
  }
}

.tk-content {
  margin-top: 0.5rem;
  overflow: auto;
  max-height: 500px;
}

.tk-comments .tk-row-actions-start {
  position: absolute;
  top: -84px;
  left: 17px;
}

@media screen and (max-width: 768px) {
  .OwO .OwO-body {
    min-width: 260px;
  }

  .tk-comments .tk-row-actions-start {
    top: -176px;
  }

  #twikoo .tk-comments .tk-submit .el-button--primary {
    height: 122px;
    top: -126px;
  }

  #twikoo .el-textarea__inner {
    background: var(--main-card-background) !important;
    overflow: hidden;
    resize: none !important;
  }

  .tk-comments button.el-button.tk-preview.el-button--default.el-button--small {
    display: none;
  }

  .tk-comments .tk-main .tk-submit .tk-row.actions {
    justify-content: center;
  }

  .tk-comments button.el-button.tk-send,
  .tk-comments button.el-button.tk-cancel {
    width: 100%;
  }

  .tk-comments .tk-row-actions-start {
    position: absolute;
  }
}

.OwO .OwO-body .OwO-items .OwO-item:hover {
  box-shadow: 0 5px 12px -5px rgba(102, 68, 68, 0) !important;
  border-radius: 8px;
}
</style>
