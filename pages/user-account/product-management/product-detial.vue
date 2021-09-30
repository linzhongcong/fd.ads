<!--
 * @Author:lizheng
 * @Date: 2021-02-18 09:41:44
 * @LastEditTime: 2021-04-06 14:54:46
 * @LastEditors: Please set LastEditors
 * @Description: 商品详情
 * @FilePath: \ads\pages\user-account\promotion-management\promotion-position-detial.vue
-->
<template>
  <div>
    <a-drawer
      :width="600"
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
          label="商品ID"
          prop="productId"
          :rules="[{ required: true, message: '必填项不能为空', trigger: 'blur' }]"
        >
          <a-input v-model="form.productId" allow-clear placeholder="请输入商品ID" />
        </a-form-model-item>

        <a-form-model-item
          label="商品名称"
          prop="productName"
          :rules="[{ required: true, message: '必填项不能为空', trigger: 'blur' }]"
        >
          <a-input v-model="form.productName" allow-clear placeholder="请输入商品名称"></a-input>
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

  export default {
    data() {
      return {
        form: {},
        loading: false,
        btnLoading: false,
        title: '',
        opType: '',
        id: '',
      }
    },

    computed: {
      ...mapState(['app']),
      visible: {
        get() {
          return this.app.drawerVisible.productDetailView
        },
      },
    },

    methods: {
      ...mapMutations({ setDrwaerVisible: 'app/setDrwaerVisible' }),

      // 打开抽屉初始化数据
      showDrawer(data) {
        this.setDrwaerVisible({ name: 'productDetailView', visible: true })
        this.title = data.title
        this.opType = data.opType
        this.id = data.opType === 'edit' ? data.record.id : ''
        data.opType === 'edit' ? this.getDetailData() : (this.form = {})
      },

      // 提交表单
      onSubmit(name) {
        const params = this.form
        const methodName = this.opType === 'add' ? 'postProduct' : 'putProduct'

        this.btnLoading = true
        this.$refs[name].validate((valid) => {
          if (valid) {
            delete params.key
            this.$API[methodName](params)
              .then(({ code, data }) => {
                this.btnLoading = false
                if (code === 0) {
                  this.setDrwaerVisible({ name: 'productDetailView', visible: false })
                  this.$message.success(data)
                  this.$emit('confirm')
                }
              })
              .catch(() => {
                this.btnLoading = false
              })
          } else {
            this.btnLoading = false
          }
        })
      },

      onClose() {
        this.setDrwaerVisible({ name: 'productDetailView', visible: false })
        this.form = {}
      },

      // 编辑情况下获取数据详情
      getDetailData() {
        this.loading = true
        this.id &&
          this.$API
            .getProductDetail(this.id)
            .then(({ code, data }) => {
              this.loading = false
              if (code === 0) {
                this.form = data
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
</style>

<style lang="less" scoped>
  @import '~/assets/css/close.less';
</style>
