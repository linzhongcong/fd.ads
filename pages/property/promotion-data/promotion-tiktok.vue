<!--
 * @Author: xieguiting
 * @Date: 2021-09-15 10:32:50
 * @LastEditTime: 2021-10-06 11:00:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads.fandow.com\pages\property\promotion-data\promotion-tiktok.vue
-->
<template>
  <div class="padding">
    <a-tabs default-active-key="1" @change="onChangeTabs" class="padding-left">
      <a-tab-pane key="1" tab="巨量">
        <div class="product-wrap">
          <div class="filter">
            <div class="left">
              <!-- 搜索表单内容 -->
              <a-form-model
                label-align="right"
                layout="inline"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
                :model="searchForm"
              >
                <a-row>
                  <a-col :span="6">
                    <a-form-model-item label="商品" style="width: 100%">
                      <SelectProducts 
                        v-model.trim="searchForm.productName" 
                        @change="(...val) => onSelectChange(val, 'productId')" 
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="推广位" style="width: 100%">
                      <SelectSites 
                        v-model.trim="searchForm.promoterName" 
                        @change="(...val) => onSelectChange(val, 'promoterId')" 
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="投放人员" style="width: 100%;">
                      <SelectUsers 
                        v-model.trim="searchForm.realName" 
                        @change="(...val) => onSelectChange(val, 'username')" 
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="日期">
                      <a-range-picker
                        v-model="filterDateRange"
                        :disabled-date="
                          (current) => current && current > this.moment().endOf('day')
                        "
                        :allow-clear="true"
                        format="YYYY.MM.DD"
                        separator="至"
                        class="statement-input"
                        style="width:auto"
                        @change="changeDatePick"
                      >
                        <a-icon slot="suffixIcon" type="calendar" />
                      </a-range-picker>
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="6">
                    <a-form-model-item label="计划" style="width: 100%">
                      <a-select
                        show-search
                        allow-clear
                        style="width: 90%"
                        option-label-prop="label"
                        v-model.trim="searchForm.name"
                        @search="(name) => formFuzzySearchList(name, 'adId')"
                        @change="(name) => handleUserChangeList(name, 'adId')"
                        placeholder="计划ID/计划名称"
                      >
                        <a-spin v-if="listFetching" slot="notFoundContent" size="small" />
                        <a-select-option
                          v-for="(item, index) in planOptions"
                          :value="item.employee"
                          :key="item.id"
                          :label="item.name"
                        >
                          {{ item.employee }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="账户ID" style="width: 100%">
                      <a-select
                        show-search
                        allow-clear
                        style="width: 90%"
                        option-label-prop="label"
                        v-model.trim="searchForm.advertiserId"
                        @search="(name) => formFuzzySearchList(name, 'user')"
                        placeholder="账户ID"
                      >
                        <a-spin v-if="listFetching" slot="notFoundContent" size="small" />
                        <a-select-option
                          v-for="(item, index) in userOptions"
                          :value="item.advertiserId"
                          :key="item.advertiserId"
                          :label="item.advertiserId"
                        >
                          {{ item.advertiserId }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model>
            </div>

            <!-- 查询操作模块 -->
            <div class="right">
              <a-button type="primary" @click="onSearch">
                查询
              </a-button>
              <a-button style="margin-top:10px" @click="handleResetClick">
                重置
              </a-button>
            </div>
          </div>
          <div class="content">
            <tiktokList @resetSearchForm="resetSearchForm" ref="tiktokList" />
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="内容服务">
        <div class="product-wrap">
          <div class="filter">
            <div class="left">
              <!-- 搜索表单内容 -->
              <a-form-model
                label-align="right"
                layout="inline"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
                :model="searchForm"
              >
                <a-row>
                  <a-col :span="6">
                    <a-form-model-item label="商品" style="width: 100%">
                      <SelectProducts 
                        v-model.trim="searchForm.productId" 
                        @change="(...val) => onSelectChange(val, 'productId')" 
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="推广位" style="width: 100%">
                      <SelectSites 
                        v-model.trim="searchForm.promoterId" 
                        @change="(...val) => onSelectChange(val, 'promoterId')" 
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="投放人员" style="width: 100%;">
                      <SelectUsers 
                        v-model.trim="searchForm.username" 
                        @change="(...val) => onSelectChange(val, 'username')" 
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="日期">
                      <a-range-picker
                        v-model="filterDateRange"
                        :disabled-date="
                          (current) => current && current > this.moment().endOf('day')
                        "
                        :allow-clear="true"
                        show-time
                        format="YYYY.MM.DD"
                        separator="至"
                        class="statement-input"
                        style="width:auto"
                        @change="changeDatePick"
                      >
                        <a-icon slot="suffixIcon" type="calendar" />
                      </a-range-picker>
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="6">
                    <a-form-model-item label="计划" style="width: 100%">
                      <a-select
                        show-search
                        allow-clear
                        option-label-prop="label"
                        style="width: 90%"
                        @search="(name) => formFuzzySearchList(name)"
                        @change="(name) => handleUserChangeList(name)"
                        placeholder="计划ID/计划名称"
                      >
                        <a-spin v-if="listFetching" slot="notFoundContent" size="small" />
                        <a-select-option
                          v-for="(item, index) in planOptions"
                          :value="item.employee"
                          :key="item.id"
                          :label="item.realName"
                        >
                          {{ item.employee }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model>
            </div>

            <!-- 查询操作模块 -->
            <div class="right">
              <a-button type="primary" @click="onSearch">
                查询
              </a-button>
              <a-button style="margin-top:10px" @click="handleResetClick">
                重置
              </a-button>
            </div>
          </div>
          <div class="content">
            <tiktokList :filterForm="searchForm" ref="tiktokList" />
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="内容热推">
        <div class="product-wrap">
          <div class="filter">
            <div class="left">
              <!-- 搜索表单内容 -->
              <a-form-model
                label-align="right"
                layout="inline"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
                :model="searchForm"
              >
                <a-row>
                  <a-col :span="6">
                    <a-form-model-item label="商品" style="width: 100%">
                      <SelectProducts 
                        v-model.trim="searchForm.productId" 
                        @change="(...val) => onSelectChange(val, 'productId')" 
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="推广位" style="width: 100%">
                      <SelectSites 
                        v-model.trim="searchForm.promoterId" 
                        @change="(...val) => onSelectChange(val, 'promoterId')" 
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="投放人员" style="width: 100%;">
                      <SelectUsers 
                        v-model.trim="searchForm.username" 
                        @change="(...val) => onSelectChange(val, 'username')" 
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="日期">
                      <a-range-picker
                        v-model="filterDateRange"
                        :disabled-date="
                          (current) => current && current > this.moment().endOf('day')
                        "
                        :allow-clear="true"
                        show-time
                        format="YYYY.MM.DD"
                        separator="至"
                        class="statement-input"
                        style="width:auto"
                        @change="changeDatePick"
                      >
                        <a-icon slot="suffixIcon" type="calendar" />
                      </a-range-picker>
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="6">
                    <a-form-model-item label="计划" style="width: 100%">
                      <a-select
                        show-search
                        allow-clear
                        option-label-prop="label"
                        style="width: 90%"
                        @search="(name) => formFuzzySearchList(name)"
                        @change="(name) => handleUserChangeList(name)"
                        placeholder="计划ID/计划名称"
                      >
                        <a-spin v-if="listFetching" slot="notFoundContent" size="small" />
                        <a-select-option
                          v-for="(item, index) in planOptions"
                          :value="item.employee"
                          :key="item.id"
                          :label="item.realName"
                        >
                          {{ item.employee }}
                        </a-select-option>
                      </a-select>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model>
            </div>

            <!-- 查询操作模块 -->
            <div class="right">
              <a-button type="primary" @click="onSearch">
                查询
              </a-button>
              <a-button style="margin-top:10px" @click="handleResetClick">
                重置
              </a-button>
            </div>
          </div>
          <div class="content">
            <tiktokList :filterForm="searchForm" ref="tiktokList" />
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import { debounce, copyText } from '~/utils/utils'
  import tiktokList from './components/tiktok-list'
  export default {
    components: {
      tiktokList,
    },
    data() {
      this.getInitData = debounce(this.getInitData, 500)
      this.formFuzzySearchList = debounce(this.formFuzzySearchList, 500)
      this.copySqueeze = debounce(copyText, 500)
      return {
        // 搜索数据
        searchForm: {},
        filterDateRange: [],
        userOptions: [],
        planOptions: [],
        listFetching: false,
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
    methods: {
      // 搜索
      onSearch() {
        let { productId, promoterId, username, advertiserId, adId, startTime, endTime } = this.searchForm
        let params = { productId, promoterId, username, advertiserId, adId, startTime, endTime }
        this.$refs.tiktokList.getInitData('init', params)
      },
      // 重置按钮
      handleResetClick() {
        this.searchForm = {}
        this.filterDateRange = []
        this.userOptions = []
        this.planOptions = []
        this.$refs.tiktokList.getInitData('init')
      },
      // 下拉选择
      onSelectChange(val, type) {
        this.searchForm[type] = val[1];
      },
      // tabs切换
      onChangeTabs(key) {
        this.searchForm = {}
        this.userOptions = []
        this.planOptions = []
        this.filterDateRange = []
      },
      // 重置按钮
      handleResetClick() {
        this.searchForm = {}
        this.filterDateRange = []
        this.userOptions = []
        this.planOptions = []
        this.$nextTick(() => {
            this.$refs.tiktokList.getInitData('init')
        })
      },
      // 负责人模糊搜索
      formFuzzySearchList(name, idx) {
        let isAdid = idx === 'adId'
        let apiUrl = isAdid ? 'extendDouyinPlanList' : 'getReportAdvertiserSearch'
        this.listFetching = true
        this.$API[apiUrl](name.trim())
          .then(({ code, data }) => {
            if (code === 0) {
              if (!isAdid) {
                this.userOptions = data
              } else {
                this.planOptions = data.map(item => ({
                  ...item,
                  employee: `${item.name} / ${item.adId}`,
                }))
              }
              
            }
          })
          .finally(() => (this.listFetching = false))
      },
      // 用户模糊搜索发生改变
      handleUserChangeList(item, idx) {
        if (item === '' || item === undefined) return this.searchForm.adId = ''
        this.searchForm.adId = item.split('/')[1]
      },
      // 时间选择器
      changeDatePick(date) {
        if (date.length) {
          this.searchForm.startTime = date[0].format('YYYY-MM-DD')
          this.searchForm.endTime = date[1].format('YYYY-MM-DD')
        } else {
          this.searchForm.startTime = ''
          this.searchForm.endTime = ''
        }
      },
      resetSearchForm(obj) {
        this.searchForm = obj
      }
    },
  }
</script>

<style lang="less" scoped>
  @import '~/assets/css/account.less';
  .padding {
    padding-top: 20px;
    .padding-left /deep/.ant-tabs-nav-scroll {
      overflow: hidden;
      white-space: nowrap;
      padding-left: 20px;
    }
  }
  .product-wrap {
    height: calc(100vh - 208px);
    overflow-y: auto;
    background-color: #eef0f3;
    .seconed-content_header {
      justify-content: center;
      font-weight: 700;
      font-style: normal;
      font-size: 18px;
      position: relative;
      .pack-up {
        top: 80%;
        right: -2%;
        position: absolute;
      }
    }
    .tips-style {
      font-size: 14px;
      color: rgba(204, 204, 204, 1);
      cursor: pointer;
    }
    .ad-element {
      padding: 20px 30px 20px 24px;
      border-right: 1px solid #e9e9e9;
      background-color: #fff;
      display: inline-block;
    }
    .clear-portion_style {
      padding: 0;
      background-color: transparent;
    }
    .integer-number {
      font-weight: bold;
    }
    .decimal-number {
      font-size: 16px;
      text-indent: -5px;
      font-weight: 600;
      display: inline-block;
    }
    .order-data_title {
      width: 160px;
      font-size: 14px;
      color: #999999;
    }
    .order-data_value {
      font-size: 24px;
      font-weight: 600;
      color: #000;
    }
  }
</style>
