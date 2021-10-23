<!--
 * @Author: your name
 * @Date: 2021-09-18 08:59:17
 * @LastEditTime: 2021-10-15 17:50:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oa-refactor.fandow.come:\my_work\ads.fandow.com\pages\property\promote-data\componemts\sales-export.vue
-->
<template>
  <a-modal v-model="createModal" title="快速创建" :maskClosable="false">
    <a-spin :spinning="spining">
      <a-form-model
        label-align="right"
        layout="inline"
        :rules="rules"
        ref="createData"
        :wrapper-col="{ span: 18 }"
        :model="createData"
      >
        <a-row>
          <a-col>
            <a-form-model-item
              prop="goodsName"
              label="商品"
              :label-col="{ span: 6 }"
              style="width:100%"
            >
              <SelectProducts
                style="width:200px;"
                :placeholder="placeholder"
                v-model="goodsName"
                @change="selectGoodsChange"
              />
            </a-form-model-item>
          </a-col>
          <a-col>
            <a-form-model-item
              class="margin-t-20"
              prop="dataAt"
              label="日期"
              :label-col="{ span: 6 }"
              style="width:100%;"
            >
              <a-date-picker
                placeholder="请选择日期"
                format="YYYY-MM-DD"
                type="date"
                v-model="dataAt"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <div style="color:#8d8d8d;text-align:center;">
            确定后，将创建该日期下的商品数据，并统一初始化为0
          </div>
        </a-row>
      </a-form-model>
    </a-spin>
    <div slot="footer">
      <a-button @click="() => (createModal = false)">取消</a-button>
      <a-button type="primary" :loading="spining" @click="handleCreateOk">确定</a-button>
    </div>
  </a-modal>
</template>

<script>
  export default {
    data() {
      const validateGoods = (rule, value, callback) => {
        this.createData.goodsId ? callback() : callback('请输入商品ID/名称')
      }
      const validateDate = (rule, value, callback) => {
        this.dataAt ? callback() : callback('请选择日期')
      }
      return {
        spining: false,
        goodsName: '',
        placeholder: '请输入商品ID/名称',
        dataAt: this.moment(new Date(), 'YYYY.MM.DD'),
        fileList: [],
        headers: null,
        // 导出模态框显隐
        createModal: false,
        createData: {
          goodsId: '',
        },
        rules: {
          goodsName: [{ required: true, validator: validateGoods, trigger: 'change' }],
          dataAt: [{ required: true, validator: validateDate, trigger: 'change' }],
        },
      }
    },

    watch: {
      // 弹框显示时，日期要有默认值
      createModal(val) {
        if (val) {
          this.dataAt = this.moment(new Date(), 'YYYY.MM.DD')
        } else {
          this.spining = false
          this.$refs['createData'].resetFields()
          this.createData.goodsId = undefined
          this.goodsName = undefined
        }
      },
    },

    methods: {
      selectGoodsChange(name, id) {
        this.createData.goodsId = id && Number(id.trim())
      },

      showModal() {
        this.createModal = true
      },

      handleCreateOk() {
        this.$refs['createData'].validate((valid) => {
          if (valid) {
            this.spining = true
            let params = {
              dataAt: this.dataAt.format('YYYY-MM-DD'),
              goodsId: this.createData.goodsId,
            }
            this.$API
              .businessStaffCreate(params)
              .then((res) => {
                if (res.code === 0) {
                  this.$message.success('创建成功')
                  this.createModal = false
                }
              })
              .finally(() => {
                this.spining = false
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
