/*
 * @Author: xirguiting
 * @Date: 2021-10-12 11:07:35
 * @LastEditTime: 2021-10-12 15:30:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads.fandow.com\api\statement\advertising-time-api.js
 */
import fetch from '../fetch'

// 报表 - 广告实时报表 - 列表查询
const advertisingTimeList = (params) => {
  return fetch({
    url: '/report/assets/advertising',
    method: 'GET',
    params,
  })
}

export default {
  advertisingTimeList,
}
