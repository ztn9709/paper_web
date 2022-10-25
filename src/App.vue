<template>
  <Header />
  <h1>APP<i>abc</i></h1>
  <h3>abc</h3>
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
