<template>
  <div class="not-found-content">
    <NotFoundNum @click="backHome" />
    <Code @backHome="backHome" />
  </div>
</template>

<script setup>
import NotFoundNum from './NotFoundNum.vue'
import Code from './Code.vue'
const router = useRouter()
const backHome = () => {
  router.go('/')
}
</script>

<style lang="scss" scoped>
.not-found-content {
  padding: 70px 0 50px 0;
  //  background: linear-gradient(135deg, #0c0e14 0%, #1a1d29 100%);
  color: #abb2bf;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
