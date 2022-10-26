<template>
  <div id="box">
    <el-input
      placeholder="请输入关键词或作者或DOI号"
      v-model:value="text"
      clearable
    >
      <template v-slot:append>
        <el-button
          icon="el-icon-search"
          @click="
            currentPage = 1
            initList()
          "
          >搜索</el-button
        >
      </template>
    </el-input>
    <br />
    <br />
    <div class="block">
      <span class="demonstration">选择时间范围 </span>
      <el-date-picker
        v-model:value="date"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
    </div>
    <br />
    <div>选择期刊范围</div>
    <br />
    <el-checkbox
      :indeterminate="isIndeterminatePub"
      v-model:value="checkAllPubs"
      @change="handleCheckAllPubsChange"
      >全选</el-checkbox
    >
    <div style="margin: 15px 0"></div>
    <el-checkbox-group
      v-model:value="checkedPubs"
      @change="handleCheckedPubsChange"
    >
      <el-checkbox v-for="pub in pubs" :label="pub" :key="pub"
        >{{ pub }}({{ pubCounts[pub] }})</el-checkbox
      >
    </el-checkbox-group>
    <br />
    <span>选择研究领域 </span>
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-delete"
      @click="area = 0"
      >取消</el-button
    >
    <br />
    <br />
    <el-radio-group v-model:value="area" size="small">
      <el-radio-button v-for="i in 7" :label="i" :key="i"
        >{{ areas[i - 1] }}({{ areaCounts[areas[i - 1]] }})</el-radio-button
      >
    </el-radio-group>
    <br />
    <br />
    <!-- <div>
              该页中可能相关的结构：
              <div v-for="l in outlink" :key="l">
                <el-link :href="l" :underline="false" target="_blank" style="color: #3294d8; font-size: 20px">{{ l }}</el-link>
              </div>
            </div> -->
    <el-card v-for="paper in paperList" :key="paper.DOI" class="box-card">
      <template v-slot:header>
        <div class="clearfix">
          <!-- <el-button type="text" @click="dialogTableVisible = true">查看相似文章</el-button>

                <el-dialog title="Top 10 papers" :visible.sync="dialogTableVisible">
                  <el-table :data="gridData">
                    <el-table-column property="title" label="Title" width="400"></el-table-column>
                    <el-table-column property="similarity" label="Similarity" width="200"></el-table-column>
                  </el-table>
                </el-dialog> -->
          <span
            ><el-link
              :href="paper.link"
              :underline="false"
              target="_blank"
              style="color: #3294d8; font-size: 30px"
              >{{ paper.title }}</el-link
            ></span
          >
          <!-- <el-button style="float: right; padding: 10px 0" type="text">操作按钮</el-button> -->
        </div>
      </template>
      <div v-for="(val, key) in paper" :key="key" class="text item">
        <div
          v-if="
            key[0] != '_' &&
            key != 'link' &&
            key != 'title' &&
            key != 'topo_label'
          "
        >
          {{ capitalize_filter(key) }} : {{ array2String_filter(val) }}
        </div>
      </div>
    </el-card>
    <br />
    <el-pagination
      @current-change="handleCurrentChange"
      v-model:current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next,jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { $on, $off, $once, $emit } from '../utils/gogocodeTransfer'
