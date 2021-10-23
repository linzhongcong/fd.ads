/*
 * @Author: your name
 * @Date: 2021-09-23 13:20:42
 * @LastEditTime: 2021-09-25 10:55:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oa-refactor.fandow.come:\my_work\ads.fandow.com\api\resource-centre\promote-data-api.js
 */
import fetch from '../fetch'

// 资产中心-生意参谋数据-列表
const businessStaffSearch = (params) => {
  return fetch({
    url: '/assets/business-staff/page',
    method: 'GET',
    params,
  })
}

// 资产中心-生意数据参谋-excel模板下载
const businessExcelDownLoad = () => {
  return fetch({
    url: '/assets/business-staff/excel/template',
    method: 'GET',
    responseType: 'blob'
  })
}

// 资产中心-生意数据参谋-快速创建
const businessStaffCreate = (params) => {
  return fetch({
    url: '/assets/business-staff/save',
    method: 'GET',
    params
  })
}

// 资产中心-生意参谋数据-查询时段数据
const businessStaffPeriodList = (params) => {
  return fetch({
    url: '/assets/business-staff/period/list',
    method: 'GET',
    params
  })
}

// 资产中心-生意参谋数据-编辑时段数据
const businessStaffPeriodEdit = (data) => {
  return fetch({
    url: '/assets/business-staff/period/saveOrUpdate',
    method: 'POST',
    data
  })
}

// 资产中心-生意参谋数据-上传excel
const businessStaffUpload = (data, id) => {
  console.log(data, 'data');
  return fetch({
    url: `/assets/business-staff/excel/upload?goodsId=${id}`,
    method: 'POST',
    data: data
  })
}


export default {
  businessStaffSearch,
  businessExcelDownLoad,
  businessStaffCreate,
  businessStaffPeriodList,
  businessStaffPeriodEdit,
  businessStaffUpload

}
