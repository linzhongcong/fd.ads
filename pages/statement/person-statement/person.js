// 人员报表表格字段
export const tableColumns = [
  {
    title: '姓名',
    dataIndex: 'realName',
    key: 'realName',
    width: 150,
    ellipsis: true,
    fixed: 'left',
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '工号',
    dataIndex: 'username',
    key: 'username',
    width: 150,
    ellipsis: true,
    fixed: 'left',
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '岗位',
    dataIndex: 'deptJobName',
    key: 'deptJobName',
    width: 140,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
    customRender: value => value ?? '-'
  },
  {
    title: '产品数',
    dataIndex: 'productCount',
    key: 'productCount',
    width: 140,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '消耗',
    dataIndex: 'cost',
    key: 'cost',
    width: 140,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '成交',
    dataIndex: 'totalDeal',
    key: 'totalDeal',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: 'ROI',
    dataIndex: 'roi',
    key: 'roi',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '大投计划数',
    dataIndex: 'bigPutAdCount',
    key: 'bigPutAdCount',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '大投率',
    dataIndex: 'bigPutRete',
    key: 'bigPutRete',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '大投成本',
    dataIndex: 'bigPutDeal',
    key: 'bigPutDeal',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '脚本数',
    dataIndex: 'scriptCount',
    key: 'scriptCount',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '视频数',
    dataIndex: 'videoCount',
    key: 'videoCount',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '混剪数',
    dataIndex: 'mixCutCount',
    key: 'mixCutCount',
    width: 100,
    ellipsis: true,
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    width: 80,
    scopedSlots: { customRender: 'operate' },
    fixed: 'right',
    customHeaderCell: () => ({ style: { height: '47px' } }),
  },
]
