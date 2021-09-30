<!--
 * @Author: lizheng
 * @Date: 2021-02-27 15:49:07
 * @LastEditTime: 2021-02-27 15:55:19
 * @LastEditors: Please set LastEditors
 * @Description: 头像组件
 * @FilePath: \ads\components\avatar.vue
-->
<template>
  <div class="avatar">
    {{ username }}
  </div>
</template>

<script>
  import Cookies from 'js-cookie'

  export default {
    data() {
      return {
        username: '',
      }
    },

    created() {
      this.username = Cookies.get('realName')
      console.log('username', this.username)
    },
  }
</script>
<style lang="less" scoped></style>
