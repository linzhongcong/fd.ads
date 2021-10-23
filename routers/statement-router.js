/*
 * @Author: lizheng
 * @Date: 2021-02-19 15:28:25
 * @LastEditTime: 2021-10-18 14:49:35
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
        title: '账户报表',
        keepName: '',
        path: '/statement/advertising-plan/advertising-plan-index',
        name: '/statement/advertising-plan/advertising-plan-index',
      },
      {
        title: '广告实时报表',
        keepName: '',
        path: '/statement/advertising-time/advertising-time-index',
        name: '/statement/advertising-time/advertising-time-index',
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
