<!--
 * @Author: lizheng
 * @Date: 2021-03-24 15:08:17
 * @LastEditTime: 2021-03-30 16:55:41
 * @LastEditors: Please set LastEditors
 * @Description: 产品报表 - 数据指标
 * @FilePath: \ads\pages\statement\production-statment\production-statment-statistic.vue
-->

<template>
  <div class="statistics-wrap">
    <div class="statistics">
      <a-icon
        :disabled="isShowLeftIcon"
        class="icon"
        type="left-circle"
        v-show="isShowLeftIcon"
        @click="handleTranslate"
      />
      <div ref="statisticsWrap" class="statistics-item-wrap">
        <div ref="statistics" class="statistics-item">
          <a-card
            ref="statisticsCard"
            :class="['statistics-item-card', item.active ? 'active' : '']"
            v-for="(item, index) in cardArr"
            :key="item.name"
            @click="handleSelectClick(item, index)"
          >
            <a-statistic
              :title="item.name"
              :value="item.value"
              :precision="2"
              :value-style="{ color: '#333', fontWeight: 600 }"
              style="margin-right: 50px"
            />
          </a-card>
        </div>
      </div>
      <a-icon
        v-show="isShowRightIcon"
        class="icon"
        type="right-circle"
        @click="handleTranslate('right')"
      />
    </div>

    <div class="statistics-tip" v-show="tagArr.length">
      <span class="statistics-tip-text"><a-badge status="processing" text="已选指标：" /></span>
      <div class="statistics-tip-item" v-if="tagArr.length">
        <a-tag
          class="statistics-tip-item__tag"
          closable
          color="#1890ff"
          v-for="(item, idx) in tagArr"
          v-model="item.active"
          :key="item.name"
          @close="handleTagCloseClick(idx, item)"
        >
          {{ item.name }}
        </a-tag>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      // 数据指标card总数
      this.permanentCardArr = [
        { key: 'view', value: '—', active: false, name: '商品浏览量' },
        { key: 'visited', value: '—', active: false, name: '商品访客数' },
        { key: 'sellPrice', value: '—', active: false, name: '商品销售额' },
        { key: 'sales', value: '—', active: false, name: '销量' },
        { key: 'orderCount', value: '—', active: false, name: '订单数' },
        { key: 'convertRate', value: '—', active: false, name: '转化率' },
        { key: 'shopCart', value: '—', active: false, name: '购物车' },
        { key: 'totalNewAd', value: '—', active: false, name: '新建计划数' },
        { key: 'totalTestAd', value: '—', active: false, name: '测试计划数' },
        { key: 'totalBigPutAd', value: '—', active: false, name: '大投计划数' },
        { key: 'cost', value: '—', active: false, name: '消耗-巨量' },
        { key: 'totalDeal', value: '—', active: false, name: '成交-淘客' },
      ]

      return {
        params: {},
        // 已选择的指标
        tagArr: [],
        // 数据指标card当前展示数
        cardArr: this.permanentCardArr,

        // icon显示与点击的次数
        iconBtnClickCount: 0,
        isShowRightIcon: true,
        isShowLeftIcon: false,
      }
    },

    computed: {},

    methods: {
      // 数据初始化
      getTotalData(data, params) {
        this.params = params
        this.permanentCardArr.forEach(
          (item) =>
            (item.value =
              item.key === 'convertRate'
                ? `${data[item.key] ? data[item.key] : '0.00'}%`
                : data[item.key])
        )
        this.cardArr = this.permanentCardArr
      },

      getPieData(item) {
        const params = { queryParam: item.key, ...this.params }
        delete params.type
        this.$API.getProductStatementPie(params).then(({ code, data }) => {
          if (code === 0) {
            this.$emit('onChange', data, { length: this.tagArr.length, ...item })
          }
        })
      },

      // 点击标签关闭
      handleTagCloseClick(idx, item) {
        this.tagArr.splice(idx, 1)
        this.$emit('onChange', [], { opType: 'cancel', length: this.tagArr.length, ...item })
      },

      // 点击卡片获取折线图数据的搜素表单校验证
      handleVerifyField() {
        const paramsArr = ['productId', 'timeStart', 'timeEnd', 'timeGroupBy']
        const tempArr = paramsArr.map((item) => this.params[item]).filter((list) => list)
        if (tempArr.length < 4) {
          this.$message.warning('请先选择产品或者时间段！')
          return false
        }
        return true
      },

      // 选择卡片类型: 分为数值类型与百分比类型的卡片
      // 操作类型有： 单选与多选、 单击与双击
      handleSelectClick(item) {
        const percentKeyArr = ['convertRate'] // 百分比的数据单独拿出来
        if (!this.handleVerifyField()) return
        if (!item.active) {
          if (this.tagArr.length >= 4) return this.$message.warning('最多只能选择4个数据指标！')
          const idx = this.tagArr.findIndex(({ key }) => percentKeyArr.includes(key))
          item.active = true
          if (idx >= 0) {
            // 说明百分比数据的card已选
            const cidx = this.permanentCardArr.findIndex(({ key }) => percentKeyArr.includes(key))
            cidx >= 0 && (this.permanentCardArr[cidx].active = false)
            this.tagArr.splice(idx, 1, item)
          } else {
            item.key === 'convertRate' ? (this.tagArr = [item]) : this.tagArr.push(item)
            item.key === 'convertRate' &&
              this.permanentCardArr.forEach(
                (list) => (list.active = list.key === 'convertRate' ? true : false)
              )
          }
          this.getPieData(item)
        } else {
          const index = this.tagArr.findIndex(({ name }) => name === item.name)
          item.active = false
          this.tagArr.splice(index, 1)
          this.$emit('onChange', [], { opType: 'cancel', length: this.tagArr.length, ...item })
        }
      },

      // 点击左右箭头Icon切换数据，此算法基于permanentCardArr.length大于8有效
      handleTranslate(opType) {
        const wrapNode = this.$refs.statisticsWrap
        const cardNode = this.$refs.statisticsCard[0]
        const cardWidth = cardNode.$el.offsetWidth // 数据据指标单个卡片的宽度
        const xlCount = 8 // 大屏显示8个card xl >= 1610
        const mdCount = 7 // 中屏显示7个card  1450 < md < 1600
        const smCount = 6 // 小屏显示6个card sm <= 1440

        if (wrapNode.offsetWidth >= cardWidth * xlCount) {
          this.handleTranslateCal(opType, xlCount)
        } else if (wrapNode.offsetWidth >= cardWidth * mdCount) {
          this.handleTranslateCal(opType, mdCount)
        } else {
          this.handleTranslateCal(opType, smCount)
        }
      },

      // 根据不同的屏幕分辨率显示permanentCardArr不同位置的数据
      handleTranslateCal(opType, showCardCount) {
        if (opType === 'right') {
          this.iconBtnClickCount += 1
          this.isShowLeftIcon = true
          this.cardArr = this.permanentCardArr.filter((item, idx) => idx > showCardCount - 1)
          this.isShowRightIcon =
            this.iconBtnClickCount * showCardCount + this.cardArr.length >=
            this.permanentCardArr.length
              ? false
              : true
        } else {
          if (!this.iconBtnClickCount) return (this.isShowLeftIcon = false)
          const max = (this.iconBtnClickCount - 1) * showCardCount
          const min = this.iconBtnClickCount * showCardCount
          this.cardArr = this.permanentCardArr.filter((i, idx) => idx >= max && idx < min)
          this.iconBtnClickCount -= 1
          if (!this.iconBtnClickCount) {
            this.isShowRightIcon = true
            this.isShowLeftIcon = false
          }
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .center-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .statistics-wrap {
    width: 100%;
    .statistics {
      .center-between();
      justify-content: space-evenly;
      width: 100%;
      height: 120px;
      overflow: hidden;

      &-item-wrap {
        display: flex;
        width: calc(100% - 102px);
        margin: 0 15px;
        overflow-x: hidden;
        .center-between();

        @media screen and (max-width: 1280px) {
          .statistics-item .statistics-item-card {
            width: 155px;
          }
        }
        @media screen and (min-width: 1290px) and (max-width: 1440px) {
          max-width: 960px;
        }
        @media screen and (min-width: 1450px) and(max-width: 1600px) {
          max-width: 1120px;
        }
        @media screen and (min-width: 1610px) {
          .statistics-item .statistics-item-card {
            width: 197px;
          }
        }
      }

      &-item {
        .center-between();
        height: 120px;
        align-items: flex-start;

        .active {
          cursor: pointer;
          &::before {
            content: ' ';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background-color: #1890ff;
          }
        }

        &-card {
          position: relative;
          width: 160px;
          transition: 0.3s linear;
          border: 1px solid #ebeef5;
          border-top: none;
          border-left: none;
          border-radius: 0;

          &:hover {
            cursor: pointer;
          }

          /deep/ .ant-card-body {
            overflow: hidden;
            padding: 20px 8px;
          }
        }

        &:first-child {
          .statistics-item-card:first-child {
            border-left: 1px solid #ebeef5;
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

    .statistics-tip {
      display: flex;
      margin-top: 15px;
    }
  }
</style>
