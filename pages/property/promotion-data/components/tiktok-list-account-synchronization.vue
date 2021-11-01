<template>
  <div>
    <a-popover placement="topRight">
      <template slot="content">
        <p class="title">进行广告账号设置，用</p>
        <p class="title">于获取账户的计划数据</p>
      </template>
      <a-button type="primary"
                class="account-synchronization"
                @click="openMode('accountSynchronization')">
        账户同步
        <a-icon type="question-circle" />
      </a-button>
    </a-popover>

    <a-modal title="账号同步"
             v-model="accountSynchronization"
             width="70%">
      <a-row>
        <a-col :span="21">
          <span class="fw">账户：</span>
          <a-select v-model.trim="searchForm.advertiserName"
                    show-search
                    allow-clear
                    option-label-prop="label"
                    @search="(value) => productionFuzzySearch(value, 'accountList')"
                    @change="(val) => onSelectChange(val, 'searchForm', 'accountList')"
                    placeholder="计划ID/计划名称"
                    style="width: 30%">
            <a-spin v-if="fetching"
                    slot="notFoundContent"
                    size="small" />
            <a-select-option v-for="item in accountList"
                             :value="item.advertiserName"
                             :key="item.advertiserId"
                             :label="item.advertiserName">
              {{ item.employee }}
            </a-select-option>
          </a-select>
          <span class="ml fw">当前负责人：</span>
          <SelectUsers v-model.trim="searchForm.realName"
                       @change="(val) => onSelectChange(val, 'searchForm', 'accountList')"
                       style="width: 25%" />
          <a-button type="primary"
                    class="query"
                    @click="getSyncAccountList('init')">查询</a-button>
        </a-col>
        <a-col :span="3">
          <a-button type="primary"
                    class="newAdd"
                    icon="plus"
                    @click="openMode('newlyBuild', 'add')">
            新建
          </a-button>
        </a-col>
      </a-row>
      <a-table :columns="accountTable"
               :data-source="accountTableData"
               :row-key="(record) => record.id"
               :loading="loadingTable"
               :scroll="{ y: 520 }"
               size="small"
               :pagination="pagination"
               @change="changePage"
               class="mt"
               bordered>
        <template slot="operate"
                  slot-scope="text, record, index"
                  style="display: flex">
          <a style="color: red"
             @click="deletePromotionItem(record)">删除</a>
        </template>
      </a-table>
      <!-- 新建 -->
      <a-modal v-model="newlyBuild"
               title="新建"
               width="40%"
               :dialog-style="{ top: '150px' }">
        <a-form-model ref="newlyBuild"
                      :model="newlyBuildForm"
                      :rules="formRules"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 13 }">
          <a-form-model-item label="账户"
                             prop="advertiserName">
            <a-select v-model="newlyBuildForm.advertiserName"
                      show-search
                      allow-clear
                      option-label-prop="label"
                      @search="(value) => productionFuzzySearch(value, 'searchAccountList')"
                      @change="(val) => onSelectChange(val, 'newlyBuildForm', 'searchAccountList')"
                      placeholder="账户ID/账号名称">
              <a-spin v-if="fetching"
                      slot="notFoundContent"
                      size="small" />
              <a-select-option v-for="item in searchAccountList"
                               :value="item.advertiserName"
                               :key="item.advertiserId"
                               :label="item.advertiserName">
                {{ item.employee }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-form-model>
        <!-- 自定义页脚 - 新增、编辑 -->
        <template slot="footer">
          <a-button key="back"
                    @click="closeMode('newlyBuild')">取消</a-button>
          <a-button key="submit"
                    type="primary"
                    :loading="btnLoading"
                    @click="submit('newlyBuild')">
            提交
          </a-button>
        </template>
      </a-modal>
      <!-- 自定义页脚 - 账号同步 -->
      <template slot="footer">
        <a-button key="back"
                  @click="closeMode('accountSynchronization')">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { debounce } from '~/utils/utils'
import { accountTable } from './js/columns'
export default {
  data () {
    this.productionFuzzySearch = debounce(this.productionFuzzySearch, 500)
    return {
      accountSynchronization: false,
      searchForm: {},
      fetching: false,
      accountList: [],
      accountTable,
      accountTableData: [],
      // 分页器
      pagination: {
        size: 'small',
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showTotal: (total) => `共 ${total} 条`,
      },
      loadingTable: false,

      // 新建数据
      newlyBuild: false,
      btnLoading: false,
      searchAccountList: [],
      newlyBuildForm: {},
      formRules: {
        advertiserName: [{ required: true, message: '请选择账户ID/账户名称', trigger: 'change' }],
      },
    }
  },
  methods: {
    getSyncAccountList (type = '') {
      this.loadingTable = true
      let params = JSON.parse(JSON.stringify(this.searchForm))
      params.pageIndex = this.pagination.current
      params.pageSize = this.pagination.pageSize
      if (!params.advertiserName) delete params.advertiserId
      if (type) {
        params.pageIndex = this.pagination.current = 1
      }
      this.$API.syncAccount(params).then(({ code, data }) => {
        this.loadingTable = false
        if (code === 0) {
          this.pagination.total = Number(data.count)
          this.accountTableData = data.list
        }
      })
    },

    // 模糊搜索
    productionFuzzySearch (advertiser, array) {
      if (advertiser === '' || !advertiser.trim()) return (this[array] = [])
      this.fetching = true
      const methodName = array === 'accountList' ? 'searchAccount' : 'getReportAdvertiserSearch'
      this.$API[methodName](advertiser)
        .then(({ code, data }) => {
          this.fetching = false
          if (code === 0) {
            this[array] = data.map((item) => ({
              ...item,
              employee: `${item.advertiserId} / ${item.advertiserName}`,
            }))
          }
        })
        .catch(() => (this.fetching = false))
    },

    // 下拉选中
    onSelectChange (value, obj, arr) {
      this[arr].map((item) => {
        if (item.advertiserName === value) this[obj].advertiserId = item.advertiserId
      })
    },

    // 弹窗
    openMode (prop, type) {
      this[prop] = true
      this.$refs[prop] && this.$refs[prop].resetFields()
      this.searchForm = {}
      this.accountList = []
      this.newlyBuildForm = {}
      this.searchAccountList = []
      console.log(this.newlyBuildForm)
      if (prop === 'accountSynchronization') {
        this.getSyncAccountList()
      }
    },
    // 关闭
    closeMode (prop) {
      this[prop] = false
    },

    // 提交
    submit (prop) {
      this.$refs[prop].validate((valid) => {
        if (!valid) return
        this.btnLoading = true
        let params = JSON.parse(JSON.stringify(this.newlyBuildForm))
        console.log(params)
        this.$API
          .postAccount(params)
          .then(({ code, data, msg }) => {
            if (code === 0) {
              this.$message.success('新建成功', 1.5)
              this.btnLoading = false
              this[prop] = false
              this.getSyncAccountList()
              return
            }
            this.$message.error(msg)
            this.btnLoading = false
            this[prop] = false
          })
          .catch(() => {
            this[prop] = false
            this.btnLoading = false
          })
      })
    },

    // 分页
    changePage (page) {
      this.pagination.current = page.current
      this.pagination.pageSize = page.pageSize
      this.getSyncAccountList()
    },
    // 刪除
    deletePromotionItem ({ id }) {
      const that = this
      this.$confirm({
        icon: 'exclamation-circle',
        title: (h) => (
          <div>
            <p>确定要删除?</p>
            <p>账户{id}</p>
          </div>
        ),
        onOk () {
          that.$API.deleteAccount(id).then(({ code, data }) => {
            if (code === 0) {
              that.$message.success(data)
              that.getSyncAccountList()
            }
          })
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.title {
  font-size: 12px;
  color: #666;
}
.account-synchronization {
  position: absolute;
  z-index: 999;
  right: 23px;
}
.query {
  margin-top: 4px;
  margin-left: 10px;
}
.newAdd {
  margin-top: 4px;
  float: right;
}
.mt {
  margin-top: 20px;
}
.footer {
  margin-right: 8px;
}
.ml {
  margin-left: 15px;
}
.fw {
  font-weight: bold;
}
</style>