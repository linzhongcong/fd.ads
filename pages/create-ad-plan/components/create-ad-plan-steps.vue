<!--
 * @Author: lizheng
 * @Date: 2021-04-05 17:31:35
 * @LastEditTime: 2021-05-26 09:13:56
 * @LastEditors: Please set LastEditors
 * @Description: 创建广告计划步骤条
 * @FilePath: \ads\pages\create-ad-plan\components\create-ad-plan-steps.vue
-->
<template>
  <div class="create-ad_plan nav-left">
    <a-steps v-model="current" size="small" direction="vertical" class="nav-left-content">
      <a-step class="step-block" title="广告组" disabled>
        <template slot="description">
          <ul class="template-style_element">
            <li>推广目的</li>
          </ul>
        </template>
      </a-step>
      <a-step
        class="step-block active-step"
        title="广告计划"
        :disabled="pageStep === 'plan' ? false : true"
      >
        <template slot="description">
          <ul class="template-style_element">
            <li>所属广告组</li>
            <li>投放范围</li>
            <li>投放目标</li>
            <li>网页链接</li>
            <li>用户定向</li>
            <li>预算与出家</li>
            <li>计划名称</li>
          </ul>
        </template>
      </a-step>
      <a-step
        class="step-block"
        title="广告创意"
        :disabled="pageStep === 'creativity' ? false : true"
      >
        <template slot="description">
          <ul class="template-style_element">
            <li>计划名称</li>
            <li>设置投放位置广告组</li>
            <li>制作创意</li>
            <li>创意分类</li>
            <li>检测链接</li>
          </ul>
        </template>
      </a-step>
    </a-steps>
  </div>
</template>

<script>
  export default {
    props: {
      pageStep: {
        type: String,
        default: '',
      },
    },

    mounted() {
      if (this.pageStep === 'plan') {
        this.current = 1
      }
      if (this.pageStep === 'creativity') {
        this.current = 2
      }
    },

    data() {
      return {
        current: 1,
        sonCurrent: 1,
      }
    },
  }
</script>

<style lang="less" scoped>
  .nav-left {
    position: sticky;
    top: 0;
    overflow: auto;
    width: 220px;
    height: 100vh;
    display: inline-block;
    box-shadow: 0 2px 4px 0 #eff1fa;

    &-content {
      position: relative;
      height: 100%;
      background: #fff;
      overflow-y: auto;
      overflow-x: hidden;
      padding-bottom: 36px;
      padding: 16px 0 0 24px;
    }
  }
  .step-block {
    position: relative;
  }
  .active-step {
    /deep/ .ant-steps-item-content > .ant-steps-item-title {
      color: #2f88ff;
    }
  }
  .template-style_element {
    padding: 0;
    list-style: none;
    li {
      margin-top: 13px;
      font-size: 14px;
      color: #c1c1c1;
      cursor: pointer;
    }
    .active {
      color: #333;
    }
  }
</style>
<style lang="less"></style>
