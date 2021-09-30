<!--
 * @Author: your name
 * @Date: 2021-03-18 16:37:49
 * @LastEditTime: 2021-03-18 16:52:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads\pages\promotion\component\tabs-plan-setting-form.vue
-->
<template>
  <div>
    <a-form-model ref="form" :model="form" v-bind="layout">
      <a-form-model-item
        :rules="{ required: true, message: '必填项不能为空', trigger: 'blur' }"
        label="商品ID"
        prop="name"
      >
        <a-select allow-clear v-model="form.name" placeholder="请选择">
          <a-select-option value="shanghai">Zone one</a-select-option>
          <a-select-option value="beijing">Zone two</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        :rules="{ required: true, message: '必填项不能为空', trigger: 'blur' }"
        label="推广位ID"
        prop="region"
      >
        <a-select allow-clear v-model="form.region" placeholder="请选择">
          <a-select-option value="shanghai">Zone one</a-select-option>
          <a-select-option value="beijing">Zone two</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        form: {},
        rules: {},
        layout: {
          labelCol: { span: 6 },
          wrapperCol: { span: 16 },
        },
      }
    },
  }
</script>
