/*
 * @Author: lizheng
 * @Date: 2020-11-13 09:46:13
 * @LastEditTime: 2021-09-27 10:16:37
 * @LastEditors: Please set LastEditors
 * @Description: 公共方法
 * @FilePath: \oms\utils\utils.js
 */
import Cookie from 'js-cookie'

export default {
  // 获取服务端cookie
  getCookiesInServer: (req) => {
    const serviceCookie = {}
    req &&
      req.headers.cookie &&
      req.headers.cookie.split(';').forEach((val) => {
        const parts = val.split('=')
        serviceCookie[parts[0].trim()] = (parts[1] || '').trim()
      })
    return serviceCookie
  },
  // 获取客户端cookie
  getCookiesInClient: (key) => {
    return Cookie.get(key) ? Cookie.get(key) : ''
  },
  oneOf: (ele, targetArr) => {
    if (targetArr.indexOf(ele) >= 0) {
      return true
    } else {
      return false
    }
  },
  showThisRoute (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
      return this.oneOf(currentAccess, itAccess)
    } else {
      return itAccess === currentAccess
    }
  },
}

// 数组去重 （包括应用类型）
export const unique = (array) => {
  let obj = {}
  return array.filter((item) => {
    return obj.hasOwnProperty(typeof item + JSON.stringify(item))
      ? false
      : (obj[typeof item + JSON.stringify(item)] = true)
  })
}

// 函数防抖
export const debounce = (func, wait, immediately = false) => {
  let timer
  let debounced = function (...args) {
    let result
    // 清除闹钟后，闹钟还是存在的
    if (timer) clearTimeout(timer)
    if (immediately) {
      let called = !timer
      timer = setTimeout(() => (timer = null), wait)
      if (called) result = func.apply(this, args)
    } else {
      timer = setTimeout(() => func.apply(this, args), wait)
    }
    return result
  }
  debounced.cancel = function () {
    clearTimeout(timer)
    timer = null
  }
  return debounced
}

// table表头可伸缩
// jsx - 渲染表格头部单元格 render()
export const resizeableTitle = (h, props, children, columns, Vue) => {
  const draggingMap = {}
  columns.forEach(({ key, dataIndex, width }) => {
    draggingMap[key ? key : dataIndex] = width
  })
  const draggingState = Vue.observable(draggingMap)
  let thDom = null
  const { key, ...restProps } = props
  const col = columns.find((col) => {
    const k = col.dataIndex ? col.dataIndex : col.key
    return k === key
  })

  // 若table的字段没设置固定宽度， 默认返回
  if (!col || !col.width) {
    return <th {...restProps}>{children}</th>
  }

  // 拖动
  const onDrag = (x) => {
    draggingState[key] = 0
    col.width = Math.max(x, 1)
  }

  // 拖动结束
  const onDragstop = () => (draggingState[key] = thDom.getBoundingClientRect().width)

  return (
    <th {...restProps} v-ant-ref={(r) => (thDom = r)} width={col.width} class="resize-table-th">
      {children}
      <vue-draggable-resizable
        key={col.key}
        class="table-draggable-handle"
        w={10}
        x={draggingState[key] || col.width}
        z={1}
        axis="x"
        draggable={true}
        resizable={false}
        onDragging={onDrag}
        onDragstop={onDragstop}
      />
    </th>
  )
}

// 获取时间范围
export const getDateRange = (that) => ({
  今天: [that.moment(), that.moment()],
  昨天: [that.moment().subtract(1, 'days'), that.moment()],
  过去7天: [that.moment().subtract(6, 'days'), that.moment()],
  过去30天: [that.moment().subtract(30, 'days'), that.moment()],

  本周: [
    that.moment().startOf('week'),
    that.moment().endOf('week') >= that.moment() ? that.moment() : that.moment().endOf('week'),
  ],

  上周: [
    that
      .moment()
      .startOf('week')
      .subtract(1, 'week'),
    that
      .moment()
      .endOf('week')
      .subtract(1, 'week'),
  ],

  本月: [
    that.moment().startOf('month'),
    that.moment().endOf('month') >= that.moment() ? that.moment() : that.moment().endOf('month'),
  ],

  上月: [
    that
      .moment()
      .startOf('month')
      .subtract(1, 'month'),
    that
      .moment()
      .endOf('month')
      .subtract(1, 'month'),
  ],
})

// 星期映射
export const weekDayMapping = (key) => {
  const keyMapping = {
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
    7: '星期日',
  }
  return keyMapping[key]
}

// 根据每日的字符串转换为每天的时间段
export const setDayRangeMaping = (sum) => {
  let count = sum / 2
  let mCount = Math.ceil(count)
  if (sum % 2 == 0) {
    return `${count - 1}:30~${count}:00`
  } else {
    return `${mCount - 1}:00~${mCount - 1}:30`
  }
}

