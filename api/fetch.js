/*
 * @Author: lizheng
 * @Date: 2021-01-27 15:10:41
 * @LastEditTime: 2021-09-28 08:37:33
 * @LastEditors: Please set LastEditors
 * @Description: 封装Axios以及进行接口报错拦截
 * @FilePath: \ads\api\fetch.js
 */
import axios from 'axios'
import Cookies from 'js-cookie'
import { notification } from 'ant-design-vue'
import { SERVER_BASE_URL, HRM_SERVER_BASE_URL } from './config'

const fetch = (options) => {
  let requestUrl = options.requestStatu === 'otherDomain' ? HRM_SERVER_BASE_URL : SERVER_BASE_URL
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: requestUrl,
      timeout: 20000,
      headers: {},
    })

    // http request 拦截器
    instance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = Cookies.get('authorization') || ''
        return config
      },
      (err) => {
        notification.error({
          message: '请求失败',
          description: err,
        })
        return Promise.reject(err)
      }
    )

    // 请求处理
    instance(options)
      .then((res) => {
        const { data } = res
        // 请求成功时,根据业务判断状态
        if (res.data.code !== 0 && Object.prototype.toString.call(data) !== '[object Blob]') {
          notification.error({
            message: '错误',
            duration: 2,
            description: data && data.message ? `详情：${data.message}` : '详情：暂无',
          })
          // token失效跳转登录页
          if (res.data.code === 41005) {
            setTimeout(() => {
              window.location.href = '/login'
            }, 2500)
          }
        }

        resolve(data)
      })
      .catch(({ response }) => {
        if (!response) {
          notification.error({
            message: '请求无响应，请稍后再试！',
            duration: 2,
            description: '详情：暂无',
          })
          return reject(response)
        }

        // 接口报错处理
        const data = response.data || null
        if (data.code === 40003) {
          notification.error({
            message: '无权访问',
            duration: 2,
            description: `接口：${response.status} ${response.statusText}`,
          })
        } else if (typeof data === 'object' && data.code !== 0) {
          notification.error({
            message: '接口请求报错',
            duration: 2,
            description: data && data.message ? `详情：${data.message}` : '详情：暂无',
          })
        } else {
          notification.error({
            message: '接口请求报错',
            duration: 2,
            description: `接口：${response.status} ${response.statusText}`,
          })
        }
        reject(response)
      })
  })
}

export default fetch
