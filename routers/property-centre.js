/*
 * @Author: hjh
 * @Date: 2021-07-17 14:34:02
 * @LastEditTime: 2021-10-18 14:53:20
 * @LastEditors: Please set LastEditors
 * @Description: 资产中心模块路由
 * @FilePath: \ads.fandow.com\routers\property-centre.js
 */

export default [
  {
    name: 'property',
    title: '资产中心',
    children: [
      {
        title: '淘客订单数据',
        keepName: '',
        path: '/property/taoke-order/taoke-order-index',
        name: '/property/taoke-order/taoke-order-index',
      },
      {
        title: '生e经数据',
        keepName: '',
        path: '/property/business-experience/business-experience-index',
        name: '/property/business-experience/business-experience-index',
      },
      {
        title: '个人号落地页',
        path: '/property/person-squeeze/person-squeeze-list',
        keepname: '',
        name: '/property/person-squeeze/person-squeeze-list',
      },
      {
        // title: '推广数据',
        title: '抖音',
        path: '/property/promotion-data/promotion-tiktok',
        keepname: '',
        name: '/property/promotion-data/promotion-tiktok',
        /* children: [
          {
            title: '抖音',
            path: '/property/promotion-data/promotion-tiktok',
            keepname: '',
            name: '/property/promotion-data/promotion-tiktok',
          },
        ], */
      },
      {
        title: '快手',
        path: '/property/promotion-data/promotion-kwai',
        keepname: '',
        name: '/property/promotion-data/promotion-kwai',
      },
      {
        title: '微博',
        path: '/property/promotion-data/promotion-weibo',
        keepname: '',
        name: '/property/promotion-data/promotion-weibo',
      },
      {
        title: '阿里UD',
        path: '/property/promotion-data/promotion-aliud',
        keepname: '',
        name: '/property/promotion-data/promotion-aliud',
      },
    ],
  },
]
