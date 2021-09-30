<!--
 * @Author: lizheng
 * @Date: 2021-03-24 11:18:04
 * @LastEditTime: 2021-03-24 13:36:50
 * @LastEditors: Please set LastEditors
 * @Description: 报表模块的布局
 * @FilePath: \ads\pages\statement\component\statement-layout.vue
-->
<template>
  <div>
    <div class="product-wrap">
      <div class="filter">
        <div class="left">
          <!-- 搜索表单内容 -->
          <slot name="filter" />

          <!-- 展开或收起 -->
          <div class="expand-wrap" v-if="isShowExpand">
            <a-button type="link" @click="expand = !expand">
              <span>{{ !expand ? '展开' : '收起' }}</span>
              <a-icon :class="['expand-icon', expand ? '' : 'packup']" type="caret-up" />
            </a-button>
          </div>
        </div>

        <!-- 查询操作模块 -->
        <div class="right">
          <a-button type="primary" @click="getInitData('init')">查询</a-button>
          <a-button style="margin-top:10px" @click="handleResetClick">
            重置
          </a-button>
        </div>
      </div>

      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      isExpand: {
        type: Boolean,
        default: false,
      },
      isShowExpand: {
        type: Boolean,
        default: true,
      },
    },

    data() {
      return {
        expand: false,
      }
    },

    watch: {
      isExpand(nVal) {
        this.expand = nVal
      },
    },

    methods: {
      getInitData() {},
      handleResetClick() {},
    },
  }
</script>

<style scoped lang="less">
  @import './statement-layout.less';
</style>
