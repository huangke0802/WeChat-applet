const app = getApp()
const network = require('../../utils/network.js');
const util = require('../../utils/util.js');
//获取当前工单信息的ulr
const curOrderUrl = app.globalData.BaseURL + '/questionICSS/queryVocProgress';

Page({
  data: {
    imgPath: app.globalData.imgPath, //图片地址
    parentVocId: '',
    curSubOderInfo: {},
    subWoMeasures: '',
    subWoProcess: '',
    subid: ''
  },

  onLoad(options) {
    const self = this;
    this.setData({
      parentVocId: options.parentVocId,
      subid: options.subid
    })

    const params = {
      id: options.parentVocId
    }
    const subid = options.subid;


    this.getCurrentSubOrderInfo();
  },
  /**
   * 获取当前子工单信息
   */
  getCurrentSubOrderInfo() {
    console.log(this.data)
    const url = app.globalData.BaseURL + '/questionICSS/querySubWOById';
    const id = this.data.subid; //子工单id
    //查询当前子工单信息
    network.requestLoading(url, JSON.stringify({
      id
    }), '正在加载数据',
      (res) => {
        if (res && res.resCode == 1) {
          this.setData({
            curSubOderInfo: res.data,
            expectedDate: util.dataFormat(res.data.subWoTime, "Y-M-D"),
            subWoMeasures: res.data.subWoMeasures,
            subWoProcess: res.data.subWoProcess
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '加载数据失败',
          })
        }

      }, () => {
        wx.showToast({
          icon: 'none',
          title: '加载数据失败',
        })
      });
  },
  /**
   * 改进措施输入
   */
  inputMeasures(e) {
    const val = e.detail.value;
    this.setData({
      subWoMeasures: val
    })
  },
  /**
   * 解决进展输入
   */
  inputProcess(e) {
    const val = e.detail.value;
    this.setData({
      subWoProcess: val
    })
  },
})