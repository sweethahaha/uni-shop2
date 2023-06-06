const state = {
  cart:JSON.parse(uni.getStorageSync('cart') || '[]') 
}
const mutations = {
  addToCart(state,goods) {
    // 根据提交的商品的id，查询购物车中是否存在这件商品
    // 如果不存在，find返回值为undefined，否则，返回值为该商品对象
    const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
    if(!findResult) {
      state.cart.push(goods)
    }else {
      // 如果购物车中有这件商品，则只更新数量即可
      findResult.goods_count++
    }
    this.commit('cart/saveToStorage')
  },
  saveToStorage(state) {
    uni.setStorageSync('cart',JSON.stringify(state.cart))
  },
  // 更新商品是否选中状态
  updateGoodsState(state,goods) {
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if(findResult) {
        findResult.goods_state = goods.goods_state
        // 持久化存储到本地
        this.commit('cart/saveToStorage')
    }
  },
  // 更新商品数量
  updateGoodsCount(state,goods) {
    const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
    if(findResult) {
      findResult.goods_count = goods.goods_count
      // 持久化存储到本地
      this.commit('cart/saveToStorage')
    }
  },
  // 根据id从cart中删除对应的商品信息
  removeGoodsById(state,goods_id) {
    state.cart = state.cart.filter(item => item.goods_id !== goods_id)
    this.commit('cart/saveToStorage')
  },
  // 更新商品的全选状态
  updateAllGoodsState(state,newState) {
    state.cart.forEach(item => {
      if(item.goods_state !== newState) {
        item.goods_state = newState
      }
    })
  },
}
const actions = {}
const getters = {
  // 统计购物车中商品的总数量
  total(state) {
    // return 1
    return state.cart.reduce((previous,currentItem) =>{ 
      return previous + currentItem.goods_count
      },0)
  },
  // 勾选商品的总数量
  checkedCount(state) {
    return state.cart.reduce((previous,currentItem) =>{
      if(!currentItem.goods_state) return previous
      return previous + currentItem.goods_count
    },0)
  },
  // 计算已勾选商品的总价格
  checkedGoodsAmount(state) {
    return state.cart.filter(item => item.goods_state).reduce((pre,cur) => pre + cur.goods_price * cur.goods_count,0).toFixed(2)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}