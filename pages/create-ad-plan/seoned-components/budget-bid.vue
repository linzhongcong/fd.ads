<!--
 * @Author: your name
 * @Date: 2021-04-07 14:31:38
 * @LastEditTime: 2021-07-22 17:46:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads\pages\create-ad-plan\components\budget-bid.vue
-->

<template>
  <div class="user-goal">
    <a-form-model ref="ruleForm" :model="budgetAndBidOcpm">
      <div class="form-component_element">
        <div class="component-element_letter">预算与出价</div>
        <div class="component-change_page block-24">
          <!-- 投放场景 -->
          <a-row v-if="throwType === 'PRICING_OCPM'" class="row-item">
            <div class="hint-item"></div>
            <div class="label-item">投放场景</div>
            <div class="row-item-content">
              <div
                :class="['scene-card', form.smartBidType === 'SMART_BID_CUSTOM' ? 'selected' : '']"
                @click="handleSceneClick('SMART_BID_CUSTOM')"
              >
                <div class="title">常规投放</div>
                <div class="desc">控制成本，尽量消耗完预算</div>
              </div>
              <div
                :class="[
                  'scene-card',
                  form.smartBidType === 'SMART_BID_CONSERVATIVE' ? 'selected' : '',
                ]"
                @click="handleSceneClick('SMART_BID_CONSERVATIVE')"
              >
                <div class="title">放量投放</div>
                <div class="desc">接受成本上浮，尽量消耗更多预算</div>
              </div>
            </div>
          </a-row>

          <!-- 点击量 - 出价方式 -->
          <a-row v-if="throwType === 'PRICING_CPC'" class="row-item">
            <div class="hint-item"></div>
            <div class="label-item required-item">
              <span class="label-text">出价方式</span>
              <span class="required-item"></span>
            </div>
            <div class="row-item-content">
              <a-radio-group v-model="form.smartBidType">
                <a-radio-button value="SMART_BID_CUSTOM">手动</a-radio-button>
                <a-radio-button value="SMART_BID_CONSERVATIVE" disabled>自动</a-radio-button>
              </a-radio-group>
            </div>
          </a-row>

          <!-- 点击量 - 投放方式 -->
          <a-row v-if="throwType === 'PRICING_CPC'" class="row-item">
            <div class="hint-item"></div>
            <div class="label-item required-item">
              <span class="label-text">投放方式</span>
              <span class="required-item"></span>
            </div>
            <div class="row-item-content">
              <a-radio-group v-model="budgetAndBidCpc.flowControlMode">
                <a-radio-button value="FLOW_CONTROL_MODE_SMOOTH">标准投放（推荐）</a-radio-button>
                <a-radio-button value="FLOW_CONTROL_MODE_FAST">加速投放</a-radio-button>
              </a-radio-group>
            </div>
          </a-row>

          <!-- 竞价策略 -->
          <!-- <a-row v-if="throwType === 'PRICING_OCPM'" class="row-item">
            <div class="hint-item" style="margin-top:7px">
              <a-popover class="popover-style_reset" placement="topLeft">
                <template slot="content">
                  <div class="popover-letter">不同选项代表不同的成本考量和投放速度策略</div>
                </template>
                <a-button><a-icon type="question-circle" /></a-button>
              </a-popover>
            </div>
            <div class="label-item">竞价策略</div>
            <div class="row-item-content">
              <a-radio-group v-model="budgetAndBidOcpm.flowControlMode">
                <a-radio-button v-for="item in flowControlModeArray" :value="item.value">
                  {{ item.label }}
                </a-radio-button>
              </a-radio-group>
            </div>
          </a-row>
          -->

          <!-- 预算 -->
          <a-row class="row-item martop">
            <div class="hint-item"></div>
            <div class="label-item required-item">
              <span class="label-text">预算</span>
              <span class="required-item"></span>
            </div>
            <div class="row-item-content" style="margin-top:24px">
              <a-input-group compact>
                <a-form-model-item prop="budgetType">
                  <a-select style="width:90px" v-model="form.budgetMode">
                    <a-select-option value="BUDGET_MODE_DAY">日预算</a-select-option>
                    <a-select-option value="BUDGET_MODE_TOTAL" disabled>总预算</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item
                  prop="budget"
                  :rules="[
                    {
                      required: true,
                      trigger: 'blur',
                      validator: checkBudgetMode,
                    },
                  ]"
                >
                  <a-input-number style="width: 200px" v-model.trim="form.budget" />
                  <span style="margin-left:12px;margin-bottom:24px">元</span>
                </a-form-model-item>
              </a-input-group>
            </div>
          </a-row>

          <!-- 投放时间 -->
          <a-row v-if="form.smartBidType === 'SMART_BID_CONSERVATIVE'" class="row-item martop">
            <div class="hint-item"></div>
            <div class="label-item">投放时间</div>
            <div class="row-item-content">
              <a-radio-group v-model="form.scheduleType">
                <a-radio-button value="SCHEDULE_FROM_NOW">从今天起长期投放</a-radio-button>
                <a-radio-button value="SCHEDULE_START_END">
                  设置开始和结束日期
                </a-radio-button>
              </a-radio-group>
            </div>
          </a-row>

          <!-- 投放时间 - 设置开始和结束日期 -->
          <a-row class="row-item" v-if="form.scheduleType === 'SCHEDULE_START_END'">
            <div class="hint-item"></div>
            <div class="label-item"></div>
            <div class="row-item-content">
              <a-form-model-item style="margin:0">
                <a-date-picker v-model="form.startDate" type="date" placeholder="请选择开始日期" />
              </a-form-model-item>
              <span style="margin:0 15px;">-</span>
              <a-form-model-item style="margin:0">
                <a-date-picker v-model="form.endDate" type="date" placeholder="请选择结束日期" />
              </a-form-model-item>
            </div>
          </a-row>

          <!-- 投放时段 -->
          <a-row class="row-item">
            <div class="hint-item"></div>
            <div class="label-item">投放时段</div>
            <div class="row-item-content">
              <a-radio-group v-model="scheduleTime">
                <a-radio-button class="btn" style="width:100px" :value="0" checked>
                  不限
                </a-radio-button>
                <a-radio-button :value="1">指定时间段</a-radio-button>
              </a-radio-group>
            </div>
          </a-row>

          <!-- 投放时段 - 指定时间段 -->
          <a-row class="row-item" v-if="scheduleTime">
            <div class="hint-item"></div>
            <div class="label-item"></div>
            <div class="row-item-content">
              <TimeSelect @putInDate="bindDateVal" />
            </div>
          </a-row>

          <!-- 付费方式 -->
          <a-row class="row-item margin-top-20">
            <div class="hint-item"></div>
            <div class="label-item required-item">
              <span class="label-text">付费方式</span>
              <span class="required-item"></span>
            </div>
            <div
              v-if="throwType === 'PRICING_OCPM'"
              class="row-item-content row-item-content__vertical"
            >
              <a-radio-group default-value="PRICING_OCPM">
                <a-radio-button value="PRICING_OCPM" checked>按展示付费(oCPM)</a-radio-button>
              </a-radio-group>
              <a-row class="row-item-tips">
                计划首次投放及其之后三个自然日内将获得超成本赔付保障，您可放心新建计划并投放，详见
                <a
                  type="link"
                  target="_blank"
                  href="https://school.oceanengine.com/help/?article_id=6617724011654676484"
                >
                  oCPM赔付规则
                  <a-icon type="link" />
                </a>
              </a-row>
            </div>
            <div v-if="throwType === 'PRICING_CPC'" class="row-item-content">
              <a-radio-group default-value="PRICING_CPC" v-model="throwType">
                <a-radio-button value="PRICING_CPC" checked>按点击付费(CPM)</a-radio-button>
              </a-radio-group>
            </div>
          </a-row>

          <!-- 目标转化出价 -->
          <a-row v-if="throwType === 'PRICING_OCPM'" class="row-item martop">
            <div class="hint-item" style="margin-top:24px">
              <a-popover width="400" class="popover-style_reset" placement="topLeft">
                <template slot="content">
                  <div class="popover-letter">
                    <p>
                      目标转化价格是指您愿意为每次转化支付的目标价格。价格的高低会影响您获得的转化次数。
                    </p>
                    <p>例如，如果设置的目标价格过低，您可能会错失一部分转化。</p>
                    <p>目标转化价格仅作为智能优化投放的成本参考，实际仍按照展示付费。</p>
                  </div>
                </template>
                <a-button><a-icon type="question-circle" /></a-button>
              </a-popover>
            </div>
            <div class="label-item required-item">
              <span class="label-text">目标转化出价</span>
              <span class="required-item"></span>
            </div>
            <div class="row-item-content">
              <a-form-model-item
                class="input-item"
                prop="cpaBid"
                :rules="[
                  {
                    required: true,
                    trigger: 'blur',
                    validator: checkCpaBid,
                  },
                ]"
              >
                <a-input-number
                  allow-clear
                  style="width: 120px;"
                  v-model="budgetAndBidOcpm.cpaBid"
                />
                <span style="margin-left:12px">
                  元&ensp;
                  <span>请填入必填字段，获取建议出价</span>
                  <a-popover class="popover-style_reset" placement="topLeft">
                    <template slot="content">
                      <div class="popover-letter">
                        <div class="bui-popover-header" style="font-weight:700">
                          建议出价获取方式：
                          <a
                            href="https://school.oceanengine.com/help?category_id=6532706477478510606"
                            target="_blank"
                          >
                            了解更多
                            <a-icon type="link" />
                          </a>
                        </div>
                        <span>请填入本页面所有必填信息（除出价外），即可查看建议出价</span>
                      </div>
                    </template>
                    <a-button><a-icon type="question-circle" /></a-button>
                  </a-popover>
                </span>
              </a-form-model-item>
            </div>
          </a-row>

          <!-- 一键起量 -->
          <a-row v-if="throwType === 'PRICING_OCPM'" class="row-item martop">
            <div class="hint-item"></div>
            <div class="label-item">
              一键起量
            </div>
            <div class="row-item-content">
              <a-button
                type="primary"
                :disabled="
                  !(
                    form.smartBidType === 'SMART_BID_CONSERVATIVE' &&
                    form.budget &&
                    budgetAndBidOcpm.cpaBid
                  )
                "
              >
                启用一键起量
              </a-button>
              <span class="hint-text">请先正确填写上方预算值和出价</span>
            </div>
          </a-row>

          <!-- 转化率优化 -->
          <a-row v-if="throwType === 'PRICING_OCPM'" class="row-item">
            <div class="hint-item">
              <a-popover class="popover-style_reset" placement="topLeft">
                <template slot="content">
                  <div class="popover-letter">
                    <p>转化率=转化数/点击数*100%</p>
                    <p>广告计划通过冷启动后，将尝试按照设置的CVR进行跑量，优化广告</p>
                    <p>效果：建议在广告效果波动时开启，设置CVR越高，流量越精准</p>
                  </div>
                </template>
                <a-button><a-icon type="question-circle" /></a-button>
              </a-popover>
            </div>
            <div class="label-item">转化率优化</div>
            <div class="row-item-content">
              <a-radio-group v-model="budgetAndBidOcpm.inversionRate">
                <a-radio-button class="btn" style="width:100px" :value="0">不开启</a-radio-button>
                <a-radio-button class="btn" style="width:100px" :value="1">
                  开启
                </a-radio-button>
              </a-radio-group>
            </div>
          </a-row>

          <!-- 目标转化率 -->
          <a-row class="row-item martop" v-if="budgetAndBidOcpm.inversionRate">
            <div class="hint-item"></div>
            <div class="label-item required-item" style="margin-top:20px">
              <span class="label-text" style="margin-top:20px">目标转化率</span>
              <span class="required-item"></span>
            </div>
            <div class="row-item-content row-item-content__vertical">
              <a-form-model-item
                class="input-item"
                prop="targetRate"
                :rules="[{ whitespace: true, required: true, validator: targetRateRulsPass }]"
              >
                <a-input-number allow-clear style="width: 120px;" v-model="form.targetRate" />
                <span style="margin-left:12px">%</span>
                <span class="tips">请输入1~100的整数</span>
              </a-form-model-item>
            </div>
          </a-row>

          <!-- 点击出价 -->
          <a-row v-if="throwType === 'PRICING_CPC'" class="row-item">
            <div class="hint-item">
              <a-popover width="400" class="popover-style_reset" placement="topLeft">
                <template slot="content">
                  <div class="popover-letter">
                    根据实时数据、同类型竞争关系的广告的平均出价参考
                  </div>
                </template>
                <a-button><a-icon type="question-circle" /></a-button>
              </a-popover>
            </div>
            <div class="label-item required-item">
              <span class="label-text">点击出价</span>
              <span class="required-item"></span>
            </div>
            <div class="row-item-content">
              <a-form-model-item
                class="input-item"
                prop="bid"
                :rules="[
                  {
                    required: true,
                    trigger: 'blur',
                    validator: checkBid,
                  },
                ]"
              >
                <a-input-number allow-clear style="width: 120px;" v-model="budgetAndBidCpc.bid" />
                <span style="margin-left:12px">元</span>
                <span class="tips">请输入0.2~100之间的数字</span>
              </a-form-model-item>
            </div>
          </a-row>
        </div>
      </div>
    </a-form-model>
  </div>
