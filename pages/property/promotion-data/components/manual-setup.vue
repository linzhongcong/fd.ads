<!--
 * @Author: xieguiting
 * @Date: 2021-09-17 10:20:14
 * @LastEditTime: 2021-09-17 10:42:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads.fandow.com\pages\property\promotion-data\manual-set.vue
-->
<template>
  <a-drawer :width="660" :closable="false" :mask="false" :visible="visible" @close="onClose">
    <header slot="title">
      <a-icon type="close" :size="20" class="icon-cursor close-icon" @click="onClose" />
      <span style="margin-left: 10px;">{{ title }}</span>
    </header>
    <a-spin :spinning="spinning">
      <a-form
        :form="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 17 }"
        @submit="handleSubmit"
        autocomplete="off"
      >
        <a-form-item label="计划id">
          {{ form.adId }}
        </a-form-item>
        <a-form-item label="商品">
          <SelectProducts 
            v-model.trim="form.productName"
            @change="(...val) => onSelectChange(val, 'productId')" 
          />
        </a-form-item>
        <a-form-item label="投放人员">
          <SelectUsers 
            v-model.trim="form.realName"
            @change="(...val) => onSelectChange(val, 'username')" 
          />
        </a-form-item>
        <a-form-item class="margin-top-40" :wrapper-col="{  offset: 4 }">
          <a-button type="primary" html-type="submit" :loading="btnLoading">
            提交
          </a-button>
          <a-button class="margin-left-10" type="default" @click="onClose">
            取消
          </a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-drawer>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  export default {
    data() {
      return {
        btnLoading: false,
        form: {},
        title: '计划设置',
        spinning: false,
      }
    },

    computed: {
      ...mapState(['app']),
      visible: {
        get() {
          return this.app.drawerVisible.manualSetupVisible
        },
      },
    },

    methods: {
      ...mapMutations({ setDrwaerVisible: 'app/setDrwaerVisible' }),
      showDrawer({ title, data }) {
        this.setDrwaerVisible({ visible: true, name: 'manualSetupVisible' })
        this.title = title
        this.form = data
      },
      onClose() {
        this.setDrwaerVisible({ visible: false, name: 'manualSetupVisible' })
        this.form = {}
      },
      // 下拉选择
      onSelectChange(val, type) {
        this.form[type] = val[1];
      },
      // 提交
      handleSubmit(e) {
        e.preventDefault()
        let { id, productId, productName, username, realName } = this.form
        let params = { id, productId, productName, username, realName }
        this.btnLoading = true
        this.$API.extendDouyinSetting(params).then(res=> {
          console.log(res);
          if (res.code === 0) {
            this.$message.success('提交成功')
            this.$emit('onSave', 'init')
            this.onClose()
          }
        }).finally(() => this.btnLoading = false)
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~/assets/css/close.less';
  .margin-top-40 {
    margin-top: 40px;
  }
</style>
