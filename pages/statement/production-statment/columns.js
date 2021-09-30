/*
 * @Author: lizheng
 * @Date: 2021-03-06 10:53:10
 * @LastEditTime: 2021-03-26 19:39:10
 * @LastEditors: Please set LastEditors
 * @Description: table column 以及常量数据
 * @FilePath: \ads\pages\statement\production-statment\columns.js
 */
export const productColumns = [
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
    width: 230,
    ellipsis: true,
    fixed: 'left',
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '展示数',
    dataIndex: 'show',
    key: 'show',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '点击数',
    dataIndex: 'click',
    key: 'click',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '平均点击单价',
    dataIndex: 'avgClickCost',
    key: 'avgClickCost',
    width: 120,
    ellipsis: true,
  },
  {
    title: '消耗-巨量',
    dataIndex: 'cost',
    key: 'cost',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '平均千次展示费用',
    dataIndex: 'avgShowCost',
    key: 'avgShowCost',
    width: 140,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '点击率',
    dataIndex: 'ctr',
    key: 'ctr',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
    customRender: (text) => (text ? `${(Number(text) * 100).toFixed(2)}  %` : ''),
  },
  {
    title: '转换成本',
    dataIndex: 'convertCost',
    key: 'convertCost',
    width: 120,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '深度转换率',
    dataIndex: 'deepConvertRate',
    key: 'deepConvertRate',
    width: 120,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
    customRender: (text) => (text ? `${(Number(text) * 100).toFixed(2)}  %` : ''),
  },
  {
    title: '转化数',
    dataIndex: 'convert',
    key: 'convert',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '转化率',
    dataIndex: 'convertRate',
    key: 'convertRate',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
    customRender: (text) => (text ? `${(Number(text) * 100).toFixed(2)}  %` : ''),
  },
  {
    title: '深度转化成本',
    dataIndex: 'deepConvertCost',
    key: 'deepConvertCost',
    width: 140,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '成交-淘客',
    dataIndex: 'totalDeal',
    key: 'totalDeal',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '抖音ROI',
    dataIndex: 'roi',
    key: 'roi',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '销售额',
    dataIndex: 'sellPrice',
    key: 'sellPrice',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '浏览量',
    dataIndex: 'view',
    key: 'view',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '访客数',
    dataIndex: 'visited',
    key: 'visited',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '销量',
    dataIndex: 'sales',
    key: 'sales',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '订单数',
    dataIndex: 'orderCount',
    key: 'orderCount',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },

  {
    title: '入口数',
    dataIndex: 'entrance',
    key: 'entrance',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '跳失率',
    dataIndex: 'skipRate',
    key: 'skipRate',
    width: 100,
    ellipsis: true,
    customRender: (text) => (text ? `${(Number(text) * 100).toFixed(2)}  %` : ''),
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '停留时间',
    dataIndex: 'stopTime',
    key: 'stopTime',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '收藏',
    dataIndex: 'favorites',
    key: 'favorites',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '购物车',
    dataIndex: 'shopCart',
    key: 'shopCart',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '搜索UV',
    dataIndex: 'searchUv',
    key: 'searchUv',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
]