</template>

<script>
  import { EventBus } from '../event-bus/event-bus.js'
  import TimeSelect from '~/components/select-table-time'

  export default {
    components: { TimeSelect },

    watch: {
      throwType() {
        this.form.budget = 0
        this.passDataParent()
      },
      // 表单数据监听
      budgetAndBidOcpm: {
        handler() {
          this.passDataParent()
        },
        deep: true,
        immediate: true,
      },
      budgetAndBidCpc: {
        handler() {
          this.passDataParent()
        },
        deep: true,
        immediate: true,
      },
      form: {
        handler() {
          this.passDataParent()
        },
        deep: true,
        immediate: true,
      },
    },

    data() {
      return {
        // 用户定向输入默认界面
        currentStatu: 'create',

        // 投放目标类型
        throwType: 'PRICING_OCPM',

        // 投放目标对象类型
        pricingObj: {},

        // 竞价策略
        flowControlModeArray: [
          {
            label: '优先跑量',
            value: 'FLOW_CONTROL_MODE_FAST',
          },
          {
            label: '均衡投放',
            value: 'FLOW_CONTROL_MODE_BALANCE',
          },
          {
            label: '控制成本上限',
            value: 'FLOW_CONTROL_MODE_SMOOTH',
          },
        ],

        // oCPM - 转化量对象
        budgetAndBidOcpm: {
          flowControlMode: 'FLOW_CONTROL_MODE_FAST',
          cpaBid: '',
          inversionRate: 0,
          budget: '',
        },

        // CPM - 点击量对象
        budgetAndBidCpc: {
          flowControlMode: 'FLOW_CONTROL_MODE_SMOOTH',
          bid: 0.2,
        },

        // 投放时段绑定值
        scheduleTime: 0,

        // 公共的字段
        form: {
          budgetMode: 'BUDGET_MODE_DAY',
          budget: 0,
          scheduleType: 'SCHEDULE_FROM_NOW',
          scheduleTime:
            '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          smartBidType: 'SMART_BID_CUSTOM',
        },
        startDate: this.moment(new Date()),
        endDate: this.moment(new Date()).add(1, 'day'),
      }
    },

    mounted() {
      this.shareData()
    },

    methods: {
      // 数据共享
      shareData() {
        EventBus.$on('throwPassValue', (params) => {
          this.throwType = params
        })
      },

      // 预算数据检验
      checkBudgetMode(rules, value, callback) {
        let price = 100
        if (this.throwType === 'PRICING_OCPM') {
          price = 300
        }
        if (!this.form.budget) {
          callback(`请输入预算，不少于${price}元`)
          return
        }
        if (this.form.budget && this.form.budget < price) {
          callback(`预算不少于${price}元，请正常输入`)
        }
        callback()
      },

      // 点击出价数据检验
      checkBid(rules, value, callback) {
        if (!this.budgetAndBidCpc.bid) {
          callback('请输入点击出价，不少于0.2元，不超过100元')
          return
        }
        if (
          this.budgetAndBidCpc.bid &&
          (this.budgetAndBidCpc.bid < 0.1 || this.budgetAndBidCpc.bid > 100)
        ) {
          callback('点击出价不少于0.2元，不超过100元，请正确输入')
          return
        }
        callback()
      },

      // 目标转化出价数据检验
      checkCpaBid(rules, value, callback) {
        let regexStr = this.budgetAndBidOcpm.cpaBid
        if (!regexStr) {
          callback('请输入目标转化出价，不少于0.1元，不超过300元')
          return
        }
        if (regexStr) {
          if (regexStr.toString().indexOf('.') !== -1) {
            let positionLen = regexStr.toString().indexOf('.')
            if (regexStr.toString().substring(positionLen + 1, regexStr.length).length > 2) {
              callback('目标转化出价仅支持最多2位小数')
              return
            }
          }
          if (regexStr < 0.1 || regexStr > 300) {
            callback('目标转化出价不少于0.1元，不超过300元，请正确输入')
            return
          }
        }
        callback()
      },

      // 传递数据至父类
      passDataParent() {
        let params = JSON.parse(JSON.stringify(this.form))
        if (this.throwType === 'PRICING_OCPM') params = { ...this.budgetAndBidOcpm, ...params }
        if (this.throwType === 'PRICING_CPC') params = { ...this.budgetAndBidCpc, ...params }
        this.$emit('shareData', params)
      },

      // form表单提交
      handleSceneClick(type) {
        this.form.smartBidType = type
      },

      // 目标转化率参数校验
      targetRateRulsPass(rule, value, callback) {
        if (!this.form.targetRate) callback('请输入整数')
        else if (this.form.targetRate < 1 || this.form.targetRate > 100)
          callback('请输入1~100的整数')
        else callback()
      },

      // 获取子组件传递过来的时间值
      bindDateVal(params) {
        this.form.scheduleTime = params
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../css/component.css';
  .row-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 32px;

    .label-item {
      font-size: 14px;
      width: 80px;
      color: #333;
    }

    .required-item {
      display: flex;
      position: relative;
      .label-text {
        width: 60px;
      }

      .required-item {
        width: 4px;
        height: 4px;
        border-radius: 2px;
        background: #f45858;
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    &-content {
      display: flex;
      align-items: center;
      margin-left: 24px;

      .scene-card {
        padding: 8px 12px;
        border-radius: 4px;
        background: #ffffff;
        width: 206px;
        border: 1px solid #dadfe3;
        cursor: pointer;

        .title {
          font-family: PingFangSC;
          font-size: 14px;
          font-weight: 600;
          line-height: 22px;
          color: #333;
        }

        .desc {
          font-family: PingFangSC;
          font-size: 12px;
          line-height: 22px;
          color: #999;
        }
      }

      .selected {
        background: #ebf3ff;
        border: 1px solid #2f88ff;

        .title,
        .desc {
          color: #2f88ff;
        }
      }

      .scene-card + .scene-card {
        margin-left: 10px;
      }

      .btn {
        margin-top: 5px;
        width: 100px;
        display: inline-flex;
        justify-content: center;
      }

      .hint-text {
        font-size: 12px;
        margin-left: 16px;
        line-height: 20px;
        color: #999;
      }

      .input-item {
        margin-top: 24px;
      }
    }

    &-content__vertical {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-top: 20px;

      .row-item-tips {
        font-size: 12px;
        color: #999;
        line-height: 20px;
        margin-top: 5px;
      }

      .tips {
        font-size: 12px;
        color: #999;
        margin-left: 12px;
      }
    }
  }

  .martop {
    margin-top: -24px;
  }
</style>
