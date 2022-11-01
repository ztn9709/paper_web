<template lang="pug">
el-card.box-card
  template(#header)
    .card-header
      span(style="color: #3294d8; font-size: 24px")
        | {{ paper.title }}
      el-button(type="primary" @click="openLink(paper.link)")
        | 访问原文
  .text.item(v-for="(val, key) in paper" :key="key")
    div(v-if="key[0] != '_' && key != 'link' && key != 'title' && key != 'topo_label' && key != 'institutes'")
      | {{ capitalize(key) }} : {{ array2string(val) }}
</template>

<script setup>
defineProps(['paper'])
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
const array2string = val => (Array.isArray(val) ? val.join(', ') : val)
const openLink = link => window.open(link, '_blank')
</script>

<style scoped lang="less">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 18px;
  font-family: 'Times New Roman', Georgia, Serif;
}
.item {
  margin-bottom: 18px;
}
.box-card {
  width: 100%;
}
</style>
