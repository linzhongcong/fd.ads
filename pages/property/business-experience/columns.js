/*
 * @Author: lizheng
 * @Date: 2021-03-24 13:43:09
 * @LastEditTime: 2021-03-29 11:55:54
 * @LastEditors: Please set LastEditors
 * @Description: 生e经表格数据
 * @FilePath: \ads\pages\statement\business-experience\columns.js
 */

export const businessExperienceColumns = [
  {
    title: '日期',
    width: 145,
    fixed: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'statDatetime',
        key: 'statDatetime',
        width: 145,
        fixed: true,
        ellipsis: true,
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },
  {
    title: '商品标题',
    width: 350,
    fixed: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'productName',
        key: 'productName',
        width: 350,
        fixed: true,
        ellipsis: true,
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },
  {
    title: '商品ID',
    width: 120,
    fixed: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'productId',
        key: 'productId',
        fixed: true,
        width: 120,
        ellipsis: true,
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },
  {
    title: '浏览量',
    width: 120,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'view',
        key: 'view',
        width: 120,
        ellipsis: true,
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },
  {
    title: '访客数',
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'visited',
        key: 'visited',
        width: 120,
        ellipsis: true,
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },
  {
    title: '销售额',
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'sellPrice',
        key: 'sellPrice',
        width: 100,
        ellipsis: true,
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },
  {
    title: '销量',
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'sales',
        key: 'sales',
        width: 100,
        ellipsis: true,
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },
  {
    title: '订单数',
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'orderCount',
        key: 'orderCount',
        width: 100,
        ellipsis: true,
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },
  {
    title: '转化率',
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'convertRate',
        key: 'convertRate',
        width: 100,
        ellipsis: true,
        customRender: (text) => (text ? `${text}%` : ''),
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },

  {
    title: '入口数',
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'entrance',
        key: 'entrance',
        width: 100,
        ellipsis: true,
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },
  {
    title: '跳失率',
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'skipRate',
        key: 'skipRate',
        width: 100,
        ellipsis: true,
        customRender: (text) => (text ? `${text}%` : ''),
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },
  {
    title: '停留时间',
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'stopTime',
        key: 'stopTime',
        width: 100,
        ellipsis: true,
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },
  {
    title: '收藏',
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'favorites',
        key: 'favorites',
        width: 100,
        ellipsis: true,
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },
  {
    title: '购物车',
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'shopCart',
        key: 'shopCart',
        width: 100,
        ellipsis: true,
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },
  {
    title: '搜索UV',
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'searchUv',
        key: 'searchUv',
        width: 100,
        ellipsis: true,
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },

  {
    title: '搜索销量',
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'searchSales',
        key: 'searchSales',
        width: 100,
        ellipsis: true,
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },
  {
    title: '淘宝首页UV',
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '',
        dataIndex: 'taobaoHomepageUv',
        key: 'taobaoHomepageUv',
        width: 100,
        ellipsis: true,
        customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
      },
    ],
  },
]
