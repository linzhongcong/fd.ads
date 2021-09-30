<!--
 * @Author: lizheng
 * @Date: 2021-01-12 10:12:47
 * @LastEditTime: 2021-06-08 09:54:20
 * @LastEditors: Please set LastEditors
 * @Description: 推广模块
 * @FilePath: \ads\pages\promotion\index.vue
-->
<template>
  <div class="promotion-wrap">
    <div class="promotion-header">
      <div class="promotion-header-left">
        <a-select
          allow-clear
          show-search
          placeholder="选择账号"
          style="width:250px;margin-right:10px"
          option-label-prop="label"
          v-model="advertiserId"
          @change="getAccountBudget"
        >
          <a-select-option
            style="height:300px"
            :value="item.advertiserId"
            :key="item.advertiserId"
            :label="item.advertiserName"
            v-for="item in AdAccount"
          >
            <div class="options-select">
              <a-tooltip class="options-label" placement="bottomLeft">
                <template slot="title">
                  <span>{{ item.advertiserName }}</span>
                </template>
                <div class="tooltip-content">
                  <a-icon class="content-icon" type="check-circle" />
                  <span class="tip-hidden">{{ item.advertiserName }}</span>
                </div>
              </a-tooltip>
              <p>ID: {{ item.advertiserId }}</p>
            </div>
          </a-select-option>
        </a-select>
        <div class="padding">
          <span class="promotion-header-title">今日消耗</span>
          <span class="promotion-header-money">{{ accountBudget.cost }}</span>
        </div>

        <div class="padding">
          <div class="promotion-header-title">账户日预算</div>
          <span
            v-if="BUDGET_TYPE[accountBudget.budgetMode] !== '不限'"
            class="promotion-header-money"
          >
            {{ accountBudget.budget }}
          </span>
          <span v-else class="promotion-header-money" style="font-size:13px">
            {{ BUDGET_TYPE[accountBudget.budgetMode] }}
          </span>
          <a-icon type="edit" class="icon" />
          <a-icon type="clock-circle" class="icon" />
          <!-- <a-icon type="edit" class="icon" @click="openModal('budget')" /> -->
          <!-- <a-icon type="clock-circle" class="icon" @click="openModal('task')" /> -->
        </div>
        <div class="spliter"></div>
        <div class="count">
          <a-popover placement="bottomLeft">
            <template slot="title">
              <div class="popover-title-wrap">
                <span class="text">账户余额构成说明</span>
                <a-button type="link" class="btn-link">查看详情</a-button>
              </div>
            </template>
            <template slot="content">
              <div class="balance-explain">
                <p>账户余额=赠款余额+非赠款余额</p>
                <p>您的赠款余额有：{{ accountBudget.grant }}元</p>
                <p>您的非赠款余额有：{{ accountBudget.notGrand }}元</p>
                <p>您的可用余额有：{{ accountBudget.validBalance }}元</p>
              </div>
            </template>
            <a-icon type="question-circle" style="margin-top: 5px; cursor: pointer;" />
          </a-popover>
          <span class="promotion-header-title" style="margin-left:6px">账户余额</span>
          <span class="promotion-header-money">{{ accountBudget.balance }}</span>
          <span class="promotion-header-title" style="margin-left:6px">日消耗进度</span>
        </div>
        <a-tooltip title="今日消耗：￥0.0">
          <a-progress class="consume-progress" size="small" :percent="70" />
        </a-tooltip>
      </div>
    </div>

    <!-- 筛选模块 -->
    <promotion-filter :advertiser-id="advertiserId" @search-data="searchTableData" />

    <!-- Tab栏 -->
    <promotion-tabs @search-condition="searchPlanData" ref="promotionTabs" />

    <!-- 修改账户预算 -->
    <a-modal
      v-model="editBudgetModal"
      destroyOnClose
      title="修改账户预算"
      @ok="onSave('budgetForm')"
    >
      <a-form-model
        ref="budgetForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :model="budgetForm"
      >
        <a-form-model-item ref="name" label="预算方式" prop="name">
          <a-radio-group :value="budgetForm.budgetMode" @change="budgetTypeChange">
            <a-radio-button value="BUDGET_MODE_INFINITE">不限预算</a-radio-button>
            <a-radio-button value="BUDGET_MODE_DAY">指定预算</a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          v-if="budgetForm.budgetMode === 'BUDGET_MODE_DAY'"
          label="账户日预算"
          prop="budget"
          :rules="[
            { message: '仅支持数字', regexp: /^[0-9]*$/, trigger: 'blur', type: 'number' },
            { required: true, message: '必填项不能为空', trigger: 'blur', type: 'number' },
          ]"
        >
          <a-input-number
            id="inputNumber"
            v-model="budgetForm.budget"
            :min="0"
            style="min-width:180px"
          />
          <span style="margin-left:10px">元</span>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!-- 预算定时任务 -->
    <a-modal destroyOnClose v-model="timingTaskModal" title="预算定时任务" @ok="onSave('taskForm')">
      <a-form-model
        ref="taskForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :model="taskForm"
      >
        <a-form-model-item
          label="账户日预算"
          prop="money"
          :rules="{ required: true, message: '必填项不能为空', trigger: 'blur', type: 'number' }"
        >
          <a-input-number placeholder="请输入预约值" v-model="taskForm.money" style="width:180px" />
        </a-form-model-item>
        <span class="time_task_tip">设置的定时任务将于次日凌晨00:00时生效</span>
      </a-form-model>
    </a-modal>

    <a-spin :spinning="false" :delay="500"></a-spin>
  </div>
