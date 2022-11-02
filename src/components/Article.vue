<template lang="pug">
el-card.box-card
  template(#header)
    .title
      div.subtitle
        |{{paper.publication}} | {{paper.date}}
        el-button(type="primary" @click="openLink(paper.link)" style="float:right")
          Link(style="width: 1em; height: 1em; margin-right: 6px")
          | HTML
      | {{ paper.title }}
  .text
    span.bold
      | Authors: 
    | {{array2string(paper.authors)}}
  el-collapse(v-model="activeNames")
    el-collapse-item(title="Abstract: (click to expand)" name="1")
      .text
        | {{paper.abstract}}
  .text
    span.bold
      | Areas : 
    | {{array2string(paper.areas)}}
  .text(v-if="paper.keywords.length>0")
    span.bold
      | Keywords : 
    | {{array2string(paper.keywords)}}
  .text
    span.bold
      | DOI : 
    | {{paper.DOI}}
</template>

<script setup>
import { ref } from 'vue'

defineProps(['paper'])
const activeNames = ref([])
const array2string = val => (Array.isArray(val) ? val.join('; ') : val)
const openLink = link => window.open(link, '_blank')
</script>

<style scoped lang="less">
.box-card {
  width: 100%;
  min-width: 805px;
  .title {
    justify-content: space-between;
    align-items: center;
    color: #3294d8;
    font-size: 20px;
    .subtitle {
      font-size: 14px;
      font-weight: bold;
      padding-bottom: 5px;
      color: #f56c6c;
    }
  }
  .text {
    font-size: 14px;
    margin-bottom: 8px;
    .bold {
      font-weight: bold;
    }
  }
}
:deep(.el-collapse) {
  border-top: 0px;
  margin-bottom: 8px;
  .el-collapse-item__header {
    font-weight: bold;
    border-bottom: 0px;
    color: #3294d8;
  }
}
</style>
