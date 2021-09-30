<!--
 * @Author: huangjianhan
 * @Date: 2021-03-22 10:42:21
 * @LastEditTime: 2021-04-21 14:38:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads.fandow.com\pages\statement\production-statment\production-statment-header.vue
-->
<template>
  <div class="header">
    <!-- 头部筛选区域 -->
    <div class="filter">
      <span class="title">人员报表</span>
      <div class="filter-wrap">
        <a-range-picker
          v-model="filterDateRange"
          value-format="YYYY-MM-DD"
          :ranges="range"
          :disabled-date="(current) => current && current > this.moment().endOf('day')"
          format="YYYY-MM-DD"
          separator="至"
          class="filter-wrap-item"
          style="width: 230px"
        >
          <a-icon slot="suffixIcon" type="calendar" />
        </a-range-picker>
      </div>
    </div>
    <a-divider style="margin:0" />
    <div class="filter">
      <a-form-model :model="filterForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
        <a-form-model-item
          :colon="false"
          label="选择人员"
          style="margin: 0;margin-left: 5px; width: 240px;"
        >
          <a-select
            v-model.trim="filterForm.usernameList"
            mode="multiple"
            label-in-value
            show-search
            allow-clear
            placeholder="请输入姓名/工号"
            option-label-prop="label"
            :filter-option="false"
            @search="fetchPrincipal"
            style="margin-left: 10px;min-width: 480px;"
          >
            <a-spin v-if="fetchingPrincipal" slot="notFoundContent" size="small" />
            <a-select-option
              v-for="item in fuzzyData"
              :key="item.realName"
              :value="item.username"
              :label="item.realName"
            >
              {{ item.username + '/' + item.realName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <div class="filter-search">
        <a-button type="primary" @click="$emit('dataChange', filterForm)">查询</a-button>
      </div>
    </div>
  </div>
</template>
<script>
  import { getDateRange, debounce } from '~/utils/utils'
  export default {
    data() {
      this.fetchPrincipal = debounce(this.fetchPrincipal, 500)
      return {
        filterDateRange: null,
        fetchingPrincipal: false,
        filterForm: {
          timeStart: null,
          timeEnd: null,
          usernameList: undefined,
        },
        fuzzyData: [],
      }
    },
    created() {
      this.range = getDateRange(this)
    },
    methods: {
      // 时间选择器
      changeDatePick(date) {
        if (date.length) {
          this.filterForm.timeStart = date[0]
          this.filterForm.timeEnd = date[1]
        } else {
          this.filterForm.timeStart = ''
          this.filterForm.timeEnd = ''
        }
        this.$emit('dataChange', this.filterForm)
      },
      // 获取负责人输入框值 进行负责人值查询
      fetchPrincipal(value) {
        this.fuzzyData = []
        this.fetchingPrincipal = true
        this.$API
          .getUsers({ name: value, perPage: 50 })
          .then(({ code, data }) => {
            if (code === 0) {
              this.fuzzyData.push(...data.list)
            }
          })
          .finally(() => {
            this.fetchingPrincipal = false
          })
      },
    },
  }
</script>
<style lang="less" scoped>
  .filter {
    min-height: 70px;
    padding: 6px 40px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    background-color: #fff;
    .title {
      font-size: 19px;
      font-weight: bold;
    }
    .filter-search {
      height: 100%;
      padding: 10px 0 10px 20px;
      border-left: 1px solid #d9d9d9;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      overflow: hidden;
    }
  }
</style>
