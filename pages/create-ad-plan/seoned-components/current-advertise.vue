<!--
 * @Author: huangjianhan
 * @Date: 2021-05-18 17:05:28
 * @LastEditTime: 2021-06-24 14:00:30
 * @LastEditors: Please set LastEditors
 * @Description: 当前广告账户模块
 * @FilePath: \ads.fandow.com\pages\create-ad-plan\seoned-components\current-advertise.vue
-->

<template>
  <div class="form-component_element last-component_element">
    <div class="component-element_adname">
      当前广告账户：
      <strong>{{ adInfo.advertiserName }}（{{ adInfo.advertiserId }}）</strong>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        adInfo: {},
      }
    },

    mounted() {
      this.initData()
    },

    methods: {
      initData() {
        const adInfo = localStorage.getItem('adInfo')
        adInfo && (this.adInfo = JSON.parse(adInfo))
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../css/component.css';
</style>
