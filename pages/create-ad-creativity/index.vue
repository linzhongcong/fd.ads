<!--
 * @Author: huangjianhan
 * @Date: 2021-05-24 16:58:20
 * @LastEditTime: 2021-05-26 14:34:43
 * @LastEditors: Please set LastEditors
 * @Description: 创建广告创意
 * @FilePath: \ads.fandow.com\pages\create-ad-creativity\index.vue
-->
<template>
  <div>
    <create-ad-plan-steps :pageStep="currentStep" />
    <creativity-content />
  </div>
</template>

<script>
  import CreateAdPlanSteps from '../create-ad-plan/components/create-ad-plan-steps'
  import CreativityContent from './component/creativity-content'
  export default {
    layout: 'create',
    components: {
      CreateAdPlanSteps,
      CreativityContent,
    },
    data() {
      return {
        currentStep: 'creativity',
      }
    },
  }
</script>

<style scoped></style>
