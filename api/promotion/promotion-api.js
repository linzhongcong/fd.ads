/*
 * @Author: lizheng
 * @Date: 2021-01-18 09:09:29
 * @LastEditTime: 2021-04-13 17:39:13
 * @LastEditors: Please set LastEditors
 * @Description: 推广模块的接口API
 * @FilePath: \ads\api\promotion\promotion-api.js
 */
import fetch from '../fetch'

// 广告账户预算 - 预算查询
const getAdAccountBudget = (advertiserId) => {
  return fetch({
    url: `/advertiser/budget/${advertiserId}`,
    method: 'GET',
  })
}

// 广告账户预算 - 预算更新
const putAdAccountBudget = (data) => {
  return fetch({
    url: '/advertiser/budget',
    method: 'PUT',
    data,
  })
}

// 投放管理 - 广告组 - 分页列表
const getPromotionAdGroupList = (params) => {
  return fetch({
    url: '/campaign',
    method: 'GET',
    params,
  })
}

// 投放管理 - 新建广告组模块 - 分页查询列表
const getPromotionAdGroupListBySearch = (params) => {
  return fetch({
    url: '/campaign/select',
    method: 'GET',
    params,
  })
}

// 投放管理 - 广告组 - 创建
const postPromotionAdGroupList = (data) => {
  return fetch({
    url: '/campaign',
    method: 'POST',
    data,
  })
}

// 投放管理 - 广告组 - 启用或停用
const putPromotionAdGroupItem = (data) => {
  return fetch({
    url: `/campaign/enable`,
    method: 'PUT',
    data,
  })
}

// 投放管理 - 广告组 - 广告组详情查询
const getPromotionAdGroupDetail = (advertiserId, campaignId) => {
  return fetch({
    url: `/campaign/${advertiserId}/${campaignId}`,
    method: 'GET',
  })
}

// 投放管理 - 广告计划 - 分页列表
const getPromotionPlanList = (params) => {
  return fetch({
    url: '/ad',
    method: 'GET',
    params,
  })
}

// 投放管理 - 广告组 - 启用或停用
const putPromotionAdPlanItem = (data) => {
  return fetch({
    url: `/ad/enable`,
    method: 'PUT',
    data,
  })
}

// 投放管理 - 广告计划 - 详情查询
const getPromotionAdPlanDetail = (advertiserId, adId) => {
  return fetch({
    url: `/ad/${advertiserId}/${adId}`,
    method: 'GET',
  })
}

// 投放管理 - 创意设置 - 详情查询
const getPromotionAdIdeaDetail = (advertiserId, adId) => {
  return fetch({
    url: `/ad/creative/setup/${advertiserId}/${adId}`,
    method: 'GET',
  })
}

// 投放管理 - 广告计划 - 预算更新
const putPromotionAdPlanBudget = (data) => {
  return fetch({
    url: '/ad/budget',
    method: 'PUT',
    data,
  })
}

// 投放管理 - 广告计划 - 创意列表
const putPromotionCreative = (params) => {
  return fetch({
    url: '/creative',
    method: 'GET',
    params,
  })
}

// 投放管理 - 广告计划 - 创意列表查询
const getPromotionIdeaList = (params) => {
  return fetch({
    url: '/ad/creative/list',
    method: 'GET',
    params,
  })
}
// 投放管理 - 广告组 - 创意列表查询
const getAdGroupVideoListDetail = (params) => {
  return fetch({
    url: '/campaign/creative/list',
    method: 'GET',
    params,
  })
}

// 广告创意 - 状态更新
const putPromotionAdIdeaItem = (data) => {
  return fetch({
    url: `/creative/enable`,
    method: 'PUT',
    data,
  })
}

// 查询广推广位列表
const getPromotionList = (name) => {
  return fetch({
    url: `/promoter/list/${name}`,
    method: 'GET',
  })
}

// 广告计划 - 广告计划大头计划更新
const putPromotionPlanBigCost = (data) => {
  return fetch({
    url: '/ad/big-put',
    method: 'PUT',
    data,
  })
}

// 广告计划 - 批量操作更新负责人
const putPromotionPlanPersonCharge = (data) => {
  return fetch({
    url: '/ad/related/person',
    method: 'PUT',
    data,
  })
}

export default {
  getAdAccountBudget,
  putAdAccountBudget,
  putPromotionAdGroupItem,
  getPromotionAdGroupDetail,
  getPromotionAdGroupList,
  getPromotionAdGroupListBySearch,
  postPromotionAdGroupList,
  getPromotionPlanList,
  putPromotionAdPlanItem,
  getPromotionAdPlanDetail,
  putPromotionAdPlanBudget,
  getPromotionAdIdeaDetail,
  putPromotionCreative,
  getPromotionIdeaList,
  putPromotionAdIdeaItem,
  getAdGroupVideoListDetail,
  getPromotionList,
  putPromotionPlanBigCost,
  putPromotionPlanPersonCharge,
}
