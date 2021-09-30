<!--
 * @Author:lizheng
 * @Date: 2021-03-18 10:52:36
 * @LastEditTime: 2021-03-23 16:03:47
 * @LastEditors: Please set LastEditors
 * @Description: 批量设置大投信息
 * @FilePath: \ads\pages\promotion\component\tabs-plan-deal.vue
-->

<template>
  <div class="deal-modal">
    <a-modal :width="1150" v-model="visible" title="批量设置大投信息">
      <h3 class="deal-modal-title">已选{{ dataSource.length }}个广告计划</h3>
      <a-row class="deal-modal-row">
        <a-col span="2"><h4>修改规则</h4></a-col>
        <a-col span="12">
          <a-radio-group v-model="currentMode" :style="{ marginBottom: '8px' }">
            <a-radio-button value="unify">统一修改</a-radio-button>
            <a-radio-button disabled value="diff">分别修改</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-row>
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
          <DealForm ref="dealForm" class="deal-modal-col-form" @onChange="handleFormChange" />
        </a-col>
      </a-row>

      <div slot="footer">
        <a-button @click="visible = false">取消</a-button>
        <a-button type="primary" @click="onSave">确认</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import DealForm from './tabs-plan-deal-form'

  export default {
    components: { DealForm },

    data() {
      return {
        visible: false,
        currentMode: 'unify',
        settingColumns: [
          {
            title: '广告计划',
            dataIndex: 'name',
            key: 'plan',
            width: 250,
            ellipsis: true,
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '是否为大投',
            dataIndex: 'isBigPut',
            key: 'isBigPut',
            width: 110,
            ellipsis: true,
            customHeaderCell: () => ({ style: { height: '47px' } }),
            customRender: (text) => (Number(text) ? '是' : '否'),
          },
          {
            title: '备注',
            dataIndex: 'bigPutRemark',
            key: 'bigPutRemark',
            width: 250,
            ellipsis: true,
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

        dataSource: [],
        btnLoading: false,
        form: {},
      }
    },

    methods: {
      openModal(data) {
        this.visible = true
        this.dataSource = data
        this.dataSource[0].length = this.dataSource.length
      },

      handleFormChange(form) {
        this.form = form
      },

      onSave() {
        let params = []
        const { bigPutRemark, isBigPut } = this.form
        if (isBigPut === null || isBigPut === undefined)
          return this.$message.error('必填项不能为空!')
        params = this.dataSource.map(({ adId, campaignId, advertiserId }) => ({
          adId,
          campaignId,
          advertiserId,
          bigPutRemark,
          isBigPut,
        }))
        this.btnLoading = true
        this.$API
          .putPromotionPlanBigCost(params)
          .then(({ code, data }) => {
            this.btnLoading = false
            if (code === 0) {
              this.$message.success(data)
              this.visible = false
              this.form = {}
              this.$emit('onSave', 'success')
              this.$refs.dealForm.resetForm()
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

  .deal-modal {
    &-col {
      display: flex;

      &-tb {
        /deep/.ant-table-small {
          min-height: 146px;
        }
      }

      &-form {
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
  }

  @import '~/assets/css/table.less';
</style>
