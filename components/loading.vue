<!--
 * @Author: lizheng
 * @Date: 2021-02-27 09:56:51
 * @LastEditTime: 2021-03-23 10:22:09
 * @LastEditors: Please set LastEditors
 * @Description: 全局加载样式(组件位置不放对可能会错误,一般父元素或祖先元素,自行判断)
 * @FilePath: \ads\components\loading.vue
-->
<template>
  <div>
    <a-spin
      :class="['loading-wrap']"
      :spinning="loading"
      :style="{ display: loading ? 'flex' : 'none', ...styleName }"
    />
  </div>
</template>
<script>
  export default {
    props: {
      loading: {
        type: Boolean,
        default: false,
      },

      styleName: {
        type: Object,
        default: () => ({}),
      },
    },
  }
</script>
<style lang="less" scoped>
  .loading-wrap {
    display: flex;
    justify-content: center;
    padding-top: 50%;
    position: absolute;
    z-index: 111;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: hsla(0, 0%, 100%, 0.9);
  }
</style>
