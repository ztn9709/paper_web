<template lang="pug">
Header
br
.container
  router-view
Footer
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
<!-- <style>
body {
  background-color: #f0f2f5;
}
</style> -->
