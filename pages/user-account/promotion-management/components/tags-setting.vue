<!--
 * @Author: lizheng
 * @Date: 2021-04-21 14:46:08
 * @LastEditTime: 2021-04-24 16:15:18
 * @LastEditors: Please set LastEditors
 * @Description: 标签配置
 * @FilePath: \ads\pages\user-account\promotion-management\components\tags-setting.vue
-->

<template>
  <div v-if="visible">
    <a-modal
      title="标签配置"
      v-model="visible"
      :width="740"
      :keyboard="false"
      :mask-closable="false"
      @cancel="closeModal"
    >
      <div class="header">
        <a-button type="primary" @click="handleOpenModal('add')">新增标签</a-button>
        <div class="header-rigth">
          <span>标签名称：</span>
          <a-input-search
            v-model.trim="tagName"
            allow-clear
            placeholder="请输入标签名"
            style="width: 265px"
            @pressEnter="onSearch"
            @search="onSearch"
          />
        </div>
      </div>
      <a-table
        :loading="tableLoading"
        :row-selection="{ columnWidth: 40, selectedRowKeys, onChange: onSelectChange }"
        :columns="settingColumns"
        :data-source="dataSource"
        :row-key="(record) => record.key"
        :scroll="{ y: 500 }"
        :pagination="pagination"
        :row-class-name="(record, index) => (index % 2 === 1 ? 'table-row__striped' : '')"
        size="small"
        class="ads-table"
        bordered
        @change="onChangePage"
      >
        <template slot="style" slot-scope="text, record, idx">
          <a-button
            :style="{
              background: record.backgroundColor,
              color: record.textColor,
            }"
          >
            {{ record.tagName }}
          </a-button>
        </template>

        <template slot="operate" slot-scope="text, record, index">
          <a @click="handleOpenModal('edit', record)">编辑</a>
          <a-button type="link" @click="onDetele(record)">删除</a-button>
        </template>
      </a-table>
      <div slot="footer">
        <a-button @click="closeModal">取消</a-button>
        <a-button type="primary" @click="closeModal">确定</a-button>
      </div>
    </a-modal>

    <EditSetting ref="editSetting" @on-save="getData" />
  </div>
</template>

<script>
  import EditSetting from './tags-setting-edit'
  import { settingColumns } from '../columns'

  export default {
    components: { EditSetting },

    data() {
      return {
        tagName: '',
        visible: false,
        tableLoading: false,
        settingColumns,
        dataSource: [],
        selectedRowKeys: [],

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

    methods: {
      showDrawer() {
        this.visible = true
        this.getData()
      },

      closeModal() {
        this.visible = false
        this.$emit('on-save')
      },

      handleOpenModal(type, data = {}) {
        const playload = { type, data, title: type === 'add' ? '新增标签' : '编辑标签' }
        this.$refs.editSetting.openModal(playload)
      },

      // 获取标签表格数据
      async getData(params) {
        this.tableLoading = true
        const { code, data } = await this.$API.getTag(params)
        this.tableLoading = false
        if (code === 0) {
          this.dataSource = data.list.map((item) => ({ key: item.id, ...item }))
          this.pagination.total = data.count
          this.pagination.current = data.page
        }
      },

      // 切换分页
      onChangePage({ current, pageSize }) {
        const params = { pageIndex: current, pageSize }
        this.getData(params)
      },

      onSelectChange() {},

      // 删除标签
      async onDetele(record) {
        const { code, data } = await this.$API.deleteTag(record.id)
        if (code === 0) {
          this.$message.success(data)
          this.getData()
        }
      },

      // 搜索标签
      onSearch() {
        const params = { tagName: this.tagName }
        this.getData(params)
      },
    },
  }
</script>

<style lang="less" scoped>
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    &-right {
      display: flex;
    }
  }

  @import '~/assets/css/table.less';
</style>
