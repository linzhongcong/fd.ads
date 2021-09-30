<!--
 * @Author: lizheng
 * @Date: 2021-04-13 15:55:30
 * @LastEditTime: 2021-04-15 17:15:49
 * @LastEditors: Please set LastEditors
 * @Description: 批量设置负责人 - 统一设置
 * @FilePath: \ads\pages\promotion\component\tabs-plan-setting-charge-form.vue
-->
<template>
  <div class="plan-setting-form">
    <span style="margin-right:10px">负责人</span>
    <a-select
      style="width:200px"
      show-search
      allow-clear
      placeholder="请输入姓名/工号"
      option-label-prop="label"
      v-model="realName"
      @search="formFuzzySearch"
      @change="handleUserChange"
    >
      <a-spin v-if="fetching" slot="notFoundContent" size="small" />
      <a-select-option
        v-for="(list, idx) in options"
        :value="list.employee"
        :key="list.id"
        :label="list.realName"
      >
        {{ list.employee }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {},
        options: [],
        fetching: false,
        realName: undefined,
      }
    },

    methods: {
      // 用户模糊搜索发生改变
      handleUserChange(item) {
        console.log('item', item)
        if (item === '' || item === undefined)
          return this.$emit('onChange', { username: '', realName: '' })
        const [realName, username] = item.split('/')
        this.$emit('onChange', { username, realName })
      },

      // 负责人模糊搜索
      formFuzzySearch(name) {
        this.fetching = true
        this.$API
          .getUsers({ name, perPage: 50 })
          .then(({ code, data: { list } }) => {
            this.fetching = false
            if (code === 0) {
              this.options = list.map((item) => ({
                ...item,
                employee: `${item.realName} / ${item.username}`,
              }))
            }
          })
          .catch(() => (this.fetching = false))
      },
    },
  }
</script>

<style lang="less" scoped>
  .plan-setting-form {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% - 731px);
    border: 1px solid #e8e8e8;
    border-left: none;
    border-radius: 0 4px 4px 0;
  }
</style>
