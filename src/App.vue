<template lang="pug">
Header
br
#main
  router-view
Footer
</template>

<script setup>
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
</script>

<style lang="less">
#main {
  width: 1080px;
  margin: auto;
  margin-top: 60px;
}
.icon {
  width: 1em;
  height: 1em;
  margin-right: 6px;
}
</style>
