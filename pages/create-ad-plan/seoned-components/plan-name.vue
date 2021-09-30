<!--
 * @Author: huangjianhan
 * @Date: 2021-05-18 17:01:38
 * @LastEditTime: 2021-06-16 11:22:45
 * @LastEditors: Please set LastEditors
 * @Description: 计划名称
 * @FilePath: \ads.fandow.com\pages\create-ad-plan\seoned-components\plan-name.vue
-->
<template>
  <div class="form-component_element">
    <div class="component-element_letter">计划名称</div>
    <div class="component-element_adname">
      <span class="hint-item"></span>
      <div class="element-style">
        计划名称
        <span class="required-style"></span>
      </div>
      <a-input v-if="pageStep === 'plan'" style="width: 360px;" v-model="adName" />
      <h3 v-else>{{ adName }}</h3>
    </div>
  </div>
</template>

<script>
  import { EventBus } from '../event-bus/event-bus.js'
  export default {
    props: {
      pageStep: {
        type: String,
        default: '',
      },
    },
    watch: {
      adName() {
        this.$emit('passPlanAd', this.adName)
      },
    },
    data() {
      return {
        // 计划名称
        adName: '',
        // 投放类型
        throwType: 'PRICING_OCPM',
        throwTypeObj: {
          PRICING_OCPM: 'oCPM',
          PRICING_CPC: 'CPM',
        },
      }
    },

    mounted() {
      this.shareData()
      this.getTimeSetPlan()
    },

    methods: {
      // 获取当前时间
      getTimeSetPlan() {
        const time = this.moment(new Date()).format('MM_DD_hh:mm:ss')
        this.adName =
          this.pageStep === 'plan'
            ? '_' + this.throwTypeObj[this.throwType] + '_' + time
            : this.$route.query.planName
      },

      // 数据共享
      shareData() {
        EventBus.$on('throwPassValue', (params) => {
          this.throwType = params
          this.getTimeSetPlan()
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../css/component.css';
</style>
