/*
 * @Author: liyulin
 * @Date: 2021-01-11 08:26:48
 * @LastEditTime: 2021-04-21 16:55:07
 * @LastEditors: Please set LastEditors
 * @Description: Nuxt的配置文件
 * @FilePath: /ads.fandow.com/nuxt.config.js
 */

const Koa = require('koa')
const app = new Koa()
module.exports = {
  head: {
    title: app.env === 'production' ? '广告营销系统' : `ads${app.env}.fandow.com`,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: ['ant-design-vue/dist/antd.css'],
  plugins: [{ src: '@/plugins/antd-ui' }, { src: '@/plugins/api' }],
  components: true,
  build: { transpile: [/ant-design-vue/] },
}
