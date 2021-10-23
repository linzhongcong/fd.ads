<!--
 * @Author: your name
 * @Date: 2021-10-15 10:54:27
 * @LastEditTime: 2021-10-15 16:24:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads.fandow.com\pages\statement\component\d-card.vue
-->
<template>
  <div class="dCard">
    <div class="head">
      <div class="head-l">
        {{ title }} &nbsp;
        <a-tooltip max-width="500" placement="right" transfer v-show="hint">
          <div slot="content" v-html="hint"></div>
          <!-- <Icon type="ios-help-circle" size="20" color="#999999" /> -->
        </a-tooltip>
      </div>
      <div class="head-r">
        <a href="JavaScript:;" @click="onUPDown">
          {{ upDownText.text }}
          <!--  <Icon :type="upDownText.icon" /> -->
        </a>
        <!-- <Icon type="ios-arrow-up" /> -->
      </div>
    </div>
    <div class="content" :style="{ 'max-height': contentHeight, opacity: upDownText.opacity }">
      <slot></slot>
      <a-spin size="large" fix v-if="loading"></a-spin>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'dCard',
    props: {
      title: {
        type: String,
        default: '',
      },
      hint: {
        type: String,
        default: '',
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        contentHeight: '2000px',
        upDownText: {
          text: '收起',
          icon: 'ios-arrow-up',
          opacity: 1,
        },
      }
    },
    methods: {
      onUPDown() {
        if (this.contentHeight === '1500px') {
          this.contentHeight = 0
          this.upDownText = {
            text: '展开',
            icon: 'ios-arrow-down',
            opacity: 0,
          }
        } else {
          this.contentHeight = '1500px'
          this.upDownText = {
            text: '收起',
            icon: 'ios-arrow-up',
            opacity: 1,
          }
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .dCard {
    margin: 15px;
    border-radius: 15px;
    background-color: #fff;
    border: solid 1px #ccc;
    .head {
      padding: 10px 20px;
      border-bottom: 1px solid #e4e4e4;
      overflow: hidden;
      .head-l {
        font-size: 16px;
        color: #000;
        float: left;
        height: 26px;
        padding-left: 5px;
        // border-left: solid 6px rgba(0, 153, 255, 1);
        display: flex;
        align-items: center;
        font-weight: bold;
        position: relative;
      }
      .head-r {
        float: right;
      }
    }
    .content {
      padding: 10px 20px;
      overflow: hidden;
      transition: all 0.5s;
      position: relative;
    }
  }
</style>
