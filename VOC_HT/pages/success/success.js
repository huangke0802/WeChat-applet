// pages/success/success.js
var app = getApp()
var userInfo;
Page({
  /** 页面的初始数据*/
  data: {
    userInfo: {}, //用户信息
  },
  registerSuccessSubmit: function () {
   //中软注册成功  and  腾讯成功
    var companyFlag = app.globalData.companyFlag;
    if (this.data.userInfo.company == companyFlag){
      wx.redirectTo({
        url: '/pages/all/all'
      })
    } else{
      wx.redirectTo({
        url: '/pages/homeicss/homeicss'
      })
    }
    },
  /** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.scene = 1;
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.scene = 1;
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  // }
})