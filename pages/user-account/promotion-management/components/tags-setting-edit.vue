<!--
 * @Author: lizheng
 * @Date: 2021-04-21 15:51:30
 * @LastEditTime: 2021-04-23 14:28:48
 * @LastEditors: Please set LastEditors
 * @Description: 新增标签或编辑标签
 * @FilePath: \ads\pages\user-account\promotion-management\components\tags-setting-edit.vue
-->

<template>
  <div v-if="visible">
    <a-modal :title="title" :mask-closable="false" v-model="visible">
      <a-form-model ref="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
        <a-form-model-item
          label="标签名称"
          prop="tagName"
          :rules="{ required: true, message: '必填项不能为空', trigger: 'blur' }"
        >
          <a-input allow-clear v-model.trim="form.tagName" />
        </a-form-model-item>

        <a-form-model-item
          label="背景颜色"
          prop="backgroundColor"
          :rules="{ required: true, message: '必填项不能为空', trigger: 'blur' }"
        >
          <div class="color-picker-wrap">
            <ColorPicker v-model="form.backgroundColor" />
          </div>
        </a-form-model-item>

        <a-form-model-item
          label="文字颜色"
          prop="textColor"
          :rules="{ required: true, message: '必填项不能为空', trigger: 'blur' }"
        >
          <div class="color-picker-wrap">
            <ColorPicker v-model="form.textColor" />
          </div>
        </a-form-model-item>

        <a-form-model-item label="样式效果">
          <a-button :style="{ color: form.textColor, backgroundColor: form.backgroundColor }">
            {{ form.tagName }}
          </a-button>
        </a-form-model-item>
      </a-form-model>
      <div slot="footer">
        <a-button @click="onClose">取消</a-button>
        <a-button type="primary" :loading="btnLoading" @click="onSave('form')">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
  import ColorPicker from '~/components/color-picker'

  export default {
    components: { ColorPicker },

    data() {
      return {
        visible: false,
        btnLoading: false,
        title: '',
        form: {},
        opType: '',
      }
    },

    methods: {
      openModal(data) {
        this.opType = data.type
        this.form = data.type === 'edit' ? data.data : {}
        this.visible = true
        this.title = data.title
      },

      onClose() {
        this.visible = false
        this.form = {}
      },

      // 提交数据
      async onSubmit() {
        this.btnLoading = true
        const methods = this.opType == 'add' ? 'postTag' : 'putTag'
        const { code, data } = await this.$API[methods](this.form)
        this.btnLoading = false
        if (code === 0) {
          this.$emit('on-save')
          this.$message.success(data)
          this.onClose()
        }
      },

      // 点击确认按钮的回调函数
      onSave(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.onSubmit()
            this.onClose()
          }
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .color-picker-wrap {
    margin-top: 12px;
    display: flex;
    border: 1px solid #e4e9ed;
    width: 17px;
  }
</style>
