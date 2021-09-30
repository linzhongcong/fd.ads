<!--
 * @Author: lizheng
 * @Date: 2021-04-07 13:18:09
 * @LastEditTime: 2021-07-20 16:14:47
 * @LastEditors: Please set LastEditors
 * @Description: 新建广告计划 - 投放时间段
 * @FilePath: \ads\components\select-table-time.vue
-->

<template>
  <div class="calendar">
    <div ref="tbody" class="schedule" :style="scheduleStyle" />

    <table class="calendar-table">
      <thead class="calendar-head">
        <tr>
          <th rowspan="8" class="week-td">星期/时间</th>
          <th colspan="24" style="padding: 10px 0">00:00 - 12:00</th>
          <th colspan="24" tyle="padding: 10px 0">12:00 - 24:00</th>
        </tr>
        <tr>
          <td colspan="2" v-for="cell in 24" :key="cell">{{ cell - 1 }}</td>
        </tr>
      </thead>

      <tbody
        id="calendar-body"
        class="calendar-body"
        @mousemove="onMousemove"
        @mousedown="onMousedown"
        @mouseup="onMouseup"
      >
        <tr v-for="(day, idx) in days">
          <td>{{ day }}</td>
          <!-- @mouseover="hoverElement" -->
          <td
            class="calendar-time"
            v-for="cell in 48"
            :key="`${idx + 1},${cell}`"
            :data-id="`${idx + 1},${cell}`"
            @click="handleTableCellClick"
          />
        </tr>
      </tbody>
    </table>

    <!-- 已选择单元格提示信息 -->
    <div class="calendar-show">
      <div class="calendar-show-title">
        <span class="text">{{ viewDateArr.length ? '已选择时间段' : '可拖动鼠标选择时间段' }}</span>
        <span class="clear" @click="handleClearClick">清空</span>
      </div>
      <div>
        <div class="selected-item" v-for="(item, index) in viewDateArr" :key="index">
          <span>{{ item.title }}</span>
          <span v-for="(it, timeStrIndex) in item.arr" :key="timeStrIndex">
            {{ it }}
            <span v-if="timeStrIndex !== item.arr.length - 1">、</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { screen, setItemDate, debounce } from '~/utils/utils'
  export default {
    name: 'calendar-table',
    data() {
      this.hoverElement = debounce(this.hoverElement, 500)
      this.passValToParent = debounce(this.passValToParent, 1000)
      return {
        // 整体区域选中范围值， 不能代表当前选中的数据变量
        dateTimeId: [],
        // 时间显示值 & 日期
        viewDateArr: [],
        // 当前选中的数据变量
        selectedTimeVal: [],
        oldArr: [],
        left: 0,
        top: 0,
        clientX: 0,
        clientY: 0,
        // 进行区域的选中样式更新
        scheduleStyle: {},
        days: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
        // 初始点击坐标值
        starOrigin: {},
        // 移动时存在在表格移动中的最后一个与表格的接触点
        endTouchOrigin: {},
        isMouseMove: false,
      }
    },

    watch: {
      dateTimeId(val) {
        this.getSelectedDateVal()
        let viewDate = {},
          viewDateArr = [],
          timeStrArr = [],
          passVal = ''

        this.selectedTimeVal.map((e) => {
          let arr = e.split(',')
          // 日期转换
          if (!viewDate.hasOwnProperty(screen(arr[0]))) {
            viewDate[screen(arr[0])] = [arr[0], setItemDate(arr[1])]
          } else {
            if (!viewDate[screen(arr[0])].includes(setItemDate(arr[1]))) {
              viewDate[screen(arr[0])].push(setItemDate(arr[1]))
            }
          }
        })

        let dataArr = Object.keys(viewDate)
          .map((k) => viewDate[k])
          .sort((a, b) => Number(a[0]) - Number(b[0]))

        dataArr.forEach((ele, key) => {
          let firstTime = '',
            endTime = ''
          timeStrArr[key] = []
          this.viewDateArr[key] = []

          // 进行时间的分段/连续显示
          firstTime = ele[1].split('~')[0]

          ele.forEach((element, index) => {
            if (!index) return
            // 如果该值是最后一个的话 那直接将endTime设置为最后一个时间值
            if (index === ele.length - 1) {
              endTime = element.split('~')[1]
              return
            }
            // 没有其余情况 则直接设置值
            endTime = element.split('~')[1]

            // 判断是否是连续的时间值
            if (endTime !== ele[index + 1].split('~')[0]) {
              timeStrArr[key].push(`${firstTime}~${endTime}`)
              firstTime = ele[index + 1].split('~')[0]
            }
          })

          timeStrArr[key].push(`${firstTime}~${endTime}`)
          viewDateArr.push({
            title: screen(ele[0]),
            arr: timeStrArr[key],
          })
        })

        let tableDom = document.getElementsByClassName('calendar-time')
        tableDom.forEach((element, index) => {
          if (element.className.indexOf('bg') !== -1) {
            passVal += '1'
          } else {
            passVal += '0'
          }
        })
        // 传递至父组件
        this.passValToParent(passVal)

        this.viewDateArr = viewDateArr
      },
    },

    methods: {
      // 点击表格单元格 -> 获取时间段Id -> 处理单元格背景颜色
      handleTableCellClick(e) {
        e.preventDefault()
        this.isMousedown = false
        const currentCellDom = e.target
        const classNameList = Array.from(currentCellDom.classList)
        const timeId = currentCellDom.getAttribute('data-id')
        if (classNameList.includes('bg')) {
          currentCellDom.classList.remove('bg')
          this.dateTimeId = this.dateTimeId.filter((id) => id !== timeId)
        } else {
          currentCellDom.classList.add('bg')
          this.dateTimeId.push(timeId)
        }
      },

      // 经过某个td内容时 设置对应状态类
      hoverElement(e) {
        console.log(e)
      },

      // 清空已选数据以及单元格状态
      handleClearClick() {
        this.viewDateArr = []
        this.dateTimeId = []
        const cellList = document.getElementsByClassName('calendar-time')
        cellList.forEach((item) => item.classList.remove('bg'))
      },

      onMousemove(e) {
        e.preventDefault()
        if (!this.isMousedown) return false
        const { clientX, clientY } = e
        // 判断鼠标移动 是否从上右下三边移出
        if (
          e.y <= this.getDomBoundingClient('calendar-body').top + 5 ||
          e.y >= this.getDomBoundingClient('calendar-body').bottom - 5 ||
          e.x >= this.getDomBoundingClient('calendar-body').right - 5
        ) {
          let domOrigin = {
            x: Number(this.changeDataType(e.target.dataset.id, ',')[0]),
            y: Number(this.changeDataType(e.target.dataset.id, ',')[1]),
          }
          this.setAreaScope(domOrigin, domOrigin)
          this.resetSelected()
          return
        }
        // e.target.dataset.id 表示鼠标在时间范围内移动
        if (e.target.dataset.id) {
          this.isMouseMove = true
          let left = this.left,
            top = this.top,
            width = 0,
            height = 0
          // 判断滑动方向
          width = Math.abs(clientX - this.clientX)
          height = Math.abs(clientY - this.clientY)
          this.endTouchOrigin = {
            x: Number(this.changeDataType(e.target.dataset.id, ',')[0]),
            y: Number(this.changeDataType(e.target.dataset.id, ',')[1]),
          }
          // x轴向左
          if (clientX < this.clientX) {
            left = this.left - width
          }
          if (clientY < this.clientY) {
            top = this.top - height
          }
          this.scheduleStyle = {
            width: `${width}px`,
            height: `${height}px`,
            display: 'block',
            opacity: 0.6,
            left: `${left}px`,
            top: `${top}px`,
          }
        } else {
          // 左边的边界值处理
          this.setAreaScope(this.endTouchOrigin, this.endTouchOrigin)
          this.resetSelected()
        }
      },

      // 鼠标按下事件
      onMousedown(e) {
        e.preventDefault()
        this.isMousedown = true
        if (e.target.dataset.id) {
          let { clientX, clientY } = e

          // 存储最后一次在时间选择中的值
          this.left = e.pageX
          this.top = e.pageY
          this.clientX = clientX
          this.clientY = clientY
          // 判断滑动方向
          this.scheduleStyle = {
            width: `0px`,
            height: `0px`,
            display: 'block',
            opacity: 0.6,
            left: `${clientX}px`,
            top: `${clientY}px`,
          }
          this.starOrigin = {
            x: Number(this.changeDataType(e.target.dataset.id, ',')[0]),
            y: Number(this.changeDataType(e.target.dataset.id, ',')[1]),
          }
        } else {
          this.resetSelected()
        }
      },

      onMouseup(e) {
        e.preventDefault()
        if (this.isMousedown && this.isMouseMove && e.target.dataset.id) {
          let dataId = e.target.dataset.id
          let lastPosition = {
            x: Number(this.changeDataType(dataId, ',')[0]),
            y: Number(this.changeDataType(dataId, ',')[1]),
          }

          this.isMousedown = false
          this.isMouseMove = false
          this.oldArr = this.dateTimeId
          this.scheduleStyle = {
            width: '0px',
            height: '0px',
            display: 'none',
            opacity: 0,
          }

          // 防止用户在点击时有微小拖拽，导致最后出现明明选中但效果却是没有选中的效果
          if (
            Math.abs(lastPosition.x - this.starOrigin.x) < 1 &&
            Math.abs(lastPosition.y - this.starOrigin.y) < 1
          )
            return

          this.setAreaScope(dataId, lastPosition)
        } else {
          this.resetSelected()
        }
      },

      // 字符串 -> 数组
      changeDataType(string, symbolType = ',') {
        return string.split(symbolType)
      },

      // 返回对比之后的数据
      numberCompare(obj, type = 'greater') {
        if (type === 'greater') {
          return {
            x: Math.max(obj.x, this.starOrigin.x),
            y: Math.max(obj.y, this.starOrigin.y),
          }
        }
        return {
          x: Math.min(obj.x, this.starOrigin.x),
          y: Math.min(obj.y, this.starOrigin.y),
        }
      },

      // 返回对应的区间坐标范围数组值
      returnAreaScopeArray(maxCoordinate, minCoordinate) {
        // 获取对应的X轴范围坐标
        let coordinateXArray = Array.from(
          { length: maxCoordinate.x - minCoordinate.x + 1 },
          (v, k) => {
            return minCoordinate.x + k
          }
        )

        // 获取对应的Y轴范围坐标
        let coordinateYArray = Array.from(
          { length: maxCoordinate.y - minCoordinate.y + 1 },
          (v, k) => {
            return minCoordinate.y + k
          }
        )
        return {
          coordinateXArray,
          coordinateYArray,
        }
      },

      // 选中区间值的设置 及 选中值的赋值
      setAreaScope(dataId, lastPosition) {
        let maxCoordinate = this.numberCompare(lastPosition, 'greater')
        let minCoordinate = this.numberCompare(lastPosition, 'less')

        let { coordinateXArray, coordinateYArray } = this.returnAreaScopeArray(
          maxCoordinate,
          minCoordinate
        )
        /**
         * 用户选中的范围分类
         * 存储当前用户选中的数据 - 局部范围 - temporaryData
         * 整体范围 - this.dateTimeId
         */
        let temporaryData = []

        // 进行范围坐标设置
        for (let xValue of coordinateXArray) {
          for (let yValue of coordinateYArray) {
            this.dateTimeId.push(`${xValue},${yValue}`)
            temporaryData.push(`${xValue},${yValue}`)
          }
        }

        // 去重
        this.dateTimeId = [...new Set(this.dateTimeId)]

        /**
         * 获取鼠标按下的第一个元素的状态
         * 利用该状态来处理其余元素是否选中
         *
         * temporaryData 该变量是用户每次重新获取的范围变量
         * this.dateTimeId 该变量是存储当前用户多次操作的时间值变量
         */
        let statu = document
          .querySelector(`td[data-id='${this.starOrigin.x},${this.starOrigin.y}']`)
          .className.indexOf('bg')
        for (let key in temporaryData) {
          let dom = document.querySelector(`td[data-id='${temporaryData[key]}']`)
          if (!dom) return
          if (statu !== -1) {
            dom.classList.remove('bg')
            this.dateTimeId = this.dateTimeId.filter((id) => id !== dataId)
          } else {
            dom.classList.add('bg')
          }
        }
      },

      // 重新设置滑动变量及选中效果框
      resetSelected() {
        this.isMousedown = false
        this.isMouseMove = false
        this.scheduleStyle = {
          width: '0px',
          height: '0px',
          display: 'block',
          opacity: 0,
          left: '0',
          top: '0',
        }
      },

      // 获取某节点的属性
      getDomBoundingClient(el) {
        return document.getElementById(el).getBoundingClientRect()
      },

      // 获取已选中的时间数值
      getSelectedDateVal() {
        this.selectedTimeVal = []
        let selectedDom = document.getElementsByClassName('bg')
        for (let key in selectedDom) {
          selectedDom[key].dataset && this.selectedTimeVal.push(selectedDom[key].dataset.id)
        }
      },

      // 传递值至父类组件
      passValToParent(params) {
        this.$emit('putInDate', params)
      },
    },
  }
