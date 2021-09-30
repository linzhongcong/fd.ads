/*
 * @Author: 黄建瀚
 * @Date: 2021-02-25 14:54:43
 * @LastEditTime: 2021-04-23 14:56:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads.fandow.com\api\statement\advertising-api.js
 */
import fetch from '../fetch'

// 报表 - 淘客订单数据 - 分页列表查询
const getReportAdvertiser = (params) => {
  return fetch({
    url: '/report/advertiser',
    method: 'GET',
    params,
  })
}

// Excel报表导出
const adExcelExport = (params) => {
  return fetch({
    url: '/report/advertiser/excel/export',
    method: 'GET',
    params,
  })
}

// 报表 - 账户报表 - 产品 / 负责人数据
const adConditionList = (params) => {
  return fetch({
    url: '/report/advertiser/condition/list',
    method: 'GET',
    params,
  })
}

// 报表 - 淘客订单数据 - 广告账户ID模糊查询
const getReportAdvertiserSearch = (advertiser) => {
  return fetch({
    url: `/advertiser/list/${advertiser}`,
    method: 'GET',
  })
}

// 账户报表 - 获取统计数据
const userGetCountData = (params) => {
  return fetch({
    url: '/report/advertiser/total',
    method: 'GET',
    params: params,
  })
}

// 订单数据 - 付款金额合计查询
const computerTotalPrice = (params) => {
  return fetch({
    url: '/tbk/order/total-price',
    method: 'GET',
    params: params,
  })
}

// 推广位数据模块 - 分页列表查询
const getStatementPromoter = (params) => {
  return fetch({
    url: '/tbk/order/promoter',
    method: 'GET',
    params: params,
  })
}

// 推广位数据模块-数据汇总
const statementPromoterTotal = (params) => {
  return fetch({
    url: '/tbk/order/promoter/total',
    method: 'GET',
    params: params,
  })
}

export default {
  getReportAdvertiser,
  adExcelExport,
  adConditionList,
  getReportAdvertiserSearch,
  userGetCountData,
  computerTotalPrice,
  getStatementPromoter,
  statementPromoterTotal,
}
