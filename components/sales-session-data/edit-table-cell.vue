<!--
 * @Author: your name
 * @Date: 2021-09-18 13:20:35
 * @LastEditTime: 2021-09-27 10:20:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \oa-refactor.fandow.come:\my_work\ads.fandow.com\components\sales-session-data\edit-table-cell.vue
-->
<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <input @input="handleChange" class="ant-input" v-model="value">
      <a-icon type="check" class="editable-cell-icon-check" @click="check" />
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>

<script>
import { log } from '@antv/g2plot/lib/utils'
import { strPointTwo } from '@/utils/utils.js'
export default {
  props: ['text'],
  data() {
    return {
      value: this.text,
      editable: false,
    }
  },
  methods: {
    handleChange(e) {
      this.value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
    },
    check() {
      this.value = strPointTwo(this.value)
      this.editable = false
      this.$emit('change', this.value)
    },
    edit() {
      this.editable = true;
    },
  }
}
</script>
<style scoped>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
