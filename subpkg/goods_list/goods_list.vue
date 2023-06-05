<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods,i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          query:'',
          cid:'',
          pagenum: 1,
          pagesize: 10
        },
        // 商品列表数据
        goodsList:[],
        // 总数量
        total:0,
        // 节流阀
        isLoading:false
        }
    },
    onLoad(options) {
      // 把从其他页面跳转到商品列表页面时携带的参数存起来
      this.queryObj.query = options.query || '',
      this.queryObj.cid = options.cid || ''
      // 获取商品列表数据
      this.getGoodsList()
    },
    methods:{
      // 获取商品列表数据
      async getGoodsList() {
        // 打开节流阀
        this.isLoading = true
       const {data:res} = await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
       if(res.meta.status !== 200) {
         uni.$showMsg()
       } else {
       this.total = res.message.total
       this.goodsList = [...this.goodsList,...res.message.goods]
       }
       // 关闭节流阀
       this.isLoading = false
      },
      async pulldownRefreshHandler() {
        // 重置关键数据
        this.queryObj.pagenum = 1
        this.total = 0
        this.isLoading = false
        this.goodsList = []
        // 重新发起请求
       await this.getGoodsList()
       uni.stopPullDownRefresh()
      },
      // 跳转到商品详情页面
      gotoDetail(item){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      }
    },
    onReachBottom() {
      if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
      // 上拉触底时先判断节流阀是否打开，如果节流阀打开了，说明上次网络请求还没发送完毕，这时不发起新的网络请求
      if(this.isLoading) return
      // 让页码值自增加1
      this.queryObj.pagenum++
      this.getGoodsList()
    },
    // 下拉刷新的事件
    onPullDownRefresh() {
      this.pulldownRefreshHandler()
    }
  }
</script>

<style lang="scss">

</style>
