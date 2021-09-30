<!--
 * @Author: lizheng
 * @Date: 2021-01-13 11:37:07
 * @LastEditTime: 2021-06-07 18:38:56
 * @LastEditors: Please set LastEditors
 * @Description: Tab栏 - 广告组
 * @FilePath: \ads\pages\promotion\component\promotion-tabs-item.vue
-->
<template>
  <div class="promotion-card">
    <div class="promotion-campaign">
      <div class="promotion-campaign-header">
        <div>
          <a-button type="primary" icon="plus" @click="handleAddPlanClick">新建组</a-button>
          <a-button type="danger" icon="delete" disabled>删除</a-button>
        </div>
        <div>
          <a-popover :visible="customColumnVisible" trigger="click" placement="bottomRight">
            <div slot="title" class="custom-column-header">
              <span class="text">常用自定义列</span>
              <a-button type="link" @click="handleOpenModal('modal')">自定义</a-button>
            </div>
            <div class="custom-column-wrap" slot="content">
              <div v-if="customColumnsKeys && customColumnsKeys.length">
                <div class="custom-column" v-for="item in customColumnsKeys" :key="item.name">
                  <a-button type="link">{{ item.name }}</a-button>
                  <div class="icon-wrap">
                    <a-icon class="icon-cursor" type="edit" />
                    <a-icon class="icon-cursor" type="delete" />
                  </div>
                </div>
              </div>
              <a-empty v-else />
            </div>
            <a-button
              class="promotion-custom_button"
              icon="unordered-list"
              @click="handleOpenModal"
            >
              自定义列
            </a-button>
          </a-popover>
        </div>
      </div>
      <a-table
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :scroll="{ x: 1200, y: 515 }"
        :columns="AdGroupcolumns"
        :data-source="tableData"
        :loading="tableLoading"
        :pagination="pagination"
        :components="components"
        size="small"
        bordered
        @change="changePage"
      >
        <!-- 开关 -->
        <template slot="adStatus" slot-scope="text, record">
          <a-switch disabled size="small" :defaultChecked="text === 'CAMPAIGN_STATUS_ENABLE'" />
          <!-- @change="(checked) => changeSwitch(checked, record)" -->
        </template>

        <!-- 广告组名称 -->
        <template slot="name" slot-scope="name, record, index">
          <div class="ad-name-cell">
            <a-form-model v-if="record.isShowEditInput" :model="form">
              <a-form-model-item
                style="margin:0"
                prop="name"
                :rules="{ required: true, message: '必填项不能为空', trigger: true }"
              >
                <a-input
                  allow-clear
                  auto-focus
                  v-model="form.name"
                  @blur="updateAdGroupName(record, index)"
                />
              </a-form-model-item>
            </a-form-model>

            <div v-else>
              <a-button type="link" @click="changeToPlanTab(record)">
                <span class="cell-ellipsis">{{ name }}</span>
              </a-button>
              <a-icon
                type="edit"
                class="icon"
                v-show="record.isShowEditIcon"
                @click="
                  () => {
                    form.name = name
                    record.isShowEditInput = true
                  }
                "
              />
            </div>
          </div>
        </template>

        <!-- 计划预算 -->
        <template slot="budget" slot-scope="budget, record, index">
          <div class="ad-budget-cell">
            <div class="ad-name-left" v-if="false">
              <a-icon type="edit" class="icon-edit" @click="handleOpenBudgetModal(record)" />
              <a-icon type="clock-circle" class="icon-clock" />
            </div>
            <div class="cell-wrap-right">
              <span class="count">{{ budget ? budget : '--' }}</span>
              <span class="text">
                {{ record.budgetMode ? BUDGET_TYPE[record.budgetMode] : '--' }}
              </span>
            </div>
          </div>
        </template>

        <!-- 操作 -->
        <template slot="operate" slot-scope="text, record, index">
          <a-button type="link" class="no-margin-padding" @click="showDrawer(record)">
            详情
          </a-button>
          <a-button disabled type="link" class="no-margin-padding">编辑</a-button>
          <a-button disabled type="link" class="no-margin-padding">数据</a-button>
        </template>

        <!-- 广告组状态 -->
        <template slot="status" slot-scope="status">
          <div>
            <span
              :class="[
                'cell-status-label',
                status !== 'CAMPAIGN_STATUS_DISABLE' ? 'cell-status-label-active' : '',
              ]"
            />
            <span>{{ ADGROUP_STATUS[status] }}</span>
          </div>
        </template>
      </a-table>
    </div>

    <!-- 广告组详情 -->
    <promotion-tabs-details ref="adGroupDetail" @close="closeDrawer" />

    <!-- 自定义列 -->
    <custom-column-modal ref="customColumn" :data="data" @onClose="getCustomColumnsKeys" />
  </div>
</template>

