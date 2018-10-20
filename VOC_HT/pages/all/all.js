// pages/all/all.js
var app = getApp()
var network = require('../../utils/network.js');
var urlSelect = app.globalData.BaseURL + '/info';
var urlAdd = app.globalData.BaseURL + '/question/addVoc';
var urlGetList = app.globalData.BaseURL + '/question/queryVocList';
var urlReminder = app.globalData.BaseURL + '/question/reminder';
var formData;
var userInfo;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //用户信息
    winWidth: 0,
    winHeight: 0,
    /**tab切换 */
    currentTab: "0",
    listDataNoClose: [], //未关闭
    listDataClose: [], //已关闭
    /**分页参数 */
    pageNum: 1, //当前页码
    pageSize: 10, //每页显示数量
    //customerList: [],//客户数据
    loading: false, //"上拉加载"的变量，默认false，隐藏  
    loadingComplete: false, //“没有数据”的变量，默认false，隐藏 
    hasMoreData: true,
    /**入参 */
    formData: {
      wo: {},
      user: {}
    }, //请求入参
    imgPath: app.globalData.imgPath, //网络图片请求地址
    actFinished: 0, //0 未关闭 1 已关闭
    isfollow: '催单'
  },

  /**请求工单列表
   * actFinished 0 未关闭 1 已关闭
   * scroll true 不显示加载更多 
   */
  getInfo: function(actFinished, scroll) {
    //根据工号获取工单列表
    this.data.formData.contactNum = app.globalData.userInfo.staffUnique; //staffUnique
    this.data.formData.actFinished = actFinished;
    this.data.formData.fromIndex = this.data.pageNum;
    this.data.formData.pageSize = this.data.pageSize;
    var that = this;
    network.requestLoading(urlGetList, JSON.stringify(this.data.formData), '正在加载数据', function(res) {
      if (res.rows.length != 0) {
        for (var i = 0; i < res.rows.length; i++) {
          if (res.rows[i].woReminderTime) {
            if (new Date().getDate() == new Date(res.rows[i].woReminderTime).getDate()) {
              res.rows[i].isDisplay = true;
              res.rows[i].isfollow = '已催单';
            } else {
              res.rows[i].isDisplay = false;
              res.rows[i].isfollow = '催单';
            }
          } else {
            res.rows[i].isDisplay = false;
            res.rows[i].isfollow = '催单';
          }
        }
      }

      if (actFinished == '0') {
        //未关闭
        if (res.rows.length > 0) {
          //console.log('执行数据刷新');
          that.setData({
            listDataNoClose: that.data.listDataNoClose.concat(res.rows),
          });
        } else {
          if (scroll) {
            that.setData({
              hasMoreData: false,
              loadingComplete: true, //加载完成，没有数据了 
            });
          }
        }
        that.setData({
          loading: false,
        });

      } else if (actFinished == '1') {
        if (res.rows.length > 0) {
          that.setData({
            //toTaskList: searchList,
            listDataClose: that.data.listDataClose.concat(res.rows),
          });
        } else {
          if (scroll) {
            that.setData({
              hasMoreData: false,
              loadingComplete: true, //加载完成，没有数据了 
            });
          }
        }
        that.setData({
          loading: false,
        });
      }
    }, function() {
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },

  initPage: function() {
    this.data.pageNum = 1,
      this.data.listDataNoClose = [] //未关闭
    this.data.listDataClose = [], //已关闭
      this.data.hasMoreData = true
    this.setData({
      loading: false, //"上拉加载"的变量，默认false，隐藏  
      loadingComplete: false, //“没有数据”的变量，默认false，隐藏 
    });
  },
  //滚动到底部触发事件
  scrollLower: function() {
    let that = this;
    if (that.data.hasMoreData) {
      that.setData({
        pageNum: that.data.pageNum + 1, //每次触发上拉事件，把searchPageNum+1
        loading: true,
      });
      that.getInfo(that.data.actFinished, true)
    }
  },

  //点击催单
  followaction: function(e) {
    //console.log('催单状态------' + e.currentTarget.dataset.follow);
    if (e.currentTarget.dataset.follow) { //已催单
      wx.showModal({
        showCancel: false,
        content: '24小时内可催单一次',
        success: function(res) {}
      })
    } else {
      this.data.formData.wo.id = e.currentTarget.dataset.id; //工单ID
      this.data.formData.wo.companyId = app.globalData.userInfo.company;
      this.data.formData.user.staffNo = app.globalData.userInfo.staffNo;
      var that = this;
      network.requestLoading(urlReminder, JSON.stringify(this.data.formData), '正在加载数据', function(res) {
        if (res.resCode == "0") {
          that.data.listDataNoClose = [];
          that.initPage();
          that.getInfo(0);
          //that.getInfo(0, null);  //重新加载未关闭工单列表
          wx.showModal({
            showCancel: false,
            content: '我们已经催促' + e.currentTarget.dataset.name + '处理，他会在第一时间联系您',
            success: function(res) {}
          })
        }
      }, function() {
        wx.showToast({
          title: '催单失败，请检查网络',
        })
      })
    }
  },

  /**新增问题*/
  addaction: function() {
    wx.navigateTo({
      url: '../addquestion/addquestion'
    });
  },

  /**查看进展*/
  processView: function(event) {
    wx.navigateTo({
      url: '../progress/progress?id=' + event.currentTarget.dataset.id
    });
  },

  /**确认关闭*/
  confirmclosure: function(event) {
    wx.navigateTo({
      url: '../closure/closure?id=' + event.currentTarget.dataset.id + '&businessKey=' + event.currentTarget.dataset.businesskey
    });
  },

  //再次提交
  againSubmit: function(event) {
    wx.navigateTo({
      url: '../editactivity/editactivity?id=' + event.currentTarget.dataset.id + "&againSubmit=true"
    });
  },

  //跳转到编辑页面
  editWorkOrder: function(event) {
    var currentTarget = event.currentTarget,
      currentstatus = currentTarget.dataset.currentstatus;

    /** */
    if (currentstatus == "3") {
      wx.showModal({
        title: '提示',
        content: '该问题已经处理完成，正在等待您的关闭',
        showCancel: false,
        confirmText: '知道了'
      });
      return;
    } else if (currentstatus == "4") {
      wx.showModal({
        title: '提示',
        content: '该问题已经关闭',
        showCancel: false,
        confirmText: '知道了'
      });
      return;
    }
    wx.navigateTo({
      url: '../editactivity/editactivity?id=' + currentTarget.id
    });
  },

  //验证用户是否存在
  initLogin: function(code) {
    network.requestLoading(LoginUrl, code, '正在加载数据', function(res) {
      //res就是我们请求接口返回的数据
      //console.log(res)
      if (res.customerInfo) {

        // isDisabled = true;
        // app.globalData.userInfo = res.customerInfo
        // if (res.company == 'ICSS') {
        //   //切换到中软首页
        //   wx.redirectTo({
        //     url: '/pages/homeicss/homeicss'
        //   })
        // } else if (res.company == app.globalData.companyFlag) {
        //   //切换到腾讯客户首页
        //   wx.redirectTo({
        //     url: '/pages/all/all'
        //   })
        // }

      } else { //公司选择界面 注册
        isDisabled = true;
        wx.reLaunch({
          url: '../index/index'
        })
      }
    }, function() {
      wx.showToast({
        title: '加载数据失败',
      })
    })

  },

  /** 刷新 */
  updatePage: function() {
    wx.login({
      success: res => {
        if (res.code) {
          //app.globalData.code = res.code;
          //console.log('获取用户登录凭证：' + res.code);
          this.initLogin(res.code)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;

    that.setData({
      userInfo: app.globalData.userInfo
    });

    // if (app.globalData.userInfo==''){
    //   wx.reLaunch({
    //     url: '/pages/index/index'
    //   })
    //   return;
    // }else{
    //   that.setData({
    //     userInfo: app.globalData.userInfo
    //   });
    // }

    that.data.listDataNoClose = [];
    that.initPage();
    that.getInfo(0);

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  bindChange: function(e) {
    this.data.listDataNoClose = [];
    this.initPage();
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    that.getInfo(e.detail.current)
  },

  swichNav: function(e) {
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    if (app.globalData.scene == 2) {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }

    app.globalData.scene = 1;
    if (app.globalData.backId == '1') {
      app.globalData.backId = '0'; //存储数据到app对象上
      this.initPage();
      this.getInfo(0);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    app.globalData.scene = 1;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
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
  },
  /**
   * 注销账号
   */
  signOut() {
  
    const staffNo = this.data.userInfo.staffNo;
    const company = this.data.userInfo.company;
    const url = app.globalData.BaseURL + '/updateCustomerWechatId';
    wx.showModal({
      title: '消息提示',
      content: '亲，您确定注销吗？',
      success: (e) => {
        if (e.confirm) { //点击的是确定，这里执行后台方法
          network.requestLoading(url, JSON.stringify({
            staffNo,
            company
          }), '正在加载数据', (res) => {
            if (res && res.resCode == 1) {
              wx.showToast({
                title: '注销成功',
              })
              wx.redirectTo({
                url: '/pages/company/company'
              })
            } else {
              wx.showToast({
                icon: 'none',
                title: '注销失败',
              })
            }
            app.signOutCustomer();
          }, () => {
            wx.showToast({
              icon: 'none',
              title: '加载数据失败',
            })
          })
        }
      },
      fail: () => {
        wx.showToast({
          icon: 'none',
          title: '加载数据失败',
        })
      }
    })
  }
})