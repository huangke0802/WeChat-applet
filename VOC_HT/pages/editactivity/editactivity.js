// pages/editactivity/editactivity.js
var app = getApp(),
  util = require('../../utils/util.js'),
  network = require('../../utils/network.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //用户信息
    workOrder: {},//当前工单
    expectedDate: "",//期望解决日期
    imgPath: app.globalData.imgPath,
    sysDate: util.getFormatDate(new Date()),//系统当前时间
  },

  //跳转工单列表界面
  // addqueaction: function () {
  //   wx.navigateTo({
  //     url: '../all/all'
  //   })
  // },
  //期待解决日期选择
  bindDateChange: function (e) {
    this.setData({
      expectedDate: util.formatSelectDate(e.detail.value, '-')
    })
  },

  //信息回填
  backfillInfo: function (options) {
    var that = this;
    network.requestLoading(app.globalData.BaseURL + "/question/queryVoc", { "id": options.id }, '正在加载数据', function (res) {
      //数据赋值
      that.setData({
        workOrder: res,
        expectedDate: util.dataFormat(res.woDueTime, "Y-M-D"),
        businessKey: res.businessKey,
        woRepeatCnt: res.woRepeatCnt ? res.woRepeatCnt:0,
      });
      //再次提交时，期望解决时间选择当前时间+14天
      if (options.againSubmit){
        that.setData({
          expectedDate: util.getFormatDate(util.DateAdd("d ", 14, new Date())),
        });
      }
    }, function () {
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },

  formSubmit: function (e) {
    //描述去空格
    e.detail.value.Des = util.trim(e.detail.value.Des);
    //验证非空数据格式
    if (!this.wxValidate.checkForm(e)) {
      const error = this.wxValidate.errorList[0]
      wx.showToast({
        title: `${error.msg} `,
        duration: 1500
      })
      return false
    }
    var formData = {};
    var wo = formData.wo = {};
    var user = formData.user = {};
    var formID = e.detail.formId;
    wo.id = this.data.workOrder.id;
    wo.woDesc = e.detail.value.Des;  //问题描述
    wo.woDueTime = e.detail.value.expectDate;  //期待解决时间
    user.staffNo = this.data.userInfo.staffNo;  //工号
    //判断是再次提交还是修改
    var againSubmit = this.data.againSubmit;
    var url="";
    if (againSubmit){
      //再次提交
      url = app.globalData.BaseURL + '/question/resubmitQuestion'
      wo.companyId = this.data.userInfo.company;  //公司ID
      wo.businessKey = this.data.businessKey;
      wo.woRepeatCnt = this.data.woRepeatCnt;
    }else{
      url = app.globalData.BaseURL + '/question/updateVoc'
    }
    if (util.isEmojiCharacter(e.detail.value.Des)) {
      wx.showToast({
        title: '暂不支持表情符号',
        icon: 'none',
        duration: 1500
      })
    } else {
      network.requestLoading(url + "/" + formID, formData, '操作进行中', function (res) {
        //res就是我们请求接口返回的数据
        if (res.resCode == '1') {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500,
            success: function () {
            }
          })
          setTimeout(function () {
            app.globalData.backId = '1';  //1为子传父标识，通知父更新
            wx.navigateBack({

            })
          }, 1500)
        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'success',
            duration: 1500
          })
        }
      }, function () {
        wx.showToast({
          title: '请求数据失败',
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      againSubmit: options.againSubmit?true:false,//再次提交标识
    }); 
    //信息回填查询
    this.backfillInfo(options);
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
  //打电话
  makePhoneCall(e) {
    const number = e.currentTarget.dataset.number;
    wx.makePhoneCall({
      phoneNumber: number,
    })
  }
})