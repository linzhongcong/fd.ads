<!--
 * @Author: lizheng
 * @Date: 2021-01-13 11:51:06
 * @LastEditTime: 2021-07-22 17:46:39
 * @LastEditors: Please set LastEditors
 * @Description: Tab栏 - 创意
 * @FilePath: \ads\pages\promotion\component\promotion-tabs-idea.vue
-->
<template>
  <div class="idea">
    <div class="idea-header">
      <div class="idea-header_left">
        <a-button type="primary" icon="plus">新建创意</a-button>
      </div>
      <div>
        <a-popover :visible="customColumnVisible" trigger="click" placement="bottomRight">
          <div slot="title" class="custom-column-header">
            <span class="text">常用自定义列</span>
            <a-button type="link" @click="handleOpenModal('modal')">自定义</a-button>
          </div>
          <div slot="content">
            <a-button type="link">000</a-button>
          </div>
          <a-button class="promotion-custom_button" icon="unordered-list" @click="handleOpenModal">
            自定义列
          </a-button>
        </a-popover>
      </div>
    </div>
    <div class="idea-content_table">
      <a-table
        bordered
        :columns="ideaColumns"
        :data-source="ideaData"
        :pagination="pagination"
        :loading="spinObj.dataSpin"
        :components="components"
        :scroll="{ x: 1200, y: 515 }"
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
        @change="changePage"
      >
        <template slot="optStatus" slot-scope="text, record, index">
          <a-switch size="small" disabled :defaultChecked="text === 'CREATIVE_STATUS_ENABLE'" />
          <!-- @change="(checked) => changeStatuTip(checked, record)" -->
        </template>
        <template slot="advertisingTitle" slot-scope="text, record, index">
          <div class="video-table-cell">
            <a-popover trigger="hover" placement="rightTop">
              <template slot="content">
                <div class="surface-content">
                  <a-icon class="play-icon" type="play-circle" @click="skipVideoLink(record)" />
                  <img
                    class="surface-content_image"
                    src="../../../assets/images/background.jpg"
                    @click="skipVideoLink(record)"
                    alt=""
                  />
                </div>
              </template>
              <div class="video-table-cell__left">
                <a-icon
                  class="play-icon play-icon_first"
                  type="play-circle"
                  @click="skipVideoLink(record)"
                />
                <img
                  class="video-surface_image"
                  src="../../../assets/images/background.jpg"
                  @click="skipVideoLink(record)"
                  alt=""
                />
              </div>
            </a-popover>
            <div class="video-table-cell__right">{{ text }}</div>
          </div>
        </template>
        <template slot="advertisingStatu" slot-scope="text, record, index">
          <div>
            <span
              :class="[
                'cell-status-label',
                text !== 'CREATIVE_STATUS_DONE' ? 'cell-status-label-active' : '',
              ]"
            />
            <span v-text="advertisingStatu[text]"></span>
          </div>
        </template>
        <template slot="campaignNameTitle" slot-scope="text, record, index">
          <span class="skip-letter" @click="changeToPlanTab('ad', record)">{{ text }}</span>
        </template>
        <template slot="adNameSlot" slot-scope="text, record, index">
          <span class="skip-letter" @click="changeToPlanTab('plan', record)">{{ text }}</span>
        </template>
        <template slot="downloadUrlSlot" slot-scope="text, record, index">
          <a :href="text" v-if="text">
            {{ text }}
          </a>
          <span v-else>--</span>
        </template>
      </a-table>
    </div>
    <!-- 自定义列 -->
    <custom-column-modal ref="customColumn" :data="columnsData" />
  </div>
