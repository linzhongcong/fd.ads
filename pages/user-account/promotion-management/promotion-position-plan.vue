<template>
  <div>
    <a-button type="link"
              @click="operationMode('openPopup')">关联计划</a-button>
    <a-modal v-model="openPopup"
             title="关联计划"
             width="60%">
      <a-row>
        <a-col :span="12">
          <span class="mr">
            <span class="fw">推广位：</span>
            {{ rowData.promoterId }}
          </span>
          <span>
            <span class="fw">推广位名称：</span>
            {{ rowData.promoterName }}
          </span>
        </a-col>
      </a-row>
      <!-- 筛选 -->
      <a-row class="mt">
        <a-col :span="21">
          <span>计划：</span>
          <a-select v-model.trim="screenData.adId"
                    show-search
                    allow-clear
                    option-label-prop="label"
                    @search="(value) => productionFuzzySearch(value, 'planSearch')"
                    @change="changePlanName"
                    placeholder="计划ID/计划名称"
                    style="width: 38%">
            <a-spin v-if="fetching"
                    slot="notFoundContent"
                    size="small" />
            <a-select-option v-for="item in planSearch"
                             :value="item.ad"
                             :key="item.adId"
                             :label="item.name">
              {{ item.ad }}
            </a-select-option>
          </a-select>
          <span class="ml">日期：</span>
          <a-range-picker v-model="filterDateRange"
                          :ranges="range"
                          :disabled-date="(current) => current && current > this.moment().endOf('day')"
                          :allow-clear="true"
                          format="YYYY.MM.DD"
                          separator="至"
                          style="width: 28%"
                          @change="changeDatePick">
            <a-icon slot="suffixIcon"
                    type="calendar" />
          </a-range-picker>
          <a-button type="primary"
                    class="ml"
                    @click="getPlanForm('init')">查询</a-button>
        </a-col>
        <a-col :span="3">
          <a-button type="primary"
                    class="newAdd"
                    icon="plus"
                    @click="operationMode('operationForm', 'add')">
            新建
          </a-button>
        </a-col>
      </a-row>
      <!-- 表格 -->
      <a-table :columns="relationPlanTable"
               :data-source="relationPlanData"
               :row-key="(record) => record.id"
               :loading="loadingTable"
               :scroll="{ y: 520 }"
               size="small"
               :pagination="pagination"
               @change="changePage"
               bordered
               class="mt">
        <template slot="startDate"
                  slot-scope="text, record, index"
                  style="display: flex">
          <span>日期：{{record.startDate}} 时段：{{filterHour(record.startHour)}}</span>
        </template>
        <template slot="endDate"
                  slot-scope="text, record, index"
                  style="display: flex">
          <span>日期：{{record.endDate}} 时段：{{filterHour(record.endHour)}}</span>
        </template>
        <template slot="operate"
                  slot-scope="text, record, index"
                  style="display: flex">
          <a @click="operationMode('operationForm', 'edit', record)">编辑</a>
          <a style="color: red"
             @click="deletePromotionItem(record)">删除</a>
        </template>
      </a-table>
      <!-- 新建、编辑弹窗 -->
      <a-modal v-model="openOperation"
               :title="operationType === 'add' ? '新建' : '编辑'"
               width="40%"
               :dialog-style="{ top: '150px' }">
        <a-form-model ref="operationForm"
                      :model="formData"
                      :rules="formRules"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 12 }">

          <a-form-model-item label="计划"
                             prop="adId">
            <a-select v-model="formData.adId"
                      ref="planItem"
                      show-search
                      allow-clear
                      option-label-prop="label"
                      @search="(value) => productionFuzzySearch(value, 'selectPlan')"
                      @change="changeModePlan"
                      placeholder="计划ID/计划名称"
                      style="width: 278px">
              <a-spin v-if="fetching"
                      slot="notFoundContent"
                      size="small" />
              <a-select-option v-for="item in selectPlan"
                               :value="item.ad"
                               :key="item.adId"
                               :label="item.name">
                {{ item.ad }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="开始时间"
                             prop="startDate">
            <a-date-picker v-model="formData.startDate"
                           format="YYYY-MM-DD"
                           value-format="YYYY-MM-DD" />
            <a-select v-model="formData.startHour"
                      placeholder="时段"
                      style="width: 80px"
                      class="ml">
              <a-select-option :value="item.value"
                               v-for="(item, key) in timeInterval"
                               :key="key">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="结束时间"
                             prop="endDate">
            <a-date-picker v-model="formData.endDate"
                           format="YYYY-MM-DD"
                           value-format="YYYY-MM-DD" />
            <a-select v-model="formData.endHour"
                      placeholder="时段"
                      style="width: 80px"
                      class="ml">
              <a-select-option :value="item.value"
                               v-for="(item, key) in timeInterval"
                               :key="key">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-spin class="loading-wrap"
                  :spinning="modeLoading"
                  :style="{ display: modeLoading ? 'flex' : 'none' }" />
        </a-form-model>
        <!-- 自定义页脚 - 新增、编辑 -->
        <template slot="footer">
          <a-button key="back"
                    @click="closeMode('openOperation')">取消</a-button>
          <a-button key="submit"
                    type="primary"
                    :loading="btnLoading"
                    @click="submit('openOperation')">提交</a-button>
        </template>
      </a-modal>
      <!-- 自定义页脚 - 关联计划 -->
      <template slot="footer">
        <a-button key="back"
                  @click="closeMode('openPopup')">取消</a-button>
        <a-button key="submit"
                  type="primary"
                  class="footer"
                  @click="submit('openPopup')">提交</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { getDateRange, debounce } from '~/utils/utils'
import { relationPlanTable } from './columns'
export default {
  props: {
    rowData: {
      type: Object,
    },
  },
  data () {
    this.productionFuzzySearch = debounce(this.productionFuzzySearch, 500)
    let startDataRule = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请选择开始时间'))
      } else if (this.formData.startDate === '' || this.formData.startHour === '') {
        callback(new Error('请选择开始时间'))
      } else if (this.nullValue) {
        callback(new Error('请选择开始时间'))
      } else {
        callback()
      }
    }
    let entDataRule = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请选择结束时间'))
      } else if (this.formData.endDate === '' || this.formData.endHour === '') {
        callback(new Error('请选择结束时间'))
      } else if (this.nullValue) {
        callback(new Error('请选择结束时间'))
      } else if (this.triggerRules) {
        callback(new Error('结束时间不能小于开始时间'))
        this.triggerRules = false
      } else {
        callback()
      }
    }
    return {
      openPopup: false,
      screenData: {},
      filterDateRange: [],
      planSearch: [],
      relationPlanTable,
      relationPlanData: [],
      fetching: false,
      loadingTable: false,
      triggerRules: false,
      nullValue: false,
      // 分页器
      pagination: {
        size: 'small',
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total) => `共 ${total} 条`,
      },

      // 新建、编辑数据
      openOperation: false,
      btnLoading: false,
      modeLoading: false,
      operationType: '',
      formData: {},
      selectPlan: [],
      timeInterval: [],
      formRules: {
        adId: [{ required: true, message: '请选择计划ID/计划名称', trigger: 'change' }],
        startDate: [{ required: true, validator: startDataRule, trigger: 'change' }],
        endDate: [{ required: true, validator: entDataRule, trigger: 'change' }],
      },
    }
  },
  created () {
    this.range = getDateRange(this)
  },
  computed: {
    // 动态赋值时段数据
    timeSlot () {
      for (let i = 0; i < 24; i++) {
        i += ''
        if (i < 10) {
          i = 0 + i
        }
        this.timeInterval.push({ label: i, value: i })
      }
    },
  },
  methods: {
    // 获取关联计划table数据
    getPlanForm (type = "") {
      this.loadingTable = true
      let params = JSON.parse(JSON.stringify(this.screenData))
      params.promoterId = this.rowData.promoterId
      params.pageIndex = this.pagination.current
      params.pageSize = this.pagination.pageSize
      if (!params.startDate) {
        delete params.startDate
        delete params.endDate
      }
      if (type) {
        params.pageIndex = this.pagination.current = 1;
      }
      this.$API.getRelevancyPlan(params).then(({ code, data }) => {
        this.loadingTable = false
        if (code === 0) {
          this.pagination.total = data.pageCount
          this.relationPlanData = data.list
        }
      })
    },
    // 模糊搜索
    productionFuzzySearch (queryName, array) {
      if (queryName === '' || !queryName.trim()) return (this[array] = [])
      this.fetching = true
      this.$API
        .searchPlan({ queryName })
        .then(({ code, data }) => {
          this.fetching = false
          if (code === 0) this[array] = data
        })
        .catch(() => (this.fetching = false))
    },
    // 时间选择器
    changeDatePick (date) {
      this.setDateTypeFunc('startDate', 'endDate', date)
    },
    // 时间赋值公用函数
    setDateTypeFunc (...rest) {
      if (rest[2].length) {
        this.screenData[rest[0]] = rest[2][0].format('YYYY-MM-DD')
        this.screenData[rest[1]] = rest[2][1].format('YYYY-MM-DD')
      } else {
        this.screenData[rest[0]] = ''
        this.screenData[rest[1]] = ''
      }
    },
    // 计划名称选择
    changePlanName (value) {
      this.planSearch.map((item) => {
        if ([item.ad, item.adId, item.name].includes(value)) this.screenData.adId = item.adId
      })
    },
    // 弹窗计划名称选择
    changeModePlan (value) {
      this.selectPlan.map((item) => {
        if ([item.ad, item.adId, item.name].includes(value)) this.formData.adId = item.adId
        if ([item.ad, item.adId, item.name].includes(value)) this.formData.adName = item.name
      })
    },
    // 分页
    changePage (page) {
      this.pagination.current = page.current
      this.pagination.pageSize = page.pageSize
      this.relationPlanData = []
      this.getPlanForm()
    },
    // 弹窗
    operationMode (prop, type, data) {
      if (prop === 'openPopup') {
        this.openPopup = true
        this.screenData = {}
        this.planSearch = []
        this.filterDateRange = []
        this.relationPlanData = []
        this.getPlanForm()
      } else if (prop === 'operationForm') {
        this.openOperation = true
        this.operationType = type
        this.timeSlot
        // 解决每次进来清空表单
        if (this.$refs[prop] !== undefined) {
          this.$refs[prop].resetFields()
          this.formData = {}
          this.selectPlan = []
        }
        if (prop === 'operationForm' && type === 'edit') {
          this.getEdit(data)
        }
      }
    },
    // 获取编辑数据
    getEdit ({ id }) {
      this.modeLoading = true
      this.$API.getEditForm(id).then(({ code, data }) => {
        if (code === 0) {
          this.modeLoading = false
          data.startHour = this.filterHour(data.startHour)
          data.endHour = this.filterHour(data.endHour)
          this.formData = data
        }
      })
    },
    // 关闭
    closeMode (type) {
      if (type === 'openPopup') {
        this.openPopup = false
      } else if (type === 'openOperation') {
        this.openOperation = false
      }
    },
    // 提交
    submit (type) {
      if (type === 'openPopup') {
        this.openPopup = false
      } else if (type === 'openOperation') {
        this.compareDate(this.formData)
        const methodName = this.operationType === 'add' ? 'postPlan' : 'putEdit'
        this.$refs.operationForm.validate((vaild) => {
          if (!vaild) return
          this.btnLoading = true
          let params = JSON.parse(JSON.stringify(this.formData))
          params.startHour = params.startHour - 0
          params.endHour = params.endHour - 0
          params.promoterId = this.rowData.promoterId
          params.promoterName = this.rowData.promoterName
          this.$API[methodName](params).then(({ code, data, msg }) => {
            if (code === 0) {
              this.$message.success('新建成功', 1.5)
              this.btnLoading = false
              this.openOperation = false
              this.getPlanForm()
              return
            }
            this.$message.error(msg)
            this.btnLoading = false
            this.openOperation = false
          })
            .catch(() => {
              this.btnLoading = false
              this.openOperation = false
            })
        })
      }
    },
    // 比较日期
    compareDate ({ startDate, endDate, startHour, endHour }) {
      this.nullValue = false
      if (!startDate || !startHour || !endDate || !endHour) {
        this.nullValue = true
        return false
      }
      let oneDate = new Date(startDate)
      var twoDate = new Date(endDate)
      let SI = startHour
      let EI = endHour
      if (
        oneDate.getTime() > twoDate.getTime() ||
        (oneDate.getTime() === twoDate.getTime() && SI >= EI)
      ) {
        this.triggerRules = true
      }
    },
    filterHour (value) {
      return value < 10 ? `0${value}` : value
    },
    // 删除某条计划
    deletePromotionItem ({ id, adId, startDate, endDate, startHour, endHour }) {
      const that = this
      this.$confirm({
        icon: 'exclamation-circle',
        title: (h) => (
          <div>
            <p>确定要删除?</p>
            <p>计划：{adId}</p>
            <p>关联时段：{startDate} {this.filterHour(startHour)} ~ {endDate} {this.filterHour(endHour)}</p>
          </div>
        ),
        onOk () {
          let params = { id, adId }
          that.$API.deleteRelation(params).then(({ code, data }) => {
            if (code === 0) {
              that.$message.success(data)
              that.getPlanForm()
            }
          })
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.footer {
  margin-right: 8px;
}
.newAdd {
  float: right;
}
.mt {
  margin-top: 25px;
}
.mr {
  margin-right: 20px;
}
.ml {
  margin-left: 15px;
}
.fw {
  font-weight: bold;
}
.loading-wrap {
  display: flex;
  justify-content: center;
  padding-top: 30%;
  position: absolute;
  z-index: 9;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: hsla(0, 0%, 100%, 0.9);
}
</style>