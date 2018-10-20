// pages/addquestion/addquestion.js
var app = getApp()
var util = require('../../utils/util.js');
var network = require('../../utils/network.js');
var addUrl = app.globalData.BaseURL + '/question/addVoc';
var resubmitUrl = app.globalData.BaseURL + '/question/resubmitQuestion';
var formData = {};
var wo = formData.wo = {};
var user = formData.user = {};
var wodata;
var pageThis;
//获取当前系统年月
var sysDate;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sysDate: util.getFormatDate(new Date()),
    // currentDate: util.getFormatDate(new Date()),
    // dates: util.getFormatDate(new Date()),
    //sysDate: util.getFormatDate(util.DateAdd("d ", 15, new Date())),
    currentDate: util.getFormatDate(util.DateAdd("d ", 14, new Date())),
    dates: util.getFormatDate(util.DateAdd("d ", 14, new Date())),
    end: util.getEndTime(new Date()),
    userinfo: {},
    imgPath: app.globalData.imgPath,
    isDisabled:false  //控制提交按钮是否有效
  },
  //提交工单
  initAddQuestion: function (wodata,id) {
    this.setData({
      isDisabled:true
    })
    //JSON.stringify(
    network.requestLoading(addUrl + "/" + id, wodata, '操作进行中', function (res) {
      //res就是我们请求接口返回的数据
       //console.log('新增返回' + res);
      if (res.resCode=='1'){  
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1500,
        })
        setTimeout(function () {
          app.globalData.backId = '1';  //1为子传父标识，通知父更新
          wx.navigateBack ({
          })
        }, 1500)
      } else if (res.resCode=='0'){
        wx.showToast({
          title: '账号未审核，请联系管理员',
          icon: 'success',
          duration: 1500
        })
        app.globalData.backId = '1';  //1为子传父标识，通知父更新
          wx.navigateBack({
        })
      } else{
        wx.showToast({
          title: '提交失败',
          icon: 'success',
          duration: 1500
        })
        this.setData({
          isDisabled: false
        })
      }
    }, function () {
      wx.showToast({
        title: '请求数据失败',
      })
    })
  },
  formSubmit: function (e) {
    //描述去空格
    e.detail.value.Des = util.trim(e.detail.value.Des)
    //验证非空数据格式
    if (!this.wxValidate.checkForm(e)) {
      const error = this.wxValidate.errorList[0]
      // `${error.param} : ${error.msg} `
      wx.showToast({
        title: `${error.msg} `,
        duration: 1500
      })
      return false
    }
    wo.woDesc = e.detail.value.Des;  //问题描述
    wo.woDueTime = e.detail.value.expectDate;  //期待解决时间
    wo.companyId = this.data.userInfo.company;  //公司ID
    user.staffNo = this.data.userInfo.staffNo;  //工号
    formData.formId = e.detail.formId
    //console.log('过滤前----    ' + util.isEmojiCharacter(e.detail.value.Des));
    //console.log(JSON.stringify(e));
    // console.log('表单提交fromId------------------' + e.detail.formId);
     //console.log('客户提单工单入参' + JSON.stringify(formData));
    if (util.isEmojiCharacter(e.detail.value.Des)){
      wx.showToast({
        title: '暂不支持表情符号',
        icon: 'none',
        duration: 1500
      })
    }else{
      //console.log('请求提交');
       this.initAddQuestion(formData, e.detail.formId);
    }
  },
  //期待解决日期选择
  bindDateChange: function (e) {
    this.setData({
      currentDate: util.formatSelectDate(e.detail.value, '-')
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageThis = this;
    pageThis.setData({
      userInfo: app.globalData.userInfo
    })

    this.wxValidate = app.wxValidate(
      {
        Des: {        //问题描述
          required: true,
        }

      }, {
        Des: {
          required: '请填写问题描述',
        }
      }
    )
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
    // var that = this;
    // that.setData({
    //   userInfo: app.globalData.userInfo
    // })
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
  //打电话
  makePhoneCall(e){
    const number = e.currentTarget.dataset.number;
    wx.makePhoneCall({
      phoneNumber: number,
    })
  }
})