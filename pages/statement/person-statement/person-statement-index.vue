<!--
 * @Author: huangjianhan
 * @Date: 2021-03-20 14:38:49
 * @LastEditTime: 2021-04-06 16:37:39
 * @LastEditors: Please set LastEditors
 * @Description: 人员报表
 * @FilePath: \ads.fandow.com\pages\statement\person-statement\person-statement-index.vue
-->
<template>
  <div class="person">
    <personHeader @dataChange="setSearchTime"></personHeader>
    <div class="person-content">
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
        :columns="tableColumns"
        :rowKey="(record) => record.key"
        :data-source="dataSource"
        :pagination="pagination"
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
        size="small"
        bordered
        @change="changePage"
      >
        <template slot="operate" slot-scope="text, record">
          <a @click="openDetail(record)">详情</a>
        </template>
      </a-table>
    </div>
    <DetailDialog ref="personDetail"/>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { SERVER_BASE_URL } from '~/api/config'
import personHeader from './component/header'
import DetailDialog from './component/detail-dialog'
import { debounce } from '~/utils/utils'
import { tableColumns } from './person'

export default {
  components: {
    personHeader,
    DetailDialog,
  },

  data() {
    this.getList = debounce(this.getList, 500)
    return {
      // 搜索栏参数
      filterForm: {
        timeStart: null,
        timeEnd: null,
        usernameList: []
      },
      // 表格loading
      tableLoading: false,
      exportLoading: false,
      // 表格数据
      dataSource: [],
      // 表格列
      tableColumns,
      // 传递的用户详情数据
      passUserMessage: {},
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
  
  mounted() {
    this.getList()
  },

  methods: {      
    // 列表查询
    getList() {
      this.tableLoading = true
      this.$API
        .reportPerson(this.paramsReturn())
        .then(({code, data}) => {
          if(code === 0) {
            for(let key in data.list) {
              data.list[key].key = data.list[key].username
            }
            this.pagination.total = data.pageCount
            return
          }
        })
        .finally(() => {})
      setTimeout(() => this.tableLoading = false, 500)
    },

    // 子组件传递回来的触发函数
    setSearchTime(value) {
      // 判断返回过来的选择人员数据是否为空
      let username = value.usernameList || false
      // 数据结构赋值
      this.filterForm = {...value}
     const keyArr = this.filterForm.usernameList.map(({key}) => key).join(',')
      // 接口人员字段数据类型为字符串
      this.filterForm.usernameList = username ? keyArr : ''
      this.getList()
    },

    // 导出功能
    handleExportClick() {
      const params = []
      const accessToken = Cookies.get('authorization') || ''
      this.exportLoading = true
      for (const [key, value] of Object.entries(this.filterForm)) {
        value && params.push(`${key}=${value}`)
      }
      window.location.href = `${SERVER_BASE_URL}/report/person/excel/export/${accessToken}?${params.join(
        '&'
      )}`
      setTimeout(() => {
        this.exportLoading = false
      }, 500)
    },

    // 改变分页器的参数
    changePage(page) {
      this.pagination.current = page.current
      this.pagination.pageSize = page.pageSize
      this.getList()
    },

    // 开启详情弹框
    openDetail(record) {
      let requestParams = this.paramsReturn()
      this.passUserMessage = {...record, ...requestParams}
      this.$refs.personDetail.onOpen(this.passUserMessage)
    },

    // 返回对应的查询字段值 && 分页数据
    paramsReturn() {
      return {
        ...this.filterForm,
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize,
      }
    },
  }
}
</script>

<style lang="less" scoped>
  @import '~/assets/css/common.less';

  .person {
    min-height: calc(100vh - 64px);
    width: calc(100vw - 160px);
    overflow-y: auto;
    background-color: #eef0f3;
    &-content {
      margin: 16px;
      background-color: #fff;
      border-radius: 4px;
      padding: 16px 24px;
    }
    
    .content {
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
      &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
    }
  }
</style>
