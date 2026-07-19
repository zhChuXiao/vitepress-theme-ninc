<template>
  <div class="clock_container">
    <div class="center-dial">
      <!-- <div class="clock_h1 center-preview">
        <span v-for="(item, index) in 'HELLO'" :class="`char${index + 1}`" :key="index">{{ item }}</span>
      </div> -->
      <div class="clock_head" :style="headStyle">
        <div class="clock_head-bg"></div>
      </div>
      <!-- <div class="clock_torso"></div> -->
      <div class="clock_hand-container" id="minutes">
        <div class="clock_minute-hand"></div>
      </div>
      <div class="clock_hand-container" id="hours">
        <div class="clock_hour-hand"></div>
      </div>
      <div class="clock_hand-container" id="seconds">
        <div class="clock_second-hand"></div>
      </div>
    </div>
    <div class="clock_day-name-dial">
      <div class="clock_ring-back"></div>
      <div class="ring" id="r1">
        <div class="clock_h1 day-name-preview">
          <span v-for="(item, index) in 'DAY NAME'" :class="`char${index + 1}`" :key="index">{{ item }}</span>
        </div>
        <div class="clock_h2 day-name-text">
          <span
            v-for="(item, index) in '星期一 星期二 星期三 星期四 星期五 星期六 星期日'"
            :class="`char${index + 1}`"
            :key="index"
            >{{ item }}</span
          >
        </div>
      </div>
    </div>
    <div class="month-dial">
      <div class="clock_ring-back"></div>
      <div class="ring" id="r2">
        <div class="clock_h1 month-preview">
          <span v-for="(item, index) in 'MONTH'" :class="`char${index + 1}`" :key="index">{{ item }}</span>
        </div>
        <div class="clock_h2 month-text">
          <span
            v-for="(item, index) in '一月份 二月份 三月份 四月份 五月份 六月份 七月份 八月份 九月份 十月份 十一月 十二月'"
            :class="`char${index + 1}`"
            :key="index"
            >{{ item }}</span
          >
        </div>
      </div>
    </div>
    <div class="day-dial">
      <div class="clock_ring-back"></div>
      <div class="ring" id="r3">
        <div class="clock_h1 day-preview">
          <span v-for="(item, index) in 'DAY'" :class="`char${index + 1}`" :key="index">{{ item }}</span>
        </div>
        <div class="clock_h2 day-text">
          <span
            v-for="(
              item, index
            ) in '01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31'"
            :class="`char${index + 1}`"
            :key="index"
            >{{ item }}</span
          >
        </div>
      </div>
    </div>
    <div class="background-clock"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'

const { theme } = useData()

// Clock 中心头像：优先使用 siteMeta.author.cover，未配置时回退到 siteMeta.avatar
// 两者均未配置时为空字符串，CSS 背景为空（显示纯色底）
const headStyle = computed(() => {
  const avatar = theme.value?.siteMeta?.author?.cover || theme.value?.siteMeta?.avatar || ''
  return avatar ? { backgroundImage: `url('${avatar}')` } : {}
})

const isRunning = ref(false)

defineExpose({
  startClock,
  resetClock
})

onMounted(() => {
  setTimeout(() => {
    startClock()
  }, 1000)
})

// 记录 init() 中创建的 setTimeout id，便于 resetClock 清理，避免残留定时器干扰下一次动画
let initTimeoutIds = []
function clearInitTimeouts() {
  initTimeoutIds.forEach(id => clearTimeout(id))
  initTimeoutIds = []
}

let date, dayName, day, month
const range = 270
const sectionsDayName = 7
const sectionsDay = 31
const sectionsMonth = 12
const charactersDayName = 3
const charactersDay = 2
const charactersMonth = 3
const dayColor = '#FF2D55'
const monthColor = '#007AFF'
const dayNameColor = '#37BA5A'

