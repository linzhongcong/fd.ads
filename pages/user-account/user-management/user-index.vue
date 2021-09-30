<!--
  当前只做头条的功能
  广点通及快手不处理
 -->
<template>
  <div class="user-content">
    <a-row class="user-detail">
      <a-col span="4" class="detail detail-dept">
        <div class="detail-header">
          <span>部门</span>
          <span>
            <a-icon @click="initData('spin')" type="sync" :spin="isSpin" />
          </span>
        </div>
        <div
          v-for="(item, key) in navDeptArray"
          class="detail-children"
          :class="item.checked ? 'detail-activate' : ''"
          :key="key"
          @click="changeChecked(item)"
        >
          <span v-text="item.deptname">-</span>
          (
          <span v-text="item.member">-</span>
          )
        </div>
      </a-col>
      <a-col span="20" class="detail-desc">
        <div class="desc">
          <div class="desc-search">
            <div class="desc-element">
              <a-icon class="desc-filter_icon" type="filter" />
              <span>筛选</span>
            </div>
            <div class="desc-element desc-condition">
              <a-input-search
                placeholder="请输入工号或姓名搜索"
                style="width: 90%;"
                @search="searchEmployeeData"
                v-model="employeeKey"
              />
            </div>
          </div>
          <div class="desc-show_data">
            <div class="desc-table_content" style="padding: 15px">
              <a-table
                size="small"
                :columns="descColumns"
                :data-source="descResultData"
                :pagination="pagination"
                :scroll="{ y: 600 }"
                :loading="spinObj.dataSpin"
                :reflush="reflush"
                :rowKey="(record) => record.key"
                :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
                @change="changePage"
                bordered
                class="desc-show_table"
              >
                <template slot="browse" slot-scope="text, record, index">
                  <a @click="browseDetail(record)">查看</a>
                </template>
              </a-table>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- 投放广告详情 -->
    <a-drawer :mask="false" :width="700" :closable="false" :visible="visible" @close="onClose">
      <header slot="title">
        <a-icon type="close" :size="20" class="icon-cursor close-icon" @click="onClose" />
        <span style="margin-left:10px">{{ advertising.userName + '关联的广告投放账号' }}</span>
      </header>
      <a-radio-group v-model="advertising.activeStatu" style="margin-bottom: 16px">
        <a-radio-button
          :key="key"
          v-for="(item, key) in advertising.platformType"
          :value="item.value"
          @click="listenChange(item.value)"
          :disabled="item.label !== '头条' ? 'disabled' : false"
        >
          {{ item.label }}({{ item.dataMessage }})
        </a-radio-button>
      </a-radio-group>

      <a-row style="margin-top:30px">
        <a-col><h3>当前负责账户</h3></a-col>
      </a-row>
      <a-table
        :columns="advertising.tableColumns"
        :data-source="advertising.tableData"
        :pagination="false"
        :loading="spinObj.advertisingDrawer"
        bordered
      />
      <a-row style="margin-top:30px">
        <a-col><h3>历史负责账户</h3></a-col>
      </a-row>
      <a-table
        :columns="advertising.historyTableColumns"
        :data-source="advertising.historyTableData"
        :pagination="false"
        :loading="spinObj.advertisingDrawer"
        bordered
      >
        <template slot="time" slot-scope="text, record">
          <p>{{ record.enableAt }}</p>
          <p>{{ record.disableAt }}</p>
        </template>
      </a-table>
    </a-drawer>
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'

  export default {
    name: 'user-index',
    components: {},
    data() {
      return {
        isSpin: false,
        reflush: true,
        collapsed: false,
        // 数据加载
        spinObj: {
          dataSpin: false,
          advertisingDrawer: false,
        },
        descColumns: [
          // 用户账号表头
          {
            title: '工号',
            dataIndex: 'jobNum',
            key: 'jobNum',
            customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
          },
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
          },
          {
            title: '关联的广告投放账号',
            dataIndex: 'id',
            key: 'id',
            scopedSlots: { customRender: 'browse' },
            customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
          },
        ],
        // 账号表格数据
        descResultData: [],
        // 广告投放账号详情数据
        advertising: {
          userName: '',
          platformType: [
            { label: '头条', value: '头条', dataMessage: 0 },
            { label: '广点通', value: '广点通', dataMessage: 0 },
            { label: '快手', value: '快手', dataMessage: 0 },
          ],
          activeStatu: '头条',
          tableColumns: [],
          tableData: [],
          historyTableColumns: [],
          historyTableData: [],
          correspondingData: { 头条: 'headLine', 广点通: 'dc', 快手: 'ks' },
          headLine: [
            { title: '广告投放账号名称', dataIndex: 'advertiserName', key: 'advertiserName' },
            { title: '账号ID', dataIndex: 'advertiserId', key: 'id' },
            { title: '开始使用时间', dataIndex: 'enableAt', key: 'enableAt' },
          ],
          historyHeadLine: [
            { title: '广告投放账号名称', dataIndex: 'advertiserName', key: 'advertiserName' },
            { title: '账号ID', dataIndex: 'advertiserId', key: 'id' },
            {
              title: '开始-结束',
              dataIndex: 'time',
              key: 'time',
              scopedSlots: { customRender: 'time' },
            },
          ],
          dc: [
            { title: '账号ID', dataIndex: 'advertiserId' },
            { title: '公司名称', dataIndex: 'company' },
          ],
          ks: [
            { title: '广告投放账号ID', dataIndex: 'advertisingUser' },
            { title: '公司名称', dataIndex: 'company' },
            { title: '快手账户', dataIndex: 'ksUser' },
          ],
        },
        childrenDrawer: false,

        // 分页数据
        pagination: {
          size: 'small',
          total: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `共 ${total} 条`,
        },

        employeeKey: '',
        // 左边部门导航栏数据
        navDeptArray: [],
        checkedRowsObject: {}, // 部门选中显示数组
        setTimeOutObj: null,
      }
    },

    computed: {
      ...mapState(['app']),
      visible: {
        get() {
          return this.app.drawerVisible.userAccountView
        },
      },
    },

    mounted() {
      this.initData()
    },

    methods: {
      ...mapMutations({
        setDrwaerVisible: 'app/setDrwaerVisible',
      }),

      // 页面初始化数据
      initData() {
        this.isSpin = true
        this.advertising.tableColumns = this.advertising['headLine']
        this.advertising.historyTableColumns = this.advertising['historyHeadLine']
        this.$API
          .getDeptData()
          .then((res) => {
            if (res.code === 0) {
              this.$message.success('更新完毕')
              let requestData = res.data[0].children
              for (let item in requestData) {
                requestData[item].checked = false
                if (Number(item) === 0) {
                  requestData[item].checked = true
                }
              }
              this.navDeptArray = requestData
              this.checkedRowsObject = this.navDeptArray[0]
              this.searchTableData(this.navDeptArray[0])
            }
          })
          .finally(() => {
            this.isSpin = false
          })
      },

      // 查看详情
      browseDetail(params) {
        this.setDrwaerVisible({ name: 'userAccountView', visible: true })
        this.advertising.userName = params.name
        this.spinObj.advertisingDrawer = true
        this.$API
          .getEmployeeRelevance(params.jobNum)
          .then(({ code, data }) => {
            if (code === 0) {
              this.advertising.tableData = data.currentAdvertiserList.map(
                ({ advertiserId, ...item }) => ({ key: advertiserId, advertiserId, ...item })
              )
              this.advertising.historyTableData = data.historyAdvertiserList.map(
                ({ advertiserId, ...item }) => ({ key: advertiserId, advertiserId, ...item })
              )
              this.advertising.platformType[0].dataMessage = data.currentAdvertiserList.length
            }
          })
          .finally(() => {
            this.spinObj.advertisingDrawer = false
          })
      },

      onClose() {
        this.setDrwaerVisible({ name: 'userAccountView', visible: false })
      },

      showChildrenDrawer() {
        this.childrenDrawer = true
      },

      onChildrenDrawerClose() {
        this.childrenDrawer = false
      },

      searchEmployeeData() {
        // 搜索栏搜索对应表格数据
        if (this.setTimeOutObj !== null) {
          clearTimeout(this.setTimeOutObj)
          this.setTimeOutObj = setTimeout(() => {
            this.searchTableData(this.checkedRowsObject, {})
            // 访问后进行对象销毁 给下一次的首次进行查询
            this.setTimeOutObj = null
          }, 1000)
          return
        }
        // 首次访问
        this.setTimeOutObj = {}
        this.searchTableData(this.checkedRowsObject, {})
      },

      listenChange(statu) {
        // 监听按钮点击某个状态请求指定数据
        if (statu === this.advertising.activeStatu) return false
        let statuVal = this.advertising.correspondingData[statu]
        this.advertising.tableColumns = this.advertising[statuVal]
        this.advertising.tableData = []
      },

      changePage(page) {
        this.searchTableData(this.checkedRowsObject, page)
      },

      changeChecked(parmas) {
        this.setDrwaerVisible({ name: 'userAccountView', visible: false })
        // 选中指定部门 显示部门对应信息
        for (let item in this.navDeptArray) {
          this.navDeptArray[item].checked = false
        }
        this.checkedRowsObject = parmas
        parmas.checked = true
        this.reflush = !this.reflush
        this.searchTableData(parmas)
      },

      searchTableData(parmas, pageObj) {
        let currentPage = pageObj ? pageObj.current : 1
        let pageSize = pageObj ? pageObj.pageSize : this.pagination.defaultPageSize
        let requestObj = {
          deptId: parmas.id,
          page: currentPage,
          name: this.employeeKey,
          perPage: pageSize,
        }
        // 搜索指定部门对应的信息
        this.spinObj.dataSpin = true
        this.$API
          .getDeptEmployeeData(requestObj)
          .then((res) => {
            if (res.code === 0) {
              let data = res.data
              this.descResultData = data.list.map((item) => ({ ...item, key: item.id }))
              this.pagination.total = data.count
            }
          })
          .finally(() => {
            this.spinObj.dataSpin = false
          })
      },
    },
  }
