<template>
  <div class="production-statment">
    <!-- 头部筛选区域 -->
    <div class="filter">
      <span class="title">广告实时报表</span>
      <div class="filter-wrap">
        <a-radio-group
          default-value="a"
          button-style="solid"
          v-model="radioValue"
          @change="clickDate"
        >
          <a-radio-button value="a">
            今天
          </a-radio-button>
          <a-radio-button value="b">
            昨天
          </a-radio-button>
          <a-radio-button value="c">
            前天
          </a-radio-button>
        </a-radio-group>
        <a-date-picker
          v-model="filterDateRange"
          value-format="YYYY-MM-DD"
          :allowClear="false"
          :disabled-date="(current) => current && current > this.moment().endOf('day')"
          class="filter-wrap-item"
          style="width:230px"
          format="YYYY-MM-DD"
          @change="changeDatePick"
        >
          <a-icon slot="suffixIcon" type="calendar" />
        </a-date-picker>
      </div>
    </div>
    <a-divider style="margin:0" />
    <div class="filter">
      <a-form-model
        :model="filterForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        style="width:30%"
      >
        <a-row>
          <a-col>
            <a-form-model-item :colon="false" label="选择商品">
              <a-select
                show-search
                allow-clear
                placeholder="商品ID/名称"
                option-label-prop="label"
                v-model.trim="filterForm.productId"
                @search="productionFuzzySearch"
                @change="handleSelectChange"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                <a-select-option
                  v-for="list in productinOptions"
                  :value="list.productId"
                  :key="list.productId"
                  :label="list.productName"
                >
                  {{ list.product }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <div class="filter-search">
        <a-button type="primary" @click="getRenderData">刷新数据</a-button>
      </div>
    </div>
    <a-divider class="production-statment-divider" />
    <div class="production-statment-chart">
      <div class="chart-statistics ">
        <!-- 产品统计数 -->
        <Dcard title="指标趋势" :loading="cardLoading.trend">
          <!-- tag选择 -->
          <Statistics :list="tagSwiperList" @ontab="onTag"></Statistics>
          <div id="tag-list">
            <span class="span">已选指标：</span>
            <a-tag
              closable
              color="#108ee9"
              @close="handleClose(index)"
              v-for="(item, index) in tagList"
              :key="'tag' + item.label"
            >
              {{ item.label }}
            </a-tag>
          </div>
          <!-- 折线图 -->
          <div class="trend-echaets">
            <div id="trend-echaets"></div>
            <a-spin size="large" fix v-if="cardLoading.trendLoading"></a-spin>
          </div>
        </Dcard>
      </div>
      <!-- 详细数据表格图 -->
      <div class="chart-content" style="margin-top:16px">
        <Dcard title="时段数据">
          <a-table
            bordered
            class="statistics-table"
            size="small"
            :loading="tableLoading"
            :row-key="(record) => record.key"
            :columns="columns"
            :data-source="dataSource"
            :scroll="{ x: 700, y: 520 }"
            :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
            :pagination="false"
          />
        </Dcard>
      </div>
    </div>
  </div>
</template>

<script>
  import { Line, Column, Pie, DualAxes } from '@antv/g2plot'
  import Cookies from 'js-cookie'
  import { SERVER_BASE_URL } from '~/api/config'
  import { getDateRange, debounce } from '~/utils/utils'
  import { advertisingColumns } from './columns'
  import Statistics from '../component/tag-statistic.vue'
  import options from '../component/options'
  import Dcard from '../component/d-card.vue'
  import * as echarts from 'echarts'

  export default {
    components: { Statistics, Dcard },

    data() {
      this.productionFuzzySearch = debounce(this.productionFuzzySearch, 500)
      return {
        cardLoading: {
          trend: false,
          trendLoading: false,
        },
        trendOptions: options.trendOptions,
        tagList: [],
        // 指标趋势轮播选项数据数据
        tagSwiperList: [
          {
            label: '销售额',
            id: 'sales',
            value: '',
            hint: '订单总数：选定条件下，包含该货品的订单量。',
          },
          {
            label: '基础销量',
            id: 'basicsSales',
            value: '',
            hint: '购买人数：选定条件下，购买该货品的人数。',
          },
          {
            label: '总消耗',
            id: 'totalCost',
            value: '',
            hint: '货品件数：选定条件下，该货品的销售量。',
          },
          {
            label: '总成交',
            id: 'totalDeal',
            value: '',
            hint: '客单价：选定条件下，客单价 = 订单金额之和 / 订单总数。',
          },
          {
            label: '总ROI',
            id: 'totalRoi',
            value: '',
            hint: '复购订单数：选定条件下，非首次购买该货品的订单数。',
          },
        ],
        // 加载loading以及筛选表单
        fetching: false,
        exportLoading: false,
        filterForm: { productId: undefined, queryDate: undefined },
        productinOptions: [],
        range: [],
        filterDateRange: null,
        // 详细表格
        tableLoading: false,
        columns: advertisingColumns,
        dataSource: [],
        radioValue: '',
      }
    },

    created() {
      this.range = getDateRange(this)
    },

    mounted() {
      this.getNewEcharts()
      this.drawLine('trend')
    },

    /* destroyed() {
      const arr = ['columnPlot', 'linePlot', 'piePlot', 'DualAxes']
      arr.forEach((item) => this[item].destroy())
    }, */

    methods: {
      getNewEcharts() {
        this.trendChart = echarts.init(document.getElementById('trend-echaets'))
      },
      // 关闭tag
      handleClose(index) {
        this.tagList.splice(index, 1)
        this.tagSwiperList.forEach((item, index) => {
          item.active = false
          this.tagSwiperList.splice(index, 1, item) // 处理响应丢失
        })
        this.tagSwiperList.forEach((item, index) => {
          this.tagList.forEach((value) => {
            if (value.id === item.id) {
              item.active = true
              this.tagSwiperList.splice(index, 1, item) // 处理响应丢失
            }
          })
        })
        // 渲染折线图
        this.tagList.forEach((item, index) => {
          this.getAnalyzeStatisticsLine(index)
        })
        this.clearTrend()
      },
      onTag(list) {
        this.tagList = list
        // 渲染折线图
        this.tagList.forEach((item, index) => {
          this.getAnalyzeStatisticsLine(index)
        })
        this.clearTrend()
      },
      // 重新渲染折线图
      drawLine(val) {
        this.getDataZoom()
        if (val === 'trend') {
          this.trendChart.setOption(this.trendOptions, true)
        }
      },
      // 清空趋势图表
      clearTrend() {
        if (this.tagList.length < 1) {
          this.trendOptions.series[0].data = []
          this.trendOptions.series[1].data = []
          this.trendOptions.xAxis.data = []
          this.trendOptions.series[0].name = ''
          this.trendOptions.series[1].name = ''
          this.trendOptions.yAxis[0].name = ''
          this.trendOptions.yAxis[1].name = ''
          this.drawLine('trend')
        }
      },
      // 获取指标趋势折线图
      getAnalyzeStatisticsLine(index) {
        this.trendOptions.legend.data = this.tagList.map((item) => item.label)
        this.trendOptions.series[0].name =
          this.tagList[0]?.label ?? this.trendOptions.series[0].name
        this.trendOptions.series[1].name =
          this.tagList[1]?.label ?? this.trendOptions.series[0].name
        this.trendOptions.yAxis[0].name = this.tagList[0]?.label ?? this.trendOptions.series[0].name
        this.trendOptions.yAxis[1].name = this.tagList[1]?.label ?? this.trendOptions.series[0].name
        this.trendOptions.series[0].data = []
        this.trendOptions.series[1].data = []
        // this.trendOptions.series[index].data = []
        this.trendOptions.xAxis.data = []
        setTimeout(() => {
          let xAxisData = []
          this.dataSource.forEach((item, dIndex) => {
            if (dIndex !== 0) {
              xAxisData.push(item.hour)
            }
          })
          this.trendOptions.xAxis.data = xAxisData
          this.dataSource.forEach((dItem, dIndex) => {
            if (dIndex !== 0) {
              this.trendOptions.series[index].data.push(dItem[this.tagList[index].id])
            }
          })
          this.drawLine('trend')
        }, 100)
      },

      // 假设数据长度超过12，页面不够放，我们需要给echars配置项加上滚动条
      getDataZoom() {
        let echarsArr = ['trendOptions']
        echarsArr.forEach((item) => {
          if (this[item].xAxis.data.length > 12) {
            this[item].dataZoom = JSON.parse(JSON.stringify(options.dataZoom))
          } else if (this[item].dataZoom) {
            delete this[item].dataZoom
            //this.$delete(this[item], 'dataZoom')
          }
          if (
            this[item].xAxis.data.length > 10 &&
            this[item].xAxis.data.length <= 12 &&
            this[item].xAxis.axisLabel
          ) {
            this[item].xAxis.axisLabel.rotate = 40
          } else if (this[item].xAxis.axisLabel) {
            this[item].xAxis.axisLabel.rotate = 0
          }
        })
      },

      // 时间选择器
      changeDatePick(date) {
        let today = this.moment().format('YYYY-MM-DD')
        let yesterday = this.moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD')
        let beforeDay = this.moment()
          .subtract(2, 'days')
          .format('YYYY-MM-DD')
        let time = {
          [today]: 'a',
          [yesterday]: 'b',
          [beforeDay]: 'c',
        }
        this.radioValue = time[date] || undefined
        this.$set(this.filterForm, 'queryDate', date)
        // this.filterForm.queryDate = this.filterDateRange
      },

      handleSelectChange(keyword) {
        keyword === undefined && (this.productinOptions = [])
        //this.$refs.statistics.getTotalData([], this.filterForm)
      },

      // js正则实现数字格式化,每三位加逗号
      handleNumWithComma(num) {
        const str = num.toString()
        const reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
        return str.replace(reg, '$1,')
      },

      // 搜索前的验证
      handleVerifySearch() {
        const { productId, queryDate } = this.filterForm
        if (!productId) {
          this.$message.error('请选择产品！')
          return false
        }
        if (!queryDate) {
          this.$message.error('请选择日期！')
          return false
        }
        return true
      },

      // 产品模糊搜索
      productionFuzzySearch(name) {
        if (name === '' || !name.trim()) return (this.productinOptions = [])
        this.fetching = true
        this.$API
          .getProductList(name)
          .then(({ code, data }) => {
            this.fetching = false
            if (code === 0) this.productinOptions = data
          })
          .catch(() => (this.fetching = false))
      },

      // 获取渲染图表以及表格数据
      getRenderData() {
        // this.$refs.statistics.getTotalData([], this.filterForm)
        if (this.handleVerifySearch()) {
          this.getTableData()
        }
      },
      // 获取详细表格数据
      getTableData(type) {
        this.tableLoading = true
        this.$API
          .advertisingTimeList(this.filterForm)
          .then(({ code, data }) => {
            this.tableLoading = false
            if (code === 0) {
              //this.pagination.total = count
              // this.dataSource = list.map((item, index) => ({ key: index, ...item }))
              if (!data) {
                this.dataSource = []
                return this.$message.error('查无此数据!')
              }
              data.forEach((item, index) => {
                item.key = index
                if (item.hour !== '总计') {
                  if (+item.hour.substring(0) === 0) {
                    item.hour = `0${item.hour.substring(1)}:00-0${item.hour.substring(1)}:59`
                  } else {
                    item.hour = `${item.hour}:00-${item.hour}:59`
                  }
                }
              })
              this.dataSource = data
              this.tagSwiperList.forEach((item, index) => {
                item.value = data[0][item.id]
                this.tagSwiperList.splice(index, 1, item)
              })
            }
          })
          .catch(() => (this.tableLoading = false))
      },

      clickDate(obj) {
        let date = {
          a: this.moment().format('YYYY-MM-DD'),
          b: this.moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD'),
          c: this.moment()
            .subtract(2, 'days')
            .format('YYYY-MM-DD'),
        }
        this.filterDateRange = date[obj.target.value]
        this.$set(this.filterForm, 'queryDate', this.filterDateRange)
        //this.filterForm.queryDate = this.filterDateRange
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~/assets/css/table.less';
  @import './advertising-time-index.less';
  .ant-form-item {
    margin-bottom: 0px !important;
  }
  .select {
    line-height: 40px;
  }
  .trend-echaets {
    margin-top: 10px;
    position: relative;
    #trend-echaets {
      width: 100%;
      height: 480px;
    }
  }
  #tag-list {
    margin-left: 40px;
    padding: 20px 0;
    height: 30px;
    .span {
      position: relative;
      padding-left: 20px;
      display: inline-block;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #0e77d1;
      }
    }
  }
</style>
