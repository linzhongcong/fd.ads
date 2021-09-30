<!--
 * @Author: huangjianhan
 * @Date: 2021-04-27 11:21:07
 * @LastEditTime: 2021-05-14 10:21:12
 * @LastEditors: Please set LastEditors
 * @Description: 推广位透视图
 * @FilePath: \ads.fandow.com\pages\statement\taoke-order\perspective-component\perspective.vue
-->
<template>
  <div class="perspective">
    <div class="echarts-change_style">
      <a-button :type="statuType === 'splashes' ? 'primary' : ''" @click="changeMap('splashes')">
        散点图
      </a-button>
      <a-button :type="statuType === 'heatmap' ? 'primary' : ''" @click="changeMap('heatmap')">
        热力图
      </a-button>
    </div>
    <div class="adzone-name_style">
      <span>推广位名称</span>
      <a-popover placement="topLeft">
        <template slot="content">
          <span style="font-size: 10px;">
            推广位名称说明：推广位名称是来源于推广位数据模块；
          </span>
        </template>
        <a-icon class="tips-style" type="info-circle" />
      </a-popover>
    </div>
    <div v-if="statuType === 'splashes'" id="main" style="width: 100%;height: 600px;"></div>
    <div v-else id="heatmap-main" style="width: 100%;height: 600px;"></div>
  </div>
