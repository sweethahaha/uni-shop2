const state = {
  address:JSON.parse(uni.getStorageSync('address') || '{}'),
  token:uni.getStorageSync('token') || '',
  // 用户的基本信息
  userinfo:JSON.parse(uni.getStorageSync('userinfo') || '{}'),
  // 重定向的对象{openType,from},用于登录成功后跳转回登录前的页面
  redirectInfo:null
}
const mutations = {
  updateRedirectInfo(state,redirevtInfo) {
    state.redirectInfo = redirevtInfo
    // console.log(state.redirectInfo);
  },
  // 更新收货地址、
  updateAddress(state,address) {
    state.address = address
    this.commit('user/saveAddressToStorage')
  },
  saveAddressToStorage(state) {
    uni.setStorageSync('address',JSON.stringify(state.address))
  },
  // 更新用户信息
  updateUserInfo(state,userinfo) {
    state.userinfo = userinfo
    // 持久化存储到本地
    this.commit('user/saveUserInfoToStorage')
  },
  // 持久化存储用户信息到本地函数
  saveUserInfoToStorage(state) {
    uni.setStorageSync('userinfo',JSON.stringify(state.userinfo))
  },
  // 更新token
  updateToken(state,token) {
    state.token = token
    this.commit('user/saveTokenToStorage')
  },
  // 持久化存储token
  saveTokenToStorage(state) {
    uni.setStorageSync('token',state.token)
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