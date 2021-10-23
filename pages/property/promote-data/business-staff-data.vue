<!--
 * @Author: your name
 * @Date: 2021-10-13 08:36:55
 * @LastEditTime: 2021-10-15 17:50:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \frs.fandow.come:\my_work\ads.fandow.com\pages\property\promote-data\business-staff-data.vue
-->
<template>
  <div class="business-staff">
    <a-tabs :activeKey="activeKey" @change="tabsChange">
      <a-tab-pane key="1">
        <span slot="tab">
          销售数据
        </span>
        <promote-sales-data></promote-sales-data>
      </a-tab-pane>
      <a-tab-pane key="2">
        <span slot="tab">
          关键词
        </span>
        <!-- <firstNews></firstNews> -->
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import promoteSalesData from './components/promote-sales-data.vue'
  export default {
    data() {
      return {
        activeKey: '1',
      }
    },

    components: {
      promoteSalesData,
    },

    mounted() {},

    methods: {
      tabsChange(val) {
        if (val === '2') {
          this.$message.warning('功能暂未开放，敬请期待')
          this.activeKey = '1'
        }
      },
    },
  }
</script>

<style scoped lang="less">
  .business-staff-add {
    width: 100%;
    height: calc(100vh - 200px);
    box-sizing: border-box;
    background-color: #fff;
    &_header {
      width: 100%;
      height: 48px;
      padding: 10px;
      display: flex;
      align-items: center;
    }
    &_icon {
      width: 4px;
      height: 100%;
      margin: 0 10px 0 0;
      display: inline-block;
      background-color: #4e98f5;
    }
  }
  /deep/.ant-tabs-nav {
    margin-left: 10px;
  }
</style>

<style lang="less">
  .business-staff {
    padding-top: 20px;
    min-height: calc(100vh - 64px);
    width: calc(100vw - 160px);
  }
</style>
