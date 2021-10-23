<!--
 * @Author: xieguiting
 * @Date: 2021-09-15 10:32:50
 * @LastEditTime: 2021-10-06 11:00:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads.fandow.com\pages\property\promotion-data\promotion-aliud.vue
-->
<template>
  <div class="padding">
    <a-tabs default-active-key="1" @change="callback" class="padding-left">
      <a-tab-pane key="1" tab="抖音">
        <div class="product-wrap">
          <div class="filter">
            <div class="left">
              <!-- 搜索表单内容 -->
              <a-form-model
                label-align="right"
                layout="inline"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
                :model="filterForm"
              >
                <a-row>
                  <a-col :span="6">
                    <a-form-model-item label="商品" style="width: 100%">
                      <a-input
                        allow-clear
                        v-model.trim="filterForm.shop"
                        placeholder="请输入"
                        class="statement-input"
                        @pressEnter="getInitData('init')"
                        @change="(e) => !e.target.value && this.getInitData('init')"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="账号ID" style="width: 100%">
                      <a-input
                        allow-clear
                        v-model.trim="filterForm.position"
                        placeholder="账户ID"
                        class="statement-input"
                        @pressEnter="getInitData('init')"
                        @change="(e) => !e.target.value && this.getInitData('init')"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="投放人员" style="width: 100%;">
                      <a-select
                        show-search
                        allow-clear
                        option-label-prop="label"
                        @search="(name) => formFuzzySearchList(name)"
                        @change="(name) => handleUserChangeList(name)"
                        placeholder="请输入工号/姓名"
                      >
                        <a-spin v-if="listFetching" slot="notFoundContent" size="small" />
                        <a-select-option
                          v-for="(item, index) in userOptions"
                          :value="item.employee"
                          :key="item.id"
                          :label="item.realName"
                        >
                          {{ item.employee }}
                        </a-select-option>
                      </a-select>
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
                      <a-input
                        allow-clear
                        v-model.trim="filterForm.landingPageName"
                        placeholder="请输入"
                        class="statement-input"
                        @pressEnter="getInitData('init')"
                        @change="(e) => !e.target.value && this.getInitData('init')"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model>
            </div>

            <!-- 查询操作模块 -->
            <div class="right">
              <a-button type="primary" @click="search">
                查询
              </a-button>
              <a-button style="margin-top:10px" @click="handleResetClick">
                重置
              </a-button>
            </div>
          </div>
          <div class="content">
            <aliudList :filterForm="filterForm" ref="aliudList" />
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="快手">
        <div class="product-wrap">
          <div class="filter">
            <div class="left">
              <!-- 搜索表单内容 -->
              <a-form-model
                label-align="right"
                layout="inline"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
                :model="filterForm"
              >
                <a-row>
                  <a-col :span="6">
                    <a-form-model-item label="商品" style="width: 100%">
                      <a-input
                        allow-clear
                        v-model.trim="filterForm.shop"
                        placeholder="请输入"
                        class="statement-input"
                        @pressEnter="getInitData('init')"
                        @change="(e) => !e.target.value && this.getInitData('init')"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="推广位" style="width: 100%">
                      <a-input
                        allow-clear
                        v-model.trim="filterForm.position"
                        placeholder="请输入"
                        class="statement-input"
                        @pressEnter="getInitData('init')"
                        @change="(e) => !e.target.value && this.getInitData('init')"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="投放人员" style="width: 100%;">
                      <a-select
                        show-search
                        allow-clear
                        option-label-prop="label"
                        @search="(name) => formFuzzySearchList(name)"
                        @change="(name) => handleUserChangeList(name)"
                        placeholder="请输入工号/姓名"
                      >
                        <a-spin v-if="listFetching" slot="notFoundContent" size="small" />
                        <a-select-option
                          v-for="(item, index) in userOptions"
                          :value="item.employee"
                          :key="item.id"
                          :label="item.realName"
                        >
                          {{ item.employee }}
                        </a-select-option>
                      </a-select>
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
                    <a-form-model-item label="账户" style="width: 100%">
                      <a-input
                        allow-clear
                        v-model.trim="filterForm.landingPageId"
                        placeholder="请输入"
                        class="statement-input"
                        @pressEnter="getInitData('init')"
                        @change="(e) => !e.target.value && this.getInitData('init')"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="计划" style="width: 100%">
                      <a-input
                        allow-clear
                        v-model.trim="filterForm.landingPageName"
                        placeholder="请输入"
                        class="statement-input"
                        @pressEnter="getInitData('init')"
                        @change="(e) => !e.target.value && this.getInitData('init')"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model>
            </div>

            <!-- 查询操作模块 -->
            <div class="right">
              <a-button type="primary" @click="search">
                查询
              </a-button>
              <a-button style="margin-top:10px" @click="handleResetClick">
                重置
              </a-button>
            </div>
          </div>
          <div class="content">
            <aliudList :filterForm="filterForm" ref="aliudList" />
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="腾讯">
        <div class="product-wrap">
          <div class="filter">
            <div class="left">
              <!-- 搜索表单内容 -->
              <a-form-model
                label-align="right"
                layout="inline"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 18 }"
                :model="filterForm"
              >
                <a-row>
                  <a-col :span="6">
                    <a-form-model-item label="商品" style="width: 100%">
                      <a-input
                        allow-clear
                        v-model.trim="filterForm.shop"
                        placeholder="请输入"
                        class="statement-input"
                        @pressEnter="getInitData('init')"
                        @change="(e) => !e.target.value && this.getInitData('init')"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="推广位" style="width: 100%">
                      <a-input
                        allow-clear
                        v-model.trim="filterForm.position"
                        placeholder="请输入"
                        class="statement-input"
                        @pressEnter="getInitData('init')"
                        @change="(e) => !e.target.value && this.getInitData('init')"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="投放人员" style="width: 100%;">
                      <a-select
                        show-search
                        allow-clear
                        option-label-prop="label"
                        @search="(name) => formFuzzySearchList(name)"
                        @change="(name) => handleUserChangeList(name)"
                        placeholder="请输入工号/姓名"
                      >
                        <a-spin v-if="listFetching" slot="notFoundContent" size="small" />
                        <a-select-option
                          v-for="(item, index) in userOptions"
                          :value="item.employee"
                          :key="item.id"
                          :label="item.realName"
                        >
                          {{ item.employee }}
                        </a-select-option>
                      </a-select>
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
                    <a-form-model-item label="账户" style="width: 100%">
                      <a-input
                        allow-clear
                        v-model.trim="filterForm.landingPageId"
                        placeholder="请输入"
                        class="statement-input"
                        @pressEnter="getInitData('init')"
                        @change="(e) => !e.target.value && this.getInitData('init')"
                      />
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="6">
                    <a-form-model-item label="计划" style="width: 100%">
                      <a-input
                        allow-clear
                        v-model.trim="filterForm.landingPageName"
                        placeholder="请输入"
                        class="statement-input"
                        @pressEnter="getInitData('init')"
                        @change="(e) => !e.target.value && this.getInitData('init')"
                      />
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model>
            </div>

            <!-- 查询操作模块 -->
            <div class="right">
              <a-button type="primary" @click="search">
                查询
              </a-button>
              <a-button style="margin-top:10px" @click="handleResetClick">
                重置
              </a-button>
            </div>
          </div>
          <div class="content">
            <aliudList :filterForm="filterForm" ref="aliudList" />
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import { debounce, copyText } from '~/utils/utils'
  import aliudList from './components/aliud-list'
  export default {
    components: {
      aliudList,
    },
    data() {
      this.getInitData = debounce(this.getInitData, 500)
      this.formFuzzySearchList = debounce(this.formFuzzySearchList, 500)
      this.copySqueeze = debounce(copyText, 500)
      return {
        isExpand: false,
        filterForm: {},
        filterDateRange: [],
        userOptions: [],
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
      search() {
        console.log('触发了吗')
        this.$refs.aliudList.getInitData('init', this.filterForm)
      },
      callback(key) {
        console.log(key)
      },
      getInitData(type = '') {
        // this.tableLoading = true
        if (type === 'init') {
          this.pagination.current = 1
          this.pagination.pageSize = 10
        }
        this.$API
          .personalLandingPageSearch({
            ...this.filterForm,
            pageIndex: this.pagination.current,
            pageSize: this.pagination.pageSize,
          })
          .then(({ code, data: { list, count }, message }) => {
            if (!code) {
              list.map((element, index) => (element.key = index))
              this.squeezeData = list
              this.pagination.total = count
              return false
            }
            this.$message.warn(message)
          })
          .finally(() => {
            this.tableLoading = false
          })
      },

      // 重置按钮
      handleResetClick() {
        this.filterForm = {}
        this.filterDateRange = []
      },

      // 负责人模糊搜索
      formFuzzySearchList(name, idx) {
        this.listFetching = true
        this.$API
          .getUsers({ name, perPage: 50 })
          .then(({ code, data: { list } }) => {
            if (code === 0) {
              this.userOptions = list.map((item) => ({
                ...item,
                employee: `${item.realName} / ${item.username}`,
              }))
            }
          })
          .finally(() => (this.listFetching = false))
      },

      // 用户模糊搜索发生改变
      handleUserChangeList(item, idx) {
        if (item === '' || item === undefined) return false
        this.filterForm.manager = item.split('/')[0]
        this.getInitData('init')
      },

      // 时间选择器
      changeDatePick(date) {
        if (date.length) {
          this.filterForm.startTime = date[0].format('YYYY-MM-DD HH:mm:ss')
          this.filterForm.endTime = date[1].format('YYYY-MM-DD HH:mm:ss')
        } else {
          this.filterForm.startTime = ''
          this.filterForm.endTime = ''
        }
        this.getInitData('init')
      },
      console() {
        console.log(111)
      },
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
