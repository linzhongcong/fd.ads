/*
 * @Author: your name
 * @Date: 2021-01-11 16:32:48
 * @LastEditTime: 2021-04-16 17:05:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ads.fandow/server/build.env.js
 */
const fs = require('fs')

let Env = process.env.NODE_ENV

fs.writeFile(
  './api/env.js',
  'export default "' + Env + '";',
  {
    flag: 'w',
  },
  (err) => {
    if (err) {
      console.error(err)
    } else {
      console.log('write file env.js success.')
    }
  }
)
