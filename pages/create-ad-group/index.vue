<!--
 * @Author: lizheng
 * @Date: 2021-03-17 09:40:38
 * @LastEditTime: 2021-06-16 11:14:39
 * @LastEditors: Please set LastEditors
 * @Description: 新建广告
 * @FilePath: \ads\pages\add-advertisement\index.vue
-->

<template>
  <div class="create-wrap">
    <div class="create">
      <a-tabs class="create-tabs" default-active-key="create" @change="handleChangeTabs">
        <a-tab-pane key="create" tab="创建新广告组">
          <div class="section-one">
            <h1 class="create-tabs-title">Hi, 请选择推广目的</h1>
            <div class="create-tabs-wrap">
              <a-card
                :bordered="false"
                :hoverable="true"
                class="create-tabs-card"
                @click="handleCardClick('SHOP', '电商店铺推广')"
              >
                <div
                  :class="['campaign-card-active']"
                  :style="{ display: display ? 'block' : 'none' }"
                ></div>
                <div class="campaign-card-content">
                  <div class="campaign-card-tip">
                    <div class="campaign-card-title"><strong>电商店铺推广</strong></div>
                    <div class="campaign-card-info">提升电商店铺的产品销量</div>
                  </div>
                  <div class="campaign-card-img">
                    <img src="~/assets/images/campaign-shop.svg" alt="load error" />
                  </div>
                </div>
              </a-card>

              <a-card
                active-tab-key="LINK"
                :bordered="false"
                :hoverable="true"
                class="create-tabs-card"
              >
                <div :class="['campaign-card-active']" :style="{ display: 'none' }"></div>
                <div class="campaign-card-content">
                  <div class="campaign-card-tip">
                    <div class="campaign-card-title"><strong>销售线索收集</strong></div>
                    <div class="campaign-card-info">提升销售线索的获取量</div>
                  </div>
                  <div class="campaign-card-img">
                    <img src="~/assets/images/campaign-external.svg" alt="load error" />
                  </div>
                </div>
              </a-card>
            </div>

            <!-- 表单 -->
            <a-row>
              <a-col class="create-col">
                <a-tooltip placement="topLeft">
                  <template slot="title">
                    <span>
                      广告组的推广预算是您预期的该广告组一天可消耗的最高预算，当该广告组日消耗达到您所设置的预算后，将暂停广告投放，并停止收费，系统后台会提示预算不足，广告组的日预算最低300.00元
                    </span>
                  </template>
                  <a-icon class="qr-icon" type="question-circle" />
                </a-tooltip>
                <a-form-model
                  class="campaign-create-form"
                  ref="form"
                  :label-col="{ xxl: { span: 3 }, xl: { span: 4 } }"
                  :wrapper-col="{ span: 16 }"
                  :model="form"
                  label-align="left"
                >
                  <a-form-model-item
                    class="ad-budget"
                    label="广告组预算"
                    prop="budgetMode"
                    :rules="[{ required: true, validator: () => true, trigger: 'change' }]"
                  >
                    <a-radio-group v-model="form.budgetMode" @change="budgetTypeChange">
                      <a-radio-button value="BUDGET_MODE_INFINITE">不限</a-radio-button>
                      <a-radio-button value="BUDGET_MODE_DAY">指定预算</a-radio-button>
                    </a-radio-group>
                  </a-form-model-item>
                  <a-form-model-item
                    v-if="form.budgetMode === 'BUDGET_MODE_DAY'"
                    label="日预算"
                    prop="budget"
                    :rules="[
                      {
                        message: '仅支持数字',
                        regexp: /^[0-9]*$/,
                        trigger: 'blur',
                        type: 'number',
                      },
                      {
                        required: true,
                        min: 300,
                        max: 9999999.99,
                        message: '请输入广告组预算，不低于300.00元，不超过9,999,999.99元',
                        trigger: 'blur',
                        type: 'number',
                      },
                    ]"
                  >
                    <a-input-number
                      style="width:150px"
                      id="inputNumber"
                      placeholder="请输入"
                      :min="0"
                      v-model="form.budget"
                    />
                    <span style="margin-left:10px">元</span>
                  </a-form-model-item>

                  <a-form-model-item
                    label="广告组名称"
                    prop="campaignName"
                    :rules="[
                      {
                        required: true,
                        min: 1,
                        max: 100,
                        message: '请输入广告组名称',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <a-input
                      v-model.trim="form.campaignName"
                      allow-clear
                      placeholder="请输入广告组名称"
                      style="width:350px"
                    ></a-input>
                  </a-form-model-item>
                </a-form-model>
              </a-col>
            </a-row>
          </div>
          <div class="section-two">
            <div class="current-account-name">
              当前广告账户：
              <strong data-no-translate="">
                {{ adInfo.advertiserName }}（{{ adInfo.advertiserId }}）
              </strong>
            </div>
          </div>

          <div class="moduler save-campaign-panel">
            <a-button type="primary" :laoding="btnLoading" @click="onSubmit">下一步</a-button>
          </div>
        </a-tab-pane>
        <a-tab-pane class="pane-two" key="select" tab="选择已有广告组" force-render>
          <a-row style="height:68vh">
            <a-col :xl="{ span: 10 }" :xxl="{ span: 8 }">
              <a-input-search placeholder="请输入广告组id或名称" @search="handleSearchClick">
                <a-button type="primary" slot="enterButton" style="margin-bottom:16px">
                  <a-icon type="search" />
                  搜索
                </a-button>
              </a-input-search>

              <a-card class="select-ad-card">
                <header class="select-ad-card-header" slot="title">列表</header>
                <div v-if="adGroupData.length" class="select-ad-card-wrap">
                  <Loading v-if="loading" :loading="loading" :style-name="{ paddingTop: '26%' }" />
                  <div class="select-ad-card-wrap__item" v-for="item in adGroupData" :key="item.id">
                    <span>{{ item.name }}</span>
                    <span>
                      {{ ADVERTISING_STATUS[item.campaignType] }}-{{
                        LANDING_TYPE[item.landingType]
                      }}
                    </span>
                  </div>
                </div>
                <a-empty v-else class="empty" />
              </a-card>
              <a-pagination
                class="pagination"
                v-model="pagination.current"
                :total="pagination.total"
                :page-size="pagination.pageSize"
                @change="changePageSize"
              />
            </a-col>
          </a-row>

          <div class="section-two">
            <div class="current-account-name">
              当前广告账户：
              <strong>{{ adInfo.advertiserName }}（{{ adInfo.advertiserId }}）</strong>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
  import { LANDING_TYPE, advertisingsStatu } from '../promotion/contant'
  export default {
    layout: 'create',
    data() {
      return {
        LANDING_TYPE,
        ADVERTISING_STATUS: advertisingsStatu,

        title: '创建广告组',
        display: false,
        btnLoading: false,
        loading: false,

        // 选择已选广告组
        campaign: '',
        adGroupData: [],
        adInfo: { advertiserId: '', advertiserName: '' },
        pagination: { current: 1, pageSize: 10, total: 0 },

        // 广告组新建表单
        form: {
          budgetMode: 'BUDGET_MODE_INFINITE',
          landingType: '',
          campaignName: '',
        },
      }
    },

    head() {
      return {
        title: this.title,
        hid: 'createdAd',
        name: 'createAd',
      }
    },

    mounted() {
      const adInfo = localStorage.getItem('adInfo')
      adInfo && (this.adInfo = JSON.parse(adInfo))
    },

    methods: {
      handleChangeTabs(curKey) {
        if (curKey === 'select') {
          // this.adGroupData = []
          this.getAdGroupList()
        }
      },

      handleCardClick(key, name) {
        const time = this.moment(new Date()).format('MM_DD_hh:mm:ss')
        this.display = !this.display
        this.form.landingType = this.display ? key : ''
        this.form.campaignName = this.display ? `${name}_${time}` : ''
      },

      // 预算方式
      budgetTypeChange(e) {
        this.form.budgetMode = e.target.value
      },

      // 页码改变
      changePageSize() {
        this.getAdGroupList()
      },

      // 广告组搜索
      handleSearchClick(name) {
        this.campaign = name.trim()
        this.getAdGroupList()
      },

      // 新建或编辑广告祖
      onSubmit() {
        const params = { ...this.form, advertiserId: this.adInfo.advertiserId }
        if (!this.form.landingType) return this.$message.warning('请先选择推广目的！')
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.btnLoading = true
            this.$API
              .postPromotionAdGroupList(params)
              .then(({ code, data }) => {
                this.btnLoading = false
                if (code === 0) {
                  this.$message.success('新建广告组成功！')
                  const linkParams = {
                    ...params,
                    advertise_user: this.adInfo.advertiserName,
                    campaignId: data,
                  }
                  this.$router.push({
                    path: '/create-ad-plan',
                    query: linkParams,
                  })
                }
              })
              .finally(() => (this.btnLoading = false))
          }
        })
      },

      // 广告组列表查询
      getAdGroupList() {
        const { pageSize, current: pageIndex } = this.pagination
        const params = {
          pageSize,
          pageIndex,
          campaign: this.campaign,
          advertiserId: this.adInfo.advertiserId,
        }

        this.loading = true
        this.$API
          .getPromotionAdGroupListBySearch(params)
          .then(({ code, data: { count, list } }) => {
            this.loading = false
            if (code === 0) {
              this.adGroupData = list
              this.pagination.total = Number(count)
            }
          })
          .catch(() => {
            this.loading = false
          })
      },
    },
  }
