<!--
 * @Author: huangjianhan
 * @Date: 2021-05-27 14:52:43
 * @LastEditTime: 2021-06-12 05:22:00
 * @LastEditors: Please set LastEditors
 * @Description: 选项选中展示界面
 * @FilePath: \ads.fandow.com\components\select-option-tab\select-option.vue
-->

<template>
  <div class="select-option">
    <div class="select-panel-moduler-header">
      <span>已选</span>
      <a @click="clearData('all')">清空</a>
    </div>
    <div class="select-panel-moduler-container">
      <div
        v-for="(item, key) in selectedArray"
        :key="'select' + key"
        class="select-panel_item select-panel-item-remove"
      >
        <span class="select-panel-item-name">{{ item }}</span>
        <span class="select-panel-item-closeicon">
          <span class="icon-close" @click="clearData('element', key)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 48 48"
              width="100%"
              height="100%"
            >
              <defs><path id="close_svg__a" d="M0 0h48v48H0z"></path></defs>
              <g fill-rule="evenodd">
                <mask id="close_svg__b" fill="#fff"><use xlink:href="#close_svg__a"></use></mask>
                <use fill="#FFF" fill-opacity=".01" xlink:href="#close_svg__a"></use>
                <path
                  fill-rule="nonzero"
                  d="M24 21.172l8.586-8.586a2 2 0 0 1 2.828 2.828L26.828 24l8.586 8.586a2 2 0 0 1-2.828 2.828L24 26.828l-8.586 8.586a2 2 0 0 1-2.828-2.828L21.172 24l-8.586-8.586a2 2 0 0 1 2.828-2.828L24 21.172z"
                ></path>
              </g>
            </svg>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      // 传递过来的选中数据
      selectedArray: {
        type: Array,
        default: [],
      },
    },

    data() {
      return {}
    },

    methods: {
      // 清空选中的数据
      clearData(type = '', index = 0) {
        if (type === 'all') {
          this.selectedArray = []
        } else {
          this.selectedArray.splice(index, 1)
        }
        this.$emit('passClearData', this.selectedArray)
      },
    },
  }
</script>

<style lang="less" scoped>
  .select-option {
    min-width: 480px;
    max-width: 480px;
    height: auto;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    .select-panel-moduler-header {
      border-bottom: 1px solid #e0e0e0;
      background-color: #fafafa;
      color: #333;
      font-size: 14px;
      line-height: 22px;
      padding: 8px 12px;
      display: flex;
      -webkit-box-pack: justify;
      justify-content: space-between;
    }
    .select-panel-moduler-container {
      height: 194px;
      padding: 12px;
      overflow: auto;
    }
    /* 控制元素宽高度等属性 */
    .select-panel_item {
      width: calc(50% - 6px);
      height: 28px;
      margin: 0px;
      margin-bottom: 12px;
      display: inline-block;
      position: relative;
    }
    /* 控制元素中的盒子样式 */
    .select-panel-item-remove {
      padding: 2px 8px;
      background-color: #f0f0f0;
      border-radius: 4px;
      position: relative;
      cursor: pointer;
      .select-panel-item-name {
        margin-right: 14px;
      }
    }
    .select-panel_item:nth-of-type(odd) {
      margin-right: 12px;
    }
    .select-panel-item-remove:last-child {
      margin-bottom: 12px;
    }
    .select-panel-item-remove:first-child {
      margin-top: 6px;
    }
    .select-panel-item-name {
      display: block;
      cursor: pointer;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 22px;
      font-size: 14px;
      color: #333;
      font-weight: 400;
    }
    .select-panel-item-closeicon {
      position: absolute;
      right: 8px;
      top: 6px;
      line-height: 0;
      width: 14px;
      height: 14px;
      fill: #999;
      cursor: pointer;
    }
  }
</style>
