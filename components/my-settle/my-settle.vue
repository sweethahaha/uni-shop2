<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="fullCheckHandler">
      <radio color="#c00000" :checked="isFullCheck" /><text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amount-box">
      合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">
      结算({{checkedCount}})
    </view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapState,
    mapMutations
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        // 倒计时秒数
        seconds: 3,
        timer: null
      };
    },
    computed: {
      ...mapGetters('cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      ...mapGetters('user', ['addstr']),
      ...mapState('user', ['token']),
      ...mapState('cart', ['cart']),
      // 是否全选
      isFullCheck() {
        return this.checkedCount === this.total
      }
    },
    methods: {
      ...mapMutations('user', ['updateRedirectInfo']),
      fullCheckHandler() {
        this.$store.commit('cart/updateAllGoodsState', !this.isFullCheck)
      },

      // 用户点击了结算按钮
      settlement() {
        // 判断用户是否选择了要结算的商品
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
        // 判断用户是否选择了地址
        if (!this.addstr) return uni.$showMsg('请选择收货地址！')
        // 判断用户是否登录
        // if(!this.token) return uni.$showMsg('请先登录！')
        if (!this.token) return this.delayNavigate()

        // 实现微信支付的功能
        this.payOrder()
      },
      // 展示倒计时的提示消息
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录后再结算！' + n + '秒后自动跳转登录页',
          mask: true,
          duration: 1500
        })
      },
      // 延时导航到my页面
      delayNavigate() {
        this.seconds = 3
        this.showTips(this.seconds)
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            // 跳转到my页面
            uni.switchTab({
              url: '/pages/my/my',
              // 页面成功跳转之后，调用vuex的updateRedirectInfo方法，把跳转信息存储到store中
              success: () => {
                this.updateRedirectInfo({
                  // 跳转的方式
                  openType: 'switchTab',
                  // 从哪个页面跳过去的
                  from: '/pages/cart/cart'
                })
              }
            })
            // 终值后续代码的运行（当秒数为0时，不再展示toast提示消息）
            return
          }
          this.showTips(this.seconds)
        }, 1000)
      },
      async payOrder() {
        // 1.创建订单
        // 1.1组织订单的信息对象
        const orderInfo = {
          // 开发期间，注释掉订单的真实价格
          // order_price:this.checkedGodsAmount,
          // 写死订单价格为1分钱
          order_price: 0.01,
          consignee_addr: this.addstr,
          goods: this.cart.filter(item => item.goods_state).map(item => ({
            goods_id: item.goods_id,
            goods_number: item.goods_count,
            goods_price: item.goods_price
          }))
        }
        // 发起请求创建订单
        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        // console.log(orderInfo);
        // console.log(res);  //无效token
        if (res.meta.status === 200) return uni.$showMsg('创建订单失败')
        // 得到服务器的订单编号
        // const orderNumber = res.message.order_number
        const orderNumber = "GD20180504000000000045"

        // 订单预支付
        // 发起请求获取订单的支付信息
        const {
          data: res2
        } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
          order_number: orderNumber
        })
        // console.log(res);
        // 预支付订单生成失败
        if (res2.meta.status === 200) return uni.$showMsg('预付订单生成失败')
        // 得到订单支付相关的必要参数
        // const payInfo = res2.message.pay
        const payInfo = {
          "timeStamp": "1525681145",
          "nonceStr": "BkPggorBXZwPGXe3",
          "package": "prepay_id=wx071619042918087bb4c1d3d72999385683",
          "signType": "MD5",
          "paySign": "D1642DEEF1663C8012EDEB9297E1D516"
        }
        
        // 发起微信支付
        const [err, succ] = await uni.requestPayment(payInfo)
        if(err) return uni.$showMsg('订单未支付！')
        // 完成了支付，进一步查询支付的结果
        const {data:res3} = await uni.$http.post('/api/public/v1/my/orders/chkOrder',{order_number:orderNumber})
        if(res3.meta.status !== 200) return uni.$showMsg('订单未支付')
        uni.showTabBar({
          title:'支付完成',
          icon:'success' 
        })
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