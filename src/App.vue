<template>
  <Header />
  <br />
  <div class="container">
    <router-view></router-view>
  </div>
  <Footer />
</template>

<script setup>
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
</script>

<style scoped lang="less">
.container {
  width: 1080px;
  margin: auto;
  margin-top: 60px;
}
</style>
