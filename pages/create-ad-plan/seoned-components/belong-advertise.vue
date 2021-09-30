<!--
 * @Author: huangjianhan
 * @Date: 2021-05-18 16:19:26
 * @LastEditTime: 2021-06-16 11:21:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads.fandow.com\pages\create-ad-plan\seoned-components\belong-advertise.vue
-->
<template>
  <div class="form-component_element">
    <div class="component-element_letter">所属广告组</div>
    <div class="component-element_adname">
      广告组名称：
      <span class="strong-letter">
        {{ $route.query.campaignName + '（' + $route.query.campaignId + '）' }}
      </span>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="less" scoped>
  @import '../css/component.css';
</style>
