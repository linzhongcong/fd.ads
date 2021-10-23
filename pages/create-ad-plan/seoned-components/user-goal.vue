<!--
 * @Author: huangjianhan
 * @Date: 2021-04-07 10:51:10
 * @LastEditTime: 2021-09-22 08:39:49
 * @LastEditors: Please set LastEditors
 * @Description: 用户定向
 * @FilePath: \ads.fandow.com\pages\create-ad-plan\components\user-goal.vue
-->
<template>
  <div class="user-goal">
    <a-form class="form-component_element">
      <div class="component-element_letter">用户定向</div>
      <!-- 切换栏 start -->
      <div class="component-change_page block-24">
        <span
          class="change-page"
          :class="currentStatu === 'create' ? 'change-active' : ''"
          @click="changeCurrent('create')"
        >
          新建定向
        </span>
        <!-- <span
          class="change-page"
          :class="currentStatu === 'had' ? 'change-active' : ''"
          @click="changeCurrent('had')"
        >
          选择已有定向包
        </span> -->
      </div>
      <!-- end -->
      <!-- 用户输入界面 -->
      <!-- 新建定向 start -->
      <div v-if="currentStatu === 'create'">
        <!-- <div class="copy-already block-24">
          <a-icon type="copy" @click="openCopyUser" />
          复制已有定向
        </div> -->
        <div class="component-element_adname block-24">
          <span class="hint-item">
            <a-popover class="popover-style_reset" placement="topLeft">
              <template slot="content">
                <!-- 起泡提示信息 -->
                <div class="popover-content">
                  <div class="popover-letter">
                    将广告投放至指定省市、区县、商圈或者海外国家的人群。
                  </div>
                  <div class="popover-letter">
                    正在：近期在该地的用户
                  </div>
                  <div class="popover-letter">
                    居住：在长时间内常驻在该地区的用户
                  </div>
                  <div class="popover-letter">
                    旅行：近期在该地，但非常驻的用户
                  </div>
                  <div class="popover-letter">
                    所有：旅行+居住+正在该地区的所有用户
                  </div>
                </div>
              </template>
              <a-button><a-icon type="question-circle" /></a-button>
            </a-popover>
          </span>
          <div class="element-style">
            地域
          </div>
          <a-radio-group default-value="不限">
            <a-radio-button
              v-for="item in territoryArray"
              :key="item.value"
              :value="item.value"
              :disabled="item.label === '不限' ? false : true"
            >
              {{ item.label }}
            </a-radio-button>
          </a-radio-group>
        </div>
        <div class="component-element_adname block-24">
          <!-- 起泡提示信息 -->
          <span class="hint-item">
            <a-popover class="popover-style_reset" placement="topLeft">
              <template slot="content">
                <div class="popover-content">
                  <div class="popover-letter">
                    通过字节跳动旗下app数据,模型算法预测的用户性别。
                  </div>
                </div>
              </template>
              <a-button><a-icon type="question-circle" /></a-button>
            </a-popover>
          </span>
          <!-- 选项 -->
          <div class="element-style">
            性别
          </div>
          <a-radio-group default-value="不限">
            <a-radio-button v-for="item in sexArray" :value="item.value" :key="item.value">
              {{ item.value }}
            </a-radio-button>
          </a-radio-group>
        </div>
        <div class="component-element_adname block-24">
          <!-- 起泡提示信息 -->
          <span class="hint-item">
            <a-popover class="popover-style_reset" placement="topLeft">
              <template slot="content">
                <div class="popover-content">
                  <div class="popover-letter">
                    通过字节跳动旗下app数据,模型算法预测的用户年龄区间。
                  </div>
                </div>
              </template>
              <a-button><a-icon type="question-circle" /></a-button>
            </a-popover>
          </span>
          <!-- 选项 -->
          <div class="element-style">
            年龄
          </div>
          <a-radio-group default-value="不限">
            <a-radio-button
              v-for="(item, index) in ageArray"
              :value="item.value"
              :key="item.value"
              :disabled="item.value === '不限' ? false : true"
            >
              {{ item.value }}
            </a-radio-button>
          </a-radio-group>
          <!-- <checkbox-template /> -->
        </div>
        <div class="component-element_adname block-24">
          <!-- 起泡提示信息 -->
          <span class="hint-item">
            <a-popover class="popover-style_reset" placement="topLeft">
              <template slot="content">
                <div class="popover-content">
                  <div class="popover-letter">
                    定向投放或者排除自定义人群包，您可点击下方的管理自定义人群包进入DMP平台创建或者管理自定义人群包。
                  </div>
                </div>
              </template>
              <a-button><a-icon type="question-circle" /></a-button>
            </a-popover>
          </span>
          <!-- 选项 -->
          <div class="element-style">
            自定义人群
          </div>
          <a-radio-group default-value="不限">
            <a-radio-button value="不限">
              不限
            </a-radio-button>
            <a-radio-button value="自定义人群" disabled>
              自定义人群
            </a-radio-button>
          </a-radio-group>
        </div>
        <div class="component-element_adname block-24">
          <!-- 起泡提示信息 -->
          <span class="hint-item"></span>
          <!-- 选项 -->
          <div class="element-style">
            行为兴趣
          </div>
          <a-radio-group default-value="不限">
            <a-radio-button value="不限">
              不限
            </a-radio-button>
            <a-radio-button value="系统推荐" disabled>
              系统推荐
              <a-popover class="popover-style_reset" placement="topLeft">
                <template slot="content">
                  <div class="popover-content">
                    <div class="popover-letter">
                      若与自定义人群包同时使用，选择定向人群时系统推荐定向不生效
                    </div>
                  </div>
                </template>
                <a-button><a-icon type="question-circle" /></a-button>
              </a-popover>
            </a-radio-button>
            <a-radio-button value="自定义" disabled>
              自定义
              <a-popover class="popover-style_reset" placement="topLeft">
                <template slot="content">
                  <div class="popover-content">
                    <div class="popover-letter">
                      选择有以下行为特征或兴趣特征的用户
                    </div>
                  </div>
                </template>
                <a-button><a-icon type="question-circle" /></a-button>
              </a-popover>
            </a-radio-button>
          </a-radio-group>
        </div>
        <div class="component-element_adname block-24">
          <!-- 起泡提示信息 -->
          <span class="hint-item">
            <a-popover class="popover-style_reset" placement="topLeft">
              <template slot="content">
                <div class="popover-content">
                  <div class="popover-letter">
                    圈定单个或某类抖音账号后，投放时会定向与该（类）账号的粉丝有相似互动行为的人群
                  </div>
                </div>
              </template>
              <a-button><a-icon type="question-circle" /></a-button>
            </a-popover>
          </span>
          <!-- 选项 -->
          <div class="element-style">
            抖音达人
          </div>
          <a-radio-group default-value="不限">
            <a-radio-button value="不限">
              不限
            </a-radio-button>
            <a-radio-button value="自定义" disabled>
              自定义
            </a-radio-button>
          </a-radio-group>
        </div>
        <div class="component-element_adname block-24">
          <span class="hint-item"></span>
          <!-- 选项 -->
          <div class="element-style">
            平台
          </div>
          <a-radio-group default-value="不限">
            <a-radio-button
              v-for="(item, index) in platformArray"
              :key="item.value"
              :value="item.value"
              :disabled="item.label === '不限' ? false : true"
            >
              {{ item.label }}
              <a-popover v-if="item.value === 'PC'" class="popover-style_reset" placement="topLeft">
                <template slot="content">
                  <div class="popover-content">
                    <div class="popover-title">PC设置提示</div>
                    <div class="popover-letter">
                      选择PC后，其他用户定向设置不生效
                    </div>
                  </div>
                </template>
                <a-button><a-icon type="question-circle" /></a-button>
              </a-popover>
            </a-radio-button>
          </a-radio-group>
        </div>
        <div class="component-element_adname block-24">
          <span class="hint-item">
            <a-popover class="popover-style_reset" placement="topLeft">
              <template slot="content">
                <div class="popover-content">
                  <div class="popover-letter">
                    建议促进app活跃度客户使用定向安装功能。选择定向安装时，向已安装客户展示广告；投放时优先获取直达链接，无直达链接时使用应用包名进行投放；如果无直达链接或应用包名，定向安装选项实际不生效；仅对Android链接生效。
                  </div>
                </div>
              </template>
              <a-button><a-icon type="question-circle" /></a-button>
            </a-popover>
          </span>
          <!-- 选项 -->
          <div class="element-style">
            已安装用户
          </div>
          <a-radio-group default-value="不限">
            <a-radio-button value="不限">
              不限
            </a-radio-button>
            <a-radio-button value="过滤" disabled>
              过滤
            </a-radio-button>
            <a-radio-button value="定向" disabled>
              定向
            </a-radio-button>
          </a-radio-group>
        </div>
        <div class="component-element_adname block-24 block-bottom_style">
          <span class="hint-item">
            <a-popover class="popover-style_reset" placement="topLeft">
              <template slot="content">
                <div class="popover-content">
                  <div class="popover-letter">
                    智能放量可以帮您逐步探索已选定向之外的人群。可放开定向建议全选。
                  </div>
                </div>
              </template>
              <a-button><a-icon type="question-circle" /></a-button>
            </a-popover>
          </span>
          <!-- 选项 -->
          <div class="element-style">
            智能放量
          </div>
          <div class="element-right_style">
            <a-radio-group default-value="不启用">
              <a-radio-button value="不启用">
                不启用
              </a-radio-button>
              <a-radio-button value="启用" disabled>
                启用
              </a-radio-button>
            </a-radio-group>
            <div class="warning-tips" @click="advancedOptions">
              <a-icon class="warning-icon" type="exclamation-circle" />
              智能放量不支持受众预估
            </div>
          </div>
        </div>
        <div class="advanced-content_style" v-if="advancedStatu">
          <div class="component-element_adname block-24">
            <span class="hint-item">
              <a-popover class="popover-style_reset" placement="topLeft">
                <template slot="content">
                  <div class="popover-content">
                    <div class="popover-letter">
                      只针对投放在详情页位置的广告生效, 不支持人群预估
                    </div>
                  </div>
                </template>
                <a-button><a-icon type="question-circle" /></a-button>
              </a-popover>
            </span>
            <!-- 选项 -->
            <div class="element-style">
              文章分类
            </div>
            <a-radio-group default-value="不限">
              <a-radio-button value="不限">
                不限
              </a-radio-button>
              <a-radio-button value="文章分类" disabled>
                文章分类
              </a-radio-button>
            </a-radio-group>
          </div>
          <div class="component-element_adname block-24">
            <span class="hint-item"></span>
            <!-- 选项 -->
            <div class="element-style">
              网络
            </div>
            <a-radio-group default-value="不限">
              <a-radio-button
                v-for="(item, index) in networkArray"
                :key="item.value"
                :value="item.value"
                :disabled="item.label === '不限' ? false : true"
              >
                {{ item.label }}
              </a-radio-button>
            </a-radio-group>
          </div>
          <div class="component-element_adname block-24">
            <span class="hint-item">
              <a-popover class="popover-style_reset" placement="topLeft">
                <template slot="content">
                  <div class="popover-content">
                    <div class="popover-letter">
                      选择过滤已转化用户之后，可以避免该广告再次投放给已转化过的用户，可以选择过滤4个广告层级的已转化用户（不限/广告计划/广告组/广告账户/公司账户）
                    </div>
                  </div>
                </template>
                <a-button><a-icon type="question-circle" /></a-button>
              </a-popover>
            </span>
            <!-- 选项 -->
            <div class="element-style">
              过滤已转化用户
            </div>
            <div class="element-right_style">
              <a-radio-group default-value="不限">
                <a-radio-button
                  v-for="(item, index) in conversionArray"
                  :key="item.value"
                  :value="item.value"
                  :disabled="item.label === '不限' ? false : true"
                >
                  {{ item.label }}
                </a-radio-button>
              </a-radio-group>
              <div class="warning-tips" @click="advancedOptions">
                <a-icon class="warning-icon" type="exclamation-circle" />
                过滤已转化不支持投放目标为展示、点击计划，不支持受众预估
              </div>
            </div>
          </div>
          <div class="component-element_adname block-top-24">
            <span class="hint-item"></span>
            <!-- 选项 -->
            <div class="element-style">
              运营商
            </div>
            <a-radio-group default-value="不限">
              <a-radio-button
                v-for="(item, index) in operatorArray"
                :key="item.value"
                :value="item.value"
                :disabled="item.label === '不限' ? false : true"
              >
                {{ item.label }}
              </a-radio-button>
            </a-radio-group>
          </div>
          <div class="component-element_adname block-24">
            <span class="hint-item">
              <a-popover class="popover-style_reset" placement="topLeft">
                <template slot="content">
                  <div class="popover-content">
                    <div class="popover-letter">新用户使用头条的时间</div>
                  </div>
                </template>
                <a-button><a-icon type="question-circle" /></a-button>
              </a-popover>
            </span>
            <!-- 选项 -->
            <div class="element-style">
              新用户
            </div>
            <div class="element-right_style">
              <a-radio-group default-value="不限">
                <a-radio-button
                  v-for="(item, index) in newUserArray"
                  :key="item.value"
                  :value="item.value"
                  :disabled="item.label === '不限' ? false : true"
                >
                  {{ item.label }}
                </a-radio-button>
              </a-radio-group>
            </div>
          </div>
          <div class="component-element_adname block-24">
            <span class="hint-item"></span>
            <!-- 选项 -->
            <div class="element-style">手机品牌</div>
            <div class="element-right_style">
              <a-radio-group default-value="不限">
                <a-radio-button value="不限">
                  不限
                </a-radio-button>
                <a-radio-button value="按品牌" disabled>
                  按品牌
                </a-radio-button>
              </a-radio-group>
            </div>
          </div>
          <div class="component-element_adname block-24">
            <span class="hint-item">
              <a-popover class="popover-style_reset" placement="topLeft">
                <template slot="content">
                  <div class="popover-content">
                    <div class="popover-letter">
                      选择手机价格定向，可以通过广告受众使用手机的带折旧市场价格，来圈定受众人群
                    </div>
                  </div>
                </template>
                <a-button><a-icon type="question-circle" /></a-button>
              </a-popover>
            </span>
            <!-- 选项 -->
            <div class="element-style">手机价格</div>
            <div class="element-right_style">
              <a-radio-group default-value="不限">
                <a-radio-button value="不限">
                  不限
                </a-radio-button>
                <a-radio-button value="自定义" disabled>
                  自定义
                </a-radio-button>
              </a-radio-group>
            </div>
          </div>
          <div class="component-element_adname block-24">
            <span class="hint-item"></span>
            <!-- 选项 -->
            <div class="element-style">职业状态</div>
            <div class="element-right_style">
              <a-radio-group default-value="不限">
                <a-radio-button value="不限">
                  不限
                </a-radio-button>
                <a-radio-button value="自定义" disabled>
                  自定义
                </a-radio-button>
              </a-radio-group>
            </div>
          </div>
        </div>
        <div class="component-element_adname block-top-24">
          <div class="show-more_option" @click="advancedOptions">
            <a-icon
              class="advanced-style"
              type="double-right"
              :class="advancedStatu ? 'up-style' : 'down-style'"
            />
            <span v-if="advancedStatu">隐藏高级选项</span>
            <span v-else>显示高级选项</span>
          </div>
        </div>
        <!-- <div class="component-element_adname block-24">
          <a-button class="save-goal_button" style="margin-right: 4px;">保存为定向包</a-button>
          <span class="hint-item">
            <a-popover class="popover-style_reset" placement="topLeft">
              <template slot="content">
                <div class="popover-content">
                  <div class="popover-letter">
                    将以上定向设置保存为定向包，该定向包可直接在其他广告计划中复用
                  </div>
                </div>
              </template>
              <a-button><a-icon type="question-circle" /></a-button>
            </a-popover>
          </span>
        </div> -->
      </div>
      <!-- end -->

      <!-- 选择已有定向包 start -->
      <div class="block-24" v-if="currentStatu === 'had'">
        <div class="component-element_adname block-24">
          <span class="hint-item">
            <a-popover class="popover-style_reset" placement="topLeft">
              <template slot="content">
                <!-- 起泡提示信息 -->
                <div class="popover-content">
                  <div class="popover-letter">
                    已有定向包只展示当前推广目的和投放范围下，定向功能升级后仍可用的定向包
                  </div>
                </div>
              </template>
              <a-button><a-icon type="question-circle" /></a-button>
            </a-popover>
          </span>
          <div class="element-style" style="width: 100px;">
            已有定向包
            <span class="required-style"></span>
          </div>
          <a-select class="select-container_style"></a-select>
        </div>
        <div class="component-element_adname block-24">
          <span class="hint-item"></span>
          <div class="element-style" style="width: 100px;"></div>
          <div class="choice-content">
            <div class="choice-container select-container_style">
              <div class="choice-container_title font-style_type">已选定向信息</div>
              <div class="choice-container_data">
                <a-icon
                  type="inbox"
                  style="font-size: 35px;color: #C1C1C1;"
                  :class="false ? '' : 'not-data_style'"
                />
                请在上方选择一个已有定向包
              </div>
            </div>
            <div class="choice-tips warning-tips">
              <a-icon class="warning-icon" type="exclamation-circle" />
              过滤已转化不支持投放目标为展示、点击计划
            </div>
          </div>
        </div>
      </div>
      <!-- end -->
    </a-form>
  </div>
