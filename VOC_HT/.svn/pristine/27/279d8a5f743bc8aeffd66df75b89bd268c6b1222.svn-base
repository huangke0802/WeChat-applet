// pages/registerC/registerC.js
var app = getApp()
var network = require('../../utils/network.js');
var productlineUrl = app.globalData.BaseURL + '/findCustomBg';
var registerUrl = app.globalData.BaseURL + '/register';
var urls = require('../../utils/urls.js');
var formData;  //注册入参
var productList;  //主部门
var pageThis;
var formID;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
    imgPath: app.globalData.imgPath,
  },
  /**执行注册 */
  initRegister: function () {
    formData.code = app.globalData.code
    formData.company = app.globalData.companyFlag
    network.requestLoading(registerUrl + "/" + formID, formData, '正在加载数据', function (res) {
      //res就是我们请求接口返回的数据
      //console.log(res)
      if (res.resCode == 1) {
        //保存用户信息
        app.globalData.userInfo = res.customerInfo;
        //customerInfo中statue值：1 新注册；2 预配置+审核通过；3 不通过
        //console.log('注册完成保存用户信息：' + app.globalData.userInfo);
    
        if (res.company == app.globalData.companyFlag) {
          wx.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 5000
          })

          wx.reLaunch({
            url: '/pages/homeicss/homeicss'
          })
        }
      }
      else {
        wx.showToast({
          title: '登录失败，用户名和密码错误',
          icon:'none',
          duration: 1500
        })
      }

    }, function () {

      wx.showToast({
        title: '加载数据失败',
      })
    })
  },
  /**获取用户登录code */
  registerAction: function () {
    wx.login({
      success: res => {
        if (res.code) {
          app.globalData.code = res.code;
          //console.log('获取用户登录凭证：' + res.code);

          this.initRegister()

          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (this.codeCallback) {
            this.codeCallback(res)
          }
        } else {
          //console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  //非空验证
  CheckAction: function (formData) {
    //formData.company = 'ICSS'
    //console.log('注册最终提交参数', formData)
    return true
  },
  ICSSSubmit: function (e) {
    var that = this;
    formData = e.detail.value
    formID = e.detail.formId;
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
    if (this.CheckAction(formData)) {

      //console.log('通过非空验证')

      this.registerAction()

    } else {
      //console.log('未通过')
    }

  },
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {

    this.wxValidate = app.wxValidate(
      {
        staffNo: {            //工号
          required: true,
          number: true,
        },
        passWord: {            //请输入OA密码
          required: true,
        }

      }
      , {
        staffNo: {
          required: '请填写您的工号',
        },
        passWord: {
          required: '请输入密码',
        }

      }
    )
  },
   /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.scene = 0;
  }
})