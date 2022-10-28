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

<style lang="less">
h1 {
  font-weight: 100;
  i {
    color: red;
  }
}
.container {
  width: 1080px;
  margin: auto;
}
</style>