</script>

<style lang="less" scoped>
  *,
  :after,
  :before {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  table {
    border-spacing: 0;
  }

  .calendar {
    background-color: #fff;
    position: relative;
    display: inline-block;
    user-select: none;
    .schedule {
      position: fixed;
      width: 0;
      height: 0;
      top: 0;
      left: 0;
      display: block;
      background: #2f88ff;
      pointer-events: none;
    }

    &-table {
      border-collapse: collapse;
      border-radius: 4px;

      .week-td {
        padding: 0 5px;
      }

      tr,
      td,
      th {
        border: 1px solid #e4e9ed;
        font-size: 12px;
        text-align: center;
        min-width: 11px;
        height: 30px;
      }

      thead {
        th,
        td {
          background: #f8f9fa;
        }
      }

      .calendar-body {
        tr {
          td {
            border: 1px solid #e4e9ed;

            &.selected {
              background-color: #2f88ff;
            }
          }

          & > td:first-child {
            background-color: #f8f9fa;
          }
        }
      }
    }

    &-show {
      border: 1px solid #e4e9ed;
      border-top: none;
      padding: 11px;
      max-width: 594px;

      &-title {
        display: flex;

        .text {
          width: 95%;
          text-align: center;
          color: #333;
          font-size: 12px;
          padding-left: 20px;
        }

        .clear {
          width: 5%;
          text-align: right;
          color: #1890ff;
          cursor: pointer;
        }
      }
      .selected-item {
        margin: 5px;
      }
    }
  }

  td::selection {
    background: rgba(0, 0, 0, 0);
  }

  th::selection {
    background: rgba(0, 0, 0, 0);
  }

  .bg {
    background: #2f88ff;
  }
</style>
