<!--
 * @Author: xieguiting
 * @Date: 2021-09-15 10:32:50
 * @LastEditTime: 2021-09-29 16:04:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads.fandow.com\pages\property\promotion-data\promotion-tiktok.vue
-->
<template>
  <div>
    <accountSynchronization />
    <a-tabs default-active-key="ad"
            @change="onChangeTabs"
            type="card"
            class="default">
      <a-tab-pane key="ad"
                  tab="广告计划">
        <a-table bordered
                 class="statistics-table"
                 size="small"
                 :loading="tableLoading"
                 :row-key="(record) => record.id"
                 :columns="tiktokEnormousColumns"
                 :data-source="tiktokData"
                 :row-selection="{ selectedRowKeys, onChange: handleSelectChange }"
                 :pagination="pagination"
                 :scroll="{ x: 700, y: 520 }"
                 tableLayout="fixed"
                 :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
                 @change="changePage">
          <template slot="cost"
                    slot-scope="text, record">
            {{ text ? text : '0.00' }}
          </template>
          <template slot="totalDeal"
                    slot-scope="text">
            {{ text ? text : '0.00'}}
          </template>
          <template slot="operate"
                    slot-scope="text, record">
            <a @click="handleOpenSetup('manualSetup', record)">计划设置</a>
            <a @click="onDelete(record)">删除</a>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="day"
                  tab="每日数据">
        <a-table bordered
                 class="statistics-table"
                 size="small"
                 :loading="tableLoading"
                 :row-key="(record) => record.id"
                 :columns="tiktokEnormousDayColumns"
                 :data-source="tiktokData"
                 :row-selection="{ selectedRowKeys, onChange: handleSelectChange }"
                 :pagination="pagination"
                 :scroll="{ x: 700, y: 520 }"
                 :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
                 @change="changePage">
          <template slot="cost"
                    slot-scope="text, record">
            {{ text ? text : '0.00' }}
          </template>
          <template slot="totalDeal"
                    slot-scope="text">
            {{ text ? text : '0.00'}}
          </template>
          <template slot="operate"
                    slot-scope="text, record">
            <a @click="handleTimeClick('timeInterval', record)">时段数据</a>
            <a @click="onDelete(record, false)">删除</a>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
    <manual-setup ref="manualSetup"
                  @onSave="onSave" />
    <import-modal ref="importModal" />
    <time-interval ref="timeInterval" />
  </div>
</template>

<script>
// 抖音巨量表头
import { tiktokEnormousColumns, tiktokEnormousDayColumns } from './js/columns'
import manualSetup from './manual-setup'
import importModal from './import-data'
import timeInterval from './time-interval'
import accountSynchronization from './tiktok-list-account-synchronization'
export default {
  components: {
    manualSetup,
    importModal,
    timeInterval,
    accountSynchronization
  },
  data () {
    return {
      tableLoading: false,
      tiktokEnormousColumns,
      tiktokEnormousDayColumns,
      tiktokData: [],
      selectedRowKeys: [],
      tabKey: 'ad',
      timeData: [],
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
  mounted () {
    this.getInitData('init')
  },
  methods: {
    // tabs切换
    onChangeTabs (key) {
      this.tiktokData = []
      this.tabKey = key
      this.getInitData('init')
    },
    // 获取数据
    getInitData (type = '', data = {}) {
      if (type === 'init') {
        this.pagination.current = 1
        this.pagination.pageSize = 10
      }
      let apiMap = {
        ad: 'extendDouyinAdPageSearch',
        day: 'extendDouyinDayPageSearch',
      }

      this.tableLoading = true
      this.$API[apiMap[this.tabKey]]({
        ...data,
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize,
      }).then(({ code, data: { list, count }, message }) => {
        if (code) return this.$message.warn(message)
        this.tiktokData = list;
        this.pagination.total = count
      }).finally(() => {
        this.tableLoading = false
      })
    },
    onSave (type) {
      this.getInitData(type)
    },
    // 复选框
    handleSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    // 改变分页器的参数
    changePage (page) {
      this.pagination.current = page.current
      this.pagination.pageSize = page.pageSize
      this.getInitData()
    },
    // 时段设置
    handleTimeClick (name, { adId, statDatetime }) {
      this.$refs[name].showDrawer({ adId, statDatetime })
    },

    // 计划设置
    handleOpenSetup (name, data = {}) {
      let params = {
        title: '计划设置',
        data,
      }
      this.$refs[name].showDrawer(params)
    },
    // 删除
    onDelete ({ id, adId, statDatetime }, type = true) {
      let that = this
      const apiDelMap = {
        ad: 'extendDouyinAdDelete',
        day: 'extendDouyinDayDelete'
      }
      that.$confirm({
        title: (h) => (
          type ?
            <p>确定要删除计划<span style="color:#ff0052;">{adId}</span>以及对应的数据吗？</p> :
            <p>确定要从列表中删除计划<span style="color:#ff0052;">{adId}</span>在<span style="color:#ff0052;">{statDatetime}</span>的数据吗？</p>
        ),
        maskClosable: true,
        onOk () {
          that.tableLoading = true
          that.$API[apiDelMap[that.tabKey]](id).then(({ code, message }) => {
            if (code) return that.$message.warn(message)
            that.$message.success('删除成功')
            that.getInitData('init')
          })
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.look {
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.import {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.default /deep/.ant-tabs-nav-scroll {
  padding-left: 0px !important;
}
</style>