</script>

<style lang="less" scoped>
  .user-content {
    height: calc(100vh - 64px);
    padding: 16px;
    background-color: #eef0f3;
    .user-detail {
      width: 100%;
      height: calc(100vh - 97px);
      background: #f5f7f9;
    }
    .detail-dept {
      border-right: 1px solid #e8e9ef;
      background: #fff;
      overflow-x: hidden;
      overflow-y: auto;
      position: relative;
    }
    .detail-desc {
      position: relative;
      background: transparent;
    }
    .detail-dept,
    .detail-desc {
      height: 100%;
    }
    .detail {
      &-header {
        background-color: #fff;
        position: sticky;
        top: 0;
        z-index: 10;
        display: flex;
        justify-content: space-between;
      }
      &-header,
      &-children {
        font-weight: 500;
        font-size: 14px;
        padding: 15px;
      }
      &-children {
        padding: 10px 15px;
        cursor: pointer;
      }
      &-activate {
        background-color: #e6f7ff;
        color: #1890ff;
        position: relative;
      }
      &-activate:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 3px;
        height: 100%;
        background-color: #3989fa;
      }
      &-spin_style {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.7);
      }
    }
    .desc {
      width: 100%;
      height: 100%;
      padding: 0 0 0 15px;
      overflow-x: hidden;
      overflow-y: auto;
      &-filter_icon {
        color: #c5c5c5;
      }
      &-search {
        height: 60px;
        display: flex;
        align-items: center;
        margin: 0 0 15px;
        padding: 0 0 0 18px;
        border-left: 1px solid #e8e9ef;
        border-bottom: 1px solid #e8e9ef;
        background: #fff;
        box-shadow: 0 1px 5px #e8e9ef;
      }
      &-element {
        margin: 0 16px 0 0;
      }
      &-condition {
        min-width: 240px;
      }
      &-show_data {
        width: 100%;
        height: 90%;
        align-items: center;
      }
      &-table_content {
        background-color: #fff;
      }
      &-paging {
        margin: 20px 10px 0;
        padding: 0 0 20px;
        text-align: right;
      }
    }
    .loading-z_index {
      z-index: 12;
    }
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    background: #2d8cf0;
    color: #fff;
  }
  .ant-radio-button-wrapper {
    width: 100px;
    text-align: center;
  }
  @import '~/assets/css/common.less';
  @import '~/assets/css/close.less';
</style>
<style lang="less">
  .user-content {
    .ant-table-pagination.ant-pagination {
      margin: 16px 22px;
    }
  }
</style>
