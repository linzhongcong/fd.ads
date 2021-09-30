/*
 * @Author: huangjianhan
 * @Date: 2021-05-21 15:16:01
 * @LastEditTime: 2021-07-22 17:46:04
 * @LastEditors: Please set LastEditors
 * @Description: 广告创建模块
 * @FilePath: \ads.fandow.com\api\create-ad-plan\create-ad.api.js
 */

import fetch from '../fetch.js'

const createAdSite = (params) => {
  return fetch({
    url: '/ad/create/site',
    method: 'GET',
    params,
  })
}

// 广告计划创建
const createAd = (params) => {
  return fetch({
    url: '/ad/create',
    method: 'POST',
    data: params,
  })
}

// 广告创意创建
const createCreative = (params) => {
  return fetch({
    url: '/creative',
    method: 'POST',
    data: params,
  })
}

// 行业列表获取 级联接口
const createAdIndustryList = (params) => {
  return fetch({
    url: '/common/ocean/industry/list',
    method: 'GET',
    params,
  })
}

// 广告计划创建 - 转化目标列表查询
const createAdConvertList = (params) => {
  return fetch({
    url: '/ad/convert/list',
    method: 'GET',
    params,
  })
}

export default {
  createAdSite,
  createAd,
  createCreative,
  createAdIndustryList,
  createAdConvertList,
}