const pubOptions = [
  'Physical Review B',
  'Physical Review Letters',
  'Physical Review Research',
  'Physical Review A',
  'Reviews of Modern Physics',
]
const areaOptions = [
  'Topological phases of matter',
  'Symmetry protected topological states',
  'Topological insulators',
  'Topological order',
  'Topological phase transition',
  'Topological superconductors',
  'Topological materials',
]
export default {
  name: 'List',
  data() {
    return {
      paperList: [],
      text: '',
      date: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      area: 0,
      areas: areaOptions,
      checkedPubs: pubOptions,
      pubs: pubOptions,
      pubCounts: {},
      areaCounts: {},
      checkAllPubs: true,
      isIndeterminatePub: false,
      dialogTableVisible: false,
      gridData: [
        {
          title:
            'Effect of magnetic impurity scattering on transport in topological insulators',
          similarity: 1,
        },
        {
          title:
            'Edge spin transport in the disordered two-dimensional topological insulator WTe2',
          similarity: 0.9298438429832458,
        },
        {
          title:
            'Conductance of quantum spin Hall edge states from first principles: The critical role of magnetic impurities and inter-edge scattering',
          similarity: 0.9279910326004028,
        },
        {
          title:
            'Elastic backscattering of quantum spin Hall edge modes from Coulomb interactions with nonmagnetic impurities',
          similarity: 0.9257125854492188,
        },
        {
          title:
            'Spontaneous thermal Hall conductance in superconductors with broken time-reversal symmetry',
          similarity: 0.9173614382743835,
        },
        {
          title:
            'Dynamic impurities in two-dimensional topological-insulator edge states',
          similarity: 0.9150208830833435,
        },
        {
          title:
            'Conductance suppression by nonmagnetic point defects in helical edge channels of two-dimensional topological insulators',
          similarity: 0.9142051935195923,
        },
        {
          title:
            'Disorder-induced currents as signatures of chiral superconductivity',
          similarity: 0.9139000773429871,
        },
        {
          title:
            'Two-spin entanglement induced by scattering of backscattering-free chiral electrons in a Chern insulator',
          similarity: 0.9130393862724304,
        },
        {
          title:
            'Backscattering off a driven Rashba impurity at the helical edge',
          similarity: 0.9121874570846558,
        },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              $emit(picker, 'pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              $emit(picker, 'pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              $emit(picker, 'pick', [start, end])
            },
          },
        ],
      },
    }
  },
  watch: {
    currentPage() {
      this.initList()
    },
    date() {
      this.currentPage = 1
      this.initList()
    },
    checkedPubs() {
      this.currentPage = 1
      this.initList()
    },
    area() {
      this.currentPage = 1
      this.initList()
    },
  },
  created() {
    this.initList()
  },
  emits: ['pick'],
  methods: {
    array2String_filter: (val) => {
      if (Array.isArray(val)) {
        return val.join(', ')
      } else {
        return val
      }
    },
    capitalize_filter: (val) => val.slice(0, 1).toUpperCase() + val.slice(1),
    async initList() {
      const params = {
        page: this.currentPage,
        size: this.pageSize,
        date: this.date,
        pubs: this.checkedPubs,
        area: this.areas[this.area - 1],
        text: this.text,
      }
      const { data: res } = await this.axios.get('/api/paper/search', {
        params,
      })
      if (res[0].data.length == 0 || this.checkedPubs.length == 0) {
        this.paperList = []
        this.total = 0
        this.pubCounts = {}
        this.areaCounts = {}
      } else {
        this.paperList = res[0].data
        // res[0].data.forEach((item, ind) => {
        //   let patterns = []
        //   item.abstract.split(' ').forEach(w => {
        //     // let formula = w.match(/\b([A-Z][a-z]{0,2}\d{0,3})+/g)
        //     let formula = w.match(/\b([A-Z][a-z]?\d{0,3})+/)
        //     if (formula) {
        //       if (formula[0].length == w.length && w.length > 2) {
        //         patterns.push(formula[0])
        //       }
        //     }
        //   })
        //   patterns = [...new Set(patterns)]
        //   patterns.forEach(async p => {
        //     let eles = p.split(/\d+/).filter(ele => {
        //       return ele.length > 0
        //     })
        //     const { data: res2 } = await this.axios.get('http://localhost:4002/api/material', { params: { elements: eles, searchWay: 'exact' } })
        //     if (res2[0]) {
        //       this.outlink.push('http://localhost:8082/#/materials/' + res2[0].id)
        //     }
        //     console.log(eles)
        //   })
        // })
        this.total = res[0].total[0].total
        this.pubCounts = {}
        this.areaCounts = {}
        res[0].groupPub.forEach((item) => {
          this.pubCounts[item._id] = item.value
        })
        res[0].groupArea.forEach((item) => {
          if (areaOptions.includes(item._id)) {
            this.areaCounts[item._id] = item.value
          }
        })
      }
      document.documentElement.scrollTop = 0
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleCheckAllPubsChange(val) {
      this.checkedPubs = val ? pubOptions : []
      this.isIndeterminatePub = false
    },
    handleCheckedPubsChange(value) {
      let checkedCount = value.length
      this.checkAllPubs = checkedCount === this.pubs.length
      this.isIndeterminatePub =
        checkedCount > 0 && checkedCount < this.pubs.length
    },
  },
}
</script>

<style scoped>
.text {
  font-size: 18px;
  font-family: 'Times New Roman', Georgia, Serif;
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.box-card {
  width: 100%;
}
div >>> .el-input-group__append .el-button {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
  vertical-align: text-top;
}
</style>
