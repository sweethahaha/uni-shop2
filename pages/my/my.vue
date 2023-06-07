<template>
  <view class="my-container">
    <!-- 使用自定义的用户登录组件 -->
    <my-login v-if="!token"></my-login>
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
  import {mapState} from 'vuex'
  import tabbarBadge from '@/mixin/tabbar-badge.js'
  export default {
    mixins:[tabbarBadge],
    data() {
      return {
        
      };
    },
    computed:{
      ...mapState('user',['token'])
    },
  }
</script>

<style lang="scss">
  page,.my-container{
    height: 100%;
    background-color: #efefef;
  }
 
</style>
