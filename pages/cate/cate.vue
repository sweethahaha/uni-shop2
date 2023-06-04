<template>
  <view>
    <!-- 使用自定义的叟座组件 -->
    <my-search @myclick="gotoSearch"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧的滑动区域 -->
      <scroll-view scroll-y="true" :style="{height:wh+'px'}" class="left-scroll-view">
        <block v-for="(item,i) in cateList" :key="i">
          <view class="left-scroll-view-item" :class="{active:active === i}" @click="activeChange(i)">{{item.cat_name}}</view>
        </block>
      </scroll-view>
      <!-- 右侧的滑动区域 -->
      <scroll-view scroll-y="true" :style="{height:wh+'px'}" class="right-scroll-view" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2,i2) in cateLevel2" :key="i2">
          <!-- 二级分类标题 -->
          <view class="cate-lv2-title">
            / {{item2.cat_name}} /
          </view>
          <!-- 动态渲染三级分类的列表数据 -->
          <!-- 三级分类盒子 -->
          <view class="cate_lv3_list">
            <!-- 三级分类item项 -->
            <view class="cate_lv3_item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
              <!-- 图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 文本 -->
              <text> {{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 当前设备可用的高度
        wh:0,
        // 分类列表数据
        cateList:[],
        // 激活项
        active:0,
        // 二级分类列表
        cateLevel2:[],
        scrollTop:0
      };
    },
    onLoad() {
      //获取设备可用屏幕高度
     const winInfo = uni.getWindowInfo()
     this.wh = winInfo.windowHeight - 50
     // 获取分类列表数据
     this.getcateList()
    },
    methods:{
     async getcateList() {
     const {data:res} = await uni.$http.get('/api/public/v1/categories')
     if(res.meta.status !== 200) return uni.$showMsg()
     this.cateList = res.message
     // 为二级分类赋值
     this.cateLevel2 = res.message[0].children
      },
      activeChange(i) {
        this.active=i
        // 重新为二级分类赋值
        this.cateLevel2 = this.cateList[i].children
        // 右侧滚动条置0
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      // 点击三级分类跳转到商品列表页面
      gotoGoodsList(item3) {
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid=' + item3.cat_id
        })
      },
      gotoSearch() {
        uni.navigateTo({
          url:'/subpkg/search/search'
        })
      }
    },
   
  }
</script>

<style lang="scss">
.scroll-view-container {
  display: flex;
  .left-scroll-view {
    width: 120px;
    .left-scroll-view-item {
      background-color: #f7f7f7;
      line-height: 60px;
      text-align: center;
      font-size: 12px;
      &.active {
        position: relative;
        background-color: #ffffff;
        &::before {
          content: '';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
    }
  }
  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }
  .cate_lv3_list {
    display: flex;
    flex-wrap: wrap;
    .cate_lv3_item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      
      margin-bottom: 10px;
      width: 33.33%;
      image {
        width: 60px;
        height: 60px;
      }
      text {
        font-size: 12px;
      }
    }
  }
}
</style>
