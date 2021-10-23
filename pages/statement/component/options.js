/*
 * @Author: your name
 * @Date: 2021-10-15 10:53:28
 * @LastEditTime: 2021-10-15 15:24:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads.fandow.com\pages\statement\component\options.js
 */
// 广告实时报表指标趋势折线图
let trendOptions = {
  title: {
    text: '',
    textStyle: {
      fontSize: '14px',
    },
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    left: 'right',
    data: ['销售额', '基础销量'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '7%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
  },
  yAxis: [
    {
      type: 'value',
      name: '',
    },
    {
      type: 'value',
      name: '',
    },
  ],
  series: [
    {
      name: '销售额',
      type: 'line',
      yAxisIndex: 0,
      data: [],
    },
    {
      name: '基础销量',
      type: 'line',
      yAxisIndex: 1,
      data: [],
    },
  ],
}

let trendOptionProduct = {
  title: {
    text: '',
    textStyle: {
      fontSize: '14px',
    },
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    left: 'right',
    data: ['浏览量', '访客数'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '7%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
  },
  yAxis: [
    {
      type: 'value',
      name: '',
    },
    {
      type: 'value',
      name: '',
    },
  ],
  series: [
    {
      name: '浏览量',
      type: 'line',
      yAxisIndex: 0,
      data: [],
    },
    {
      name: '访客数',
      type: 'line',
      yAxisIndex: 1,
      data: [],
    },
  ],
}

const dataZoom = [
  {
    type: 'slider',
    show: true,
    xAxisIndex: [0],
    start: 1,
    end: 35,
    bottom: 0,
  },
]
export default {
  dataZoom,
  trendOptions,
  trendOptionProduct,
}
