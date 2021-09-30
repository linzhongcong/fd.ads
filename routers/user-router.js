/*
 * @Author: huangjianhan
 * @Date: 2021年1月12日17:21:18
 * @LastEditTime: 2021-03-03 17:10:00
 * @Description: 账户模块路由
 * @FilePath: \routers\user-router.js
 */

export default [
  {
    name: 'acount',
    title: '账户管理',
    children: [
      {
        title: '广告投放账号',
        path: '/user-account/advertising-account/advertising-index',
        keepName: '',
        name: '/user-account/advertising-account/advertising-index',
      },
      {
        title: '用户账号',
        path: '/user-account/user-management/user-index',
        keepName: '',
        name: '/user-account/user-management/user-index',
      },
      {
        title: '产品',
        path: '/user-account/product-management/product-index',
        keepName: '',
        name: '/user-account/product-management/product-index',
      },
      {
        title: '推广位',
        path: '/user-account/promotion-management/promotion-position-index',
        keepName: '',
        name: '/user-account/promotion-management/promotion-position-index',
      },
    ],
  },
]
