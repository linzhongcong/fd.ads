/*
 * @Author: liyulin
 * @Date: 2021-01-15 09:51:17
 * @LastEditTime: 2021-07-20 15:15:23
 * @LastEditors: Please set LastEditors
 * @Description: API接口入口文件
 * @FilePath: /ads.fandow/api/aps.js
 */

import promotionAPI from './promotion/promotion-api'
import accountAPI from './account'
import loginAPI from './login/login-api'
import statementAPI from './statement/statement-api'
import advertisingAPI from './statement/advertising-api'
import createAdSite from './create-ad-plan/create-ad.api'
import commonAPI from './common/common-api'
import personalLanding from './resource-centre/personal-landing'

export default {
  ...promotionAPI,
  ...accountAPI,
  ...loginAPI,
  ...statementAPI,
  ...advertisingAPI,
  ...commonAPI,
  ...createAdSite,
  ...personalLanding,
}
