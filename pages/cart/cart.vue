<template>
  <view class="cart-container" v-if="total">
    <!-- 收货地址号组件 -->
    <my-address></my-address>
    <!-- 商品列表的标题区域 -->
    <view class="cart-title">
      <!-- 左侧的图标 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <!-- 右侧的文字 -->
      <text class="cart-title-text">购物车</text>
    </view>
    <!-- 商品列表区域 -->
    <uni-swipe-action>
      <block v-for="(goods,i) in cart" :key="i">
        <uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
          <my-goods :goods="goods" :showRadio="true" @radioChange="radioChangeHandler" :showNum="true"
            @countChange="countChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    <!-- 使用自定义的结算组件 -->
    <my-settle></my-settle>
  </view>
  
  <!-- 空白购物车区域 -->
  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
  import tabbarBadge from '@/mixin/tabbar-badge.js'
  import {
    mapState
  } from 'vuex'
  import cart from '../../store/cart';
  export default {
    mixins: [tabbarBadge],
    data() {
      return {
      options:[
        {text:'删除',style:{backgroundColor:'#c00000'}}
      ]
      };
    },
    computed: {
      ...mapState('cart', ['cart']),
    },
    methods: {
      radioChangeHandler(e) {
        // console.log(e);
        // console.log(this.$store);
        this.$store.commit('cart/updateGoodsState', e)
      },
      countChangeHandler(e) {
        this.$store.commit('cart/updateGoodsCount', e)
      },
      swipeItemClickHandler(goods){
        // console.log(goods);
        this.$store.commit('cart/removeGoodsById',goods.goods_id)
      }
    }
  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;
  }
  .cart-title {
    padding-left: 5px;
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #efefef;

    .cart-title-text {
      margin-left: 10px;
      font-size: 14px;
    }
  }
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;
  .empty-img {
    width: 90px;
    height: 90px;
  }
  .tip-text {
    margin-top: 15px;
    font-size: 12px;
    color: gray;
  }
}
</style>