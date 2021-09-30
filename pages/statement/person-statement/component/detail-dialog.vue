<!--
 * @Author: huangjianhan
 * @Date: 2021-03-23 13:25:14
 * @LastEditTime: 2021-04-06 16:37:09
 * @LastEditors: Please set LastEditors
 * @Description: 详情弹框
 * @FilePath: \ads.fandow.com\pages\statement\person-statement\component\detail-dialog.vue
-->
<template>
  <a-drawer
    class="person-detail_drawer"
    placement="right"
    :width="850"
    :closable="false"
    :visible="visible"
    @close="onClose"
    :mask="false"
  >
    <div class="drawer-header" slot="title">
      <div class="drawer-header_left">
        <a-icon type="close" :size="20" class="close-icon" @click="onClose" />
        <span class="text"></span>
      </div>
      <div class="drawer-header_right">
        <span class="drawer-header_name">{{ userDetail.realName }}</span>
        <a-range-picker
          v-model="detailFilterDateRange"
          @change="changeDatePick"
          :ranges="range"
          allowClear
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          separator="至"
          style="width:230px"
          >
            <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
      </div>
    </div>
    <div class="drawer-content">
      <a-tabs v-model="currentTab" type="card" default-active-key="1" tab-position="left">
        <a-tab-pane class="tab-pane" key="1" tab="概览">
          <detailOverview
            :detailData="filterForm"
            @changeTabs="changeTabs"
          />
        </a-tab-pane>
        <a-tab-pane class="tab-pane" key="2" tab="明细">
          <detailParticulars
            :particularsData="filterForm"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-drawer>
</template>
<script>
import { getDateRange } from '~/utils/utils'
import detailOverview from './detail-overview'
import detailParticulars from './detail-particulars'
import { mapMutations, mapState } from 'vuex'

export default {
  components: {
    detailOverview,
    detailParticulars
  },

  watch: {
    userDetail: {
      handler: function() {
        this.setDataChange()
      },
      deep: true,
      immediate: true,
    }
  },
  
  data() {
    return {
      detailFilterDateRange: null,
      filterForm: {
        timeStart: null,
        timeEnd: null,
      },
      currentTab: "1",
      userDetail: {}
    }

  },
  
  // 右侧抽屉模块
  computed: {
    ...mapState(['app']),
    visible: {
      get() {
        return this.app.drawerVisible.personView
      },
    },
  },


  created() {
    this.range = getDateRange(this)
  },

  methods: {
    ...mapMutations({ setDrwaerVisible: 'app/setDrwaerVisible' }),

    onOpen(data) {
      this.userDetail = data
      this.setDrwaerVisible({ visible: true, name: 'personView' })

    },

    onClose() {
      this.setDrwaerVisible({ visible: false, name: 'personView' })
    },

    changeTabs(params) {
      this.currentTab = params[0]
      this.$set(this.filterForm, 'productId', params[1])
    },
    
    // 时间选择器
    changeDatePick(date) {
      if (date.length) {
        this.filterForm.timeStart = date[0]
        this.filterForm.timeEnd = date[1]
      } else {
        this.filterForm.timeStart = ''
        this.filterForm.timeEnd = ''
      }
      this.setDataChange()
    },

    setDataChange() {
      this.filterForm = {...this.userDetail, ...this.filterForm}
    },
  }
}
</script>

<style lang="less" scoped>
  @import '~/assets/css/close.less';
  .element-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .drawer-header {
    position: relative;
    .element-center();

    &_left {
      display: inline-block;
      .text {
        font-weight: 700;
      }
    }
    &_right {
      top: 0;
      right: 0;
      bottom: 0;
      left: 45px;
      padding: 0 12px;
      line-height: 45px;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-right {
      .element-center();
    }

    .icon {
      font-size: 20px;
      font-weight: 700;
      cursor: pointer;
    }
  }

  .drawer-content {
    width: 100%;
    height: 100%;
  }
</style>
<style lang="less">
  .person-detail_drawer {
    .ant-drawer-header {
      padding: 0!important;
    }
    .ant-drawer-body {
      height: calc(100vh);
      padding: 0;
      background-color: #f6f9fa;
      /deep/ .ant-tabs-left-content {
        padding-left: 0;
      }
    }
    .ant-tabs {
      height: 100%;
    }
    .ant-tabs .ant-tabs-left-bar {
      .ant-tabs-nav-wrap {
        background-color: #fff;
      }
      .ant-tabs-tab {
        width: 46px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        margin: 0!important;
        border: 0!important;
        border-radius: 0!important;
        background-color: #fff;
      }
      .ant-tabs-tab,
      .ant-tabs-tab-active {
        padding: 0!important;
      }
      .ant-tabs-tab-active {
        background-color: #e6f7ff;
      }
    }
  }
</style>
