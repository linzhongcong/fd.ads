<!--
 * @Author: lizheng
 * @Date: 2021-02-17 14:33:50
 * @LastEditTime: 2021-04-29 19:06:16
 * @LastEditors: Please set LastEditors
 * @Description: 账户管理 - 推广位
 * @FilePath: \ads\pages\user-account\promotion-management\promotion-position-index.vue
-->
<template>
  <div class="product-wrap">
    <div class="filter">
      <div class="left">
        <a-form-model
          label-align="left"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          layout="inline"
          :model="filterForm"
        >
          <a-form-model-item label="推广位ID">
            <a-input
              allow-clear
              v-model.trim="filterForm.promoterId"
              placeholder="请输入"
              style="width: 300px"
              @pressEnter="getInitData('init')"
              @change="(e) => !e.target.value && this.getInitData('init')"
            />
          </a-form-model-item>
          <a-form-model-item label="推广位名称">
            <a-input
              allow-clear
              v-model.trim="filterForm.promoterName"
              placeholder="请输入"
              style="width: 300px"
              @pressEnter="getInitData('init')"
              @change="(e) => !e.target.value && this.getInitData('init')"
            />
          </a-form-model-item>
          <a-form-model-item label="推广位标签">
            <div style="margin-right: 10px">
              <a-select
                v-model.trim="filterForm.tagIdList"
                show-search
                placeholder="请选择"
                style="min-width: 300px"
                :getPopupContainer="
                  (triggerNode) => {
                    return triggerNode.parentNode || document.body
                  }
                "
                @search="searchTagIdList"
                @change="tagListChange"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                <a-select-option
                  v-for="(item, idx) in tagArray"
                  :key="`${item.id}-${idx}`"
                  :value="item.id"
                >
                  <span
                    style="
                      display: inline-block;
                      padding: 0 5px;
                      height: 28px;
                      line-height: 28px;
                      border-radius: 4px;
                    "
                    :style="{ color: item.textColor, backgroundColor: item.backgroundColor }"
                  >
                    {{ item.tagName }}
                  </span>
                </a-select-option>
              </a-select>
            </div>
          </a-form-model-item>
          <div :style="{ display: isExpand ? 'block' : 'none' }">
            <div style="height: 50px"></div>
          </div>
        </a-form-model>
        <div class="expand-wrap">
          <a-button block type="link" @click="isExpand = !isExpand">
            {{ !isExpand ? '展开' : '收起' }}
            <a-icon :class="['expand-icon', isExpand ? '' : 'packup']" type="caret-up" />
          </a-button>
        </div>
      </div>
      <div class="right">
        <a-button type="primary" @click="getInitData('init')">查询</a-button>
        <a-button
          style="margin-top: 10px"
          @click="
            () => {
              this.filterForm = {}
              this.getInitData()
            }
          "
        >
          重置
        </a-button>
      </div>
    </div>
    <div class="content">
      <header class="content-header">
        <a-button
          type="primary"
          icon="plus"
          @click="handleOpenDrawer({ title: '新建推广位', opType: 'add', name: 'positionDetial' })"
        >
          新建
        </a-button>
        <a-button type="primary" icon="setting" @click="handleOpenDrawer({ name: 'tagsSetting' })">
          标签配置
        </a-button>
      </header>
      <a-table
        :loading="tableLoading"
        :row-selection="{ selectedRowKeys, onChange: onSelectChange, columnWidth: 60 }"
        :columns="promotionPositionColumns"
        :data-source="promotionPositionData"
        :row-key="(record) => record.key"
        :scroll="{ y: 520 }"
        :pagination="pagination"
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
        size="small"
        class="ads-table"
        bordered
        @change="changePage"
      >
        <template slot="operate" slot-scope="text, record, index" style="display: flex">
          <a
            @click="
              handleOpenDrawer({
                title: '编辑推广位信息',
                name: 'positionDetial',
                opType: 'edit',
                record,
              })
            "
          >
            编辑
          </a>
          <PromotionPositionPlan class="plan" :rowData="record" />
          <a @click="deletePromotionItem(record)">删除</a>
        </template>

        <template slot="tagList" slot-scope="text, record, index">
          <a-tooltip
            overlay-class-name="custom-tabs-tooltip"
            placement="topLeft"
            :getPopupContainer="(node) => node || document.body"
          >
            <template slot="title">
              <div class="tooptip-wrapper">
                <a-tag
                  class="tag-tooltip"
                  :color="item.backgroundColor"
                  v-for="(item, idx) in text"
                  :key="`${item.id}-${idx}`"
                >
                  <span :style="{ color: item.textColor }">{{ item.tagName }}</span>
                </a-tag>
              </div>
            </template>
            <div class="tag-wrapper">
              <a-tag
                class="tag"
                :color="item.backgroundColor"
                v-for="(item, idx) in text"
                :key="`${item.id}-${idx}`"
              >
                <span :style="{ color: item.textColor }">{{ item.tagName }}</span>
              </a-tag>
            </div>
          </a-tooltip>
        </template>
      </a-table>
    </div>

    <!-- 新建或编辑 -->
    <PromotionPositionDetail ref="positionDetial" @confirm="getInitData" />

    <!-- 标签设置 -->
    <TagsSetting ref="tagsSetting" @on-save="getInitData" />
  </div>
