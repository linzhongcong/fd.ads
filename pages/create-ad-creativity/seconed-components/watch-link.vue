<!--
 * @Author: huangjianhan
 * @Date: 2021-05-27 15:50:31
 * @LastEditTime: 2021-05-31 12:38:47
 * @LastEditors: Please set LastEditors
 * @Description: 监测链接
 * @FilePath: \ads.fandow.com\pages\create-ad-creativity\seconed-components\watch-link.vue
-->
<template>
  <div class="watch-link form-component_element">
    <div class="component-element_letter link-before_letter">监测链接</div>

    <!-- 展示 -->
    <div class="component-element_adname">
      <span class="hint-item"></span>
      <div class="element-style">
        展示
      </div>
      <a-input
        v-model="form.trackUrl"
        :min-length="0"
        placeholder="请输入链接地址"
        style="width: 420px;"
      ></a-input>
    </div>

    <!-- 有效触点 -->
    <div class="component-element_adname margin-top-32">
      <span class="hint-item">
        <a-popover class="popover-style_reset" placement="topLeft">
          <template slot="content">
            <div class="popover-content">
              <div class="popover-letter">
                对于投放位置为抖音类沉浸视频广告位的oCPM广告，下发“3秒视频播放”和“点击”（如：抖音、抖音火山版等）；对于投放位置为穿山甲视频广告位（如：激励视频）的oCPM广告，下发“10~20秒视频播放”和“点击”；对于其他投放位置的广告，仍仅下发“点击”
                <a
                  href="https://ad.oceanengine.com/openapi/doc/index.html?key=ad&type=api&id=1696710655781900"
                >
                  详情查看
                </a>
              </div>
            </div>
          </template>
          <a-button><a-icon type="question-circle" /></a-button>
        </a-popover>
      </span>
      <div class="element-style">
        有效触点
      </div>
      <a-input
        v-model="form.actionTrackUrl"
        :min-length="0"
        placeholder="请输入链接地址"
        style="width: 420px;"
      ></a-input>
    </div>

    <!-- 视频播放 -->
    <div class="component-element_adname margin-top-32">
      <span class="hint-item"></span>
      <div class="element-style">
        视频播放
      </div>
      <a-input
        v-model="form.videoPlayTrackUrl"
        :min-length="0"
        placeholder="请输入链接地址"
        style="width: 420px;"
      ></a-input>
    </div>

    <!-- 视频播完 -->
    <div class="component-element_adname margin-top-32">
      <span class="hint-item"></span>
      <div class="element-style">
        视频播完
      </div>
      <a-input
        v-model="form.videoPlayDoneTrackUrl"
        :min-length="0"
        placeholder="请输入链接地址"
        style="width: 420px;"
      ></a-input>
    </div>

    <!-- 视频有效播放 -->
    <div class="component-element_adname margin-top-32">
      <span class="hint-item"></span>
      <div class="element-style">
        视频有效播放
      </div>
      <a-input
        v-model="form.videoPlayEffectiveTrackUrl"
        :min-length="0"
        placeholder="请输入链接地址"
        style="width: 420px;"
      ></a-input>
    </div>
  </div>
</template>

<script>
  import { debounce } from '~/utils/utils'
  export default {
    watch: {
      form: {
        handler(newVal) {
          this.passVal(newVal)
        },
        deep: true,
        immediate: true,
      },
    },

    data() {
      this.passVal = debounce(this.passVal, 500)
      return {
        // 传递数据对象
        form: {
          trackUrl: '',
          actionTrackUrl: '',
          videoPlayTrackUrl: '',
          videoPlayDoneTrackUrl: '',
          videoPlayEffectiveTrackUrl: '',
        },
      }
    },
    methods: {
      passVal(params) {
        const objLength = Object.keys(params).length
        let emptyLength = 0,
          emptyField = []
        for (let key in params) {
          if (params[key]) {
            emptyLength++
          } else {
            emptyField.push(key)
          }
        }
        if (objLength === emptyLength) {
          this.$emit('linkValPass', params)
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '@/assets/css/create-ad/component.css';
  .link-before_letter {
    position: relative;
    &::after {
      content: '自2021年3月10日起，新创建的广告计划“点击监测链接”升级为“有效触点监测链接”。';
      position: absolute;
      top: 20%;
      margin-left: 16px;
      font-size: 12px;
      color: #888;
    }
  }
</style>
