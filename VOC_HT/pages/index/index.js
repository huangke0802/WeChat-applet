//index.js
const app = getApp()
var network = require('../../utils/network.js');
var LoginUrl = app.globalData.BaseURL + '/customerLogin';
var productlineUrl = app.globalData.BaseURL + '/findCustomBg';
var params;
var productList;
var isDisabled= true  //控制授权按钮
Page({
  data: {
    motto: app.globalData.motto,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgNames: app.globalData.imgNames,
    imgPath: app.globalData.imgPath,
  },
  initLogin: function (code) {
    network.requestLoading(LoginUrl, { "code": code, "company": app.globalData.companyFlag} , '正在加载数据', function (res) {
      //res就是我们请求接口返回的数据
      if (res.customerInfo) {
        isDisabled=true;
        app.globalData.userInfo = res.customerInfo
        if (res.company=='ICSS'){
          //切换到中软首页
          wx.redirectTo({
            url: '/pages/homeicss/homeicss'            
          })
        } else{
          //切换到腾讯客户首页
          wx.redirectTo({
            url: '/pages/all/all' 
          })
        }
      } else {  //公司选择界面 注册
        isDisabled = true;
        wx.navigateTo({
          url: '../company/company'
        })
      }
    }, function () {
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },
  //事件处理函数
  bindViewTap: function () {
    if (isDisabled){
      isDisabled = false;
      this.loginAction() //点击登录
    }
  },

  /**获取用户登录code */
  loginAction: function () {
    wx.login({
      success: res => {
        if (res.code) {
          //console.log('获取用户登录凭证：' + res.code);
          this.initLogin(res.code)
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (this.codeCallback) {
            this.codeCallback(res)
          }
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  onLoad: function () {
    var params =app.globalData.companId;
    network.requestLoading(productlineUrl, params, "", function (res) {
      //res就是我们请求接口返回的数据
      if (res) {
        app.globalData.productList = res
      }
    }, function () {
    })
    this.loginAction()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /*** 生命周期函数--监听页面显示*/
  onShow: function () {
    app.globalData.scene = 1;
  },
  /*** 生命周期函数--监听页面隐藏 */
  onHide: function () {
    app.globalData.scene = 1;
  },
})