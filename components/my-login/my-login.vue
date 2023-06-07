<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#afafaf"></uni-icons>
    <!-- 登录按钮 -->
    <!-- 当授权成功之后，可以从getUserInfo事件处理函数的形参中，获取到用户的基本信息 -->
    <button type="primary" class="btn-login" @click="getUserInfo">一键登录</button>
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  import {mapMutations,mapState} from 'vuex'
  export default {
    name:"my-login",
    data() {
      return {
        
      };
    },
    computed:{
      ...mapState('user',['redirectInfo'])  
    },
    methods:{
      ...mapMutations('user',['updateUserInfo','updateToken','updateRedirectInfo']),
      // 用户授权之后，获取用户的基本信息
      async getUserInfo() {
      const [err,succ] = await uni.getUserProfile(
      { desc: '登录后可同步数据',
        lang: 'zh_CN',
      });
        if(err && err.errMsg === 'getUserProfile:fail auth deny') return uni.$showMsg('您取消了登录授权！')
        // console.log(succ);
        this.updateUserInfo(succ.userInfo)
        // 获取登录成功后的token字符串
        this.getToken(succ)
      },
      async getToken(info) {
        // 调用微信登录接口
        const [err,res] = await uni.login().catch(err => err)
        // 判断是否调用失败
        if(err || res.errMsg !== 'login:ok') return uni.$showError('登录失败')
        // 准备参数对象
        const query = {
          code:res.code,
          encryptedData:info.encryptedData,
          iv:info.iv,
          rawData:info.rawData,
          signature:info.signature
        }
//         const query = {
//   "code": "013pZWCt0GniKb1ftkBt0AxfDt0pZWCf",
//   "encryptedData": "FGMaNbO4ytTFTUzK3wmtfHWoFeQJYkyMajQ5tVbQglwmnJ46SMi43Thq0OZjSSa5Msmnpdfx7yigYkdvUbsiQFyF9xMGEQLpUFcpNjnYoCQOl2Ka5zEeqpMY91ywYAsPISeu1rwvFCU2Ucenxf7gdcDPQ/jNJdORGb86DR+2gVJeg8TZiXWJ66enpynj35DiaE1jNWUSzpgbOvO40dZrWnHVwDEJN+upeSHRR/IW7t3cgtV63/GeZzNhFbUYqNHO6M1KHetwY1u8mFXuZoXwVV7DrEwEzY1btqcfW93q4ekn2uwAUeJM4U+3roBsIT5ZpEM8YtQZVsAwjaWHBe8id1H4lurEFC5/GwLnRONrIiR7KDF7MPxnMO9flWFQEfay5dt9rBELzk1Efjf2H6UnzYfh+o4MbPxtc0cUiHEnNCVcXjDtulXSRUy7RZQPmjF/tYBHHrXEFubxnK4oRBZz/A==",
//   "iv": "y/ESFBaesbEzIbB1th5Knw==",
//   "rawData":
//     "{\"nickName\":\"优购\",\"gender\":0,\"language\":\"zh_CN\",\"city\":\"\",\"province\":\"\",\"country\":\"\",\"avatarUrl\":\"https://wx.qlogo.cn/mmopen/vi_32/icWlxE4rARHaIlib1PRmBtRa2tQicUSEHYu8UIGZ0LLic9C0PticibED6brRFCuQYeLGtwTcBYFgMtcF11N31pVhMF8g/132\"}",
//   "signature": "d06cd3a54e89e6014e43694844706eaccad109bb"
// }
        // console.log(query);
        // 换取token
        const {data:loginResult} = await uni.$http.post('/api/public/v1/users/wxlogin',query)
        // console.log(loginResult);
        if(loginResult.meta.status === 200) return uni.$showMsg('登录失败')
        uni.$showMsg('登录成功')
        // 更新vuex中的token
        this.updateToken("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o")
        this.navigateBack()
      },
      navigateBack() {
        if(this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url:this.redirectInfo.from,
            complete:() => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
.login-container {
  position: relative;
  height: 750rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #F8F8F8;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 40px;
    transform: translateY(50%);
    background-color: white;
    border-radius: 100%;
  }
  .btn-login {
    width: 90%;
    margin: 15px 0;
    border-radius: 100px;
    background-color: #c00000;
  }
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>