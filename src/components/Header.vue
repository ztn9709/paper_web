<template lang="pug">
el-header
  el-row(type="flex" justify="start")
    a(href="#/home")
      el-image(:src="img" style="width: 50px; height: 50px; padding-right: 10px" fit="cover")
    .title 凝聚态物质文献数据库
    el-menu(:default-active="activePath" mode="horizontal" router background-color="#43484d" text-color="#fff" active-text-color="#ffd04b" :ellipsis="false")
      el-menu-item(index="/home")
        House.icon
        | 主页
      el-menu-item(index="/search")
        Search.icon
        | 搜索
      el-menu-item(index="/" disabled)
        Loading.icon
        | 其他
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import img from '@/assets/logo.png'
const activePath = computed(() => useRoute().path)
</script>

<style scoped lang="less">
.el-menu {
  border-bottom: 0;
  margin-left: 10px;
}
.title {
  color: white;
  line-height: 60px;
}
.el-header {
  background-color: #43484d;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 999;
}
</style>
