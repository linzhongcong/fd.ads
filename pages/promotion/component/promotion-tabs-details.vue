<!--
 * @Author: lizheng
 * @Date: 2021-01-29 16:55:21
 * @LastEditTime: 2021-03-23 10:26:20
 * @LastEditors: Please set LastEditors
 * @Description: 广告组详情或计划详情
 * @FilePath: \ads\pages\promotion\component\promotion-tabs-details.vue
-->
<template>
  <a-drawer
    class="detail-drawer"
    placement="right"
    :width="850"
    :closable="false"
    :visible="detailVisible"
    @close="onClose"
  >
    <div class="drawer-header" slot="title">
      <div class="drawer-header-left">
        <a-icon type="close" :size="20" class="close-icon" @click="onClose" />
        <span class="text">
          {{ tableTab === 'ad' ? adGroupDetail.name : `${campaignName} / ${planDetail.name}` }}
        </span>
      </div>
      <div class="drawer-header-right">
        <div v-if="PLAN_STATUS[adGroupDetail.status] || PLAN_STATUS[planDetail.status]">
          <span
            :class="[
              'cell-status-label',
              planDetail.status === 'AD_STATUS_DONE' ? 'cell-status-label-active' : '',
              adGroupDetail.status === 'AD_STATUS_DONE' ? 'cell-status-label-active' : '',
            ]"
          />
          <span>
            {{ PLAN_STATUS[planDetail.status ? planDetail.status : adGroupDetail.status] }}
          </span>
        </div>
        <a-switch
          style="margin:0 10px"
          v-model="
            planDetail.optStatus === 'AD_STATUS_ENABLE' ||
              adGroupDetail.status === 'CAMPAIGN_STATUS_ENABLE'
          "
          size="small"
          @change="changeSwitch"
        />
        <a-dropdown :trigger="['click']">
          <a-icon type="more" :size="20" class="icon icon-cursor" />
          <a-menu slot="overlay">
            <a-menu-item key="0">
              <a href="#">编辑组</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>

    <a-tabs
      v-model="currentTab"
      class="detail-tabs"
      default-active-key="detail"
      tab-position="left"
    >
      <!-- 详情 -->
      <a-tab-pane key="detail">
        <span slot="tab" class="tab-menu-item">
          <a-icon type="pie-chart" style="margin-left:8px" />
          详情
        </span>
        <div class="content-header">
          <div></div>
          <a-range-picker
            v-model="rangePickerDate"
            :disabled-date="(current) => current && current > moment().endOf('day')"
            :ranges="range"
            show-time
            size="small"
            format="YYYY.MM.DD"
            style="width: 220px;"
          />
        </div>

        <!-- 主体内容 -->
        <div class="content-main">
          <div class="content-left">
            <a-card>
              <div slot="title">
                <span style="font-weight:700">关注指标</span>
                <a-tooltip placement="bottom">
                  <template slot="title">
                    <span>
                      你可以自定义显示的关注指标，帮助你更便捷地了解广告整体情况。同时你修改的关注指标将会同时应用于所有广告计划
                    </span>
                  </template>
                  <a-icon type="question-circle" class="icon-cursor" />
                </a-tooltip>
              </div>
              <a disabled slot="extra" href="#">
                查看更多数据
                <a-icon type="right" />
              </a>
              <div class="global">
                <a-empty />
              </div>
            </a-card>

            <a-card class="card-content-group">
              <a-tabs class="detail-tabs-child">
                <!-- 组设置 -->
                <a-tab-pane v-if="tableTab === 'ad'" key="groupSetting" tab="组设置">
                  <!-- 加载样式 -->
                  <a-spin
                    class="loading-wrap"
                    :style="{ display: adGroupDetail.spinning ? 'flex' : 'none' }"
                    :spinning="adGroupDetail.spinning"
                  />
                  <h3 class="margin-bottom-10">基本情况</h3>
                  <a-form-model
                    labelAlign="left"
                    :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 14 }"
                    :model="adGroupDetail"
                  >
                    <a-form-model-item :colon="false" label="组名称" style="margin:0;color:#333">
                      <a-input
                        v-if="isEdit"
                        v-model="adGroupDetail.campaignName"
                        placeholder="请填写组名称"
                        allowClear
                        auto-focus
                        @blur="onSave"
                      />
                      <span v-else>
                        {{ adGroupDetail.name }}
                        <a-icon type="edit" class="icon-cursor" @click.native="isEdit = !isEdit" />
                      </span>
                    </a-form-model-item>
                    <a-form-model-item :colon="false" label="组ID" style="margin:0;color:#333">
                      <span>{{ adGroupDetail.id }}</span>
                    </a-form-model-item>
                    <a-form-model-item :colon="false" label="营销链路" style="margin:0;color:#333">
                      <span>{{ adGroupDetail.marketingLink }}</span>
                    </a-form-model-item>
                    <a-form-model-item :colon="false" label="推广目的" style="margin:0;color:#333">
                      <span>{{ LANDING_TYPE[adGroupDetail.landingType] }}</span>
                    </a-form-model-item>
                    <a-form-model-item
                      :colon="false"
                      label="广告组类型"
                      style="margin:0;color:#333"
                    >
                      <span>
                        {{
                          adGroupDetail.campaignType
                            ? advertisingsStatu[adGroupDetail.campaignType]
                            : ''
                        }}
                      </span>
                    </a-form-model-item>
                    <a-form-model-item :colon="false" label="预算类型" style="margin:0;color:#333">
                      <span>{{ BUDGET_TYPE[adGroupDetail.budgetMode] }}</span>
                    </a-form-model-item>
                  </a-form-model>
                </a-tab-pane>

                <!-- 计划设置 -->
                <a-tab-pane v-if="tableTab === 'plan'" key="planSetting" tab="计划设置">
                  <div class="global-title">基本情况</div>
                  <a-row>
                    <a-col style="color:#999" span="6">计划名称</a-col>
                    <a-col offset="1" span="17">
                      <span style="color:#333" v-if="!isEditObj.planSetStatu">
                        {{ planDetail.name }}
                      </span>
                      <a-input
                        v-else
                        auto-focus
                        style="width:200px"
                        v-model="planDetail.planName"
                        @blur="isEditObj.planSetStatu = false"
                      />
                      <a-icon
                        type="edit"
                        @click="
                          () => {
                            isEditObj.planSetStatu = true
                            planDetail.planName = planDetail.name
                          }
                        "
                      />
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col style="color:#999" span="6">计划ID</a-col>
                    <a-col offset="1" span="17">
                      <span style="color:#333">{{ planDetail.adId }}</span>
                    </a-col>
                  </a-row>
                  <div class="global-title">推广内容</div>
                  <a-row>
                    <a-col style="color:#999" span="6">推广目的</a-col>
                    <a-col offset="1" span="17">
                      <span style="color:#333">{{ LANDING_TYPE[planDetail.landingType] }}</span>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col style="color:#999" span="6">落地页链接</a-col>
                    <a-col offset="1" span="17">
                      <a type="link" :href="planDetail.externalUrl" target="_blank">
                        {{ planDetail.externalUrl }}
                      </a>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col style="color:#999" span="6">投放目标</a-col>
                    <a-col offset="1" span="17">
                      <span style="color:#333">{{ planDetail.pricingType }}</span>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col style="color:#999" span="6">转化目标</a-col>
                    <a-col offset="1" span="17">
                      <span style="color:#333">{{ planDetail.convertId }}</span>
                    </a-col>
                  </a-row>
                  <div class="global-title">预算与出价</div>
                  <a-row>
                    <a-col style="color:#999" span="6">预算类型</a-col>
                    <a-col offset="1" span="17">
                      <span style="color:#333">{{ BUDGET_TYPE[planDetail.budgetMode] }}</span>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col span="6" style="color:#999">预算</a-col>
                    <a-col offset="1" span="17">
                      <span style="color:#333" v-if="!isEditObj.expectStatu">
                        {{ planDetail.budget ? `￥${planDetail.budget}` : '' }}
                      </span>
                      <a-input-number
                        v-else
                        auto-focus
                        style="width:200px;"
                        v-model="planDetail.budget"
                        @blur="isEditObj.expectStatu = false"
                      />
                      <a-icon type="edit" @click="editParams('expectStatu')" />
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col style="color:#999" span="6">投放时间</a-col>
                    <a-col offset="1" span="17">
                      <span style="color:#333">
                        {{
                          planDetail.scheduleType === 'SCHEDULE_START_END'
                            ? `${moment(planDetail.startTime).format('YYYY-MM-DD')}~${moment(
                                planDetail.endTime
                              ).format('YYYY-MM-DD')}`
                            : '从现在开始一直投放'
                        }}
                      </span>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col style="color:#999" span="6">投放时段</a-col>
                    <a-col offset="1" span="17">
                      <div
                        :key="key"
                        v-for="(item, key) in schedultTimeRangeMapping(planDetail.scheduleTime)"
                      >
                        <span style="color:#333" v-if="item.length">
                          {{ key }}：{{ item.join('、') }}
                        </span>
                      </div>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col class="label-text" span="6">投放场景</a-col>
                    <a-col offset="1" span="17">
                      <span style="color:#333">
                        {{
                          planDetail.smartBidType === 'FLOW_CONTROL_MODE_FAST'
                            ? '常规投放'
                            : FLOW_CONTROL_MODE[planDetail.smartBidType]
                        }}
                      </span>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col class="label-text" span="6">竞价策略</a-col>
                    <a-col offset="1" span="17">
                      <span style="color:#333">
                        {{ FLOW_CONTROL_MODE[planDetail.smartBidType] }}
                      </span>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col style="color:#999" span="6">付费方式</a-col>
                    <a-col offset="1" span="17">
                      <span style="color:#333">{{ PRICING[planDetail.pricing] }}</span>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col style="color:#999" span="6">出价</a-col>
                    <a-col offset="1" span="17">
                      <span style="color:#333" v-if="!isEditObj.offerStatu">
                        ￥{{ planDetail.bid }}
                      </span>
                      <a-input
                        v-else
                        auto-focus
                        style="width:200px"
                        v-model="planDetail.bid"
                        @blur="isEditObj.offerStatu = false"
                      />
                      <a-icon type="edit" @click="editParams('offerStatu')" />
                    </a-col>
                  </a-row>
                  <div class="global-title">用户定向</div>
                  <a-row class="idea-type-wrap">
                    <a-col span="6" style="color:#999">地域</a-col>
                    <a-col offset="1" span="17">
                      <span style="color:#333" :class="[isSettingExpand ? '' : 'row-collapse']">
                        {{ planDetail['district'] }}
                      </span>
                      <div
                        v-if="planDetail['district'] && planDetail['district'].length > 85"
                        class="row-expand-btn"
                        @click="isSettingExpand = !isSettingExpand"
                      >
                        {{ isSettingExpand ? '收起' : '展开全部' }}
                      </div>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col style="color:#999" span="6">年龄</a-col>
                    <a-col offset="1" span="17">
                      <span style="color:#333">{{ handleRenderAge(planDetail.age) }}</span>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col style="color:#999" span="6">过滤已转化用户</a-col>
                    <a-col offset="1" span="17">
                      <span style="color:#333">
                        {{ FILTER_USER_TYPE[planDetail.hideIfConverted] }}
                      </span>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col style="color:#999" span="6">预估广告展示数</a-col>
                    <a-col offset="1" span="17">
                      <div>
                        <span
                          style="color:#333"
                          :key="index"
                          v-for="(item, index) in planDetail.expectedAdShow"
                        >
                          {{ item }}
                        </span>
                      </div>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col style="color:#999" span="6">预估用户覆盖数</a-col>
                    <a-col offset="1" span="17">
                      <div>
                        <span
                          style="color:#333"
                          :key="index"
                          v-for="(item, index) in planDetail.expectedAdCover"
                        >
                          {{ item }}
                        </span>
                      </div>
                    </a-col>
                  </a-row>

                  <!-- 加载样式 -->
                  <a-spin
                    class="loading-wrap"
                    :style="{ display: planDetail.spinning ? 'flex' : 'none' }"
                    :spinning="planDetail.spinning"
                  />
                </a-tab-pane>

                <!-- 创意设置 -->
                <a-tab-pane v-if="tableTab === 'plan'" key="ideaSetting" tab="创意设置">
                  <div v-for="(item, key) in ideaSettingContent" :key="key">
                    <div class="idea-type-wrap" v-if="item.title === '创意分类和标签'">
                      <h3 class="global-title">创意分类标签</h3>
                      <a-row>
                        <a-col span="6" style="color:#999">创意分类</a-col>
                        <a-col offset="1" span="17">
                          <span style="color:#333">
                            {{
                              ideaSettingDetail.creativeCategory
                                ? ideaSettingDetail.creativeCategory
                                : ''
                            }}
                          </span>
                        </a-col>
                      </a-row>
                      <a-row>
                        <a-col span="6" style="color:#999">创意标签</a-col>
                        <a-col offset="1" span="17">
                          <span :class="[isIdeaExpand ? '' : 'row-collapse']">
                            {{
                              ideaSettingDetail['adKeywords'] &&
                                ideaSettingDetail['adKeywords'].join('；')
                            }}
                          </span>
                          <div
                            v-if="
                              ideaSettingDetail['adKeywords'] &&
                                ideaSettingDetail['adKeywords'].join('；').length > 85
                            "
                            class="row-expand-btn"
                            @click="isIdeaExpand = !isIdeaExpand"
                          >
                            {{ isIdeaExpand ? '收起' : '展开全部' }}
                          </div>
                        </a-col>
                      </a-row>
                    </div>
                    <div v-else>
                      <h3 class="global-title">{{ item.title }}</h3>
                      <a-row v-for="child in item.children" :key="child.label">
                        <a-col span="6" style="color:#999">{{ child.label }}</a-col>
                        <a-col offset="1" span="17">
                          <span v-if="child.vmodel === 'isCommentDisable'">
                            {{ ideaSettingDetail[child.vmodel] === 1 ? '启用' : '停用' }}
                          </span>
                          <span v-else-if="child.vmodel === 'creativeForm'">
                            {{
                              ideaSettingDetail[child.vmodel]
                                ? ideaSettingDetail[child.vmodel]
                                : '广告创意'
                            }}
                          </span>
                          <span v-else-if="child.vmodel === 'creativeDisplayMode'">
                            {{ CREATIVE_DISPLAY_MODE[ideaSettingDetail[child.vmodel]] }}
                          </span>
                          <span v-else-if="child.vmodel === 'inventoryType'">
                            {{ INVENTORY_TYPE[ideaSettingDetail[child.vmodel]] }}
                          </span>
                          <span v-else-if="child.vmodel === 'creativeMaterialMode'">
                            {{
                              ideaSettingDetail[child.vmodel] === 'STATIC_ASSEMBLE'
                                ? '程序化创意'
                                : '自定义创意'
                            }}
                          </span>
                          <span v-else>{{ ideaSettingDetail[child.vmodel] }}</span>
                        </a-col>
                      </a-row>
                    </div>
                  </div>
                  <!-- 加载样式 -->
                  <a-spin
                    class="loading-wrap"
                    :style="{ display: ideaSettingDetail.spinning ? 'flex' : 'none' }"
                    :spinning="ideaSettingDetail.spinning"
                  />
                </a-tab-pane>

                <a-button disabled size="small" type="link" slot="tabBarExtraContent" href="#">
                  编辑
                  <a-icon type="right" />
                </a-button>
              </a-tabs>
            </a-card>
          </div>

          <!-- 创意视频 -->
          <div class="content-right">
            <a-card>
              <!-- 加载样式 -->
              <a-spin
                class="loading-wrap"
                :style="{ display: spinning ? 'flex' : 'none' }"
                :spinning="spinning"
              />
              <div slot="title" class="content-right-header">
                <div class="content-right-header__title">
                  <span style="font-weight:700">创意（{{ ideaVideoData.length }}）</span>
                  <a-button disabled size="small" type="link" href="#">
                    编辑创意
                    <a-icon type="right" />
                  </a-button>
                </div>
                <div class="content-right-header__filter">
                  <a-select size="small" class="state-filter selector" default-value="不限">
                    <a-select-option
                      :value="item.value"
                      v-for="item in ideaFilterStatusOption"
                      :key="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                  <a-select size="small" class="sort-filter selector" default-value="展示数高到低">
                    <a-select-option
                      :value="item.value"
                      v-for="item in ideaFilterTypeOption"
                      :key="item.value"
                    >
                      {{ item.label }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>

              <div v-if="ideaVideoData.length" class="list-area-wrap">
                <div class="creative-info-area" v-for="(item, index) in ideaVideoData" :key="index">
                  <p class="creative-title">{{ item.title }}</p>
                  <div class="creative-info">
                    <div class="preview-wrapper">
                      <video
                        class="video"
                        src="https://www.w3school.com.cn/i/movie.ogg"
                        controls="controls"
                        height="90"
                        width="160"
                      >
                        您的浏览器不支持 video 标签
                      </video>
                      <div class="image-mode">
                        {{ MATERIAL_TYPR[item.imageMode] }}
                      </div>
                    </div>
                    <div class="stat-data">
                      <div class="stat-line">
                        <span class="title">展示数</span>
                        <span class="num">{{ item.avgClickCost }}</span>
                      </div>
                      <div class="stat-line">
                        <span class="title">消耗</span>
                        <span class="num">{{ item.cost }}</span>
                      </div>
                      <div class="stat-line">
                        <span class="title">转化数</span>
                        <span class="num">{{ item.convert }}</span>
                      </div>
                      <div class="stat-line">
                        <span class="title">转化率</span>
                        <span class="num">{{ item.convertCost }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="creative-status">
                    <div class="status">
                      <span class="status-circle">•</span>
                      <span class="status-on-text">
                        未投放
                      </span>
                      <span class="status-text" style="font-size:12px;color:#999">
                        {{ CREATIVE_STATUS[item.status] }}
                      </span>
                    </div>
                    <div class="more-operation">
                      <a-switch
                        size="small"
                        :default-checked="item.optStatus === 'CREATIVE_STATUS_ENABLE'"
                      />
                      <!-- @change="(checked) => changeCreativeVideo(checked, item)" -->
                      <a-icon type="more" class="icon-cursor" style="font-size:16px" />
                    </div>
                  </div>
                </div>
              </div>

              <a-empty v-else style="margin-top:50%" />
            </a-card>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  import { getDateRange, dateRangeMapping } from '~/utils/utils'
  import {
    LANDING_TYPE,
    BUDGET_TYPE,
    AUTO_BIG,
    PRICING,
    FILTER_USER_TYPE,
    CREATIVE_DISPLAY_MODE,
    INVENTORY_TYPE,
    MATERIAL_TYPR,
    CREATIVE_STATUS,
    IDEA_FILTER_ORDER,
    IDES_FILTER_STATUS,
    PLAN_STATUS,
    advertisingsStatu,
    FLOW_CONTROL_MODE,
  } from '../contant'

  export default {
    data() {
      return {
        LANDING_TYPE, // 推广目标常量
        BUDGET_TYPE, // 预算类型常量
        AUTO_BIG, // 自动出价类型
        PRICING, // 付费方式
        FILTER_USER_TYPE, //过滤已转化用户
        CREATIVE_DISPLAY_MODE, // 创意方式
        INVENTORY_TYPE, // 投放位置
        FLOW_CONTROL_MODE, // 投放场景
        MATERIAL_TYPR, // 素材类型
        CREATIVE_STATUS, // 创意状态
        PLAN_STATUS, // 计划状态
        advertisingsStatu, // 广告组类型

        // 日期选择器范围组件
        range: {}, // 时间选择快捷键
        rangePickerDate: [
          this.moment(new Date(), 'YYYY.MM.DD'),
          this.moment(new Date(), 'YYYY.MM.DD'),
        ],

        // 计划设置 是否需要编辑
        isEdit: false,
        isIdeaExpand: false, // 是否展开全部
        isSettingExpand: false, // 是否展开全部
        isEditObj: {
          planSetStatu: false,
          expectStatu: false,
          offerStatu: false,
        },

        // 创意筛选options
        ideaFilterTypeOption: [],
        ideaFilterStatusOption: [],

        currentTab: 'detail',
        tableTab: 'ad',
        campaignName: '',
        detailVisible: false,
        spinning: false,
        adGroupDetail: { spinning: false },
        planDetail: { spinning: false },
        ideaSettingDetail: { spinning: false },
        ideaVideoData: [],

        // 创意设置展示内容
        ideaSettingContent: [
          {
            title: '基本情况',
            children: [
              { label: '投放位置', vmodel: 'inventoryType' },
              { label: '创意形式', vmodel: 'creativeForm' },
              { label: '创意方式', vmodel: 'creativeMaterialMode' },
              { label: '来源', vmodel: 'source' },
              { label: '广告评论', vmodel: 'isCommentDisable' },
              { label: '创意展示方式', vmodel: 'creativeDisplayMode' },
            ],
          },
          {
            title: '推广卡片',
            children: [
              { label: '卡片主图', vmdel: 'productImageId' },
              { label: '卡片标题', vmdel: 'productDescription' },
              { label: '推广卖点', vmdel: 'productSellingPoints' },
              { label: '行动号召力', vmdel: 'callToAction' },
            ],
          },
          {
            title: '创意详情页',
            children: [],
          },
          {
            title: '创意分类和标签',
            children: [
              { label: '创意分类', vmodel: 'creativeCategory' },
              { label: '创意标签', vmodel: 'adKeywords' },
            ],
          },
          {
            title: '账户品牌',
            children: [{ label: '账户头像', vmodel: 'productImageId' }],
          },
        ],
      }
    },

    computed: {
      ...mapState(['promotion']),
    },

    created() {
      this.range = getDateRange(this)
      for (const [key, value] of Object.entries(IDEA_FILTER_ORDER))
        this.ideaFilterTypeOption.push({ label: value, value: key })
      for (const [key, value] of Object.entries(IDES_FILTER_STATUS))
        this.ideaFilterStatusOption.push({ label: value, value: key })
    },

    methods: {
      ...mapMutations({ settingDrawerVisible: 'promotion/settingDrawerVisible' }),

      onClose() {
        this.detailVisible = false
        this.$emit('close', this.detailVisible)
      },

      // 更改创意视频状态
      changeSwitch(value) {
        console.log('value', value)
      },

      schedultTimeRangeMapping(timeRange) {
        if (timeRange) return dateRangeMapping(timeRange)
        return ''
      },

      // 年龄端 字段处理
      handleRenderAge(ageRange) {
        if (!ageRange || !ageRange.length) return ''
        const ageArr = []
        ageRange.map((item) => {
          ageArr.push(...item.split('AGE_BETWEEN_').filter((list) => list))
        })
        return ageArr.map((item) => item.replace('_', '-')).join('、')
      },

      // 广告组详情
      getAdGroupItemDetail(advertiserId, campaignId) {
        const { startDate, endDate } = this.promotion.filterForm
        this.settingDrawerVisible(true)
        this.detailVisible = true
        this.adGroupDetail.spinning = true
        this.tableTab = 'ad'
        this.rangePickerDate = [
          this.moment([startDate], 'YYYY.MM.DD'),
          this.moment([endDate], 'YYYY.MM.DD'),
        ]
        this.$API
          .getPromotionAdGroupDetail(advertiserId, campaignId)
          .then(({ code, data }) => {
            if (code === 0) {
              this.adGroupDetail = data
            }
          })
          .finally(() => {
            setTimeout(() => {
              this.adGroupDetail.spinning = false
            }, 800)
          })
      },

      // 广告组- 获取创意视频信息
      getAdGroupVideoListDetail(advertiserId, campaignId) {
        this.spinning = true
        this.$API
          .getAdGroupVideoListDetail({ advertiserId, campaignId })
          .then(({ code, data }) => {
            if (code === 0) {
              this.ideaVideoData = data
            }
          })
          .finally(() => {
            setTimeout(() => {
              this.spinning = false
            }, 800)
          })
      },

      // 获取计划详情
      getAdPlanItemDetail(advertiserId, adId, { campaignName }) {
        this.tableTab = 'plan'
        this.detailVisible = true
        this.planDetail.spinning = true
        this.ideaSettingDetail.visible = true
        this.campaignName = campaignName
        this.$API
          .getPromotionAdPlanDetail(advertiserId, adId)
          .then(({ code, data }) => {
            if (code === 0) {
              this.planDetail = data
              this.planDetail.spinning = false
            }
          })
          .finally(() => {
            setTimeout(() => {
              this.planDetail.spinning = false
            }, 800)
          })
      },

      // 获取创意设置详情
      getAdIdeaItemDetail(advertiserId, adId) {
        this.tableTab = 'plan'
        this.detailVisible = true
        this.ideaSettingDetail.spinning = true
        this.$API
          .getPromotionAdIdeaDetail(advertiserId, adId)
          .then(({ code, data }) => {
            if (code === 0) {
              this.ideaSettingDetail = data
            }
          })
          .finally(() => {
            setTimeout(() => {
              this.ideaSettingDetail.spinning = false
            }, 800)
          })
      },

      // 广告计划- 获取创意视频信息
      getAdIdeaVideoListDetail(advertiserId, adId) {
        this.spinning = true
        this.ideaVideoData = []
        this.$API
          .getPromotionIdeaList({ advertiserId, adId })
          .then(({ code, data }) => {
            if (code === 0) {
              this.ideaVideoData = data
            }
          })
          .finally(() => {
            this.spinning = false
          })
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../promotion.less';
  .element-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .drawer-header {
    .element-center();

    &-left {
      display: inline-block;
      .text {
        margin-left: 20px;
        font-weight: 700;
      }
    }

    &-right {
      .element-center();
    }

    .icon {
      font-size: 20px;
      font-weight: 700;
      cursor: pointer;
    }
  }

  .content-header {
    .element-center();
    height: 50px;
    padding-right: 12px;

    .status,
    .more-operation {
      .element-center();
    }
  }

  .content-main {
    display: flex;
    padding: 12px;
    color: #333;
    background-color: #e8e8e8;
    height: calc(100vh - 100px);
    .content-left {
      width: 516px;
      overflow-y: auto;
      .card-content-group {
        margin-top: 12px;
        overflow-y: auto;
        /deep/ .ant-card-body {
          min-height: calc(100vh - 259px);
        }
      }
      .label-text {
        color: #999;
      }
    }

    .content-right {
      min-width: 310px;
      margin-left: 12px;
      height: calc(100vh - 125px);
      overflow: hidden;

      .list-area-wrap {
        display: flex;
        flex-direction: column;
        padding-left: 18px;
        height: calc(100vh - 210px);
        min-width: 265px;
        overflow-y: auto;
      }

      .creative-info-area {
        height: 194px;
        display: inline-block;
        border-bottom: 1px solid #e4e9ed;
        margin-bottom: 6px;

        .creative-title {
          width: 275px;
          margin: 10px 0;
          font-size: 13px;
          line-height: 20px;
        }

        .creative-info {
          display: flex;
          height: 90px;
          width: 100%;

          .stat-data {
            margin-left: 12px;
            padding: 2px 0;
            width: 126px;
            height: 90px;

            .stat-line {
              line-height: 22px;
              font-size: 12px;
              color: #333;
              overflow: hidden;

              .title {
                width: 50px;
                color: #999;
                margin-right: 8px;
                float: left;
              }
            }
          }

          .preview-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            border-radius: 4px;
            overflow: hidden;

            .image-mode {
              position: absolute;
              bottom: 0;
              right: 0;
              white-space: nowrap;
              background: rgba(0, 0, 0, 0.5093);
              border-radius: 6px 0 6px 0;
              font-size: 11px;
              font-weight: 400;
              color: #fff;
              line-height: 16px;
              padding: 0 2px;
            }
          }
        }

        .creative-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 40px;
          margin-right: 30px;

          .status-circle {
            color: #c1c1c1;
            font-size: 12px;
          }
        }
      }

      &-header {
        &__title {
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          justify-items: center;
        }

        &__filter {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 40px;
          background-color: #f8f9fa;
          border-top: 1px solid #e4e9ed;
          position: relative;
          margin-top: 16px;

          .selector {
            width: 50%;

            /deep/ .ant-select-selection {
              background-color: transparent;
              border: none;
            }

            /deep/ .ant-select-selection__rendered {
              margin-left: 28px;
            }
          }

          .sort-filter {
            &:before {
              content: '';
              width: 1px;
              height: 16px;
              background-color: #cfd2d6;
              position: absolute;
              margin-top: 5px;
              margin-left: 8px;
            }

            /deep/ .ant-select-selection {
              background-color: transparent;
              border-left: none;
            }
          }
        }
      }

      /deep/ .ant-card-head {
        padding: 0;

        .ant-card-head-title {
          padding-bottom: 0;
        }
      }

      /deep/ .ant-card-body {
        min-height: calc(100vh - 223px);
        overflow: hidden;
        padding: 0;
      }
    }

    &-digital {
      background-color: #fff;
      width: 100%;
    }
  }

  .tab-menu-item {
    margin-top: -1px;
    width: 47px;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .detail-tabs {
    /deep/ .ant-tabs-tab {
      margin: 0;
      padding: 0;
    }
  }

  .detail-tabs-child {
    /deep/ .ant-tabs-tab {
      margin: 0 32px 0 0;
      padding: 12px 16px;
    }
  }

  .global-title {
    margin: 0 0 15px;
    font-size: 15px;
    color: #000;
    &:not(first-child) {
      margin-top: 15px;
    }
  }
</style>

<style lang="less">
  .detail-drawer {
    .ant-drawer-header {
      padding: 15px;
    }

    .ant-drawer-body {
      padding: 0;
    }

    .ant-tabs .ant-tabs-left-content {
      padding-left: 0;
    }

    .ant-card-body {
      padding: 12px 24px;
    }

    .loading-wrap {
      display: flex;
      justify-content: center;
      padding-top: 50%;
      position: absolute;
      z-index: 111;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: hsla(0, 0%, 100%, 0.9);
    }

    .idea-type-wrap {
      // 多行折叠
      .row-collapse {
        max-height: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }

      .row-expand-btn {
        cursor: pointer;
        color: #2f88ff;
        text-align: right;
        margin-top: 4px;
      }
    }

    .ant-drawer-content {
      height: unset;
      overflow-y: hidden;
    }

    .ant-drawer-wrapper-body {
      overflow: hidden;
    }
  }

  .global {
    width: 100%;
    height: 120px;
    line-height: 120px;
    font-size: 15px;
    color: #ccc;
    text-align: center;
    display: inline-block;
    user-select: none;
  }
</style>

<style lang="less" scoped>
  @import '~/assets/css/close.less';
</style>
