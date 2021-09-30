/*
 * @Author: lizheng
 * @Date: 2021-04-22 14:39:22
 * @LastEditTime: 2021-04-22 14:41:04
 * @LastEditors: Please set LastEditors
 * @Description: 账户管理模块接口入口
 * @FilePath: \ads\api\account\index.js
 */
import account from './account-api'
import tags from './tags-api'

export default {
  ...account,
  ...tags,
}
