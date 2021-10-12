/*
 * @Author: your name
 * @Date: 2021-02-17 16:57:49
 * @LastEditTime: 2021-04-22 15:23:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads\pages\user-account\promotion-management\columns.js
 */
export const promotionPositionColumns = [
  {
    title: '推广位ID',
    dataIndex: 'promoterId',
    key: 'promoterId',
    ellipsis: true,
    width: 120,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '推广位名称',
    dataIndex: 'promoterName',
    key: 'promoterName',
    ellipsis: true,
    width: 250,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    ellipsis: true,
    width: 250,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '推广位标签',
    dataIndex: 'tagList',
    key: 'tagList',
    scopedSlots: { customRender: 'tagList' },
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    width: 180,
    scopedSlots: { customRender: 'operate' },
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
]

// 标签配置表格字段
export const settingColumns = [
  {
    title: '序号',
    dataIndex: 'order',
    key: 'order',
    ellipsis: true,
    width: 80,
    customRender: (text, record, idx) => ++idx,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '标签名称',
    dataIndex: 'tagName',
    key: 'name',
    ellipsis: true,
    width: 120,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '标签样式',
    dataIndex: 'style',
    key: 'style',
    ellipsis: true,
    width: 120,
    scopedSlots: { customRender: 'style' },
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    width: 100,
    scopedSlots: { customRender: 'operate' },
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
]


export const relationPlanTable = [
  {
    title: '序号',
    dataIndex: 'order',
    key: 'order',
    ellipsis: true,
    width: 40,
    customRender: (text, record, idx) => ++idx,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '计划ID',
    dataIndex: 'adId',
    key: 'adId',
    ellipsis: true,
    width: 110,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '计划名称',
    dataIndex: 'adName',
    key: 'adName',
    ellipsis: true,
    width: 110,
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '开始时间',
    dataIndex: 'startDate',
    key: 'startDate',
    ellipsis: true,
    width: 140,
    scopedSlots: { customRender: 'startDate' },
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '结束时间',
    dataIndex: 'endDate',
    key: 'endDate',
    ellipsis: true,
    width: 140,
    scopedSlots: { customRender: 'endDate' },
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    width: 60,
    scopedSlots: { customRender: 'operate' },
    customHeaderCell: () => ({ style: { backgroundColor: '#f5f7fa', height: '47px' } }),
  },
]

export const relationPlanData = [
  {
    key: '1',
    planID: '111',
    planName: '计划名称A',
    startTime: '日期：2021-10-01 时段：00',
    endTime: '日期：2021-10-01 时段：23',
  },
  {
    key: '2',
    planID: '222',
    planName: '计划名称B',
    startTime: '日期：2021-10-03 时段：00',
    endTime: '日期：2021-10-03 时段：23',
  },
];
