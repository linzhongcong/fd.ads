<!--
 * @Author: lizheng
 * @Date: 2021-02-18 09:41:44
 * @LastEditTime: 2021-04-23 17:02:17
 * @LastEditors: Please set LastEditors
 * @Description: 推广位
 * @FilePath: \ads\pages\user-account\promotion-management\promotion-position-detial.vue
-->
<template>
  <div>
    <a-drawer
      :width="580"
      :mask="false"
      :closable="false"
      :destroyOnClose="true"
      :visible="visible"
      @close="onClose"
    >
      <header slot="title">
        <a-icon type="close" :size="20" class="icon-cursor close-icon" @click="onClose" />
        <span style="margin-left:10px">{{ title }}</span>
      </header>
      <a-form-model ref="form" :model="form" :labelCol="{ span: 4 }" :wrapperCol="{ span: 16 }">
        <a-form-model-item
          label="推广位ID"
          prop="promoterId"
          :rules="[{ required: true, message: '必填项不能为空', trigger: 'blur' }]"
        >
          <a-input v-model="form.promoterId" allow-clear placeholder="请输入推广位ID" />
        </a-form-model-item>

        <a-form-model-item
          label="推广位名称"
          prop="promoterName"
          :rules="[{ required: true, message: '必填项不能为空', trigger: 'blur' }]"
        >
          <a-input v-model="form.promoterName" allow-clear placeholder="请输入推广位名称" />
        </a-form-model-item>

        <a-form-model-item label="推广位标签">
          <a-select
            show-search
            mode="multiple"
            style="width: 100%"
            placeholder="请选择推广位标签"
            class="select-tag"
            v-model="tagId"
            @search="getTagData"
            @change="handleChangeTags"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option
              v-for="(item, idx) in options"
              :key="`${item.id}-${idx}`"
              :value="item.tagName"
            >
              <div
                :style="{
                  padding: '0 5px',
                  backgroundColor: item.backgroundColor,
                  color: item.textColor,
                }"
              >
                {{ item.tagName }}
              </div>
            </a-select-option>
          </a-select>
          <span>已选标签（{{ tagId.length }}/10）</span>
        </a-form-model-item>

        <a-form-model-item
          prop="remark"
          label="备注"
          :rules="[
            {
              required: false,
              message: '最多只能输入50个字符',
              max: 50,
              trigger: ['blur', 'change'],
            },
          ]"
        >
          <a-textarea
            v-model="form.remark"
            :auto-size="{ minRows: 2 }"
            allow-clear
            placeholder="请填写备注"
          />
        </a-form-model-item>

        <a-row>
          <a-form-model-item label=" " :colon="false">
            <a-button type="primary" @click="onSubmit('form')" :loading="btnLoading">
              提交
            </a-button>
            <a-button :style="{ marginLeft: '8px' }" @click="onClose">
              取消
            </a-button>
          </a-form-model-item>
        </a-row>
      </a-form-model>
      <!-- 加载样式 -->
      <a-spin
        class="loading-wrap"
        :spinning="loading"
        :style="{ display: loading ? 'flex' : 'none' }"
      />
    </a-drawer>
  </div>
</template>
<script>
  import { mapMutations, mapState } from 'vuex'
  import { unique } from '~/utils/utils'

  export default {
    data() {
      return {
        form: { promoterId: '', tagId: [] },
        loading: false,
        btnLoading: false,
        title: '',
        opType: '',
        id: '',

        // 标签模糊搜索选项
        fetching: false,
        tagId: [],
        options: [],
      }
    },

    computed: {
      ...mapState(['app']),
      visible: {
        get() {
          return this.app.drawerVisible.promotionView
        },
      },
    },

    methods: {
      ...mapMutations({ setDrwaerVisible: 'app/setDrwaerVisible' }),

      // 打开抽屉初始化数据
      showDrawer(data) {
        this.getTagData()
        this.setDrwaerVisible({ name: 'promotionView', visible: true })
        this.title = data.title
        this.opType = data.opType
        this.tagId = []
        this.id = data.opType === 'edit' ? data.record.id : ''
        data.opType === 'edit' ? this.getDetailData() : (this.form = {})
      },

      handleChangeTags(value) {
        if (value && value.length > 10) {
          this.tagId.pop()
          this.$message.warning('最多只能选择10个标签！')
        }
      },

      // 提交表单
      onSubmit(name) {
        const params = this.form
        const methodName = this.opType === 'add' ? 'postPromoter' : 'putPromoter'

        // 处理标签ID
        const oldId = this.form.tagId || []
        const idArr = this.options
          .map(({ id, tagName }) => (this.tagId.includes(tagName) ? id : null))
          .filter((item) => item)
        this.form.tagId = unique([...oldId, ...idArr])

        this.btnLoading = true
        this.$refs[name].validate((valid) => {
          if (valid) {
            delete params.key
            delete params.tagList
            this.$API[methodName](params)
              .then(({ code, data }) => {
                this.btnLoading = false
                if (code === 0) {
                  this.onClose()
                  this.$message.success(data)
                  this.$emit('confirm')
                }
              })
              .catch(() => {
                this.btnLoading = false
              })
          } else this.btnLoading = false
        })
      },

      onClose() {
        this.setDrwaerVisible({ name: 'promotionView', visible: false })
        this.form = {}
      },

      // 获取标签数据
      async getTagData(tagName) {
        this.fetching = true
        this.options = []
        const { code, data } = await this.$API.getTag({ tagName, pageSize: 100 })
        code === 0 && (this.options = data.list)
        this.fetching = false
      },

      // 编辑情况下获取数据详情
      getDetailData() {
        this.loading = true
        this.id &&
          this.$API
            .getPromoterDetail(this.id)
            .then(({ code, data }) => {
              this.loading = false
              if (code === 0) {
                this.form = data
                this.options = data.tagList
                this.tagId = data.tagList.map(({ tagName }) => tagName)
              }
            })
            .catch(() => {
              this.loading = false
            })
      },
    },
  }
</script>

<style lang="less" scoped>
  .loading-wrap {
    display: flex;
    justify-content: center;
    padding-top: 50%;
    position: absolute;
    z-index: 111;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: hsla(0, 0%, 100%, 0.9);
  }

  .select-tag /deep/ .ant-select-selection__choice {
    padding-left: 0;
  }
</style>

<style lang="less" scoped>
  @import '~/assets/css/close.less';
</style>
