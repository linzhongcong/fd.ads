/*
 * @Author: lizheng
 * @Date: 2021-02-17 16:30:41
 * @LastEditTime: 2021-03-18 17:16:25
 * @LastEditors: Please set LastEditors
 * @Description: 产品表格的column以及相关单元格配置
 * @FilePath: \ads\pages\user-account\product-management\columns.js
 */
export const productColumns = [
  {
    title: '商品ID',
    dataIndex: 'productId',
    key: 'id',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'name',
    width: 250,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 250,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '店铺名称',
    dataIndex: 'shopName',
    key: 'shopName',
    width: 250,
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '关联的广告投放账号',
    dataIndex: 'adId',
    key: 'adId',
    width: 120,
    ellipsis: true,
    scopedSlots: { customRender: 'adId' },
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    width: 100,
    scopedSlots: { customRender: 'operate' },
    ellipsis: true,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
]
