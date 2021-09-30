<!--
 * @Author: lizheng
 * @Date: 2021-01-13 11:10:23
 * @LastEditTime: 2021-06-07 18:50:10
 * @LastEditors: Please set LastEditors
 * @Description: Tab切换栏
 * @FilePath: \ads\pages\promotion\promotion-tabs.vue
-->
<template>
  <div class="promotion-tab">
    <a-tabs v-model="currentTab" type="card" @change="changeTabPane">
      <a-tab-pane v-for="item in tabPanels" :key="item.key">
        <div slot="tab">
          <a-icon :type="item.icon" />
          <span>{{ item.title }}</span>
        </div>
        <component
          :is="item.component"
          :advertiser-id="adId"
          :tab-key="currentTab"
          @change-tab="switchDefaultTab"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
  import TabsAd from './component/promotion-tabs-ad'
  import TabsPlan from './component/promotion-tabs-plan'
  import TabsIdea from './component/promotion-tabs-idea'

  import { mapMutations } from 'vuex'

  export default {
    components: {
      TabsAd,
      TabsPlan,
      TabsIdea,
    },

    props: {
      advertiserId: {
        type: [String, Number],
        default: null,
      },
    },

    data() {
      return {
        adId: null,
        currentTab: 'ad',
        tabPanels: [
          {
            key: 'ad',
            title: '广告组',
            icon: 'project',
            component: 'TabsAd',
            data: { currentTabName: 'ad' },
          },
          {
            key: 'plan',
            title: '计划',
            icon: 'audit',
            component: 'TabsPlan',
            data: { currentTabName: 'plan' },
          },
          {
            key: 'idea',
            title: '创意',
            icon: 'bulb',
            component: 'TabsIdea',
            data: { currentTabName: 'idea' },
          },
        ],
      }
    },

    mounted() {
      this.adId = this.advertiserId
    },

    watch: {
      advertiserId(nVal) {
        this.adId = nVal
      },
    },

    methods: {
      ...mapMutations({
        settingDrawerVisible: 'promotion/settingDrawerVisible',
        settingCurrentTab: 'promotion/settingCurrentTab',
      }),

      // 关闭tab子组件的右侧详情抽屉
      changeTabPane(key) {
        this.settingDrawerVisible(false)
        this.settingCurrentTab(key)
      },

      // 广告组 -> 计划 -> 创意 切换面板更新当前tab的key
      switchDefaultTab(key, data) {
        this.currentTab = key
        this.settingCurrentTab(key)
        this.$emit('search-condition', data)
      },
    },
  }
</script>

<style lang="less" scoped>
  .promotion-tab {
    background-color: #fff;
    padding: 16px;
    padding-top: 0;
  }
</style>
