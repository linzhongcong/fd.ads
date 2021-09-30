<!--
 * @Author: lizheng
 * @Date: 2021-03-24 11:33:44
 * @LastEditTime: 2021-03-29 11:54:41
 * @LastEditors: Please set LastEditors
 * @Description: 生e经数据报表
 * @FilePath: \ads\pages\statement\business-experience\business-experience-index.vue
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
                <a-select
                  show-search
                  allow-clear
                  placeholder="输入商品ID"
                  class="statement-input"
                  option-label-prop="label"
                  v-model.trim="filterForm.productId"
                  @search="(name) => productionFuzzySearch(name, 'productOptions')"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option
                    v-for="list in productOptions"
                    :value="list.productId"
                    :key="list.productId"
                    :label="list.productId"
                  >
                    {{ list.product }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="商品标题">
                <a-select
                  show-search
                  allow-clear
                  placeholder="输入商品标题"
                  class="statement-input"
                  option-label-prop="label"
                  v-model.trim="filterForm.productName"
                  @search="(name) => productionFuzzySearch(name, 'productNameOptions')"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option
                    v-for="list in productNameOptions"
                    :value="list.productName"
                    :key="list.productId"
                    :label="list.productName"
                  >
                    {{ list.productName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="日期">
                <a-range-picker
                  v-model="filterDateRange"
                  :disabled-date="(current) => current && current > this.moment().endOf('day')"
                  :allow-clear="true"
                  format="YYYY-MM-DD"
                  separator="至"
                  class="statement-input"
                  style="width:auto"
                  @change="changeDatePick"
                >
                  <a-icon slot="suffixIcon" type="calendar" />
                </a-range-picker>
              </a-form-model-item>
            </a-col>
          </a-row>

          <!-- 第二行起的表单默认隐藏 -->
          <div :style="{ display: isExpand ? 'block' : 'none' }"></div>
        </a-form-model>

        <!-- 展开或收起 -->
        <div class="expand-wrap" v-if="false">
          <a-button type="link" @click="isExpand = !isExpand">
            <span>{{ !isExpand ? '展开' : '收起' }}</span>
            <a-icon :class="['expand-icon', isExpand ? '' : 'packup']" type="caret-up" />
          </a-button>
        </div>
      </div>

      <!-- 查询操作模块 -->
      <div class="right">
        <a-button type="primary" @click="getInitData('init')">查询</a-button>
        <a-button style="margin-top:10px" @click="handleResetClick">
          重置
        </a-button>
      </div>
    </div>

    <!-- 数据详情内容 -->
    <div class="content">
      <header class="content-header">
        <h3 style="font-weight:bold">趋势分析数据</h3>
        <div class="content-header__right">
          <a-button type="primary" icon="upload" @click="handleImportClick">导入</a-button>
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
        bordered
        size="small"
        class="business-table"
        :loading="tableLoading"
        :columns="businessExperienceColumns"
        :data-source="dataSource"
        :row-key="(record) => record.key"
        :scroll="{ x: tableWidth, y: tableHeight }"
        :pagination="pagination"
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
        @change="changePage"
      />
    </div>

    <ImportModal ref="importModal" @onSave="handleOnSave" />
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import { SERVER_BASE_URL } from '~/api/config'
  import { debounce } from '~/utils/utils'
  import { businessExperienceColumns } from './columns'
  import ImportModal from './business-experience-import'

  export default {
    components: { ImportModal },

    data() {
      this.productionFuzzySearch = debounce(this.productionFuzzySearch, 500)
      return {
        // 搜索筛选表单
        isExpand: false,
        fetching: false,
        filterForm: {},
        filterDateRange: [],
        productOptions: [],
        productNameOptions: [],

        // 表格参数
        tableWidth: 1000,
        tableHeight: 520,
        tableLoading: false,
        dataSource: [],
        businessExperienceColumns,

        // 上传文件列表
        fileList: [],
        fileData: null,
        uploadLoading: false,
        exportLoading: false,

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
      }
    },

    created() {
      this.getInitData()
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
        this.dataSource = []
        this.getInitData()
      },

      // 时间选择器
      changeDatePick(date) {
        if (date.length) {
          this.filterForm.startTime = date[0].format('YYYY-MM-DD')
          this.filterForm.endTime = date[1].format('YYYY-MM-DD')
        } else {
          this.filterForm.startTime = ''
          this.filterForm.endTime = ''
        }
        this.getInitData('init')
      },

      // 导入
      handleImportClick() {
        this.$refs.importModal.openModal()
      },

      //  导入数据成功的回调
      handleOnSave() {
        this.$message.success('数据导入成功！')
        this.getInitData('init')
      },

      // 产品模糊搜索
      productionFuzzySearch(name, type) {
        if (name === '' || !name.trim()) return (this.productOptions = [])
        this.fetching = true
        this.$API
          .getProductList(name.trim())
          .then(({ code, data }) => {
            this.fetching = false
            if (code === 0) this[type] = data
          })
          .catch(() => (this.fetching = false))
      },

      // 导出数据
      handleExportClick() {
        const params = []
        const accessToken = Cookies.get('authorization') || ''
        this.exportLoading = true
        for (const [key, value] of Object.entries(this.filterForm)) {
          value && params.push(`${key}=${value}`)
        }
        window.location.href = `${SERVER_BASE_URL}/sej/order/excel/export/${accessToken}?${params.join(
          '&'
        )}`
        setTimeout(() => {
          this.exportLoading = false
        }, 500)
      },

      // 表格头部汇总数据
      getTableTotalData(params) {
        this.$API
          .getBusinessStatementTotal(params)
          .then(({ code, data }) => {
            this.tableLoading = false
            if (code === 0) {
              const percentKeyArr = ['convertRate', 'skipRate']
              this.businessExperienceColumns.forEach((item, index) => {
                if (!index) {
                  item.children[0].title = `总计（共${this.pagination.total}条记录）`
                } else if (index > 2) {
                  const { key } = item.children[0]
                  item.children[0].title = percentKeyArr.includes(key) ? `${data[key]}%` : data[key]
                } else {
                  item.children[0].title = '——'
                }
              })
            }
          })
          .catch(() => (this.tableLoading = false))
      },

      // 获取列表数据
      getInitData(type) {
        type === 'init' && (this.pagination.current = 1) && (this.pagination.pageSize = 10)
        const { pageSize, current: pageIndex } = this.pagination
        const params = { pageIndex, pageSize, ...this.filterForm }
        this.tableLoading = true
        this.$API
          .getBusinessStatement(params)
          .then(({ code, data }) => {
            this.tableLoading = false
            if (code === 0) {
              this.pagination.total = Number(data.count)
              this.dataSource = data.list.map((item, key) => ({ ...item, key }))
              this.getTableTotalData(params)
            }
          })
          .catch(() => {
            this.tableLoading = false
          })
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~/assets/css/account.less';

  .content-header__right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 320px;
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
