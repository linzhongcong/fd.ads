<!--
 * @Author: lizheng
 * @Date: 2021-01-15 13:22:36
 * @LastEditTime: 2021-03-03 16:56:54
 * @LastEditors: Please set LastEditors
 * @Description: 自定义table column
 * @Description: 本组件的逻辑较为复杂，阅读需要做好一定的心里准备
 * @Description: checkbox选择区域与拖拽区域数据进行同步更新较为复杂
 * @Description: checkbox选择区域的全选按钮状态更新比非全选更复杂一些
 * @FilePath: \ads\components\custom-column-modal.vue
-->
<template>
  <div v-if="visible">
    <a-modal v-model="visible" destroyOnClose title="自定义列" :width="900" :maskClosable="false">
      <template slot="footer">
        <div class="custom-column-footer">
          <div class="custom-column-footer__left">
            <a-checkbox :checked="isShowForm" @change="saveColumns">
              保存为常用自定义列
              <a-popover>
                <template slot="content">
                  <p>保存后将应用于推广管理和所有报表页</p>
                </template>
                <a-icon type="question-circle" />
              </a-popover>
            </a-checkbox>
            <a-form-model
              :model="form"
              v-if="isShowForm"
              ref="form"
              layout="inline"
              style="margin-left:10px"
            >
              <a-form-model-item
                prop="name"
                labelAlign="left"
                style="margin:0"
                :rules="{ required: true, message: '常用自定义列名称不能为空', trigger: 'blur' }"
              >
                <a-input
                  allow-clear
                  v-model="form.name"
                  :maxLength="20"
                  placeholder="请输入自定义列名称"
                />
              </a-form-model-item>
            </a-form-model>
            <span v-if="isShowForm" style="margin-left:10px">{{ form.name.length }}/20</span>
          </div>
          <div>
            <a-button key="back" @click="closeModal">取消</a-button>
            <a-button key="submit" type="primary" @click="onSave">应用</a-button>
          </div>
        </div>
      </template>
      <a-input-search
        allow-clear
        style="width:300px"
        placeholder="可搜索列名称"
        v-model="columnName"
        @change="onChange"
        @search="onSearch"
      >
        <a-button type="primary" slot="enterButton">
          <a-icon type="search" />
          搜索
        </a-button>
      </a-input-search>

      <!-- 左侧column checkbox区域 -->
      <div class="column-modal-main">
        <div class="column-modal-main-left">
          <p class="panel-title-line">可添加的列</p>
          <div ref="columnModal" class="panel-content">
            <div v-if="columnsList.length">
              <a-anchor class="column-nav-area" :getContainer="() => $refs.columnModal">
                <a-anchor-link
                  v-for="(item, index) in anchorArr"
                  :key="item.parentLabel"
                  :title="item.parentLabel"
                  :href="item.href"
                >
                  <a-anchor-link
                    :href="`#${list.id}`"
                    :key="list.id"
                    :title="list.name"
                    v-for="list in item.children"
                  />
                </a-anchor-link>
              </a-anchor>
              <div class="column-select-area">
                <div
                  class="column-items column-group"
                  v-for="item in columnsList"
                  :key="item.id"
                  :id="item.id"
                >
                  <div class="group-title">
                    <span>{{ item.name }}</span>
                  </div>
                  <a-checkbox-group
                    :value="selectedColumns"
                    :name="item.id"
                    @change="changeCheckbox"
                  >
                    <a-row class="column-items">
                      <a-col :span="12" v-for="cList in item.checkboxList" :key="cList.label">
                        <a-checkbox :value="cList.value" @change="changeCheckboxItem">
                          {{ cList.label }}
                        </a-checkbox>
                      </a-col>
                    </a-row>
                  </a-checkbox-group>
                </div>
              </div>
            </div>
            <a-empty class="column-none column-none-left" v-else />
          </div>
        </div>

        <!-- 已选的字段拖动区域模块 -->
        <div class="column-modal-main-right">
          <div class="panel-title-line">
            <span>已经选择{{ columnSelectedList.length }}项</span>
            <a-button v-show="columnSelectedList.length" type="link" size="small" @click="clearAll">
              清空全部
            </a-button>
          </div>
          <draggable
            v-if="columnSelectedList.length"
            v-model="columnSelectedList"
            :dragOptions="dragOptions"
            @change="onDragChange"
          >
            <transition-group
              class="panel-selected"
              tag="div"
              type="transition"
              :name="!drag ? 'flip-list' : null"
            >
              <div
                class="selected-column-item"
                v-for="item in columnSelectedList"
                :key="item.dataIndex"
              >
                <a-icon type="drag" class="icon-drag" style="margin-right:5px" />
                <span class="icon-drag icon-drag-title">{{ item.title }}</span>
                <a-icon
                  type="close"
                  class="cursor icon-close"
                  @click="deleteColumn(item.dataIndex)"
                />
              </div>
            </transition-group>
          </draggable>
          <a-empty class="column-none" v-else />
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
  import Draggable from 'vuedraggable'
  import { columnsList } from '~/pages/promotion/contant'
  import { unique } from '~/utils/utils'

  export default {
    components: {
      Draggable,
    },

    data() {
      return {
        // 拖动模块的已选table字段
        columnSelectedList: [],
        // 选中的字段
        selectedColumns: ['adGroupSetting'],
        form: { name: '' },
        drag: false,
        columnName: '',
        // 当前点击的checkbox
        currentClick: {},
        // 自定义列 - 锚点分类
        anchorArr: this.getAnchor(columnsList),
        // 自定义列 - 勾选 checkbox模块
        columnsList: [],
        // 自定义列 - 全选对应有多少个checkbox
        allSelectedList: {},
        checked: false,
        visible: false,
        isShowForm: false,
      }
    },

    computed: {
      dragOptions() {
        return {
          animation: 200,
          group: 'description',
          disabled: false,
          ghostClass: 'ghost',
        }
      },
    },

    mounted() {
      this.initData()
    },

    methods: {
      initData() {
        this.columnsList = columnsList.map(({ children }) => children).flat()
        this.columnsList.forEach(({ id, checkboxList: [, ...item] }) => {
          this.allSelectedList[id] = item.map(({ value }) => value)
        })
      },

      openModal(data) {
        this.visible = data.visible
        this.selectedColumns = []
        this.columnSelectedList = []
      },

      // 关闭弹窗
      closeModal() {
        this.visible = false
        this.isShowForm = false
        this.form.name = ''
        this.$emit('onClose', this.isShowForm)
      },

      clearAll() {
        this.selectedColumns = []
        this.columnSelectedList = []
      },

      // 保存为常用的自定义列
      saveColumns(e) {
        this.isShowForm = e.target.checked ? true : false
      },

      getComponentData() {
        props: {
          dataSource: []
          size: 'small'
        }
      },

      // 删除某项table字段
      deleteColumn(key) {
        const index = this.columnSelectedList.findIndex(({ dataIndex }) => dataIndex === key)
        const idx = this.selectedColumns.findIndex((item) => item === key)
        this.columnSelectedList.splice(index, 1)
        this.selectedColumns.splice(idx, 1)
        this.handleUpdateSelecteAllCheckbox(key)
      },

      // 锚点列表
      getAnchor(list) {
        return list.map(({ parentLabel, href, children }) => ({
          parentLabel,
          href,
          children,
        }))
      },

      changeCheckboxItem(e) {
        this.currentClick.name = e.target.value
        this.currentClick.checked = e.target.checked
      },

      // checkbox选项值发生改变
      changeCheckbox(checkedValue) {
        const { name, checked } = this.currentClick
        // 各类标题的全选checkbox
        const allCheckboxField = this.columnsList.map(({ id }) => id)
        checked
          ? this.handleNotSelecteCheckbox(checkedValue, allCheckboxField)
          : this.handleSelectCheckBox(name, allCheckboxField)
      },

      // checkbox状态： 未选 -> 已选
      handleNotSelecteCheckbox(checkedValue, allCheckboxField) {
        const tempArr = []
        this.columnsList.forEach(({ id, checkboxList }) => {
          checkedValue.forEach((item) => {
            checkboxList.forEach(({ value, label }) => {
              if (item === value) {
                tempArr.push({ title: label, dataIndex: value })
              } else if (allCheckboxField.includes(item) && id === item && value !== item) {
                // 点击全选checkbox
                tempArr.push({ title: label, dataIndex: value })
                this.selectedColumns.push(value)
              }
            })
          })
        })
        this.columnSelectedList = unique([...this.columnSelectedList, ...tempArr]).filter(
          (item) => item.title !== '全选'
        )
        this.selectedColumns = unique([
          ...this.selectedColumns,
          ...tempArr.map(({ dataIndex }) => dataIndex),
        ])
        this.handleUpdateCheckbox(allCheckboxField)
      },

      // checkbox状态： 已选 -> 未选
      handleSelectCheckBox(name, selectAllCheckboxs) {
        let diffTypeCheckboxs = []
        const isAllSelectCheckbox = selectAllCheckboxs.includes(name)
        // 是否点击了全选的checkbox
        if (isAllSelectCheckbox) {
          diffTypeCheckboxs = this.selectedColumns.filter(
            (item) =>
              !this.allSelectedList[name].includes(item) && !selectAllCheckboxs.includes(item)
          )
          const allSelArr = this.selectedColumns.filter(
            (item) => selectAllCheckboxs.includes(item) && item !== name
          )

          this.selectedColumns = [...allSelArr, ...diffTypeCheckboxs]
          this.handleUpdateDrapList()
        } else {
          const idx = this.selectedColumns.findIndex((item) => item === this.currentClick.name)
          const index = this.columnSelectedList.findIndex(({ dataIndex }) => dataIndex === name)
          index >= 0 && this.columnSelectedList.splice(index, 1)
          if (idx >= 0) {
            this.selectedColumns.splice(idx, 1)
            this.handleUpdateSelecteAllCheckbox(name)
          }
        }
      },

      // 拖拽区域数据更新
      handleUpdateDrapList() {
        const list = this.columnSelectedList
        const listArr = list.filter(({ dataIndex }) => this.selectedColumns.includes(dataIndex))
        this.columnSelectedList = listArr
      },

      // 全选checkbox状态更新
      handleUpdateSelecteAllCheckbox(name) {
        let itemAllSelectArr = []
        for (const listKey in this.allSelectedList) {
          this.allSelectedList[listKey].includes(name) && itemAllSelectArr.push(listKey)
        }
        const allSelectIdx = this.selectedColumns.findIndex((item) => item === itemAllSelectArr[0])
        allSelectIdx >= 0 && this.selectedColumns.splice(allSelectIdx, 1)
      },

      // 各类型的checkbox已经选满则更新对应全选checkbox状态
      handleUpdateCheckbox(allCheckboxField) {
        let currentKey = ''
        const { name } = this.currentClick
        if (allCheckboxField.includes(name)) return
        for (const key in this.allSelectedList) {
          this.allSelectedList[key].includes(name) && (currentKey = key)
        }
        const notSelectedArr = this.allSelectedList[currentKey].filter(
          (item) => !this.selectedColumns.includes(item)
        )
        if (!notSelectedArr.length) this.selectedColumns.push(currentKey)
      },

      onChange() {
        if (!this.columnName) {
          this.columnsList = columnsList.map(({ children }) => children).flat()
        }
      },

      onDragChange(newList) {
        console.log('list', newList)
      },

      // 搜索字段
      onSearch(value) {
        const columnMatchList = []
        let tempArr = []

        // 对搜索操作进行 column checkbox 响应
        this.columnsList.forEach(({ id, name, checkboxList }) => {
          tempArr = checkboxList.filter(
            ({ label }) => label !== '全选' && label.includes(value.trim().toUpperCase())
          )
          tempArr.length &&
            columnMatchList.push({
              id,
              name,
              checkboxList: [{ checked: false, label: '全选' }, ...tempArr],
            })
        })
        this.columnsList = columnMatchList
      },

      // 保存选定值
      onSave() {
        if (this.isShowForm) {
          if (!this.form.name) return this.$message.error('常用自定义列名称不能为空')
          let customColumnsKeys = localStorage.getItem('customColumnsKeys')
          customColumnsKeys = customColumnsKeys ? JSON.parse(customColumnsKeys) : []
          customColumnsKeys.push({ name: this.form.name, keys: this.columnsList })
          localStorage.setItem('customColumnsKeys', JSON.stringify(customColumnsKeys))
        } else {
          localStorage.setItem('columnSelectedList', JSON.stringify(this.columnSelectedList))
        }
        this.closeModal()
      },
    },
  }
