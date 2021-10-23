<!--
 * @Author: xieguiting
 * @Date: 2021-10-15 10:52:52
 * @LastEditTime: 2021-10-20 10:46:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ads.fandow.com\pages\statement\component\tag-statistic.vue
-->
<template>
  <div class="tagswiper-box">
    <div class="btn lbtn">
      <!-- <a-icon
        type="left-circle"
        :disabled="
          Math.abs(+position.left.slice(0, position.left.length - 1)) > (list.length - 5) * 20
        "
        class="icon"
        @click="moveTag('left', -20)"
      ></a-icon> -->
      <a-button
        type="default"
        shape="circle"
        icon="left"
        :disabled="
          Math.abs(+position.left.slice(0, position.left.length - 1)) >= (list.length - 5) * 20
        "
        @click="moveTag('left', -20)"
      ></a-button>
    </div>
    <div class="tag-content">
      <ul :style="position">
        <li
          v-for="(item, index) in dataList"
          @click="onTab(item)"
          :class="item.active ? 'active' : ''"
          :key="'t' + index"
        >
          <div class="title">
            {{ item.label }}
            <a-tooltip max-width="500" placement="top" transfer v-show="item.hint">
              <div slot="content" v-html="item.hint"></div>
              <!-- <Icon type="ios-help-circle" size="20" /> -->
            </a-tooltip>
          </div>
          <h3>{{ item.value }}</h3>
        </li>
      </ul>
    </div>
    <div class="btn rbtn">
      <!-- <a-icon
        type="right-circle"
        :disabled="position.left === '0%'"
        class="icon"
        @click="moveTag('left', 20)"
      ></a-icon> -->
      <a-button
        type="default"
        shape="circle"
        icon="right"
        :disabled="position.left === '0%'"
        @click="moveTag('left', 20)"
      ></a-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      list: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        dataList: [],
        position: {
          left: '0%',
          transition: 'left 1s',
        },
        isShow: true,
      }
    },
    methods: {
      onTab(item) {
        if (!item.value && item.value !== 0) return
        if (this.dataList.filter((item) => item.active).length >= 2 && !item.active) return
        item.active = !item.active
        this.$emit(
          'ontab',
          this.dataList.filter((item) => item.active)
        )
      },
      clonList() {
        this.dataList = this.list.map((item) => {
          return {
            label: item.label,
            value: item.value,
            id: item.id,
            active: item.active,
            hint: item.hint,
          }
        })
      },
      moveTag(x, y) {
        this.position[x] = `${+this.position[x].slice(0, this.position[x].length - 1) + y}%`
      },
    },
    mounted() {
      this.clonList()
    },
    watch: {
      list: {
        immediate: true,
        handler() {
          this.clonList()
        },
      },
    },
  }
</script>

<style lang="less" scoped>
  .tagswiper-box {
    width: 100%;
    min-width: 1000px;
    padding: 0 40px;
    position: relative;
    min-height: 103px;
    .btn {
      width: 32px;
      height: 32px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .lbtn {
      left: 2px;
    }
    .rbtn {
      right: 2px;
    }
    .tag-content {
      width: 100%;
      overflow: hidden;
      position: relative;
      height: 105px;
      > ul {
        min-width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        border-left: solid #ccc 1px;
        padding-left: 0;
        display: -webkit-box;
        > li {
          height: 105px;
          width: 20%;
          //float: left;
          color: #000;
          list-style: none;
          border: solid #ccc 1px;
          border-left: none;
          padding: 20px 0;
          cursor: pointer;
          .title {
            padding-left: 15px;
            color: #999999;
            padding-bottom: 5px;
          }
          h3 {
            padding-left: 15px;
            font-size: 1.5rem;
          }
        }
        > .active {
          position: relative;
          &:after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background-color: #08a4ff;
            height: 4px;
          }
        }
      }
    }
    .icon {
      font-size: 36px;
      background-color: rgba(31, 45, 61, 0.11);
      color: #fff;
      border: none;
      outline: none;
      transition: 0.3s;
      border-radius: 50%;
      &:hover {
        cursor: pointer;
        background-color: rgba(31, 45, 61, 0.23);
      }
    }
  }
</style>
