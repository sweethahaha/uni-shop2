// 导入vue和vuex
import Vue from 'vue'
import Vuex from 'vuex'

import cart from './cart.js'
import user from './user.js'
// 将vuex安装为Vue的插件
Vue.use(Vuex)

// 创建store的实例对象
const store = new Vuex.Store({
  // 挂载store模块
  modules:{cart,user}
})
// 向外共享store的实例对象
export default store