<script>
  import Vue from 'vue'
  import PromotionTabsDetails from './promotion-tabs-details'
  import CustomColumnModal from '~/components/custom-column-modal'
  import { AdGroupcolumns, ADGROUP_STATUS, BUDGET_TYPE } from '../contant'
  import { mapState, mapMutations } from 'vuex'
  import { resizeableTitle } from '~/utils/utils'

  export default {
    components: {
      PromotionTabsDetails,
      CustomColumnModal,
    },

    props: {
      tabKey: {
        type: String,
        default: 'ad',
      },
    },

    data() {
      this.components = {
        header: {
          cell: (h, props, children) => resizeableTitle(h, props, children, AdGroupcolumns, Vue),
        },
      }
      return {
        BUDGET_TYPE, //预算类型
        ADGROUP_STATUS, // 广告组状态
        data: [],
        tableData: [],
        AdGroupcolumns,
        tableLoading: false,
        // tableComponents: { header: { cell: ResizeableTitle } },

        isOpenModal: false,
        customColumnVisible: false, // 自定义列 popover
        pagination: {
          size: 'small',
          total: 0,
          showSizeChanger: true,
          showQuickJumper: true,
          defaultPageSize: 10,
          current: 1,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `共 ${total} 条`,
        },
        selectedRowKeys: [],
        isShowEditIcon: false,
        form: {},
        detailVisible: false,
        customColumnsKeys: [],

        // 详情
        detailData: {},
        ideaVideoData: {},
        spinning: false,
      }
    },

    computed: {
      ...mapState(['promotion']),

      // 广告投放账号ID
      advertiserId() {
        return this.$store.getters['promotion/advertiserId']
      },
    },

    watch: {
      // 监听广告投放账号ID发生变化则请求表格数据
      // index.vue => promotion-tabs.vue =>  promotion-tabs-ad.vue
      advertiserId: {
        handler(nVal) {
          nVal && this.tabKey === 'ad' && this.getAdGroupList('init')
        },
      },

      // 监听全局的条件筛选表单则请求表格数据
      // index.vue => store(promotion) =>  promotion-tabs-ad.vue
      'promotion.filterForm': {
        deep: true,
        handler(newForm) {
          newForm && this.tabKey === 'ad' && this.getAdGroupList('init', newForm)
        },
      },

      // 监听Tab切换
      tabKey: {
        immediate: true,
        handler(nVal) {
          if (nVal && nVal === 'ad' && this.advertiserId) {
            this.getAdGroupList('init')
          }
        },
      },
    },

    methods: {
      ...mapMutations({ settingDrawerVisible: 'promotion/settingDrawerVisible' }),

      // 打开广告组详情的右侧抽屉
      showDrawer(data) {
        this.customColumnVisible = false
        if (!data.advertiserId) return this.$message.error('广告投放账号id不能为空!')
        if (!data.id) return this.$message.error('广告组id不能为空!')
        this.$refs.adGroupDetail.getAdGroupItemDetail(data.advertiserId, data.id)
        this.$refs.adGroupDetail.getAdGroupVideoListDetail(data.advertiserId, data.id)
      },

      // 关闭右侧详情抽屉
      closeDrawer() {
        this.settingDrawerVisible(false)
      },

      handleAddPlanClick() {
        window.open('/create-ad-group', '_blank')
      },

      // 切换tab栏
      changeToPlanTab(record) {
        this.$emit('change-tab', 'plan', record)
      },

      // 各种弹窗
      handleOpenModal(type) {
        type === 'modal' && this.$refs.customColumn.openModal({ visible: true })
        this.customColumnVisible = !this.customColumnVisible
      },

      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },

      // 自定义列
      getCustomColumnsKeys(isCustomColumnKeys) {
        this.customColumnsKeys = JSON.parse(localStorage.getItem('customColumnsKeys'))
        if (isCustomColumnKeys) {
        }
      },

      // 修改广告组名称
      updateAdGroupName(record, index) {
        this.tableData[index].isShowEditInput = false
        this.form = {}
      },

      // 更改某条广告组的状态
      changeSwitch(checked, record) {
        const params = {
          optStatus: checked ? 'enable' : 'disable',
          advertiserId: record.advertiserId,
          campaignId: record.id,
        }
        this.putAdGroupItemStatus(params)
      },

      // 改变分页器的参数
      changePage(page) {
        this.pagination.current = page.current
        this.pagination.pageSize = page.pageSize
        this.tableData = []
        this.getAdGroupList()
      },

      // 启用或停用广告组
      putAdGroupItemStatus(params) {
        this.$API
          .putPromotionAdGroupItem(params)
          .then(({ code }) => {
            if (code === 0) {
              this.$message.success('更新广告组状态成功！')
              this.getAdGroupList()
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },

      // 初始化数据
      getAdGroupList(type, filterForm = this.promotion.filterForm) {
        type === 'init' && (this.pagination.current = 1) && (this.pagination.pageSize = 10)
        const { pageSize, current: pageIndex } = this.pagination
        const params = { pageSize, pageIndex, advertiserId: this.advertiserId, ...filterForm }
        const startDateTimeStamp = new Date(params.startDate).getTime()
        const endDateTimeStamp = new Date(params.endDate).getTime()

        if (endDateTimeStamp - startDateTimeStamp > 30 * 24 * 60 * 60 * 1000)
          return this.$message.error('查询数据的时间跨度不得超过30天！')
        for (const [key, value] of Object.entries(params)) !value && delete params[key]

        this.getCustomColumnsKeys()
        this.tableLoading = true
        this.$API
          .getPromotionAdGroupList(params)
          .then(({ code, data: { count, list } }) => {
            this.tableLoading = false
            if (code === 0) {
              this.tableData = list.map((item, key) => ({
                ...item,
                key,
                isShowEditIcon: false,
                isShowEditInput: false,
              }))
              this.pagination.total = Number(count)
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
  @import '../promotion.less';
  @import '~/assets/css/common.less';
</style>
