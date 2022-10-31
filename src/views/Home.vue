<template lang="pug">
div
  el-row(:gutter="20")
    el-col(:span="12")
      el-card(shadow="hover")
        template(v-slot:header)
          div 总文章数
        span(style="color: #67c23a")
          | {{ amount }}
        span 篇
    el-col(:span="12")
      el-card(shadow="hover")
        template(v-slot:header)
          div 近七日新增文章数
        span(style="color: #409eff")
          | {{ amountLastWeek }}
        span 篇
  el-row
    #echart-area(style="width: 100%; height: 600px")
    #echart-author(style="width: 100%; height: 600px")
    #echart-ins(style="width: 100%; height: 600px; overflow: hidden")
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { inject } from 'vue'
import * as echarts from 'echarts'
const axios = inject('axios')
const topoAreas = ['Topological phases of matter', 'Symmetry protected topological states', 'Topological insulators', 'Topological order', 'Topological phase transition', 'Topological superconductors', 'Topological materials']
const amount = ref(0)
const amountLastWeek = ref(0)
const getAmount = async () => {
  const { data } = await axios.get('/api/paper/search')
  amount.value = data[0].total[0].total
}
const getAmountLastWeek = async () => {
  let timestamp = new Date().getTime()
  let startDate = new Date(timestamp - 3600 * 1000 * 24 * 7).toISOString().split('T')[0]
  let endDate = new Date(timestamp).toISOString().split('T')[0]
  let date = [startDate, endDate]
  const { data } = await axios.get('/api/paper/search', { params: { date } })
  amountLastWeek.value = data[0].total[0] ? data[0].total[0].total : 0
}
const areaChart = async () => {
  const params = { classify: 'areas' }
  const { data: res } = await axios.get('/api/paper/classify', { params })
  let data = []
  res.forEach(item => {
    if (topoAreas.includes(item._id)) {
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
}
const authorChart = async () => {
  const params = { classify: 'authors' }
  const { data: res } = await axios.get('/api/paper/classify', { params })
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
}
const insChart = async () => {
  const params = { classify: 'institutes' }
  const { data: res } = await axios.get('/api/paper/classify', {
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
getAmount()
getAmountLastWeek()
onMounted(() => {
  areaChart()
  authorChart()
  insChart()
})
</script>

<style lang="less" scoped>
.el-card {
  :deep(.el-card__header) {
    font-size: 20px;
    line-height: 40px;
    text-align: center;
    padding: 0;
    color: #fff;
    background-color: #43484d;
  }
  :deep(.el-card__body) {
    font-size: 40px;
    text-align: center;
  }
}
</style>
