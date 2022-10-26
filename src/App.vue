<template>
  <Header />
  <router-view></router-view>
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
</style>
