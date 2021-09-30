<!--
 * @Author: lizheng
 * @Date: 2021-02-23 11:12:05
 * @LastEditTime: 2021-04-06 16:09:00
 * @LastEditors: Please set LastEditors
 * @Description: 设置广告投放账号弹窗
 * @FilePath: \ads\pages\user-account\components\advertify-setting.vue
-->

<template>
  <div>
    <a-drawer
      class="setting-wrap"
      destory-on-close
      :width="800"
      :visible="visible"
      :closable="false"
      :mask="false"
      @close="closeDrawer"
    >
      <div class="drawer-header" v-if="visible">
        <a-icon type="close" class="close-icon" @click="closeDrawer" />
        <a-tabs class="tabs" default-active-key="form" @change="changeTabs">
          <!-- 负责人Tab -->
          <a-tab-pane class="tab-panel-form" key="form" tab="负责人">
            <a-form-model
              ref="form"
              :model="form"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 16 }"
            >
              <a-form-model-item
                :rules="{ required: true, message: '必填项不能为空', trigger: 'blur' }"
                label="负责人"
                prop="relatedId"
              >
                <a-select
                  show-search
                  allow-clear
                  placeholder="请输入姓名或工号"
                  option-label-prop="label"
                  v-model="form.relatedName"
                  @search="(name) => formFuzzySearch(name)"
                  @change="(name) => handleUserChange(name)"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
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
              <a-form-model-item
                :rules="{ required: true, message: '必填项不能为空', trigger: 'change' }"
                label="开始使用时间"
                prop="enableAt"
              >
                <a-date-picker
                  show-time
                  v-model="form.enableAt"
                  :show-time="{ format: 'HH' }"
                  format="YYYY-MM-DD HH:00"
                  value-format="YYYY-MM-DD HH:00:00"
                  style="width:100%"
                />
              </a-form-model-item>
              <div class="tip">
                <a-icon type="info-circle" class="tip-icon" />
                <p class="context">
                  设置该广告投放账户当前的使用负责人，以及设置该负责人开始使用这一账户进行广告投放的时间，用于其他模块的统计记录。
                </p>
              </div>
              <a-form-model-item label="历史负责人" prop="name" style="margin-top:35px;">
                <a-row v-for="(item, index) in form.historyRecordList" :key="index">
                  <a-col :span="8">
                    <a-select
                      show-search
                      allow-clear
                      placeholder="姓名/工号"
                      option-label-prop="label"
                      v-model.trim="item.relatedName"
                      @search="(name) => formFuzzySearch(name, index)"
                      @change="(item) => handleUserChange(item, index)"
                    >
                      <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                      <a-select-option
                        v-for="(list, idx) in item.options"
                        :value="list.employee"
                        :key="list.id"
                        :label="list.realName"
                      >
                        {{ list.employee }}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="1" style="text-align:center">--</a-col>
                  <a-col :span="14">
                    <a-range-picker
                      show-time
                      :value="[item.enableAt, item.disableAt]"
                      format="YYYY-MM-DD HH:mm:ss"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      style="width:auto"
                      :placeholder="['开始时间', '结束时间']"
                      @change="(date) => handleDateChange(date, index, 'form')"
                    />
                  </a-col>
                  <a-col :span="1" style="text-align:right">
                    <a-icon
                      type="minus-circle"
                      class="remove-icon"
                      @click="handleRemoveItem('form', index)"
                    />
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="23">
                    <a-button type="dashed" block @click="handleAddItem('form')">
                      <a-icon type="plus" style="font-size:12px;" />
                      添加
                    </a-button>
                  </a-col>
                </a-row>
              </a-form-model-item>
              <div class="tip">
                <a-icon type="info-circle" class="tip-icon" />
                <p class="context">
                  设置该广告投放账户历史的负责人人员，以及对应的时间段，用于其他模块的统计记录。
                </p>
              </div>
            </a-form-model>
            <div class="drawer-footer">
              <a-button
                type="primary"
                :loading="btnLoading"
                :style="{ marginRight: '8px' }"
                @click="onSubmit('form')"
              >
                提交
              </a-button>
              <a-button @click="closeDrawer">取消</a-button>
            </div>
          </a-tab-pane>

          <!-- 推广位TAb -->
          <a-tab-pane class="tab-panel-form" key="promotionForm" tab="推广位" force-render>
            <a-form-model
              ref="promotionForm"
              :model="promotionForm"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 16 }"
            >
              <a-form-model-item
                :rules="{ required: true, message: '必填项不能为空', trigger: 'blur' }"
                label="推广位"
                prop="relatedName"
              >
                <a-select
                  show-search
                  allow-clear
                  option-label-prop="label"
                  v-model.trim="promotionForm.relatedName"
                  placeholder="请输入推广位ID/名称"
                  @search="
                    (name) => handleSelectFuzzySearch(name, 'promotionForm', 'promotionOptions')
                  "
                  @change="
                    (keyword) =>
                      handleSelectFuzzyChange(keyword, 'promotionForm', 'promotionOptions')
                  "
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option
                    v-for="item in promotionOptions"
                    :value="item.promoter"
                    :key="item.promoterId"
                    :label="item.promoterName"
                  >
                    {{ item.promoter }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                :rules="{ required: true, message: '必填项不能为空', trigger: 'change' }"
                label="开始使用时间"
                prop="enableAt"
              >
                <a-date-picker
                  show-time
                  v-model="promotionForm.enableAt"
                  :show-time="{ format: 'HH' }"
                  format="YYYY-MM-DD HH:00"
                  value-format="YYYY-MM-DD HH:00:00"
                  style="width:100%"
                />
              </a-form-model-item>
              <div class="tip">
                <a-icon type="info-circle" class="tip-icon" />
                <span class="context">
                  设置该广告投放账户当前关联的推广位，以及设置该推广位与本账户正式开始关联投放的时间，用于其他模块的统计记录。
                </span>
              </div>
              <a-form-model-item label="历史推广位" style="margin-top:35px;margin-bottom:5px">
                <a-row v-for="(item, index) in promotionForm.historyRecordList" :key="index">
                  <a-col :span="8">
                    <a-select
                      show-search
                      allow-clear
                      v-model.trim="item.relatedName"
                      option-label-prop="label"
                      placeholder="推广位ID/名称"
                      @search="
                        (name) =>
                          handleSelectFuzzySearch(name, 'promotionForm', 'promotionOptions', index)
                      "
                      @change="
                        (keyword) =>
                          handleSelectFuzzyChange(
                            keyword,
                            'promotionForm',
                            'promotionOptions',
                            index
                          )
                      "
                    >
                      <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                      <a-select-option
                        v-for="(list, idx) in item.options"
                        :value="list.promoter"
                        :key="list.promoterId"
                        :label="list.promoterName"
                      >
                        {{ list.promoter }}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="1" style="text-align:center">--</a-col>
                  <a-col :span="14">
                    <a-range-picker
                      show-time
                      :value="[item.enableAt, item.disableAt]"
                      style="width:auto"
                      format="YYYY-MM-DD HH:mm:ss"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      :placeholder="['开始时间', '结束时间']"
                      @change="(date) => handleDateChange(date, index, 'promotionForm')"
                    />
                  </a-col>
                  <a-col :span="1" style="text-align:right">
                    <a-icon
                      type="minus-circle"
                      class="remove-icon"
                      @click="handleRemoveItem('promotionForm', index)"
                    />
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="23">
                    <a-button type="dashed" block @click="handleAddItem('promotionForm')">
                      <a-icon type="plus" style="font-size:12px;" />
                      添加
                    </a-button>
                  </a-col>
                </a-row>
              </a-form-model-item>
              <div class="tip">
                <a-icon type="info-circle" class="tip-icon" />
                <p class="context">
                  设置该广告投放账户关联的历史推广位，以及对应的时间段，用于其他模块的统计记录。
                </p>
              </div>
            </a-form-model>
            <div class="drawer-footer">
              <a-button
                type="primary"
                :style="{ marginRight: '8px' }"
                :loading="btnLoading"
                @click="onSubmit('promotionForm')"
              >
                提交
              </a-button>
              <a-button @click="closeDrawer">取消</a-button>
            </div>
          </a-tab-pane>

          <!-- 产品TAb -->
          <a-tab-pane class="tab-panel-form" key="productionForm" tab="产品">
            <a-form-model
              ref="productionForm"
              :model="productionForm"
              :label-col="{ span: 4 }"
              :wrapper-col="{ span: 16 }"
            >
              <a-form-model-item
                :rules="{ required: true, message: '必填项不能为空', trigger: 'blur' }"
                label="商品"
                prop="relatedName"
              >
                <a-select
                  show-search
                  allow-clear
                  placeholder="请输入商品ID/名称"
                  v-model.trim="productionForm.relatedName"
                  @search="(name) => productionFormFuzzySearch(name)"
                  @change="(name) => handleChangeProductSelect(name)"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option
                    v-for="item in productionOptions"
                    :value="item.product"
                    :key="item.productId"
                  >
                    {{ item.product }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item
                :rules="{ required: true, message: '必填项不能为空', trigger: 'change' }"
                label="开始使用时间"
                prop="enableAt"
              >
                <a-date-picker
                  show-time
                  v-model="productionForm.enableAt"
                  :show-time="{ format: 'HH' }"
                  format="YYYY-MM-DD HH:00"
                  value-format="YYYY-MM-DD HH:00:00"
                  style="width:100%"
                />
              </a-form-model-item>
              <div class="tip">
                <a-icon type="info-circle" class="tip-icon" />
                <p class="context">
                  设置该广告投放账户当前关联的商品，以及设置该推广位与本账户正式
                  开始关联投放的时间，用于其他模块的统计记录。
                </p>
              </div>
              <a-form-model-item
                label="历史商品"
                prop="name"
                style="margin-top:35px;margin-bottom:5px"
              >
                <a-row v-for="(item, index) in productionForm.historyRecordList" :key="index">
                  <a-col :span="8">
                    <a-select
                      show-search
                      allow-clear
                      placeholder="商品ID/名称"
                      option-label-prop="label"
                      v-model.trim="item.relatedName"
                      @search="(name) => productionFormFuzzySearch(name, index)"
                      @change="(item) => handleChangeProductSelect(item, index)"
                    >
                      <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                      <a-select-option
                        v-for="list in item.options"
                        :value="list.product"
                        :key="list.productId"
                        :label="list.productName"
                      >
                        {{ list.product }}
                      </a-select-option>
                    </a-select>
                  </a-col>
                  <a-col :span="1" style="text-align:center">--</a-col>
                  <a-col :span="14">
                    <a-range-picker
                      show-time
                      :value="[item.enableAt, item.disableAt]"
                      format="YYYY-MM-DD HH:mm:ss"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      style="width:auto"
                      :placeholder="['开始时间', '结束时间']"
                      @change="(date) => handleDateChange(date, index, 'productionForm')"
                    />
                  </a-col>
                  <a-col :span="1" style="text-align:right">
                    <a-icon
                      type="minus-circle"
                      class="remove-icon"
                      @click="handleRemoveItem('productionForm', index)"
                    />
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="23">
                    <a-button type="dashed" block @click="handleAddItem('productionForm')">
                      <a-icon type="plus" style="font-size:12px;" />
                      添加
                    </a-button>
                  </a-col>
                </a-row>
              </a-form-model-item>
              <div class="tip">
                <a-icon type="info-circle" class="tip-icon" />
                <p class="context">
                  设置该广告投放账户关联的历史商品，以及对应的时间段，用于其他模块的统计记录。
                </p>
              </div>
            </a-form-model>
            <div class="drawer-footer">
              <a-button
                type="primary"
                :loading="btnLoading"
                :style="{ marginRight: '8px' }"
                @click="onSubmit('productionForm')"
              >
                提交
              </a-button>
              <a-button @click="closeDrawer">取消</a-button>
            </div>
          </a-tab-pane>
        </a-tabs>
        <Loading :loading="loading" />
      </div>
    </a-drawer>
  </div>
</template>

<script>
  import { debounce } from '~/utils/utils'
  import { mapMutations, mapState } from 'vuex'

  export default {
    data() {
      this.productionFormFuzzySearch = debounce(this.productionFormFuzzySearch, 500)
      this.handleSelectFuzzySearch = debounce(this.handleSelectFuzzySearch, 500)
      this.formFuzzySearch = debounce(this.formFuzzySearch, 500)

      return {
        loading: false,
        btnLoading: false,
        fetching: false,
        userOptions: [],
        promotionOptions: [],
        productionOptions: [],

        advertiserId: '',
        // 负责人表单
        formDefaultValue: '',
        form: {
          id: null,
          relatedId: '',
          advertiserId: '',
          enableAt: '',
          historyRecordList: [],
        },
        // 推广位表单
        promotionFormDefaultValue: '',
        promotionForm: { historyRecordList: [] },
        // 报表表单
        productionFormDefaultValue: '',
        productionForm: { historyRecordList: [] },
      }
    },

    computed: {
      ...mapState(['app']),
      visible: {
        get() {
          return this.app.drawerVisible.adThrowView
        },
      },
    },

    methods: {
      ...mapMutations({ setDrwaerVisible: 'app/setDrwaerVisible' }),

      openDrawer(advertiserId) {
        this.setDrwaerVisible({ name: 'adThrowView', visible: true })
        this.advertiserId = advertiserId
        this.loading = true
        this.getData('form')
      },

      closeDrawer() {
        this.form = { relatedId: '' }
        this.setDrwaerVisible({ name: 'adThrowView', visible: false })
      },

      changeTabs(name) {
        this.getData(name)
      },

      // 日期选择器值更改
      handleDateChange(date, index, formName) {
        if (date && date.length) {
          this[formName].historyRecordList[index].enableAt = date[0]
          this[formName].historyRecordList[index].disableAt = date[1]
        }
      },

      // 新增
      handleAddItem(formName) {
        this[formName].historyRecordList.push({
          advertiserId: this.advertiserId,
          relatedId: undefined,
          relatedName: undefined,
          enableAt: '',
          disableAt: '',
          options: [],
        })
      },

      // 删减
      handleRemoveItem(formName, idx) {
        this[formName].historyRecordList.splice(idx, 1)
      },

      // 模糊搜索
      handleSelectFuzzySearch(keyword, name, opName, idx) {
        if (!keyword) return this.handleOptionData(idx, name, opName)
        this.fetching = true
        this.$API
          .getPromotionList(keyword)
          .then(({ code, data }) => {
            this.fetching = false
            if (code === 0) {
              this.handleOptionData(idx, name, opName, data, false)
            }
          })
          .catch(() => (this.fetching = false))
      },

      // 模糊搜索框的值更改
      handleSelectFuzzyChange(item, name, opName, idx) {
        if (item === '' || item === undefined) return this.handleOptionData(idx, name, opName)
        const [relatedId, relatedName] = item.split('/')
        // 商品模糊搜索
        if (idx === undefined) {
          this[name].relatedId = relatedId.trim()
          this[name].relatedName = relatedName.trim()
        } else if (this[name].historyRecordList[idx]) {
          // 历史商品模糊搜索
          this[name].historyRecordList[idx].relatedId = relatedId.trim()
          this[name].historyRecordList[idx].relatedName = relatedName.trim()
        }
      },

      // 用户模糊搜索发生改变
      handleUserChange(item, idx) {
        if (item === '' || item === undefined)
          return this.handleOptionData(idx, 'form', 'userOptions')

        const [relatedName, relatedId] = item.split('/')
        // 负责人模糊搜索
        if (idx === undefined) {
          this.form.relatedId = relatedId.trim()
          this.form.relatedName = relatedName.trim()
        } else if (this.form.historyRecordList[idx]) {
          // 历史负责人商品模糊搜索
          this.form.historyRecordList[idx].relatedId = relatedId.trim()
          this.form.historyRecordList[idx].relatedName = relatedName.trim()
        }
      },

      // 产品搜索框的值发生改变
      handleChangeProductSelect(item, idx) {
        if (item === '' || item === undefined)
          return this.handleOptionData(idx, 'productionForm', 'productionOptions')

        const [relatedId, relatedName] = item.split('/')
        // 商品模糊搜索
        if (idx === undefined) {
          this.productionForm.relatedId = relatedId
          this.productionForm.relatedName = relatedName
        } else if (this.productionForm.historyRecordList[idx]) {
          // 历史商品模糊搜索
          this.productionForm.historyRecordList[idx].relatedId = relatedId
          this.productionForm.historyRecordList[idx].relatedName = relatedName
        }
      },

      // 清空或者赋值操作
      handleOptionData(idx, name, opName, data, isClear = true) {
        if (idx !== undefined) {
          this[name].historyRecordList[idx].options = isClear ? [] : data
        } else {
          this[opName] = isClear ? [] : data
        }
      },

      // 负责人模糊搜索
      formFuzzySearch(name, idx) {
        this.fetching = true
        this.$API
          .getUsers({ name, perPage: 50 })
          .then(({ code, data: { list } }) => {
            this.fetching = false
            if (code === 0) {
              if (idx !== undefined) {
                this.form.historyRecordList[idx].options = list.map((item) => ({
                  ...item,
                  employee: `${item.realName} / ${item.username}`,
                }))
              } else {
                this.userOptions = list.map((item) => ({
                  ...item,
                  employee: `${item.realName} / ${item.username}`,
                }))
              }
            }
          })
          .catch(() => (this.fetching = false))
      },

      // 推广位模糊搜索
      promotionFormFuzzySearch(name, idx) {
        if (name === '' || !name.trim())
          return this.handleOptionData(idx, 'promotionForm', 'promotionOptions')

        this.fetching = true
        this.$API
          .getPromotionList(name)
          .then(({ code, data }) => {
            this.fetching = false
            if (code === 0) {
              this.handleOptionData(idx, 'promotionForm', 'promotionOptions', data, false)
            }
          })
          .catch(() => (this.fetching = false))
      },

      // 产品模糊搜索
      productionFormFuzzySearch(name, idx) {
        if (name === '' || !name.trim())
          return this.handleOptionData(idx, 'productionForm', 'productionOptions')
        this.fetching = true
        this.$API
          .getProductList(name)
          .then(({ code, data }) => {
            this.fetching = false
            if (code === 0) {
              this.handleOptionData(idx, 'productionForm', 'productionOptions', data, false)
            }
          })
          .catch(() => (this.fetching = false))
      },

      // 提交表单
      onSubmit(name) {
        const methodsMapping = {
          form: 'putSearchPersonInCharge',
          promotionForm: 'putRelatedPromotion',
          productionForm: 'putRelatedProduct',
        }
        const params = this[name]
        const historyRecordList = []
        params.historyRecordList.forEach((item) => {
          delete item.options
          if (!item.relatedId || !item.disableAt) return
          historyRecordList.push(item)
        })
        params.historyRecordList = historyRecordList
        delete params[`${name}Name`]
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (!params.id) delete params.id
            params.advertiserId = this.advertiserId
            this.btnLoading = true
            this.$API[methodsMapping[name]](this[name])
              .then(({ code, data }) => {
                this.btnLoading = false
                if (code === 0) {
                  this.$message.success(data)
                  this.closeDrawer()
                }
              })
              .catch(() => (this.btnLoading = false))
          }
        })
      },

      // 获取详情数据
      getData(formName) {
        const methodsMapping = {
          form: 'getSearchPersonInCharge',
          promotionForm: 'getRelatedPromotion',
          productionForm: 'getRelatedProduct',
        }
        this.$API[methodsMapping[formName]](this.advertiserId)
          .then(({ code, data }) => {
            setTimeout(() => (this.loading = false), 500)
            if (code === 0) {
              const { relatedId, relatedName } = data
              data.historyRecordList = data.historyRecordList.map((item) => ({
                ...item,
                options: [],
              }))
              this[formName] = data
              this[formName].relatedId = relatedId ? relatedId : undefined
              this[formName].relatedName = relatedName ? relatedName : undefined
            }
          })
          .catch(() => (this.loading = false))
      },
    },
  }
</script>
<style lang="less" scoped>
  .drawer-header {
    display: flex;
    justify-content: space-between;

    .close-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 45px;
      height: 45px;
      font-size: 16px;
      cursor: pointer;
      border-bottom: 1px solid #e8e8e8;
      background-color: #1890ff;
      color: #fff;
      &:hover {
        opacity: 0.8;
      }
    }

    .tabs {
      width: calc(100% - 20px);
    }
  }
  .drawer-footer {
    margin-top: 20px;
    margin-left: 127px;
  }

  .setting-wrap {
    .tip {
      display: flex;
      padding-left: 104px;
      height: 40px;
      color: #999;
      font-size: 12px;
      .context {
        width: 505px;
        margin-left: 10px;
      }

      &-icon {
        margin-top: 5px;
        margin-bottom: 10px;
        cursor: pointer;
        color: #1890ff;
      }
    }

    .remove-icon {
      cursor: pointer;
      &:hover {
        color: #ff4d4f;
      }
    }

    /deep/ .ant-drawer-body {
      padding: 0;
    }
  }
</style>
