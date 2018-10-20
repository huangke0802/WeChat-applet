// pages/company/company.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath,
    imgNames: app.globalData.imgNames,
  },
  //拨打电话
  makecall: function (event) {
    wx.makePhoneCall({
      phoneNumber: '0731-89511084',
    })
  },
  //选择腾讯公司事件处理函数
  selectCompay: function () {
     wx.navigateTo({
       url: '../register/register'
     })
  },
  //选择中软事件处理函数
  selectCompayC: function () {
    wx.navigateTo({
      url: '../registerC/registerC'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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