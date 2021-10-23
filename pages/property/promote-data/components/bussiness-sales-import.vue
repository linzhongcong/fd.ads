<!--
 * @Author: your name
 * @Date: 2021-09-18 08:59:17
 * @LastEditTime: 2021-10-15 17:50:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oa-refactor.fandow.come:\my_work\ads.fandow.com\pages\property\promote-data\componemts\sales-export.vue
-->
<template>
  <a-modal v-model="importModal" title="导入数据" :maskClosable="false">
    <a-spin :spinning="spinLoading">
      <a-form-model
        label-align="right"
        layout="inline"
        :rules="rules"
        ref="ImportData"
        :wrapper-col="{ span: 18 }"
        :model="ImportData"
      >
        <a-row>
          <a-col>
            <a-form-model-item
              prop="goods"
              label="商品"
              :label-col="{ span: 6 }"
              style="width:100%"
            >
              <SelectProducts
                style="width:200px;"
                :placeholder="placeholder"
                v-model="goods"
                @change="selectGoodsChange"
              />
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item
              class="margin-t-20"
              prop="files"
              label="选择文件"
              :label-col="{ span: 6 }"
              style="width:100%;"
            >
              <a-upload
                :accept="rules.filesRules"
                :file-list="ImportData.files"
                :before-upload="beforeUpload"
                :remove="handleRemove"
              >
                <a-button>
                  <a-icon type="upload" />
                  上传文件
                </a-button>
                <div style="color:#8d8d8d;" v-if="ImportData.files.length === 0">
                  支持扩展名：.csv .xlsx .xls
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
    <div slot="footer">
      <a-button @click="(handleImportCancel) => (importModal = false)">取消</a-button>
      <a-button type="primary" :loading="spinLoading" @click="handleImportOk">确定</a-button>
    </div>
  </a-modal>
</template>

<script>
  import { notification } from 'ant-design-vue'
  export default {
    data() {
      const validateGoods = (rule, value, callback) => {
        this.ImportData.goodsId ? callback() : callback('请输入商品ID/名称')
      }
      const validateFiles = (rule, value, callback) => {
        value?.length > 0 ? callback() : callback('请选择上传文件')
      }
      return {
        spinLoading: false,
        goods: undefined,
        placeholder: '请输入商品ID/名称',
        rules: {
          filesRules: '.csv,.xlsx,.xls',
        },
        fileList: [],
        headers: null,
        // 导出模态框显隐
        importModal: false,
        ImportData: {
          goodsId: undefined,
          files: [],
        },
        rules: {
          goods: [{ required: true, validator: validateGoods, trigger: 'change' }],
          files: [{ required: true, validator: validateFiles }],
        },
      }
    },
    watch: {
      importModal(val) {
        if (!val) {
          this.$refs['ImportData'].resetFields()
          this.goods = undefined
          this.ImportData.goodsId = undefined
        }
      },
    },
    methods: {
      selectGoodsChange(name, id) {
        this.ImportData.goodsId = id && id.trim()
      },
      beforeUpload(files) {
        const acceptType = ['xls', 'csv', 'xlsx']
        if (files && !acceptType.includes(files.name.split('.')[1])) {
          this.$message.error('只能导入xls、xlsx、csv格式的文件！')
          return false
        }
        this.ImportData.files = [files]
        return false
      },
      handleRemove(file) {
        const index = this.ImportData.files.indexOf(file)
        const newFileList = this.ImportData.files.slice()
        newFileList.splice(index, 1)
        this.ImportData.files = newFileList
      },
      showModal() {
        this.importModal = true
      },
      handleImportOk() {
        this.$refs['ImportData'].validate((valid) => {
          if (valid) {
            this.spinLoading = true
            let form = new FormData()
            form.append('file', this.ImportData.files[0])
            this.$API
              .businessStaffUpload(form, this.ImportData.goodsId)
              .then((res) => {
                if (res.code === 0) {
                  this.$message.success('导入成功！')
                  this.importModal = false
                }
              })
              .finally(() => {
                this.spinLoading = false
              })
          }
        })
      },
    },
  }
</script>

<style scoped>
  .margin-t-20 {
    margin-top: 20px;
  }
  .ant-form-inline .ant-form-item-with-help {
    margin-bottom: 0;
  }
</style>
