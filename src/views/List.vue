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
        <el-date-picker style="width: auto" v-model="params.date" type="daterange" unlink-panels range-separator="To" start-placeholder="Start date" end-placeholder="End date" :shortcuts="shortcuts" :disabled-date="disabledDate" value-format="YYYY-MM-DD" />
      </div>
      <br />
      <!-- 
      <div>选择期刊范围</div>
      <br />
      <el-checkbox :indeterminate="isIndeterminatePub" v-model:value="checkAllPubs" @change="handleCheckAllPubsChange">全选</el-checkbox>
      <div style="margin: 15px 0"></div>
      <el-checkbox-group v-model:value="checkedPubs" @change="handleCheckedPubsChange">
        <el-checkbox v-for="pub in pubs" :label="pub" :key="pub">{{ pub }}({{ pubCounts[pub] }})</el-checkbox>
      </el-checkbox-group>
      <br />
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
      <el-pagination v-model:current-page="params.page" :page-size="params.size" layout="total, prev, pager, next,jumper" :total="total"></el-pagination>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref, watchEffect } from 'vue'
import { inject } from 'vue'
import { $on, $off, $once, $emit } from '../utils/gogocodeTransfer'
import Article from '../components/Article.vue'
const axios = inject('axios')
const pubOptions = ['Physical Review B', 'Physical Review Letters', 'Physical Review Research', 'Physical Review A', 'Reviews of Modern Physics']
const areaOptions = ['Topological phases of matter', 'Symmetry protected topological states', 'Topological insulators', 'Topological order', 'Topological phase transition', 'Topological superconductors', 'Topological materials']
const params = reactive({
  page: 1,
  size: 10,
  date: null,
  pubs: pubOptions,
  area: '',
  text: ''
})
const input = ref('')
const paperList = ref([])
const total = ref(0)
const disabledDate = time => {
  return time.getTime() > Date.now()
}
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
watchEffect(async () => {
  const { data } = await axios.get('/api/paper/search', { params })
  if (data[0].data.length == 0 || params.pubs.length == 0) {
    paperList.value = []
    total.value = 0
    // this.pubCounts = {}
    // this.areaCounts = {}
  } else {
    paperList.value = data[0].data
    total.value = data[0].total[0].total
    // this.pubCounts = {}
    // this.areaCounts = {}
    // res[0].groupPub.forEach(item => {
    //   this.pubCounts[item._id] = item.value
    // })
    // res[0].groupArea.forEach(item => {
    //   if (areaOptions.includes(item._id)) {
    //     this.areaCounts[item._id] = item.value
    //   }
    // })
  }
  document.documentElement.scrollTop = 0
})
//     return {
//       checkAllPubs: true,
//       isIndeterminatePub: false,
//       dialogTableVisible: false,

//     handleCheckAllPubsChange(val) {
//       this.checkedPubs = val ? pubOptions : []
//       this.isIndeterminatePub = false
//     },
//     handleCheckedPubsChange(value) {
//       let checkedCount = value.length
//       this.checkAllPubs = checkedCount === this.pubs.length
//       this.isIndeterminatePub = checkedCount > 0 && checkedCount < this.pubs.length
//     }
//   }
// }
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
