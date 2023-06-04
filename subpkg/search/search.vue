<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar :radius="100" placeholder="请输入搜索内容" cancelButton='none' @input="input" :focus="true"></uni-search-bar>
    </view>
   
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchList.length">
      <view class="sugg-item" v-for="(item,i) in searchList" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">
          {{item.goods_name}}
        </view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
      
    </view>
    
    <!-- 搜索历史 -->  
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,i) in historyList" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timerId:null,
        // 搜索关键词
        kw:'',
        // 搜索建议
        searchList:[],
        // 搜索关键词的历史数据
        historyList:[]
      };
    },
    onLoad() {
      // 在onload生命周期函数中，加载本地存储的历史记录
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods:{
      // input输入事件的处理函数
      input(value) {
        if(this.timerId) {
          clearTimeout(this.timerId)
        }
        this.timerId = setTimeout(() =>{
          this.kw = value.trim()
          this.getSearchList()
        },500)
      },
   // 获取搜索建议
     async getSearchList() {
       // 判断搜索关键词是否为空
       if(!this.kw.trim()) {
         this.searchList = []
       }else {
         const {data:res} = await uni.$http.get(`/api/public/v1/goods/qsearch?query=${this.kw}`)
         if(res.meta.status !== 200) return uni.$showMsg()
         this.searchList = res.message
         this.saveSearchHistory()
       }
      
     },
     // 保存搜索关键词的方法
     saveSearchHistory() {
       const index = this.historyList.indexOf(this.kw)
       if(index !== -1) {
         this.historyList.splice(index,1)
       }
       this.historyList.unshift(this.kw)
       // 调用uni.setStorageSync(key,value)将搜索历史记录持久化存储到本地
       uni.setStorageSync('kw',JSON.stringify(this.historyList))
     },
     gotoDetail(item){
      uni.navigateTo({
        url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
      }) 
     },
     clean() {
       this.historyList = []
       uni.setStorageSync('kw','[]')
     },
     gotoGoodsList(kw) {
       uni.navigateTo({
         url:'/subpkg/goods_list/goods_list?query=' + kw
       })
     },
    }
  }
</script>

<style lang="scss">
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
.sugg-list {
  padding: 0 5px;
  .sugg-item {
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .goods-name {
      // 文字不允许换行
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，用省略号代替
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}
.history-box {
  padding: 0 5px;
  .history-title {
    display: flex;
    justify-content: space-between;
    height: 40px;
    align-items: center;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }
  .history-list {
    display: flex;
    flex-wrap: wrap;
    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
