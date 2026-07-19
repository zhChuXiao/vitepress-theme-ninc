<template>
  <canvas id="universe" ref="universeRef"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { mainStore } from '../store';
const store = mainStore();
const universeRef = ref(null);
let animationId = null;
let stars = [];
// 观察主题变化（可选，如果你的应用有主题切换）
const isDarkMode = computed(() => store.isDark);
// 设置
const SETTINGS = {
  starCount: 0, // 会根据屏幕宽度动态计算
  starSpeed: 0.05,
  giantStarColor: '180,184,240',  // 大型星星颜色
  normalStarColor: '226,225,142', // 普通星星颜色
  cometColor: '226,225,224',      // 彗星颜色
  initialCometDelay: 50           // 彗星出现延迟
};

// 屏幕尺寸
const viewport = ref({
  width: 0,
  height: 0
});

// 调整画布大小
function resizeCanvas() {
  if (!universeRef.value) return;
  
  const canvas = universeRef.value;
  viewport.value.width = window.innerWidth;
  viewport.value.height = window.innerHeight;
  
  // 根据屏幕宽度计算星星数量
  SETTINGS.starCount = Math.floor(0.216 * viewport.value.width);
  
  canvas.width = viewport.value.width;
  canvas.height = viewport.value.height;
  
  // 重新初始化星星
  initStars();
}

// 创建星星
function createStar() {
  // 允许彗星生成的标记
  let allowComets = false;
  
  // 在短暂延迟后允许彗星
  setTimeout(() => {
    allowComets = true;
  }, SETTINGS.initialCometDelay);
  
  // 星星构造函数
  function Star() {
    this.reset = function() {
      // 决定星星类型
      this.giant = isRandomTrue(3); // 大型星星
      this.comet = !this.giant && allowComets && isRandomTrue(10); // 彗星
      
      // 位置和大小
      this.x = random(0, viewport.value.width - 10);
      this.y = random(0, viewport.value.height);
      this.r = random(1.1, 2.6); // 星星大小
      
      // 速度
      const speed = SETTINGS.starSpeed;
      this.dx = random(speed, 6 * speed) + (this.comet ? speed * random(50, 120) : 0) + 2 * speed;
      this.dy = -random(speed, 6 * speed) - (this.comet ? speed * random(50, 120) : 0);
      
      // 渐隐效果
      this.fadingOut = null;
      this.fadingIn = true;
      this.opacity = 0;
      this.opacityTresh = random(0.2, 1 - (this.comet ? 0.4 : 0));
      this.do = random(0.0005, 0.002) + (this.comet ? 0.001 : 0);
    };
    
    // 淡入效果
    this.fadeIn = function() {
      if (this.fadingIn) {
        this.opacity += this.do;
        this.fadingIn = this.opacity <= this.opacityTresh;
      }
    };
    
    // 淡出效果
    this.fadeOut = function() {
      if (this.fadingOut) {
        this.opacity -= this.do / 2;
        this.fadingOut = this.opacity > 0;
        
        if (this.x > viewport.value.width || this.y < 0) {
          this.fadingOut = false;
          this.reset();
        }
      }
    };
    
    // 绘制星星
    this.draw = function(ctx) {
      ctx.beginPath();
      
      if (this.giant) {
        // 大型星星
        ctx.fillStyle = `rgba(${SETTINGS.giantStarColor}, ${this.opacity})`;
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
      } else if (this.comet) {
        // 彗星
        ctx.fillStyle = `rgba(${SETTINGS.cometColor}, ${this.opacity})`;
        ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, false);
        
        // 彗星尾巴
        for (let i = 0; i < 30; i++) {
          ctx.fillStyle = `rgba(${SETTINGS.cometColor}, ${this.opacity - (this.opacity / 20) * i})`;
          ctx.rect(
            this.x - (this.dx / 4) * i,
            this.y - (this.dy / 4) * i - 2,
            2,
            2
          );
          ctx.fill();
        }
      } else {
        // 普通星星
        ctx.fillStyle = `rgba(${SETTINGS.normalStarColor}, ${this.opacity})`;
        ctx.rect(this.x, this.y, this.r, this.r);
      }
      
      ctx.closePath();
      ctx.fill();
    };
    
    // 移动星星
    this.move = function() {
      this.x += this.dx;
      this.y += this.dy;
      
      // 如果星星超出特定范围就开始淡出
      if (this.x > viewport.value.width - viewport.value.width / 4 || this.y < 0) {
        this.fadingOut = true;
      }
      
      // 如果不在淡出状态且超出屏幕，则重置
      if (this.fadingOut === false) {
        this.reset();
      }
    };
    
    // 初始化
    this.reset();
  }
  
  return new Star();
}

// 初始化星星
function initStars() {
  if (!universeRef.value) return;
  
  const ctx = universeRef.value.getContext('2d');
  stars = [];
  
  // 创建星星
  for (let i = 0; i < SETTINGS.starCount; i++) {
    stars[i] = createStar();
  }
  
  // 立即绘制一次
  drawStars(ctx);
}

// 绘制所有星星
function drawStars(ctx) {
  ctx.clearRect(0, 0, viewport.value.width, viewport.value.height);
  
  for (let i = 0; i < stars.length; i++) {
    stars[i].move();
    stars[i].fadeIn();
    stars[i].fadeOut();
    stars[i].draw(ctx);
  }
}

// 动画循环
function animateStars() {
  if (!universeRef.value) return;
  
  const ctx = universeRef.value.getContext('2d');
  
  // 只在深色模式下绘制
  
  if (isDarkMode) {
    drawStars(ctx);
  }
  
  // 请求下一帧
  animationId = window.requestAnimationFrame(animateStars);
}

// 随机函数：在指定范围内生成随机数
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// 根据概率返回 true/false
function isRandomTrue(chance) {
  return Math.floor(Math.random() * 1000) + 1 < chance * 10;
}

// 生命周期钩子
onMounted(() => {
  // 初始化
  resizeCanvas();
  
  // 监听窗口大小
  window.addEventListener('resize', resizeCanvas);
  
  // 开始动画
  animationId = window.requestAnimationFrame(animateStars);
});

onUnmounted(() => {
  // 清理
  window.removeEventListener('resize', resizeCanvas);
  if (animationId) {
    window.cancelAnimationFrame(animationId);
  }
});



watch(isDarkMode, (newValue) => {
  // console.log('isDarkMode', newValue);
  if (newValue) {
    // 如果切换到深色模式，确保动画运行
    if (!animationId) {
      animationId = window.requestAnimationFrame(animateStars);
    }
  }
});
</script>

<style lang="scss" scoped>
#universe {
  position: fixed;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
</style>
