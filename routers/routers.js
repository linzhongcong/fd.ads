/*
 * @Author: lizheng
 * @Date: 2021-01-11 13:33:51
 * @LastEditTime: 2021-07-19 16:01:51
 * @LastEditors: Please set LastEditors
 * @Description: ads项目路由入口
 * @FilePath: /ads.fandow.com/routers/routers.js
 * 投放、账户为一级类目
 * 账户下的广告投放账号、用户账号为二级目录
 */
import promotionRouter from './promotion-router'
import userRouter from './user-router'
import statementRouter from './statement-router'
import propertyCentreRouter from './property-centre'

export default [...promotionRouter, ...userRouter, ...statementRouter, ...propertyCentreRouter]
