/*
 * @Author: lizheng
 * @Date: 2021-01-18 21:25:11
 * @LastEditTime: 2021-01-19 09:21:36
 * @LastEditors: Please set LastEditors
 * @Description: 用户登录模块
 * @FilePath: \ads\api\login\login-api.js
 */

import fetch from '../fetch'
// 获取登录验证码
const getCaptcha = (params) => {
  return fetch({
    url: `/auth/captcha/${params}`,
    method: 'GET',
  })
}

// 登录
const login = (params) => {
  return fetch({
    url: '/auth',
    method: 'POST',
    data: params,
  })
}

// 获取用户信息
const getUserInfo = (params) => {
  return fetch({
    url: '/auth/user',
    method: 'GET',
  })
}

// 退出
const logout = (params) => {
  return fetch({
    url: 'auth/out',
    method: 'GEt',
    params,
  })
}

export default {
  login,
  logout,
  getCaptcha,
  getUserInfo,
}
