<template>
  <div class="redirect-page">
    <div class="redirect-container s-card">
      <div class="redirect-icon">
        <i class="iconfont icon-warning"></i>
      </div>
      <h1 class="redirect-title">外部链接提示</h1>
      <div class="redirect-content">
        <p>您即将离开本站，前往以下链接：</p>
        <div class="url-box">{{ decodedUrl }}</div>
        <p class="warning-text">该网站不受本站控制，请注意保护您的个人信息安全</p>
      </div>
      <div class="redirect-actions">
        <button class="btn-cancel" @click="goBack">返回上一页</button>
        <button class="btn-continue" @click="continueRedirect">继续访问</button>
      </div>
      <div class="auto-redirect">
        <span>{{ countdown }}秒后自动跳转</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 获取URL参数
const urlParams = new URLSearchParams(window.location.search)
const targetUrl = urlParams.get('url')
const decodedUrl = ref(targetUrl || '')

// 倒计时
const countdown = ref(5)
let timer = null

// 继续跳转
const continueRedirect = () => {
  if (targetUrl) {
    window.open(targetUrl, '_blank')
    goBack()
  }
}

// 返回上一页
const goBack = () => {
  window.history.back()
}

// 自动跳转
onMounted(() => {
  if (!targetUrl) {
    goBack()
    return
  }
  
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      continueRedirect()
    }
  }, 1000)
})

// 清除定时器
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style lang="scss" scoped>
.redirect-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 20px;
  
  .redirect-container {
    max-width: 600px;
    width: 100%;
    padding: 30px;
    text-align: center;
    
    .redirect-icon {
      font-size: 60px;
      color: var(--main-warning-color);
      margin-bottom: 20px;
    }
    
    .redirect-title {
      font-size: 24px;
      margin-bottom: 20px;
      color: var(--main-font-color);
    }
    
    .redirect-content {
      margin-bottom: 30px;
      
      p {
        margin-bottom: 10px;
        font-size: 16px;
      }
      
      .url-box {
        background-color: var(--main-card-second-background);
        padding: 12px;
        border-radius: 8px;
        word-break: break-all;
        margin: 15px 0;
        font-family: monospace;
        font-size: 14px;
      }
      
      .warning-text {
        color: var(--main-warning-color);
        font-size: 14px;
      }
    }
    
    .redirect-actions {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 20px;
      
      button {
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        cursor: var(--main-pointer-cursor);
        font-size: 16px;
        transition: all 0.3s;
        
        &.btn-cancel {
          background-color: var(--main-card-second-background);
          color: var(--main-font-color);
          
          &:hover {
            background-color: var(--main-card-border);
          }
        }
        
        &.btn-continue {
          background-color: var(--main-color);
          color: white;
          
          &:hover {
            background-color: var(--main-color-bg3);
          }
        }
      }
    }
    
    .auto-redirect {
      font-size: 14px;
      color: var(--main-font-second-color);
    }
  }
}

@media (max-width: 768px) {
  .redirect-page {
    padding: 15px;
    
    .redirect-container {
      padding: 20px;
      
      .redirect-actions {
        flex-direction: column;
        gap: 10px;
        
        button {
          width: 100%;
        }
      }
    }
  }
}
</style> 