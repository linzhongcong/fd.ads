/*
 * @Author: lizheng
 * @Date: 2021-02-19 15:28:25
 * @LastEditTime: 2021-04-05 16:13:35
 * @LastEditors: Please set LastEditors
 * @Description: 报表
 * @FilePath: \ads\routers\statement-router.js
 */
export default [
  {
    name: 'statement',
    title: '报表',
    children: [
      {
        title: '淘客订单数据',
        keepName: '',
        path: '/statement/taoke-order/taoke-order-index',
        name: '/statement/taoke-order/taoke-order-index',
      },
      {
        title: '生e经数据',
        keepName: '',
        path: '/statement/business-experience/business-experience-index',
        name: '/statement/business-experience/business-experience-index',
      },
      {
        title: '账户报表',
        keepName: '',
        path: '/statement/advertising-plan/advertising-plan-index',
        name: '/statement/advertising-plan/advertising-plan-index',
      },
      {
        title: '产品报表',
        keepName: '',
        path: '/statement/production-statment/production-statment-index',
        name: '/statement/production-statment/production-statment-index',
      },
      {
        title: '人员报表',
        keepName: '',
        path: '/statement/person-statement/person-statement-index',
        name: '/statement/person-statement/person-statement-index',
      },
    ],
  },
]
