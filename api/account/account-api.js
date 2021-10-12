/*
 * @Author: lizheng
 * @Date: 2021-01-18 10:30:11
 * @LastEditTime: 2021-04-16 14:18:01
 * @LastEditors: Please set LastEditors
 * @Description: 账户模块 API
 * @FilePath: \ads\api\account\account-api.js
 */

import fetch from '../fetch.js'

// 账户管理 - 广告投放账户 - 分页列表查询
const getAdAccountList = (params) => {
  return fetch({
    url: `/advertiser`,
    method: 'GET',
    params,
  })
}

// 账户管理 - 广告投放账户 -广告投放账户列表查询
const getAdUserAccountList = () => {
  return fetch({
    url: `/advertiser/list`,
    method: 'GET',
  })
}

// 账户管理 - 广告投放账户 - 别名更新
const putAdAccountAlias = (data) => {
  return fetch({
    url: '/advertiser/alias',
    method: 'PUT',
    data,
  })
}

// 同步状态更新
const advertiserSync = (data) => {
  return fetch({
    url: '/advertiser/sync',
    method: 'PUT',
    data,
  })
}

// 员工关联广告投放账户列表查询
const getEmployeeRelevance = (params) => {
  return fetch({
    url: `/advertiser/related/${params}`,
    method: 'GET',
  })
}

// 员工关联广告投放账户列表查询
const oauthUrl = (params) => {
  return fetch({
    url: `/oauth/uri/${params}`,
    method: 'GET',
  })
}

// 推广位 - 分页列表查询
const getPromoter = (params) => {
  return fetch({
    url: '/promoter',
    method: 'GET',
    params,
  })
}

// 推广位 - 详情查询
const getPromoterDetail = (id) => {
  return fetch({
    url: `/promoter/${id}`,
    method: 'GET',
  })
}

// 推广位 - 新增
const postPromoter = (data) => {
  return fetch({
    url: '/promoter',
    method: 'POST',
    data,
  })
}

// 推广位 - 更新
const putPromoter = (data) => {
  return fetch({
    url: '/promoter',
    method: 'put',
    data,
  })
}

// 推广位 - 删除
const deletePromoter = (id) => {
  return fetch({
    url: `/promoter/${id}`,
    method: 'DELETE',
  })
}

// 推广位 - 关联计划
const getRelevancyPlan = (params) => {
  return fetch({
    url: '/promoter/related/ad',
    method: 'GET',
    params,
  })
}

// 推广位 - 关联计划 - 搜索计划id/名称
const searchPlan = (params) => {
  return fetch({
    url: '/promoter/ad/query',
    method: 'GET',
    params
  })
}

// 推广位 - 关联计划 - 新增
const postPlan = (data) => {
  return fetch({
    url: '/promoter/related/ad',
    method: 'POST',
    data
  })
}

// 产品 - 分页列表查询
const getProduct = (params) => {
  return fetch({
    url: '/product',
    method: 'GET',
    params,
  })
}

// 产品 - 详情查询
const getProductDetail = (id) => {
  return fetch({
    url: `/product/${id}`,
    method: 'GET',
  })
}

// 产品 - 新增
const postProduct = (data) => {
  return fetch({
    url: '/product',
    method: 'POST',
    data,
  })
}

// 产品 - 更新
const putProduct = (data) => {
  return fetch({
    url: '/product',
    method: 'put',
    data,
  })
}

// 产品 - 删除
const deleteProduct = (id) => {
  return fetch({
    url: `/product/${id}`,
    method: 'DELETE',
  })
}

// 产品 - 查询产品列表
const getProductList = (name) => {
  return fetch({
    url: `/product/list/${name}`,
    method: 'GET',
  })
}

// 用户账号 - 查询关联负责人
const getSearchPersonInCharge = (advertiserId) => {
  return fetch({
    url: `/advertiser/related/user/${advertiserId}`,
    method: 'GET',
  })
}

// 用户账号 - 更新关联负责人
const putSearchPersonInCharge = (data) => {
  return fetch({
    url: `/advertiser/related/user`,
    method: 'PUt',
    data,
  })
}

// 用户账号 - 查询关联推广位
const getRelatedPromotion = (advertiserId) => {
  return fetch({
    url: `/advertiser/related/promote/${advertiserId}`,
    method: 'GET',
  })
}
// 用户账号 - 更新关联推广位
const putRelatedPromotion = (data) => {
  return fetch({
    url: '/advertiser/related/promote',
    method: 'PUT',
    data,
  })
}

// 用户账号 - 查询关联的产品
const getRelatedProduct = (advertiserId) => {
  return fetch({
    url: `/advertiser/related/product/${advertiserId}`,
    method: 'GET',
  })
}

// 用户账号 - 更新关联的产品
const putRelatedProduct = (data) => {
  return fetch({
    url: '/advertiser/related/product',
    method: 'PUT',
    data,
  })
}

// 账户管理-产品-查看关联的广告投放账户
const getProductRelatedAccount = (productId) => {
  return fetch({
    url: `/product/list/advertiser/${productId}`,
    method: 'GET',
  })
}

// 广告账户数据同步-同步记录查询
const getAccountSyncStatus = (advertiserId) => {
  return fetch({
    url: `report/sync/advertiser/record/${advertiserId}`,
    method: 'GET',
  })
}

// 广告账户数据同步-手动同步
const postAccountSyncStatus = (data) => {
  return fetch({
    url: `/report/sync/advertiser`,
    method: 'POST',
    data,
  })
}

export default {
  getAdAccountList,
  getAdUserAccountList,
  putAdAccountAlias,
  advertiserSync,
  getEmployeeRelevance,
  oauthUrl,

  getPromoter,
  getPromoterDetail,
  postPromoter,
  putPromoter,
  deletePromoter,
  getRelevancyPlan,
  searchPlan,
  postPlan,

  getProduct,
  getProductDetail,
  postProduct,
  putProduct,
  deleteProduct,
  getProductList,

  getSearchPersonInCharge,
  putSearchPersonInCharge,
  getRelatedPromotion,
  putRelatedPromotion,
  getRelatedProduct,
  putRelatedProduct,

  getProductRelatedAccount,
  getAccountSyncStatus,
  postAccountSyncStatus,
}
