<!--
 * @Author: hjh
 * @Date: 2021-07-06 15:34:27
 * @LastEditTime: 2021-07-06 20:52:41
 * @LastEditors: Please set LastEditors
 * @Description: 区域多选 & 级联框
 * @FilePath: \ads.fandow.com\components\checkbox-component\area-checkbox-component.vue
-->
<template>
  <div class="cascade" v-if="typeStr === 'CITY'">
    <a-input-search
      placeholder="省市搜索不支持按拼音、拼音首字母"
      enter-button
      @search="onSearch"
      style="width: 360px"
    />
    <div class="cascade-header">
      <span
        class="cascade-header_type"
        :class="areaType === 'geography' ? 'cascade-header_active' : ''"
        @click="areaType = 'geography'"
      >
        地理划分
      </span>
      <span
        class="cascade-header_type"
        :class="areaType === 'progress' ? 'cascade-header_active' : ''"
        @click="areaType = 'progress'"
      >
        发展划分
      </span>
    </div>
    <div class="cascade-area_content">
      <!-- 地理划分 -->
      <div v-if="areaType === 'geography'" class="cascade-area_style cascade-area_left">
        <div class="cascade-left_content">
          <div class="cascade-area_header">省份</div>
          <div class="cascade-area_data">
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
          </div>
        </div>
        <div v-if="isShowCity" class="cascade-left_content cascade-left_city">
          <div class="cascade-area_header">城市</div>
          <div class="cascade-area_data">
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
            <div class="cascade-area_item">北京</div>
          </div>
        </div>
      </div>
      <!-- 发展划分 -->
      <div v-else-if="areaType === 'progress'" class="cascade-area_style cascade-area_left">
        <div class="cascade-left_content">
          <div class="cascade-area_header">等级</div>
          <div class="cascade-area_data">
            <div class="cascade-area_item">一线城市</div>
            <div class="cascade-area_item">二线城市</div>
            <div class="cascade-area_item">三线城市</div>
            <div class="cascade-area_item">四线城市</div>
            <div class="cascade-area_item">其它</div>
          </div>
        </div>
        <div class="cascade-left_content cascade-left_city">
          <div class="cascade-area_header">城市</div>
          <div class="cascade-area_data">
            <div v-for="(element, index) in progressObj.city" class="cascade-area_item">
              <span @click="setSelectedData(element.value)">{{ element.label }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="cascade-area_style cascade-area_right">
        <div class="cascade-area_header">已选</div>
        <div class="cascade-area_data">
          <div v-for="(element, index) in selectedData" class="cascade-area_item">
            {{ element.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="cascade" v-else-if="typeStr === 'COUNTY'"></div>
</template>

<script>
  export default {
    props: {
      typeStr: {
        type: String,
        default: '',
      },
      apiPort: {
        type: Function,
        default: function() {},
      },
    },

    data() {
      return {
        areaType: 'geography',

        // 级联数据
        selectedDataArray: [],

        // 发展划分的城市数据
        progressObj: {
          level: [],
          city: [
            {
              label: '北京',
              value: '123',
            },
            {
              label: '上海',
              value: '124',
            },
            {
              label: '上海',
              value: '125',
            },
            {
              label: '广州',
              value: '126',
            },
            {
              label: '深圳',
              value: '127',
            },
          ],
        },

        // 是否有城市这一级联选择
        isShowCity: false,

        // 用户已选择级联值
        selectedData: [
          {
            label: '北京',
            value: 123,
          },
          {
            label: '上海',
            value: 124,
          },
          {
            label: '深圳',
            value: 125,
          },
          {
            label: '广州',
            value: 126,
          },
          {
            label: '杭州',
            value: 127,
          },
          {
            label: '新疆',
            value: 128,
          },
          {
            label: '黑龙江',
            value: 127,
          },
          {
            label: '重庆',
            value: 127,
          },
          {
            label: '海南',
            value: 127,
          },
        ],
      }
    },

    watch: {
      areaType() {
        this.clearData()
      },
    },

    methods: {
      // 清空数据
      clearData() {
        this.selectedData = []
      },
    },
  }
</script>

<style lang="less" scoped>
  .cascade {
    &-header {
      margin: 15px 0 10px;
    }
    &-header_type {
      padding: 6px 0;
      margin: 0 10px 0 0;
      cursor: pointer;
      color: #666;
      text-align: center;
      display: inline-block;
    }
    &-header_type:last-child {
      margin: 0;
    }
    &-header_type:hover {
      color: #333;
    }
    &-header_active {
      color: #333;
      font-weight: 700;
      border-bottom: 2px solid #338aff;
    }
    &-area_content {
      width: auto;
      height: calc(100vh - 660px);
      display: flex;
      overflow: hidden;
    }
    &-area_style {
      height: 100%;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      display: inline-block;
    }
    &-area_left {
      width: calc(100vh - 540px);
      margin-right: 24px;
      display: flex;
    }
    &-left_city {
      border-left: 1px solid #e0e0e0;
    }
    &-left_content {
      display: inline-block;
      flex: 1;
    }
    &-area_header {
      background-color: #fafafa;
      border-bottom: 1px solid #e0e0e0;
      color: #333;
      font-size: 14px;
      line-height: 22px;
      padding: 8px 12px;
    }
    &-area_data {
      height: calc(100% - 40px);
      overflow-x: hidden;
      overflow-y: auto;
      padding: 6px 0;
      position: relative;
      overflow-y: auto;
    }
    &-area_item {
      padding: 6px 12px;
      position: relative;
      cursor: pointer;
    }
    &-area_item:hover {
      background-color: #f0f0f0;
    }
    &-area_right {
      width: calc(100vh - 760px);
    }
  }
</style>
