<!--
 * @Author:lizhneg
 * @Date: 2021-03-18 17:18:47
 * @LastEditTime: 2021-04-06 15:59:42
 * @LastEditors: Please set LastEditors
 * @Description: 查看关联的广告投放账号
 * @FilePath: \ads\pages\user-account\product-management\product-view.vue
-->

<template>
  <!-- 投放广告详情 -->
  <a-drawer :width="700" :closable="false" :mask="false" :visible="visible" @close="onClose">
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
      :loading="tableLoading"
      bordered
    />
    <a-row style="margin-top:30px">
      <a-col><h3>历史负责账户</h3></a-col>
    </a-row>
    <a-table
      :columns="advertising.historyTableColumns"
      :data-source="advertising.historyTableData"
      :pagination="false"
      :loading="tableLoading"
      bordered
    >
      <template slot="time" slot-scope="text, record">
        <p>{{ record.enableAt }}</p>
        <p>{{ record.disableAt }}</p>
      </template>
    </a-table>
  </a-drawer>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'

  export default {
    data() {
      return {
        form: {},
        tableLoading: false,
        btnLoading: false,
        title: '',
        opType: '',
        id: '',

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
      }
    },

    computed: {
      ...mapState(['app']),
      visible: {
        get() {
          return this.app.drawerVisible.productView
        },
      },
    },

    methods: {
      ...mapMutations({ setDrwaerVisible: 'app/setDrwaerVisible' }),

      // 打开抽屉初始化数据
      showDrawer(data) {
        this.setDrwaerVisible({ visible: true, name: 'productView' })
        this.advertising.tableColumns = this.advertising['headLine']
        this.advertising.historyTableColumns = this.advertising['historyHeadLine']
        this.title = '关联的广告投放账号'
        data.id && this.getDetailData(data.productId)
      },

      onClose() {
        this.setDrwaerVisible({ visible: false, name: 'productView' })
        this.form = {}
      },

      // 编辑情况下获取数据详情
      getDetailData(id) {
        this.$API.getProductRelatedAccount(id).then(({ code, data }) => {
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
      },
    },
  }
</script>

<style lang="less" scoped>
  .loading-wrap {
    display: flex;
    justify-content: center;
    padding-top: 50%;
    position: absolute;
    z-index: 111;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: hsla(0, 0%, 100%, 0.9);
  }
</style>

<style lang="less" scoped>
  @import '~/assets/css/close.less';
</style>