</template>
<script>
  import Vue from 'vue'
  import { resizeableTitle } from '~/utils/utils'
  import { mapState } from 'vuex'
  import { ideaColumns, advertisingStatu } from '../contant'
  import CustomColumnModal from '~/components/custom-column-modal'

  export default {
    components: {
      CustomColumnModal,
    },

    props: {
      tabKey: {
        type: String,
        default: 'idea',
      },
    },

    data() {
      this.components = {
        header: {
          cell: (h, props, children) => resizeableTitle(h, props, children, ideaColumns, Vue),
        },
      }
      return {
        visible: false,
        spinObj: {
          dataSpin: false,
        },
        columnsData: [], // 自定义列弹窗
        visibleAdvertising: false,
        customColumnVisible: false, // 自定义列 popover
        ideaColumns,
        advertisingStatu,
        ideaData: [],
        assetImageArray: [],
        total: 0, // 列表总数
        pagination: {
          // 分页数据
          size: 'small',
          total: 0,
          current: 1,
          showSizeChanger: true,
          showQuickJumper: true,
          defaultPageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `共 ${total} 条`,
        },
      }
    },

    // mounted() {
    //   this.initData()
    // },

    computed: {
      ...mapState(['promotion']),

      // 广告投放账号ID
      advertiserId() {
        return this.$store.getters['promotion/advertiserId']
      },
    },

    watch: {
      // 监听广告投放账号ID发生变化则请求表格数据
      // index.vue => promotion-tabs.vue =>  promotion-tabs-idea.vue
      advertiserId: {
        handler(nVal) {
          nVal && this.tabKey === 'idea' && this.initData()
        },
      },

      // 监听全局的条件筛选表单则请求表格数据
      // index.vue => store(promotion) =>  promotion-tabs-ad.vue
      'promotion.filterForm': {
        deep: true,
        handler(newForm) {
          newForm && this.tabKey === 'idea' && this.initData('init', newForm)
        },
      },

      // 监听Tab切换
      tabKey: {
        immediate: true,
        handler(nVal) {
          nVal && nVal === 'idea' && this.initData()
          console.info('tabs-Idea', nVal)
        },
      },
    },

    methods: {
      handleOpenModal(type) {
        type === 'modal' && this.$refs.customColumn.openModal({ visible: true })
        this.customColumnVisible = !this.customColumnVisible
      },
      resetColumnWidth() {
        // 重置表格宽度
        console.log('重置表格列表宽度')
      },

      // 开启或关闭创意状态
      changeStatuTip(checked, params) {
        this.$API
          .putPromotionAdIdeaItem({
            advertiserId: this.advertiserId,
            creativeId: params.creativeId,
            optStatus: checked ? 'enable' : 'disable',
          })
          .then(({ code }) => {
            if (code === 0) this.$message.success('创意状态更新成功！')
            this.initData()
          })
      },
      changeAdvertising() {},
      cancelAdvertising() {},

      // 改变分页器的参数
      changePage(page) {
        this.pagination.current = page.current
        this.pagination.pageSize = page.pageSize
        this.ideaData = []
        this.initData()
      },

      // 图片初始请求
      imageRequest() {
        if (this.assetImageArray[this.pagination.current]) return
        let staticArray = []
        staticArray.push(this.recursionImageRequest(0))
        this.assetImageArray[this.pagination.current] = staticArray
      },
      // 图片递归请求
      recursionImageRequest(params) {
        this.$API
          .getDocumentMaterialItem({
            advertiserId: this.ideaData[params].advertiserId,
            imageId: this.ideaData[params].imageId,
          })
          .then((res) => {
            if (res.code === 0) {
              return data
            }
          })
          .finally(() => {
            if (params < this.pagination.defaultPageSize - 1) {
              this.recursionImageRequest(++params)
            }
          })
      },
      // 视频id请求
      skipVideoLink(params) {
        let requestParams = {
          advertiserId: params.advertiserId,
          videoId: params.videoId,
        }
        this.$API
          .getDocumentOceanVideo(requestParams)
          .then((res) => {
            if (res.code === 0) {
              window.open(res.url)
              return
            }
          })
          .finally(() => {})
      },

      // 切换tab栏
      changeToPlanTab(type, record) {
        // this.$emit('change-tab', type, record)
      },

      initData(type, filterForm = this.promotion.filterForm) {
        let currentPage = this.pagination.current
        let pageSize = this.pagination.pageSize
        let requestParams = {
          advertiserId: this.advertiserId,
          pageIndex: currentPage,
          pageSize: pageSize,
          ...filterForm,
        }
        const startDateTimeStamp = new Date(requestParams.startDate).getTime()
        const endDateTimeStamp = new Date(requestParams.endDate).getTime()

        if (endDateTimeStamp - startDateTimeStamp > 30 * 24 * 60 * 60 * 1000)
          return this.$message.error('查询数据的时间跨度不得超过30天！')
        this.spinObj.dataSpin = true
        this.$API
          .putPromotionCreative(requestParams)
          .then((res) => {
            if (res.code === 0) {
              let data = res.data
              this.ideaData = data.list.map(({ creativeId, ...item }) => ({
                key: creativeId,
                creativeId,
                ...item,
              }))
              this.pagination.total = Number(res.data.count)
              // this.imageRequest()
            }
          })
          .finally(() => {
            this.spinObj.dataSpin = false
          })
      },

      filtersDataChange(params) {
        console.log(params, 'opop')
        let changeObj = {
          enable: true,
          disable: false,
        }
        return changeObj[params]
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '../promotion.less';
  @import '~/assets/css/common.less';

  .idea {
    &-header {
      height: 50px;
      background: #fff;
      display: flex;
      justify-content: space-between;
    }
    &-header_left {
      display: inline-block;
    }
    &-custom_button {
      min-width: 80px;
      padding: 4px 16px;
      font-size: 12px;
      line-height: 20px;
      border-radius: 4px;
    }
    &-custom_button:last-child {
      margin: 0 0 0 16px;
    }

    .video-table-cell {
      display: flex;
      align-items: center;
      &__left {
        height: 45px;
        width: 80px;
        overflow: hidden;
        border-radius: 4px;
      }

      &__right {
        width: 270px;
        height: 40px;
        line-height: 20px;
        margin-left: 10px;
        display: -webkit-box;
        overflow: hidden;
        line-clamp: 2;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  }
</style>
<style lang="less">
  .idea {
    .ant-table-body {
      max-height: calc(100vh - 462px);
      overflow-x: hidden;
      overflow-y: auto;
    }
    .ant-table-row {
      td {
        position: relative;
      }
    }
    .video-table-cell__left {
      text-align: center;
      background-color: #000;
      cursor: pointer;
      position: relative;
      .video-surface_image {
        width: auto;
        height: 100%;
      }
    }
    .skip-letter {
      color: #2f88ff;
      cursor: pointer;
    }
  }
  .surface-content {
    width: 256px;
    height: 430px;
    display: inline-block;
    &_image {
      width: auto;
      height: 100%;
      cursor: pointer;
      display: inline-block;
    }
  }
  .play-icon {
    position: absolute;
    top: 50%;
    left: 45%;
    font-size: 24px;
    color: #fff;
  }
  .play-icon_first {
    font-size: 18px;
    left: 40%;
    top: 35%;
  }
</style>
