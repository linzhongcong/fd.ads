/*
 * @Author: hjh
 * @Date: 2021-07-20 15:05:23
 * @LastEditTime: 2021-07-21 13:42:16
 * @LastEditors: Please set LastEditors
 * @Description: 资产中心-个人落地页模块API
 * @FilePath: \ads.fandow.com\api\resource-centre\personal-landing.js
 */

import fetch from '../fetch'

// 资产中心 - 分页列表查询
const personalLandingPageSearch = (params) => {
  return fetch({
    url: '/assets/personal-landing-page',
    method: 'GET',
    params,
  })
}

// 资产中心 - 个人落地页新建
const personalLandingPageAdd = (params) => {
  return fetch({
    url: '/assets/personal-landing-page',
    method: 'POST',
    data: params,
  })
}

// 资产中心 - 个人落地页新建
const personalLandingPageEdit = (params) => {
  return fetch({
    url: '/assets/personal-landing-page',
    method: 'PUT',
    data: params,
  })
}

// 资产中心 - 个人落地页详情查询
const personalLandingDetail = (id) => {
  return fetch({
    url: `/assets/personal-landing-page/${id}`,
    method: 'GET',
  })
}

// 资产中心 - 个人落地页删除
const personalLandingDelete = (id) => {
  return fetch({
    url: `/assets/personal-landing-page/${id}`,
    method: 'DELETE',
  })
}

export default {
  personalLandingPageSearch,
  personalLandingDetail,
  personalLandingPageAdd,
  personalLandingPageEdit,
  personalLandingDelete,
}
