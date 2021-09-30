<!--
 * @Author: huangjianhan
 * @Date: 2021-01-13 15:19:02
 * @LastEditTime: 2021-05-28 17:11:06
 * @LastEditors: Please set LastEditors
 * @Description: 头条界面组件
 * @FilePath: \ads.fandow.com\pages\user-account\components\fisrtNews.vue
-->
<template>
  <div class="first">
    <a-row class="first-search">
      <a-col span="3">
        <a-form-item label="授权状态">
          <a-select
            placeholder="请选择授权状态"
            style="width: 90%"
            v-model="searchObj.authStatus"
            @change="initData('')"
          >
            <a-select-option :value="item.val" v-for="(item, key) in authorizationArray" :key="key">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col span="3">
        <a-form-item label="搜索">
          <a-input
            allow-clear
            style="width:90%"
            placeholder="账号ID"
            v-model="searchForm.advertiserId"
            @pressEnter="initData"
          />
        </a-form-item>
      </a-col>
      <a-col span="3">
        <a-form-item label="关联产品">
          <SelectProducts v-model.trim="searchForm.relatedProduct" />
        </a-form-item>
      </a-col>
      <a-col span="3">
        <a-form-item label="关联推广位">
          <SelectSites v-model.trim="searchForm.relatedPromoter" />
        </a-form-item>
      </a-col>
      <a-col span="3">
        <a-form-item label="关联负责人">
          <SelectUsers v-model.trim="searchForm.relatedUser" />
        </a-form-item>
      </a-col>
      <a-col span="9">
        <div class="search-btn-wrapper">
          <a-button type="primary" @click="initData">搜索</a-button>
          <a-button style="margin-left:10px" @click="handleResetClick">重置</a-button>
        </div>
      </a-col>
    </a-row>
    <div class="first-table">
      <div class="first-header">
        <a-button type="primary" @click="addAdvertisingUrl">
          <a-icon type="plus" />
          添加广告投放账号
        </a-button>
        <a-dropdown>
          <a-menu slot="overlay" @click="(key) => handleOpenModalClick(key, selectedRowKeys)">
            <a-menu-item key="manualUpdate">手动更新</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
      <a-table
        :columns="firstColumns"
        :data-source="firstNewsData.list"
        :scroll="{ x: 1200, y: 480 }"
        size="small"
        :rowKey="(record) => record.key"
        :pagination="pagination"
        :row-selection="{ selectedRowKeys, onChange: handleSelectChange }"
        :loading="spinObj.loading"
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
        bordered
        @change="changePage"
      >
        <template slot="manualSyncStatus" slot-scope="text, record, index">
          <a type="link" @click="handleOpenModalClick('single', record)">手动更新</a>
          <a-icon
            :type="syncIcon[text].type"
            theme="filled"
            :style="{ color: syncIcon[text].color }"
          />
          <a-popover placement="topLeft" trigger="click">
            <template slot="content" style="position: relative">
              <div class="sync-record" v-if="record.syncData.length">
                <p v-for="(list, index) in record.syncData" :key="index">
                  {{ list.type === 'MANUAL' ? '手动' : '自动' }} {{ list.timeStart }} -
                  {{ list.timeEnd }}
                </p>
              </div>
              <a-empty v-else />
              <Loading :loading="syncSettingLoading" />
            </template>
            <template slot="title">
              <span>数据同步记录</span>
            </template>
            <a-icon type="file-sync" class="icon-hover-doc" @click="getSyncData(record, index)" />
          </a-popover>
        </template>

        <template slot="authStatu" slot-scope="authStatus">
          <span>{{ authStatus | changeAuthStatus }}</span>
        </template>

        <template slot="sourceType" slot-scope="sourceType">
          <span>{{ sourceType | changeSourceType }}</span>
        </template>
        <template slot="operate" slot-scope="text, record">
          <a @click="handleSettingClick(record)">设置</a>
        </template>
      </a-table>
    </div>

    <!-- 表格操作字段 -> 设置弹窗 -->
    <AdvertifySetting ref="advertifySetting" />

    <!-- 数据同步设置时间 -->
    <SyncSettingTime ref="syncSettingTime" @onSave="handleSave" />
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import AdvertifySetting from './advertify-setting'
  import SyncSettingTime from './sync-setting-time'

  // 理论常量应该这样定义以及放到一个文件专门管理
  const SYNC_FAILURE = 0
  const SYNC_SUCCESS = 1
  const SYNC_WAITTING = 2

  export default {
    components: {
      AdvertifySetting,
      SyncSettingTime,
    },

    data() {
      return {
        searchForm: {},
        spinObj: { loading: false },
        authorizationArray: [
          { label: '已授权', val: 'ENABLE' },
          { label: '未授权', val: 'DISABLE' },
        ],
        pagination: {
          size: 'small',
          current: 1,
          total: 0,
          showSizeChanger: true,
          showQuickJumper: true,
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `共 ${total} 条`,
        },
        attachProduct: [],
        projectArray: [],
        deptArray: [],
        sourceArray: [{ label: '广告主', val: 'ADVERTISER' }],
        firstColumns: [
          {
            title: '数据同步',
            dataIndex: 'manualSyncStatus',
            width: 120,
            key: 'manualSyncStatus',
            scopedSlots: { customRender: 'manualSyncStatus' },
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '账号ID',
            dataIndex: 'advertiserId',
            key: 'advertiserId',
            width: 120,
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '广告投放账号',
            dataIndex: 'advertiserName',
            key: 'advertiserName',
            ellipsis: true,
            tooltip: true,
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '授权时间',
            dataIndex: 'authDateTime',
            key: 'authDateTime',
            width: 150,
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '授权状态',
            dataIndex: 'authStatus',
            key: 'authStatus',
            width: 80,
            scopedSlots: { customRender: 'authStatu' },
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '当前负责人',
            dataIndex: 'relatedUsername',
            key: 'relatedUsername',
            width: 100,
            customRender: (text) => (text ? text : '--'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '当前推广位',
            dataIndex: 'relatedPromoterName',
            key: 'relatedPromoterName',
            width: 160,
            customRender: (text) => (text ? text : '--'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '当前产品',
            dataIndex: 'relatedProductName',
            key: 'relatedProductName',
            ellipsis: true,
            tooltip: true,
            customRender: (text) => (text ? text : '--'),
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            width: 80,
            scopedSlots: { customRender: 'operate' },
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
        ],
        firstNewsData: { list: [] },
        searchObj: {
          authStatus: 'ENABLE',
          sourceType: 'ADVERTISER',
          keyword: '',
        },
        selectedRowKeys: [],
        reflush: true, // 表格同步更新

        // 数据同步字段状态 icon
        syncIcon: {
          [SYNC_FAILURE]: { type: 'close-circle', color: '#ff5500' }, // 手动更新失败
          [SYNC_SUCCESS]: { type: 'check-circle', color: '#52c41a' }, // 手动更新成功
          [SYNC_WAITTING]: { type: 'clock-circle', color: '#c5c5c5' }, // 手动更新等待
        },

        syncSettingLoading: false,
      }
    },

    filters: {
      statuMap(params) {
        // 同步状态映射处理
        let mapVal = {
          ENABLE: true,
          DISABLE: false,
        }
        return mapVal[params]
      },
      changeAuthStatus(params) {
        let changeVal = {
          ENABLE: '已授权',
          DISABLE: '未授权',
        }
        return changeVal[params]
      },
      changeSourceType(params) {
        console.log(params)
        let changeVal = {
          ADVERTISER: '广告主',
        }
        return changeVal[params]
      },
    },

    mounted() {
      this.initData()
    },

    methods: {
      initData(params) {
        // platform参数当前定死
        let pageIndex = params ? params.current : 1
        let pageSize = params ? params.pageSize : 10
        let requestData = {
          platform: '头条',
          authStatus: this.searchObj.authStatus,
          pageIndex: pageIndex,
          pageSize: pageSize,
          ...this.searchForm,
        }
        this.spinObj.loading = true
        this.$API
          .getAdAccountList(requestData)
          .then(({ code, data }) => {
            if (code === 0) {
              this.firstNewsData = data
              this.pagination.total = data.count
              this.pagination.current = data.page
              this.firstNewsData.list = this.firstNewsData.list.map((item) => ({
                ...item,
                syncData: [],
                key: item.advertiserId,
              }))
            }
          })
          .finally(() => {
            this.spinObj.loading = false
          })
      },

      // 重置按钮
      handleResetClick() {
        this.searchObj.authStatus = 'ENABLE'
        this.searchForm = {}
        this.initData()
      },

      handleOpenModalClick(type, data) {
        if (type.key === 'manualUpdate' && !this.selectedRowKeys.length)
          return this.$message.warning('至少选择一条信息！')
        this.$refs.syncSettingTime.openModal(data)
      },

      handleSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },

      handleSettingClick({ advertiserId }) {
        this.$refs.advertifySetting.openDrawer(advertiserId)
      },

      // 手动更新的回调
      handleSave() {
        this.selectedRowKeys = []
        this.initData(this.pagination)
      },

      // 获取数据同步记录
      getSyncData(record, idx) {
        this.syncSettingLoading = true
        this.$API.getAccountSyncStatus(record.advertiserId).then(({ code, data }) => {
          this.syncSettingLoading = false
          if (code === 0) {
            this.firstNewsData.list[idx].syncData = data
          }
        })
      },

      selectData() {},

      changePage(pageObj, params) {
        this.initData(pageObj)
      },

      addUserval(params, index) {
        // 开启账户别名编辑输入框
        this.$set(this.firstNewsData.list[index], 'isShowOtherInput', true)
        this.reflush = !this.reflush
      },
      saveCurrent(params, index, keydownType) {
        // 关闭账户别名编辑输入框
        params.isShowOtherInput = false
        this.reflush = !this.reflush
        if (keydownType === 'keydown') return false
        this.saveOtherVal(params)
      },
      saveOtherVal(params) {
        if (!params.aliasName) return false
        // 请求账户别名编辑接口
        let requestObj = {
          aliasName: params.aliasName,
          advertiserId: params.advertiserId,
        }
        this.$API.putAdAccountAlias(requestObj).then((res) => {
          if (res.code === 0) {
            this.$message.success('设置成功!')
            return
          }
          this.$message.error(res.msg)
        })
      },

      syncStatuChange(params) {
        this.$API.advertiserSync({ advertiserId: params.advertiserId }).then((res) => {
          if (res.code === 0) {
            this.$message.success('状态更新成功!')
            return
          }
          this.$message.error(res.msg)
        })
      },
      addAdvertisingUrl() {
        let userName = Cookies.get('username')
        this.$API.oauthUrl(userName).then((res) => {
          if (res.code === 0) {
            window.open(res.data)
          }
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .search-btn-wrapper {
    display: flex;
    align-items: center;
    padding-top: 43px;
    padding-left: 10px;
  }

  .first {
    &-search,
    &-table {
      padding: 10px 16px;
      box-sizing: border-box;
      background-color: #fff;
    }
    &-edit_style {
      font-size: 15px;
      color: rgb(45, 140, 240);
      cursor: pointer;
    }
    &-header {
      margin: 0 0 20px;
    }
    &-table {
      margin: 16px 0 0;
    }
    .icon-hover {
      cursor: pointer;
    }
    .icon-hover-doc {
      cursor: pointer;
      :hover {
        background-color: #00a1f9;
        color: #fff;
      }
    }
  }

  .sync-record {
    min-width: 240px;
    max-height: 220px;
    overflow: auto;
  }

  /deep/ .ant-table-thead {
    background-color: #f5f7fa !important;
  }

  /deep/ .table-row__striped {
    background-color: #fafafa;
  }
</style>

<style lang="less">
  .first {
    .ant-form-item-label > label::after {
      content: '';
    }
  }
</style>
