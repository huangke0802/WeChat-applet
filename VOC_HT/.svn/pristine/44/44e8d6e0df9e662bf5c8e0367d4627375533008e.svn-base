// pages/mycustomer/mycustomer.js
var app = getApp(),
  network = require('../../utils/network.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,//当前页码
    pageSize: 10,//每页显示数量
    customerList: [],//客户数据
    loading: false, //"上拉加载"的变量，默认false，隐藏  
    loadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    hasMoreData: true,
    imgPath: app.globalData.imgPath,//图标路径
  },
  /**
   * 查询数据
   */
  getInfo: function (scroll) {
    var that = this,
      url = app.globalData.BaseURL + '/questionICSS/queryCustomerUserList',
      postdata = {
        scopeSearch: "2",
        user: {
          staffNo: that.data.staffNo
        },
        fromIndex: that.data.pageNum,
        pageSize: that.data.pageSize
      };
    network.requestLoading(url, postdata, '正在加载数据', function (res) {
      if (res.data.rows.length > 0) {
        //拼接结果
        let searchList = that.data.customerList.concat(res.data.rows)
        that.setData({
          customerList: searchList,
        });
      } else {
        wx.showToast({
          title: '暂无分配客户',
          icon: 'none',
          duration: 1500,
        })
        if (scroll){
          that.setData({
            hasMoreData:false,
            loadingComplete: true, //加载完成，没有数据了 
          });
        }
      }
      that.setData({
        loading: false,
      });
    }, function () {
      wx.showToast({
        title: '加载数据失败',
      })
    })
  },

  //滚动到底部触发事件
  scrollLower: function () {
    let that = this;
    if (that.data.hasMoreData) {
      that.setData({
        pageNum: that.data.pageNum + 1,  //每次触发上拉事件，把searchPageNum+1
        loading:true,
      });
      that.getInfo(true);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //存储员工编号
    this.setData({
      staffNo: options.staffNo
    });
    this.getInfo();
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
})		