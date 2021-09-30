/*
 * @Author: hjh
 * @Date: 2021-07-17 14:34:02
 * @LastEditTime: 2021-07-23 11:11:55
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
        title: '个人号落地页',
        path: '/property/person-squeeze/person-squeeze-list',
        keepname: '',
        name: '/property/person-squeeze/person-squeeze-list',
      },
    ],
  },
]
