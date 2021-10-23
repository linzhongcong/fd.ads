<template>
  <div>
    <a-tabs default-active-key="kwaiData" @change="callback" type="card" class="default">
      <a-tab-pane key="kwaiData" tab="归档数据">
        <a-table
          bordered
          class="statistics-table"
          size="small"
          :loading="kwaiLoading"
          :row-key="(record) => record.key"
          :columns="kwaiColumns"
          :data-source="kwaiData"
          :row-selection="{ selectedRowKeys, onChange: handleSelectChange }"
          :pagination="pagination"
          :scroll="{ x: 700, y: 520 }"
          :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
          @change="changePage"
        >
          <template slot="operate" slot-scope="text, record">
            <a @click="handleTimeClick('timeInterval', false, false)">查看时段</a>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="importData" tab="手动导入">
        <div class="import">
          <div>
            <a-button type="primary" @click="handleImportClick">
              导入数据
            </a-button>
          </div>
          <div>
            <a-button :loading="exportLoading" @click="handleExportClick">
              下载导入模板
            </a-button>
          </div>
        </div>
        <a-table
          bordered
          class="statistics-table"
          size="small"
          :loading="importLoading"
          :row-key="(record) => record.key"
          :columns="kwaiColumns"
          :data-source="kwaiData"
          :row-selection="{ selectedRowKeys, onChange: handleSelectChange }"
          :pagination="pagination"
          :scroll="{ x: 700, y: 520 }"
          :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
          @change="changePage"
        >
          <template slot="operate" slot-scope="text, record">
            <a @click="handleTimeClick('timeInterval', true)">设置时段</a>
            <a >删除</a>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="automaticData" tab="自动同步" v-if="isVisible">
        <div class="import">
          <div>
            <a-button type="primary" @click="updateFileData">
              更新归档数据
            </a-button>
          </div>
        </div>
        <a-table
          bordered
          class="statistics-table"
          size="small"
          :loading="importLoading"
          :row-key="(record) => record.key"
          :columns="kwaiColumns"
          :data-source="kwaiData"
          :row-selection="{ selectedRowKeys, onChange: handleSelectChange }"
          :pagination="pagination"
          :scroll="{ x: 700, y: 520 }"
          :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
          @change="changePage"
        >
          <template slot="operate" slot-scope="text, record">
            <a @click="handleOpenDrawer('manualSetup')">设置</a>
            <a @click="handleTimeClick('timeInterval', false, false)">查看时段</a>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
    <manual-setup ref="manualSetup" />
    <import-modal ref="importModal" @onSave="handleOnSave" />
    <time-interval ref="timeInterval" :sessionData="timeData" :canEdit="isEdit" :isShow="isShow" />
  </div>
</template>

<script>
  import { kwaiColumns } from './js/columns'
  import manualSetup from './manual-setup'
  import importModal from './import-data'
  import timeInterval from './time-interval'
  export default {
    components: {
      manualSetup,
      importModal,
      timeInterval,
    },
    props: {
      filterForm: {
        type: Object,
        default: () => {
          return {}
        },
      },
      isVisible: {
        type: Boolean,
        default: () => true
      }
    },
    data() {
      return {
        exportLoading: false,
        kwaiLoading: false,
        importLoading: false,
        fileData: [],
        kwaiColumns,
        kwaiData: [
          {
            planID: 1,
            date: 1,
            planName: 1,
            accountId: '1',
            consume: 1,
            shop: 1,
            extension: 1,
            Launch: 1,
            key: 1,
          },
        ],
        importData: [],
        automaticData: [],
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
        apiMap: {
          kwaiData: 'personalLandingPageSearch',
          importData: 'importSearch',
          automaticData: 'automaticSearch',
        },
        loadingMap: {
          kwaiData: 'kwaiLoading',
          importData: 'importLoading',
          automaticData: 'automaticLoading',
        },
        dataMap: {
          kwaiData: 'kwaiData',
          importData: 'importData',
          automaticData: 'automaticData',
        },
        tabKey: '',
        timeData: [],
        isEdit: false,
        isShow: false,
      }
    },
    methods: {
      callback(key) {
        console.log(key)
        console.log(this[key])
        this.tabKey = key
        this.getInitData('init')
      },
      getInitData(type = '') {
        console.log(type, this.filterForm)
        //this[this.loadingMap[this.tabKey]] = true
        return
        if (type === 'init') {
          this.pagination.current = 1
          this.pagination.pageSize = 10
        }
        this.$API[this.apiMap[this.tabKey]]({
          ...this.filterForm,
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
        })
          .then(({ code, data: { list, count }, message }) => {
            if (!code) {
              list.map((element, index) => (element.key = index))
              this[this.dataMap[this.tabKey]] = list
              this.pagination.total = count
              return false
            }
            this.$message.warn(message)
          })
          .finally(() => {
            this.tableLoading = false
          })
      },
      handleSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },

      // 改变分页器的参数
      changePage(page) {
        this.pagination.current = page.current
        this.pagination.pageSize = page.pageSize
        this.getInitData()
      },

      handleClick(text, record) {
        console.log(text, record)
      },

      // 导入
      handleImportClick() {
        this.$refs.importModal.openModal()
        console.log(this.filterForm)
      },
      //  导入数据成功的回调
      handleOnSave() {
        this.$message.success('数据导入成功！')
        this.getInitData('init')
      },
      // 导出模板
      handleExportClick() {
        const params = []
        const accessToken = Cookies.get('authorization') || ''
        this.exportLoading = true
        for (const [key, value] of Object.entries(this.filterForm)) {
          value && params.push(`${key}=${value}`)
        }
        window.open(
          `${SERVER_BASE_URL}/report/product/excel/export/${accessToken}?${params.join('&')}`,
          '_blank'
        )
        setTimeout(() => {
          this.exportLoading = false
        }, 500)
      },

      // 判断时段是否编辑
      handleTimeClick(name, isEdit, isShow) {
        this.isEdit = isEdit
        this.isShow = isShow
        this.handleOpenDrawer(name)
      },

      // 打开详情右侧抽屉
      handleOpenDrawer(name, data = {}) {
        this.$refs[name].showDrawer(data)
      },

      //更新归档数据
      updateFileData() {
        console.log('更新归档数据')
      },

    },
  }
</script>

<style lang="less" scoped>
  .look {
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .import {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .default /deep/.ant-tabs-nav-scroll {
    padding-left: 0px !important;
  }
</style>
