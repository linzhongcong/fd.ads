<style lang="less">
  @import '~/assets/css/login.less';
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <a-card :bordered="false">
        <div class="header">
          <img src="~/assets/images/logo.png" class="logo" />
        </div>
        <div class="welcome">
          <div class="subtitle">使用你的OA账号授权登录</div>
        </div>
        <div class="body form-con">
          <a-form-model allowClear ref="loginForm" :model="form" :rules="rules">
            <!-- 欺骗浏览器自动填充 -->
            <input type="text" style="width: 0; height:0; position:absolute; z-index: -1;" />
            <input type="password" style="width:0; height:0; position:absolute; z-index:-1;" />
            <!-- 欺骗浏览器自动填充 -->
            <a-form-model-item prop="username" label="工号">
              <a-input v-model="form.username" placeholder="请输入工号"></a-input>
            </a-form-model-item>
            <a-form-model-item prop="password" label="密码">
              <a-input v-model="form.password" type="password" placeholder="请输入密码"></a-input>
            </a-form-model-item>
            <a-form-model-item prop="captcha" v-if="showCaptcha" label="验证码">
              <div class="form-check">
                <a-input v-model="form.captcha" placeholder="请输入验证码" />
                <a-button
                  :class="['check-num', !canGetCaptcha ? 'disabled-captcha' : '']"
                  @click="getCaptcha"
                  :disabled="!canGetCaptcha"
                >
                  获取验证码
                </a-button>
              </div>
            </a-form-model-item>
            <a-form-model-item>
              <a-button
                block
                class="promise"
                type="primary"
                :loading="loading"
                @click="handleSubmit"
              >
                授权并登录
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </div>
        <div class="footer-tip">
          <img class="img" src="../assets/images/chrome-logo.png" alt="" />
          <span class="tip">推荐使用Chrome浏览器，以更好地兼容本产品</span>
        </div>
      </a-card>
    </div>
    <div class="copy-right">copyright &copy; 2010-{{ newYear }} Fandow. All Rights Reserved</div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  export default {
    layout: 'full',
    data() {
      return {
        loading: false,
        loginIn: true,
        showCaptcha: false,
        canGetCaptcha: true,
        form: {},
        rules: {
          username: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
          password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
          captcha: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
        },
        grant_type: 'password',
        newYear: '',
      }
    },
    watch: {
      ['form.username']() {
        if (this.showCaptcha) {
          this.showCaptcha = false
          this.form.captcha = ''
        }
      },
    },
    destroyed() {
      this.timer && clearInterval(this.timer)
    },
    created() {
      this.getYear()
    },
    methods: {
      // 获取最新年份
      getYear() {
        let year = new Date()
        this.newYear = year.getFullYear()
      },

      // 获取验证码
      getCaptcha() {
        this.canGetCaptcha = false
        let firstTime = Date.now()
        this.timer = setInterval(() => {
          let diff = Date.now() - firstTime
          if (diff >= 300000) {
            // 验证码5分钟失效
            this.canGetCaptcha = true
            clearInterval(this.timer)
          }
        }, 1000)
        this.$API.getCaptcha(this.form.username).then((res) => {
          if (res.code !== 0) return
          this.$message.success(res.data)
        })
      },

      handleSubmit() {
        this.$refs.loginForm.validate((valid) => {
          console.log('this.login', this.loginIn)
          if (valid && this.loginIn) {
            this.loading = true
            this.loginIn = false

            const LoginForm = {}
            LoginForm.username = this.form.username
            LoginForm.password = this.form.password
            LoginForm.captcha = this.form.captcha
            this.$API
              .login(LoginForm)
              .then((res) => {
                if (res.code === 0) {
                  Cookies.set('authorization', res.data.accessToken, { expires: 1 })
                  this.$API.getUserInfo().then((res) => {
                    if (res.code == 0) {
                      Cookies.set('userData', res.data, { expires: 1 })
                      Cookies.set('realName', res.data.realName, { expires: 1 })
                      Cookies.set('username', res.data.username, { expires: 1 })
                      this.$message.success('登录成功!', 1.5)
                      this.$store.commit('app/clearAllTags')
                      this.$router.push({ path: '/' })
                      this.loginIn = true
                    }
                  })
                } else if (res.code === 40000) {
                  // 需要验证码
                  this.showCaptcha = true
                  this.loginIn = true
                } else {
                  this.loading = false
                  this.loginIn = true
                }
              })
              .catch((err) => {
                this.loginIn = true
              })
              .finally(() => {
                this.loading = false
              })
          }
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .footer-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 400px;
    overflow: hidden;
    padding: 0 20px;
    margin-bottom: -20px;

    .img {
      width: 20px;
      height: 20px;
      margin-left: 10px;
      border-style: none;
      box-sizing: border-box;
    }

    .tip {
      height: 100%;
      font-size: 12px;
      margin-left: 10px;
      color: #777;
    }
  }
</style>
