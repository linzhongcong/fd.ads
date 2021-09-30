<!--
 * @Author: your name
 * @Date: 2021-03-18 16:23:14
 * @LastEditTime: 2021-03-23 15:50:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads\pages\promotion\component\tabs-plan-deal-form.vue
-->
<template>
  <div>
    <a-form-model style="width:100%" ref="form" :model="form" v-bind="layout" :colon="false">
      <a-form-model-item
        label="是否为大投计划"
        prop="isBigPut"
        :rules="{ required: true, message: '必填项不能为空', trigger: 'change' }"
      >
        <a-radio-group v-model="form.isBigPut" @change="handleChange">
          <a-radio value="1" name="isBigPut">是</a-radio>
          <a-radio value="0" name="isBigPut">否</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="备注" prop="age">
        <a-input
          type="textarea"
          placeholder="请输入"
          :rows="2"
          v-model.trim="form.bigPutRemark"
          @change="handleChange"
        />
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        form: {},
        layout: {
          labelCol: { span: 9 },
          wrapperCol: { span: 15 },
        },
      }
    },

    methods: {
      handleChange() {
        this.$emit('onChange', this.form)
      },

      resetForm() {
        this.form = {}
      },
    },
  }
</script>
