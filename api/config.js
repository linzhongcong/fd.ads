/*
 * @Author: liyulin
 * @Date: 2021-01-15 17:20:22
 * @LastEditTime: 2021-09-30 09:45:15
 * @LastEditors: Please set LastEditors
 * @Description: 接口配置，api服务器接口根地址,配置编译环境和线上环境之间的切换
 * @FilePath: \oms\api\config.js
 */

import ENV from './env'

// baseUrl: 域名地址
let baseUrl = 'http://api.fandow.com/ads'
let hrmBaseUrl = 'http://api.fandow.com/oa'
let fileUrl = 'http://api.fandow.com/ads'

// 统一权限
if (ENV === 'production') {
  console.log('---- production ----')
} else if (ENV === 'test') {
  console.log('---- test ----')
  baseUrl = 'https://apitest.fandow.com/ads'
  // baseUrl = 'http://aijiangyoubuaicu.cn1.utools.club'
  // fileUrl = 'http://kongtest.fandow.com/ads'
  fileUrl = 'https://apitest.fandow.com/ads'
  // hrmBaseUrl = 'http://kongtest.fandow.com/oa'
  hrmBaseUrl = 'https://apitest.fandow.com/oa'
} else {
  console.log('---- develop ----')
  // baseUrl = 'http://apitest.fandow.com/ads'
  baseUrl = 'https://apitest.fandow.com/test/ads'
  fileUrl = 'https://kongtest.fandow.com/ads'
  hrmBaseUrl = 'https://kongtest.fandow.com/oa'
}

export const SERVER_BASE_URL = baseUrl
export const FILE_BASE_URL = fileUrl
export const HRM_SERVER_BASE_URL = hrmBaseUrl