</template>

<script>
  import PromotionFilter from './promotion-filter'
  import PromotionTabs from './promotion-tabs'
  import { BUDGET_TYPE } from './contant'
  import { mapMutations } from 'vuex'
  import { EventBus } from './js/promotionBus'

  export default {
    components: {
      PromotionFilter,
      PromotionTabs,
    },

    data() {
      return {
        spinLoading: false,
        editBudgetModal: false,
        timingTaskModal: false,

        // 页面顶部账户数据
        BUDGET_TYPE,
        percent: 100, // 进度条
        accountBudget: {
          advertiserId: '',
          balance: 0,
          budget: 0,
          budgetMode: 'BUDGET_MODE_DAY',
          cost: 0,
        },

        // 用户广告账户
        advertiserId: null,
        AdAccount: [], // 广告投放账号

        labelCol: { span: 5 },
        wrapperCol: { span: 14 },
        // 预算定时任务表单
        taskForm: {},
        // 账户预算表单
        budgetForm: { budgetMode: 'BUDGET_MODE_INFINITE', budget: null },
      }
    },

    created() {
      this.settingFilterForm({})
      this.getAdUserAccountList()
    },

    methods: {
      ...mapMutations({
        settingAdvertiserId: 'promotion/settingAdvertiserId',
        settingFilterForm: 'promotion/settingFilterForm',
      }),

      openModal(type) {
        if (type === 'budget') {
          const { budgetMode, budget } = this.accountBudget
          this.budgetForm = { budgetMode, budget }
          this.editBudgetModal = true
        } else {
          this.taskForm = {}
          type === 'task' && (this.timingTaskModal = true)
        }
      },

      // 预算方式
      budgetTypeChange(e) {
        this.budgetForm.budgetMode = e.target.value
      },

      // 广告账户预算更新
      putAdAccountBudget(params) {
        this.$API
          .putAdAccountBudget(params)
          .then(({ code }) => {
            if (code === 0) {
              this.$message.success('修改成功!')
              this.editBudgetModal = false
              this.getAccountBudget(this.advertiserId)
            }
          })
          .catch((err) => console.log(err, 'err'))
      },

      // 修改账户预算
      onSave(name) {
        let params = {}

        // 不限预算
        if (this.budgetForm.budgetMode === 'BUDGET_MODE_INFINITE') {
          params = { advertiserId: this.advertiserId, budgetMode: 'BUDGET_MODE_INFINITE' }
          this.putAdAccountBudget(params)
          return
        }

        // 预算更新
        if (this.budgetForm.budget < 1000)
          return this.$message.error('您的预算设置，不能低于1000.0元！')
        this.$refs[name].validate((valid) => {
          if (valid) {
            params = { ...this.budgetForm, advertiserId: this.advertiserId }
            this.putAdAccountBudget(params)
          }
        })
      },

      // 筛选条件发生变化则更新全局筛选表单数据
      searchTableData(type, filterForm) {
        this.settingFilterForm({ type, ...filterForm })
      },

      // 获取用户头像
      getUserAvatar() {
        this.$API
          .getAdMasterAvatar(this.advertiserId)
          .then(({ code, data }) => {
            if (code === 1) {
              sessionStorage.setItem('AdUserAvatar', data.webUri)
            }
          })
          .catch((err) => console.info(err, 'err'))
      },

      // 获取账户预算详情
      getAccountBudget(id) {
        if (id) {
          const item = this.AdAccount.find(({ advertiserId }) => id === advertiserId)
          localStorage.setItem('adInfo', JSON.stringify(item))
          this.settingAdvertiserId(item)
          this.$API
            .getAdAccountBudget(id)
            .then(({ code, data }) => {
              if (code === 0) {
                this.accountBudget = data
                this.advertiserId = id
                this.getUserAvatar()
              }
            })
            .catch((err) => console.log(err))
        }
      },

      // 获取用户工号下的广告投放账号
      getAdUserAccountList() {
        this.spinLoading = true
        this.$API
          .getAdUserAccountList()
          .then(({ code, data }) => {
            this.spinLoading = false
            if (code === 0) {
              this.AdAccount = data
              this.advertiserId = data[0].advertiserId
              const item = this.AdAccount.find(
                ({ advertiserId }) => this.advertiserId === advertiserId
              )
              localStorage.setItem('adInfo', JSON.stringify(item))
              this.settingAdvertiserId(item)
              this.getAccountBudget(data[0].advertiserId)
              this.getUserAvatar()
            }
          })
          .catch((err) => {
            this.spinLoading = false
          })
      },

      // 搜索对应的计划数据
      searchPlanData(val) {
        EventBus.$emit('searchPassObj', val)
      },
    },
  }
