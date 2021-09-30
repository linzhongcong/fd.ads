<!--
 * @Author: hjh
 * @Date: 2021-07-17 14:42:02
 * @LastEditTime: 2021-07-22 16:53:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads.fandow.com\pages\property\person-squeeze\list.vue
-->
<template>
  <div class="product-wrap">
    <div class="filter">
      <div class="left">
        <!-- 搜索表单内容 -->
        <a-form-model
          label-align="right"
          layout="inline"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          :model="filterForm"
        >
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="落地页ID">
                <a-input
                  allow-clear
                  v-model.trim="filterForm.landingPageId"
                  placeholder="请输入"
                  class="statement-input"
                  @pressEnter="getInitData('init')"
                  @change="(e) => !e.target.value && this.getInitData('init')"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="落地页名称">
                <a-input
                  allow-clear
                  v-model.trim="filterForm.landingPageName"
                  placeholder="请输入"
                  class="statement-input"
                  @pressEnter="getInitData('init')"
                  @change="(e) => !e.target.value && this.getInitData('init')"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="管理员" style="width: 100%;">
                <a-select
                  show-search
                  allow-clear
                  option-label-prop="label"
                  style="width: 66%;"
                  @search="(name) => formFuzzySearchList(name)"
                  @change="(name) => handleUserChangeList(name)"
                  placeholder="请输入工号/姓名"
                >
                  <a-spin v-if="listFetching" slot="notFoundContent" size="small" />
                  <a-select-option
                    v-for="(item, index) in userOptions"
                    :value="item.employee"
                    :key="item.id"
                    :label="item.realName"
                  >
                    {{ item.employee }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>

          <!-- 第二行起的表单默认隐藏 -->
          <div :style="{ display: isExpand ? 'block' : 'none' }">
            <a-row>
              <a-col :span="8">
                <a-form-model-item label="创建时间">
                  <a-range-picker
                    v-model="filterDateRange"
                    :disabled-date="(current) => current && current > this.moment().endOf('day')"
                    :allow-clear="true"
                    show-time
                    format="YYYY.MM.DD"
                    separator="至"
                    class="statement-input"
                    style="width:auto"
                    @change="changeDatePick"
                  >
                    <a-icon slot="suffixIcon" type="calendar" />
                  </a-range-picker>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="个人号">
                  <a-input
                    allow-clear
                    style="margin-left: 5px;"
                    v-model.trim="filterForm.personalNumber"
                    placeholder="请输入"
                    class="statement-input"
                    @pressEnter="getInitData('init')"
                    @change="(e) => !e.target.value && this.getInitData('init')"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </div>
        </a-form-model>

        <!-- 展开或收起 -->
        <div class="expand-wrap">
          <a-button type="link" @click="isExpand = !isExpand">
            <span>{{ !isExpand ? '展开' : '收起' }}</span>
            <a-icon :class="['expand-icon', isExpand ? '' : 'packup']" type="caret-up" />
          </a-button>
        </div>
      </div>

      <!-- 查询操作模块 -->
      <div class="right">
        <a-button type="primary" @click="getInitData('init')">
          查询
        </a-button>
        <a-button style="margin-top:10px" @click="handleResetClick">
          重置
        </a-button>
      </div>
    </div>
    <div class="content">
      <header class="content-header">
        <a-button
          type="primary"
          icon="plus"
          @click="handleOpenDrawer('squeezeExecRef', { title: '新建', statu: 'create', data: {} })"
        >
          新建
        </a-button>
        <div class="content-header__right"></div>
      </header>
      <a-table
        bordered
        class="statistics-table"
        size="small"
        :loading="tableLoading"
        :row-key="(record) => record.key"
        :columns="squeezeColumns"
        :data-source="squeezeData"
        :row-selection="{ selectedRowKeys, onChange: handleSelectChange }"
        :pagination="pagination"
        :scroll="{ x: 700, y: 520 }"
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
        @change="changePage"
      >
        <template slot="squeezeSlot" slot-scope="text, record">
          <a-row class="a-row_style" type="flex" justify="space-between">
            <a-col class="text-ellipsis" :title="text">{{ text }}</a-col>
            <a-col>
              <img
                @click="copySqueeze(text, () => $message.success('复制成功'))"
                class="copy-icon"
                title="复制落地页链接"
                src="@/assets/images/copy.png"
                alt=""
              />
            </a-col>
          </a-row>
        </template>
        <template slot="linkSlot" slot-scope="text, record">
          <a-row class="a-row_style" type="flex" justify="space-between">
            <a-col class="text-ellipsis" :title="text">{{ text }}</a-col>
            <a-col>
              <img
                @click="copySqueeze(text, () => $message.success('复制成功'))"
                class="copy-icon"
                title="复制落地页链接"
                src="@/assets/images/copy.png"
                alt=""
              />
            </a-col>
          </a-row>
        </template>
        <template slot="operate" slot-scope="text, record">
          <a
            @click="
              handleOpenDrawer('squeezeExecRef', { title: '编辑', statu: 'edit', data: record })
            "
          >
            编辑
          </a>
          <a @click="deleteListData(record)">删除</a>
        </template>
      </a-table>
    </div>

    <squeeze-exec @execList="execList" ref="squeezeExecRef" />
  </div>
</template>

<script>
  import { debounce, copyText } from '~/utils/utils'
  import squeezeExec from './person-squeeze-exec'

  export default {
    components: {
      squeezeExec,
    },

    data() {
      this.getInitData = debounce(this.getInitData, 500)
      this.formFuzzySearch = debounce(this.formFuzzySearch, 500)
      this.copySqueeze = debounce(copyText, 500)
      return {
        // 搜索筛选表单
        isExpand: false,
        tableLoading: false,
        filterForm: {},

        userOptions: [],
        listFetching: false,

        filterDateRange: [],

        squeezeColumns: [
          {
            title: '落地页ID',
            dataIndex: 'landingPageId',
            key: 'landingPageId',
            scopedSlots: { customRender: 'squeezeSlot' },
            width: 180,
          },
          {
            title: '落地页名称',
            dataIndex: 'landingPageName',
            key: 'landingPageName',
            width: 180,
          },
          {
            title: '落地页链接',
            dataIndex: 'landingPageUrl',
            key: 'landingPageUrl',
            scopedSlots: { customRender: 'linkSlot' },
            width: 240,
          },
          {
            title: '落地页个人号',
            dataIndex: 'personalNumber',
            key: 'personalNumber',
            width: 120,
            ellipsis: true,
          },
          {
            title: '管理员',
            dataIndex: 'manger',
            key: 'manger',
            width: 180,
          },
          {
            title: '点击数',
            dataIndex: 'click',
            key: 'click',
            width: 120,
          },
          {
            title: '转化数',
            dataIndex: 'convert',
            key: 'convert',
            width: 120,
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
          },
          {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            width: 120,
            scopedSlots: { customRender: 'operate' },
            customHeaderCell: () => ({ style: { height: '47px' } }),
          },
        ],
        squeezeData: [],
        selectedRowKeys: [],

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

    created() {},

    mounted() {
      this.getInitData('init')
    },

    methods: {
      getInitData(type = '') {
        this.tableLoading = true
        if (type === 'init') {
          this.pagination.current = 1
          this.pagination.pageSize = 10
        }
        this.$API
          .personalLandingPageSearch({
            ...this.filterForm,
            pageIndex: this.pagination.current,
            pageSize: this.pagination.pageSize,
          })
          .then(({ code, data: { list, count }, message }) => {
            if (!code) {
              list.map((element, index) => (element.key = index))
              this.squeezeData = list
              this.pagination.total = count
              return false
            }
            this.$message.warn(message)
          })
          .finally(() => {
            this.tableLoading = false
          })
      },

      // 重置按钮
      handleResetClick() {
        this.filterForm = {}
        this.filterDateRange = []
      },

      // 打开详情右侧抽屉
      handleOpenDrawer(name, data = {}) {
        this.$refs[name].showDrawer(data)
      },

      handleSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },

      // 改变分页器的参数
      changePage(page) {
        this.pagination.current = page.current
        this.pagination.pageSize = page.pageSize
        this.dataSource = []
        this.getInitData()
      },

      // 时间选择器
      changeDatePick(date) {
        if (date.length) {
          this.filterForm.startTime = date[0].format('YYYY-MM-DD HH:mm:ss')
          this.filterForm.endTime = date[1].format('YYYY-MM-DD HH:mm:ss')
        } else {
          this.filterForm.startTime = ''
          this.filterForm.endTime = ''
        }
        this.getInitData('init')
      },

      // 更新列表
      execList() {
        this.getInitData()
        this.$refs['squeezeExecRef'].onClose()
      },

      // 删除数据
      deleteListData({ id, landingPageId }) {
        const that = this
        this.$confirm({
          title: '确认是否删除',
          content: `您确定要删除落地页ID为${landingPageId}的数据？`,
          maskClosable: true,
          onOk() {
            that.$API.personalLandingDelete(id).then(({ code, message }) => {
              if (!code) {
                that.getInitData('init')
                that.$message.success('删除成功')
                return false
              }
              that.$message.warn(message)
            })
          },
          onCancel() {},
        })
      },

      // 负责人模糊搜索
      formFuzzySearchList(name, idx) {
        this.listFetching = true
        this.$API
          .getUsers({ name, perPage: 50 })
          .then(({ code, data: { list } }) => {
            if (code === 0) {
              this.userOptions = list.map((item) => ({
                ...item,
                employee: `${item.realName} / ${item.username}`,
              }))
            }
          })
          .finally(() => (this.listFetching = false))
      },

      // 用户模糊搜索发生改变
      handleUserChangeList(item, idx) {
        if (item === '' || item === undefined) return false
        this.filterForm.manager = item.split('/')[0]
        this.getInitData('init')
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~/assets/css/account.less';
  .expand-icon {
    margin-bottom: 2px;
    transform: rotate(0deg);
    transition: all 0.2s ease;
  }

  .packup {
    transform: rotate(180deg);
  }

  .packup {
    transform: rotate(180deg);
  }
  .content-header__right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 320px;
  }

  .product-wrap {
    height: calc(100vh - 208px);
    overflow-y: auto;
    background-color: #eef0f3;
    .seconed-content_header {
      justify-content: center;
      font-weight: 700;
      font-style: normal;
      font-size: 18px;
      position: relative;
      .pack-up {
        top: 80%;
        right: -2%;
        position: absolute;
      }
    }
    .tips-style {
      font-size: 14px;
      color: rgba(204, 204, 204, 1);
      cursor: pointer;
    }
    .ad-element {
      padding: 20px 30px 20px 24px;
      border-right: 1px solid #e9e9e9;
      background-color: #fff;
      display: inline-block;
    }
    .clear-portion_style {
      padding: 0;
      background-color: transparent;
    }
    .integer-number {
      font-weight: bold;
    }
    .decimal-number {
      font-size: 16px;
      text-indent: -5px;
      font-weight: 600;
      display: inline-block;
    }
    .order-data_title {
      width: 160px;
      font-size: 14px;
      color: #999999;
    }
    .order-data_value {
      font-size: 24px;
      font-weight: 600;
      color: #000;
    }
  }

  .adzone-name_style {
    font-weight: bold;
  }

  .perspective-content {
    overflow: auto;
  }

  .a-row_style {
    width: 100%;
  }

  .copy-icon {
    width: 24px;
    height: 24px;
    cursor: pointer;
    color: #1890ff;
  }

  .text-ellipsis {
    width: 84%;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
    white-space: nowrap;
  }

  .statement-input {
    width: 220px !important;
    @media screen and (min-width: 1600px) {
      width: 320px !important;
    }
    @media screen and (max-width: 1280px) {
      width: 200 !important;
    }
  }
</style>

<style lang="less">
  .product-wrap {
    /deep/ .ant-select-selection__choice {
      padding-left: 0;
    }
  }
  .product-wrap_tool {
    .tool-tip_letter {
      margin: 10px 10px 10px 0px;
    }
  }
  .ant-tooltip-content {
    .ant-tooltip-arrow::before,
    .ant-tooltip-inner {
      background-color: #fff;
    }
  }
</style>