</template>

<script>
import PromotionPositionDetail from './promotion-position-detial'
import PromotionPositionPlan from './promotion-position-plan'
import TagsSetting from './components/tags-setting'
import { debounce } from '~/utils/utils'
import { promotionPositionColumns } from './columns'

export default {
  components: { PromotionPositionDetail, TagsSetting, PromotionPositionPlan },

  data() {
    this.searchTagIdList = debounce(this.searchTagIdList, 500)
    return {
      // 搜索筛选表单
      isExpand: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      filterForm: {},
      // 标签数组
      tagArray: [],
      // 模糊搜索状态显示
      fetching: false,

      // 表格参数
      tableLoading: false,
      selectedRowKeys: [],
      promotionPositionData: [],
      promotionPositionColumns,

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
    }
  },

  created() {
    this.getInitData()
  },

  methods: {
    // 打开详情右侧抽屉
    handleOpenDrawer(data = {}) {
      this.$refs[data.name].showDrawer(data)
    },

    // 改变分页器的参数
    changePage(page) {
      this.pagination.current = page.current
      this.pagination.pageSize = page.pageSize
      this.promotionPositionData = []
      this.getInitData()
    },

    // 删除某条推广位信息
    deletePromotionItem({ id, promoterName }) {
      const that = this
      this.$confirm({
        title: (h) => (
          <p>
            确定要从推广位列表中删除<span style="color:#f00">{promoterName}</span>吗？
          </p>
        ),
        onOk() {
          that.$API.deletePromoter(id).then(({ code, data }) => {
            if (code === 0) {
              that.$message.success(data)
              that.getInitData()
            }
          })
        },
      })
    },

    // 勾选某一条表格的数据
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    // 获取列表数据
    getInitData(type) {
      type === 'init' && (this.pagination.current = 1) && (this.pagination.pageSize = 10)
      const { pageSize, current: pageIndex } = this.pagination
      const params = { pageIndex, pageSize, ...this.filterForm }

      this.tableLoading = true
      this.$API
        .getPromoter(params)
        .then(({ code, data }) => {
          this.tableLoading = false
          if (code === 0) {
            this.pagination.total = Number(data.count)
            this.promotionPositionData = data.list.map((item) => ({ ...item, key: item.id }))
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
    },

    // 获取标签数据
    async searchTagIdList(tagName = '') {
      this.fetching = true
      let { code, data } = await this.$API.getTag({
        tagName,
        pageSize: 1000,
      })
      this.fetching = false
      this.tagArray = []
      if (code === 0) {
        this.tagArray = data.list
      }
    },

    // 推广位标签选中值改变
    tagListChange() {
      this.getInitData('init')
    },
  },
}
</script>

<style lang="less" scoped>
@import '~/assets/css/account.less';

.tag-wrapper {
  width: 100%;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .tag {
    cursor: pointer;
  }
}
</style>

<style lang="less">
.custom-tabs-tooltip {
  display: flex;
  flex-wrap: wrap;
  width: 300px;

  .tooptip-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 300px;
    overflow: hidden;
  }

  .ant-tooltip-content {
    .ant-tooltip-arrow::before,
    .ant-tooltip-inner {
      background-color: #fff;
    }
  }

  .tag-tooltip {
    display: inline-block;
    margin: 5px;
  }
}
.plan {
  display: inline-block;
}
</style>
