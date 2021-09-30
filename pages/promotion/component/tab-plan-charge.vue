<!--
 * @Author: lizheng
 * @Date: 2021-04-12 15:15:24
 * @LastEditTime: 2021-04-16 13:36:43
 * @LastEditors: Please set LastEditors
 * @Description: 批量设置负责人信息
 * @FilePath: \ads\pages\promotion\component\tab-plan-charge.vue
-->

<template>
  <div v-if="visible">
    <a-modal :width="1150" v-model="visible" title="批量设置负责人">
      <h3 class="deal-modal-title">已选{{ dataSource.length }}个广告计划</h3>
      <a-row class="deal-modal-row">
        <a-col span="2"><h4>修改规则</h4></a-col>
        <a-col span="12">
          <a-radio-group v-model="currentMode" :style="{ marginBottom: '8px' }">
            <a-radio-button value="unify">统一修改</a-radio-button>
            <a-radio-button value="diff">分别修改</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>

      <!-- 统一设置负责人 -->
      <a-row v-show="currentMode === 'unify'">
        <a-col class="deal-modal-col">
          <a-table
            bordered
            class="deal-modal-col-tb"
            size="small"
            :pagination="false"
            :row-key="(r) => r.key"
            :scroll="{ x: 720, y: 460 }"
            :columns="settingColumns"
            :data-source="dataSource"
            :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
          />
          <SettingChargeForm
            ref="chargeForm"
            class="deal-modal-col-form"
            @onChange="handleFormChange"
          />
        </a-col>
      </a-row>

      <!-- 分别设置负责人 -->
      <a-table
        v-show="currentMode === 'diff'"
        bordered
        size="small"
        :pagination="false"
        :scroll="{ y: 460 }"
        :columns="diffSettingColumns"
        :data-source="diffDataSource"
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
      >
        <template slot="settingName" slot-scope="text, record, index">
          <span style="margin-right:10px;">负责人</span>
          <a-select
            style="width:200px"
            show-search
            allow-clear
            placeholder="请输入姓名/工号"
            option-label-prop="label"
            :value="text ? text : undefined"
            @search="(name) => formFuzzySearch(name, index)"
            @change="(item) => handleUserChange(item, index)"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option
              v-for="(list, idx) in record.options"
              :value="list.employee"
              :key="list.id"
              :label="list.realName"
            >
              {{ list.employee }}
            </a-select-option>
          </a-select>
        </template>
      </a-table>

      <div slot="footer">
        <a-button @click="visible = false">取消</a-button>
        <a-button type="primary" :loading="btnLoading" @click="onSave">确认</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import { debounce } from '~/utils/utils'
  import SettingChargeForm from './tabs-plan-setting-charge-form'

  export default {
    components: { SettingChargeForm },

    data() {
      this.formFuzzySearch = debounce(this.formFuzzySearch, 500)
      return {
        visible: false,
        fetching: false,
        btnLoading: false,
        currentMode: 'unify',

        //  统一设置负责人表格字段
        uniteForm: [],
        dataSource: [],
        settingColumns: [
          {
            title: '广告计划',
            dataIndex: 'name',
            key: 'plan',
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '当前负责人',
            dataIndex: 'realName',
            key: 'realName',
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
        ],

        // 分别设置负责人表格字段
        separateForm: [],
        diffDataSource: [],
        diffSettingColumns: [
          {
            title: '广告计划',
            dataIndex: 'name',
            key: 'plan',
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '当前负责人',
            dataIndex: 'realName',
            key: 'realName',
            width: 200,
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '分别设置负责人',
            dataIndex: 'settingName',
            scopedSlots: { customRender: 'settingName' },
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
        ],

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
      }
    },

    methods: {
      // 打开弹窗
      openModal(data = []) {
        this.visible = true
        this.dataSource = data
        this.dataSource[0].unify = data.length
        this.diffDataSource = data.map((item) => ({
          ...item,
          settingName: item.realName,
          options: [],
        }))
      },

      // 统一设置负责人表单组件回调
      handleFormChange({ username, realName }) {
        this.uniteForm = this.dataSource.map(({ adId }) => ({ realName, username, adId }))
      },

      // 用户模糊搜索发生改变
      handleUserChange(item = '', idx) {
        const [realName, username] = item.split('/')
        const { adId } = this.diffDataSource[idx]
        this.diffDataSource[idx].settingName = realName ? realName : undefined
        this.separateForm[idx] = { realName, username, adId }
      },

      // 负责人模糊搜索
      formFuzzySearch(name, idx) {
        this.fetching = true
        this.$API
          .getUsers({ name, perPage: 50 })
          .then(({ code, data: { list } }) => {
            this.fetching = false
            if (code === 0) {
              this.diffDataSource[idx].options = list.map((item) => ({
                ...item,
                employee: `${item.realName} / ${item.username}`,
              }))
            }
          })
          .catch(() => (this.fetching = false))
      },

      // 保存修改负责人表单
      onSave() {
        const params = this.currentMode === 'diff' ? this.separateForm : this.uniteForm
        this.btnLoading = true
        this.$API
          .putPromotionPlanPersonCharge(params)
          .then(({ code, data }) => {
            this.btnLoading = false
            if (code === 0) {
              this.$message.success(data)
              this.visible = false
              this.$emit('onSave', 'success')
            }
          })
          .catch((err) => {
            this.btnLoading = false
            this.visible = true
          })
      },
    },
  }
</script>

<style lang="less" scoped>
  .deal-modal-title {
    margin-bottom: 24px;
  }

  .deal-modal-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .deal-modal-col {
    display: flex;

    .deal-modal-tb {
      /deep/.ant-table-small {
        min-height: 146px;
      }
    }

    .deal-modal-form {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(100% - 720px);
      border: 1px solid #e8e8e8;
      padding: 0 10px;
      border-left: none;
      border-radius: 0 4px 4px 0;
    }
  }
  @import '~/assets/css/table.less';
</style>
