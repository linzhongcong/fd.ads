<!--
 * @Author: huangjianhan
 * @Date: 2021-04-06 17:11:48
 * @LastEditTime: 2021-09-22 17:06:26
 * @LastEditors: Please set LastEditors
 * @Description: 投放目标
 * @FilePath: \ads.fandow.com\pages\create-ad-plan\components\form-put-in.vue
-->
<template>
  <div class="form-put_in">
    <div class="form-component_element">
      <div class="component-element_letter">投放目标</div>
      <div class="component-element_adname">
        <span class="hint-item">
          <a-popover class="popover-style_reset" placement="topLeft">
            <template slot="content">
              <div class="popover-content">
                <div class="popover-letter">
                  选择投放目标后，系统会向最有可能发生该目标行为的用户展示你的广告
                </div>
                <div class="popover-letter">
                  转化量：将广告投放给转化意愿高的用户
                </div>
                <div class="popover-letter">
                  点击量：将广告投放给点击意愿高的用户
                </div>
              </div>
            </template>
            <a-button><a-icon type="question-circle" /></a-button>
          </a-popover>
        </span>
        <div class="element-style">
          投放目标
          <span class="required-style"></span>
        </div>
        <a-radio-group default-value="转化量">
          <a-radio-button
            v-for="item in throwArray"
            :value="item.value"
            :key="item.value"
            @click="setThrowGlabel(item)"
          >
            {{ item.label }}
          </a-radio-button>
        </a-radio-group>
      </div>
    </div>
    <div class="form-component_element specific-component_element">
      <div class="component-element_adname">
        <span class="hint-item">
          <a-popover class="popover-style_reset" placement="topLeft">
            <template slot="content">
              <div class="popover-content">
                <div class="popover-letter">
                  建议在链接地址中输入天猫、淘宝、京东商品详情页等PC端页面的地址。也可选择建站页面，将点击按钮设置为转化目标。
                </div>
              </div>
            </template>
            <a-button><a-icon type="question-circle" /></a-button>
          </a-popover>
        </span>
        <div class="element-style">
          落地页链接
          <span class="required-style" style="right: 13px;"></span>
        </div>
        <a-input
          v-model="throwGlobalObj.link"
          placeholder="请输入链接，可使用橙子建站提供的链接或第三方链接"
          style="width: 420px;"
        />
      </div>
      <div v-if="clickTotalType === '转化量'" class="component-element_adname">
        <span class="hint-item"></span>
        <div class="element-style">
          转化目标
          <span class="required-style" style="right: 13px;"></span>
        </div>
        <a-popover v-if="!throwGlobalObj.link" placement="topLeft">
          <template slot="content">
            <div>
              请先填写商品链接
            </div>
          </template>
          <a-select
            :default-value="transformGlobal[0].label"
            placeholder="请选择转化目标"
            style="width: 420px;"
            disabled
          >
            <a-select-option v-for="item in transformGlobal" :value="item.value" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-popover>
        <a-select
          v-else
          :default-value="transformGlobal[0].label"
          placeholder="请选择转化目标"
          style="width: 420px;"
          @change="setThrowTheObj"
        >
          <a-select-option v-for="item in transformGlobal" :value="item.value" :key="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </div>
      <div v-if="throwGlobalObj.throwTheObj === '店铺停留'" class="component-element_adname">
        <span class="hint-item">
          <a-popover class="popover-style_reset" placement="topLeft">
            <template slot="content">
              <div class="popover-content">
                <div class="popover-letter">
                  建议根据商品品类与价格，并参考天猫、淘宝等电商平台提供的用户停留时长进行设置，默认值为12秒
                </div>
              </div>
            </template>
            <a-button><a-icon type="question-circle" /></a-button>
          </a-popover>
        </span>
        <div class="element-style">
          店铺停留时长
          <span class="required-style" style="right: 6px;"></span>
        </div>
        <a-select
          :default-value="secondArray[1].label"
          placeholder="请选择转化目标"
          style="width: 420px;"
        >
          <a-select-option v-for="item in secondArray" :value="item.value" :key="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </div>
      <div class="component-element_adname">
        <span class="hint-item">
          <a-popover class="popover-style_reset" placement="topLeft">
            <template slot="content">
              <div class="popover-content">
                <div class="popover-letter">
                  直达链接用于打开电商app，调起店铺
                </div>
              </div>
            </template>
            <a-button><a-icon type="question-circle" /></a-button>
          </a-popover>
        </span>
        <div class="element-style">
          直达链接生成方式
        </div>
        <a-radio-group default-value="自动生成">
          <a-radio-button value="自动生成" disabled>
            自动生成
          </a-radio-button>
          <a-radio-button value="手动填写">
            手动填写
          </a-radio-button>
        </a-radio-group>
        <span>投放广告后请自行检测调起是否成功</span>
      </div>
      <div class="component-element_adname">
        <span class="hint-item">
          <a-popover class="popover-style_reset" placement="topLeft">
            <template slot="content">
              <div class="popover-content">
                <div class="popover-letter">
                  <div>
                    直达链接可向相应购物平台的官方申请，也可通过链接地址自动生成。链接格式如下几种可正常调起，其他情况有调起不成功的风险。
                  </div>
                  <div>tbopen://</div>
                  <div>openapp.jdmobile://</div>
                  <div>suning://</div>
                  <div>vipshop://</div>
                  <div>pddopen://</div>
                  <div>mogujie://</div>
                  <div>wireless1688://</div>
                </div>
              </div>
            </template>
            <a-button><a-icon type="question-circle" /></a-button>
          </a-popover>
        </span>
        <div class="element-style">
          直达链接地址
          <span class="required-style" style="right: 6px;"></span>
        </div>
        <a-input
          v-model="throwGlobalObj.nonstopLink"
          placeholder="请填写deeplink链接，保证可跳转"
          style="width: 420px;"
        />
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        throwGlobal: '转化量',
        // 投放目标选项
        throwArray: [
          {
            label: '转化量',
            value: '转化量',
          },
          {
            label: '点击量',
            value: '点击量',
          },
        ],
        clickTotalType: '转化量',
        // 投放目标对象
        throwGlobalObj: {
          link: '',
          throwTheObj: '',
          shopRemainTime: '',
          nonstopGenerateType: '',
          nonstopLink: '',
        },
        // 转化目标选项
        transformGlobal: [
          {
            label: '调起店铺',
            value: '调起店铺',
          },
          {
            label: '店铺停留',
            value: '店铺停留',
          },
        ],
        // 时间选项
        secondArray: [
          {
            label: '5秒',
            value: '5',
          },
          {
            label: '12秒',
            value: '12',
          },
          {
            label: '20秒',
            value: '20',
          },
          {
            label: '30秒',
            value: '30',
          },
          {
            label: '40秒',
            value: '40',
          },
          {
            label: '50秒',
            value: '50',
          },
          {
            label: '60秒',
            value: '60',
          },
        ],
      }
    },
    methods: {
      // 设置点击转化目标数据
      setThrowGlabel(params) {
        this.clickTotalType = params.value
      },

      // 设置转化目标
      setThrowTheObj(e) {
        this.throwGlobalObj.throwTheObj = e
      },
    },
  }
</script>
<style lang="less" scoped>
  @import '../css/component.css';
  .form-put_in {
    .specific-component_element {
      .component-element_adname {
        margin-bottom: 20px;
      }
    }
  }
</style>
