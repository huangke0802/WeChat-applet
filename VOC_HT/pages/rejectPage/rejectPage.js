const app = getApp();
const util = require('../../utils/util.js');
const network = require('../../utils/network.js');

const rejectUrl = app.globalData.BaseURL + '/questionICSS/rejectSubWO'; //子工单驳回url

Page({
  data: {
    rejectReason: "",
    id: "",
    rejectReasonVarif: false
  },
  onLoad(options) {
    this.setData({
      id: options.id
    })
  },

  //输入文本域
  bindinputReject(e) {
    this.setData({
      rejectReason: e.detail.value,
      rejectReasonVarif: false
    });
  },

  //确定提交
  formSubmit(e) {
    const userInfo = app.globalData.userInfo;
    const staffNo = userInfo.staffNo;
    const value = e.detail.value;
    value.noCloseReason = value.noCloseReason.trim();
    if (!value.noCloseReason) { //输入的为空值
      this.setData({
        rejectReasonVarif: true
      })
    } else { //不为空是提交到后台
      const params = {
        swo: value,
        comments: [value.noCloseReason],
        user: {
          staffNo
        }
      }

      network.requestLoading(rejectUrl, JSON.stringify(params), '正在加载数据', function(res) {
        console.log('子工单驳回信息', res);
        if (res.resCode == 1) {
          wx.showToast({
            icon: 'success',
            title: '驳回成功',
          });
          wx.navigateBack({
            delta :1
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: '驳回失败',
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

  //取消提交
  formReset(e) {
    this.setData({
      rejectReason: "",
    });
    wx.navigateBack({
      delta: 1
    });
  }


});