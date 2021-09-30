<!--
 * @Author: huangjianhan
 * @Date: 2021-01-11 17:23:27
 * @LastEditTime: 2021-03-09 10:56:36
 * @LastEditors: Please set LastEditors
 * @Description: 广告投放账号页面
 * @FilePath: \ads.fandow.com\pages\user-account\advertising-account\advertising-index.vue
-->
<template>
  <div class="advertising">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1">
        <span slot="tab">
          头条
        </span>
        <firstNews></firstNews>
      </a-tab-pane>
      <!-- <a-tab-pane key="2">
        <span slot="tab">
          广点通
        </span>
        <div class="none-content">
          <a-icon class="icon-style" type="reddit" />
          <span>服务升级中，尽情期待</span>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3">
        <span slot="tab">
          快手
        </span>
        <div class="none-content">
          <a-icon class="icon-style" type="reddit" />
          <span>服务升级中，尽情期待</span>
        </div>
      </a-tab-pane> -->
    </a-tabs>
  </div>
</template>

<script>
  import firstNews from '../components/first-news.vue'
  export default {
    components: {
      firstNews,
    },
    data() {
      return {
        total: 3, // 列表总数
        pagination: {
          // 分页数据
          size: 'small',
          total: 0,
          showSizeChanger: true,
          showQuickJumper: true,
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `共 ${total} 条`,
          change: (page) => this.changePage(page, pageSize),
        },
        alreadyChecked: [],
        advertisingColumns: [
          {
            title: '账号ID',
            dataIndex: 'userId',
            key: 'userId',
          },
          {
            title: '广告投放账号名称',
            dataIndex: 'advertisingName',
            key: 'advertisingName',
          },
          {
            title: '公司名称',
            dataIndex: 'company',
            key: 'company',
          },
        ],
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData() {},
      searchUser() {
        console.log('搜索')
      },
    },
  }
</script>

<style lang="less" scoped>
  .advertising-add {
    width: 100%;
    height: calc(100vh - 200px);
    box-sizing: border-box;
    background-color: #fff;
    &_header {
      width: 100%;
      height: 48px;
      padding: 10px;
      display: flex;
      align-items: center;
    }
    &_icon {
      width: 4px;
      height: 100%;
      margin: 0 10px 0 0;
      display: inline-block;
      background-color: #4e98f5;
    }
    &_letter {
      font-size: 17px;
      font-weight: bold;
    }
    &_dash {
      width: 98%;
      height: 1px;
      margin: 0 0 0 10px;
      box-sizing: border-box;
      display: inline-block;
      border: 1px dashed #4e98f5;
    }
  }
</style>
<style lang="less">
  .advertising {
    padding: 16px;
    background-color: #eef0f3;
    min-height: calc(100vh - 64px);
    width: calc(100vw - 160px);
    .ant-tabs-bar {
      margin: 0;
    }
    .icon-style {
      margin: 0 10px 0 0;
    }
    .ant-tabs-nav-wrap {
      .ant-tabs-tab {
        width: 130px;
        margin: 0 8px 0 0;
        font-size: 16px;
        font-weight: 400;
        border-radius: 4px 4px 0 0;
        box-shadow: 0 3px 6px 0 rgba(135, 140, 147, 0.1);
        cursor: pointer;
        text-align: center;
        background-color: #e9eaee;
      }
      .ant-tabs-tab-active {
        color: #3989fa;
        background-color: #fff;
      }
    }
    .ant-tabs-ink-bar-animated {
      bottom: none;
      top: 0;
      height: 3px;
      width: 130px;
      border-radius: 4px 4px 0 0;
      background-color: #3989fa;
    }
    .ant-tabs-tab,
    .ant-tabs-ink-bar-animated,
    .ant-tabs-content-animated {
      transition: none !important;
    }
    .none-content {
      width: 100%;
      min-height: 360px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 22px;
      font-weight: bold;
      color: #ccc;
      background-color: #fff;
    }
  }
</style>
