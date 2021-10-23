<!--
 * @Author: lizheng
 * @Date: 2021-03-25 16:01:31
 * @LastEditTime: 2021-03-25 19:05:08
 * @LastEditors: Please set LastEditors
 * @Description: 生e经模块导入
 * @FilePath: \ads\pages\statement\business-experience\business-experience-import.vue
-->

<template>
  <div>
    <a-modal :width="700" v-model="visible" :mask-closable="false" title="导入">
      <a-form-model
        ref="businessForm"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          prop="productId"
          :rules="{ required: true, message: '必填项不能为空', trigger: 'change' }"
          label="商品"
        >
          <a-select
            show-search
            allow-clear
            placeholder="请输入商品ID/名称"
            option-label-prop="label"
            v-model="form.productId"
            @search="productionFuzzySearch"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option
              v-for="list in productOptions"
              :value="list.productId"
              :key="list.productId"
              :label="list.productName"
            >
              {{ list.product }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item
          prop="file"
          label="商品"
          :rules="{ required: true, message: '必填项不能为空', type: 'array', trigger: 'change' }"
        >
          <a-upload
            :file-list="form.file"
            :before-upload="handleBeforeUpload"
            :remove="handleRemove"
          >
            <a-button icon="upload" style="width:120px">导入</a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>

      <div slot="footer">
        <a-button @click="closeModal">取消</a-button>
        <a-button :loading="btnLoading" type="primary" @click="onSave">确认</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import { debounce } from '~/utils/utils'

  export default {
    data() {
      this.productionFuzzySearch = debounce(this.productionFuzzySearch, 500)

      return {
        visible: false,
        labelCol: { span: 3 },
        wrapperCol: { span: 21 },
        productOptions: [],
        fetching: false,
        uploadLoading: false,
        btnLoading: false,
        form: { productId: undefined, file: [] },
      }
    },

    methods: {
      openModal() {
        this.visible = true
        this.form = { productId: undefined, file: [] }
      },

      closeModal() {
        this.visible = false
        this.uploadLoading = false
        this.btnLoading = false
        this.form.productId = undefined
        this.form.file = []
      },

      handleRemove(file) {
        const index = this.form.file.indexOf(file)
        const newFileList = this.form.file.slice()
        newFileList.splice(index, 1)
        this.form.file = newFileList
      },

      // 上传文件之前进行格式检验
      handleBeforeUpload(file) {
        const acceptType = ['xls', 'csv', 'xlsx']
        if (file && !acceptType.includes(file.name.split('.')[1])) {
          this.$message.error('只能导入xls、xlsx、csv格式的文件！')
          return false
        }
        this.form.file = [file]
        return false
      },

      // 导入数据
      handleImportUploadClick() {
        const formData = new FormData()
        formData.append('file', this.form.file[0])
        this.btnLoading = true
        this.$API
          .postBusinessStatementImport(this.form.productId, formData)
          .then(({ code }) => {
            this.btnLoading = false
            if (code === 0) {
              this.$emit('onSave')
              this.closeModal()
            }
          })
          .catch(() => {
            this.btnLoading = false
          })
      },

      // 商品模糊搜索
      productionFuzzySearch(name) {
        if (name === '' || !name.trim()) return (this.productOptions = [])
        this.fetching = true
        this.$API
          .getProductList(name)
          .then(({ code, data }) => {
            this.fetching = false
            if (code === 0) this.productOptions = data
          })
          .catch(() => (this.fetching = false))
      },

      onSave() {
        this.$refs['businessForm'].validate((vaild) => {
          vaild && this.handleImportUploadClick()
        })
      },
    },
  }
</script>
<style lang="less" scoped></style>
