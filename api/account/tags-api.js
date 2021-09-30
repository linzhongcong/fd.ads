/*
 * @Author: lizheng
 * @Date: 2021-04-22 14:38:20
 * @LastEditTime: 2021-04-22 15:56:11
 * @LastEditors: Please set LastEditors
 * @Description: 标签管理
 * @FilePath: \ads\api\account\tags-api.js
 */

import fetch from '../fetch.js'

// 标签配置 - 标签分页列表查询
const getTag = (params) => {
  return fetch({
    url: '/promoter/tag',
    method: 'GET',
    params,
  })
}

// 标签配置 - 新增标签
const postTag = (data) => {
  return fetch({
    url: '/promoter/tag',
    method: 'POST',
    data,
  })
}

// 标签配置 - 更新标签
const putTag = (data) => {
  return fetch({
    url: '/promoter/tag',
    method: 'PUT',
    data,
  })
}

// 标签配置-删除一个标签
const deleteTag = (tagId) => {
  return fetch({
    url: `/promoter/tag/${tagId}`,
    method: 'DELETE',
  })
}

export default {
  getTag,
  putTag,
  postTag,
  deleteTag,
}
