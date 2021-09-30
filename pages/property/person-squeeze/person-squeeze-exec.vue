<!--
 * @Author: hjh
 * @Date: 2021-07-19 16:40:16
 * @LastEditTime: 2021-07-22 17:26:49
 * @LastEditors: Please set LastEditors
 * @Description: 个人落地页 - 新建/编辑
 * @FilePath: /ads.fandow.com/pages/property/person-squeeze/person-squeeze-detail.vue
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
        :wrapper-col="{ span: 17, offset: 1 }"
        @submit="handleSubmit"
        autocomplete="off"
      >
        <a-form-item label="落地页名称">
          <a-input
            v-decorator="[
              'landingPageName',
              { rules: [{ required: true, message: '请输入名称' }] },
            ]"
            :max-length="50"
            placeholder="请输入名称"
          />
        </a-form-item>
        <a-form-item label="落地页母链">
          <a-input
            v-decorator="[
              'landingPageParentUrl',
              { rules: [{ required: true, message: '请输入链接' }] },
            ]"
            placeholder="请输入链接"
          />
        </a-form-item>
        <a-form-item label="管理员">
          <a-select
            show-search
            allow-clear
            v-decorator="['manger', { rules: [{ required: true, message: '请输入工号/姓名' }] }]"
            option-label-prop="label"
            @search="(name) => formFuzzySearch(name)"
            @change="(name) => handleUserChange(name)"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option
              v-for="(item, index) in userOptions"
              :value="item.employee"
              :key="item.id"
              :label="item.realName"
            >
              {{ item.employee }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="落地页个人号">
          <a-input
            v-decorator="[
              'personalNumber',
              { rules: [{ required: true, message: '请输入个人号' }] },
            ]"
            :max-length="20"
            placeholder="请输入个人号"
          />
        </a-form-item>
        <a-form-item class="margin-top-40" :wrapper-col="{ span: 8, offset: 5 }">
          <a-button type="primary" html-type="submit">
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
  import { debounce } from '~/utils/utils'
  import { mapMutations, mapState } from 'vuex'
  export default {
    data() {
      this.formFuzzySearch = debounce(this.formFuzzySearch, 500)
      return {
        form: this.$form.createForm(this),
        requestForm: {
          id: null,
          landingPageId: null,
        },
        title: '添加',
        statu: 'create',
        editData: {},
        spinning: false,
        fetching: false,
        userOptions: [],
      }
    },

    computed: {
      ...mapState(['app']),
      visible: {
        get() {
          return this.app.drawerVisible.personSqueezeVisible
        },
      },
    },

    methods: {
      ...mapMutations({ setDrwaerVisible: 'app/setDrwaerVisible' }),

      showDrawer({ title, statu, data }) {
        this.setDrwaerVisible({ visible: true, name: 'personSqueezeVisible' })
        this.title = title
        this.statu = statu
        if (statu === 'edit') this.getDetail(data)
      },

      // 获取详情数据
      getDetail(params) {
        this.spinning = true
        this.$API
          .personalLandingDetail(params.id)
          .then(({ code, data, message }) => {
            if (!code) {
              // 进行form表单赋值
              this.requestForm = { id: data.id, landingPageId: data.landingPageId }
              // 需要按需载入表单所以不需要的删掉
              delete data.id
              delete data.landingPageId
              this.form.setFieldsValue(data)
              return false
            }
            this.$message.warn(message)
          })
          .finally(() => {
            this.spinning = false
          })
      },

      onClose() {
        this.setDrwaerVisible({ visible: false, name: 'personSqueezeVisible' })
        this.form = this.$form.createForm(this)
      },

      // 负责人模糊搜索
      formFuzzySearch(name, idx) {
        this.fetching = true
        this.$API
          .getUsers({ name, perPage: 50 })
          .then(({ code, data: { list } }) => {
            this.fetching = false
            if (code === 0) {
              this.userOptions = list.map((item) => ({
                ...item,
                employee: `${item.realName} / ${item.username}`,
              }))
            }
          })
          .catch(() => (this.fetching = false))
      },

      // 用户模糊搜索发生改变
      handleUserChange(item, idx) {
        if (item === '' || item === undefined) return false
      },

      handleSubmit(e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            this.spinning = true
            for (let val in values) {
              values[val] = values[val].trim()
            }
            // 临时性方法
            values.manger = values.manger.split('/')[0]

            this.submitTypeAPI({ ...values, ...this.requestForm })
              .then(({ code, message }) => {
                if (!code) {
                  this.$message.success(this.statu === 'create' ? '添加成功!' : '更新成功!')
                  this.$emit('execList', null)
                  return false
                }
                this.$message.warn(message)
              })
              .finally(() => {
                this.spinning = false
              })
          }
        })
      },

      submitTypeAPI(params) {
        if (this.statu === 'create') return this.$API.personalLandingPageAdd(params)
        if (this.statu === 'edit') return this.$API.personalLandingPageEdit(params)
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
