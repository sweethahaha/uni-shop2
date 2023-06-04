<template>
  <view class="my-search-container" :style="{backgroundColor:bgcolor}" @click="searchBoxHandler">
    <view class="my-search-box" :style="{'border-radius':radius + 'px'}">
      <!-- 使用UNI-UI提供的图标组件-->
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    data() {
      return {
        
      };
    },
    props:{
      // 背景颜色
      bgcolor:{
        type:String,
        default:'#c00000'
      },
      // 圆角尺寸
      radius:{
        type:Number,
        default:18
      }
    },
    methods:{
      searchBoxHandler() {
        this.$emit('myclick')
      }
    }
  }
</script>

<style lang="scss">
.my-search-container {
  height: 50px;
  // background-color: #c00000;
  display: flex;
  align-items: center;
  padding: 0 10px;
  .my-search-box {
    display: flex;
    justify-content: center;
    align-items: center;
      height: 36px;
      width: 100%;
      background-color: #fff;
      // border-radius: 18px;
    .placeholder {
      margin-left: 5px;
      font-size: 15px;
    }
  }
}
</style>