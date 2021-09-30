<!--
 * @Author: huangjianhan
 * @Date: 2021-05-27 14:17:00
 * @LastEditTime: 2021-06-12 06:30:18
 * @LastEditors: Please set LastEditors
 * @Description: 创意分类模块
 * @FilePath: \ads.fandow.com\pages\create-ad-creativity\seconed-components\creativity-classify.vue
-->
<template>
  <div class="classify-content form-component_element">
    <div class="component-element_letter">创意分类</div>

    <!-- 创意分类 -->
    <div class="component-element_adname">
      <span class="hint-item"></span>
      <div class="element-style">
        创意分类
        <span class="required-style"></span>
      </div>
      <a-cascader
        change-on-select
        :options="options"
        :field-names="{ label: 'value', value: 'label', children: 'children' }"
        :getPopupContainer="
          (triggerNode) => {
            return triggerNode.parentNode || document.body
          }
        "
        @change="setThirdIndustryId"
        placeholder="请选择"
        style="min-width: 480px;"
      >
        <template slot="displayRender" slot-scope="{ labels, selectedOptions }">
          <span v-for="(label, index) in labels" :key="selectedOptions[index].label">
            <span v-if="index === labels.length - 1">
              {{ selectedOptions[index].value }}
              <a @click="(e) => handleAreaClick(e, label, selectedOptions[index])"></a>
            </span>
            <span v-else>{{ selectedOptions[index].value }} /</span>
          </span>
        </template>
      </a-cascader>
    </div>

    <!-- 创意标签 -->
    <div class="component-element_adname margin-top-20 margin-bottom-10">
      <span class="hint-item"></span>
      <div class="element-style">
        创意标签
        <span class="required-style"></span>
      </div>
      <div style="min-width: 480px;">
        <a-input-search
          v-model.trim="creativityGlobal"
          placeholder="最多20个标签，每个不超过10个字，可空格分隔"
          :max-length="10"
          size="default"
          @pressEnter="addTag"
          @search="addTag"
        >
          <a-button slot="enterButton">
            添加(回车键)
          </a-button>
        </a-input-search>
      </div>
    </div>

    <!-- 创意标签选中内容 -->
    <div class="component-element_adname" style="margin-top: 30px;">
      <span class="hint-item"></span>
      <div class="element-style"></div>
      <select-option
        v-if="submitForm.adKeywords.length"
        :selectedArray="submitForm.adKeywords"
        @passClearData="clearData"
      />
    </div>
  </div>
</template>

<script>
  import selectOption from '../../../components/select-option-tab/select-option'
  export default {
    components: { selectOption },

    watch: {
      submitForm: {
        handler(newVal) {
          if (newVal.thirdIndustryId && newVal.adKeywords.length) {
            this.$emit('passClassify', newVal)
          }
        },
        deep: true,
        immediate: true,
      },
    },

    data() {
      return {
        // 创意分类
        options: [
          {
            value: 'zhejiang',
            label: 'Zhejiang',
            children: [
              {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                  {
                    value: 'xihu',
                    label: 'West Lake',
                  },
                ],
              },
            ],
          },
          {
            value: 'jiangsu',
            label: 'Jiangsu',
            children: [
              {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                  {
                    value: 'zhonghuamen',
                    label: 'Zhong Hua Men',
                  },
                ],
              },
            ],
          },
        ],

        // 表单提交
        submitForm: {
          thirdIndustryId: '',
          // 存放标签的数组
          adKeywords: [],
        },

        // 创意标签
        creativityGlobal: '',
      }
    },

    mounted() {
      this.initData()
    },

    methods: {
      initData() {
        this.getLevelData({
          advertiserId: this.$route.query.advertiserId,
        })
      },

      // 获取级联数据
      getLevelData(params) {
        this.$API.createAdIndustryList(params).then(({ code, data }) => {
          if (code === 0) {
            this.options = data
          }
        })
      },

      // 创意分类值改变处理
      setThirdIndustryId(option) {
        this.submitForm.thirdIndustryId = option[option.length - 1]
      },

      // 选中某个值时
      onChange(value) {},

      // 阻止默认事件
      handleAreaClick(e, label, option) {
        e.stopPropagation()
      },

      // 添加创意标签
      addTag() {
        if (!this.creativityGlobal) {
          this.$message.error('请输入创意标签')
          return
        }
        if (this.creativityGlobal.indexOf(' ') !== -1) {
          this.submitForm.adKeywords = Array.from(
            new Set([...this.submitForm.adKeywords, ...this.creativityGlobal.split(' ')])
          )
        } else {
          this.submitForm.adKeywords.push(this.creativityGlobal)
        }
        if (this.submitForm.adKeywords.length > 20) {
          this.$message.error('最多20个创意标签')
          // 限制长度 防止超过20个创意标签
          this.submitForm.adKeywords.length = 20
          return
        }
        this.creativityGlobal = ''
      },

      // 删除选中的数据
      clearData(params) {
        this.submitForm.adKeywords = params
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../../create-ad-plan/css/component.css';
</style>
