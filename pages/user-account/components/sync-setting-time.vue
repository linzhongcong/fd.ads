<!--
 * @Author: lizheng
 * @Date: 2021-04-15 16:12:44
 * @LastEditTime: 2021-04-16 15:51:25
 * @LastEditors: Please set LastEditors
 * @Description: 同步时间
 * @FilePath: \ads\pages\user-account\components\sync-setting-time.vue
-->
<template>
  <div v-if="visible">
    <a-modal title="选择同步时间" v-model="visible">
      <a-form-model ref="form" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item
          label="起止时间"
          prop="time"
          :rules="{ required: true, message: '必填项不能为空', trigger: 'change' }"
        >
          <a-range-picker separator="~" v-model="form.time" @change="onChange">
            <!-- :disabledDate="(cur) => cur && cur < moment().subtract(1, 'days')" -->
            <a-icon slot="suffixIcon" type="calendar" />
          </a-range-picker>
        </a-form-model-item>
      </a-form-model>
      <div slot="footer">
        <a-button @click="closeModel">取消</a-button>
        <a-button type="primary" :loading="loading" @click="onSave('form')">
          确定
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        adId: [],
        visible: false,
        loading: false,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        form: {},
      }
    },

    methods: {
      openModal(data) {
        console.log('data', data)
        const isObject = Object.prototype.toString.call(data) === '[object Object]'
        this.adId = isObject ? [data.advertiserId] : data
        this.visible = true
      },

      closeModel() {
        this.visible = false
        this.loading = false
        this.form = {}
      },

      onChange(date, dataStr) {
        this.form.timeStart = dataStr[0]
        this.form.timeEnd = dataStr[1]
      },

      onSave(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            const params = {
              advertiserIdList: this.adId,
              timeStart: this.form.timeStart,
              timeEnd: this.form.timeEnd,
            }
            this.loading = true
            this.$API.postAccountSyncStatus(params).then(({ code, data }) => {
              this.loading = false
              if (code === 0) {
                this.$message.success(data)
                this.$emit('onSave', code)
                this.closeModel()
              }
            })
          }
        })
      },
    },
  }
</script>

<style lang="less" scoped></style>
