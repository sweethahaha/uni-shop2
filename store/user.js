const state = {
  address:JSON.parse(uni.getStorageSync('address') || '{}')
}
const mutations = {
  // 更新收货地址、
  updateAddress(state,address) {
    state.address = address
    this.commit('user/saveAddressToStorage')
  },
  saveAddressToStorage(state) {
    uni.setStorageSync('address',JSON.stringify(state.address))
  }
}
const actions = {}
const getters = {
  addstr(state) {
    if(!state.address.provinceName) return ''
   return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
  }
}
export default {
  namespaced:true,
  state,
  mutations,
  actions,
  getters
}