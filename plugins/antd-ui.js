/*
 * @Author: lizheng
 * @Date: 2021-01-11 17:05:47
 * @LastEditTime: 2021-04-21 11:40:38
 * @LastEditors: Please set LastEditors
 * @Description: AntDesignVue组件库以及全局组件挂载
 * @FilePath: \ads\plugins\antd-ui.js
 */
import Vue from 'vue'
import Antd from 'ant-design-vue'
import VueDraggableResizable from 'vue-draggable-resizable'
import Loading from '../components/loading.vue'
import SelectUsers from '../components/select-users.vue'
import SelectProducts from '../components/select-products.vue'
import SelectSites from '../components/select-sites.vue'
import { debounce } from '~/utils/utils'

import '../assets/css/resize.less'

import moment from 'moment'

Vue.use(Antd)
Vue.component('vue-draggable-resizable', VueDraggableResizable) // 表头可拖拽
Vue.component('Loading', Loading) // 全局Loading组件
Vue.component('SelectUsers', SelectUsers) // 全局员工模糊搜索组件
Vue.component('SelectProducts', SelectProducts) // 全局商品/产品模糊搜索组件
Vue.component('SelectSites', SelectSites) //全局推广位模糊搜索组件

Vue.prototype.moment = moment
Vue.prototype.$debounce = debounce
