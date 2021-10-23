<!--
 * @Author: your name
 * @Date: 2021-09-18 14:22:17
 * @LastEditTime: 2021-09-18 16:02:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oa-refactor.fandow.come:\my_work\ads.fandow.com\pages\property\promote-data\components\tableEmpty.vue
-->
<template>
  <div>
    <div><a-icon type="meh" />没有搜到任何数据</div>
    <div><img style="width:200px;" src="../../../../assets/images/noneData.png" alt=""></div>
    <div style="color:#a59898;"><b>暂无数据</b></div>
    <div>请按照导入模板，新建数据</div>
    <a-button
        style="margin-top:10px;"
        type="primary"
        @click="showModal('bussinessSalesImport')"
      >
        导入数据
    </a-button>
  </div>
</template>
<script>
import { promoteSalesImport } from '@/utils/eventBus.js'
export default {
  data() {
    return {}
  },
  methods: {
    showModal(type) {
      promoteSalesImport.$emit('showModal', type)
    }
  }
}
</script>
