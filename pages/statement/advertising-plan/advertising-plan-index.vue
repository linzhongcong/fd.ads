<!--
 * @Author: hjh
 * @Date: 2021-02-22 17:17:59
 * @LastEditTime: 2021-04-21 11:18:23
 * @LastEditors: Please set LastEditors
 * @Description: 账户报表模块
 * @FilePath: \ads.fandow.com\pages\advertising-plan\advertising-plan-index.vue
-->
<template>
  <div class="advertising-plan">
    <div class="advertising-plan_search">
      <div class="search-top">
        <span class="search-top_title">账户报表</span>
        <div class="search-top_condition">
          <a-select style="width: 120px" v-model="searchObj.timeGroupBy" @change="getInitData">
            <a-select-option v-for="(item, key) in timeSelectData" :key="key" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
          <a-range-picker
            v-model="rangePickerDate"
            :ranges="range"
            :allowClear="false"
            format="YYYY-MM-DD"
            separator="至"
            style="margin-bottom:10px;width:230px"
          >
            <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
        </div>
      </div>
      <a-divider style="margin:0" />
      <div class="search-bottom">
        <div>
          账户：
          <div class="search-top_select">
            <span class="selected-option">{{ searchObj.selectedUserNum }}项</span>
            <span class="selected-button" @click="openSelectUser">选择账户</span>
          </div>
        </div>
        <div class="search-bottom_button">
          <a-button @click="getInitData" type="primary">查询</a-button>
        </div>
      </div>
    </div>
    <div class="content">
      <header class="content-header">
        <h3 class="content-header_title">详细数据</h3>
        <div class="content-header__right">
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
        :scroll="{ x: 1200, y: 515 }"
        :columns="productColumns"
        :row-key="(record) => record.key"
        :data-source="dataSource"
        :pagination="pagination"
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
        size="small"
        bordered
        @change="changePage"
      >
        <template slot="ctr" slot-scope="text">
          <div>{{ text }}%</div>
        </template>
        <template slot="deepConvertRate" slot-scope="text">
          <div>{{ text }}%</div>
        </template>
        <template slot="convertRate" slot-scope="text">
          <div>{{ text }}%</div>
        </template>
      </a-table>
    </div>
    <a-modal
      title="选择账户"
      v-model="dialogObj.userDialogStatu"
      :confirm-loading="confirmLoading"
      :width="1200"
    >
      <div class="user-dialog">
        负责人&ensp;
        <a-select
          mode="multiple"
          label-in-value
          placeholder="请输入姓名/工号"
          style="min-width: 180px;max-width: 300px;"
          option-label-prop="label"
          :filter-option="false"
          @search="fetchPrincipal"
          @change="changePrincipal"
        >
          <a-spin v-if="dialogObj.fetchingPrincipal" slot="notFoundContent" size="small" />
          <a-select-option
            v-for="(item, key) in dialogObj.selectUserData"
            :key="item.realName"
            :value="item.username"
            :label="item.realName"
          >
            {{ item.username + '/' + item.realName }}
          </a-select-option>
        </a-select>
        &ensp;&ensp; 产品&ensp;
        <a-select
          mode="multiple"
          label-in-value
          placeholder="请输入商品名称/ID"
          style="min-width: 180px;max-width: 300px;"
          :filter-option="false"
          @search="fetchProduct"
          @change="changeProduct"
        >
          <a-spin v-if="dialogObj.fetching" slot="notFoundContent" size="small" />
          <a-select-option
            v-for="(item, key) in dialogObj.selectProductData"
            :key="item.productName"
            :value="item.productId"
          >
            {{ item.productName }}
          </a-select-option>
        </a-select>
        &ensp;&ensp;账号ID&ensp;
        <a-select
          show-search
          allow-clear
          placeholder="请输入账号ID搜索"
          style="min-width: 180px;max-width: 300px;"
          v-model.trim="dialogObj.advertiserId"
          @search="getAdAccountFuzzy"
        >
          <a-spin v-if="dialogObj.idLoading" slot="notFoundContent" size="small" />
          <a-select-option
            v-for="(item, key) in dialogObj.selectID"
            :key="item.advertiserName"
            :value="item.advertiserId"
          >
            {{ item.advertiserName }}
          </a-select-option>
        </a-select>
        &ensp;&ensp;
        <a-button class="user-dialog_button" type="primary" @click="searchAdverUser">
          查询
        </a-button>

        <a-spin :spinning="dialogObj.searchSpin">
          <div class="shuttle">
            <div class="shuttle-left">
              <div class="shuttle-title">广告账户</div>
              <div class="shuttle-select">
                <a-checkbox
                  :indeterminate="indeterminate"
                  :checked="checkAll"
                  @change="onCheckAllChange"
                  class="all-select"
                >
                  全选
                </a-checkbox>
                <a-checkbox-group
                  class="user-checkbox"
                  v-model="checkedList"
                  :options="plainOptions"
                  @change="onChange"
                />
                <template slot="label" slot-scope="option">{{ option }}</template>
              </div>
            </div>
            <div class="shuttle-right">
              <div class="shuttle-right_title">
                <div class="shuttle-right_selected">已选择（{{ checkedList.length }}个）</div>
                <div class="shuttle-right_function">
                  <span @click="clearSelected">清空全部</span>
                </div>
              </div>
              <div class="shuttle-select">
                <div v-for="(item, key) in checkedList" :key="key" class="shuttle-select_option">
                  <span class="select-option_letter">{{ dataMap[item] }}</span>
                  <a-icon @click="delSelected(item)" type="close" style="font-size: 12px;" />
                </div>
              </div>
            </div>
          </div>
        </a-spin>
      </div>
      <template slot="footer">
        <a-button key="back" @click="cancelDialog">取消</a-button>
        <a-button @click="selectedUserData" type="primary">提交</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import { SERVER_BASE_URL } from '~/api/config'
  import { getDateRange, debounce } from '~/utils/utils'
  export default {
    data() {
      this.fetchPrincipal = debounce(this.fetchPrincipal, 500)
      this.fetchProduct = debounce(this.fetchProduct, 500)
      this.getAdAccountFuzzy = debounce(this.getAdAccountFuzzy, 500)

      return {
        searchObj: {
          selectedUserNum: 0,
          advertiserIdList: [],
          timeStart: null,
          timeEnd: null,
          timeGroupBy: 'HOUR',
        },
        plainOptions: [],
        plainOptionsProto: [],
        dataMap: {},
        checkedList: [],
        indeterminate: true,
        checkAll: false,
        confirmLoading: false,
        timeSelectData: [
          {
            label: '分时',
            value: 'HOUR',
          },
          {
            label: '分日',
            value: 'DAY',
          },
          // {
          //   label: '分周',
          //   value: 'WEEK',
          // },
          {
            label: '分月',
            value: 'MONTH',
          },
          {
            label: '合计',
            value: 'TOTAL',
          },
        ],
        // 弹框状态
        dialogObj: {
          userDialogStatu: false,
          selectUserData: [],
          selectProductData: [],
          fetchingId: [],
          plan: {
            planDialogStatu: false,
          },
          product: '',
          user: '',
          principal: [],
          productSelect: [],
          fetching: false,
          fetchingPrincipal: false,
          searchSpin: false,
          idLoading: false,
          advertiserId: undefined,
        },
        // 时间格式
        rangePickerDate: [
          this.moment(new Date(), 'YYYY-MM-DD'),
          this.moment(new Date(), 'YYYY-MM-DD'),
        ],
        tableLoading: false,
        exportLoading: false,
        // 表格列
        productColumns: [
          {
            title: '时间',
            dataIndex: 'time',
            key: 'time',
            width: 220,
            ellipsis: true,
            fixed: 'left',
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '账户名称',
            dataIndex: 'advertiserName',
            key: 'advertiserName',
            width: 160,
            ellipsis: true,
            fixed: 'left',
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '展示数',
            dataIndex: 'show',
            key: 'show',
            width: 100,
            ellipsis: true,
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '点击数',
            dataIndex: 'click',
            key: 'click',
            width: 100,
            ellipsis: true,
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '平均点击单价',
            dataIndex: 'avgClickCost',
            key: 'avgClickCost',
            width: 120,
            ellipsis: true,
          },
          {
            title: '消耗',
            dataIndex: 'cost',
            key: 'cost',
            width: 100,
            ellipsis: true,
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '平均千次展示费用',
            dataIndex: 'avgShowCost',
            key: 'avgShowCost',
            width: 140,
            ellipsis: true,
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '点击率',
            dataIndex: 'ctr',
            key: 'ctr',
            width: 100,
            ellipsis: true,
            customHeaderCell: () => ({ style: { height: '47px' } }),
            scopedSlots: { customRender: 'ctr' },
          },
          {
            title: '转换成本',
            dataIndex: 'convertCost',
            key: 'convertCost',
            width: 120,
            ellipsis: true,
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '深度转换率',
            dataIndex: 'deepConvertRate',
            key: 'deepConvertRate',
            width: 120,
            ellipsis: true,
            customHeaderCell: () => ({ style: { height: '47px' } }),
            scopedSlots: { customRender: 'deepConvertRate' },
          },
          {
            title: '转化数',
            dataIndex: 'convert',
            key: 'convert',
            width: 100,
            ellipsis: true,
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '转化率',
            dataIndex: 'convertRate',
            key: 'convertRate',
            width: 100,
            ellipsis: true,
            customHeaderCell: () => ({ style: { height: '47px' } }),
            scopedSlots: { customRender: 'convertRate' },
          },
          {
            title: '深度转化成本',
            dataIndex: 'deepConvertCost',
            key: 'deepConvertCost',
            width: 140,
            ellipsis: true,
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            fixed: 'right',
            title: '成交',
            dataIndex: 'totalDeal',
            key: 'totalDeal',
            width: 100,
            ellipsis: true,
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            fixed: 'right',
            title: 'ROI',
            dataIndex: 'roi',
            key: 'roi',
            width: 100,
            ellipsis: true,
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
        ],
        dataSource: [],
        // 分页器
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
    watch: {
      // 日期发生改变重新调用接口
      rangePickerDate: {
        deep: true,
        immediate: true,
        handler(nDate) {
          this.searchObj.timeStart = nDate && nDate[0].format('YYYY-MM-DD')
          this.searchObj.timeEnd = nDate && nDate[1].format('YYYY-MM-DD')
        },
      },
    },
    created() {
      this.range = getDateRange(this)
    },
    mounted() {
      this.getInitData()
    },
    methods: {
      // 请求列表数据
      getInitData() {
        this.tableLoading = true
        this.$API
          .getReportAdvertiser(this.returnRequestParams())
          .then(({ code, data, message }) => {
            if (code === 0) {
              // 给予唯一的key值 防止不唯一而报错
              for (let index = 0; index < data.list.length; index++) {
                data.list[index].key = index
              }
              this.dataSource = data.list
              this.pagination.total = data.count
              this.getDataCount()
              return
            }
          })
          .finally(() => {
            this.tableLoading = false
          })
      },

      // 获取数据总计
      getDataCount() {
        let assignFiled = ['cost', 'totalDeal', 'roi']
        this.$API
          .userGetCountData(this.returnRequestParams())
          .then(({ code, data, message }) => {
            if (code === 0) {
              for (let index = 0; index < this.productColumns.length; index++) {
                let keyVal = data[this.productColumns[index].key]
                let filedVal = (filedVal = keyVal ? (keyVal === 0 ? '——' : keyVal) : '——')
                if (assignFiled.indexOf(this.productColumns[index].key) !== -1) {
                  filedVal = keyVal
                }
                // 首个字段用来展示总数据的
                if (this.productColumns[index].key === 'time') {
                  filedVal = `总计共${this.pagination.total}条记录`
                }
                // 进行表头字段嵌入处理 由于字段一致可以这么玩
                this.$set(this.productColumns[index], 'children', [
                  {
                    title: filedVal,
                    dataIndex: this.productColumns[index].key,
                    key: this.productColumns[index].key,
                    width: this.productColumns[index].width,
                    customHeaderCell: () => ({ style: { height: '47px' } }),
                  },
                ])
              }
            }
          })
          .finally(() => {
            // 在最后面结束loading
            this.tableLoading = false
          })
      },

      openSelectUser() {
        this.dialogObj.userDialogStatu = true
        this.onChange(this.checkedList)
        this.checkedList.length === 0 && this.clearSelected()
      },

      // 选择账户 - 点击提交 - 进行数据的赋值操作 且 关闭弹框
      selectedUserData() {
        this.searchObj.selectedUserNum = this.checkedList.length
        this.clearSelectedData()
        this.cancelDialog()
      },

      // 清空弹框中选中数据 且重新赋值
      clearSelectedData() {
        this.searchObj.advertiserIdList = this.checkedList
      },

      delSelected(item) {
        let sortNum = this.checkedList.indexOf(item)
        this.checkedList.splice(sortNum, 1)
        this.onChange(this.checkedList)
      },

      cancelDialog() {
        this.dialogObj.userDialogStatu = false
      },

      clearSelected() {
        this.onCheckAllChange({
          target: {
            checked: false,
          },
        })
      },

      // 导出数据
      handleExportClick() {
        const params = []
        const accessToken = Cookies.get('authorization') || ''
        for (const [key, value] of Object.entries(this.returnRequestParams())) {
          value && params.push(`${key}=${value}`)
        }
        this.exportLoading = true
        window.open(
          `${SERVER_BASE_URL}/report/advertiser/excel/export/${accessToken}?${params.join('&')}`,
          '_blank'
        )
        setTimeout(() => {
          this.exportLoading = false
        }, 500)
      },

      // 改变分页器的参数
      changePage(page) {
        this.pagination.current = page.current
        this.pagination.pageSize = page.pageSize
        this.getInitData()
      },

      onChange(checkedList) {
        this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length
        this.checkAll = checkedList.length === this.plainOptions.length
      },

      // 全选框
      onCheckAllChange(e) {
        Object.assign(this, {
          indeterminate: false,
          checkAll: e.target.checked,
        })
        if (e.target.checked) {
          for (let i = 0; i < this.plainOptions.length; i++) {
            this.checkedList.push(this.plainOptions[i].value)
          }
          return false
        }
        this.checkedList = []
      },

      // 获取负责人输入框值 进行负责人值查询
      fetchPrincipal(value) {
        this.dialogObj.fetchingPrincipal = true
        this.dialogObj.selectUserData = []
        this.$API
          .getUsers({ name: value, perPage: 50 })
          .then(({ code, data }) => {
            if (code === 0) {
              this.dialogObj.selectUserData.push(...data.list)
            }
          })
          .finally(() => {
            this.dialogObj.fetchingPrincipal = false
          })
      },

      // 负责人值改变
      changePrincipal(value) {
        this.dialogObj.principal = value
      },

      // 获取产品输入框值 进行产品值查询
      fetchProduct(value) {
        this.dialogObj.fetching = true
        this.dialogObj.selectProductData = []
        this.$API
          .getProductList(value)
          .then((res) => {
            if (res.code === 0) {
              this.dialogObj.selectProductData.push(...res.data)
            }
          })
          .finally(() => {
            this.dialogObj.fetching = false
          })
      },

      // 产品值改变
      changeProduct(value) {
        this.dialogObj.productSelect = value
      },

      // 获取账号ID输入框值 进行账号ID值查询
      getAdAccountFuzzy(adId) {
        if (adId === '') return (this.dialogObj.selectID = [])
        this.dialogObj.idLoading = true
        this.$API
          .getReportAdvertiserSearch(adId.trim())
          .then(({ code, data }) => {
            if (code === 0) {
              this.dialogObj.selectID = data ? data : []
            }
          })
          .finally(() => (this.dialogObj.idLoading = false))
      },

      // 选择账户 查询功能
      searchAdverUser() {
        this.dialogObj.searchSpin = true
        this.plainOptions = []
        this.dataMap = {}
        const user = this.disintegrateData(this.dialogObj.principal)
        const product = this.disintegrateData(this.dialogObj.productSelect)
        const advertiserId = this.dialogObj.advertiserId
        this.$API
          .adConditionList({ user, product, advertiserId })
          .then(({ code, data }) => {
            if (code === 0) {
              this.plainOptionsProto = data
              for (let i = 0; i < data.length; i++) {
                this.plainOptions.push({
                  label: data[i].advertiserName,
                  value: data[i].advertiserId,
                })
                this.dataMap[data[i].advertiserId] = data[i].advertiserName
              }
            }
          })
          .finally(() => {
            this.dialogObj.searchSpin = false
          })
      },

      // 列表查询参数设置再返回
      returnRequestParams() {
        let requestObj = JSON.parse(JSON.stringify(this.searchObj))
        requestObj.advertiserIdList = requestObj.advertiserIdList.toString()
        requestObj.pageIndex = this.pagination.current
        requestObj.pageSize = this.pagination.pageSize
        delete requestObj.selectedUserNum
        return requestObj
      },

      // 数组转换为指定数据字符串
      disintegrateData(disintegrating) {
        let dataString = []
        for (let i = 0; i < disintegrating.length; i++) {
          dataString.push(disintegrating[i].key.trim())
        }
        return dataString.toString()
      },
    },
  }
</script>

<style lang="less" scoped>
  .advertising-plan {
    min-height: calc(100vh - 64px);
    width: calc(100vw - 160px);
    // padding: 16px;
    overflow-y: auto;
    background-color: #eef0f3;
    .advertising-plan_search {
      background-color: #fff;
    }
    .search-top {
      height: 70px;
      padding: 16px 20px;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
    }
    .search-top_title {
      font-size: 19px;
      font-weight: bold;
    }
    .search-top_condition {
      margin-right: 14px;
      display: inline-block;
    }
    .search-bottom {
      padding: 6px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .search-bottom_select {
      height: 30px;
      .selected-button {
        width: 30%;
      }
    }
    .search-bottom_button {
      height: 100%;
      padding: 10px 0 10px 20px;
      border-left: 1px solid #d9d9d9;
    }
    .content {
      margin: 16px;
      background-color: #fff;
      border-radius: 4px;
      padding: 16px 24px;

      &-header_title {
        font-weight: bold;
        font-size: 17px;
      }

      &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
    }
  }
  .user-dialog_search {
    width: 360px;
    display: inline-block;
    position: relative;
    background-color: #fff;
  }
  .selected-option {
    color: #d9d9d9;
  }
  .search-top_select,
  .search-bottom_select {
    width: 180px;
    padding: 4px 11px;
    border: 1px solid #d9d9d9;
    display: inline-block;
    position: relative;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    background-color: #fff;
  }
  .selected-button {
    width: 40%;
    height: 100%;
    top: 0;
    right: 0;
    line-height: 29px;
    display: inline-block;
    position: absolute;
    text-align: center;
    border-left: 1px solid #d9d9d9;
    color: #b6b6b6;
    cursor: pointer;
    background-color: #f2f2f2;
    &:hover {
      color: #fff;
      background-color: #1890ff;
    }
  }
  .shuttle {
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    &-left {
      width: 55%;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
      margin-right: 5px;
    }
    &-select {
      padding: 0 10px;
      height: 355px;
      overflow: auto;
    }
    &-title,
    &-right_title {
      height: 40px;
      line-height: 20px;
      padding: 10px;
      background-color: #f8f9fa;
      color: #7f7f93;
      font-weight: 600;
      border-bottom: 1px solid #dcdfe6;
      display: flex;
      justify-content: space-between;
    }
    /deep/ .all-select {
      display: block;
      margin: 10px 0 5px;
    }
    /deep/ .user-checkbox {
      width: 100%;
      label {
        width: 100%;
        margin: 5px 0;
      }
    }
    &-right {
      height: 100%;
      width: 45%;
      border: 1px solid #dcdfe6;
      border-radius: 3px;
    }
    &-right_function {
      display: flex;
      span {
        color: rgb(27, 138, 224);
        cursor: pointer;
      }
    }
    &-select_option {
      padding: 5px;
      background: #f8f8f8;
      cursor: pointer;
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  /deep/ .ant-table-thead {
    background-color: #f5f7fa !important;
  }
  /deep/ .table-row__striped {
    background-color: #fafafa;
  }
</style>
