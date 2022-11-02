<template lang="pug">
el-card.box-card
  template(#header)
    .card-header
      div(style="font-size:12px;font-weight:bold;padding-bottom:5px;color:#F56C6C")
        |{{paper.publication}} | {{paper.date}}
        el-button(type="info" round @click="openLink(paper.link)" style="float:right")
          | Original
      div
        | {{ paper.title }}
  .text.item
    | {{array2string(paper.authors)}}
  el-collapse(v-model="activeNames" style="margin-bottom:10px")
    el-collapse-item(title="Abstract (click to expand)" name="1")
      .text.item
        | {{paper.abstract}}
  .text.item
    | Areas : {{array2string(paper.areas)}}
  .text.item(v-if="paper.keywords.length>0")
    | Keywords : {{array2string(paper.keywords)}}
  .text.item
    | DOI : {{paper.DOI}}
</template>

<script setup>
import { ref } from 'vue'
defineProps(['paper'])
const activeNames = ref([])
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
const array2string = val => (Array.isArray(val) ? val.join(', ') : val)
const openLink = link => window.open(link, '_blank')
</script>

<style scoped lang="less">
.card-header {
  justify-content: space-between;
  align-items: center;
  color: #3294d8;
  font-size: 18px;
}
.text {
  font-size: 12px;
}
.item {
  margin-bottom: 8px;
}
.box-card {
  width: 100%;
  min-width: 805px;
}
:deep(.el-collapse-item__header) {
  font-size: 12px;
  color: #3294d8;
}
</style>
