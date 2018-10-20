// pages/closure/closure.js
var app = getApp(),
network = require('../../utils/network.js');
var util = require('../../utils/util.js');
var imgPath = app.globalData.imgPath;
var isnull=true;
var biaoqing = true;
Page({
  data: {
    userStars: [
      imgPath +'/all_c.png',
      imgPath +'/all_c.png',
      imgPath +'/all_c.png',
      imgPath +'/all_c.png',
      imgPath +'/all_c.png'
    ],
    effectivenessArray: [
      imgPath +'/all_c.png',
      imgPath +'/all_c.png',
      imgPath +'/all_c.png',
      imgPath +'/all_c.png',
      imgPath +'/all_c.png'
    ],
    isClose:'YClose',
    workorderid:"",//当前工单ID
    businessKey:"",//当前工单流水号
    userInfo: {}, //用户信息
    serviceScore :5,//服务度得分
    efficiencyScore :5,//效率得分
  },
  /**切换关闭 */
  isCloseChange:function(e){
    //console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.setData({
      isClose : e.detail.value
    });
  },

  // 服务度点击事件
  starTap: function (e) {
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var tempUserStars = this.data.userStars; // 暂存星星数组
    var len = tempUserStars.length; // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars[i] = imgPath +'/all_c.png'
      } else { // 其他是空心
        tempUserStars[i] = imgPath +'/all.png'
      }
    }
    // 重新赋值就可以显示了
    this.setData({
      userStars: tempUserStars,
      serviceScore: index+1,
    })
  },
  // 效率点击事件
  effectiveness: function (e) {
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var tempUserStars1 = this.data.effectivenessArray; // 暂存星星数组
    var len = tempUserStars1.length; // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars1[i] = imgPath +'/all_c.png'
      } else { // 其他是空心
        tempUserStars1[i] = imgPath +'/all.png'
      }
    }
    // 重新赋值就可以显示了
    this.setData({
      effectivenessArray: tempUserStars1,
      efficiencyScore: index+1,
    })
  },
  submitAction: function (e) {
    //描述去空格
    e.detail.value.content = util.trim(e.detail.value.content)
    if (util.isEmojiCharacter(e.detail.value.content)) {
      biaoqing=false;
      wx.showToast({
        title: '暂不支持表情符号',
        icon: 'none',
        duration: 1500
      })
      return;
    }else{
      biaoqing = true;
    }
    var that = this;
    var url = "";
    var formData = {};
    var wo = formData.wo = {};
    var user = formData.user = {};
    var evaluate = formData.evaluate = {};//通过的评价
    var formID = e.detail.formId;
    user.staffNo = that.data.userInfo.staffNo;  //工号
    wo.companyId = that.data.userInfo.company;  //公司ID
    wo.id = that.data.workorderid;//工单ID
    wo.businessKey = that.data.businessKey;
    if (that.data.isClose =='YClose'){
      //关闭
      url = app.globalData.BaseURL + "/question/passRequest";
      evaluate.content = e.detail.value.content;
      evaluate.satisfaction = e.detail.value.satisfaction;
      evaluate.operateUser = that.data.userInfo.staffNo;
      evaluate.serviceScore = that.data.serviceScore;//服务度得分
      evaluate.efficiencyScore = that.data.efficiencyScore;//效率得分
    }else{
      //不关闭
      url = app.globalData.BaseURL + "/question/notpassRequest";
      wo.woNoCloseReason = e.detail.value.content;
      if (wo.woNoCloseReason==''){
        wx.showToast({
          title: '请填写驳回原因',
          icon: 'none',
          duration: 1500
        })
        isnull = false;
        return;
        
      }else{
        isnull = true;
      }
    }
    console.log('关闭工单入参--------' + JSON.stringify(formData));
    network.requestLoading(url + "/" + formID, formData, '操作进行中', function (res) {
      wx.showToast({
        title: '评价成功',
        icon: 'success',
        duration: 5000,
        success: function () {
          wx.reLaunch({
            url: '../all/all'
          })
        }
      })
    }, function () {
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },
  onLoad: function (options) {
    this.setData({
      workorderid: options.id,
      businessKey: options.businessKey,
      userInfo: app.globalData.userInfo,  
    })
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
  }
})