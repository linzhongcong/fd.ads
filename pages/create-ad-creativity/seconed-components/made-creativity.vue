<!--
 * @Author: huangjianhan
 * @Date: 2021-05-26 14:25:42
 * @LastEditTime: 2021-06-16 11:12:47
 * @LastEditors: Please set LastEditors
 * @Description: 创建广告创意 - 制作创意
 * @FilePath: \ads.fandow.com\pages\create-ad-creativity\seconed-components\made-creativity.vue
-->
<template>
  <div class="made-creativity form-component_element">
    <div class="component-element_letter">制作创意</div>

    <!-- 创意方式 -->
    <div class="component-element_adname">
      <span class="hint-item"></span>
      <div class="element-style">
        创意方式
        <span class="required-style"></span>
      </div>
      <a-radio-group default-value="custom">
        <a-radio-button value="program" disabled>
          程序化创意
        </a-radio-button>
        <a-radio-button value="custom" disabled>
          自定义创意
        </a-radio-button>
      </a-radio-group>
    </div>

    <!-- 创意内容 -->
    <div class="component-element_adname margin-top-20">
      <span class="hint-item"></span>
      <div class="element-style">
        创意内容
        <span class="required-style"></span>
      </div>
      <div class="creative-number">
        创意个数：
        <span class="num">{{ submitData.creatives.length }}/10</span>
      </div>
    </div>
    <!-- 创意内容 -->
    <div class="component-element_adname margin-top-20">
      <span class="hint-item"></span>
      <div class="element-style"></div>
      <div class="tabs-nav-item">
        <ul class="bui-tabs-nav">
          <li
            v-for="(item, index) in creativityTabObject"
            :class="currentNum === index ? 'active-nav' : ''"
            class="image-mode-tab"
            @click="selectedNav(index, item)"
          >
            <span class="img-box">
              <img :src="item.imageSrc" alt="如侵权，请联系官方进行更换" />
            </span>
            <span class="title">{{ item.letter }}</span>
          </li>
        </ul>
        <!-- 创意视频类型模板 -->
        <creativity-video :imageMode="imageMode" @passVertical="vertical" />
      </div>
    </div>

    <!-- 来源 -->
    <div class="component-element_adname margin-top-20">
      <span class="hint-item">
        <a-popover class="popover-style_reset" placement="topLeft">
          <template slot="content">
            <div class="popover-content">
              <div class="popover-letter">
                来源即广告来源，展示在广告左下角，修改来源触发审核，来源需与公司名称或公司名称简称保持一致
              </div>
            </div>
          </template>
          <a-button><a-icon type="question-circle" /></a-button>
        </a-popover>
      </span>
      <div class="element-style">
        <span>来源</span>
        <span class="required-style"></span>
      </div>
      <div class="tabs-nav-item">
        <a-form-model-item
          prop="title"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              validator: checkSource,
            },
          ]"
        >
          <a-input
            v-model.trim="submitData.source"
            placeholder="请输入来源"
            allow-clear
            style="width: 429px;"
          />
          <span class="margin-left-10">{{ submitData.source.length }}/10</span>
        </a-form-model-item>
      </div>
    </div>

    <!-- 品牌主页 -->
    <div class="component-element_adname margin-top-20">
      <span class="hint-item">
        <a-popover class="popover-style_reset" placement="topLeft">
          <template slot="content">
            <div class="popover-content">
              <div class="popover-letter">
                启用品牌主页后，可实现在客户端点击头像、昵称时进入您的主页（不启用主页时进入落地页）；使用抖音主页视频时，默认开启主页，使用达人视频（授权类型为以达人身份推广时）默认进入达人主页；达人视频（授权类型为以您的身份推广时），将进入您的主页。
              </div>
            </div>
          </template>
          <a-button><a-icon type="question-circle" /></a-button>
        </a-popover>
      </span>
      <div class="element-style">
        <span>品牌主页</span>
        <span class="required-style"></span>
      </div>
      <a-radio-group default-value="no">
        <a-radio-button value="no">
          不开启
        </a-radio-button>
        <a-radio-button value="open" disabled>
          开启
        </a-radio-button>
      </a-radio-group>
    </div>

    <!-- 广告评论 -->
    <div class="component-element_adname margin-top-20">
      <span class="hint-item"></span>
      <div class="element-style">
        <span>广告评论</span>
        <span class="required-style"></span>
      </div>
      <a-radio-group v-model="submitData.isCommentDisable">
        <a-radio-button value="0">
          关闭
        </a-radio-button>
        <a-radio-button value="1" disabled>
          开启
        </a-radio-button>
      </a-radio-group>
    </div>

    <!-- 广告评论 - 注意点 -->
    <div class="component-element_adname margin-top-20">
      <span class="hint-item"></span>
      <div class="element-style"></div>
      <div class="tabs-nav-item">
        <a-icon class="warning-icon" type="exclamation-circle"></a-icon>
        <span>抖音暂时不支持关闭广告评论功能</span>
      </div>
    </div>

    <!-- 客户端下载视频 -->
    <div class="component-element_adname margin-top-20">
      <span class="hint-item"></span>
      <div class="element-style">
        <span>客户端下载视频</span>
      </div>
      <a-radio-group v-model="submitData.adDownloadStatus">
        <a-radio-button value="0">
          关闭
        </a-radio-button>
        <a-radio-button value="1">
          开启
        </a-radio-button>
      </a-radio-group>
    </div>

    <!-- 创意展现 -->
    <div class="component-element_adname margin-top-20">
      <span class="hint-item"></span>
      <div class="element-style">
        <span>创意展现</span>
        <span class="required-style"></span>
      </div>
      <a-radio-group v-model="submitData.creativeDisplayMode">
        <a-radio-button value="CREATIVE_DISPLAY_MODE_CTR">
          优选模式
        </a-radio-button>
        <a-radio-button value="CREATIVE_DISPLAY_MODE_RANDOM">
          轮播模式
        </a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>

