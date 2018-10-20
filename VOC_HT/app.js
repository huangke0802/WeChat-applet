//app.js
import wxValidate from 'utils/wxValidate'
App({
  wxValidate: (rules, messages) => new wxValidate(rules, messages),
  onShow: function () {  
    // console.log('应用启动');
    // wx.redirectTo({
    //   url: '/pages/index/index'
    // })
  },
  onHide: function () {
    if (this.globalData.scene != 'undefined' && this.globalData.scene == 0) {
      //this.globalData.userInfo ={};
      //console.log('应用销毁-------' + getCurrentPages().length);
       wx.navigateBack({
         delta:-1
      })
    }else{
      this.globalData.scene = 2;
    }
},
  /** 监听页面卸载*/
  onUnload: function () {
    //console.log('页面卸载');
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    code: '',
    userInfo: {},
    productList: {},
    backId: '',
    scene: '0',  //0为其他页面，1为主页（腾讯首页，中软首页，公司界面） 2 为主页退出状态
    BaseURL: "https://prj.chinasoftinc.com/prj_test/weixin",
    imgPath: "https://prj.chinasoftinc.com/prj_test/resource/imgs/weixin",
    imgNames: "tx_logo.png",
    imgName: "txlogo.png",
    companyFlag: "TX",
    companId: "1",
    motto:"腾麦精灵为您提供服务",
    // BaseURL: "https://prj.chinasoftinc.com/prj/weixin",
    // imgPath: "https://prj.chinasoftinc.com/prj/resource/imgs/weixin",
  },
  /**
   * 注销用户信息
   */
  signOutCustomer(){
    this.globalData.userInfo = null;
  }
})