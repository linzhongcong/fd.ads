import fetch from '../fetch'

// 抖音巨量-广告计划分页列表查询
const extendDouyinAdPageSearch = (params) => {
  return fetch({
    url: '/assets/extend-douyin/ad',
    method: 'GET',
    params,
  })
}
// 抖音巨量-每日数据分页列表查询
const extendDouyinDayPageSearch = (params) => {
  return fetch({
    url: '/assets/extend-douyin/day',
    method: 'GET',
    params,
  })
}
// 抖音巨量-删除广告计划
const extendDouyinAdDelete = (id) => {
  return fetch({
    url: `/assets/extend-douyin/ad/${id}`,
    method: 'DELETE'
  })
}

// 抖音巨量-删除每日数据
const extendDouyinDayDelete = (id) => {
  return fetch({
    url: `/assets/extend-douyin/day/${id}`,
    method: 'DELETE'
  })
}

// 抖音巨量-设置
const extendDouyinSetting = (params) => {
  return fetch({
    url: '/assets/extend-douyin/ad',
    method: 'PUT',
    data: params
  })
}
// 抖音巨量-获取时段列表
const extendDouyinDayHours = (params) => {
  return fetch({
    url: '/assets/extend-douyin/hours',
    method: 'GET',
    params,
  })
}

// 抖音巨量-更新时段
const extendDouyinUpdateHours = (params) => {
  return fetch({
    url: '/assets/extend-douyin/hours',
    method: 'PUT',
    data: params
  })
}
// 抖音巨量-获取计划列表
const extendDouyinPlanList = (name) => {
  return fetch({
    url: `/assets/extend-douyin/ad/list/${name}`,
    method: 'GET',
  })
}

// 抖音巨量-同步账号分页列表查询
const syncAccount = (params) => {
  return fetch({
    url: '/assets/extend-douyin/advertiser',
    method: 'GET',
    params: params
  })
}

// 抖音巨量-同步账号-账户模糊搜索
const searchAccount = (advertiserId) => {
  return fetch({
    url: `/assets/extend-douyin/advertiser/${advertiserId}`,
    method: 'GET'
  })
}

// 抖音巨量-同步账号-新增账号
const postAccount = (params) => {
  return fetch({
    url: '/assets/extend-douyin/advertiser',
    method: 'POST',
    data: params
  })
}

// 抖音巨量-同步账号-删除账号
const deleteAccount = (id) => {
  return fetch({
    url: `/assets/extend-douyin/advertiser/${id}`,
    method: 'DELETE'
  })
}

export default {
  extendDouyinAdPageSearch,
  extendDouyinDayPageSearch,
  extendDouyinAdDelete,
  extendDouyinDayDelete,
  extendDouyinSetting,
  extendDouyinDayHours,
  extendDouyinUpdateHours,
  extendDouyinPlanList,
  syncAccount,
  searchAccount,
  postAccount,
  deleteAccount,

}