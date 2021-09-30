<!--
 * @Author: huangjianhan
 * @Date: 2021-05-18 16:31:39
 * @LastEditTime: 2021-06-24 15:42:33
 * @LastEditors: Please set LastEditors
 * @Description: 投放范围组件
 * @FilePath: \ads.fandow.com\pages\create-ad-plan\seoned-components\put-scope.vue
-->
<template>
  <div class="form-component_element">
    <div class="component-element_letter">投放范围</div>
    <div class="component-element_adname">
      <span class="hint-item"></span>
      <div class="element-style">
        投放范围
        <span class="required-style"></span>
      </div>
      <a-radio-group default-value="默认" v-model="deliveryRange">
        <a-radio-button @click="changeGlobal('putInDataType', 'default')" value="DEFAULT">
          默认
        </a-radio-button>
        <a-radio-button
          @click="changeGlobal('putInDataType', 'chuanshanjia')"
          disabled
          value="UNION"
        >
          穿山甲
          <a-popover class="popover-style_reset" placement="topLeft">
            <template slot="content">
              <div class="popover-content">
                <div class="popover-title">什么是穿山甲：</div>
                <div class="popover-letter">
                  基于4亿日活用户大数据积累，顶尖AI智能推荐技术，今日头条与最广泛的合作伙伴携手打造的全新移动生态联盟
                </div>
              </div>
            </template>
            <a-button><a-icon type="question-circle" /></a-button>
          </a-popover>
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class="component-element_adname margin-top-20" v-if="putInDataType === 'chuanshanjia'">
      <span class="hint-item"></span>
      <div class="element-style">
        投放形式
        <span class="required-style"></span>
      </div>
      <div class="video-type">
        <a-radio-group default-value="激励视频">
          <a-radio-button
            v-for="item in throwTypeObject"
            :value="item.value"
            @click="setThrowType(item)"
          >
            {{ item.label }}&ensp;
            <a-popover v-if="item.value === '原生'" class="popover-style_reset" placement="topLeft">
              <template slot="content">
                <div class="popover-content">
                  <div class="popover-title">什么是激励视频：</div>
                  <div class="popover-letter">
                    特定场景下用户通过观看视频广告以换取游戏/应用内虚拟奖励的广告
                  </div>
                </div>
              </template>
              <a-button><a-icon type="question-circle" /></a-button>
            </a-popover>
          </a-radio-button>
        </a-radio-group>
        <div class="warning-tips" v-if="throwType === '原生'">
          信息流内广告，包含视频和图片
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { EventBus } from '../event-bus/event-bus.js'
  export default {
    data() {
      return {
        // 投放范围类型
        putInDataType: 'default',
        throwType: '激励视频',
        throwTypeObject: [
          {
            label: '激励视频',
            value: '激励视频',
          },
          {
            label: '原生',
            value: '原生',
          },
          {
            label: '开屏',
            value: '开屏',
          },
        ],
        deliveryRange: 'DEFAULT',
      }
    },

    mounted() {},

    methods: {
      // 点击投放范围类型设置函数处理
      changeGlobal(feild, value) {
        this[feild] = value
        this.$emit('passDeliveryRange', this.deliveryRange)
        EventBus.$emit('deliveryRange', this.deliveryRange)
      },

      // 点击投放形式 进行值处理
      setThrowType(params) {
        this.throwType = params.value
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../css/component.css';
</style>
