<template>
  <el-row :gutter="20">
    <el-col :span="7" style="border: 2px solid black">
      <br />
      <el-input placeholder="请输入关键词" v-model="input" clearable>
        <template #suffix>
          <el-button @click="params.text = input" type="primary">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>
      <br />
      <br />
      <div class="date-picker">
        <span class="demonstration">选择时间范围</span>
        <el-date-picker style="width: auto" v-model="params.date" type="daterange" unlink-panels range-separator="To" start-placeholder="Start date" end-placeholder="End date" :shortcuts="shortcuts" :disabled-date="disabledDate" value-format="YYYY-MM-DD" />
      </div>
      <br />
      <div class="demonstration">选择主题范围</div>
      <Checkbox :total="total" :optList="subList" :checkedList="params.subs" :optCounts="subCounts" @checkedChange="val => (params.subs = val)" />
      <br />
      <div class="demonstration">选择期刊范围</div>
      <Checkbox :total="total" :optList="pubList" :checkedList="params.pubs" :optCounts="pubCounts" @checkedChange="val => (params.pubs = val)" />
      <br />
      <div class="demonstration">选择研究领域范围</div>
      <Checkbox :total="total" :optList="areaList" :checkedList="params.areas" :optCounts="areaCounts" @checkedChange="val => (params.areas = val)" />
    </el-col>
    <el-col :span="17">
      <el-space direction="vertical">
        <Article v-for="paper in paperList" :key="paper.DOI" :paper="paper" />
      </el-space>
      <br />
      <el-pagination v-model:current-page="params.page" :page-size="params.size" layout="total, prev, pager, next,jumper" :total="total"></el-pagination>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref, watchEffect } from 'vue'
import { inject } from 'vue'
import Article from '../components/Article.vue'
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
  areaList.value = data.map(item => item._id).slice(0, 20)
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
  text: ''
})
const input = ref('')
const total = ref(0)
const subCounts = ref({})
const pubCounts = ref({})
const areaCounts = ref({})
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
//侦听params变化，请求文章数据
watchEffect(async () => {
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
  document.documentElement.scrollTop = 0
})
</script>

<style scoped lang="less">
.demonstration {
  text-align: center;
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
:deep(.el-input__wrapper) {
  padding-right: 0;
}
:deep(.el-checkbox__label) {
  font-size: 12px;
}
</style>