</template>
<script>
  import checkboxTemplate from '@/components/checkbox-component/checkbox-template'
  export default {
    components: { checkboxTemplate },
    props: {},
    data() {
      return {
        // 用户定向输入默认界面
        currentStatu: 'create',
        // 高级选项状态
        advancedStatu: false,
        // 用户定向 - 地域字段数组
        territoryArray: [
          {
            label: '不限',
            value: '不限',
          },
          {
            label: '按省市',
            value: '按省市',
          },
          {
            label: '按区市',
            value: '按区市',
          },
          {
            label: '按商圈',
            value: '按商圈',
          },
        ],
        // 用户定向 - 性别字段数组
        sexArray: [
          {
            label: '不限',
            value: '不限',
          },
          {
            label: '男',
            value: '男',
          },
          {
            label: '女',
            value: '女',
          },
        ],
        // 用户定向 - 年龄字段数组
        ageArray: [
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
        // 用户定向 - 平台字段数组
        platformArray: [
          {
            label: '不限',
            value: '不限',
          },
          {
            label: 'IOS',
            value: 'IOS',
          },
          {
            label: 'Android',
            value: 'Android',
          },
          {
            label: 'PC',
            value: 'PC',
          },
        ],
        // 用户定向高级选项 - 网络字段数组
        networkArray: [
          {
            label: '不限',
            value: '不限',
          },
          {
            label: 'WIFI',
            value: 'WIFI',
          },
          {
            label: '2G',
            value: '2G',
          },
          {
            label: '3G',
            value: '3G',
          },
          {
            label: '4G',
            value: '4G',
          },
        ],
        // 用户定向高级选项 - 过滤已转化用户字段数组
        conversionArray: [
          {
            label: '不限',
            value: '不限',
          },
          {
            label: '广告计划',
            value: '广告计划',
          },
          {
            label: '广告组',
            value: '广告组',
          },
          {
            label: '广告账户',
            value: '广告账户',
          },
          {
            label: '公司账户',
            value: '公司账户',
          },
        ],
        // 用户定向高级选项 - 运营商字段数组
        operatorArray: [
          {
            label: '不限',
            value: '不限',
          },
          {
            label: '移动',
            value: '移动',
          },
          {
            label: '联通',
            value: '联通',
          },
          {
            label: '电信',
            value: '电信',
          },
        ],
        // 用户定向高级选项 - 新用户字段数组
        newUserArray: [
          {
            label: '不限',
            value: '不限',
          },
          {
            label: '一个月以内',
            value: '一个月以内',
          },
          {
            label: '一个月到三个月',
            value: '一个月到三个月',
          },
          {
            label: '三个月以上',
            value: '三个月以上',
          },
        ],
        // 用户定向 - 表单
        userAudience: {
          district: 'none',
          gender: 'none',
          age: 'none',
          retargetingTagsInclude: [],
          retargetingTagsExclude: [],
          interestActionMode: 'UNLIMITED',
          superiorPopularityType: 'none',
          platform: [],
          deviceType: [],
          hideIfExists: 0,
          ac: [],
          hideIfConverted: 'NO_EXCLUDE',
        },
      }
    },
    mounted() {},
    methods: {
      // 切换用户定向状态
      changeCurrent(statu) {
        this.currentStatu = statu
      },

      // 打开复制用户定向弹窗
      openCopyUser() {},

      advancedOptions() {
        this.advancedStatu = !this.advancedStatu
      },
    },
  }
</script>
<style lang="less" scoped>
  @import '../css/component.css';
  .change-page:first-child {
    margin-right: 24px;
  }
  .change-page {
    color: #666;
    display: inline-block;
    cursor: pointer;
    user-select: none;
  }
  .change-page:hover {
    color: #333;
  }
  .change-active {
    font-weight: 700;
    border-bottom: 2px solid #338aff;
    color: #333;
  }
  .copy-already {
    color: #2f88ff;
  }
  .block-24 {
    margin-bottom: 24px;
  }
  .block-top-24 {
    margin: 36px 0 24px;
  }
  .element-right_style {
    display: inline-block;
    height: 32px;
  }
  .warning-tips {
    margin: 10px 0;
    .warning-icon {
      color: #f9ad14;
    }
  }
  .save-goal_button {
    margin-left: 4px;
    background-color: #f9f9f9;
  }
  .show-more_option {
    color: #2f88ff;
    cursor: pointer;
  }
  .block-bottom_style {
    margin-bottom: 66px;
  }
  .advanced-style {
    transition: 0.5s all linear;
  }
  .up-style {
    transform: rotate(270deg);
  }
  .down-style {
    transform: rotate(90deg);
  }
  .choice-container {
    height: 388px;
    border-radius: 4px;
    border: 1px solid #dadfe3;
    padding: 0px 0px 20px;
    margin-bottom: 8px;
    overflow-y: auto;
    .choice-container_title {
      height: 38px;
      line-height: 38px;
      padding-left: 13px;
      background-color: #f8f8f8;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border-bottom: 1px solid #dadfe3;
    }
  }
  .select-container_style {
    width: 520px;
  }

  .choice-container_data {
    text-align: center;
    color: #c1c1c1;
  }

  .not-data_style {
    display: block;
    margin: 122px auto 8px;
    width: 35px;
    height: 35px;
  }

  .font-style_type {
    font-size: 12px;
    color: #333;
    margin-bottom: 12px;
    margin-top: 0;
    font-weight: 500;
  }
</style>
