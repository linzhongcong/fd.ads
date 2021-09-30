<!--
 * @Author: lizheng
 * @Date: 2021-04-05 14:50:37
 * @LastEditTime: 2021-05-24 17:08:52
 * @LastEditors: Please set LastEditors
 * @Description: 创建广告计划
 * @FilePath: \ads\pages\create-plan\index.vue
-->
<template>
  <div>
    <create-ad-planSteps :pageStep="currentStep" />
    <form-commponent />
  </div>
</template>

<script>
  import CreateAdPlanSteps from './components/create-ad-plan-steps'
  import FormCommponent from './components/form-commponent'

  export default {
    layout: 'create',
    components: {
      CreateAdPlanSteps,
      FormCommponent,
    },

    data() {
      return {
        currentStep: 'plan',
      }
    },
  }
</script>
<style lang="less" scoped></style>
