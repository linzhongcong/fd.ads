<!--
 * @Author: huangjianhan
 * @Date: 2021-04-06 14:23:58
 * @LastEditTime: 2021-06-16 11:14:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads.fandow.com\pages\create-ad-plan\components\form-commponent.vue
-->

<template>
  <a-form class="form-component">
    <!-- 所属广告组 && 投放范围 start -->
    <belong-advertis />

    <put-scope @passDeliveryRange="getDeliveryRange" />

    <put-in-component @passPutInData="getPutInData" />
    <!-- end -->

    <!-- 用户定向 start -->
    <user-goal />
    <!-- end -->

    <!-- 预算与出价 start -->
    <budget-bid @shareData="getBudgetData" />
    <!-- end -->

    <!-- 计划名称 -->
    <plan-name :pageStep="'plan'" @passPlanAd="getPlanAd" />

    <!-- 当前广告 -->
    <current-advertise />

    <!-- 按钮层 start -->
    <div class="form-component_element function-component_element">
      <div class="element-empty"></div>
      <div class="element-function_button">
        <a-button @click="returnPage">取消</a-button>
        <a-button type="primary" @click="handleSubmit('close')">
          保存并关闭
        </a-button>
        <a-button type="primary" @click="handleSubmit('creativity')">
          保存并新建创意
        </a-button>
        -->
      </div>
    </div>
    <!-- end -->
  </a-form>
</template>
<script>
  import belongAdvertis from '../seoned-components/belong-advertise'
  import putScope from '../seoned-components/put-scope'
  import planName from '../seoned-components/plan-name'
  import currentAdvertise from '../seoned-components/current-advertise'
  import PutInComponent from '../seoned-components/form-put-in-component'
  import UserGoal from '../seoned-components/user-goal'
  import BudgetBid from '../seoned-components/budget-bid'
  export default {
    components: {
      PutInComponent,
      UserGoal,
      BudgetBid,
      belongAdvertis,
      putScope,
      planName,
      currentAdvertise,
    },
    data() {
      return {
        form: {
          advertiserId: '',
          campaignId: '',
          deliveryRange: 'DEFAULT',
          // 用户定向
          userAudience: {
            district: 'none',
            gender: 'none',
            age: 'none',
            retargetingTagsInclude: [],
            retargetingTagsExclude: [],
            interestActionMode: 'UNLIMITED',
            superiorPopularityType: 'none',
            platform: [],
            deviceType: [],
            hideIfExists: 0,
            ac: [],
            hideIfConverted: 'NO_EXCLUDE',
          },
        },
        // 预算
        budgetAndBidOcpm: {},
        budgetAndBidCpc: {},
      }
    },

    created() {},

    mounted() {
      this.initData()
    },

    methods: {
      // 数据初始化
      initData() {
        this.form.advertiserId = this.$route.query.advertiserId
        this.form.campaignId = this.$route.query.campaignId
      },

      // 表单提交
      handleSubmit(type) {
        this.submitFormData(type)
      },

      // 数据提交
      submitFormData(type = '') {
        if (this.form.pricing === 'PRICING_OCPM') {
          let budgetAndBidOcpm = this.budgetAndBidOcpm
          this.form = { ...this.form, budgetAndBidOcpm }
          delete this.form.budgetAndBidCpc
        }
        if (this.form.pricing === 'PRICING_CPC') {
          let budgetAndBidCpc = this.budgetAndBidCpc
          this.form = { ...this.form, budgetAndBidCpc }
          delete this.form.budgetAndBidOcpm
        }
        this.$API.createAd(this.form).then(({ code, data, message }) => {
          if (code === 0) {
            this.$message.success('广告计划创建成功')
            if (type === 'close') this.$router.push('/promotion')
            if (type === 'creativity') {
              const linkParams = {
                ...this.$route.query,
                adId: data,
              }
              this.$router.push({
                path: '/create-ad-creativity',
                query: linkParams,
              })
            }
          }
        })
      },

      // 点击取消时返回界面
      returnPage() {
        this.$router.push('/promotion')
      },

      // 投放范围值传递
      getDeliveryRange(params) {
        this.concatParams(params, true)
      },

      // 投放目标
      getPutInData(params) {
        this.concatParams(params, true)
      },

      // 获取计划名称
      getPlanAd(params) {
        this.form.adName = params
      },

      // 接口预算与出价数据
      getBudgetData(params) {
        if (this.form.pricing === 'PRICING_OCPM') this.budgetAndBidOcpm = params
        if (this.form.pricing === 'PRICING_CPC') this.budgetAndBidCpc = params
      },

      // 合并参数
      concatParams(params, isDeconstruction) {
        if (isDeconstruction) {
          this.form = { ...this.form, ...params }
          return
        }
      },

      // 点击投放形式 进行值处理
      setThrowType(params) {
        this.throwType = params.value
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../css/component.css';
  .form-component {
    width: calc(100% - 222px);
    height: calc(100vh - 71px);
    right: 0;
    padding: 16px;
    overflow-x: hidden;
    overflow-y: auto;
    color: #333;
    background: #f9f9f9;
    position: absolute;
    display: inline-block;
    .component-element_adname {
      margin-bottom: 20px;
    }
    .warning-tips {
      margin: 10px 0;
      .warning-icon {
        color: #f9ad14;
      }
    }
    .video-type {
      position: relative;
    }
    .warning-tips {
      font-size: 12px;
      color: #999;
      position: absolute;
    }
  }
</style>
