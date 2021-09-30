<!--
 * @Author: huangjianhan
 * @Date: 2021-05-31 17:19:15
 * @LastEditTime: 2021-06-01 13:51:49
 * @LastEditors: Please set LastEditors
 * @Description: 多选框组件
 * @FilePath: \ads.fandow.com\components\checkbox-component\checkbox-template.vue
-->
<template>
  <div class="checkbox-template">
    <label
      v-for="item in checkboxArray"
      :class="selectedArray.indexOf(item) !== -1 ? 'active-style' : ''"
      class="checkbox-loop_element"
    >
      <input type="checkbox" class="checkbox-element" :value="item.value" @change="selectChange" />
      <span class="checkbox-letter">{{ item.label }}</span>
    </label>
  </div>
</template>

<script>
  export default {
    // props: {
    //   checkboxArray: {
    //     type: Array,
    //     default: [],
    //   },
    // },
    data() {
      return {
        checkboxArray: [
          {
            label: '不限',
            value: '不限',
          },
          {
            label: '18-23',
            value: '18-23',
          },
          {
            label: '24-30',
            value: '24-30',
          },
          {
            label: '31-40',
            value: '31-40',
          },
          {
            label: '41-49',
            value: '41-49',
          },
          {
            label: '50+',
            value: '50+',
          },
        ],
        selectedArray: [],
      }
    },
    methods: {
      selectChange(e) {
        if (e.target.checked) this.selectedArray.push(e.target.value)
        else this.selectedArray.splice(this.selectedArray.indexOf(e.target.value), 0)
        console.log(this.selectedArray)
      },
    },
  }
</script>

<style lang="less" scoped>
  .checkbox-template {
    margin: 0;
    padding: 0;
    border-radius: 4px;
    font-size: 14px;
    border: 1px solid #d9d9d9;
    border-left: none;
    overflow: hidden;
    user-select: none;
    .active-style {
      border: 1px solid #1890ff;
    }
    .checkbox-loop_element {
      width: auto;
      height: 32px;
      line-height: 32px;
      padding: 0 15px;
      border-left: 1px solid #d9d9d9;
      display: inline-block;
      position: relative;
      cursor: pointer;
      &:not(:first-child) {
      }
      &:hover {
        color: #1890ff;
      }
    }
    .checkbox-letter {
      width: 100%;
      height: 100%;
      display: inline-block;
    }
    .checkbox-element {
      opacity: 0;
      position: absolute;
    }
    .checkbox-element:checked + .checkbox-letter {
      color: #1890ff;
    }
  }
</style>
