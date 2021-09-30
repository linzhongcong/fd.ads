<!--
 * @Author: lizheng
 * @Date: 2021-01-13 11:43:22
 * @LastEditTime: 2021-07-22 17:46:46
 * @LastEditors: Please set LastEditors
 * @Description: Tab栏 - 计划
 * @FilePath: \ads\pages\promotion\component\promotion-tabs-plant.vue
-->
<template>
  <div class="promotion-card">
    <div class="promotion-campaign">
      <div class="promotion-campaign-header">
        <div>
          <a-button type="primary" icon="plus" @click="addPlanClick">新建计划</a-button>
          <a-dropdown>
            <a-menu slot="overlay" @click="handleBatchClick">
              <a-menu-item key="tabPlanSetting">成交信息</a-menu-item>
              <a-menu-item key="tabPlanDeal">大投</a-menu-item>
              <a-menu-item key="tabPlanCharge">负责人</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">
              批量操作
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </div>
        <div>
          <a-popover :visible="customColumnVisible" placement="bottomRight">
            <div slot="title" class="custom-column-header">
              <span class="text">常用自定义列</span>
              <a-button type="link" @click="handleOpenModal('modal')">自定义</a-button>
            </div>
            <div slot="content">
              <a-button type="link">000</a-button>
            </div>
            <a-button
              icon="unordered-list"
              class="promotion-custom_button"
              @click="handleOpenModal"
            >
              自定义列
            </a-button>
          </a-popover>
        </div>
      </div>
      <a-table
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        :scroll="{ x: 1200, y: 515 }"
        :columns="columns"
        :data-source="tableData"
        :loading="tableLoading"
        :pagination="pagination"
        :components="components"
        size="small"
        bordered
        @change="changePage"
      >
        <!-- 开关 -->
        <template slot="planStatus" slot-scope="text, record">
          <a-switch disabled size="small" :defaultChecked="text === 'AD_STATUS_ENABLE'" />
          <!-- @change="(checked) => changeSwitch(checked, record)" -->
        </template>

        <!-- 广告计划名称 -->
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
                  @blur="putAdPlanItemName(record, index)"
                />
              </a-form-model-item>
            </a-form-model>

            <div v-else>
              <a-button type="link" @click="changeToPlanTab('idea', record)">
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

        <!-- 广告组名称 -->
        <template slot="campaignName" slot-scope="campaignName, record, index">
          <div class="ad-name-cell" :title="campaignName">
            <a-button type="link" v-if="campaignName" @click="changeToPlanTab('ad', record)">
              {{ campaignName.length > 21 ? campaignName.substring(0, 18) + '...' : campaignName }}
            </a-button>
            <span v-else>--</span>
          </div>
        </template>

        <!-- 操作 -->
        <template slot="operate" slot-scope="text, record">
          <a @click="showDrawer(record)">详情</a>
          <a-button disabled type="link" class="no-margin-padding">编辑</a-button>
          <a-button disabled type="link" class="no-margin-padding">数据</a-button>
        </template>

        <!-- 计划状态 -->
        <template slot="status" slot-scope="status">
          <div>
            <span
              :class="[
                'cell-status-label',
                status === 'AD_STATUS_DELIVERY_OK' ? 'cell-status-label-active' : '',
              ]"
            />
            <span>{{ PLAN_STATUS[status] }}</span>
          </div>
        </template>

        <!-- 计划预算 -->
        <template slot="budget" slot-scope="budget, record, index">
          <div class="ad-budget-cell">
            <div class="ad-name-left" v-show="record.isShowEditBudgetIcon">
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

        <!-- 出价 -->
        <template slot="bid" slot-scope="bid, record, index">
          <div class="ad-budget-cell">
            <div class="ad-name-left" v-show="record.isShowEditBidIcon">
              <a-icon type="edit" class="icon-edit" />
              <!-- <a-icon type="clock-circle" class="icon-clock" /> -->
            </div>
            <div class="cell-wrap-right">
              <span class="count">{{ bid !== '' ? bid : '--' }}</span>
              <span class="text">
                {{ record.pricing ? PRICING[record.pricing] : '--' }}
              </span>
            </div>
          </div>
        </template>

        <!-- 操作 -->
        <template slot="externalUrl" slot-scope="externalUrl">
          <a-tooltip v-if="externalUrl" placement="bottom">
            <template slot="title">
              <span>{{ externalUrl }}</span>
            </template>
            <a type="link">{{ externalUrl }}</a>
          </a-tooltip>
          <span v-else>--</span>
        </template>
      </a-table>
    </div>

    <!-- 广告组详情 -->
    <promotion-tabs-details ref="planDetail" @close="closeDrawer" />

    <!-- 自定义列 -->
    <custom-column-modal ref="customColumn" :data="columnData" />

    <!-- 设置成交信息 -->
    <tabs-plan-setting ref="tabPlanSetting" />

    <!-- 设置大投信息 -->
    <tabs-plan-deal ref="tabPlanDeal" @onSave="handleBatchSave" />

    <!-- 设置大投信息 -->
    <tabs-plan-charge ref="tabPlanCharge" @onSave="handleBatchSave" />

    <!-- 修改预算弹窗 -->
    <a-modal
      title="修改预算"
      destroyOnClose
      :visible="visibleModal"
      :confirm-loading="confirmLoading"
      @ok="handleOnSubmit"
      @cancel="handleCloseBudgetModal"
    >
      <a-form-model
        ref="budgetForm"
        :model="budgetForm"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 20 }"
      >
        <a-form-model-item
          label="预算"
          prop="budget"
          :rules="{
            required: true,
            message: '必填项不能为空',
            trigger: 'blur',
            type: 'number',
          }"
        >
          <a-input-number v-model="budgetForm.budget" style="width:200px" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { planColumns, ADGROUP_STATUS, BUDGET_TYPE, PLAN_STATUS, PRICING } from '../contant'
  import PromotionTabsDetails from './promotion-tabs-details'
  import CustomColumnModal from '~/components/custom-column-modal'
  import TabsPlanSetting from './tabs-plan-setting'
  import TabsPlanDeal from './tabs-plan-deal'
  import TabsPlanCharge from './tab-plan-charge'
  import { mapMutations, mapState } from 'vuex'
  import { resizeableTitle } from '~/utils/utils'

  export default {
    components: {
      PromotionTabsDetails,
      CustomColumnModal,
      TabsPlanSetting,
      TabsPlanDeal,
      TabsPlanCharge,
    },

    props: {
      tabKey: {
        type: String,
        default: 'plan',
      },
    },

    data() {
      this.components = {
        header: {
          cell: (h, props, children) => resizeableTitle(h, props, children, planColumns, Vue),
        },
      }
      return {
        // 字段常量映射
        ADGROUP_STATUS,
        BUDGET_TYPE,
        PLAN_STATUS,
        PRICING,

        columnData: [],
        columns: planColumns,
        tableData: [],
        tableLoading: false,
        isOpenModal: false,
        customColumnVisible: false, // 自定义列 popover

        // table表格分页器
        pagination: {
          size: 'small',
          total: 0,
          current: 1,
          showSizeChanger: true,
          showQuickJumper: true,
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `共 ${total} 条`,
        },

        // 选中的数据索引
        selectedRowKeys: [],
        // 选中的数据
        selectedRows: [],
        isShowEditIcon: false,
        form: {},

        // 修改预算弹窗
        confirmLoading: false,
        visibleModal: false,
        budgetForm: {},
        currentRecord: {},

        // 详情
        detailData: {}, // 组设置
        ideaDetailData: {}, // 创意设置
        ideaVideoData: {}, // 创意视频
        spinning: false,
        detailVisible: false,
      }
    },

    computed: {
      ...mapState(['promotion']),
      advertiserId() {
        return this.$store.getters['promotion/advertiserId']
      },

      rowSelection() {
        return {
          onChange: (selectedRowKeys, selectedRows) => {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = selectedRows
          },
        }
      },
    },

    watch: {
      tabKey: {
        immediate: true,
        handler(nVal) {
          if (nVal && nVal === 'plan') {
            this.getAdGroupList('init')
          }
        },
      },

      // 监听全局的条件筛选表单则请求表格数据
      // index.vue => store(promotion) =>  promotion-tabs-ad.vue
      'promotion.filterForm': {
        deep: true,
        handler(newForm) {
          newForm && this.tabKey === 'plan' && this.getAdGroupList('init', newForm)
        },
      },

      advertiserId(nVal) {
        nVal && this.tabKey === 'plan' && this.getAdGroupList('init')
      },
    },

    methods: {
      ...mapMutations({ settingDrawerVisible: 'promotion/settingDrawerVisible' }),

      // 打开广告计划详情的右侧抽屉
      showDrawer(data) {
        this.customColumnVisible = false
        if (!data.advertiserId) return this.$message.error('广告投放账号id不能为空!')
        if (!data.adId) return this.$message.error('广告计划id不能为空!')

        this.$refs.planDetail.getAdPlanItemDetail(data.advertiserId, data.adId, data)
        this.$refs.planDetail.getAdIdeaItemDetail(data.advertiserId, data.adId)
        this.$refs.planDetail.getAdIdeaVideoListDetail(data.advertiserId, data.adId)
      },

      handleOpenModal(type) {
        type === 'modal' && this.$refs.customColumn.openModal({ visible: true })
        this.customColumnVisible = !this.customColumnVisible
      },

      // 勾选表格数据
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },

      // 批量操作按钮
      handleBatchClick({ key }) {
        if (!this.selectedRows.length) return this.$message.warning('至少选择一条广告计划！')
        this.$refs[key].openModal(this.selectedRows)
      },

      // 批量操作后的回调
      handleBatchSave() {
        this.selectedRows = []
        this.selectedRowKeys = []
        this.getAdGroupList()
      },

      // 关闭右侧详情抽屉
      closeDrawer() {
        this.settingDrawerVisible(false)
      },

      // 关闭修改预算弹窗
      handleCloseBudgetModal() {
        this.visibleModal = false
        this.confirmLoading = false
      },

      // 打开修改预算弹窗
      handleOpenBudgetModal(record) {
        this.visibleModal = true
        this.currentRecord = record
        this.budgetForm.budget = record.budget
      },

      // 提交修改预算表单
      handleOnSubmit() {
        this.$refs['budgetForm'].validate((valid) => {
          if (valid) {
            const params = {
              adId: this.currentRecord.adId,
              advertiserId: this.currentRecord.advertiserId,
              budget: this.budgetForm.budget,
            }
            if (params.budget > 9999999.99 || params.budget < 300)
              return this.$message.error('预算最高设置不能超过9999999.99元，不能低于300.0元')
            this.confirmLoading = true
            this.putPlanBudget(params)
          }
        })
      },

      // 更改某条广告组的状态
      changeSwitch(checked, record) {
        const params = {
          optStatus: checked ? 'enable' : 'disable',
          advertiserId: record.advertiserId,
          adId: record.adId,
        }
        this.putAdPlanItemStatus(params)
      },

      // 分页器参数的更改
      changePage(page) {
        this.pagination.current = page.current
        this.pagination.pageSize = page.pageSize
        this.tableData = []
        this.selectedRows = []
        this.selectedRowKeys = []
        this.getAdGroupList()
      },

      // 切换tab栏
      changeToPlanTab(type, record) {
        this.$emit('change-tab', type, record)
      },

      // 修改预算
      putPlanBudget(params) {
        this.$API
          .putPromotionAdPlanBudget(params)
          .then(({ code, data, message }) => {
            this.confirmLoading = false
            this.visibleModal = false
            if (code === 0) {
              this.$message.success(data, 1.5)
              this.getAdGroupList()
            }
          })
          .catch((err) => {
            this.confirmLoading = false
          })
      },

      // 修改广告计划名称
      putAdPlanItemName(record, index) {
        this.tableData[index].isShowEditInput = false
        this.form = {}
      },

      // 启用或停用广告计划
      putAdPlanItemStatus(params) {
        this.$API
          .putPromotionAdPlanItem(params)
          .then(({ code }) => {
            if (code === 0) {
              this.$message.success('更新广告计划状态成功！')
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
        this.tableLoading = true
        this.$API
          .getPromotionPlanList(params)
          .then(({ code, data: { count, list } }) => {
            this.tableLoading = false
            if (code === 0) {
              this.tableData = list.map((item, key) => ({
                ...item,
                key,
                isShowEditIcon: false,
                isShowEditInput: false,
                isShowEditBudgetIcon: false,
                isShowEditTaskIcon: false,
                isShowEditBidIcon: false,
              }))
              this.pagination.total = Number(count)
            }
          })
          .catch((err) => {
            this.tableLoading = false
          })
      },

      // 创建计划
      addPlanClick() {
        /**
         * 如果没有选中数据 则进入新建组中
         * 如果选中数据 则进入新建计划中
         */
        if (!this.selectedRowKeys.length) {
          window.open('/create-ad-group', '_blank')
        } else {
          const linkParams = {
            advertiserId: this.selectedRows[0].advertiserId,
            campaignId: this.selectedRows[0].campaignId,
            campaignName: this.selectedRows[0].campaignName,
          }
          this.$router.push({
            path: '/create-ad-plan',
            query: linkParams,
          })
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../promotion.less';
  @import '~/assets/css/common.less';
</style>
