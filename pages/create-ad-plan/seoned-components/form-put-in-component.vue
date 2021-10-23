<!--
 * @Author: huangjianhan
 * @Date: 2021-04-06 17:11:48
 * @LastEditTime: 2021-09-22 17:05:35
 * @LastEditors: Please set LastEditors
 * @Description: 投放目标
 * @FilePath: \ads.fandow.com\pages\create-ad-plan\components\form-put-in.vue
-->
<template>
  <div>
    <a-form class="form-component_element">
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
        <a-radio-group v-model="throwGlobalObj.pricing">
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
    </a-form>
    <a-form
      class="form-put_in form-component_element"
      autocomplete="off"
      :form="form"
      @submit="handleSubmit"
    >
      <div class="line-ceil_style">
        <span class="hint-item hint-item_line">
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
        <a-form-item
          label="落地页链接"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input
            v-decorator="[
              'throwGlobalObj.link',
              {
                validateTrigger: ['change'],
                rules: [
                  {
                    whitespace: true,
                    required: true,
                    validator: checkLink,
                  },
                ],
              },
            ]"
            allow-clear
            @input="searchDownLink"
            placeholder="请输入链接，可使用橙子建站提供的链接或第三方链接"
            style="width: 420px;"
          />
        </a-form-item>
      </div>
      <div v-if="isPass" class="line-ceil_style">
        <span class="hint-item"></span>
        <span style="width: 100px;"></span>
        <fixed-component>
          <div slot="content">
            <div class="link">
              <img class="link-image" :src="throwGlobalObj.thumbnail" alt="" />
              <div class="link-text">
                <a :href="throwGlobalObj.landingTypeShop.externalUrl">
                  {{ throwGlobalObj.landingTypeShop.externalUrl }}
                </a>
                <div>{{ linkObj.name }}</div>
              </div>
            </div>
          </div>
        </fixed-component>
      </div>
      <div v-if="clickTotalType === 'PRICING_OCPM'" class="line-ceil_style">
        <span class="hint-item"></span>
        <a-form-item
          label="转化目标"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-select
            @change="setpricing"
            style="width: 420px;"
            :default-value="transformGlobal[0].label"
            v-model="throwGlobalObj.landingTypeShop.convertId"
            :disabled="linkProvisionality ? false : true"
            :getPopupContainer="
              (triggerNode) => {
                return triggerNode.parentNode || document.body
              }
            "
          >
            <a-select-option v-for="item in transformGlobal" :value="item.value" :key="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </div>
      <div
        v-if="
          throwGlobalObj.pricing === 'PRICING_OCPM' &&
            throwGlobalObj.landingTypeShop.convertId === '125' &&
            linkProvisionality
        "
        class="component-element_adname"
      >
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
        <a-select :default-value="secondArray[1].label" style="width: 420px;">
          <a-select-option
            v-for="item in secondArray"
            :value="item.value"
            :key="item.value"
            :disabled="item.value === '12' ? false : true"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </div>
      <div
        v-if="throwGlobalObj.landingTypeShop.convertId !== '5'"
        class="component-element_adname margin-top-20"
      >
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
        <!-- 当前只有手动填写（默认）所以不需要传值 -->
        <div class="element-style">
          直达链接生成方式
        </div>
        <a-radio-group default-value="手动填写">
          <a-radio-button value="自动生成" disabled>
            <a-popover class="popover-style_reset" placement="topLeft">
              <template slot="content">
                <div class="popover-content">
                  <div class="popover-letter">
                    落地页链接无预留自动生成直达链接规则，请您手动填写。
                  </div>
                </div>
              </template>
              自动生成
            </a-popover>
          </a-radio-button>
          <a-radio-button value="手动填写">
            手动填写
          </a-radio-button>
        </a-radio-group>
      </div>
      <div v-if="throwGlobalObj.landingTypeShop.convertId !== '5'" class="line-ceil_style">
        <span class="hint-item"></span>
        <span style="width: 100px;"></span>
        投放广告后请自行检测调起是否成功
      </div>
      <div
        v-if="throwGlobalObj.landingTypeShop.convertId !== '5'"
        class="line-ceil_style margin-top-10"
      >
        <span class="hint-item hint-item_line">
          <a-popover class="popover-style_reset" placement="topLeft">
            <template slot="content">
              <div class="popover-content">
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
            </template>
            <a-button><a-icon type="question-circle" /></a-button>
          </a-popover>
        </span>
        <a-form-item
          label="直达链接地址"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
        >
          <a-input
            v-decorator="[
              'throwGlobalObj.openUrl',
              {
                validateTrigger: ['blur'],
                rules: [
                  {
                    whitespace: true,
                    validator: checkOpenUrl,
                  },
                ],
              },
            ]"
            :maxLength="50"
            allow-clear
            placeholder="请填写deeplink链接，保证可跳转"
            style="width: 420px;"
          />
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>
<script>
  import { EventBus } from '../event-bus/event-bus.js'
  import { debounce } from '~/utils/utils'
  import fixedComponent from '@/components/fixed-component/fixed-tips'
  export default {
    components: {
      fixedComponent,
    },

    watch: {
      throwGlobalObj: {
        handler() {
          this.$emit('passPutInData', this.throwGlobalObj)
        },
        deep: true,
        immediate: true,
      },
    },

    data() {
      this.searchThrowLink = debounce(this.searchThrowLink, 500)
      this.checkLink = debounce(this.checkLink, 500)
      this.searchDownLink = debounce(this.searchDownLink, 500)
      return {
        form: this.$form.createForm(this, { name: 'coordinated' }),

        // 表单栏目样式设置
        formItemLayout: {
          labelCol: { span: 3 },
          wrapperCol: { span: 8 },
        },

        // 投放目标选项
        throwArray: [
          {
            label: '转化量',
            value: 'PRICING_OCPM',
          },
          {
            label: '点击量',
            value: 'PRICING_CPC',
          },
        ],
        clickTotalType: 'PRICING_OCPM',

        // 投放目标对象
        throwGlobalObj: {
          pricing: 'PRICING_OCPM',
          // 缩略图
          thumbnail: '',
          landingTypeShop: {
            // 路由参数
            externalUrl: '',
            convertId: '50',
            openUrl: '',
          },
        },

        // 落地页对象
        linkObj: {},

        // 作用：判断是否有过值变化
        linkProvisionality: '',

        // 转化目标选项
        transformGlobal: [
          // {
          //   label: '按钮跳转',
          //   value: '5',
          // },
          {
            label: '调起店铺',
            value: '50',
          },
          // 档期啊店铺停留中没有停留时间字段，所以停留时间字段的值定死为12且在转化目标中混合传递 即125
          {
            label: '店铺停留',
            value: '125',
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

        // 判断落地页链接是否可访问
        isPass: false,

        // 投放范围
        deliveryRange: 'DEFAULT',
      }
    },

    mounted() {
      this.shareData()
      this.initData()
    },

    destroyed() {},

    methods: {
      // 初始化数据
      initData() {},

      // 设置点击转化目标数据
      setThrowGlabel(params) {
        this.clickTotalType = params.value
        // 参数里，前者为事件名，与获取数据一一对应，后者为所传数据
        EventBus.$emit('throwPassValue', params.value)
      },

      // 数据共享
      shareData() {
        EventBus.$on('deliveryRange', (params) => {
          this.deliveryRange = params
        })
      },

      // 设置转化目标
      setpricing(e) {
        this.throwGlobalObj.landingTypeShop.convertId = e
      },

      // 落地页链接检验
      async checkLink(rule, value, callback) {
        // 防止相同值继续触发
        // if (value && value === this.linkProvisionality) {
        //   callback('链接地址无法访问，请正确输入')
        //   return
        // }
        this.linkProvisionality = value
        if (!value.trim()) {
          callback('请输入链接地址')
          return
        }
        this.throwGlobalObj.landingTypeShop.externalUrl = value
      },

      // 直达链接
      checkOpenUrl(rule, value, callback) {
        if (
          this.throwGlobalObj.landingTypeShop.convertId === '50' &&
          this.throwGlobalObj.pricing === 'PRICING_OCPM'
        ) {
          if (!value) {
            callback('直达链接地址必填')
            return
          }
        }
        this.throwGlobalObj.landingTypeShop.openUrl = value
      },

      // 落地页链接模糊搜索
      searchDownLink() {
        if (this.linkProvisionality) {
          this.$API
            .createAdConvertList({
              advertiserId: this.$route.query.advertiserId,
              deliveryRange: this.deliveryRange,
              externalUrl: this.linkProvisionality,
              landingType: 'SHOP',
              promotionContent: 'SHOP',
            })
            .then(({ code, data }) => {
              if (!code) {
                // 转化目标值更新
                this.transformGlobal = []
                for (let index in data) {
                  this.transformGlobal.push({
                    label: data[index].externalActionName,
                    value: data[index].externalAction,
                  })
                }
              }
            })
            .catch((err) => {
              this.$message.error(err)
            })
        }
      },

      handleSubmit(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
          }
        })
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
    .link {
      display: flex;
      align-items: center;
      &-image {
        min-width: 47px;
        min-height: 47px;
        margin-right: 10px;
      }
    }
  }
</style>
