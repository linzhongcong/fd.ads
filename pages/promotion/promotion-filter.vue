<!--
 * @Author: lizheng
 * @Date: 2021-01-12 15:25:44
 * @LastEditTime: 2021-06-12 06:05:29
 * @LastEditors: Please set LastEditors
 * @Description: 条件筛选
 * @FilePath: \ads\pages\promotion\promotion-filter.vue
-->
<template>
  <div class="filter-panel">
    <div class="filter-panel-header">
      <div class="filter-item">
        <a-button class="filter-btn" icon="filter" @click="showDrawer">
          所有筛选
          <a-icon :class="['expand-icon', visible ? '' : 'packup']" type="up" />
        </a-button>

        <a-input-group compact class="filter-group-item">
          <a-select :default-value="{ key: 'campaignId' }" v-model="filterType">
            <a-select-option
              v-for="item in filterTypeOptions"
              :value="item.value"
              :key="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <a-input-search
            allowClear
            placeholder="请输入ID搜索"
            enter-button
            v-model="searchValue"
            @search="handleFilterTypeClick"
          />
        </a-input-group>

        <!-- 已选的下拉框 -->
        <div v-if="isShowFilterTypeInput" class="filter-option filter-input">
          <a-input read-only :value="`${tipName}${searchFilterValue}`" allowClear />
          <a-icon
            type="close-circle"
            class="close-filter-icon"
            theme="filled"
            @click="closeFilterIcon"
          />
        </div>
        <div v-for="(item, index) in filterSelectors" :key="item.vModel">
          <a-select
            v-if="filterForm[item.vmodel] && filterForm[item.vmodel].length"
            allowClear
            placeholder="请选择"
            class="filter-option"
            v-model.trim="filterForm[item.vmodel]"
            :mode="item.mode"
            @change="changeChosenSelector"
          >
            <a-select-option :key="list.label" v-for="list in item.option" :value="list.value">
              {{ list.label }}
            </a-select-option>
          </a-select>
        </div>
        <a-button
          type="link"
          v-if="filterSelectors.length || isShowFilterTypeInput"
          @click="clearSelector"
        >
          清空
        </a-button>
      </div>

      <!-- 筛选模块-右侧 -->
      <div>
        <a-range-picker
          v-model="rangePickerDate"
          :disabled-date="disabledDate"
          :ranges="range"
          :allowClear="false"
          show-time
          format="YYYY.MM.DD"
          separator="至"
          style="margin-bottom:10px;width:230px"
        >
          <a-icon slot="suffixIcon" type="calendar" />
        </a-range-picker>
      </div>
    </div>

    <!-- 筛选条件下拉框模块 -->
    <div class="filter-drawer" ref="filterDrawer" v-show="visible">
      <a-drawer
        placement="top"
        wrapClassName="drawer"
        :height="330"
        :mask="false"
        :closable="false"
        :visible="visible"
        :get-container="() => $refs.filterDrawer"
        :wrap-style="{ position: 'absolute' }"
        @close="onClose"
      >
        <div ref="filterAnchor" class="filter-drawer-left">
          <a-anchor wrapperClass="filter-anchor" :getContainer="() => $refs.filterAnchor">
            <a-anchor-link href="#group-status" title="组" />
            <a-anchor-link href="#paln" title="计划" />
            <a-anchor-link href="#idea" title="创意" />
            <a-anchor-link href="#keyword" title="关键词" />
          </a-anchor>
          <!-- <a-icon type="up-circle" theme="filled" class="cursor-icon" @click="showDrawer" /> -->
          <div class="close-filter-btn">
            <a-button @click="showDrawer" style="width:80px">收起</a-button>
          </div>
        </div>

        <div class="filter-drawer-right">
          <a-form-model :model="form" labelAlign="left">
            <div
              :id="item.id"
              :key="item.id"
              v-for="item in filterOptions"
              style="margin-bottom:10px"
            >
              <p style="color:#999">{{ item.type }}</p>
              <div class="sub-filters-group-wrapper">
                <a-form-model-item
                  class="sub-filters"
                  :label="opList.label"
                  :key="opList.label"
                  v-for="(opList, opListId) in item.options"
                >
                  <a-select
                    v-model="filterForm[opList.vModel]"
                    :mode="opList.mode"
                    allowClear
                    placeholder="请选择"
                    style="min-width:190px"
                    @change="(value) => changeSelectorVal(value, opList.vModel, item.id, opListId)"
                  >
                    <a-select-option
                      :value="selectItem.value"
                      :key="selectItem.value"
                      v-for="selectItem in opList.option"
                    >
                      {{ selectItem.label }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </div>
            </div>
          </a-form-model>
        </div>
      </a-drawer>
    </div>
  </div>
</template>

<script>
  import { filterOptions } from './contant'
  import { getDateRange, unique } from '~/utils/utils'
  import { mapState } from 'vuex'
  import { EventBus } from './js/promotionBus'

  export default {
    data() {
      return {
        visible: false,

        // 顶部筛选参数以及表单绑定之
        isShowFilterTypeInput: false,
        rangePickerDate: [
          this.moment(new Date(), 'YYYY.MM.DD'),
          this.moment(new Date(), 'YYYY.MM.DD'),
        ],
        searchValue: '',
        searchFilterValue: '',
        tipName: '',
        filterType: 'campaignId',
        filterOptionsMapping: { campaignId: '广告组', adId: '计划', creativeId: '创意' },
        filterTypeOptions: [
          { label: '广告组', value: 'campaignId' },
          { label: '计划', value: 'adId' },
          { label: '创意', value: 'creativeId' },
        ],

        // 选择下拉框模块
        filterOptions,
        filterSearchSelectors: [], // 搜索下拉框的筛选值
        filterSelectors: [], // 要渲染的下拉框
        filterForm: {}, // 筛选下拉框绑定值
        selectedFilterForm: {},
        range: {}, // 下拉抽屉数据
        form: { layout: 'horizontal' }, // 下拉筛选框的绑定值
      }
    },

    created() {
      this.range = getDateRange(this)
    },

    mounted() {
      this.initData()
    },

    computed: {
      ...mapState(['promotion']),
    },

    watch: {
      // 日期发生改变重新调用接口
      rangePickerDate: {
        deep: true,
        immediate: true,
        handler(nDate) {
          const startDate = nDate && nDate[0].format('YYYY-MM-DD')
          const endDate = nDate && nDate[1].format('YYYY-MM-DD')
          this.$emit('search-data', 'filterDateSearch', { startDate, endDate })
        },
      },

      'promotion.filterForm': {
        deep: true,
        immediate: true,
        handler(nForm) {
          if (nForm.startDate && nForm.endDate) {
            this.rangePickerDate = [
              this.moment(nForm.startDate, 'YYYY.MM.DD'),
              this.moment(nForm.endDate, 'YYYY.MM.DD'),
            ]
          }
        },
      },
    },

    methods: {
      // 数据初始化
      initData() {
        EventBus.$on('searchPassObj', ({ id }) => {
          this.searchValue = id
          this.handleFilterTypeClick(id)
        })
      },

      onChange(dates, dateStrings) {
        console.log('From: ', dates[0], ', to: ', dates[1])
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
      },

      // 清楚已选择的搜索输入框
      closeFilterIcon() {
        this.isShowFilterTypeInput = false
        this.$emit('search-data', 'filterClearSearch', { [this.filterType]: '' })
      },

      // 点击搜索输入框进行搜索
      handleFilterTypeClick(value) {
        if (value === '') return
        this.searchValue = ''
        this.searchFilterValue = value
        this.tipName = `${this.filterOptionsMapping[this.filterType]}ID：`
        this.isShowFilterTypeInput = true
        this.$emit('search-data', 'filterItemSearch', { [this.filterType]: value })
      },

      // 下拉框筛选 - 改变值
      changeSelectorVal(value, vmodel, typeId, index) {
        const selectorList = this.filterOptions
          .map(({ id, options }) => (typeId === id ? { vmodel, ...options[index] } : null))
          .filter((item) => item)

        const isExitIndex = this.filterSelectors.findIndex((item) => item.vModel === vmodel)
        // 新增
        if (isExitIndex < 0) {
          this.filterSelectors.push(...selectorList)
          this.filterSelectors = unique(this.filterSelectors)
        } else {
          // 更新
          this.filterSelectors.splice(isExitIndex, 1, selectorList[0])
        }
        this.$emit('search-data', 'filterItemSearch', { [vmodel]: value })
      },

      // 外部已选择的下拉框的值改变同步给下拉抽屉的下拉框
      changeChosenSelector() {
        this.$emit('search-data', 'filterItemSearch', { ...this.filterForm })
      },

      // 清空已经选择的下拉框
      clearSelector() {
        this.filterSelectors = []
        this.visible = false
        this.isShowFilterTypeInput = false
        for (const key in this.filterForm) this.filterForm[key] = null
        this.$emit('search-data', 'filterClearSearch', {
          [this.filterType]: '',
          ...this.filterForm,
        })
      },

      afterVisibleChange(val) {
        console.log('visible', val)
      },

      showDrawer() {
        this.visible = !this.visible
      },

      onClose() {
        this.visible = false
      },

      // 未来日期不可选择
      disabledDate(current) {
        return current && current > this.moment().endOf('day')
      },
    },
  }
</script>

<style lang="less" scoped>
  .element-center {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .filter-input {
    position: relative;
    display: flex;
    align-items: center;
    .close-filter-icon {
      position: absolute;
      right: 10px;
      cursor: pointer;
      color: rgba(0, 0, 0, 0.25);
    }
  }

  .cursor-icon {
    cursor: pointer;
    font-size: 20px;
    &:hover {
      color: #1890ff;
    }
  }

  .expand-icon {
    margin-bottom: 2px;
    transform: rotate(0deg);
    transition: all 0.2s ease;
  }
  .packup {
    transform: rotate(180deg);
  }

  .filter-panel {
    position: relative;
    font-size: 12px;
    min-height: 50px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
    background: #fff;
    border-top: none;

    &-header {
      .element-center();
      padding: 16px;
      border-bottom: 1px solid #e4e9ed;
    }

    .filter-item {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      .filter-option {
        min-width: 180px;
        margin-right: 10px;
        margin-bottom: 10px;
      }
      .filter-btn {
        margin-right: 10px;
        margin-bottom: 10px;
      }
      .filter-group-item {
        margin-bottom: 10px;
        display: flex;
        width: 320px;
        margin-right: 10px;
      }
    }

    .filter-drawer {
      display: flex;
      position: relative;
      width: 100%;

      &-left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 152px;
        padding: 12px 0;
        padding-left: 12px;
        border-right: 1px solid #e8e8e8;
        overflow: hidden;
        background-color: #f8f9fa;

        .close-filter-btn {
          display: flex;
          justify-content: center;
        }

        /deep/ .filter-anchor {
          margin: 0;
          padding: 0;
          background-color: transparent;

          .ant-anchor-ink {
            display: none;
          }
        }
      }

      &-right {
        flex: 1;
        background-color: #fff;
        padding: 20px 32px;
        height: 330px;
        overflow: auto;
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }

    /deep/ .ant-drawer-content {
      overflow: hidden;
    }

    /deep/ .ant-drawer-wrapper-body {
      overflow: hidden;

      .ant-drawer-body {
        display: flex;
        flex-wrap: nowrap;
        padding: 0;
      }
    }
  }

  .sub-filters-group-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .sub-filters {
      display: flex;
      align-items: flex-start;
      margin-right: 32px;

      /deep/ .ant-form-item-label {
        width: 80px;
        font-size: 12px;
        font-weight: 400;
        display: inline-block;
        margin: 0 12px 0 0;
      }
    }
  }
</style>
