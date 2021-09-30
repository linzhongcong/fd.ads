/*
 * @Author: lizheng
 * @Date: 2021-01-19 14:44:57
 * @LastEditTime: 2021-03-22 17:30:42
 * @LastEditors: Please set LastEditors
 * @Description: 推广模块的全局共享数据
 * @FilePath: \ads\store\promotion.js
 */

export const state = () => ({
  adId: undefined, // 当前广告投放账号ID
  adName: '', // // 当前广告投放账号名称
  filterForm: {
    startDate: null,
    endDate: null,
  },
  drawerVisible: false,
  currentTab: 'ad',
})

export const mutations = {
  settingAdvertiserId(state, item) {
    const { advertiserId = undefined, advertiserName = '' } = item
    console.log('id, name', advertiserId, advertiserName)
    state.adId = advertiserId
    state.adName = advertiserName
    localStorage.setItem('adInfo', JSON.stringify(item))
  },

  // 全局条件筛选表单
  settingFilterForm(state, { type, ...form }) {
    if (type === 'filterDateSearch') {
      state.filterForm.startDate = form.startDate
      state.filterForm.endDate = form.endDate
    } else if (type === 'filterItemSearch') {
      // 广告组 / 计划 / 创意 三者ID不能共存
      const keysArr = Object.keys(form)
      if (keysArr.includes('campaignId')) {
        delete state.filterForm.adId
        delete state.filterForm.creativeId
      } else if (keysArr.includes('adId')) {
        delete state.filterForm.campaignId
        delete state.filterForm.creativeId
      } else if (keysArr.includes('creativeId')) {
        delete state.filterForm.campaignId
        delete state.filterForm.adId
      }
      state.filterForm = { ...state.filterForm, ...form }
      for (const key in form) state.filterForm[key] = form[key]
    } else if (type === 'filterClearSearch') {
      const tempForm = { ...state.filterForm, ...form }
      for (const [key, value] of Object.entries(tempForm)) !value && delete tempForm[key]
      state.filterForm = tempForm
    }
  },

  // 全局详情抽屉
  settingDrawerVisible(state, visible) {
    state.drawerVisible = visible
  },

  settingCurrentTab(state, name) {
    state.currentTab = name
  },
}

export const getters = {
  advertiserId(state) {
    return state.adId
  },

  advertiserName(state) {
    return state.adName
  },
}
