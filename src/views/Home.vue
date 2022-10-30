<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template v-slot:header>
            <div>总文章数</div>
          </template>
          <span class="total">{{ amount }}</span>
          <span>篇</span>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template v-slot:header>
            <div>近七日新增文章数</div>
          </template>
          <span class="today">{{ amountLastWeek }}</span>
          <span>篇</span>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <div id="echart-area" style="width: 100%; height: 600px"></div>
      <div id="echart-author" style="width: 100%; height: 600px"></div>
      <div id="echart-ins" style="width: 100%; height: 600px; overflow: hidden"></div>
    </el-row>
    <el-row :gutter="20">
      <el-col>
        <div>
          <h3>关键词排名（利用positionrank算法提取每篇文章关键词，按算法给出的权重统计出的前20个）</h3>
          <h5>参考文献：https://www.aclweb.org/anthology/P17-1102.pdf</h5>
        </div>
      </el-col>
      <el-col>
        <table>
          <tbody>
            <tr v-for="data in positionRank" :key="data[0]">
              <td>{{ data[0] }}</td>
              <td>{{ data[1] }}</td>
            </tr>
          </tbody>
        </table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Home',
  data() {
    return {
      amount: 0,
      amountLastWeek: 0,
      topoAreas: [
        'Topological phases of matter',
        'Symmetry protected topological states',
        'Topological insulators',
        'Topological order',
        'Topological phase transition',
        'Topological superconductors',
        'Topological materials'
      ],
      positionRank: [
        ['topological phases', 19.83461865040976],
        ['non-hermitian systems', 14.577124813195761],
        ['topological phase transitions', 12.911873239960777],
        ['topological insulators', 12.733649048299538],
        ['topological states', 8.256779835398682],
        ['topological superconductivity', 7.669512419814169],
        ['topological superconductors', 6.236351438225282],
        ['topological order', 5.829226761636308],
        ['edge states', 5.707326149035296],
        ['topological properties', 5.648434275667054],
        ['topological edge states', 5.641629861031668],
        ['topological phase transition', 5.143723902096613],
        ['majorana bound states', 4.574691801207629],
        ['surface states', 4.512719531501969],
        ['topological surface states', 4.420649074595298],
        ['flat bands', 4.148236405322762],
        ['topological invariants', 4.108108403368748],
        ['weyl semimetals', 4.107845307686206],
        ['weyl points', 3.975719330957787],
        ['hermitian systems', 3.871364160234747]
      ]
    }
  },
  methods: {
    async getPaperAmount() {
      const { data: res } = await this.axios.get('/api/paper/search')
      this.amount = res[0].total[0].total
      let timestamp = new Date().getTime()
      let startDate = new Date(timestamp - 3600 * 1000 * 24 * 7).toISOString()
      startDate = startDate.split('T')[0]
      let endDate = new Date(timestamp).toISOString()
      endDate = endDate.split('T')[0]
      let date = [startDate, endDate]
      const { data: res2 } = await this.axios.get('/api/paper/search', {
        params: { date }
      })
      this.amountLastWeek = res2[0].total[0] ? res2[0].total[0].total : 0
    },
    async areaChart() {
      const params = { classify: 'areas' }
      const { data: res } = await this.axios.get('/api/paper/classify', {
        params
      })
      let data = []
      res.forEach(item => {
        if (this.topoAreas.includes(item._id)) {
          data.push({ name: item._id, value: item.value })
        }
      })
      const myChart = echarts.init(document.getElementById('echart-area'))
      let option = {
        title: {
          text: 'Classified by areas',
          left: 'center',
          textStyle: {
            fontSize: 24
          },
          top: 25
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: 'bottom',
          left: 'center'
        },
        series: [
          {
            name: 'Paper in',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      }
      myChart.setOption(option)
      //随着屏幕大小调节图表
      let timer = null
      window.addEventListener('resize', () => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          myChart.resize()
        }, 200)
      })
    },
    async authorChart() {
      const params = { classify: 'authors' }
      const { data: res } = await this.axios.get('/api/paper/classify', {
        params
      })
      let data = res.slice(0, 20)
      const myChart = echarts.init(document.getElementById('echart-author'))
      let option = {
        dataset: {
          dimensions: ['_id', 'value'],
          source: data
        },
        title: {
          text: 'Author Top 20',
          left: 'center',
          textStyle: {
            fontSize: 24
          },
          top: 25
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          inverse: true
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
      myChart.setOption(option)
      //随着屏幕大小调节图表
      let timer = null
      window.addEventListener('resize', () => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          myChart.resize()
        }, 200)
      })
    },
    async insChart() {
      const params = { classify: 'institutes' }
      const { data: res } = await this.axios.get('/api/paper/classify', {
        params
      })
      let data = res.slice(0, 20)
      const myChart = echarts.init(document.getElementById('echart-ins'))
      let option = {
        dataset: {
          dimensions: ['_id', 'value'],
          source: data
        },
        title: {
          text: 'Institute Top 20',
          left: 'center',
          textStyle: {
            fontSize: 24
          },
          top: 25
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          confine: true
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          inverse: true,
          axisLabel: {
            overflow: 'truncate',
            width: 110,
            rotate: 15
          }
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
      myChart.setOption(option)
      //随着屏幕大小调节图表
      let timer = null
      window.addEventListener('resize', () => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          myChart.resize()
        }, 200)
      })
    }
  },
  created() {
    this.getPaperAmount()

    this.$nextTick(_ => {
      this.areaChart()
      this.authorChart()
      this.insChart()
    })
  }
}
</script>

<style lang="less" scoped>
td {
  border: 1px solid #ebeef5;
  padding: 1rem;
}
/deep/ .el-card__header {
  font-size: 16px;
  background-color: #909399;
  line-height: 40px;
  text-align: center;
  padding: 0;
}
/deep/ .el-card__body {
  font-size: 40px;
  text-align: center;
  .total {
    color: #67c23a;
  }
  .today {
    color: #409eff;
  }
}
</style>
