<template>
  <view>
    <view class="goods-item">
      <!-- 左侧盒子 -->
      <view class="goods-item-left">
        <radio :checked="goods.goods_state" color="#c00000" v-if="showRadio" @click="radioClickHandler"></radio>
        <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
      </view>
      <!-- 右侧盒子 -->
      <view class="goods-item-right">
        <!-- 商品的名字 -->
        <view class="goods-name">
          {{goods.goods_name}}
        </view>
        <view class="goods-info-box">
          <view class="goods-price">
            ￥{{goods.goods_price | tofixed}}
          </view>
          <!-- 商品数量 -->
          <uni-number-box :min="1" :value="goods.goods_count" @change="numberBoxHandler" v-if="showNum"></uni-number-box>
        </view>
      </view>
    </view>
    
  </view>
</template>

<script>
  export default {
    name:"my-goods",
    data() {
      return {
        // 默认图片地址
          defaultPic:'https://ts1.cn.mm.bing.net/th/id/R-C.823270fc68b9c58f0d9b3feb92b7b172?rik=aubbEBMSC86e%2bw&riu=http%3a%2f%2fimg95.699pic.com%2fphoto%2f50038%2f1181.jpg_wh860.jpg&ehk=iQboj4JMLLfDitOL7VJtSktED0AE%2f7Fyxfik0GTJkyQ%3d&risl=&pid=ImgRaw&r=0'
      
      };
    },
    props:{
      goods:{
        type:Object,
        default:{}
      },
      // 是否展示图片左侧的radio
      showRadio:{
        type:Boolean,
        default:false
      },
      // 是否展示价格右侧的nymberBox组件
      showNum:{
        type:Boolean,
        default:false
      }
    },
    methods:{
     radioClickHandler() {
       this.$emit('radioChange',{
         goods_id:this.goods.goods_id,
         goods_state:!this.goods.goods_state
       })
     } ,
     numberBoxHandler(value) {
       this.$emit('countChange',{
         goods_count:+value,
         goods_id:this.goods.goods_id
       })
     }
    },
    filters:{
      tofixed(num) {
        return Number(num).toFixed(2)
      }
    }
  }
</script>

<style lang="scss">
.goods-item {
  width: 750rpx;
  box-sizing: border-box;
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;
  .goods-item-left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 5px;
    .goods-pic {
      width: 100px;
      height: 100px;
      vertical-align: top;
    }
  }
  .goods-item-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .goods-name {
      font-size: 13px;
    }
    .goods-info-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .goods-price {
        font-size: 16px;
        color: #c00000;
      }
    }
  }
}
</style>