function rotateRing(input, sections, characters, ring, text, color) {
  const sectionWidth = range / sections
  const initialRotation = 135 - sectionWidth / 2
  const rotateAmount = initialRotation - sectionWidth * (input - 1)
  const start = characters * (input - 1) + (input - 1) + 1

  const ringElement = document.querySelector(ring)
  if (ringElement) {
    ringElement.style.transform = `rotate(${rotateAmount}deg)`
  }

  const textElement = document.querySelector(text)
  if (textElement) {
    for (let i = start; i < start + characters; i++) {
      const charElement = textElement.querySelector(`.char${i}`)
      if (charElement) {
        charElement.style.color = color
      }
    }
  }
}
let clockInterval
// Get a new date object every second and update the rotation of the clock handles
function clockRotation() {
  clockInterval = setInterval(() => {
    const date = new Date()
    const seconds = date.getSeconds()
    const minutes = date.getMinutes()
    const hours = date.getHours()
    const secondsRotation = seconds * 6
    const minutesRotation = minutes * 6
    const hoursRotation = hours * 30 + minutes / 2

    document.getElementById('seconds').style.transform = `rotate(${secondsRotation}deg)`
    document.getElementById('minutes').style.transform = `rotate(${minutesRotation}deg)`
    document.getElementById('hours').style.transform = `rotate(${hoursRotation}deg)`
  }, 1000)
}

// 暂停
function pauseClock() {
  clearInterval(clockInterval)
}

// Give column representing passed days and the current day this week a height
function loadBars() {
  for (let i = 1; i <= dayName; i++) {
    const barElement = document.getElementById(`x${i}`)
    if (barElement) {
      const newHeight = Math.floor(Math.random() * 85) + 5
      barElement.style.height = `${newHeight}px`
    }
  }
}

// Fade effect function
function fadeTo(selector, opacity, duration, callback) {
  const element = document.querySelectorAll(selector)
  if (element) {
    ;[...element].forEach(el => {
      el.style.transition = `opacity ${duration}ms`
      el.style.opacity = opacity

      if (callback) {
        el.addEventListener('transitionend', callback, { once: true })
      }
    })
  }
}

function init() {
  // 清理上一次 init() 残留的定时器，避免动画冲突
  clearInitTimeouts()

  // Fade in elements
  fadeTo('.day-preview', 1, 10)
  fadeTo('.month-preview', 1, 10)
  fadeTo('.day-name-preview', 1, 10)
  fadeTo('.center-preview', 1, 10)

  // Get date variables
  date = new Date()
  dayName = date.getDay() || 7 // Day of week (1-7)
  day = date.getDate() // Get current date (1-31)
  month = date.getMonth() + 1 // Current month (1-12)

  // Fade in/out second dial and rotate
  initTimeoutIds.push(setTimeout(() => {
    fadeTo('.day-preview', 0, 500)
    fadeTo('.day-text', 1, 500, () => {
      rotateRing(day, sectionsDay, charactersDay, '#r3', '.day-text', dayColor)
    })
  }, 200))

  // Fade in/out month dial and rotate
  initTimeoutIds.push(setTimeout(() => {
    fadeTo('.month-preview', 0, 500)
    fadeTo('.fa-cloud', 1, 500)
    fadeTo('.temperature', 1, 500)
    fadeTo('.bars', 1, 500)
    fadeTo('.month-text', 1, 500, () => {
      rotateRing(month, sectionsMonth, charactersMonth, '#r2', '.month-text', monthColor)
      loadBars()
    })
  }, 700))

  // Fade in/out day name dial and rotate
  initTimeoutIds.push(setTimeout(() => {
    fadeTo('.day-name-preview', 0, 500)
    fadeTo('.day-name-text', 1, 500, () => {
      rotateRing(dayName, sectionsDayName, charactersDayName, '#r1', '.day-name-text', dayNameColor)
    })
  }, 1200))

  // Fade in/out center dial
  initTimeoutIds.push(setTimeout(() => {
    fadeTo('.center-preview', 0, 500)
    fadeTo('.clock_head-bg', 0.4, 500)
    // document.querySelector('.clock_head').style.filter = 'brightness(0.4)'
    fadeTo('.clock_hand-container', 1, 500)
  }, 1700))
  initTimeoutIds.push(setTimeout(() => {
    isRunning.value = false
  }, 2200))
  // Begin clock rotation now it is visible
  clockRotation()
}

