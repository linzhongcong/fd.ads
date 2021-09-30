<!--
 * @Author: huangjianhan
 * @Date: 2021-05-26 10:11:32
 * @LastEditTime: 2021-06-16 11:13:05
 * @LastEditors: Please set LastEditors
 * @Description: 创建广告创意 - 设置投放位置
 * @FilePath: \ads.fandow.com\pages\create-ad-creativity\seconed-components\set-put-in.vue
-->
<template>
  <div class="form-component_element">
    <div class="component-element_letter">设置投放位置</div>
    <div class="component-element_adname">
      <span class="hint-item"></span>
      <div class="element-style">
        广告位置
        <span class="required-style"></span>
      </div>
      <a-radio-group default-value="firstChoice">
        <a-radio-button checked value="firstChoice">
          首选媒体
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class="component-element_adname">
      <span class="hint-item"></span>
      <div class="element-style"></div>
      <span class="card-tip">
        广告将主要投放在首选媒体上；同时为了帮助广告计划更好的跑量和优化成本，系统有可能将广告智能拓展投放到其他流量场景
      </span>
    </div>
    <div class="component-element_adname">
      <span class="hint-item"></span>
      <div class="element-style"></div>
      <div class="margin-top-10 tags-content">
        <div class="tags-lists-header tags-lists-item">
          <a-checkbox :checked="checkAll" @change="checkAllOption">
            APP名称
          </a-checkbox>
        </div>
        <div class="tags-lists-container">
          <div class="tags-lists-item" v-for="item in optionsWithDisabled">
            <a-checkbox
              :value="item.value"
              @change="checkSingle"
              :checked="form.inventoryType.toString().indexOf(item.value) !== -1 ? true : false"
            >
              {{ item.label }}
            </a-checkbox>
            <span class="understand-detail">了解详情</span>
          </div>
        </div>
      </div>
    </div>
    <div class="component-element_adname margin-top-20">
      <span class="hint-item"></span>
      <div class="element-style">
        搜索快投关键词
        <span class="required-style"></span>
      </div>
      <a-radio-group default-value="close">
        <a-radio-button value="close">
          不启用
        </a-radio-button>
        <a-radio-button value="open" disabled>
          启用
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class="component-element_adname">
      <span class="hint-item"></span>
      <div class="element-style"></div>
      <span class="card-tip">
        为了提升在搜索流量上的投放效果，请开启搜索快投关键词功能，可以获取更优质的搜索流量
      </span>
    </div>
  </div>
</template>

<script>
  import { debounce } from '~/utils/utils'
  export default {
    watch: {
      form: {
        handler(newVal) {
          this.passParentData(newVal)
        },
        deep: true,
        immediate: true,
      },
    },

    data() {
      this.passParentData = debounce(this.passParentData, 500)
      return {
        form: {
          // 广告位置
          inventoryType: 'firstChoice',
          // app名称选中值
          inventoryType: [],
        },
        checkAll: true,
        optionsWithDisabled: [
          { label: '今日头条', value: 'INVENTORY_FEED' },
          { label: '西瓜视频', value: 'INVENTORY_VIDEO_FEED' },
          { label: '抖音火山版', value: 'INVENTORY_HOTSOON_FEED' },
          { label: '抖音', value: 'INVENTORY_AWEME_FEED' },
          { label: '穿山甲', value: 'INVENTORY_UNION_SLOT' },
        ],
      }
    },

    mounted() {
      // 默认全选
      this.checkAllOption({
        target: {
          checked: true,
        },
      })
      this.passParentData(this.form)
    },

    methods: {
      // APP名称单选
      checkSingle(event) {
        const checkedOption = event.target
        if (checkedOption.checked) {
          this.form.inventoryType.push(checkedOption.value)
        } else {
          this.form.inventoryType.map((item, index) => {
            item === checkedOption.value && this.form.inventoryType.splice(index, 1)
          })
        }
        if (this.form.inventoryType.length === this.optionsWithDisabled.length) {
          this.checkAll = true
          return
        }
        this.checkAll = false
      },

      // APP名称全选
      checkAllOption(event) {
        const checkedOption = event.target
        if (checkedOption.checked) {
          this.checkAll = true
          this.optionsWithDisabled.map((item) => {
            this.form.inventoryType.push(item.value)
          })
          return
        }
        this.form.inventoryType = []
        this.checkAll = false
      },

      // 传递数据至父组件
      passParentData(value) {
        this.$emit('passSetPutData', value)
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../../create-ad-plan/css/component.css';
  .card-tip {
    margin: 10px 0 0;
    font-size: 12px;
    color: #999;
    line-height: 20px;
  }
  .tags-content {
    width: 400px;
  }
  .tags-lists-header {
    background-color: #f8f9fa;
    border: 1px solid #e4e9ed;
    height: 36px;
    line-height: 33px;
    border-radius: 4px 4px 0 0;
    font-weight: bold;
    margin: 0;
  }
  .tags-lists-container {
    border: 1px solid #e4e9ed;
    margin-top: -1px;
  }
  .tags-lists-item {
    width: 100%;
    height: 37px;
    line-height: 37px;
    padding-left: 12px;
    padding-right: 12px;
    font-size: 14px;
    display: flex;
    position: relative;
    color: #333;
    .ant-checkbox-group {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .ant-checkbox-wrapper {
      width: 100%;
    }
  }

  .understand-detail {
    position: absolute;
    top: 30%;
    right: 10px;
    font-size: 12px;
    color: #2f88ff;
    line-height: 12px;
    display: inline-block;
    cursor: pointer;
  }
</style>
