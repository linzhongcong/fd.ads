<!--
 * @Author: lizheng
 * @Date: 2021-02-19 15:31:31
 * @LastEditTime: 2021-05-12 15:25:16
 * @LastEditors: Please set LastEditors
 * @Description: 淘客订单数据
 * @FilePath: \ads\pages\statement\taoke-order\taoke-order-indx.vue
-->
<template>
  <div class="product-wrap">
    <div class="filter">
      <div class="left">
        <!-- 搜索表单内容 -->
        <a-form-model
          label-align="right"
          layout="inline"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          :model="filterForm"
        >
          <a-row>
            <a-col style="padding-left:3px" :span="8">
              <a-form-model-item label="商品ID">
                <a-input
                  allow-clear
                  v-model.trim="filterForm.itemId"
                  placeholder="请输入"
                  class="statement-input"
                  @pressEnter="getInitData('init')"
                  @change="(e) => !e.target.value && this.getInitData('init')"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="推广位ID">
                <a-input
                  allow-clear
                  v-model.trim="filterForm.adzoneId"
                  placeholder="请输入"
                  class="statement-input"
                  @pressEnter="getInitData('init')"
                  @change="(e) => !e.target.value && this.getInitData('init')"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="店铺名称">
                <a-input
                  allow-clear
                  v-model.trim="filterForm.sellerShopTitle"
                  placeholder="请输入"
                  class="statement-input"
                  @pressEnter="getInitData('init')"
                  @change="(e) => !e.target.value && this.getInitData('init')"
                />
              </a-form-model-item>
            </a-col>
          </a-row>

          <!-- 第二行起的表单默认隐藏 -->
          <div :style="{ display: isExpand ? 'block' : 'none' }">
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="订单状态">
                  <a-select
                    allow-clear
                    mode="multiple"
                    placeholder="请选择"
                    class="statement-input"
                    :getPopupContainer="
                      (triggerNode) => {
                        return triggerNode.parentNode || document.body
                      }
                    "
                    @change="filterTkStatus"
                  >
                    <a-select-option
                      v-for="item in orderStatusOptions"
                      :value="item.value"
                      :key="item.label"
                      style="width:100%"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="付款时间">
                  <a-range-picker
                    v-model="filterDateRange"
                    :disabled-date="(current) => current && current > this.moment().endOf('day')"
                    :allow-clear="true"
                    show-time
                    format="YYYY.MM.DD HH:mm:ss"
                    separator="至"
                    class="statement-input"
                    style="width:auto"
                    @change="changeDatePick"
                  >
                    <a-icon slot="suffixIcon" type="calendar" />
                  </a-range-picker>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="订单编号">
                  <a-input
                    allow-clear
                    v-model.trim="filterForm.tradeId"
                    placeholder="请输入"
                    class="statement-input"
                    @pressEnter="getInitData('init')"
                    @change="(e) => !e.target.value && this.getInitData('init')"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>

          <!-- 第三行 -->
          <div :style="{ display: isExpand ? 'block' : 'none' }">
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="点击时间">
                  <a-range-picker
                    v-model="filterClickTimeRange"
                    :disabled-date="(current) => current && current > this.moment().endOf('day')"
                    :allow-clear="true"
                    show-time
                    format="YYYY.MM.DD HH:mm:ss"
                    separator="至"
                    class="statement-input"
                    style="width:auto"
                    @change="changeClickDatePick"
                  >
                    <a-icon slot="suffixIcon" type="calendar" />
                  </a-range-picker>
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
        </a-form-model>

        <!-- 展开或收起 -->
        <div class="expand-wrap">
          <a-button type="link" @click="isExpand = !isExpand">
            <span>{{ !isExpand ? '展开' : '收起' }}</span>
            <a-icon :class="['expand-icon', isExpand ? '' : 'packup']" type="caret-up" />
          </a-button>
        </div>
      </div>

      <!-- 查询操作模块 -->
      <div class="right">
        <a-button type="primary" @click="getInitData('init')">
          查询
        </a-button>
        <a-button style="margin-top:10px" @click="handleResetClick">
          重置
        </a-button>
      </div>
    </div>

    <!-- 数据详情内容 -->
    <div class="content">
      <header class="content-header">
        <h3 style="font-weight:bold">订单数据</h3>
        <div class="content-header__right">
          <a-upload
            name="file"
            :headers="header"
            :file-list="fileList"
            :before-upload="handleBeforeUpload"
            :custom-request="handleImportClick"
          >
            <a-button :loading="uploadLoading" type="primary" icon="upload">导入</a-button>
          </a-upload>
          <a-button
            icon="download"
            type="primary"
            :loading="exportLoading"
            @click="handleExportClick"
          >
            导出报表
          </a-button>
          <a-button icon="unordered-list">自定义列</a-button>
        </div>
      </header>
      <a-table
        :loading="tableLoading"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        :columns="productColumns"
        :data-source="dataSource"
        :row-key="(record) => record.key"
        :scroll="{ x: tableWidth, y: tableHeight }"
        :pagination="pagination"
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
        size="small"
        bordered
        @change="changePage"
      >
        <!-- 订单状态column -->
        <template slot="tkStatus" slot-scope="text, record, index">
          <div>
            <span
              class="cell-status-label"
              :style="{ backgroundColor: cellStatusLabelColor[text] || '#999' }"
            ></span>
            <span>{{ text }}</span>
          </div>
        </template>
      </a-table>
      <div class="content-table_bottom">付款金额合计：{{ totalPrice }}</div>
    </div>

    <!-- 订单数据推广位分析 -->
    <div class="content">
      <header class="content-header seconed-content_header">
        <span>订单数据推广位分析</span>
        &ensp;
        <a-popover placement="topLeft">
          <template slot="content">
            <h4>数据逻辑：基于订单数据对推广位进行分析；</h4>
            <span style="color: #AEAEAE;font-size: 12px;">
              注：该数据随着订单数据列表发生变化！
            </span>
          </template>
          <a-icon class="tips-style" type="info-circle" />
        </a-popover>
        <!-- 展开或收起 -->
        <div class="expand-wrap pack-up">
          <a-button type="link" @click="isOrderPackUp = !isOrderPackUp">
            <span>{{ !isOrderPackUp ? '展开' : '收起' }}</span>
            <a-icon :class="['expand-icon', isOrderPackUp ? '' : 'packup']" type="caret-up" />
          </a-button>
        </div>
      </header>
    </div>

    <div class="content clear-portion_style" v-if="isOrderPackUp">
      <div class="ad-element" v-for="(item, key) in adArray">
        <div class="order-data_title">{{ item.label }}</div>
        <div class="order-data_value">
          <span class="integer-number">{{ item.value }}</span>
          <span class="decimal-number">{{ item.decimal }}</span>
        </div>
      </div>
    </div>

    <div class="content" v-if="isOrderPackUp">
      <header class="content-header">
        <h3 style="font-weight:bold">推广位数据</h3>
        <div class="content-header__right">
          <div style="margin-right: 10px;">
            推广位标签：
            <!-- 进行模糊查找的时候 值类型必须相同，否则会有查找延迟的问题 -->
            <a-select
              show-search
              mode="multiple"
              placeholder="请选择"
              style="min-width: 360px;max-width: 885px;"
              :getPopupContainer="
                (triggerNode) => {
                  return triggerNode.parentNode || document.body
                }
              "
              @search="searchTagIdList"
              @change="tagListChange"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option
                v-for="(item, idx) in tagArray"
                :key="`${item.id}-${idx}`"
                :value="item.tagName"
              >
                <span
                  style="display: inline-block;width: 100%;height: 100%;padding: 0 5px;"
                  :style="{ color: item.textColor, backgroundColor: item.backgroundColor }"
                >
                  {{ item.tagName }}
                </span>
              </a-select-option>
            </a-select>
          </div>
          <a-button
            icon="download"
            type="primary"
            :loading="adExportLoading"
            @click="adHandleExportClick"
            style="margin-right: 10px;"
          >
            导出报表
          </a-button>
          <a-button icon="unordered-list">自定义列</a-button>
        </div>
      </header>
      <a-table
        :loading="adTableLoading"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        :columns="promoterColumns"
        :data-source="adDataSource"
        :row-key="(record) => record.key"
        :scroll="{ x: tableWidth, y: tableHeight }"
        :pagination="adPagination"
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
        size="small"
        bordered
        @change="adChangePage"
      >
        <!-- 推广位标签column -->
        <template slot="tagList" slot-scope="text, record, index">
          <a-tooltip
            v-if="record.tagList && record.tagList.length"
            overlay-class-name="product-wrap_tool"
          >
            <template slot="title">
              <a-tag
                class="tool-tip_letter"
                v-for="item in record.tagList"
                :key="item.id"
                :style="{ color: item.textColor, backgroundColor: item.backgroundColor }"
              >
                {{ item.tagName }}
              </a-tag>
            </template>
            <a-tag
              v-for="item in record.tagList"
              :key="item.id"
              :style="{ color: item.textColor, backgroundColor: item.backgroundColor }"
            >
              {{ item.tagName }}
            </a-tag>
          </a-tooltip>
          <div v-else>—</div>
        </template>
      </a-table>
    </div>

    <!-- 推广位透视图 -->
    <div v-if="isOrderPackUp" class="content perspective-content">
      <header class="content-header">
        <h3 style="font-weight:bold;margin: 0;">
          <span>推广位透视图</span>
          <a-popover placement="topLeft">
            <template slot="content">
              <span style="font-size: 10px;">
                透视图说明：展示不同维度下的推广位数据。
              </span>
            </template>
            <a-icon class="tips-style" type="info-circle" />
          </a-popover>
        </h3>
        <div class="content-header__right">
          <div style="margin-right: 10px;">
            <span>推广位名称：</span>
            <a-select
              allow-clear
              show-arrow
              mode="multiple"
              placeholder="请选择"
              style="min-width: 360px;max-width: 885px;"
              option-label-prop="label"
              :filter-option="false"
              :maxTagCount="2"
              :getPopupContainer="
                (triggerNode) => {
                  return triggerNode.parentNode || document.body
                }
              "
              v-model="bindTbkPromoterSearch"
              @change="setTbkPromoterList"
              @search="getTbkPromoterList"
            >
              <a-spin v-if="tbkListFetching" slot="notFoundContent" size="small" />
              <a-select-option
                v-for="(item, idx) in sellerShopArray"
                :key="`${item.adzoneId}-${idx}`"
                :value="item.adzoneId"
                :label="item.adzoneName"
              >
                {{ item.adzoneName }}
              </a-select-option>
            </a-select>
            <a-select
              placeholder="请选择数据指标"
              style="width: 180px"
              @change="setTbkPromoterData"
              :default-value="dataIndicator[0].value"
            >
              <a-select-option
                v-for="(item, key) in dataIndicator"
                :key="'dataIndicator' + key"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
            <a-select
              placeholder="请选择时间维度"
              style="width: 180px"
              @change="setTbkPromoterTime"
              :default-value="dateDimensionality[0].value"
            >
              <a-select-option
                v-for="(item, key) in dateDimensionality"
                :key="'dateDimensionality' + key"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </div>
        </div>
      </header>
      <perspective-chart :searchData="tbkPromoterSearch"></perspective-chart>
    </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import { SERVER_BASE_URL } from '~/api/config'
  import { debounce } from '~/utils/utils'
  import { productColumns, promoterColumns, cellStatusLabelColor } from './columns'
  import perspectiveChart from './perspective-component/perspective'
  export default {
    components: {
      perspectiveChart,
    },
    data() {
      this.adInit = debounce(this.adInit, 500)
      this.searchTagIdList = debounce(this.searchTagIdList, 500)
      this.getTbkPromoterList = debounce(this.getTbkPromoterList, 500)
      this.setTbkPromoterList = debounce(this.setTbkPromoterList, 500)
      this.compuetedTotal = debounce(this.compuetedTotal, 500)

      return {
        // 搜索筛选表单
        isExpand: false,
        // 订单数据推广位分析展开收起状态
        isOrderPackUp: false,
        // 模糊搜索状态显示
        fetching: false,
        tbkListFetching: false,
        totalPrice: 10000,
        filterForm: {},
        filterDateRange: [],
        filterClickTimeRange: [],
        bindTbkPromoterSearch: [],
        orderStatusOptions: [
          { label: '全部', value: 'all' },
          { label: '已失效', value: '已失效' },
          { label: '已付款', value: '已付款' },
          { label: '已收货', value: '已收货' },
          { label: '已结算', value: '已结算' },
        ],
        // 数据指标
        dataIndicator: [
          {
            label: '总成交',
            value: 'AD_TOTAL_DEAL',
          },
          {
            label: '总成交（点击）',
            value: 'AD_TOTAL_DEAL_CLICK',
          },
          {
            label: '总订单',
            value: 'AD_TOTAL_ORDER',
          },
          {
            label: '总订单（点击）',
            value: 'AD_TOTAL_ORDER_CLICK',
          },
        ],
        // 时间维度
        dateDimensionality: [
          {
            label: '分时',
            value: 'HOUR',
          },
          {
            label: '分日',
            value: 'DAY',
          },
          {
            label: '分周',
            value: 'WEEK',
          },
          {
            label: '分月',
            value: 'MONTH',
          },
        ],
        // 表格参数
        tableWidth: 1440,
        tableHeight: 520,
        cellBackgroundColor: '#999',
        cellStatusLabelColor,
        tableLoading: false,
        adTableLoading: false,
        selectedRowKeys: [],
        // 订单数据推广位分析数组
        adArray: [
          {
            label: '广告总成交',
            type: 'adTotalDeal',
            value: '-',
            decimal: '',
          },
          {
            label: '广告总成交（点击）',
            type: 'adTotalDealOfClick',
            value: '-',
            decimal: '',
          },
          {
            label: '广告总订单数',
            type: 'adTotalOrder',
            value: '-',
            decimal: '',
          },
          {
            label: '广告总订单数（点击）',
            type: 'adTotalOrderOfClick',
            value: '-',
            decimal: '',
          },
        ],
        // 推广位标签Id查询数组
        tagIdList: [],
        tagArray: [],
        dataSource: [],
        adDataSource: [],
        productColumns,
        promoterColumns,

        // 推广位透视图
        tbkPromoterSearch: {
          queryParam: 'AD_TOTAL_DEAL',
          timeGroupBy: 'HOUR',
          sellerShopTitle: '',
        },

        // 推广位名称下拉框
        sellerShopArray: [],

        // 上传文件列表
        fileList: [],
        fileData: null,
        uploadLoading: false,
        exportLoading: false,
        adExportLoading: false,
        header: { Authorization: Cookies.get('authorization') || '' },
        action: `${SERVER_BASE_URL}/tbk/order/excel/import`,

        // 分页器
        pagination: {
          size: 'small',
          total: 0,
          current: 1,
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `共 ${total} 条`,
        },
        // 推广位数据分页
        adPagination: {
          size: 'small',
          total: 0,
          current: 1,
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `共 ${total} 条`,
        },
      }
    },

    created() {
      this.getInitData()
      // 请求订单数据推广位分析数据
      this.searchTagIdList()
    },

    methods: {
      // 打开详情右侧抽屉
      handleOpenDrawer(data = {}) {
        this.$refs.productDetial.showDrawer(data)
      },

      // 重置
      handleResetClick() {
        this.filterForm = {}
        this.filterDateRange = []
        this.getInitData('init')
      },

      // 改变分页器的参数
      changePage(page) {
        this.pagination.current = page.current
        this.pagination.pageSize = page.pageSize
        this.getInitData()
      },

      // 推广位分析分页函数
      adChangePage(page) {
        this.adPagination.current = page.current
        this.adPagination.pageSize = page.pageSize
        this.adInit()
      },

      // 时间选择器
      changeDatePick(date) {
        this.setDateTypeFunc('tbPaidTimeStart', 'tbPaidTimeEnd', date)
      },

      // 时间选择器
      changeClickDatePick(date) {
        this.setDateTypeFunc('clickTimeStart', 'clickTimeEnd', date)
      },

      // 时间赋值公用函数
      setDateTypeFunc(...rest) {
        if (rest[2].length) {
          this.filterForm[rest[0]] = rest[2][0].format('YYYY-MM-DD HH:mm:ss')
          this.filterForm[rest[1]] = rest[2][1].format('YYYY-MM-DD HH:mm:ss')
        } else {
          this.filterForm[rest[0]] = ''
          this.filterForm[rest[1]] = ''
        }
        this.getInitData('init')
      },

      // 上传文件之前进行格式检验
      handleBeforeUpload(file) {
        this.fileData = file
        const acceptType = ['xls', 'csv', 'xlsx']
        if (file && !acceptType.includes(file.name.split('.')[1])) {
          this.$message.error('只能导入xls、xlsx、csv格式的文件！')
          return false
        }
      },

      // 导入数据
      handleImportClick() {
        const formData = new FormData()
        formData.append('file', this.fileData)
        this.uploadLoading = true
        this.$API
          .postStatementOrderImport(formData)
          .then(({ code, data }) => {
            this.uploadLoading = false
            if (code === 0) {
              this.$message.success('数据导入成功！')
              this.getInitData('init')
            }
          })
          .catch(() => {
            this.uploadLoading = false
          })
      },

      // 导出数据
      handleExportClick() {
        const params = []
        const accessToken = Cookies.get('authorization') || ''
        this.exportLoading = true
        for (const [key, value] of Object.entries(this.filterForm)) {
          value && params.push(`${key}=${value}`)
        }
        window.location.href = `${SERVER_BASE_URL}/tbk/order/excel/export/${accessToken}?${params.join(
          '&'
        )}`
        setTimeout(() => {
          this.exportLoading = false
        }, 500)
      },

      // 推广位数据导出
      adHandleExportClick() {
        let params = [],
          paramStr = ''
        const accessToken = Cookies.get('authorization') || ''
        this.adExportLoading = true
        for (const [key, value] of Object.entries(this.filterForm)) {
          value && params.push(`${key}=${value}`)
        }
        paramStr = `tagIdList=${this.tagIdList.toString()}&${params.join('&')}`
        window.location.href = `${SERVER_BASE_URL}/tbk/order/promoter/excel/export/${accessToken}?${paramStr}`
        setTimeout(() => {
          this.adExportLoading = false
        }, 500)
      },

      // 删除某条商品信息
      deletePromotionItem({ id, productName }) {
        const that = this
        this.$confirm({
          title: (h) => (
            <p>
              确定要从产品列表中删除<span style="color:#f00">{productName}</span>吗？
            </p>
          ),
          onOk() {
            that.$API.deleteProduct(id).then(({ code, data }) => {
              if (code === 0) {
                that.$message.success(data)
                that.getInitData()
              }
            })
          },
        })
      },

      // 勾选某一条表格的数据
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },

      // 执行列表数据方法
      async getInitData(type) {
        type === 'init' && (this.pagination.current = 1) && (this.pagination.pageSize = 10)
        this.adInit('', 'init')
        const { pageSize, current: pageIndex } = this.pagination
        const params = {
          pageIndex,
          pageSize,
          ...this.filterForm,
        }
        this.tableLoading = true
        let { code, data } = await this.$API.getStatementOrderList(params)
        this.tableLoading = false
        if (code === 0) {
          this.pagination.total = Number(data.count)
          this.dataSource = data.list.map((item) => ({ ...item, key: item.tradeId }))
          this.compuetedTotal(params)
          return
        }
        this.dataSource = []
      },

      // 推广位标签选中值改变
      tagListChange(val) {
        this.adInit(val, 'init')
      },

      // 获取订单数据推广位分析数据
      async adInit(val = '', type = '') {
        if (val) {
          let checkedTag = []
          // 区分有值无值时的赋值情况
          if (val.length) {
            val.forEach((item) => {
              this.tagArray.forEach((tag) => {
                if (item === tag.tagName) {
                  checkedTag.push(tag.id)
                }
              })
            })
          }
          this.tagIdList = checkedTag
          this.adPagination.pageIndex = 1
        }
        if (type === 'init') this.adPagination.current = 1
        const { pageSize, current: pageIndex } = this.adPagination
        // 清空选中数据 当前选中数据没有对应的操作功能
        this.selectedRowKeys = []
        let request = {
          sellerShopTitle: this.filterForm.sellerShopTitle,
          tagIdList: this.tagIdList.toString(),
          adzoneId: this.filterForm.adzoneId,
          itemId: this.filterForm.itemId,
          tkStatusList: this.filterForm.tkStatusList,
          tradeId: this.filterForm.tradeId,
          tbPaidTimeStart: this.filterForm.tbPaidTimeStart,
          tbPaidTimeEnd: this.filterForm.tbPaidTimeEnd,
          clickTimeStart: this.filterForm.clickTimeStart,
          clickTimeEnd: this.filterForm.clickTimeEnd,
          pageIndex,
          pageSize,
        }
        // 推广位透视图搜索数据
        /**
         * adzoneId 和 tagIdList 在赋值的时候不能双向绑定到 不是最新的值，只能是重新下值才能继续处理
         */
        let parmasObj = {
          ...this.tbkPromoterSearch,
          sellerShopTitle: this.filterForm.sellerShopTitle,
          tagIdList: this.tagIdList.toString(),
          adzoneId: this.filterForm.adzoneId,
          itemId: this.filterForm.itemId,
          tkStatusList: this.filterForm.tkStatusList,
          tradeId: this.filterForm.tradeId,
          tbPaidTimeStart: this.filterForm.tbPaidTimeStart,
          tbPaidTimeEnd: this.filterForm.tbPaidTimeEnd,
          clickTimeStart: this.filterForm.clickTimeStart,
          clickTimeEnd: this.filterForm.clickTimeEnd,
        }
        // 保证数据不丢失
        this.tbkPromoterSearch = parmasObj
        this.adTableLoading = true
        let { code, data } = await this.$API.getStatementPromoter(request)
        this.adTableLoading = false
        // 订单数据推广位列表
        if (!code) {
          this.adDataSource = data.list
          this.adDataSource.map((item) => (item.key = item.promoterId))
          this.adPagination.total = Number(data.count)
          this.getTagData(request)
          return
        }
        this.adDataSource = []
      },

      // 获取广告总成交等数据
      async getTagData(request) {
        let { code, data } = await this.$API.statementPromoterTotal(request)
        // 广告总成交数据
        if (!code) {
          for (let val in data) {
            this.adArray.map((item) => {
              if (item.type === val) {
                data[val] += ''
                let lastIndex = data[val].lastIndexOf('.')
                item.value = data[val]
                delete item.decimal
                // 将小数分成整数 加 小数点后的数字
                if (lastIndex !== -1) {
                  item.value = data[val].substring(0, lastIndex)
                  item.decimal = data[val].substring(lastIndex)
                }
              }
            })
          }
          // 数据总计中返回的字段
          const fieldArr = [
            'adTotalDeal',
            'adTotalDealOfClick',
            'adTotalOrder',
            'adTotalOrderOfClick',
          ]
          // 表格已有字段
          const showFieldArr = [
            'promoterId',
            'promoterName',
            'adTotalDeal',
            'adTotalDealOfClick',
            'adTotalOrder',
            'adTotalOrderOfClick',
            'tagList',
          ]
          // 进行表头的总计数据显示
          for (let index = 0; index < this.promoterColumns.length; index++) {
            const { key, width } = this.promoterColumns[index]
            // 判空赋值
            let filedVal = data[key] ? data[key] : 0
            // 首个字段处理
            if (key === 'promoterId') filedVal = `总计共${this.adPagination.total}条记录`
            if (key === 'promoterName') filedVal = '——'
            if (key !== 'tagList') {
              this.$set(this.promoterColumns[index], 'children', [
                {
                  title: showFieldArr.includes(key) ? filedVal : '——',
                  dataIndex: key,
                  key,
                  width,
                  customHeaderCell: () => ({ style: { height: '47px' } }),
                  customRender: (text, record) => {
                    return fieldArr.includes(key) ? `${text}` : text
                  },
                },
              ])
            }
          }
        }
      },

      // 获取标签数据
      async searchTagIdList(tagName = '') {
        this.fetching = true
        let { code, data } = await this.$API.getTag({
          tagName,
          pageSize: 1000,
        })
        this.fetching = false
        this.tagArray = []
        if (code === 0) {
          this.tagArray = data.list
        }
      },

      // 计算付款金额合计
      compuetedTotal(params) {
        this.$API
          .computerTotalPrice(params)
          .then(({ code, data, m }) => {
            if (code === 0) {
              this.totalPrice = data.totalPayPrice
              return
            }
          })
          .finally(() => {})
      },

      // 推广位透视图 - 数据选择赋值
      setTbkPromoterData(data) {
        this.tbkPromoterSearch.queryParam = data
      },

      // 推广位透视图 - 时间分组选择赋值
      setTbkPromoterTime(data) {
        this.tbkPromoterSearch.timeGroupBy = data
      },

      // 获取推广位透视图 - 推广位名称数据
      async getTbkPromoterList(adzoneName = '') {
        if (!adzoneName.trim()) return
        this.sellerShopArray = []
        this.tbkListFetching = true
        let { code, data } = await this.$API.tbkPromoterList(adzoneName)
        if (!code) {
          setTimeout(() => {
            this.sellerShopArray = data
          }, 100)
        }
        this.tbkListFetching = false
      },

      // 设置推广位透视图 - 推广位名称选中数据
      async setTbkPromoterList(val) {
        if (val.length > 6) {
          this.$message.error('推广位名称最多选择六个！')
          this.bindTbkPromoterSearch.pop()
          return
        }
        this.$set(this.tbkPromoterSearch, 'adzoneIdList', val.toString())
      },

      // 设置订单状态返回值多选
      filterTkStatus(e) {
        this.filterForm.tkStatusList = e.toString()
        this.getInitData('init')
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~/assets/css/account.less';
  .expand-icon {
    margin-bottom: 2px;
    transform: rotate(0deg);
    transition: all 0.2s ease;
  }

  .packup {
    transform: rotate(180deg);
  }

  .packup {
    transform: rotate(180deg);
  }
  .content-header__right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 320px;
  }

  .product-wrap {
    height: calc(100vh - 208px);
    overflow-y: auto;
    background-color: #eef0f3;
    .seconed-content_header {
      justify-content: center;
      font-weight: 700;
      font-style: normal;
      font-size: 18px;
      position: relative;
      .pack-up {
        top: 80%;
        right: -2%;
        position: absolute;
      }
    }
    .tips-style {
      font-size: 14px;
      color: rgba(204, 204, 204, 1);
      cursor: pointer;
    }
    .ad-element {
      padding: 20px 30px 20px 24px;
      border-right: 1px solid #e9e9e9;
      background-color: #fff;
      display: inline-block;
    }
    .clear-portion_style {
      padding: 0;
      background-color: transparent;
    }
    .integer-number {
      font-weight: bold;
    }
    .decimal-number {
      font-size: 16px;
      text-indent: -5px;
      font-weight: 600;
      display: inline-block;
    }
    .order-data_title {
      width: 160px;
      font-size: 14px;
      color: #999999;
    }
    .order-data_value {
      font-size: 24px;
      font-weight: 600;
      color: #000;
    }
  }

  .adzone-name_style {
    font-weight: bold;
  }

  .perspective-content {
    overflow: auto;
  }

  .statement-input {
    width: 220px !important;
    @media screen and (min-width: 1600px) {
      width: 320px !important;
    }
    @media screen and (max-width: 1280px) {
      width: 200 !important;
    }
  }
</style>
<style lang="less">
  .product-wrap {
    /deep/ .ant-select-selection__choice {
      padding-left: 0;
    }
  }
  .product-wrap_tool {
    .tool-tip_letter {
      margin: 10px 10px 10px 0px;
    }
  }
  .ant-tooltip-content {
    .ant-tooltip-arrow::before,
    .ant-tooltip-inner {
      background-color: #fff;
    }
  }
</style>