</template>
<script>
  import * as echarts from 'echarts'
  export default {
    props: {
      searchData: {
        type: Object,
      },
    },
    watch: {
      searchData: {
        handler() {
          this.initData()
        },
        deep: true,
        immediate: true,
      },
    },
    data() {
      return {
        statuType: 'splashes',
        adObjectChangeLetter: {
          AD_TOTAL_DEAL: '广告总成交',
          AD_TOTAL_DEAL_CLICK: '广告总成交（点击）',
          AD_TOTAL_ORDER: '广告总订单数',
          AD_TOTAL_ORDER_CLICK: '广告总订单数（点击）',
        },
      }
    },
    mounted() {},
    methods: {
      // 初始化函数
      async initData() {
        console.log(this.searchData)
        let emptyField = []
        let fieldLetter = {
          queryParam: '数据指标',
          timeGroupBy: '时间维度',
        }
        // 必选字段不能为空 需验证
        let judgeField = 'queryParam,timeGroupBy'
        for (let field in this.searchData) {
          if (judgeField.indexOf(field) !== -1 && !this.searchData[field]) {
            emptyField.push(field)
          }
        }
        if (emptyField.length) {
          this.$message.error(`${fieldLetter[emptyField[0]]}不能为空，请选择对应的数据！`)
          return
        }
        let { code, data } = await this.$API.tbkPromoterMap(this.searchData)
        if (code === 0) {
          let mapData = {
            hoursArray: [],
            promoterNameArray: [],
            valueArray: [],
            // 处理图表需要的数据显示格式
            echartsData: [],
            seriesArray: [],
          }
          let dataIndex = 0
          let y
          let idName = 'main'
          // 颠倒数组数据是为了让总计放在图表底部
          data = data.reverse()
          if (this.statuType === 'heatmap') {
            idName = 'heatmap-main'
          }
          let myChart = this.returnCharts(idName)
          myChart.clear()
          myChart.setOption({})
          if (data.length) {
            data.map((item, index) => {
              mapData.echartsData[dataIndex] = []
              mapData.promoterNameArray.push(item.promoterName)
              mapData.valueArray.push(item.value)
              y = index
              item.pointList.map((element, key) => {
                mapData.hoursArray.push(element.time)
                mapData.echartsData[dataIndex].push({
                  time: element.time,
                  value: element.value,
                  y,
                })
              })
              dataIndex++
            })
            // 将set对象转为Array对象 set对象有去重效果
            mapData.hoursArray = [...new Set(mapData.hoursArray)].sort()
            // 区分图表展示
            if (this.statuType === 'splashes') myChart = this.renderMap(idName, mapData)
            if (this.statuType === 'heatmap') myChart = this.renderHeatMap(idName, mapData)
            return
          }
        }
      },

      // 推广位透视散点图渲染
      renderMap(idName, mapData = {}) {
        let myChart = this.returnCharts(idName)
        let option = {}
        // 图表值
        let seriesArray = []
        let hours = mapData.hoursArray
        let promoterName = mapData.promoterNameArray
        let globalIndex = 0

        // 图表对应的各数据坐标效果及值处理
        // 由于mapData -> hoursArray 数据的去重且排序处理 所以seriesArray需要在这边进行赋值
        mapData.echartsData.map((item) => {
          // 图表中间值处理
          let echartsGlobalData = []
          item.map((sonItem) => {
            if (hours.indexOf(sonItem.time) !== -1) {
              echartsGlobalData.push([hours.indexOf(sonItem.time), sonItem.y, sonItem.value])
            }
          })
          // 进行图表值赋值
          seriesArray.push({
            name: promoterName[globalIndex],
            type: 'scatter',
            symbolSize: function(val) {
              let size = 5
              if (0 < val[2] && val[2] < 50) {
                size = 10
              } else if (50 <= val[2] && val[2] < 100) {
                size = 15
              } else if (100 <= val[2] && val[2] < 200) {
                size = 20
              } else if (200 <= val[2] && val[2] < 300) {
                size = 25
              } else if (300 <= val[2] && val[2] < 450) {
                size = 30
              } else if (450 <= val[2] && val[2] < 650) {
                size = 35
              } else if (650 <= val[2]) {
                size = 40
              }
              return size
            },
            data: echartsGlobalData,
            animationDelay: function(idx) {
              return idx
            },
          })
          globalIndex++
        })
        option = {
          legend: {
            data: ['Punch', 'Card'],
            left: 'right',
            width: '100%',
            height: '100%',
          },
          tooltip: {
            position: 'top',
            axisPointer: {
              type: 'cross',
            },
            formatter: (params) => {
              if (!isNaN(params.value[2])) {
                let timeStr = ''
                if (this.searchData.timeGroupBy === 'HOUR') {
                  timeStr =
                    hours[Number(params.value[0])] +
                    '-' +
                    new Date(hours[Number(params.value[0])]).getHours() +
                    ':59'
                }
                if (this.searchData.timeGroupBy !== 'HOUR') {
                  timeStr = hours[Number(params.value[0])]
                }
                return (
                  timeStr +
                  '<br />' +
                  promoterName[Number(params.value[1])] +
                  '<br /><span style="display: inline-block;width: 10px;height: 10px;border-radius: 50%;background-color: ' +
                  params.color +
                  ';"></span> ' +
                  this.adObjectChangeLetter[this.searchData.queryParam] +
                  params.value[2]
                )
              }
            },
          },
          grid: [{ left: '6%', top: '6%', width: '90%', height: '80%' }],
          xAxis: {
            type: 'category',
            splitNumber: 10,
            data: hours,
            boundaryGap: true,
            splitLine: {
              show: false,
            },
            axisLine: {
              show: true,
            },
            axisLabel: {
              show: true,
              inside: false,
            },
          },
          yAxis: {
            type: 'category',
            data: promoterName,
            axisLine: {
              show: true,
            },
            splitLine: {
              show: true,
            },
          },
          series: seriesArray,
          dataZoom: [
            {
              type: 'slider',
              xAxisIndex: 0,
              filterMode: 'none',
              brushSelect: false,
              start: 0,
              end: 50,
              minSpan: 10,
            },
            {
              type: 'slider',
              yAxisIndex: 0,
              filterMode: 'none',
              start: 0,
              end: 2,
              brushSelect: false,
              minSpan: 2,
            },
            {
              type: 'inside',
              xAxisIndex: 0,
              filterMode: 'none',
            },
            {
              type: 'inside',
              yAxisIndex: 0,
              filterMode: 'none',
            },
          ],
        }

        // 推广位名称 - 有值时清除y轴滚动条限定值
        if (this.searchData.adzoneIdList && this.searchData.adzoneIdList !== '') {
          delete option.dataZoom[1].start
          delete option.dataZoom[1].end
        }

        option && myChart.setOption(option)
      },

      // 推广位透视图热力图渲染
      renderHeatMap(idName, mapData = {}) {
        let myChart = this.returnCharts(idName)
        let option = {}
        // 图表值
        let seriesArray = []
        let globalIndex = 0
        let hours = mapData.hoursArray
        let promoterName = mapData.promoterNameArray

        // 图表对应的各数据坐标效果及值处理
        // 由于mapData -> hoursArray 数据的去重且排序处理 所以seriesArray需要在这边进行赋值
        mapData.echartsData.map((item) => {
          // 图表中间值处理
          let echartsGlobalData = []
          item.map((sonItem) => {
            if (hours.indexOf(sonItem.time) !== -1) {
              echartsGlobalData.push([hours.indexOf(sonItem.time), sonItem.y, sonItem.value])
            }
          })
          // 进行图表值赋值
          seriesArray.push({
            name: promoterName[globalIndex],
            type: 'heatmap',
            data: echartsGlobalData,
            label: {
              show: true,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          })
          globalIndex++
        })
        option = {
          tooltip: {
            position: 'top',
            formatter: (params) => {
              if (params.value[2]) {
                let timeStr = ''
                if (this.searchData.timeGroupBy === 'HOUR') {
                  timeStr =
                    hours[Number(params.value[0])] +
                    '-' +
                    new Date(hours[Number(params.value[0])]).getHours() +
                    ':59'
                }
                if (this.searchData.timeGroupBy !== 'HOUR') {
                  timeStr = hours[Number(params.value[0])]
                }
                return (
                  timeStr +
                  '<br />' +
                  promoterName[Number(params.value[1])] +
                  '<br /><span style="display: inline-block;width: 10px;height: 10px;border-radius: 50%;background-color: ' +
                  params.color +
                  ';"></span> ' +
                  this.adObjectChangeLetter[this.searchData.queryParam] +
                  params.value[2]
                )
              }
            },
          },
          grid: [{ left: '6%', top: '6%', width: '90%', height: '80%' }],
          xAxis: {
            type: 'category',
            data: hours,
            splitArea: {
              show: true,
            },
            axisLabel: {
              showMinLabel: true,
            },
          },
          yAxis: {
            type: 'category',
            data: promoterName,
            splitArea: {
              show: true,
            },
          },
          visualMap: {
            min: 0,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%',
            show: false,
            indicatorSize: '50%',
          },
          series: seriesArray,
          dataZoom: [
            {
              type: 'slider',
              xAxisIndex: 0,
              filterMode: 'none',
              brushSelect: false,
              start: 0,
              end: 15,
              minSpan: 6,
            },
            {
              type: 'slider',
              yAxisIndex: 0,
              filterMode: 'none',
              start: 0,
              end: 6,
              brushSelect: false,
              minSpan: 6,
            },
            {
              type: 'inside',
              xAxisIndex: 0,
              filterMode: 'none',
            },
            {
              type: 'inside',
              yAxisIndex: 0,
              filterMode: 'none',
            },
          ],
        }

        // 推广位名称 - 有值时清除y轴滚动条限定值
        if (this.searchData.adzoneIdList && this.searchData.adzoneIdList !== '') {
          delete option.dataZoom[1].start
          delete option.dataZoom[1].end
        }

        option && myChart.setOption(option)
      },

      // 改变图表展示类型
      changeMap(type = '') {
        this.statuType = type
        this.initData()
      },

      // 返回一个图表对象
      returnCharts(idName) {
        let chartDom = document.getElementById(idName)
        let myChart = echarts.init(chartDom)
        return myChart
      },
    },
  }
</script>
<style lang="less" scoped>
  .echarts-change_style {
    margin: 0 0 14px;
  }
  .adzone-name_style {
    font-weight: bold;
  }
  .tips-style {
    font-size: 14px;
    color: rgba(204, 204, 204, 1);
    cursor: pointer;
  }
</style>
