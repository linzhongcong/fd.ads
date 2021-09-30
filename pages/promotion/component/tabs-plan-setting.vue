<!--
 * @Author: lizheng
 * @Date: 2021-02-23 09:53:24
 * @LastEditTime: 2021-04-13 15:52:04
 * @LastEditors: Please set LastEditors
 * @Description: 批量设置成交信息
 * @FilePath: \ads\pages\promotion\component\tabs-plan-setting.vue
-->

<template>
  <div>
    <a-modal :width="1220" v-model="visible" title="批量设置成交信息">
      <h3 style="margin-bottom:24px">已选2个广告计划</h3>
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
        <a-col>
          <a-table
            bordered
            :row-key="(r) => r.key"
            :columns="settingColumns"
            :data-source="dataSource"
          />
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
  import SettingForm from './tabs-plan-setting-form'

  export default {
    components: { SettingForm },

    data() {
      return {
        visible: false,
        currentMode: 'unify',
        settingColumns: [
          {
            title: '广告计划',
            dataIndex: 'plan',
            key: 'plan',
          },
          {
            title: '当前推广位',
            dataIndex: '1',
            key: '1',
          },
          {
            title: '当前推广位',
            dataIndex: '2',
            key: '2',
          },
          {
            title: '当前商品',
            dataIndex: '3',
            key: '3',
          },
          {
            title: '当前商品ID',
            dataIndex: '4',
            key: '4',
          },
          {
            width: 350,
            title: '统一设置成交信息',
            dataIndex: 'unify',
            key: 'unify',
            scopedSlots: { customRender: 'unify' },
            customRender: (val, row, idx) => {
              const children = <SettingForm />
              const obj = { children, attrs: {} }
              obj.attrs.rowSpan = idx ? 0 : val
              return obj
            },
          },
        ],
        dataSource: [
          { plan: '001', 1: 555, 2: 4444, 3: 3333, 4: 4444, 5: 555, key: '1', unify: 3 },
        ],
        form: {},
      }
    },

    methods: {
      openModal(e) {
        console.log('e', e)
        this.visible = true
      },
    },
  }
</script>

<style lang="less" scoped>
  .deal-modal-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
</style>
