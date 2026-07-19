<template>
  <div id="card-wechat" class="card-widget">
    <div id="flip-wrapper">
      <div id="flip-content">
        <div class="face" :style="`background: url(${theme.aside.wechat.face}) center center / 100% no-repeat`"></div>
        <div class="back face" :style="`background: url(${theme.aside.wechat.back}) center center / 100% no-repeat`"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { theme } = useData()
</script>

<style lang="scss" scoped>
.card-widget#card-wechat {
  background: #57bd6a;
  display: flex;
  justify-content: center;
  align-content: center;
  padding: 0;
  cursor: pointer;
  border: none;
  height: 110px;
  border-radius: 12px;
  -webkit-transition: 0.3s;
  -moz-transition: 0.3s;
  -o-transition: 0.3s;
  -ms-transition: 0.3s;
  transition: 0.3s;
}
.dark .card-widget#card-wechat {
  background-color: #121121;
  border: 1px solid var(--main-card-border);
}

#flip-wrapper {
  -webkit-perspective: 1000;
  perspective: 1000;
}

#flip-wrapper {
  position: relative;
  width: 235px;
  height: 110px;
  z-index: 1;
}
#flip-content {
  width: 100%;
  height: 100%;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  transition: cubic-bezier(0, 0, 0, 1.29) 0.3s;
}
#flip-wrapper #flip-content .face {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  background-size: 100%;
}

#flip-wrapper #flip-content .back.face {
  display: block;
  -webkit-transform: rotateY(180deg);
  transform: rotateY(180deg);
  box-sizing: border-box;
  background-size: 100%;
}
#card-wechat:hover #flip-wrapper #flip-content {
  -webkit-transform: rotateY(180deg);
  transform: rotateY(180deg);
}
</style>
