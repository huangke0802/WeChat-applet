// pages/registerC/registerC.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath,
    content:'',
    userinfo:'',
    isDispaly:true
  },
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    if (options.content && options.userinfo){

      this.setData({
        content: options.content,
        userinfo: options.userinfo
      });
     
    }else{

      this.setData({
        isDispaly:false
      });
    }
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
})