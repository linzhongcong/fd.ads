/*
 * @Author: lizheng
 * @Date: 2021-02-20 10:14:28
 * @LastEditTime: 2021-04-28 13:09:24
 * @LastEditors: Please set LastEditors
 * @Description: 报表模块接口
 * @FilePath: \ads\api\statement\statement-api.js
 */

import fetch from '../fetch'

// 报表 - 淘客订单数据 - 分页列表查询
const getStatementOrderList = (params) => {
  return fetch({
    url: '/tbk/order',
    method: 'GET',
    params,
  })
}

// 报表 - 淘客订单数据 - 详情
const getStatementOrderDetail = (tradeId) => {
  return fetch({
    url: `/tbk/order/${tradeId}`,
    method: 'GET',
  })
}

// 报表 - 淘客订单数据 - 导入
const postStatementOrderImport = (data) => {
  return fetch({
    url: '/tbk/order/excel/import',
    method: 'POST',
    data,
  })
}

// 报表 - 淘客订单数据 - 导出
const postStatementOrderExport = () => {
  return fetch({
    url: '/tbk/order/excel/export',
    method: 'GET',
    headers: {
      responseType: 'blob',
    },
  })
}

// 报表 - 产品报表 - 分页列表查询
const getProductStatement = (params) => {
  return fetch({
    url: '/report/product',
    method: 'GET',
    params,
  })
}

// 报表 - 产品报表 - 汇总统计
const getProductStatementSummary = (params) => {
  return fetch({
    url: '/report/product/collect',
    method: 'GET',
    params,
  })
}

// 报表 - 产品报表 - 人员累计
const getProductStatementPerson = (params) => {
  return fetch({
    url: '/report/product/person',
    method: 'GET',
    params,
  })
}

// 报表 - 产品报表 - 获取折线图数据
const getProductStatementPie = (params) => {
  return fetch({
    url: '/report/product/map',
    method: 'GET',
    params,
  })
}

// 报表 - 生e经数据报表 - 分页查询
const getBusinessStatement = (params) => {
  return fetch({
    url: '/sej/order',
    method: 'GET',
    params,
  })
}

// 报表 - 生e经数据报表 - 总计
const getBusinessStatementTotal = (params) => {
  return fetch({
    url: '/sej/order/sell-total',
    method: 'GET',
    params,
  })
}

// 报表 - 生e经数据报表 - 导入
const postBusinessStatementImport = (productId, data) => {
  return fetch({
    url: `/sej/order/excel/import/${productId}`,
    method: 'POST',
    data,
  })
}

// 报表 - 人员报表
const reportPerson = (params) => {
  return fetch({
    url: '/report/person',
    method: 'GET',
    params: params,
  })
}

// 报表 - 人员报表 - 详情
const reportPersonDetail = (params) => {
  return fetch({
    url: '/report/person/detail/product',
    method: 'GET',
    params: params,
  })
}

// 报表 - 人员报表 - 明细
const reportPersonBigPutAd = (params) => {
  return fetch({
    url: '/report/person/detail/big-put-ad',
    method: 'GET',
    params: params,
  })
}

// 推广位数据模块-推广位透视图
const tbkPromoterMap = (params) => {
  return fetch({
    url: '/tbk/order/promoter/map',
    method: 'GET',
    params: params,
  })
}

//推广位数据模块-推广位集合查询
const tbkPromoterList = (adzoneName) => {
  return fetch({
    url: `/tbk/order/promoter/list/${adzoneName}`,
    method: 'GET',
  })
}

export default {
  getStatementOrderList,
  getStatementOrderDetail,
  postStatementOrderImport,
  postStatementOrderExport,
  getProductStatement,
  getProductStatementSummary,
  getProductStatementPerson,
  getProductStatementPie,
  getBusinessStatement,
  getBusinessStatementTotal,
  postBusinessStatementImport,
  reportPerson,
  reportPersonDetail,
  reportPersonBigPutAd,
  tbkPromoterMap,
  tbkPromoterList,
}
