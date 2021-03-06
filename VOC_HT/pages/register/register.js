// pages/register/register.js
var app = getApp()
var network = require('../../utils/network.js');
var util = require('../../utils/util.js');
var productlineUrl = app.globalData.BaseURL + '/findCustomBg';
var registerUrl = app.globalData.BaseURL + '/register';
var urls = require('../../utils/urls.js');
var formData;  //注册入参
var productList;  //主部门
var pageThis;
var formID;

Page({
  /** 页面的初始数据*/
  data: {
    lastName: '',
    tip: '',
    formData: {},
    productList: [],   //主部门集合
    title: '请选择主部门',  
    imgPath: app.globalData.imgPath,
    company: app.globalData.companyFlag, //公司标志
    imgName: app.globalData.imgName,
  },
  /**执行注册 */
  initRegister: function () { 
    formData.code = app.globalData.code;
    formData.company = app.globalData.companyFlag;
    network.requestLoading(registerUrl + "/" + formID, formData, '正在加载数据', function (res) {
      //res就是我们请求接口返回的数据
      //console.log(res)
      if (res.resCode == 1) {
        //保存用户信息
        app.globalData.userInfo = res.customerInfo;
        //customerInfo中statue值：1 新注册；2 预配置+审核通过；3 不通过
        //console.log('注册完成保存用户信息：' + app.globalData.userInfo);
        //切换审核提示页面
        if (app.globalData.userInfo.status == '1')
        {
          wx.reLaunch({
            url: '/pages/success/success'
          })
        }
        //切换到注册成功页面，提示xxx为你问题接口人,腾讯预审核成功界面
        if (app.globalData.userInfo.status == '2') {
          //console.log('责任人：' + app.globalData.userInfo.customerManagerName);
          wx.reLaunch({
            url: '/pages/preSuccess/preSuccess'
          })
        }
      }
       else {
        wx.showToast({
          title: '注册失败',
          icon: 'success',
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
        if (formData.productLine) {
          var productLine = this.data.productList[formData.productLine];
          formData.productLine = productLine.deptId;
          formData.productName = productLine.deptName;
        } else {
          wx.showToast({
            title: '请选择主部门',
            icon: 'success',
            duration: 1500
          })
          return false
        }
    formData.company = app.globalData.companyFlag;
   // console.log('注册最终提交参数', formData)
    return true
  },
  formSubmit: function (e) {
    var that = this;
    formData = e.detail.value
    formID = e.detail.formId;
    //描述去空格
    e.detail.value.lastName = util.trim(e.detail.value.lastName);
    //验证非空数据格式
    if (!this.wxValidate.checkForm(e)) {
      const error = this.wxValidate.errorList[0]
      // `${error.param} : ${error.msg} `
      wx.showToast({
        title: `${error.msg} `,
        icon: 'success',
        duration: 1500
      })
      return false
    }
    if (this.CheckAction(formData)) {
      //console.log('通过非空验证')
      formData.tel = formData.tel.replace(/\b(0+)/gi, "");
      formData.staffNo = formData.tel;
      this.registerAction();
    } else {
      //console.log('未通过')
    }
  },
  //主部门选择
  bindPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      title: '请选择主部门',
    })
  },
  /**生命周期函数--监听页面加载*/
  onLoad: function (options) {
    pageThis = this;
    //console.log("部门长度-----"+app.globalData.productList.length);
    var params = app.globalData.companId;
    if (app.globalData.productList.length<=0){
      network.requestLoading(productlineUrl, params, "", function (res) {
        console.log("params-----" + params);
        //res就是我们请求接口返回的数据
        console.log(res);
        if (res) {
          app.globalData.productList = res
          pageThis.setData({
            productList: app.globalData.productList
          })
        }
      }, function () {
      })
    }else{
      pageThis.setData({
        productList: app.globalData.productList
      })
    }
  
    this.wxValidate = app.wxValidate(
      {
        productLine: {          //主部门
          required: true,
          maxlength: 10,
        },
        //staffNo: {            //工号
        //  required: true,
        //  number: true,
        //},
        lastName: {          //姓名
          required: true,
          maxlength: 10,
        },
        tel: {            //手机号
          required: true,
          tel: true,
        }
      }
      , {
        productLine: {
          required: '请选择主部门',
        },
        lastName: {
          required: '请填写您的姓名',
        },
       // staffNo: {
       //   required: '请填写您的工号',
       // },
        tel: {
          required: '请填写手机号',
        }
      }
    )
  },
  /**生命周期函数--监听页面初次渲染完成*/
  onReady: function () {
  },
  /** 生命周期函数--监听页面显示*/
  onShow: function () {
  },
  /** 生命周期函数--监听页面隐藏*/
  onHide: function () {
    app.globalData.scene = 0;
  },
  /** 生命周期函数--监听页面卸载*/
  onUnload: function () {
  },
  /*** 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {
  },
  /** 页面上拉触底事件的处理函数*/
  onReachBottom: function () {
  },
  /** 用户点击右上角分享*/
  // onShareAppMessage: function () {
  // }
})