</script>

<style lang="less" scoped>
  .spin-content {
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    padding: 30px;
  }

  .popover-title-wrap {
    width: 240px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .text {
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
    }

    .btn-link {
      font-weight: 400;
      font-size: 12px;
      text-decoration: none;
    }

    .balance-explain {
      margin-top: 8px;
      p {
        font-size: 12px;
        color: #666;
        line-height: 20px;
        margin: 0;
      }
    }
  }

  .promotion-wrap {
    .promotion-header {
      display: flex;
      font-size: 14px;
      height: 48px;
      padding: 0 16px;
      background: #fff;
      border-bottom: 1px solid #e4e9ed;
      align-items: center;
      justify-content: space-between;

      &-left {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .padding {
          margin-right: 20px;
        }

        .spliter {
          width: 1px;
          height: 16px;
          margin: 0 24px 0 6px;
          background-color: #cfd2d6;
        }

        .icon {
          cursor: pointer;
          margin-left: 5px;
        }
      }

      &-title {
        display: inline-block;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        font-weight: 500;
        color: #666;
        height: 16px;
        // margin-right: 8px;
      }

      &-money {
        font-size: 16px;
        font-weight: 700;
        color: #333;
        line-height: 22px;
        height: 22px;
      }
    }
  }

  .time_task_tip {
    font-size: 12px;
    color: #999;
  }

  .count {
    display: inline-block;
  }

  .consume-progress {
    display: inline-block;
    width: 150px;
    margin-left: 10px;
  }

  .options-label {
    width: 250px;
    overflow: hidden;
  }

  .tooltip-content {
    display: flex;
    align-items: center;
    overflow: hidden;

    .content-icon {
      display: inline-block;
      color: #52c41a;
    }

    .tip-hidden {
      width: 210px;
      margin-left: 5px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
