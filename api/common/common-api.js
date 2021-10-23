/*
 * @Author: huangjianhan
 * @Date: 2021-01-19 15:24:02
 * @LastEditTime: 2021-09-23 14:36:22
 * @LastEditors: Please set LastEditors
 * @Description: 公共接口
 * @FilePath: \ads.fandow.com\api\common\common-api.js
 * ① 获取部门数据
 * ② 获取对应部门下的人员数据
 * tip: 这两个是HRM系统的域名 当前用的接口用部门数据&&部门下的人员数据
 */
import fetch from '../fetch.js'

// 获取部门数据
const getDeptData = (params) => {
  return fetch({
    url: '/hr/dept-v2/tree',
    method: 'GET',
    requestStatu: 'otherDomain',
    params,
  })
}

// 组织架构列表
const getDeptEmployeeData = (params) => {
  return fetch({
    url: '/hr/structure/employee',
    method: 'GET',
    requestStatu: 'otherDomain',
    params,
  })
}

// 用户列表
const getUsers = (params) => {
  return fetch({
    url: '/uac/search/users',
    method: 'GET',
    requestStatu: 'otherDomain',
    params,
  })
}

// 文件素材查询 - 某张图片素材查询
const getDocumentMaterialItem = (params) => {
  return fetch({
    url: `/file/ocean/image`,
    method: 'GET',
    params,
  })
}

// 文件素材查询 - 广告主头像
const getAdMasterAvatar = (advertiserId) => {
  return fetch({
    url: `/advertiser/avatar/${advertiserId}`,
    method: 'GET',
  })
}

// 文件素材查询 - 某个视频素材查询
const getDocumentOceanVideo = (params) => {
  return fetch({
    url: `/file/ocean/video`,
    method: 'GET',
    params,
  })
}

// 巨量引擎 - 图片素材上传接口
const uploadImage = (params, advertiserId) => {
  return fetch({
    url: `/file/ocean/image/upload/${advertiserId}`,
    method: 'POST',
    data: params,
  })
}

// 巨量引擎 - 视频素材上传接口
const uploadVideo = (params, advertiserId) => {
  return fetch({
    url: `/file/ocean/video/upload/${advertiserId}`,
    method: 'POST',
    data: params,
  })
}

// 巨量引擎 - 视频智能推荐封面创 巨量那边没有给出权限，暂不作处理
const getVideoCover = (videoId, advertiserId) => {
  return fetch({
    url: `/file/ocean/video/upload/cover/suggest/${advertiserId}/${videoId}`,
    method: 'GET',
  })
}

export default {
  getDeptData,
  getDeptEmployeeData,
  getDocumentMaterialItem,
  getAdMasterAvatar,
  getDocumentOceanVideo,
  getUsers,
  uploadImage,
  uploadVideo,
  getVideoCover,
}
