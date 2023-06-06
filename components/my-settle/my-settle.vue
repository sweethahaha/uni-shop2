<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="fullCheckHandler">
      <radio color="#c00000" :checked="isFullCheck"/><text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amount-box">
      合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle">
      结算({{checkedCount}})
    </view>
  </view>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name:"my-settle",
    data() {
      return {
        
      };
    },
    computed: {
      ...mapGetters('cart',['checkedCount','total','checkedGoodsAmount']),
      // 是否全选
      isFullCheck() {
        return this.checkedCount === this.total
      }
    },
    methods:{
      fullCheckHandler() {
        this.$store.commit('cart/updateAllGoodsState',!this.isFullCheck)
      }
    }
  }
</script>

<style lang="scss">
.my-settle-container {
  position: fixed;
  bottom: 0%;
  left: 0;
  width: 100%;
  height: 50px;
  padding-left: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  font-size: 14px;
}
.radio {
  display: flex;
  align-items: center;
}  
.amount-box {
.amount {
  color: #c00000;
  font-weight: bold;
}
}
.btn-settle {
  height: 50px;
  min-width: 100px;
  padding: 0 10px;
  line-height: 50px;
  text-align: center;
  background-color: #c00000;
  color: white;
}
</style>