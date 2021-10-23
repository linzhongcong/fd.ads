<!--
 * @Author: your name
 * @Date: 2021-09-18 13:19:54
 * @LastEditTime: 2021-10-15 17:50:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oa-refactor.fandow.come:\my_work\ads.fandow.com\components\sales-session-data\sales-session-data.vue
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
      <span style="margin-left: 10px;">{{ title }}</span>
    </header>
    <a-spin :spinning="spinning">
      <div class="title">
        <a-row>
          <a-col>日期：{{ sessionData.dataAt }}</a-col>
        </a-row>
        <a-row>
          <a-col style="margin: 10px 0;">商品：{{ sessionData.goodsName }}</a-col>
        </a-row>
      </div>
      <div class="table-css">
        <a-table
          bordered
          :scroll="scroll"
          :data-source="dataSource"
          :columns="columns"
          :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
          :pagination="false"
        >
          <template slot="money" slot-scope="text, record">
            <editable-cell v-if="canEdit" :text="text" @change="onCellChange(record, $event)" />
            <span v-else>{{ record.paySum }}</span>
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
  import EditableCell from './edit-table-cell.vue'
  import { tableData } from '@/pages/property/promote-data/components/data.js'
  import { strPointTwo } from '@/utils/utils.js'
  export default {
    props: ['sessionData', 'canEdit'],
    data() {
      return {
        // 提交按钮loading
        subLoading: false,
        // 编辑的数据数组
        editDataList: [],
        // 表格初始化数据
        dataSource: [],
        title: '',
        scroll: {
          y: 700,
        },
        spinning: false,
        columns: [
          {
            title: '时段',
            width: 120,
            dataIndex: 'period',
            key: 'period',
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '支付金额',
            width: 120,
            dataIndex: 'paySum',
            key: 'paySum',
            scopedSlots: { customRender: 'money' },
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
        ],
      }
    },
    components: {
      EditableCell,
    },
    computed: {
      ...mapState(['app']),
      visible: {
        get() {
          return this.app.drawerVisible.salesSessionData
        },
      },
    },
    watch: {
      visible(val) {
        if (val) {
          let tableDataCopy = JSON.parse(JSON.stringify(tableData))
          this.sessionData.tableData.forEach((item) => {
            tableDataCopy.forEach((child) => {
              if (item.period === Number(child.period)) child.paySum = strPointTwo(item.paySum)
            })
          })
          this.dataSource = tableDataCopy
        } else {
          this.editDataList = []
          this.$nextTick(() => {
            this.dataSource = []
            this.subLoading = false
          })
        }
      },
    },

    mounted() {
      // 在页面初始化的时候调用事件，去判断该如何展示
      const clientHeight = document.body.clientHeight
      this.scroll.y = clientHeight - 250
    },

    methods: {
      ...mapMutations({ setDrwaerVisible: 'app/setDrwaerVisible' }),

      // 表格-金额编辑
      onCellChange(record, value) {
        record.paySum = Number(value)
        let hasExists = this.editDataList.some((item) => item.key === record.key)
        let hasChange = this.editDataList.some(
          (item) => item.key === record.key && item.paySum !== record.paySum
        )
        if (hasChange) {
          this.editDataList.forEach((item) => {
            if (item.key === record.key) item.paySum = record.paySum
          })
        } else if (!hasExists) {
          this.editDataList.push(record)
        }
      },

      // 编辑提交
      handleSubmit() {
        this.subLoading = true
        this.$emit('subSure', this.editDataList)
      },

      // 抽屉展示
      showDrawer({ title, statu, data }) {
        this.setDrwaerVisible({ visible: true, name: 'salesSessionData' })
        this.title = title
        this.statu = statu
      },

      // 关闭抽屉
      onClose() {
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
    text-align: right;
    margin-top: 10px;
  }
  /deep/.ant-drawer-body {
    margin: 0 20px;
  }
  /deep/.ant-table-tbody > tr > td {
    padding: 5px 16px;
  }
  /deep/ .table-row__striped {
    background-color: #fafafa;
  }
</style>
