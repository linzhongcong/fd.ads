/*
 * @Author: xieguiting
 * @Date: 2021-10-15 13:17:20
 * @LastEditTime: 2021-10-15 13:36:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads.fandow.com\api\statement\production-api.js
 */
// 报表 - 产品报表 - 列表查询
import fetch from '../fetch'

const productionList = (params) => {
  return fetch({
    url: '/report/assets/product',
    method: 'GET',
    params,
  })
}

export default {
  productionList,
}
