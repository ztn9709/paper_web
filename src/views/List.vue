<template>
  <el-row :gutter="20">
    <el-col :span="6">
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
        <el-date-picker
          style="width: auto"
          v-model="params.date"
          type="daterange"
          unlink-panels
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          :shortcuts="shortcuts"
          :disabled-date="disabledDate"
          value-format="YYYY-MM-DD"
        />
      </div>
      <br />
      <div class="demonstration">选择期刊范围</div>
      <el-checkbox
        v-model="checkAllPubs"
        :indeterminate="isIndeterminatePub"
        @change="handleCheckAllPubsChange"
      >
        全选
      </el-checkbox>
      <!-- <div style="margin: 15px 0"></div> -->
      <el-checkbox-group v-model="params.pubs" @change="handleCheckedPubsChange">
        <el-checkbox v-for="pub in pubs" :label="pub" :key="pub">
          {{ pub }}({{ pubCounts[pub] }})
        </el-checkbox>
      </el-checkbox-group>
      <br />
      <div class="demonstration">选择研究领域范围</div>
      <el-checkbox
        v-model="checkAllAreas"
        :indeterminate="isIndeterminateArea"
        @change="handleCheckAllAreasChange"
      >
        全选
      </el-checkbox>
      <!-- <div style="margin: 15px 0"></div> -->
      <el-checkbox-group v-model="params.areas" @change="handleCheckedAreasChange">
        <el-checkbox v-for="area in areas" :label="area" :key="area">
          {{ area }}({{ areaCounts[area] }})
        </el-checkbox>
      </el-checkbox-group>
      <!-- 
      <span>选择研究领域 </span>
      <el-button type="primary" size="small" icon="el-icon-delete" @click="area = 0">取消</el-button>
      <br />
      <br />
      <el-radio-group v-model:value="area" size="small">
        <el-radio-button v-for="i in 7" :label="i" :key="i">{{ areas[i - 1] }}({{ areaCounts[areas[i - 1]] }})</el-radio-button>
      </el-radio-group> -->
    </el-col>
    <el-col :span="18">
      <el-space direction="vertical">
        <Article v-for="paper in paperList" :key="paper.DOI" :paper="paper" />
      </el-space>
      <br />
      <el-pagination
        v-model:current-page="params.page"
        :page-size="params.size"
        layout="total, prev, pager, next,jumper"
        :total="total"
      ></el-pagination>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref, watchEffect } from 'vue'
import { inject } from 'vue'
import { $on, $off, $once, $emit } from '../utils/gogocodeTransfer'
import Article from '../components/Article.vue'
const axios = inject('axios')
const pubs = ref([])
const areas = ref([])
// const pubs = [
//   'Physical Review B',
//   'Physical Review Letters',
//   'Physical Review Research',
//   'Physical Review A',
//   'Reviews of Modern Physics'
// ]
// const areaOptions = [
//   'Topological phases of matter',
//   'Symmetry protected topological states',
//   'Topological insulators',
//   'Topological order',
//   'Topological phase transition',
//   'Topological superconductors',
//   'Topological materials'
// ]
const params = reactive({
  page: 1,
  size: 10,
  date: null,
  pubs: pubs.value,
  areas: areas.value,
  text: ''
})
const input = ref('')
const paperList = ref([])
const total = ref(0)
const pubCounts = ref({})
const areaCounts = ref({})
const checkAllPubs = ref(true)
const checkAllAreas = ref(true)
const isIndeterminatePub = ref(false)
const isIndeterminateArea = ref(false)
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
;(async () => {
  const { data } = await axios.get('/api/paper/classify', { params: { classify: 'publication' } })
  pubs.value = data.map(item => item._id)
  params.pubs = pubs.value
})()
;(async () => {
  const { data } = await axios.get('/api/paper/classify', { params: { classify: 'areas' } })
  areas.value = data.map(item => item._id)
  console.log(data)
  params.areas = areas.value
})()
watchEffect(async () => {
  const { data } = await axios.get('/api/paper/search', { params })
  if (data[0].data.length == 0 || params.pubs.length == 0 || params.areas.length == 0) {
    paperList.value = []
    total.value = 0
    pubCounts.value = {}
    areaCounts.value = {}
  } else {
    paperList.value = data[0].data
    total.value = data[0].total[0].total
    pubCounts.value = {}
    areaCounts.value = {}
    data[0].groupPub.forEach(item => {
      pubCounts.value[item._id] = item.value
    })
    data[0].groupArea.forEach(item => {
      areaCounts.value[item._id] = item.value
    })
  }
  document.documentElement.scrollTop = 0
})
// dialogTableVisible: false,
const handleCheckAllPubsChange = val => {
  params.pubs = val ? pubs.value : []
  isIndeterminatePub.value = false
}
const handleCheckAllAreasChange = val => {
  params.areas = val ? areas.value : []
  isIndeterminateArea.value = false
}
const handleCheckedPubsChange = value => {
  let checkedCount = value.length
  checkAllPubs.value = checkedCount === pubs.value.length
  isIndeterminatePub.value = checkedCount > 0 && checkedCount < pubs.value.length
}
const handleCheckedAreasChange = value => {
  let checkedCount = value.length
  checkAllAreas.value = checkedCount === areas.value.length
  isIndeterminateArea.value = checkedCount > 0 && checkedCount < areas.value.length
}
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
// .el-input-group__append .el-button {
//   background-color: #409eff;
//   border-color: #409eff;
//   color: #fff;
//   vertical-align: text-top;
// }
</style>