function resetClock() {
  // 清理 init() 残留的定时器，避免重置后又被触发
  clearInitTimeouts()

  // 重置所有表盘到初始状态
  const elements = [
    '.day-preview',
    '.month-preview',
    '.day-name-preview',
    '.day-text',
    '.month-text',
    '.day-name-text',
    '.fa-cloud',
    '.temperature',
    '.bars',
    '.clock_hand-container'
  ]

  elements.forEach(selector => {
    fadeTo(selector, 0, 0)
  })
  fadeTo('.center-preview', 1, 10)
  fadeTo('.clock_head-bg', 0, 10)
  // document.querySelector('.clock_head').style.filter = 'brightness(1)'

  // 重置表盘旋转
  const rings = ['#r1', '#r2', '#r3']
  rings.forEach(ring => {
    const element = document.querySelector(ring)
    if (element) {
      element.style.transform = 'rotate(0deg)'
    }
  })

  // 清除时钟定时器
  if (clockInterval) {
    clearInterval(clockInterval)
  }

  // 标记为已停止，让后续 startClock 可以重新触发
  isRunning.value = false
}

function startClock() {
  if (isRunning.value) return
  isRunning.value = true
  init()
}

function toggleClock() {
  if (isRunning.value) {
    resetClock()
    isRunning.value = false
  } else {
    startClock()
  }
}

onBeforeUnmount(() => {
  clearInterval(clockInterval)
  resetClock()
})
</script>

<style lang="scss" scoped>
@use 'sass:math';
@use 'sass:list';
// VARIABLES
$background-grey: var(--main-card-background);
$clock_ring-back: var(--main-font-color);
$ring-preview-characters: 6;
$bar-colors: #ff3b30, #ff9500, #ffcc00, #4cd964, #5ac8fa, #007aff, #5856d6;

$center-dial-size: 150px;
$day-name-size: 250px;
$month-size: 350px;
$day-size: 450px;
$h1-size: 25px;
$h2-size: 12px;

// MIXINS
@mixin position($position, $top: null, $right: null, $bottom: null, $left: null) {
  position: $position;
  top: $top;
  right: $right;
  bottom: $bottom;
  left: $left;
}

@mixin absolute($args...) {
  @include position(absolute, $args...);
}

@mixin relative($args...) {
  @include position(relative, $args...);
}

@mixin fixed($args...) {
  @include position(fixed, $args...);
}

@mixin opacity($opacity) {
  opacity: $opacity;
  $opacity-ie: $opacity * 100;
  filter: alpha(opacity=$opacity-ie); //IE8
}

@mixin size($width, $height: $width) {
  width: $width;
  height: $height;
}

@mixin transition($args...) {
  -webkit-transition: $args;
  -moz-transition: $args;
  -ms-transition: $args;
  -o-transition: $args;
  transition: $args;
}

@mixin transition-delay($delay) {
  -webkit-transition-delay: $delay;
  -moz-transition-delay: $delay;
  -ms-transition-delay: $delay;
  -o-transition-delay: $delay;
  transition-delay: $delay;
}

@mixin transform($transforms) {
  -moz-transform: $transforms;
  -o-transform: $transforms;
  -ms-transform: $transforms;
  -webkit-transform: $transforms;
  transform: $transforms;
}

@mixin transform-origin($origin) {
  moz-transform-origin: $origin;
  -o-transform-origin: $origin;
  -ms-transform-origin: $origin;
  -webkit-transform-origin: $origin;
  transform-origin: $origin;
}

@mixin rotated-text($num-letters: 100, $angle-span: 180deg, $angle-offset: 0deg) {
  $angle-per-char: math.div($angle-span, $num-letters);
  @for $i from 1 through $num-letters {
    .char#{$i} {
      @include transform(rotate($angle-offset + $angle-per-char * $i));
    }
  }
}

// LOOPS
@each $current-color in $bar-colors {
  $i: list.index($bar-colors, $current-color);
  #x#{$i} {
    background: $current-color;
  }
}

