<!--
 * @Author: huangjianhan
 * @Date: 2021-05-21 16:51:48
 * @LastEditTime: 2021-05-26 15:15:43
 * @LastEditors: Please set LastEditors
 * @Description: 固定的气泡提示框
 * @FilePath: \ads.fandow.com\components\fixed-component\fixed-tips.vue
-->
<template>
  <div class="ant-popover-content" style="position: relative;margin-bottom: 20px;">
    <div
      class="ant-popover-arrow"
      style="border-top: 1px solid #eceef0;border-left: 1px solid rgb(236, 238, 240);top: -3px;left: 36px;color: #f2f7f7;"
    ></div>
    <div
      class="ant-popover-inner"
      style="border: 1px solid #eceef0;width: 420px;min-height: 86px;background-color: #f2f7f7;overflow: auto;"
    >
      <div class="ant-popover-inner-content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped>
  /deep/ .ant-popover-inner {
    box-shadow: none;
  }
</style>
