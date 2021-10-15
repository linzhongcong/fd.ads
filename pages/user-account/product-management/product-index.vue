<!--
 * @Author: lizheng
 * @Date: 2021-02-17 14:33:50
 * @LastEditTime: 2021-03-26 13:15:15
 * @LastEditors: Please set LastEditors
 * @Description: 账户管理 - 产品
 * @FilePath: \ads\pages\user-account\product-management\product-index.vue
-->
<template>
  <div class="product-wrap">
    <div class="filter">
      <div class="left">
        <a-form-model label-align="left"
                      :label-col="labelCol"
                      :wrapper-col="wrapperCol"
                      layout="inline"
                      :model="filterForm">
          <a-form-model-item label="商品ID">
            <a-input allow-clear
                     v-model.trim="filterForm.productId"
                     placeholder="请输入"
                     style="width:250px"
                     @pressEnter="getInitData('init')"
                     @change="(e) => !e.target.value && this.getInitData('init')" />
          </a-form-model-item>
          <a-form-model-item label="商品名称"
                             style="margin-left:10px">
            <a-input allow-clear
                     v-model.trim="filterForm.productName"
                     placeholder="请输入"
                     style="width:250px"
                     @pressEnter="getInitData('init')"
                     @change="(e) => !e.target.value && this.getInitData('init')" />
          </a-form-model-item>
          <a-form-model-item label="店铺名称">
            <a-select v-model="filterForm.shopId"
                      show-search
                      allow-clear
                      option-label-prop="label"
                      @search="(value) => productionFuzzySearch(value, 'allShop')"
                      @change="changeShopName"
                      placeholder="请输入"
                      style="width:250px"
                      class="ml">
              <a-spin v-if="fetching"
                      slot="notFoundContent"
                      size="small" />
              <a-select-option v-for="item in allShop"
                               :value="item.shopName"
                               :key="item.shopId"
                               :label="item.shopName">
                {{item.shopName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <div :style="{ display: isExpand ? 'block' : 'none' }">
            <div style="height:50px"></div>
          </div>
        </a-form-model>
        <div class="expand-wrap">
          <a-button block
                    type="link"
                    @click="isExpand = !isExpand">
            {{ !isExpand ? '展开' : '收起' }}
            <a-icon :class="['expand-icon', isExpand ? '' : 'packup']"
                    type="caret-up" />
          </a-button>
        </div>
      </div>
      <div class="right">
        <a-button type="primary"
                  @click="getInitData('init')">查询</a-button>
        <a-button style="margin-top:10px"
                  @click="
            () => {
              this.filterForm = {}
              this.getInitData()
            }
          ">
          重置
        </a-button>
      </div>
    </div>
    <div class="content">
      <header class="content-header">
        <a-button type="primary"
                  icon="plus"
                  @click="handleOpenDrawer('productDetial', { title: '新建商品信息', opType: 'add' })">
          新建
        </a-button>
      </header>
      <a-table :loading="tableLoading"
               :row-selection="{ selectedRowKeys, onChange: onSelectChange, columnWidth: 40 }"
               :columns="productColumns"
               :data-source="productData"
               :row-key="(record) => record.key"
               :scroll="{ y: 520 }"
               :pagination="pagination"
               :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
               size="small"
               bordered
               @change="changePage">
        <template slot="operate"
                  slot-scope="text, record, index">
          <a @click="
              handleOpenDrawer('productDetial', { title: '编辑商品信息', opType: 'edit', record })
            ">
            编辑
          </a>
          <a-button type="link"
                    @click="deletePromotionItem(record)">删除</a-button>
        </template>
        <template slot="adId"
                  slot-scope="text, record, index">
          <a @click="handleOpenDrawer('productLinkAdId', record)">查看</a>
        </template>
      </a-table>
    </div>

    <!-- 新建或编辑 -->
    <ProductDetail ref="productDetial"
                   @confirm="getInitData" />

    <!-- 查看关联的广告投放账号 -->
    <ProductView ref="productLinkAdId" />
  </div>
</template>

<script>
import ProductDetail from './product-detial'
import ProductView from './product-view'
import { productColumns } from './columns'
import { debounce } from '~/utils/utils'

export default {
  components: { ProductDetail, ProductView },

  data () {
    this.productionFuzzySearch = debounce(this.productionFuzzySearch, 500)
    return {
      // 搜索筛选表单
      isExpand: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      filterForm: {},

      // 表格参数
      tableLoading: false,
      selectedRowKeys: [],
      productData: [],
      productColumns,

      // 分页器
      pagination: {
        size: 'small',
        total: 0,
        current: 1,
        defaultPageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total) => `共 ${total} 条`,
      },
      allShop: [],
      fetching: false
    }
  },

  created () {
    this.getInitData()
  },

  methods: {
    changeShopName (value) {
      this.allShop.map((item) => {
        if (item.shopName === value) this.filterForm.shopId = item.shopId
      })
    },
    // 搜索店铺
    productionFuzzySearch (shopName, array) {
      console.log(shopName, array);
      if (shopName === '' || !shopName.trim()) return (this[array] = [])
      this.fetching = true
      this.$API
        .getShopName(shopName)
        .then(({ code, data }) => {
          console.log(data);
          this.fetching = false
          if (code === 0) this[array] = data
        })
        .catch(() => (this.fetching = false))
    },
    // 打开详情右侧抽屉
    handleOpenDrawer (name, data = {}) {
      console.log('name,', name)
      this.$refs[name].showDrawer(data)
    },

    // 改变分页器的参数
    changePage (page) {
      this.pagination.current = page.current
      this.pagination.pageSize = page.pageSize
      this.productData = []
      this.getInitData()
    },

    // 删除某条商品信息
    deletePromotionItem ({ id, productName }) {
      const that = this
      this.$confirm({
        title: (h) => (
          <p>
            确定要从产品列表中删除<span style="color:#f00">{productName}</span>吗？
          </p>
        ),
        onOk () {
          that.$API.deleteProduct(id).then(({ code, data }) => {
            if (code === 0) {
              that.$message.success(data)
              that.getInitData()
            }
          })
        },
      })
    },

    // 勾选某一条表格的数据
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    // 获取列表数据
    getInitData (type) {
      type === 'init' && (this.pagination.current = 1) && (this.pagination.pageSize = 10)
      const { pageSize, current: pageIndex } = this.pagination
      const params = { pageIndex, pageSize, ...this.filterForm }
      // if (params.shopId.length ) delete params.shopId
      this.tableLoading = true
      this.$API
        .getProduct(params)
        .then(({ code, data }) => {
          this.tableLoading = false
          if (code === 0) {
            this.pagination.total = Number(data.count)
            this.productData = data.list.map((item) => ({ ...item, key: item.id }))
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
  },
}
</script>

<style lang="less" scoped>
@import '~/assets/css/account.less';
</style>
