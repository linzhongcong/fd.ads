<!--
 * @Author: lizheng
 * @Date: 2021-04-15 10:43:58
 * @LastEditTime: 2021-09-23 15:02:36
 * @LastEditors: Please set LastEditors
 * @Description: 产品模糊搜索组件
 * @FilePath: \ads\components\select-products.vue
-->
<template>
  <a-select
    style="width:90%"
    show-search
    allow-clear
    :placeholder="placeholder"
    option-label-prop="label"
    v-model.trim="productName"
    @search="productionFuzzySearch"
    @change="handleSelectChange"
  >
    <a-spin v-if="fetching" slot="notFoundContent" size="small" />
    <a-select-option
      v-for="list in productinOptions"
      :value="list.product"
      :key="list.productId"
      :label="list.productName"
    >
      {{ list.product }}
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
      placeholder: {
        type: String,
        default: '商品ID/名称'
      }
    },

    data() {
      this.productionFuzzySearch = this.$debounce(this.productionFuzzySearch, 500)
      return {
        productinOptions: [],
        fetching: false,
        productName: undefined,
      }
    },

    watch: {
      name(nVal) {
        this.productName = nVal
      },
    },

    methods: {
      // 模糊搜索发生改变
      handleSelectChange(item) {
        if (item === '' || item === undefined) return this.$emit('change', undefined, undefined)
        const [id, name] = item.split('/')
        this.$emit('change', name, id)
      },

      // 产品模糊搜索
      productionFuzzySearch(name) {
        if (name === '' || !name.trim()) return (this.productinOptions = [])
        this.fetching = true
        this.$API
          .getProductList(name)
          .then(({ code, data }) => {
            this.fetching = false
            if (code === 0) this.productinOptions = data
          })
          .catch(() => (this.fetching = false))
      },
    },
  }
</script>
