const app = getApp();
const util = require('../../utils/util.js');
const network = require('../../utils/network.js');
//获取当前工单信息的url
const curOrderUrl = app.globalData.BaseURL + '/questionICSS/queryVocProgress';

Page({
  data : {
    imgPath: app.globalData.imgPath, //图片地址
    curOderInfo : {}
  },
  onLoad(query){
    const self = this;
    const params = {
      id: query.id
    }
    //查询当前工单信息
    network.requestLoading(curOrderUrl, JSON.stringify(params), '正在加载数据', function (res) {
      console.log(res)
      if (res) {
        self.setData({
          curOderInfo: res,
          
        });
      }
    }, function () {
      wx.showToast({
        icon: 'none',
        title: '加载数据失败',
      })
    });
  },
  makePhoneCall(e){
    const number = e.currentTarget.dataset.number;
    wx.makePhoneCall({
      phoneNumber: number,
    })
  }
})