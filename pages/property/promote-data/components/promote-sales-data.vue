<!--
 * @Author: huangjianhan
 * @Date: 2021-01-13 15:19:02
 * @LastEditTime: 2021-10-15 17:50:06
 * @LastEditors: Please set LastEditors
 * @Description: 头条界面组件
 * @FilePath: \ads.fandow.com\pages\user-account\components\fisrtNews.vue
-->
<template>
  <div class="product-wrap">
    <div class="filter">
      <div class="left">
        <!-- 搜索表单内容 -->
        <a-form-model
          label-align="right"
          layout="inline"
          :wrapper-col="{ span: 18 }"
          :model="searchData"
          ref="searchData"
        >
          <a-row>
            <a-col :span="6">
              <a-form-model-item
                prop="goodsName"
                label="商品"
                :label-col="{ span: 4 }"
                style="width:100%;"
              >
                <SelectProducts
                  v-model="searchData.goodsName"
                  :placeholder="'请输入商品ID/名称'"
                  @change="selectGoodsChange"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item prop="date" label="日期" :label-col="{ span: 3 }">
                <a-range-picker
                  v-model="searchData.date"
                  :allow-clear="true"
                  format="YYYY.MM.DD"
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
        </a-form-model>
      </div>
      <!-- 查询操作模块 -->
      <div class="right">
        <a-button type="primary" @click="initData">
          查询
        </a-button>
        <a-button style="margin-top:10px" @click="handleResetClick">
          重置
        </a-button>
      </div>
    </div>
    <div class="first-table margin-16">
      <div class="first-header flex">
        <div style="display:flex;">
          <a-button type="primary" @click="showModal('bussinessSalesImport')">
            导入数据
          </a-button>
          <div style="margin-left:10px;">
            <a-button type="primary" @click="showModal('bussinessSalesCreate')">
              <span>&ensp;快速创建 &ensp;</span>
            </a-button>
            <a-tooltip>
              <template slot="title">
                <span style="color: #888888;">
                  可快速创建出一条当天的商品销售数据，便于时段数据的记录
                </span>
              </template>
              <a-icon
                type="question-circle"
                style="position:relative; left: -25px; color: white;"
              />
            </a-tooltip>
          </div>
        </div>
        <a-button type="primary" @click="templateDownLoad" :loading="templateDownLoading">
          下载导入模板
        </a-button>
      </div>
      <a-table
        :columns="firstColumns"
        :data-source="tableData"
        :scroll="{ x: 1500, y: 480 }"
        size="small"
        :rowKey="(record) => record.key"
        :pagination="pagination"
        :row-selection="{ selectedRowKeys, onChange: handleSelectChange }"
        :loading="spinObj.loading"
        :locale="locale"
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
        bordered
        @change="changePage"
      >
        <template slot="operate" slot-scope="text, record">
          <a
            @click="
              handleOpenDrawer(
                'salesSessionData',
                { title: '时段数据', status: 'timeData', data: {} },
                record
              )
            "
          >
            时段数据
          </a>
        </template>
      </a-table>
    </div>

    <!-- 产品-新建/编辑 -->
    <bussiness-sales-create ref="bussinessSalesCreate"></bussiness-sales-create>

    <!-- 导入 -->
    <bussiness-sales-import ref="bussinessSalesImport"></bussiness-sales-import>

    <!-- 时段数据 -->
    <sales-session-data
      :canEdit="true"
      @subSure="sessionSubSure"
      :sessionData="sessionData"
      ref="salesSessionData"
    />
  </div>
</template>

