<!--
 * @Author: lizheng
 * @Date: 2021-03-05 14:21:41
 * @LastEditTime: 2021-04-22 10:21:03
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
          v-model="filterForm.timeGroupBy"
          class="filter-wrap-item"
          placeholder="请选择"
          style="width:120px"
          @change="getRenderData"
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
      <a-form-model :model="filterForm" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
        <a-form-model-item
          :colon="false"
          label="选择产品"
          style="margin:0;margin-left:5px; width:550px"
        >
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
      </a-form-model>
      <div class="filter-search">
        <a-button type="primary" @click="getRenderData">查询</a-button>
      </div>
    </div>

    <!-- 产品统计数 -->
    <a-divider class="production-statment-divider" />
    <div class="production-statment-chart">
      <div class="chart-statistics ">
        <!--数据指标统计图 -->
        <div class="chart-content">
          <a-tabs @change="handleChangeTabs">
            <a-tab-pane
              key="timeTendency"
              tab="数据指标"
              class="chart-content-pane"
              v-show="isFold"
            >
              <Statistics ref="statistics" @onChange="updateLinePlot" />
              <div class="chart-content-pane--detail">
                <div style="margin:20px 0">
                  <a-select
                    v-if="false"
                    placeholder="请选择"
                    style="width:120px"
                    label-in-value
                    option-label-prop="label"
                    :default-value="{ key: 'TOTAL_DEAL' }"
                    :getPopupContainer="(node) => node || document.body"
                    @change="handleChartSelectChange"
                  >
                    <a-select-option
                      v-for="item in chartOptions"
                      :key="item.label"
                      :value="item.value"
                      :label="item.label"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </div>
                <div id="container" class="plot-contailer"></div>
              </div>
            </a-tab-pane>
            <a class="link" type="link" slot="tabBarExtraContent" @click="handleFoldClick">
              {{ isFold ? '收起' : '展开' }}
              <a-icon type="up" :class="['icon-original', isFold ? '' : 'icon-rotate']" />
            </a>
          </a-tabs>
        </div>

        <!-- 人员统计数据图 -->
        <div class="chart-content" style="margin-top:16px">
          <a-tabs v-model="currentTab" @change="handleChangeTabs">
            <!-- 人员累计柱状图 -->
            <a-tab-pane forceRender key="personContainer" tab="人员累计" class="chart-content-pane">
              <div class="chart-content-pane--detail" v-show="isPersonModuleFold">
                <div style="margin:20px 0">
                  <a-select
                    placeholder="请选择"
                    style="width:120px"
                    option-label-prop="label"
                    v-model="personType"
                    :getPopupContainer="(node) => node || document.body"
                    @change="handleChangePersonSelect"
                  >
                    <a-select-option
                      v-for="item in chartOptions"
                      :key="item.label"
                      :value="item.value"
                      :label="item.label"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </div>
                <div id="personContainer" class="plot-contailer"></div>
              </div>
            </a-tab-pane>

            <!-- 人员占比统计图 -->
            <a-tab-pane
              forceRender
              key="accountContainer"
              tab="人员占比"
              class="chart-content-pane"
            >
              <div class="chart-content-pane--detail">
                <div class="chart-content-pane--select">
                  <a-select
                    placeholder="请选择"
                    style="width:120px"
                    option-label-prop="label"
                    v-model="personType"
                    :getPopupContainer="(node) => node || document.body"
                    @change="handleChangePersonSelect"
                  >
                    <a-select-option
                      v-for="item in chartOptions"
                      :key="item.label"
                      :value="item.value"
                      :label="item.label"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                  <a-select
                    disabled
                    default-value="deal"
                    class="filter-wrap-item"
                    placeholder="请选择"
                    style="width:120px"
                    :getPopupContainer="(node) => node || document.body"
                  >
                    <a-select-option value="deal">显示top5</a-select-option>
                  </a-select>
                </div>
                <div id="accountContainer" class="plot-contailer"></div>
              </div>
            </a-tab-pane>

            <a
              class="link"
              type="link"
              slot="tabBarExtraContent"
              @click="isPersonModuleFold = !isPersonModuleFold"
            >
              {{ isPersonModuleFold ? '收起' : '展开' }}
              <a-icon
                type="up"
                :class="['icon-original', isPersonModuleFold ? '' : 'icon-rotate']"
              />
            </a>
          </a-tabs>
        </div>

        <!-- 详细数据表格图 -->
        <div class="chart-content" style="margin-top:16px">
          <header class="table-header">
            <h3 style="font-weight:700">详细数据</h3>
            <div>
              <a-button type="primary" :loading="exportLoading" @click="handleExportClick">
                导出报表
              </a-button>
              <a-button style="margin-left:10px">自定义列</a-button>
            </div>
          </header>
          <a-table
            bordered
            class="statistics-table"
            size="small"
            :loading="tableLoading"
            :row-key="(record) => record.key"
            :columns="columns"
            :data-source="dataSource"
            :pagination="pagination"
            :scroll="{ x: 700, y: 520 }"
            :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
            @change="changePage"
          />
        </div>
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
  import Statistics from './production-statment-statistic'

  export default {
    components: { Statistics },

    data() {
      this.productionFuzzySearch = debounce(this.productionFuzzySearch, 500)
      return {
        // 加载loading以及筛选表单
        isFold: true,
        fetching: false,
        exportLoading: false,
        filterForm: { type: 'TOTAL_DEAL', timeGroupBy: 'HOUR' },
        productinOptions: [],
        range: [],
        filterDateRange: [],
        timeSelectData: [
          { label: '分时', value: 'HOUR' },
          { label: '分日', value: 'DAY' },
          { label: '分周', value: 'WEEK' },
          { label: '分月', value: 'MONTH' },
          { label: '合计', value: 'TOTAL' },
        ],

        // 商品汇总统计、折线图
        summaryLoading: false,
        lineDataSource: [],
        percentKeyArr: ['convertRate'],
        summaryData: {
          totalDeal: '--',
          totalCost: '--',
          totalBigPutAd: '--',
          totalNewAd: '--',
          totalTestAd: '--',
        },

        timeTrendLabel: '成交',
        linePlot: null,

        // 人员累计
        personType: 'TOTAL_DEAL',
        personLabel: '成交',
        statisticSelect: '',
        isPersonModuleFold: true,
        columnPlot: null,
        chartOptions: [
          { label: '成交', value: 'TOTAL_DEAL' },
          { label: '消耗', value: 'COST' },
        ],

        // 人员占比
        currentTab: 'personContainer',
        piePlot: null,

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
      this.handleRenderLine('container', [])
      this.handleRenderColumn([])
    },

    destroyed() {
      const arr = ['columnPlot', 'linePlot', 'piePlot']
      arr.forEach((item) => this[item].destroy())
    },

    methods: {
      handleFoldClick() {
        this.isFold = !this.isFold
      },

      // 切换tab
      handleChangeTabs() {
        this.getPersonSummaryData()
      },

      // 改变分页器的参数
      changePage(page) {
        this.pagination.current = page.current
        this.pagination.pageSize = page.pageSize
        this.dataSource = []
        this.getTableData()
      },

      // 时间选择器
      changeDatePick(date) {
        if (date.length) {
          this.filterForm.timeStart = date[0]
          this.filterForm.timeEnd = date[1]
        } else {
          this.filterForm.timeStart = ''
          this.filterForm.timeEnd = ''
        }
        this.$refs.statistics.getTotalData([], this.filterForm)
      },

      // 导出数据
      handleExportClick() {
        const params = []
        const accessToken = Cookies.get('authorization') || ''
        this.exportLoading = true
        for (const [key, value] of Object.entries(this.filterForm)) {
          value && params.push(`${key}=${value}`)
        }
        window.open(
          `${SERVER_BASE_URL}/report/product/excel/export/${accessToken}?${params.join('&')}`,
          '_blank'
        )
        setTimeout(() => {
          this.exportLoading = false
        }, 500)
      },

      handleSelectChange(keyword) {
        keyword === undefined && (this.productinOptions = [])
        this.$refs.statistics.getTotalData([], this.filterForm)
      },

      // 时间趋势
      handleChartSelectChange({ key, label }) {
        if (this.handleVerifySearch()) {
          this.filterForm.type = key
          this.timeTrendLabel = label
          this.getTableData('chart')
        }
      },

      // 人员累计select框值发生改变
      handleChangePersonSelect(value) {
        this.personType = value
        this.personLabel = value === 'COST' ? '消耗' : '成交'
        this.getPersonSummaryData()
      },

      // js正则实现数字格式化,每三位加逗号
      handleNumWithComma(num) {
        const str = num.toString()
        const reg = str.indexOf('.') > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g
        return str.replace(reg, '$1,')
      },

      // 搜索前的验证
      handleVerifySearch() {
        const { productId, timeStart, timeEnd, timeGroupBy } = this.filterForm
        const startDateTimeStamp = new Date(timeStart).getTime()
        const endDateTimeStamp = new Date(timeEnd).getTime()
        const isMoreThanSevenDay = endDateTimeStamp - startDateTimeStamp > 6 * 24 * 60 * 60 * 1000
        const isMoreThanOneYear = endDateTimeStamp - startDateTimeStamp > 366 * 24 * 60 * 60 * 1000
        if (timeGroupBy === 'HOUR' && isMoreThanSevenDay) {
          this.$message.error('分时仅支持1周以内数据的查询，请重新选择')
          return false
        }

        if (timeGroupBy !== 'HOUR' && isMoreThanOneYear) {
          this.$message.error('仅支持1年以内数据的查询，请重新选择')
          return false
        }

        if (!timeGroupBy) {
          this.$message.error('请选择统计数据的类型！')
          return false
        } else if (!productId) {
          this.$message.error('请选择产品！')
          return false
        } else if (!timeStart || !timeEnd) {
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
        this.$refs.statistics.getTotalData([], this.filterForm)
        if (this.handleVerifySearch()) {
          this.getSummaryData()
          this.getTableData()
          this.getTableData('chart')
          this.getPersonSummaryData()
        }
      },

      // 获取商品汇总统计数据
      getSummaryData() {
        const params = this.filterForm
        delete params.type
        this.$API.getProductStatementSummary(params).then(({ code, data }) => {
          if (code === 0) {
            for (const key in data) this.summaryData[key] = this.handleNumWithComma(data[key])
            this.$refs.statistics.getTotalData(this.summaryData, params, 'init')
          }
        })
      },

      // 获取人员统计数据
      getPersonSummaryData() {
        const params = this.filterForm
        params.type = this.personType
        this.handleVerifySearch() &&
          this.$API.getProductStatementPerson(params).then(({ code, data }) => {
            if (code === 0) {
              this.currentTab === 'personContainer'
                ? this.columnPlot
                  ? this.updateColumnPlot(data)
                  : this.handleRenderColumn(data)
                : this.piePlot
                ? this.updateRenderPie(data)
                : this.handleRenderPie(this.currentTab, data)
            }
          })
      },

      // 获取详细表格数据
      getTableData(type) {
        const { pageSize, current: pageIndex } = this.pagination
        const params = { pageIndex, pageSize, ...this.filterForm }
        delete params.type
        type === 'chart' && (params.current = 1) && (params.pageSize = 1000)
        this.tableLoading = true
        this.$API
          .getProductStatement(params)
          .then(({ code, data: { count, list } }) => {
            this.tableLoading = false
            if (code === 0) {
              this.pagination.total = count
              this.dataSource = list.map((item, index) => ({ key: index, ...item }))
              if (this.dataSource.length !== 0) this.getDataCount(params)
            }
          })
          .catch(() => (this.tableLoading = false))
      },

      // 获取合计总数
      getDataCount(params) {
        const fieldArr = ['ctr', 'deepConvertRate', 'convertRate', 'skipRate']
        const showFieldArr = ['time', 'cost', 'totalDeal', 'roi', 'sellPrice']
        params.timeGroupBy = 'TOTAL'
        this.$API
          .getProductStatement(params)
          .then(({ code, data: { list } }) => {
            const { total } = this.pagination
            if (code === 0) {
              for (let index = 0; index < this.columns.length; index++) {
                const { key, width } = this.columns[index]
                let filedVal = list[0][key] ? list[0][key] : 0
                if (key === 'time') filedVal = `总计共${total}条记录`
                this.$set(this.columns[index], 'children', [
                  {
                    title: showFieldArr.includes(key) ? filedVal : '——',
                    dataIndex: key,
                    key,
                    width,
                    customHeaderCell: () => ({ style: { height: '47px' } }),
                    customRender: (text) => (fieldArr.includes(key) ? `${text}%` : text),
                  },
                ])
              }
            }
          })
          .finally(() => (this.tableLoading = false))
      },

      // 更新时间趋势折线图配置以及数据
      updateLinePlot(dataSource, item) {
        const tempArr = []
        if (item.opType && item.opType === 'cancel') {
          // 判断是否当前操作是否为当前card取消选中状态
          this.lineDataSource = this.lineDataSource.filter(({ category }) => category !== item.name)
        } else {
          // 剔除百分率类型的数据
          this.lineDataSource.forEach((list) => {
            list.category !== '转化率' && tempArr.push(list)
          })

          // 更新数据源
          this.lineDataSource = this.percentKeyArr.includes(item.key)
            ? dataSource
            : [...tempArr, ...dataSource]
        }

        if (!item.length) this.lineDataSource = []

        // 更新折线图数据
        if (this.linePlot) {
          this.linePlot.update({
            yField: 'value',
            yAxis: {
              label: { formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`) },
            },
            tooltip: {
              formatter: ({ category, value }) => ({
                name: category,
                value: category === '转化率' ? `${value}%` : value == null ? 0 : value,
              }),
            },
            seriesField: item.length ? 'category' : '',
          })
          this.linePlot.changeData(this.lineDataSource)
        }
      },

      // 渲染折线图
      handleRenderLine(id, dataSource) {
        const data = dataSource.map(({ item }) => ({ ...item, category: this.timeTrendLabel }))
        this.linePlot = new Line(id, {
          data,
          padding: 'auto',
          seriesField: 'category',
          xField: 'time',
          yField: 'value',
          label: { rotate: false, autoEllipsis: true, autoHide: true, tickInterval: 10 },
          slider: { start: 0, end: 1 },
          legend: { position: 'top-right' },
          smooth: true,
        })
        this.linePlot.render(data)
      },

      // 更新柱状图配置以及数据
      updateColumnPlot(data) {
        if (this.columnPlot) {
          this.columnPlot.update({ meta: { value: { alias: this.personLabel } } })
          this.columnPlot.changeData(data)
        }
      },

      // 渲染人员累计的柱状图
      handleRenderColumn(data) {
        this.columnPlot = new Column('personContainer', {
          data,
          xField: 'realName',
          yField: 'value',
          label: { style: { fill: '#FFFFFF', opacity: 0.6 } },
          xAxis: { label: { autoHide: true, autoRotate: false } },
          yAxis: {
            label: {
              // 数值格式化为千分位
              formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
          },
          meta: { realName: { alias: '员工' }, value: { alias: this.personLabel, min: 0 } },
          maxColumnWidth: 20,
        })
        this.columnPlot.render()
      },

      // 更新人员占比饼图
      updateRenderPie(data) {
        const dataSource = this.handleRenderPieData(data)
        if (this.piePlot) {
          this.piePlot.changeData(dataSource)
          this.piePlot.update({
            legend: {
              itemName: { formatter: (text) => this.handlePieLegendName(text, dataSource) },
              itemValue: { formatter: (text) => this.handlePieLegendValue(text, dataSource) },
            },
          })
        }
      },

      // 处理渲染饼图数据
      handleRenderPieData(data) {
        if (!data.length) return []
        const prevData = [] // 前5条数据
        const restData = [] // 剩余数据
        data.forEach((item, index) => (index > 4 ? restData.push(item) : prevData.push(item)))

        // 显示Top5 剩余的数据为“其他”类型
        const { realName, rate, value } = restData.reduce(
          (acc, item) => {
            acc.rate += item.rate * 100
            acc.value += item.value * 100
            return { rate: acc.rate, value: acc.value, realName: '其他' }
          },
          { rate: 0, value: 0 }
        )

        // 第六条数据
        const restItem = {
          realName,
          rate: Number((rate / 100).toFixed(2)),
          value: Number((value / 100).toFixed(2)),
        }

        // 根据饼图字段数据处理
        const dataSource = data.length > 5 ? [...prevData, restItem] : data
        data = dataSource.map(({ rate, realName, value }) => ({
          value,
          type: realName,
          percent: rate,
        }))
        return data
      },

      // 人员占比饼图 tooltip 自定义内容
      handlePieToolTipContent(title, data) {
        return `
                <div style="display:flex;justify-content:center;flex-direction:column">
                  <header style="font-size:12px">${title}</header>
                  <div style="font-size:12px;margin-top:8px;display:flex;justify-content:space-between; align-items:center">
                    <div style="display:flex; align-items:center">
                      <span style="background:${data[0] &&
                        data[0][
                          'color'
                        ]}; width:5px;height:5px;border-radius:50%;margin-right:10px"></span>
                      <span>${this.personLabel}：<span style="color:#3BA0FF">
                      ${data[0] && data[0].data.value}元</span></span>
                    </div>
                    <span>占比：<span style="color:#3BA0FF">${data[0] &&
                      data[0]['data']['percent']}%</span></span>
                  </div>
                </div>
              `
      },

      // 渲染人员占比饼图Legend Name值
      handlePieLegendName(text, data) {
        let curItem = null
        if (data.length) {
          curItem = data.find(({ type }) => type === text)
          return `${curItem && curItem.type}   |   ${curItem && curItem.percent}%`
        }
        return '——'
      },

      // 渲染人员占比饼图Legend Value值
      handlePieLegendValue(text, data) {
        let curItem = null
        if (data.length) {
          curItem = data.find(({ type }) => type === text)
          return `￥${this.handleNumWithComma(curItem ? curItem.value : 0)}`
        }
        return '--'
      },
      // 渲染人员占比饼图
      handleRenderPie(id, dataSource) {
        const data = this.handleRenderPieData(dataSource)
        this.piePlot = new Pie(id, {
          data,
          appendPadding: 10,
          angleField: 'value',
          colorField: 'type',
          meta: { value: { formatter: (v) => `¥${v}` } },
          radius: 0.8,
          innerRadius: 0.7,
          colorField: 'type',
          color: ['#975FE4', '#3AA0FF', '#36CBCB', '#4DCB73', '#FAD337', '#F2637B'],
          pieStyle: { lineWidth: 8 },
          label: { type: 'outer', labelHeight: 28, content: '{name}' },
          interactions: [{ type: 'element-single-selected' }],

          tooltip: {
            fields: ['type', 'value', 'percent'],
            showTitle: true,
            title: 'type',
            domStyles: { 'g2-tooltip': { padding: '10px', minWidth: '220px' } },
            customContent: (title, data) => this.handlePieToolTipContent(title, data),
          },

          legend: {
            itemHeight: 30,
            itemSpacing: 40,
            itemName: { formatter: (text) => this.handlePieLegendName(text, data) },
            itemValue: {
              style: { fontWeight: 550 },
              alignRight: true,
              formatter: (text) => this.handlePieLegendValue(text, data),
            },
          },

          statistic: {
            title: {
              style: { color: '#929292', fontSize: '14px', marginTop: '-10px' },
              customHtml: () => '总计',
            },
            content: {
              style: { fontSize: '20px' },
              customHtml: (c, v, d, data) =>
                // 求和以及解决浮点数相加精度丢失的问题
                `¥ ${this.handleNumWithComma(
                  (data.reduce((r, d) => r + d.value, 0) * 1000).toFixed(2) / 1000
                )}`,
            },
          },
        })

        this.piePlot.render()
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~/assets/css/table.less';
  @import './production-statment-index.less';
</style>
