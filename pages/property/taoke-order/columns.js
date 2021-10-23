/*
 * @Author: lizheng
 * @Date: 2021-02-17 16:30:41
 * @LastEditTime: 2021-04-26 17:57:08
 * @LastEditors: Please set LastEditors
 * @Description: 淘客订单数据表格的column以及相关单元格配置
 * @FilePath: \ads\pages\user-account\product-management\columns.js
 */
export const productColumns = [
  {
    title: '订单编号',
    dataIndex: 'tradeId',
    key: 'tradeId',
    width: 180,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '订单状态',
    dataIndex: 'tkStatus',
    key: 'tkStatus',
    width: 80,
    ellipsis: true,
    scopedSlots: { customRender: 'tkStatus' },
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '付款时间',
    dataIndex: 'tbPaidTime',
    key: 'tbPaidTime',
    width: 150,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '点击时间',
    dataIndex: 'clickTime',
    key: 'clickTime',
    width: 150,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '商品ID',
    dataIndex: 'itemId',
    key: 'itemId',
    width: 120,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '商品标题',
    dataIndex: 'itemTitle',
    key: 'itemTitle',
    width: 350,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '店铺名称',
    dataIndex: 'sellerShopTitle',
    key: 'sellerShopTitle',
    width: 120,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '付款金额',
    dataIndex: 'payPrice',
    key: 'payPrice',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '推广位ID',
    dataIndex: 'adzoneId',
    key: 'adzoneId',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
]

// 推广位数据模块 - 分页列表 - 表头数据
export const promoterColumns = [
  {
    title: '推广位ID',
    dataIndex: 'promoterId',
    key: 'promoterId',
    width: 120,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '推广位名称',
    dataIndex: 'promoterName',
    key: 'promoterName',
    width: 120,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '广告总成交',
    dataIndex: 'adTotalDeal',
    key: 'adTotalDeal',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '广告总成交（点击）',
    dataIndex: 'adTotalDealOfClick',
    key: 'adTotalDealOfClick',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '广告总订单数',
    dataIndex: 'adTotalOrder',
    key: 'adTotalOrder',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '广告总订单数（点击）',
    dataIndex: 'adTotalOrderOfClick',
    key: 'adTotalOrderOfClick',
    width: 150,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '推广位标签',
    dataIndex: 'tagList',
    key: 'tagList',
    width: 300,
    ellipsis: true,
    scopedSlots: { customRender: 'tagList' },
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
    children: [
      {
        title: '——',
        dataIndex: 'tagList',
        key: 'tagList',
        width: 300,
        scopedSlots: { customRender: 'tagList' },
        customHeaderCell: () => ({ style: { height: '47px' } }),
      },
    ],
  },
]

//  订单状态状态值颜色映射
export const cellStatusLabelColor = {
  已付款: '#1890ff',
  已收货: '#faad14',
  已结算: '#00a854',
  已失效: '#999',
}