<script>
  import { debounce, judgeEmpty } from '~/utils/utils'
  import creativityVideo from '../third-components/creativity-video-template'
  export default {
    components: {
      creativityVideo,
    },
    watch: {
      submitData: {
        handler(newVal) {
          this.passValue(newVal)
        },
        deep: true,
        immediate: true,
      },
    },
    data() {
      this.passValue = debounce(this.passValue, 500)
      return {
        submitData: {
          // 创意方式 STATIC_ASSEMBLE：程序化创意 不传：表示自定义创意或其他
          // creativeMaterialMode: '',
          // 来源
          source: '',
          // 品牌主页 不传入值不开启
          // iesCoreUserId: '',
          // 广告评论
          isCommentDisable: '0',
          // 客户端下载视频
          adDownloadStatus: '0',
          // 创意展现
          creativeDisplayMode: 'CREATIVE_DISPLAY_MODE_CTR',
          // 推广卡片
          creatives: [],
        },
        // 创意内容类型对象
        creativityTabObject: [
          {
            imageSrc:
              'http://sf1-ttcdn-tos.pstatp.com/obj/ttfe/adfe/platform/creative_type/V5/15_S.svg',
            letter: '竖版视频',
            current: 'open',
            value: 'CREATIVE_IMAGE_MODE_VIDEO_VERTICAL',
          },
          {
            imageSrc:
              'https://sf1-ttcdn-tos.pstatp.com/obj/ttfe/adfe/platform/creative_type/V5/5_S.svg',
            letter: '横版视频',
            current: 'close',
            value: 'CREATIVE_IMAGE_MODE_VIDEO',
          },
          {
            imageSrc:
              'https://sf1-ttcdn-tos.pstatp.com/obj/ttfe/adfe/platform/creative_type/V3/3_S.svg',
            letter: '大图横图',
            current: 'close',
            value: 'CREATIVE_IMAGE_MODE_LARGE',
          },
          {
            imageSrc:
              'https://sf1-ttcdn-tos.pstatp.com/obj/ttfe/adfe/platform/creative_type/V3/4_S.svg',
            letter: '组图',
            current: 'close',
            value: 'CREATIVE_IMAGE_MODE_GROUP',
          },
          {
            imageSrc:
              'https://sf1-ttcdn-tos.pstatp.com/obj/ttfe/adfe/platform/creative_type/V5/2_S.svg',
            letter: '小图',
            current: 'close',
            value: 'CREATIVE_IMAGE_MODE_SMALL',
          },
          {
            imageSrc:
              'https://sf1-ttcdn-tos.pstatp.com/obj/ttfe/adfe/platform/creative_type/V5/2_S.svg',
            letter: '大图竖图',
            current: 'close',
            value: 'CREATIVE_IMAGE_MODE_LARGE_VERTICAL',
          },
        ],
        currentNum: 0,
        // 素材类型
        imageMode: 'CREATIVE_IMAGE_MODE_VIDEO_VERTICAL',
      }
    },
    methods: {
      // 选中当前的索引值
      selectedNav(index, dataObj) {
        if (dataObj.value === 'CREATIVE_IMAGE_MODE_VIDEO_VERTICAL') {
          this.imageMode = dataObj.value
          this.currentNum = index
        }
      },

      // 校验来源字段
      checkSource(rule, value, callback) {
        if (!this.submitData.source) callback('请输入来源，来源2-10个字')
        if (this.submitData.source.length < 2 || this.submitData.source.length > 10)
          callback('来源2-10个字')
        else callback()
      },

      // 创意模板创建值传递
      vertical(value) {
        this.submitData.creatives = value
      },

      // 传递值进入父组件
      passValue(value) {
        // const judgeObj = judgeEmpty(value)
        // if (judgeObj.objLength === judgeObj.emptyLength) {
        this.$emit('creativityValPass', value)
        // return
        // }
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../../create-ad-plan/css/component.css';
  .made-creativity {
    .ant-radio-button-wrapper-disabled.ant-radio-button-wrapper-checked {
      color: #a1caff;
      background-color: #ebf3ff;
      border-color: #a1caff;
    }
  }
  .creative-number {
    display: inline-block;
    font-size: 14px;
    color: #999;
    margin-top: 6px;
    .num {
      font-weight: bold;
      color: #333;
    }
  }
  .bui-tabs-nav {
    padding: 0;
  }
  .image-mode-tab {
    display: inline-flex;
    position: relative;
    background: #fff;
    box-shadow: 0px 2px 4px 0px #eff1fa;
    border-radius: 4px;
    border: 1px solid #dee4f5;
    width: 140px;
    padding: 16px;
    margin-left: 8px;
    cursor: pointer;
    align-items: center;
    .img-box {
      width: 38px;
      height: 52px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .title {
      width: 56px;
      margin: auto 0 auto 12px;
      font-weight: bold;
      font-size: 14px;
      white-space: normal;
      color: #333333;
    }
    &:first-child {
      margin: 0;
    }
    &:not(:first-child) {
      color: rgba(0, 0, 0, 0.25);
      background: #f5f5f5;
      border-color: #d9d9d9;
    }
  }
  .tabs-nav-item {
    /deep/ .ant-form-item {
      margin-bottom: 0;
    }
  }
  .active-nav {
    border-color: #2f88ff;
  }
</style>
