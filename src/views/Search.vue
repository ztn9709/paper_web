<template lang="pug">
el-row
  div(style="margin-bottom: 20px; font-size: 26px; font-weight: bold")
    | {{ total }}条来自凝聚态文献数据库的结果：
  el-input(placeholder="Please Input" v-model="input" clearable @change="search")
    template(#prepend)
      el-select(v-model="select" style="width: 125px")
        el-option(label="Title/Abstract" value="text")
        el-option(label="Author" value="authors")
        el-option(label="DOI" value="DOI")
    template(#append)
      el-button(@click="warning")
        Search(class="icon")
        | Search
br
el-row(:gutter="20")
  el-col(:span="6")
    el-collapse(v-model="activeNames")
      el-collapse-item(name="1")
        template(#title)
          Calendar(class="icon")
          | Date
        el-date-picker(style="width: auto" v-model="params.date" type="daterange" unlink-panels range-separator="To" start-placeholder="Start date" end-placeholder="End date" :shortcuts="shortcuts" :disabled-date="disabledDate" value-format="YYYY-MM-DD")
      el-collapse-item(name="2")
        template(#title)
          Files(class="icon")
          | Subjects
        Checkbox(:total="total" :optList="subList" :checkedList="params.subs" :optCounts="subCounts" @checkedChange="val => (params.subs = val)")
      el-collapse-item(name="3")
        template(#title)
          Collection(class="icon")
          | Journals
        Checkbox(:total="total" :optList="pubList" :checkedList="params.pubs" :optCounts="pubCounts" @checkedChange="val => (params.pubs = val)")
      el-collapse-item(name="4")
        template(#title)
          PieChart(class="icon")
          | Research Areas
        Checkbox(:total="total" :optList="areaList" :checkedList="params.areas" :optCounts="areaCounts" @checkedChange="val => (params.areas = val)")
  el-col(:span="18" v-loading="loading" element-loading-text="Loading...")
    el-radio-group(v-model="params.sort" size="small")
      el-radio-button(label)
        | 默认
      el-radio-button(label="-1")
        | 时间降序
      el-radio-button(label="1")
        | 时间升序
    br
    br
    el-space(direction="vertical")
      Article(v-for="paper in paperList" :key="paper.DOI" :paper="paper")
    br
    el-pagination(v-model:current-page="params.page" :page-size="params.size" layout="total, prev, pager, next,jumper" :total="total")
</template>

<script setup>
import { reactive, ref, watchEffect, inject } from 'vue'
import { ElMessage } from 'element-plus'
import Article from '@/components/Article.vue'
import Checkbox from '@/components/Checkbox.vue'
const axios = inject('axios')
const subList = ref([])
const pubList = ref([])
const areaList = ref([])
//初始化出版社和研究领域标签列表
const initOpt = async classify => {
  const { data } = await axios.get('/api/paper/classify', { params: { classify } })
  return data
}
initOpt('topo_label').then(data => {
  subList.value = data.map(item => item._id)
})
initOpt('publication').then(data => {
  pubList.value = data.map(item => item._id)
})
initOpt('areas').then(data => {
  areaList.value = data.map(item => item._id).slice(0, 50)
})
//定义文章数据和请求参数
const paperList = ref([])
const params = reactive({
  page: 1,
  size: 10,
  date: null,
  subs: [],
  pubs: [],
  areas: [],
  reg: { text: '' },
  sort: ''
})
const input = ref('')
const select = ref('text')
const total = ref(0)
const subCounts = ref({})
const pubCounts = ref({})
const areaCounts = ref({})
const loading = ref(true)
const activeNames = ref(['1', '2', '3', '4'])
const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]
const disabledDate = time => {
  return time.getTime() > Date.now()
}
const search = () => {
  params.reg = { [select.value]: input.value }
}
const warning = () => {
  if (input.value == '') {
    ElMessage({
      showClose: true,
      message: '输入内容为空，请输入！',
      type: 'warning'
    })
  }
}
//侦听params变化，请求文章数据
watchEffect(async () => {
  loading.value = true
  const { data } = await axios.get('/api/paper/search', { params })
  if (data[0].data.length == 0) {
    paperList.value = []
    total.value = 0
    subCounts.value = {}
    pubCounts.value = {}
    areaCounts.value = {}
  } else {
    paperList.value = data[0].data
    total.value = data[0].total[0].total
    subCounts.value = {}
    pubCounts.value = {}
    areaCounts.value = {}
    data[0].groupSub.forEach(item => {
      subCounts.value[item._id] = item.value
    })
    data[0].groupPub.forEach(item => {
      pubCounts.value[item._id] = item.value
    })
    data[0].groupArea.forEach(item => {
      areaCounts.value[item._id] = item.value
    })
  }
  loading.value = false
  // document.documentElement.scrollTop = 0
})
</script>

<style scoped lang="less">
:deep(.el-input-group__prepend) {
  background-color: var(--el-fill-color-blank);
}
:deep(.el-input__wrapper) {
  height: 40px;
}
:deep(.el-checkbox) {
  display: block;
  .el-checkbox__label {
    font-size: 12px;
    white-space: normal;
  }
}
</style>
