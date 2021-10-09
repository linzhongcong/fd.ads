<template>
  <div>
    <a-button type="link"
              @click="operationMode('openPopup')">关联计划</a-button>
    <a-modal v-model="openPopup"
             title="关联计划"
             width="60%">
      <a-row>
        <a-col :span="12">
          <span class="mr"><span class="fw">推广位：</span>{{ rowData.promoterId }}</span>
          <span><span class="fw">推广位名称：</span>{{ rowData.promoterName }}</span>
        </a-col>
      </a-row>
      <!-- 筛选 -->
      <a-row class="mt">
        <a-col :span="22">
          <span>计划：</span>
          <a-select v-model="screenData.plan"
                    show-search
                    allow-clear
                    @search="(value) => productionFuzzySearch(value, 'planSearch')"
                    placeholder="计划ID/计划名称"
                    style="width: 20%">
            <a-select-option v-for="(item, key) in planSearch"
                             :value="item.productId"
                             :key="item.productId"
                             :label="item.productId">
              {{ item.product }}
            </a-select-option>
          </a-select>
          <span class="ml">日期：</span>
          <a-range-picker v-model="filterDateRange"
                          :ranges="range"
                          :disabled-date="(current) => current && current > this.moment().endOf('day')"
                          :allow-clear="true"
                          show-time
                          format="YYYY.MM.DD HH:mm:ss"
                          separator="至"
                          style="width:40%"
                          @change="changeDatePick">
            <a-icon slot="suffixIcon"
                    type="calendar" />
          </a-range-picker>
          <a-button type="primary"
                    class="ml">查询</a-button>
        </a-col>
        <a-col :span="2">
          <a-button type="primary"
                    icon="plus"
                    @click="operationMode('operationForm', 'add')">新建</a-button>
        </a-col>
      </a-row>
      <!-- 表格 -->
      <a-table :columns="relationPlanTable"
               :data-source="relationPlanData"
               :row-key="(record) => record.key"
               :scroll="{ y: 520 }"
               size="small"
               :pagination="pagination"
               @change="changePage"
               bordered
               class="mt">
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
                             prop="plan">
            <a-select v-model="formData.plan"
                      show-search
                      allow-clear
                      @search="(value) => productionFuzzySearch(value, 'planSearch','popup')"
                      placeholder="计划ID/计划名称"
                      style="width: 180px">
              <a-select-option :value="item.val"
                               v-for="(item, key) in planSearch"
                               :key="key">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="开始时间"
                             prop="startTime">
            <a-date-picker v-model="formData.startTime"
                           format="YYYY-MM-DD"
                           value-format="YYYY-MM-DD" />
            <a-select v-model="formData.startInterval"
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
                             prop="entTime"
                             class="aa">
            <a-date-picker v-model="formData.entTime"
                           format="YYYY-MM-DD"
                           value-format="YYYY-MM-DD" />
            <a-select v-model="formData.entInterval"
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
        </a-form-model>
        <!-- 自定义页脚 -->
        <template slot="footer">
          <a-button key="back"
                    @click="closeMode('openOperation')"> 取消 </a-button>
          <a-button key="submit"
                    type="primary"
                    @click="submit('openOperation')">
            提交
          </a-button>
        </template>
      </a-modal>
      <!-- 自定义页脚 -->
      <template slot="footer">
        <a-button key="back"
                  @click="closeMode('openPopup')"> 取消 </a-button>
        <a-button key="submit"
                  type="primary"
                  @click="submit('openPopup')">
          提交
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { log } from '@antv/g2plot/lib/utils';
import { getDateRange, debounce } from '~/utils/utils'
import { relationPlanTable, relationPlanData } from "./columns";
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
        callback(new Error('请选择开始日期'))
      }
      else if (this.formData.startTime === '' || this.formData.startInterval === '') {
        callback(new Error('请选择开始日期'))
      }
      else {
        callback()
      }
    }
    let entDataRule = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请选择结束日期'))
      }
      else if (this.formData.entTime === '' || this.formData.entInterval === '') {
        callback(new Error('请选择结束日期'))
      }
      else {
        callback()
      }
    }
    return {
      openPopup: false,
      screenData: {},
      filterDateRange: [],
      planSearch: [],
      relationPlanTable,
      relationPlanData,
      deleteRowTitle: '',
      // 分页器
      pagination: {
        size: 'small',
        total: 0,
        current: 1,
        defaultPageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total) => `共 ${total} 条`,
      },

      // 新建、编辑数据
      openOperation: false,
      operationType: "",
      formData: {
        startTime: '',
        startInterval: '',
        entTime: '',
        entInterval: ''
      },
      timeInterval: [],
      formRules: {
        plan: [
          { required: true, message: "请选择计划ID/计划名称", trigger: "change" },
        ],
        startTime: [
          { required: true, validator: startDataRule, trigger: 'change' },
        ],
        entTime: [
          { required: true, validator: entDataRule, trigger: 'change' },
        ],
      },
    };
  },
  created () {
    this.range = getDateRange(this)
  },
  // watch: {
  //   // 日期发生改变重新调用接口
  //   filterDateRange: {
  //     deep: true,
  //     immediate: true,
  //     handler(nDate) {
  //       this.searchObj.timeStart = nDate && nDate[0].format('YYYY-MM-DD')
  //       this.searchObj.timeEnd = nDate && nDate[1].format('YYYY-MM-DD')
  //     },
  //   },
  // }
  computed: {
    // 动态赋值时段数据
    timeSlot () {
      for (let i = 0; i < 24; i++) {
        let index = String(i)
        if (i < 10) {
          index = 0 + index
        }
        this.timeInterval.push({ label: index, value: `moment${index}` })
      }
    }
  },
  methods: {
    // 模糊搜索
    productionFuzzySearch (value, array, type) {
      console.log(value, array, type);
      // if (value === '' || !value.trim()) return (this.planSearch = [])
      // this.$API
      //   .getProductList(value.trim())
      //   .then(({ code, data }) => {
      //     this.fetching = false
      //     if (code === 0) this[array] = data
      //   })
      //   .catch(() => (this.fetching = false))
    },
    // 时间选择器
    changeDatePick (date) {
      this.setDateTypeFunc('startTime', 'entTime', date)
    },
    // 时间赋值公用函数
    setDateTypeFunc (...rest) {
      if (rest[2].length) {
        this.screenData[rest[0]] = rest[2][0].format('YYYY-MM-DD HH:mm:ss')
        this.screenData[rest[1]] = rest[2][1].format('YYYY-MM-DD HH:mm:ss')
      } else {
        this.screenData[rest[0]] = ''
        this.screenData[rest[1]] = ''
      }
      console.log(this.screenData);
    },

    changePage (page) {
      this.pagination.current = page.current
      this.pagination.pageSize = page.pageSize
      this.relationPlanData = []
    },
    // 弹窗
    operationMode (prop, type, data) {
      this.timeSlot
      if (prop === 'openPopup') {
        this.openPopup = true
        this.screenData = {}
      }
      else if (prop === 'operationForm') {
        this.openOperation = true;
        this.operationType = type;
        // 解决每次进来清空表单
        if (this.$refs[prop] !== undefined) {
          this.$refs[prop].resetFields();
          this.formData = {
            startTime: '',
            startInterval: '',
            entTime: '',
            entInterval: ''
          };
        }
      }
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
        console.log(this.screenData);
      }
      else if (type === 'openOperation') {
        this.compareDate(this.formData.startTime, this.formData.entTime, this.formData.startInterval, this.formData.entInterval)
        this.$refs.operationForm.validate((vaild) => {
          console.log(this.formData);
          if (!vaild) return

        })
      }
    },
    // 比较日期
    compareDate (startTime, entTime, startInterval, entInterval) {
      let oneDate = new Date(startTime);
      var twoDate = new Date(entTime);
      if (oneDate.getTime() > twoDate.getTime() || entInterval < startInterval) {
        console.log('第二个大');
      } else {
        console.log('第一个大');
      }
    },
    // 删除某条商品信息
    deletePromotionItem ({ planID }) {
      const that = this
      this.$confirm({
        icon: 'exclamation-circle',
        title: (h) => (
          <div>
            <p>
              确定要删除?
            </p>
            <p>计划：{planID}</p>
          </div>
        ),
        // onOk () {
        //   that.$API.deletePromoter(id).then(({ code, data }) => {
        //     if (code === 0) {
        //       that.$message.success(data)
        //       that.getInitData()
        //     }
        //   })
        // },
      })
    }
  },
};
</script>

<style lang="less" scoped>
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
</style>