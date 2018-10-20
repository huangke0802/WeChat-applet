const app = getApp();
const util = require('../../utils/util.js');
const network = require('../../utils/network.js');
const passUrl = app.globalData.BaseURL + '/questionICSS/approvalSubWO'; //子工单通过url
//获取当前工单信息的ulr
const curOrderUrl = app.globalData.BaseURL + '/questionICSS/queryVocProgress';
const deleteUrl = app.globalData.BaseURL + '/questionICSS/deleteSubWO'; //子工单删除url

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: app.globalData.imgPath, //图片地址
    subOrderList: [], //子工单列表
    curOderInfo: {},
    parentVocId: '',
    expectedDate : ''
  },

  getSubOrderWorkList(parentVocId) {
    const self = this;
    const subOrdersUrl = app.globalData.BaseURL + '/questionICSS/querySubWO';
    //查询子工单列表
    network.requestLoading(subOrdersUrl, JSON.stringify({
      parentVocId
    }), '正在加载数据', function(res) {
      console.log('子工单信息', res);
      res.data.rows.map(v => v.woDueForTime = util.dataFormat(v.subWoDueTime, "Y-M-D"))
      if (res.resCode === 1) {
        self.setData({
          subOrderList: res.data.rows
        });
      }
    }, function() {
      wx.showToast({
        icon: 'none',
        title: '加载数据失败',
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const self = this;
    this.setData({
      parentVocId: options.parentVocId
    })
    this.getSubOrderWorkList(options.parentVocId);

    const params = {
      id: options.parentVocId
    }
    const subid = options.subid;
    //查询当前工单信息
    network.requestLoading(curOrderUrl, JSON.stringify(params), '正在加载数据', function(res) {
      if (res) {
        self.setData({
          curOderInfo: res,
          expectedDate: util.dataFormat(res.woDueTime, "Y-M-D")
        });
      }
    }, function() {
      wx.showToast({
        icon: 'none',
        title: '加载数据失败',
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 通过子工单
   */
  passOrder(e) {
    const userInfo = app.globalData.userInfo;
    const staffNo = userInfo.staffNo;
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '消息提示',
      content: '你是否确定子工单已经完成？',
      success(e) {

        if (e.confirm) { //点击的是确定，这里执行后台方法
          //子工单通过
          const params = {
            swo: {
              id
            },
            comments: ["通过"],
            user: {
              staffNo
            }
          }
          network.requestLoading(passUrl, JSON.stringify(params), '正在加载数据', function(res) {
            if (res.resCode == 1){
              wx.showToast({
                title: '操作成功',
              })
            }else{
              wx.showToast({
                icon: 'none',
                title: '操作失败',
              })
            }
          }, function() {
            wx.showToast({
              icon: 'none',
              title: '加载数据失败',
            })
          });

        }
      },
      fail() {
        console.log('fail')
      }
    })
  },
  /**
   * 删除子工单
   */
  deleteOrder(e) {
    const id = e.currentTarget.dataset.id;
    const self = this;
    wx.showModal({
      title: '消息提示',
      content: '确定删除此工单吗？',
      success(e) {
        console.log('success', e)
        if (e.confirm) {
          //点击的是确定，执行删除方法
          network.requestLoading(deleteUrl, JSON.stringify({
            id
          }), '正在加载数据', function(res) {
            if (res.resCode == 1) {
              self.getSubOrderWorkList(self.data.parentVocId);
              wx.showToast({
                icon: 'success',
                title: '删除成功',
              })
            } else {
              wx.showToast({
                icon: 'none',
                title: '删除失败',
              })
            }
          }, function() {
            wx.showToast({
              icon: 'none',
              title: '加载数据失败',
            })
          });

        }
      },
      fail() {
        console.log('fail')
      }
    })
  },
  /**
   * 驳回子工单
   */
  reject(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/rejectPage/rejectPage?id=${id}`
    })
  },
  gotoCustomerInfo() {
    wx.navigateTo({
      url: '../customerInfo/customerInfo?id=' + this.data.parentVocId
    });
  }
})