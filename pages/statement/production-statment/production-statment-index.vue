<!--
 * @Author: lizheng
 * @Date: 2021-03-05 14:21:41
 * @LastEditTime: 2021-10-18 15:10:43
 * @LastEditors: Please set LastEditors
 * @Description: 报表模块 - 产品报表
 * @FilePath: \ads\pages\statement\prudent-statment\prudent-statment-index.vue
-->
<template>
  <div class="production-statment">
    <!-- 头部筛选区域 -->
    <div class="filter">
      <span class="title">产品报表</span>
      <div class="filter-wrap">
        <a-select
          v-model="selectDate"
          class="filter-wrap-item"
          placeholder="请选择"
          style="width:120px"
        >
          <a-select-option v-for="(item, key) in timeSelectData" :key="key" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
        <a-range-picker
          v-model="filterDateRange"
          value-format="YYYY-MM-DD"
          :ranges="range"
          :allowClear="false"
          :disabled-date="(current) => current && current > this.moment().endOf('day')"
          format="YYYY-MM-DD"
          separator="至"
          class="filter-wrap-item"
          style="width:230px"
          @change="changeDatePick"
        >
          <a-icon slot="suffixIcon" type="calendar" />
        </a-range-picker>
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
    <!-- 产品统计数 -->
    <div class="production-statment-chart">
      <div class="chart-statistics ">
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
  import { Line, Column, Pie } from '@antv/g2plot'
  import Cookies from 'js-cookie'
  import { SERVER_BASE_URL } from '~/api/config'
  import { getDateRange, debounce } from '~/utils/utils'
  import { productColumns } from './columns'
  import Statistics from '../component/tag-statistic.vue'
  import options from '../component/options'
  import Dcard from '../component/d-card.vue'
  import * as echarts from 'echarts'
  export default {
    components: { Dcard, Statistics },

    data() {
      this.productionFuzzySearch = debounce(this.productionFuzzySearch, 500)
      return {
        selectDate: 'DAY',
        cardLoading: {
          trend: false,
          trendLoading: false,
        },
        trendOptions: options.trendOptionProduct,
        tagList: [],
        // 指标趋势轮播选项数据数据
        tagSwiperList: [
          {
            label: '浏览量',
            id: 'view',
            value: '',
            hint: '订单总数：选定条件下，包含该货品的订单量。',
          },
          {
            label: '访客数',
            id: 'visited',
            value: '',
            hint: '购买人数：选定条件下，购买该货品的人数。',
          },
          {
            label: '订单数',
            id: 'orderCount',
            value: '',
            hint: '货品件数：选定条件下，该货品的销售量。',
          },
          {
            label: '销售额',
            id: 'sellPrice',
            value: '',
            hint: '客单价：选定条件下，客单价 = 订单金额之和 / 订单总数。',
          },
          {
            label: '广告消耗',
            id: 'cost',
            value: '',
            hint: '复购订单数：选定条件下，非首次购买该货品的订单数。',
          },
          {
            label: '广告占比',
            id: 'ratio',
            value: '',
            hint: '复购订单数：选定条件下，非首次购买该货品的订单数。',
          },
        ],
        // 加载loading以及筛选表单
        isFold: true,
        fetching: false,
        exportLoading: false,
        filterForm: {},
        productinOptions: [],
        range: [],
        filterDateRange: [],
        timeSelectData: [
          // { label: '分时', value: 'HOUR' },
          { label: '分日', value: 'DAY' },
          // { label: '分周', value: 'WEEK' },
          // { label: '分月', value: 'MONTH' },
          // { label: '合计', value: 'TOTAL' },
        ],

        // 详细表格
        tableLoading: false,
        columns: productColumns,
        dataSource: [],

        // 分页器参数
        pagination: {
          size: 'small',
          total: 0,
          current: 1,
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `共 ${total} 条`,
        },
      }
    },

    created() {
      this.range = getDateRange(this)
    },

    mounted() {
      this.getNewEcharts()
      this.drawLine('trend')
    },

    methods: {
      //初始化echart
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

      // 点击标签渲染折线图
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
              xAxisData.push(item.date)
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

      // 切换tab
      handleChangeTabs() {
        this.getPersonSummaryData()
      },

      // 时间选择器
      changeDatePick(date) {
        if (date.length) {
          this.filterForm.queryDateStart = date[0]
          this.filterForm.queryDateEnd = date[1]
        } else {
          this.filterForm.queryDateStart = ''
          this.filterForm.queryDateEnd = ''
        }
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
        const { productId, queryDateStart } = this.filterForm
        if (!productId) {
          this.$message.error('请选择产品！')
          return false
        }
        if (!queryDateStart) {
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
          .productionList(this.filterForm)
          .then(({ code, data }) => {
            this.tableLoading = false
            if (code === 0) {
              if(!data){
                this.dataSource = []
                return this.$message.error('查无此数据!')
              }
              this.dataSource = data.map((item, index) => {
                return { ...item, key: index }
              })
              this.tagSwiperList.forEach((item, index) => {
                item.value = data[0][item.id]
                this.tagSwiperList.splice(index, 1, item)
              })
            }
          })
          .catch(() => (this.tableLoading = false))
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~/assets/css/table.less';
  @import './production-statment-index.less';
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
  .tag-content > li {
    width: 16.66% !important;
  }
</style>