</script>
<style lang="less" scoped>
  .active {
    transform: translateY(-3px);
    transition: 0.2s linear;
    border-bottom: 4px solid #2f88ff;
    box-shadow: 0 5px 8px 0 rgba(81, 84, 99, 0.2);
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .create-wrap {
    background-color: #f9f9f9;
    min-height: calc(100vh - 64px);
    overflow: hidden;
    .create {
      &-tabs {
        position: relative;
        min-width: 1130px;
        border-radius: 4px;
        box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.08);
        background-color: #fff;
        padding: 32px 24px 32px 32px;
        margin: 12px;
        min-height: 60vh;

        &-title {
          font-size: 22px;
          color: #333;
          margin-bottom: 16px;
        }

        &-wrap {
          display: flex;
        }

        &-card {
          position: relative;
          width: 252px;
          border: 1px solid #edf1f5;
          border-radius: 4px;
          margin-right: 16px;

          &:first-child {
            .active();
          }

          .campaign-card-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .campaign-card-active {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #2f88ff;
          }

          .campaign-card-tip {
            font-size: 12px;
            color: #999999;
            font-weight: 300;
            margin: 20px 0px 20px 24px;
            width: 128px;
          }

          .campaign-card-title {
            font-size: 14px;
            color: #333333;
            text-align: left;
            margin-bottom: 6px;
            font-weight: 500;
          }

          .campaign-card-img {
            vertical-align: baseline;
          }

          &:hover {
            .active();
          }

          /deep/ .ant-card-body {
            position: relative;
            padding: 0;
            height: 120px;
            overflow: hidden;
            box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.05);
          }
        }

        .campaign-create-form {
          margin-top: 20px;
          width: 50vw;
        }

        .section-two {
          width: 120%;
          background-color: #f9f9f9;
          padding: 16px;
          margin-left: -10%;
          margin-top: 10px;
          border-radius: 4px;
          box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.08);
        }

        .current-account-name {
          font-size: 14px;
          background: #fff;
          padding: 32px;
          padding-left: 180px;
        }

        .save-campaign-panel {
          display: flex;
          justify-content: flex-end;
          min-width: 1048px;
          padding-top: 34px;
        }

        /deep/ .ant-tabs-bar {
          border-bottom: none;
        }
      }
    }

    .create-col {
      display: flex;
      .qr-icon {
        cursor: pointer;
        margin-top: 33px;
        margin-right: 8px;
      }
    }

    .select-ad-card {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      &-header {
        height: 38px;
        line-height: 38px;
        padding-left: 13px;
        background: #f8f9fa;
      }

      &-wrap {
        position: relative;
        height: 350px;
        padding-top: 6px;
        overflow-x: hidden;
        overflow-y: scroll;

        &__item {
          display: flex;
          justify-content: space-between;
          padding: 0 12px;
          height: 34px;
          line-height: 34px;
          cursor: pointer;

          &:hover {
            background-color: #edf1f5;
          }
        }
      }

      .empty {
        .center();
        flex-direction: column;
        height: 350px;
      }

      /deep/ .ant-card-head {
        padding: 0;
        min-height: 38px;
      }
      /deep/ .ant-card-head-title {
        padding: 0;
      }
      /deep/ .ant-card-body {
        padding: 0;
      }
    }

    .pane-two .pagination {
      text-align: right;
      margin-top: 16px;
    }
  }
</style>
