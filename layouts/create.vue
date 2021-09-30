<!--
 * @Author: lizheng
 * @Date: 2021-01-11 08:26:48
 * @LastEditTime: 2021-04-06 14:56:04
 * @LastEditors: Please set LastEditors
 * @Description: 创建广告组页面布局
 * @FilePath: /ads.fandow.com/layouts/default.vue
-->
<style lang="less">
  @import '../assets/css/main.less';
  @import '../assets/css/common.less';
</style>
<template>
  <div class="main">
    <WaterMark :inputText="userInfo.realName" />
    <div class="main-header-con">
      <div class="main-header-con-left">
        <div class="navicon-con"><img src="../assets/images/logo.png" alt="" /></div>
        <div class="menu-con">
          <a-menu
            mode="horizontal"
            v-model="current"
            :key="index"
            v-for="(menu, index) in routers"
            @click="handleMenu($event, menu)"
          >
            <a-menu-item :key="menu.name">{{ menu.title }}</a-menu-item>
          </a-menu>
        </div>
      </div>

      <div class="header-avator-con" style="margin-right:16px">
        <div class="user-dropdown-menu-con">
          <a-row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
            <a-dropdown class="avatar" style="margin-right:10px" transfer :trigger="['hover']">
              <a-avatar
                :src="userInfo.avatar"
                :style="{ background, fontSize: '12px', cursor: 'pointer' }"
              >
                {{ handleDefaultUserName() }}
              </a-avatar>
              <a-menu slot="overlay" @click="handleClickUserDropdown">
                <a-menu-item key="logout"><a href="javascript:;">退出登录</a></a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-row>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div
        v-if="mainMenu.length > 0"
        class="content-menu-slide"
        :class="mainMenu.length > 0 ? 'slide' : ''"
      >
        <a-menu
          mode="inline"
          v-model="leftSelectedKey"
          v-for="(menu, index) in mainMenu"
          :key="'left' + index"
          @click="handleClick($event, menu)"
        >
          <a-menu-item :key="menu.name">
            {{ menu.title }}
          </a-menu-item>
        </a-menu>
      </div>
      <div class="container" :class="mainMenu.length > 0 ? 'slideClass' : ''">
        <a-config-provider :locale="locale">
          <Nuxt ref="viewContent" keep-alive />
        </a-config-provider>
      </div>
    </div>
  </div>
</template>
<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import routers from '~/routers/routers'
  import Cookies from 'js-cookie'
  import WaterMark from '~/components/watermark.vue'
  import { mapMutations, mapState } from 'vuex'

  export default {
    name: 'layout',
    middleware: 'auth',
    components: { WaterMark },

    data() {
      return {
        userInfo: { realName: '' },
        checked: true,
        current: ['promotion'],
        selectedKey: ['/delivery/manage/toutiao'],
        leftSelectedKey: [],
        defaultSelectedKeys: [],
        openKeys: [],
        routers: [], // 主菜单
        mainMenu: [], // 子路由
        menuTitle: 'promotion',
        locale: zhCN,
      }
    },

    computed: {
      ...mapState(['app']),
    },

    created() {
      this.handleGetRandomColor()
      this.routers = routers
    },

    mounted() {
      this.initMenu()
    },

    methods: {
      ...mapMutations({
        setDrwaerVisible: 'app/setDrwaerVisible',
      }),

      // 初始化菜单
      initMenu() {
        const realName = Cookies.get('realName') || ''
        this.userInfo.realName = realName
      },

      // 左侧菜单
      handleClick(e, menu) {
        this.$router.push(menu.name)
        this.leftSelectedKey = menu.children
      },

      // 顶部菜单
      handleMenu(e, menu) {
        this.current = [e.key]
        this.mainMenu = []
        this.routers.forEach((item) => item.name === e.key && (this.mainMenu = item))
        const routerPath = menu.children[0] ? menu.children[0].path : ''
        const path = menu.children.length > 0 ? routerPath : menu.path
        this.$router.push({ path, query: { layout: 'create' } })
        this.leftSelectedKey = [routerPath]
        Cookies.set('handleMenu', menu.children)
        sessionStorage.setItem('currentMenu', JSON.stringify(this.mainMenu))
      },

      // 用户头像处理
      handleDefaultUserName() {
        const arr = this.userInfo.realName.split('')
        return `${arr[arr.length - 2]}${arr[arr.length - 1]}`
      },

      handleGetRandomNum(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min //含最大值，含最小值
      },

      // 获取随机颜色
      handleGetRandomColor() {
        const bgColorArr = [
          '#619FE7',
          '#3885EA',
          '#F2B583',
          '#F29797',
          '#CED182',
          '#F4D05A',
          '#C48BD0',
        ]
        const idx = this.handleGetRandomNum(0, 6)
        this.background = bgColorArr[idx]
      },

      // 顶部右上角，用户退出登录
      handleClickUserDropdown({ key }) {
        if (key === 'ownSpace') {
          this.$router.push({ key: 'ownspace_index' })
        } else if (key === 'logout') {
          // 退出登录
          this.$API.logout().then(({ code, data }) => {
            if (code === 0) {
              this.$message.success(data, 1.5)
              this.$router.push({ path: '/login' })
              Cookies.remove('authorization')
              Cookies.remove('userData')
              Cookies.remove('realName')
            } else setTimeout(() => this.$router.push('/login'), 2000)
          })
        }
      },
    },
  }
</script>

<style lang="less">
  @import '~/assets/css/layout.less';
</style>
