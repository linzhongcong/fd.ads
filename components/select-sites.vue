<!--
 * @Author: lizheng
 * @Date: 2021-04-15 11:37:37
 * @LastEditTime: 2021-04-15 15:05:49
 * @LastEditors: Please set LastEditors
 * @Description: 推广位模糊搜索
 * @FilePath: \ads\components\select-sites.vue
-->
<template>
  <a-select
    show-search
    allow-clear
    option-label-prop="label"
    style="width:90%"
    v-model.trim="relatedName"
    placeholder="推广位ID/名称"
    @search="handleSelectFuzzySearch"
    @change="handleSelectFuzzyChange"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
    <a-select-option
      v-for="item in promotionOptions"
      :value="item.promoter"
      :key="item.promoterId"
      :label="item.promoterName"
    >
      {{ item.promoter }}
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
      this.handleSelectFuzzySearch = this.$debounce(this.handleSelectFuzzySearch, 500)
      return {
        fetching: false,
        relatedName: undefined,
        promotionOptions: [],
      }
    },

    watch: {
      name(nVal) {
        this.relatedName = nVal
      },
    },

    methods: {
      // 模糊搜索框的值更改
      handleSelectFuzzyChange(item) {
        console.log('iii', item)
        if (item === '' || item === undefined) return this.$emit('change', undefined, undefined)
        const [id, name] = item.split('/')
        this.$emit('change', name, id)
      },

      // 模糊搜索
      handleSelectFuzzySearch(keyword) {
        if (!keyword) return (this.promotionOptions = [])
        this.fetching = true
        this.$API
          .getPromotionList(keyword)
          .then(({ code, data }) => {
            this.fetching = false
            if (code === 0) {
              this.promotionOptions = data
            }
          })
          .catch(() => (this.fetching = false))
      },
    },
  }
</script>
<style lang="less" scoped></style>
