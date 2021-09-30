<!--
 * @Author: haungjianhan
 * @Date: 2021-05-24 17:28:46
 * @LastEditTime: 2021-06-16 11:12:19
 * @LastEditors: Please set LastEditors
 * @Description: 创意模块
 * @FilePath: \ads.fandow.com\pages\create-ad-creativity\component\creativity-content.vue
-->
<template>
  <div class="creativity">
    <belong-advertise />
    <set-put-in @passSetPutData="getSetPutData" />
    <made-creativity @creativityValPass="getCreativityData" />
    <creativity-classify @passClassify="getClassifyData" />
    <watch-link @linkValPass="linkValPassData" />
    <plan-name :pageStep="currentStep" />
    <!-- 按钮层 start -->
    <div class="form-component_element function-component_element">
      <div class="element-empty"></div>
      <div class="element-function_button">
        <a-button @click="returnPage">取消</a-button>
        <a-button type="primary" @click="handleSubmit">
          保存并关闭
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
  import belongAdvertise from '../../create-ad-plan/seoned-components/belong-advertise'
  import setPutIn from '../seconed-components/set-put-in'
  import planName from '../../create-ad-plan/seoned-components/plan-name'
  import madeCreativity from '../seconed-components/made-creativity'
  import creativityClassify from '../seconed-components/creativity-classify'
  import watchLink from '../seconed-components/watch-link'

  export default {
    components: {
      belongAdvertise,
      setPutIn,
      planName,
      madeCreativity,
      creativityClassify,
      watchLink,
    },

    data() {
      return {
        currentStep: 'creativity',
        form: {},
      }
    },

    mounted() {
      this.initData()
    },

    methods: {
      // 数据初始化
      initData() {
        this.form.advertiserId = this.$route.query.advertiserId
        this.form.adId = this.$route.query.adId
      },
      // 返回链接
      returnPage() {
        this.$router.push('/promotion')
      },

      // 获取设置投放位置数据
      getSetPutData(value) {
        this.setVal(value)
      },

      // 获取制作创意数据
      getCreativityData(value) {
        this.setVal(value)
      },

      // 获取分类数据
      getClassifyData(value) {
        let keywords = JSON.parse(JSON.stringify(value.adKeywords))
        this.form = { ...this.form, ...value, adKeywords: keywords.toString() }
      },

      // 获取检测链接数据
      linkValPassData(value) {
        this.setVal(value)
      },

      // 赋值进入form对象中
      setVal(value) {
        this.form = { ...this.form, ...value }
      },

      // 数据提交
      handleSubmit() {
        this.$API.createCreative(this.form).then(({ code, data }) => {
          if (code === 0) {
            this.$message.success('创建成功')
            this.$router.push('/promotion')
          }
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../../create-ad-plan/css/component.css';
  .creativity {
    width: calc(100% - 222px);
    height: calc(100vh - 71px);
    right: 0;
    padding: 16px;
    overflow-x: hidden;
    overflow-y: auto;
    color: #333;
    background: #f9f9f9;
    position: absolute;
    display: inline-block;
  }
</style>