@for $i from 1 to 8 {
  .bar:nth-child(#{$i}) {
    @include absolute(
      $top: 0px,
      $left: 20px *
        (
          $i - 1
        )
    );
  }
}

// PLACEHOLDERS
%center {
  @include absolute($top: 50%, $left: 50%);
  transform: translateX(-50%) translateY(-50%);
}

%center-inside {
  @include relative($top: 50%, $left: 50%);
  transform: translateX(-50%) translateY(-50%);
}

%ring-text {
  text-align: center;
  @include transform-origin(center center);
}
.dark .clock_container {
  --main-card-background: #ADC8FF;
}
.clock_container {
  transform: scale(0.56);
  border: 0;
  font-weight: 900;
  // font-family: 'Roboto Mono', monospace;
  font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  height: 100%;
  margin: 0px;
  width: 100%;
  // position: relative;
  // border-radius: 9999px;
}

.clock_h1 {
  color: #555;
  font-size: 25px;
}

.clock_h2 {
  color: #555;
  font-size: 15px;
}

// CLASSES AND IDS IN ORDER OF APPEARANCE IN HTML

.center-dial {
  @include absolute($top: calc(50% - 75px), $left: calc(50% - 75px));
  @include transition(all 0.5s);
  @include size($center-dial-size);
  background: var(--main-card-background);
  border-radius: 50%;
  color: var(--main-font-color);
  cursor: var(--main-pointer-cursor);
  overflow: hidden;
}

.center-preview span {
  @extend %ring-text;
  @include absolute($top: 0%, $left: calc(50% - 12.5px));
  height: $center-dial-size;
  width: $h1-size;
}

.center-preview {
  @include opacity(0);
  @include rotated-text($num-letters: 6, $angle-span: 120deg, $angle-offset: -60deg);
}

.clock_head {
  @extend %center-inside;
  @include size(100%, 100%);
  // 头像背景由 :style 动态注入（来自 theme.siteMeta.author.cover / siteMeta.avatar）
  // 此处仅保留 fallback 样式：无头像时显示卡片底色
  background-color: var(--main-card-background);
  background-repeat: no-repeat;
  background-position: center center;
  border: 5px solid var(--main-card-background);
  background-size: cover;
  border-radius: 50%;
}
.clock_head-bg {
  @include absolute($top: 0, $left: 0, $bottom: 0, $right: 0);
  background: var(--main-card-background);
  opacity: 0;
  border-radius: 50%;
}

// .clock_torso {
//   @include relative($top: calc(50% - 20px), $left: calc(50% - 50px));
//   @include size(100px, 100px);
//   background: #fff;
//   border-radius: 50%;
// }

.clock_hand-container {
  @extend %ring-text;
  @include absolute($top: 0%, $left: calc(50% - 12.5px));
  @include opacity(0);
  @include size($h1-size, $center-dial-size);
  @include transform-origin(center center);
}

.clock_hour-hand {
  @include size(10px, 50px);
  @include relative($top: calc(50% - 45px), $left: calc(50% - 5px));
  @include transition(all 0.5s);
  background: #21232a;
  box-shadow: 0 0 10px 0 rgba(0,0,0,1);
  border-radius: 5px;
}

.clock_minute-hand {
  @include size(10px, 70px);
  @include relative($top: calc(50% - 65px), $left: calc(50% - 5px));
  background: #1b1c20;
  box-shadow: 0 0 10px 0 rgba(0,0,0,1);
  border-radius: 5px;
}

.clock_second-hand {
  @include size(2px, 70px);
  @include relative($top: calc(50% - 69px), $left: calc(50% - 1px));
  background: #000;
  box-shadow: 0 0 10px 0 rgba(0,0,0,1);
  border-radius: 1px;
}

.clock_day-name-dial {
  @extend %center;
  @include size($day-name-size);
  @include transition(all 0.5s);
}

.day-name-preview span {
  @extend %ring-text;
  @include absolute($top: calc(-25% - 5px), $left: calc(50% - 12.5px));
  height: $day-name-size;
  width: $h1-size;
}

