<!--
 * @Author: huangjianhan
 * @Date: 2021-03-24 13:26:06
 * @LastEditTime: 2021-03-31 17:01:41
 * @LastEditors: Please set LastEditors
 * @Description: 人员报表 - 详情 - 明细界面
 * @FilePath: \ads.fandow.com\pages\statement\person-statement\component\detail-particulars.vue
-->
<template>
  <div class="particulars">
    <!-- 内容头部 -> 基本信息 && 关注指标 -->
    <div class="particulars-header">
      <div class="particulars-header_left">
        <div class="header-line">产品</div>
        <a-divider style="margin:0" />
        <div class="header-left_title">
          <div class="left-title">
            <span>选择</span>
            <!-- mode="tags" 多选 -->
            <a-select
              v-model.trim="searchCondition"
              class="product-search"
              label-in-value
              show-search
              allow-clear
              :filter-option="false"
              option-label-prop="label"
              @search="searchGoods"
              @change="goodsDetail"
              placeholder="请选择商品ID/名称"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option
                v-for="item in goodsArray"
                :key="item.productId"
                :value="item.productId"
                :label="item.productName"
              >
                {{ item.product }}
              </a-select-option>
            </a-select>
          </div>
          <div class="left-title_search">
            <div
              v-for="item in selectedGoods"
              :key="item.productId"
              class="left-goods_content"
            >
              <img class="goods-image" src="@/assets/images/goods.png" alt="" />
              <div class="goods-letter">{{ item.productName }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="particulars-header_right">
        <div class="header-line">关注指标</div>
        <a-divider style="margin:0" />
        <div class="header-right_title">
          <div class="right-title_element">
            <div>
              巨量-消耗
              <a-icon type="exclamation-circle" style="color: #cfcfcf;" />
            </div>
            <div class="title-element_value">{{ particularsData.cost }}</div>
          </div>
          <div class="right-title_element">
            <div>
              成交-淘客
              <a-icon type="exclamation-circle" style="color: #cfcfcf;" />
            </div>
            <div class="title-element_value">{{ particularsData.totalDeal }}</div>
          </div>
          <div class="right-title_element">
            <div>
              大投计划数
              <a-icon type="exclamation-circle" style="color: #cfcfcf;" />
            </div>
            <div class="title-element_value">{{ particularsData.bigPutAdCount }}</div>
          </div>
          <div class="right-title_element">
            <div>
              大投计划率
              <a-icon type="exclamation-circle" style="color: #cfcfcf;" />
            </div>
            <div class="title-element_value">{{ particularsData.bigPutRete }}</div>
          </div>
          <div class="right-title_element">
            <div>
              大投成本
              <a-icon type="exclamation-circle" style="color: #cfcfcf;" />
            </div>
            <div class="title-element_value">{{ particularsData.bigPutDeal }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 主体内容 -->
    <div class="particulars-content">
      <div class="header-line">
        <span>大投计划</span>
        <div class="header-message_exec">
          <a-button
            icon="download"
            type="primary"
            :loading="exportLoading"
            @click="handleExportClick"
          >
            导出报表
          </a-button>
          <a-button>自定义列</a-button>
        </div>
      </div>
      <a-divider style="margin:0" />
      <div class="particulars-content_product">
        <a-table
          :loading="tableLoading"
          :scroll="{ x: 900, y: 515 }"
          :columns="tableColumns"
          :rowKey="(record) => record.key"
          :data-source="dataSource"
          :pagination="pagination"
          :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
          size="small"
          bordered
          @change="changePage"
        >
        </a-table>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import { SERVER_BASE_URL } from '~/api/config'
import { debounce } from '~/utils/utils'
export default {
  props: {
    particularsData: {
      type: Object,
      default: {
        return: {}
      }
    },
  },
  watch: {
    particularsData: {
      handler: function(newVal) {
        this.searchGoods(newVal.productId)
      },
      deep: true,
      immediate: true,
    }
  },
  data() {
    this.searchGoods = debounce(this.searchGoods, 500)
    return {
      tableLoading: false,
      exportLoading: false,
      fetching: false,
      searchCondition: undefined,
      tableColumns: [
        {
          title: '计划名称',
          dataIndex: 'adName',
          key: 'adName',
          width: 240,
          ellipsis: true,
          fixed: 'left',
          customHeaderCell: () => ({ style: { height: '47px' } }),
          customRender: value => (value ?? '-')
        },
        {
          title: '消耗',
          dataIndex: 'cost',
          key: 'cost',
          width: 120,
          ellipsis: true,
          customHeaderCell: () => ({ style: { height: '47px' } }),
        },
        {
          title: '平均千次展现费用',
          dataIndex: 'avgShowCost',
          key: 'avgShowCost',
          width: 150,
          ellipsis: true,
          customHeaderCell: () => ({ style: { height: '47px' } }),
        },
        {
          title: '展示数',
          dataIndex: 'show',
          key: 'show',
          width: 120,
          ellipsis: true,
          customHeaderCell: () => ({ style: { height: '47px' } }),
        },
        {
          title: '点击数',
          dataIndex: 'click',
          key: 'click',
          width: 120,
          ellipsis: true,
          customHeaderCell: () => ({ style: { height: '47px' } }),
        },
        {
          title: '点击率',
          dataIndex: 'ctr',
          key: 'ctr',
          width: 120,
          ellipsis: true,
          customHeaderCell: () => ({ style: { height: '47px' } }),
        },
        {
          title: '转化数',
          dataIndex: 'convert',
          key: 'convert',
          width: 120,
          ellipsis: true,
          customHeaderCell: () => ({ style: { height: '47px' } }),
        },
        {
          title: '转化率',
          dataIndex: 'convertRate',
          key: 'convertRate',
          width: 120,
          ellipsis: true,
          customHeaderCell: () => ({ style: { height: '47px' } }),
        },
      ],
      dataSource: [],
      selectedGoods: [],
      // 产品数组
      goodsArray: [],
      // 图片数据
      imgArray: [
        '@/assets/images/goods.png',
        '@/assets/images/goods.png',
        '@/assets/images/goods.png',
        '@/assets/images/goods.png'
      ],
      // 分页器
      pagination: {
        size: 'small',
        total: 0,
        current: 1,
        defaultPageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total) => `共 ${total} 条`,
      },
    }
  },
  mounted() {},
  methods: {
    getList() {
      this.tableLoading = true
      this.$API
        .reportPersonBigPutAd(this.returnParams())
        .then(({code, data}) => {
          if(code === 0) {
            this.pagination.total = data.count
            for(let key in data.list) {
              data.list[key].key = key
            }
            this.dataSource = data.list
            return
          }
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    returnParams() {
      return {
        pageIndex: this.particularsData.pageIndex,
        pageSize: this.particularsData.pageSize,
        productId: this.particularsData.productId,
        timeEnd: this.particularsData.timeEnd,
        timeGroupBy: this.particularsData.timeGroupBy,
        timeStart: this.particularsData.timeStart,
        username: this.particularsData.username,
      }
    },
    // 改变分页器的参数
    changePage(page) {
      this.pagination.current = page.current
      this.pagination.pageSize = page.pageSize
      this.getList()
    },
    // 模糊搜索
    searchGoods(name = '') {
      if (name === '' || !name.trim()) return (this.goodsArray = [])
      this.fetching = true
        this.$API
          .getProductList(name)
          .then(({ code, data }) => {
            if (code === 0) {
              this.goodsArray = data
              return
            }
          })
          .finally(() => {
            this.fetching = false
            this.goodsDetail({
              key: this.goodsArray[0].productId
            })
          })
    },
    // 获取指定物品信息
    goodsDetail(obj = {}) {
      this.particularsData.productId = obj.key
      this.selectedGoods = this.goodsArray.filter(item => {
        return obj.key === item.productId
      })
      this.getList()
    },
    // 导出功能
    handleExportClick() {
      let paramsRequest = this.returnParams()
      const params = []
      const accessToken = Cookies.get('authorization') || ''
      this.exportLoading = true
      for (const [key, value] of Object.entries(paramsRequest)) {
        value && params.push(`${key}=${value}`)
      }
      window.location.href = `${SERVER_BASE_URL}/report/person/big-put/excel/export/${accessToken}?${params.join(
        '&'
      )}`
      setTimeout(() => {
        this.exportLoading = false
      }, 500)
    },
  }
}
</script>
<style lang="less" scoped>
  @import '~/assets/css/common.less';

  .particulars {
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
  }
  .header-line {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header-message_exec {
    display: inline-block;
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
  /* 基本信息 - 产品选择 */
  .header-right_title {
    height: 100%;
    display: flex;
    align-items: flex-start;
    padding: 16px 0 0;
    .title-element_value {
      margin-top: 7px;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .header-left_title {
    .left-title {
      top: 0;
      padding: 10px;
      position: sticky;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
    }
    .product-search {
      width: 80%;
    }
    .left-title_search {
      width: 100%;
      padding: 0 10px;
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
    }
    .header-left_title {
      height: calc(100vh - 800px);
      overflow: auto;
    }
    .left-goods_content {
      width: 80%;
      margin-top: 10px;
      align-items: self-start;
      display: flex;
    }
    .goods-image {
      width: 48px;
      height: auto;
      margin-right: 10px;
    }
    .goods-letter {
      display: inline-block;
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
  .particulars-content {
    height: calc(100vh - 300px);
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;
    &_product {
      max-height: calc(100vh - 322px);
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
      padding: 45px;
      border-radius: 4px;
      border: 1px solid #eee;
      display: inline-block;
      background-color: #f6f6f6;
      .content-element_img {
        width: 100%;
        height: auto;
      }
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
