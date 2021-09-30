<!--
 * @Author: huangjianhan
 * @Date: 2021-03-24 13:26:06
 * @LastEditTime: 2021-03-27 14:12:12
 * @LastEditors: Please set LastEditors
 * @Description: 人员报表 - 详情 - 概览界面
 * @FilePath: \ads.fandow.com\pages\statement\person-statement\component\detail-overview.vue
-->
<template>
  <div class="overview">
    <!-- 内容头部 -> 基本信息 && 关注指标 -->
    <div class="overview-header">
      <div class="overview-header_left">
        <div class="header-basic_message">基本信息</div>
        <a-divider style="margin:0" />
        <div class="header-left_title">
          <div class="head-content">
            <img class="head-portrait" src="@/assets/images/background.jpg" alt="" />
          </div>
          <div class="header-detail">
            <div class="header-detail_line">
              <span class="detail-line_field">部门</span> <span class="detail-line_value">-</span>
            </div>
            <div class="header-detail_line">
              <span class="detail-line_field">岗位</span> <span class="detail-line_value">{{ detailData.deptJobName ? detailData.deptJobName : '-' }}</span>
            </div>
            <div class="header-detail_line">
              <span class="detail-line_field">产品数</span> <span class="detail-line_value">{{ detailData.productCount }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="overview-header_right">
        <div class="header-basic_message">关注指标</div>
        <a-divider style="margin:0" />
        <div class="header-right_title">
          <div class="right-title_element">
            <div>
              巨量-消耗
              <a-icon type="exclamation-circle" style="color: #cfcfcf;" />
            </div>
            <div class="title-element_value">{{ detailData.cost }}</div>
          </div>
          <div class="right-title_element">
            <div>
              成交-淘客
              <a-icon type="exclamation-circle" style="color: #cfcfcf;" />
            </div>
            <div class="title-element_value">{{ detailData.totalDeal }}</div>
          </div>
          <div class="right-title_element">
            <div>
              大投计划数
              <a-icon type="exclamation-circle" style="color: #cfcfcf;" />
            </div>
            <div class="title-element_value">{{ detailData.bigPutAdCount }}</div>
          </div>
          <div class="right-title_element">
            <div>
              大投计划率
              <a-icon type="exclamation-circle" style="color: #cfcfcf;" />
            </div>
            <div class="title-element_value">{{ detailData.bigPutRete }}</div>
          </div>
          <div class="right-title_element">
            <div>
              大投成本
              <a-icon type="exclamation-circle" style="color: #cfcfcf;" />
            </div>
            <div class="title-element_value">{{ detailData.bigPutDeal }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 主体内容 -->
    <div class="overview-content">
      <div class="header-basic_message">负责产品</div>
      <a-divider style="margin:0" />
      <div class="overview-content_product" :class="spinning ? 'not-allow_scroll' : ''">
        <a-spin class="overview-content_spin" v-if="spinning" />
        <div
          v-for="(item, key) in productArray"
          :key="'product' + key"
          class="overview-content_element"
        >
        <!-- none-image_style 无图片时 -->
          <div class="content-element">
            <img class="content-element_img" :src="rangeImage()" alt="" />
          </div>
          <div class="content-element_right">
            <div class="element-right_line">
              <span class="product-line_field">商品标题</span>
              <span class="product-line_value">{{ item.productName }}</span>
            </div>
            <div class="element-right_line">
              <span class="product-line_field">推广周期</span>
              <div class="product-line_value">
                <div
                  v-for="(element, key) in item.landingCycleList"
                  :key="'date' + key"
                >
                  {{ element.startTime }} - {{ element.endTime }}
                </div>
              </div>
            </div>
            <div class="element-right_line">
              <span class="product-line_field">详情数据</span>
              <a
                href="javascript: void(0);"
                class="product-line_value"
                @click="browseDetail('2', item.productId)"
              >查看详情</a>
            </div>
            <div class="element-right_statu">
              <a-badge :status="statuArray[item.status]" />
              {{ statuLetter[item.status] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import firstStaticImg from '@/assets/images/goods.png'
import seconedStaticImg from '@/assets/images/secondGoods.jpg'
import thirdStaticImg from '@/assets/images/thirdGoods.jpg'
import fourStaticImg from '@/assets/images/fourthGoods.png'
export default {
  props: {
    detailData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      // 当前状态值颜色映射
      statuArray: {
        'ENABLE': 'success',
        'DISABLE': 'warning',
        '2': 'error',
        '3': 'default',
      },
      statuLetter: {
        'ENABLE': '当前负责中',
        'DISABLE': '历史负责',
        '2': 'error',
        '3': 'default',
      },
      // loading状态值
      spinning: false,
      // 商品列表数据
      productArray: [],
      // 静态图片
      firstStaticImg,
      seconedStaticImg,
      thirdStaticImg,
      fourStaticImg,
    }
  },
  watch: {
    detailData: {
      handler: function(newVal) {
        this.getList()
      },
      deep: true,
      immediate: true,
    }
  },
  mounted() {},
  methods: {
    // 查看详情
    browseDetail(...params) {
      this.$emit('changeTabs', params);
    },
    // 请求详情数据
    getList() {
      this.spinning = true
      let params = {
        pageIndex: this.detailData.pageIndex,
        pageSize: this.detailData.pageSize,
        username: this.detailData.username,
        timeStart: this.detailData.timeStart,
        timeEnd: this.detailData.timeEnd,
      }
      this.$API
        .reportPersonDetail(params)
        .then(({code, data, message}) => {
          if(code === 0) {
            this.productArray = data.list
            return
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    // 随机指定图片
    rangeImage() {
      let imgArray = [
        this.firstStaticImg,
        this.seconedStaticImg,
        this.thirdStaticImg,
        this.fourStaticImg,
      ]
      let rangeNumber = Math.floor(Math.random() * 4)
      return imgArray[rangeNumber]
    }
  }
}
</script>
<style lang="less" scoped>
  .overview {
    width: 100%;
    height: calc(100vh - 66px);
    padding: 10px;
    box-sizing: border-box;
    display: inline-block;
    &-header {
      width: 100%;
      height: 224px;
      margin: 0 0 10px;
      display: flex;
    }
    &-header_left,
    &-header_right {
      border-radius: 4px;
      background-color: #fff;
      overflow: hidden;
    }
    &-header_left {
      flex: 0.4;
      margin-right: 10px;
    }
    &-header_right {
      flex: 0.6;
    }
    &-content_product {
      position: relative;
    }
    &-content_spin {
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(255, 255, 255, 0.7);
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .not-allow_scroll {
      overflow: hidden;
    }
  }
  .header-basic_message {
    padding: 10px;
  }
  .head-content {
    width: 36px;
    height: 36px;
    margin: 0 20px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* 基本信息 - 用户头像 */
  .head-portrait {
    width: 100%;
    height: auto;
    display: inline-block;
    border: none;
  }
  .header-detail {
    flex: 1;
    line-height: 1;
    &_line {
      margin-bottom: 20px;
    }
    &_line:last-child {
      margin-bottom: 0;
    }
    .detail-line_field {
      color: #9c9c9c;
    }
    .detail-line_value {
      margin-left: 6px;
      color: #000;
      font-weight: 500;
    }
  }
  .header-left_title,
  .header-right_title {
    height: 50%;
    display: flex;
    align-items: flex-start;
    padding: 16px 0 0;
    .title-element_value {
      margin-top: 7px;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .header-right_title {
    height: 70%;
    flex-wrap: wrap;
  }
  .right-title_element {
    width: 33%;
    margin-bottom: 6%;
    padding-left: 6%;
  }
  /* 头部样式ending */
  .overview-content {
    height: calc(100vh - 292px);
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
    &_product {
      max-height: calc(100vh - 345px);
      padding: 10px;
      overflow-y: auto;
    }
    &_element {
      width: 100%;
      height: auto;
      padding: 14px 0;
      border-bottom: 1px solid #f6f6f6;
      display: flex;
    }
    .content-element {
      width: 20%;
      height: 20%;
      margin-right: 10px;
      border-radius: 4px;
      border: 1px solid #eee;
      display: inline-block;
      background-color: #f6f6f6;
      .content-element_img {
        width: 100%;
        height: auto;
      }
    }
    .none-image_style {
      padding: 45px;
    }
    .content-element_right {
      width: 80%;
      color: #000;
      display: inline-block;
    }
    .element-right_line {
      display: flex;
      margin-bottom: 10px;
      .product-line_field {
        margin-right: 10px;
        display: inline-block;
      }
      .product-line_value {
        width: 83%;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
      }
    }
    .element-right_statu {
      text-align: right;
    }
  }
</style>
 