.day-name-preview {
  @include opacity(0);
  @include rotated-text($num-letters: 9, $angle-span: 90deg, $angle-offset: -45deg);
}

.day-name-text span {
  @extend %ring-text;
  @include absolute($top: calc(-25% + 5px), $left: calc(50% - 6px));
  height: 232px;
  width: $h2-size;
}

.day-name-text {
  @include opacity(0);
  @include rotated-text($num-letters: 28, $angle-span: 270deg, $angle-offset: -135deg);
}

.month-dial {
  @extend %center;
  @include size($month-size);
  @include transition(all 0.5s);
}

.month-preview span {
  @extend %ring-text;
  @include absolute($top: calc(-25% + 20px), $left: calc(50% - 12.5px));
  height: $month-size;
  width: $h1-size;
}

.month-preview {
  @include opacity(0);
  @include rotated-text($num-letters: 6, $angle-span: 90deg, $angle-offset: -45deg);
}

.month-text span {
  @extend %ring-text;
  @include absolute($top: calc(-25% + 30px), $left: calc(50% - 6px));
  height: 332px;
  width: $h2-size;
}

.month-text {
  @include opacity(0);
  @include rotated-text($num-letters: 48, $angle-span: 270deg, $angle-offset: -135deg);
}

.day-dial {
  @extend %center;
  @include size(450px, 450px);
  @include transition(all 0.5s);
}
.background-clock {
  // background: $background-grey;
  @extend %center;
  @include size(450px, 450px);
  z-index: -1;
  border-radius: 9999px;
}

.day-preview span {
  @extend %ring-text;
  @include absolute($top: calc(-25% + 45px), $left: calc(50% - 12.5px));
  height: $day-size;
  width: $h1-size;
}

.day-preview {
  @include opacity(0);
  @include rotated-text($num-letters: 4, $angle-span: 90deg, $angle-offset: -45deg);
}

.day-text span {
  @extend %ring-text;
  @include absolute($top: calc(-25% + 55px), $left: calc(50% - 6px));
  height: 432px;
  width: $h2-size;
}

.day-text {
  @include opacity(0);
  @include rotated-text($num-letters: 93, $angle-span: 270deg, $angle-offset: -135deg);
}

.clock_ring-back {
  @include opacity(0.1);
  @include size(100%, 100%);
  border: solid 10px transparent;
  border-radius: 50%;

  &:before {
    @include absolute($top: 5px, $left: 5px, $bottom: 5px, $right: 5px);
    border-radius: 50%;
    border: solid 35px $clock_ring-back;
    content: ' ';
  }
}

.ring {
  @include relative($top: -100%);
  @include size(100%, 100%);
  @include transition(all 0.5s);
  // border: solid 45px var(--main-card-background);
  border: solid 45px var(--main-card-background);
  border-radius: 50%;
  border-bottom-color: var(--main-card-background-opacity);
  box-shadow: 0px -2px 2px var(--main-card-background-opacity);
}

#weather {
  @include absolute($top: calc(50% - 100px), $left: calc(20% - 100px));
}

#steps {
  @include absolute($top: calc(50% - 100px), $left: calc(80% - 100px));
}

.fa-cloud {
  @include opacity(0);
  @include absolute($top: calc(50% - 40px), $left: calc(50% - 40px));
  color: #555;
  font-size: 80px;
}

.temperature {
  @include opacity(0);
  @include absolute($top: 10%, $left: 55%);
  color: #ffcc00;
  font-size: 20px;
}

.bars {
  @include opacity(0);
  @include relative($top: calc(50% - 70px), $left: calc(50% - 65px));
  @include size(140px, 140px);
}

.bar {
  @include size(18px, 140px);
  margin: 0px -4px;
}

.day-letter {
  @include relative($top: 110px);
  color: #555;
  font-size: 18px;
  text-align: center;
}

.x {
  @include absolute($bottom: 30px, $left: 1px);
  @include size(16px, 2px);
  @include transition(all 0.5s);
}
</style>