/**
 * 时间段映射
 * 投放时段，默认全时段投放，格式是48*7位字符串，且都是0或1。
 * 也就是以半个小时为最小粒度，周一至周日每天分为48个区段，0为不投放，1为投放，不传、全传0、全传1均代表全时段投放。
 * 例如："
  000000000000000000000001111000000000000000000000000000000000000000000001111000000000000000000000000
  00000000000000000000111100000000000000000000000000000000000000000000111100000000000000000000000000000000000
  0000000001111000000000000000000000000000000000000000000001111000000000000000000000000000000000000000000001111000000000000000000000"
 * 则投放时段为周一到周日的11:30~13:30
 */

export const dateRangeMapping = (scheduleTime) => {
  let trueIdx = null
  if (String(scheduleTime).length !== 48 * 7) return ''
  const weekRangeMap = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] }
  const dateRange = {
    星期一: [],
    星期二: [],
    星期三: [],
    星期四: [],
    星期五: [],
    星期六: [],
    星期日: [],
  }

  scheduleTime.split('').forEach((num, index) => {
    trueIdx = index + 1
    // 根据字符串进行星期划分
    if (trueIdx <= 48) {
      weekRangeMap[1].push(num)
    } else if (trueIdx <= 48 * 2) {
      weekRangeMap[2].push(num)
    } else if (trueIdx <= 48 * 3) {
      weekRangeMap[3].push(num)
    } else if (trueIdx <= 48 * 4) {
      weekRangeMap[4].push(num)
    } else if (trueIdx <= 48 * 5) {
      weekRangeMap[5].push(num)
    } else if (trueIdx <= 48 * 6) {
      weekRangeMap[6].push(num)
    } else if (trueIdx <= 48 * 7) {
      weekRangeMap[7].push(num)
    }
  })

  // 根据星期下的字符串进行每天的时间段划分
  for (const [key, value] of Object.entries(weekRangeMap)) {
    value.forEach(
      (item, idx) => Number(item) && dateRange[weekDayMapping(key)].push(setDayRangeMaping(idx + 1))
    )
  }
  return dateRange
}

export const screen = (key) => {
  switch (key) {
    case '1':
      return '星期一'
    case '2':
      return '星期二'
    case '3':
      return '星期三'

    case '4':
      return '星期四'

    case '5':
      return '星期五'

    case '6':
      return '星期六'
    case '7':
      return '星期日'
    default:
      return ''
  }
}

export const setItemDate = (sum) => {
  let count = sum / 2
  let mCount = Math.ceil(count)
  if (sum % 2 == 0) {
    return `${count - 1}:30~${count}:00`
  } else {
    return `${mCount - 1}:00~${mCount - 1}:30`
  }
}

// 深拷贝
export const deepCopy = (dst, src) => {
  if (util.typeOf(src) === 'Object' && util.typeOf(dst) === 'Object') {
    Object.keys(src).forEach((key) => {
      if (util.typeOf(src[key]) === 'Object' && !(src[key] instanceof Node)) {
        if (!dst[key]) {
          dst[key] = src[key]
        } else {
          util.deepCopy(dst[key], src[key])
        }
      } else if (util.typeOf(src[key]) === 'Array') {
        dst[key] = util.typeOf(dst[key]) === 'Array' ? dst[key].concat(src[key]) : src[key]
      } else {
        dst[key] = src[key]
      }
    })
    return dst
  }
}

// 判空，当前只能进行一级判空，无法进行对象中的对象/数组判空，之后迭代
export const judgeEmpty = (obj) => {
  // 传入的对象长度
  const objLength = Object.keys(obj).length
  /**
   * emptyLength 为空值的对象属性有几个
   * emptyField 为空值所属字段名
   */
  let emptyLength = 0,
    emptyField = []
  for (let key in obj) {
    if (obj[key]) {
      emptyLength++
    } else {
      emptyField.push(key)
    }
  }
  return {
    emptyField,
    objLength,
    emptyLength,
  }
}

// 复制功能
export const copyText = (text, callback) => {
  let generateDom = ''
  let inputText = document.createElement('input')
  inputText.value = text
  inputText.type = 'input'
  inputText.style = 'position: fixed;top: 999px;left: -999px;'
  inputText.id = 'copy-text'

  document.getElementsByTagName('html')[0].appendChild(inputText)
  generateDom = document.getElementById('copy-text')
  generateDom.select()
  document.execCommand('Copy')
  document.getElementsByTagName('html')[0].removeChild(generateDom)
  callback()
}

// 小数点后两位补零
export const strPointTwo = (value) => {
  let tempArr
  if(value)  {
    tempArr = value.toString().split(".")
    tempArr.length === 1 && (value = value.toString() + ".00")
    tempArr.length > 1 && tempArr[1].length < 2 && (value = value.toString() + "0")
    tempArr.length > 1 && !tempArr[1] && (value = value.toString() + "0")
  } else {
    value = '0.00'
  }
  return value
}
