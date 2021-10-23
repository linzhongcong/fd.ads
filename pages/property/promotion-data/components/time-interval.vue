<!--
 * @Author: xieguiting
 * @Date: 2021-09-28 17:16:50
 * @LastEditTime: 2021-09-29 16:05:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads.fandow.com\pages\property\promotion-data\time-interval.vue
-->
<template>
  <a-drawer
    :width="660"
    :maskClosable="false"
    :closable="false"
    :visible="visible"
    @close="onClose"
  >
    <header slot="title">
      <a-icon type="close" :size="20" class="icon-cursor close-icon" @click="onClose" />
      <span class="margin-left-10">{{ title }}</span>
    </header>
    <a-spin :spinning="spinning">
      <div class="title">
        <a-row>
          <a-col>计划id：{{ pageObj.adId }}</a-col>
        </a-row>
        <a-row>
          <a-col style="margin: 10px 0;">日期：{{ pageObj.statDatetime }}</a-col>
        </a-row>
      </div>
      <div class="table-css">
        <a-table
          bordered
          :row-key="(record) => record.hour"
          :data-source="dataSource"
          :columns="columns"
          :pagination="false"
          :scroll="scroll"
          :row-class-name="(record, index) => (index % 2 === 1 ? '' : 'table-row__striped')"
        >
          <template slot="cost" slot-scope="text, record">
            <editTable-cell v-if="canEdit" :text="text" @change="onCellChange(record, $event)" />
            <span v-else>{{ record.cost }}</span>
          </template>
        </a-table>
      </div>
      <div class="btn-css" v-if="canEdit">
        <a-button type="primary" @click="handleSubmit" :loading="subLoading">
          提交
        </a-button>
        <a-button class="margin-left-10" type="default" @click="onClose">
          取消
        </a-button>
      </div>
      <div v-else class="btn-css">
        <a-button class="margin-left-10" type="primary" @click="onClose">
          确认
        </a-button>
      </div>
    </a-spin>
  </a-drawer>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  import editTableCell from './edit-table-cell.vue'
  export default {
    props: {
      canEdit: {
        type: Boolean,
        default: () => {
          return true
        },
      },
    },
    data() {
      return {
        spinning: false,
        // 提交按钮loading
        subLoading: false,
        // 编辑的数据数组
        editDataList: [],
        // 表格初始化数据
        dataSource: [],
        // 页面数据
        pageObj: {},
        title: '时段数据',
        scroll: {
          y: 700,
        },
        columns: [
          {
            title: '时段',
            width: 120,
            dataIndex: 'hour',
            key: 'hour',
            customHeaderCell: () => ({ style: { height: '50px', background: '#fff' } }),
          },
          {
            title: '消耗',
            width: 120,
            dataIndex: 'cost',
            key: 'cost',
            scopedSlots: { customRender: 'cost' },
            customHeaderCell: () => ({ style: { height: '50px', background: '#fff' } }),
          },
          {
            title: '成交',
            width: 120,
            dataIndex: 'totalDeal',
            key: 'totalDeal',
            customHeaderCell: () => ({ style: { height: '50px', background: '#fff'} }),
          },
        ],
      }
    },
    components: {
      editTableCell,
    },
    computed: {
      ...mapState(['app']),
      visible: {
        get() {
          return this.app.drawerVisible.salesSessionData
        },
      },
    },
    mounted() {
      // 在页面初始化的时候调用事件，去判断该如何展示
      const clientHeight = document.body.clientHeight
      this.scroll.y = clientHeight - 250
    },

    methods: {
      ...mapMutations({ setDrwaerVisible: 'app/setDrwaerVisible' }),
      // 表格-消耗编辑
      onCellChange(record, value) {
        const dataSource = [...this.dataSource]
        let target  = dataSource.find(item => item.hour === record.hour)
        if (target) {
          target['cost'] = +value
          this.dataSource = dataSource
        }
      },

      // 编辑提交
      handleSubmit() {
        this.subLoading = true
        let params = { ...this.pageObj, hourDataList: this.dataSource }
        this.$API.extendDouyinUpdateHours(params).then(({code}) => {
          if (code === 0) {
            this.$message.success('提交成功')
            this.onClose()
          }
        }).finally(() => {
          this.subLoading = false
        })
      },
      // 抽屉展示
      showDrawer(data) {
        this.pageObj = data
        this.getList()
        this.setDrwaerVisible({ visible: true, name: 'salesSessionData' })
      },
      // 获取时段列表
      getList() {
        this.spinning = true
        this.$API.extendDouyinDayHours(this.pageObj).then(({ code, data }) => {
          if (!code) {
            data.forEach(item => {
              item.hour = item.hour < 10 ? `0${item.hour}` : `${item.hour}`
              item.totalDeal = item.totalDeal === 0 ? `${item.totalDeal}.00` : `${item.totalDeal}`
            })
            this.dataSource = data
            this.spinning = false
          }
        })
      },

      // 关闭抽屉
      onClose() {
        this.dataSource = []
        this.setDrwaerVisible({ visible: false, name: 'salesSessionData' })
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~/assets/css/close.less';
  .table-css {
    border-bottom: 1px solid #e8e8e8;
  }
  .btn-css {
    text-align: left;
    margin-top: 10px;
  }
  /deep/.ant-drawer-body {
    margin: 0 20px;
  }
  /deep/.table-row__striped {
    background-color: #fafafa;
  }
  /deep/.ant-table-thead > tr > th, /deep/.ant-table-tbody > tr > td {
    padding: 4px 8px;
  }
</style>
