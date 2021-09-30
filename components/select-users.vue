<!--
 * @Author: lizheng
 * @Date: 2021-04-15 10:38:08
 * @LastEditTime: 2021-04-15 14:56:23
 * @LastEditors: Please set LastEditors
 * @Description: 公司员工模糊搜索组件
 * @FilePath: \ads\components\select-users.vue
-->
<template>
  <a-select
    style="width: 90%"
    show-search
    allow-clear
    placeholder="姓名/工号"
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
</template>

<script>
  export default {
    // 自定义v-model
    model: {
      prop: 'name',
      event: 'change',
    },

    // 接收来自父元素的值
    props: {
      name: undefined,
    },

    data() {
      return {
        form: {},
        options: [],
        fetching: false,
        realName: undefined,
      }
    },

    watch: {
      name(nVal) {
        this.realName = nVal
      },
    },

    methods: {
      // 用户模糊搜索发生改变
      handleUserChange(item) {
        console.log('item', item)
        if (item === '' || item === undefined) return this.$emit('change', undefined, undefined)
        const [realName, username] = item.split('/')
        this.$emit('change', realName, username)
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