<script>
  import salesSessionData from '@/components/sales-session-data/sales-session-data.vue'
  import bussinessSalesImport from './bussiness-sales-import.vue'
  import bussinessSalesCreate from './bussiness-sales-create.vue'
  import tableEmpty from './tableEmpty.vue'
  import { notification } from 'ant-design-vue'
  import { promoteSalesImport } from '@/utils/eventBus.js'
  export default {
    components: {
      salesSessionData,
      bussinessSalesImport,
      bussinessSalesCreate,
      tableEmpty,
    },

    data() {
      return {
        sessionData: {
          dataAt: '',
          goodsName: '',
          tableData: [],
        },
        templateDownLoading: false,
        locale: {
          emptyText: <tableEmpty />,
        },
        // 导出模态框显隐
        exportModal: false,
        // 列表查询数据
        searchData: {
          date: [],
          goodsId: '',
          goodsName: '',
          startAt: '',
          endAt: '',
        },
        tableData: [],
        // **
        pagination: {
          size: 'small',
          current: 1,
          total: 0,
          showSizeChanger: true,
          showQuickJumper: true,
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `共 ${total} 条`,
        },
        // **
        firstColumns: [
          {
            title: '日期',
            dataIndex: 'dataAt',
            fixed: 'left',
            width: 120,
            key: 'dataAt',
            customRender: (text) => (text ? text : ' '),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '商品访客数',
            dataIndex: 'visitorQuantity',
            key: 'visitorQuantity',
            width: 120,
            customRender: (text) => (text ? text : '0'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '商品浏览量',
            dataIndex: 'viewQuantity',
            key: 'viewQuantity',
            tooltip: true,
            width: 120,
            customRender: (text) => (text ? text : '0'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '商品平均停留时长',
            dataIndex: 'stayTime',
            key: 'stayTime',
            width: 150,
            customRender: (text) => (text ? text : '0'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '商品详情页跳出率',
            dataIndex: 'bounceRate',
            key: 'bounceRate',
            width: 150,
            scopedSlots: { customRender: 'authStatu' },
            customRender: (text) => (text ? `${text}%` : '0%'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '商品加购件数',
            dataIndex: 'repurchaseQuantity',
            key: 'repurchaseQuantity',
            width: 150,
            customRender: (text) => (text ? text : '0'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '商品收藏人数',
            dataIndex: 'collectionQuantity',
            key: 'collectionQuantity',
            width: 160,
            customRender: (text) => (text ? text : '0'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '下单买家数',
            dataIndex: 'placeUserQuantity',
            key: 'placeUserQuantity',
            tooltip: true,
            width: 120,
            customRender: (text) => (text ? text : '0'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '下单金额',
            dataIndex: 'placeSum',
            key: 'placeSum',
            tooltip: true,
            width: 120,
            customRender: (text) => (text ? text : '0'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '下单转换率',
            dataIndex: 'placeRate',
            key: 'placeRate',
            tooltip: true,
            width: 120,
            customRender: (text) => (text ? `${text}%` : '0%'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '支付买家数',
            dataIndex: 'payUserQuantity',
            key: 'payUserQuantity',
            tooltip: true,
            width: 120,
            customRender: (text) => (text ? text : '0'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '下单件数',
            dataIndex: 'placeQuantity',
            key: 'placeQuantity',
            tooltip: true,
            width: 120,
            customRender: (text) => (text ? text : '0'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '支付转换率',
            dataIndex: 'payRate',
            key: 'payRate',
            tooltip: true,
            width: 120,
            customRender: (text) => (text ? `${text}%` : '0%'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '支付金额',
            dataIndex: 'paySum',
            key: 'paySum',
            tooltip: true,
            width: 120,
            customRender: (text) => (text ? text : '0'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '支付件数',
            dataIndex: 'payQuantity',
            key: 'payQuantity',
            tooltip: true,
            width: 120,
            customRender: (text) => (text ? text : '0'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            width: 80,
            fixed: 'right',
            scopedSlots: { customRender: 'operate' },
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
        ],
        // **
        firstNewsData: { list: [] },
        // **
        selectedRowKeys: [],
        spinObj: {
          loading: false,
        },
      }
    },

    mounted() {},

    created() {
      promoteSalesImport.$on('showModal', (type) => {
        this.showModal(type)
      })
    },

    methods: {
      // 时段数据编辑提交
      sessionSubSure(data) {
        if (!data.length) {
          this.$refs['salesSessionData'].subLoading = false
          this.$message.warning('尚未编辑任何时段金额，无法提交！')
          return
        }
        data.forEach((item) => {
          item.period = Number(item.period)
          item.goodsId = this.sessionData.goodsId
          item.dataAt = this.sessionData.dataAt
          Object.freeze(item.key)
        })
        this.$API
          .businessStaffPeriodEdit(data)
          .then((res) => {
            if (res.code === 0) {
              this.$refs['salesSessionData'].onClose()
              this.$message.success('提交成功')
              this.initData()
            }
          })
          .finally(() => {
            this.$refs['salesSessionData'].subLoading = false
          })
      },

      // 下载导入模板
      templateDownLoad() {
        this.templateDownLoading = true
        this.$API
          .businessExcelDownLoad()
          .then((url) => {
            url && this.downLoadExcel(url)
          })
          .finally(() => {
            this.templateDownLoading = false
          })
      },

      // Modal显示 -> 导出和快速新建
      showModal(type) {
        this.$refs[type].showModal()
      },

      // 时段数据-详情
      handleOpenDrawer(name, data = {}, { goodsId, dataAt }) {
        this.sessionData.goodsName = this.searchData.goodsName
        this.sessionData.dataAt = dataAt
        this.sessionData.goodsId = goodsId
        let params = {
          goodsId,
          dataAt,
        }
        this.$API.businessStaffPeriodList(params).then((res) => {
          if (res.code === 0) {
            this.sessionData.tableData = res.data
            this.$refs[name].showDrawer(data)
          }
        })
      },

      // 商品列表changes事件
      selectGoodsChange(name, id) {
        this.searchData.goodsId = (id && id.trim()) || undefined
      },

      // 时间选择器change事件
      changeDatePick(date) {
        if (date.length) {
          this.searchData.startAt = date[0].format('YYYY-MM-DD')
          this.searchData.endAt = date[1].format('YYYY-MM-DD')
        } else {
          this.searchData.startAt = ''
          this.searchData.endAt = ''
        }
      },

      initData() {
        if (!this.searchData.date.length > 0 || !this.searchData.goodsId) {
          notification.warning({
            message: '警告',
            duration: 2,
            description: '商品和日期为必填项，请检查是否填写完整！！！',
          })
          return
        }
        this.spinObj.loading = true
        let params = {
          goodsId: this.searchData.goodsId,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize || 10,
          startAt: this.searchData.startAt,
          endAt: this.searchData.endAt,
        }
        this.$API
          .businessStaffSearch(params)
          .then((res) => {
            if (res.code === 0) {
              res.data.list.map((element, index) => (element.key = index))
              this.tableData = res.data.list
              this.pagination.total = res.data.count
            }
          })
          .finally(() => {
            this.spinObj.loading = false
          })
      },

      // 重置按钮
      handleResetClick() {
        this.searchData.goodsId = undefined
        this.searchData.goodsName = undefined
        this.searchData.date = []
        this.searchData.startAt = ''
        this.searchData.endAt = ''
      },

      // table-select
      handleSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },

      changePage(pageObj, params) {
        this.pagination.current = pageObj.current
        this.pagination.pageSize = pageObj.pageSize
        this.initData(pageObj)
      },

      downLoadExcel(url) {
        const a = document.createElement('a')
        a.download = '模板下载'
        a.href = URL.createObjectURL(url)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      },
    },
    // 手动销毁eventBus，防止内存泄漏
    beforeDestroy() {
      promoteSalesImport.$off('showModal')
    },
  }
</script>

<style lang="less" scoped>
  @import '~/assets/css/account.less';
  .flex {
    display: flex;
    justify-content: space-between;
  }
  .margin-16 {
    margin: 16px !important;
  }
  .search-btn-wrapper {
    display: flex;
    align-items: center;
    padding-top: 43px;
    padding-left: 10px;
  }

  .first {
    &-search,
    &-table {
      padding: 10px 16px;
      box-sizing: border-box;
      background-color: #fff;
    }
    &-edit_style {
      font-size: 15px;
      color: rgb(45, 140, 240);
      cursor: pointer;
    }
    &-header {
      margin: 0 0 20px;
    }
    &-table {
      margin: 16px 0 0;
    }
    .icon-hover {
      cursor: pointer;
    }
    .icon-hover-doc {
      cursor: pointer;
      :hover {
        background-color: #00a1f9;
        color: #fff;
      }
    }
  }

  .sync-record {
    min-width: 240px;
    max-height: 220px;
    overflow: auto;
  }

  /deep/ .ant-table-thead {
    background-color: #f5f7fa !important;
  }

  /deep/ .table-row__striped {
    background-color: #fafafa;
  }
</style>

<style lang="less">
  .first {
    .ant-form-item-label > label::after {
      content: '';
    }
  }
</style>