</script>

<style lang="less" scoped>
  p {
    margin: 0;
  }

  .cursor {
    cursor: pointer;
  }

  .custom-column-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__left {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .column-modal-main {
    margin-top: 16px;
    height: 445px;

    .panel-title-line {
      display: flex;
      justify-content: space-between;
      background-color: #f9fafd;
      border: #e4e9ed 1px solid;
      box-sizing: border-box;
      line-height: 22px;
      padding: 8px 12px;
    }

    .column-none {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-flow: column;
      height: 395px;
      width: 226px;
      border: 1px solid #e4e9ed;
      border-top: none;
      margin: 0;
    }

    &-left {
      width: 610px;
      float: left;
      margin-right: 16px;
      height: 445px;

      .panel-content {
        border: #e4e9ed 1px solid;
        border-top: 0;
        box-sizing: border-box;
        height: 395px;
        padding: 0;
        overflow: hidden;

        .column-nav-area {
          width: 180px;
          height: 395px;
          float: left;
          border-right: #e4e9ed 1px solid;
          overflow-y: auto;
          padding: 12px 0;

          /deep/ .ant-anchor-ink {
            display: none;
          }
        }

        .column-select-area {
          width: calc(100% -180px);
          height: 395px;
          overflow-y: auto;

          .column-group {
            border-bottom: #e4e9ed 1px solid;
            padding: 0 16px;

            .group-title {
              display: flex;
              align-items: center;
              cursor: pointer;
              line-height: 46px;
              font-size: 16px;
              color: #333;
              position: relative;
            }

            /deep/ .ant-checkbox-group {
              display: block;
              margin-bottom: 8px;
            }
          }
        }
      }
    }

    &-right {
      width: 226px;
      float: left;
      height: 445px;
      overflow: hidden;

      .icon-drag {
        cursor: move;
      }

      .icon-drag-title {
        display: inline-block;
        width: 126px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .selected-column-item {
        width: 100%;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 4px;
        background: #f8f8f8;
        margin-top: 8px;
        padding: 0 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border: 1px solid #e4e9ed;
      }

      .icon-close {
        font-size: 10px;
        margin-left: 12px;
      }

      .panel-selected {
        border: 1px solid #e4e9ed;
        border-top: 0;
        box-sizing: border-box;
        height: 392px;
        padding: 0 5px 12px 4px;
        overflow-y: auto;
      }

      /deep/ .ant-list-split .ant-list-header {
        padding: 0;
      }

      /deep/ .ant-list-item {
        border: none;
        padding: 0;
      }
    }
  }

  .flip-list-move {
    transition: transform 0.5s;
  }

  .no-move {
    transition: transform 0s;
  }
</style>
