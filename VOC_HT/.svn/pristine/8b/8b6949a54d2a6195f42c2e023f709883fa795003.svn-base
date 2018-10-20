// pages/progress/progress.js
var app = getApp(),
network = require('../../utils/network.js'),
util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sysDate: util.dataFormat(new Date(), "Y-M-D h:m:s"),//系统当前时间
    workOrder: {},//当前工单
    expectedDate:"",//期望解决日期
    woTime:"",//工单填写时间
    assignTime:"",//工单受理时间
    handlerTime:"",//工单处理时间
    closeTime:"",//工单关闭时间
    lastPublishProgressTime:"",//最新解决进展时间
    imgPath: app.globalData.imgPath,
  },

  upper: function (e) {

  },

  lower: function (e) {
  },

  queryInfo:function(id){
    var that = this;
    network.requestLoading(app.globalData.BaseURL + "/question/queryVocProgress", { "id": id }, '正在加载数据', function (res) {
      //console.log('进展返回----'+JSON.stringify(res));
      //数据赋值
      that.setData({
        workOrder: res,
        woTime: util.dataFormat(res.woTime,"Y-M-D h:m:s"),
        expectedDate:util.dataFormat(res.woDueTime, "Y-M-D"), 
        assignTime: util.dataFormat(res.woAssignTime, "Y-M-D h:m:s"),//工单受理时间
        handlerTime: res.woHandlerTime ? util.dataFormat(res.woHandlerTime, "Y-M-D h:m:s") : that.data.sysDate,//工单处理时间
        closeTime: util.dataFormat(res.woCloseTime, "Y-M-D h:m:s"),
        lastPublishProgressTime: res.lastPublishProgressTime ? util.dataFormat(res.lastPublishProgressTime, "Y-M-D h:m:s"):null,
      });
    }, function () {
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //查询工单信息
    this.queryInfo(options.id);
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
    app.globalData.scene = 0;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.scene = 0;
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
  
  // },
})