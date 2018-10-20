const app = getApp();
const util = require('../../utils/util.js');
const network = require('../../utils/network.js');

//改进措施发布给客户 url
const improveUrl = app.globalData.BaseURL + '/questionICSS/publishWoMeasures';
//解决进展发布给客户 url
const solveUrl = app.globalData.BaseURL + '/questionICSS/publishWoProcess';
//查询子工单的url
const subOrdersUrl = app.globalData.BaseURL + '/questionICSS/querySubWO';
//获取当前工单信息的url
const curOrderUrl = app.globalData.BaseURL + '/questionICSS/queryVocProgress';
//获取voc小类url
const smallVocUrl = app.globalData.BaseURL + '/questionICSS/getDict';
//查看历史进展
const historyUrl = app.globalData.BaseURL + '/questionICSS/queryWoProcessByVocId';
//保存草稿
const saveDraftUrl = app.globalData.BaseURL + '/questionICSS/updateVoc';
//提交客户并关闭
const submitColseUrl = app.globalData.BaseURL + '/questionICSS/submitVoc';

Page({
  data: {
    id: '',
    isProblem: 0,
    problemRange: [{
      value: 0,
      text: '是'
    }, {
      value: 1,
      text: '否'
    }],
    sortVOC: 0,
    sortVOCRange: [{
      value: 1,
      id: 195,
      text: '人力资源管理'
    }, {
      value: 2,
      id: 196,
      text: '能力提升'
    }, {
      value: 3,
      id: 197,
      text: '质量管理'
    }, {
      value: 4,
      id: 198,
      text: '沟通管理'
    }, {
      value: 5,
      id: 199,
      text: '行政支撑'
    }, {
      value: 6,
      id: 200,
      text: '信息安全'
    }, {
      value: 7,
      id: 201,
      text: 'IT支撑'
    }, {
      value: 8,
      id: 307,
      text: '其它'
    }],
    sortSmallVOC: 0,
    sortSmallVOCRange: [],
    frequency: 0,
    frequencyRange: [{
      value: 1,
      text: '每天一次'
    }, {
      value: 2,
      text: '每周一次'
    }, {
      value: 3,
      text: '半月一次'
    }, {
      value: 4,
      text: '每月一次'
    }],
    sysDate: util.getFormatDate(new Date()), //系统当前时间
    planDate: util.getFormatDate(new Date()), //计划关闭日期，
    imgPath: app.globalData.imgPath, //图片地址
    improveValue: '',
    solveValue: '',
    curOderInfo: {},
    subOrderTotal: 0,
    expectedDate: '',
    historyList : [],
    isSub: 0,
  },
  bindProblemChange(e) {
    this.setData({
      isProblem: e.detail.value
    })
  },
  bindPlanDateChange(e) {
    this.setData({
      planDate: util.formatSelectDate(e.detail.value, '-')
    })
  },
  onLoad: function(query) {

    const self = this;
    this.setData({
      id: query.id
    });
    const params = {
      id: query.id
    }
    //查询当前工单信息
    network.requestLoading(curOrderUrl, JSON.stringify(params), '正在加载数据', function(res) {
      if (res) {
        self.setData({
          curOderInfo: res,
          improveValue: res.woMeasures,
          solveValue: res.woProgress,
          isProblem: res.woIsProblem,
          frequency:res.woTrackFreq,
          sortVOC:res.vocType-1,
          sortSmallVOC:res.vocSubType-1,
          planDate: util.dataFormat(res.woPlanCloseTime, "Y-M-D"),
          expectedDate: util.dataFormat(res.woDueTime, "Y-M-D")
        });
      }
    }, function() {
      wx.showToast({
        icon: 'none',
        title: '加载数据失败',
      })
    });
    
    //初始化历史进展
    this.loadHistoryInfo();

    //初始化小类
    this.getSmallVocInfo(195)

  },
  bindFrequencyChange(e) {
    this.setData({
      frequency: e.detail.value
    })
  },
  bindSortVOCChange(e) {
    this.setData({
      sortVOC: e.detail.value
    })
    const vocId = this.data.sortVOCRange[e.detail.value].id;

    this.getSmallVocInfo(vocId);

  },
  bindSmallVOCChange(e) {
    this.setData({
      sortSmallVOC: e.detail.value
    });
  },

  /**
   * 发送改进措施给客户
   */
  sendImproveToClient(e) {
    const self = this;
    const userInfo = app.globalData.userInfo;
    const staffNo = userInfo.staffNo;
    const params = {
      id: this.data.id,
      measures: this.data.improveValue,
      staffNo
    };
    network.requestLoading(improveUrl, JSON.stringify(params), '正在加载数据', function(res) {
      if (res.resCode === 1) {
        wx.showToast({
          icon: 'success',
          title: '发布成功',
        });
        self.loadHistoryInfo();
      }
    }, function() {
      wx.showToast({
        icon: 'none',
        title: '加载数据失败',
      })
    });
  },
  /**
   * 发送解决措施给客户
   */
  sendSolveToClient(e) {
    const self = this;
    const userInfo = app.globalData.userInfo;
    const staffNo = userInfo.staffNo;
    const params = {
      id: this.data.id,
      content: this.data.solveValue,
      staffNo
    };
    network.requestLoading(solveUrl, JSON.stringify(params), '正在加载数据', function(res) {
      if (res.resCode === 1) {
        wx.showToast({
          icon: 'success',
          title: '发布成功',
        });
        self.loadHistoryInfo();
      }
    }, function() {
      wx.showToast({
        icon: 'none',
        title: '加载数据失败',
      })
    });
  },
  addWorkOrder(e) {
    const parentVocId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/buildNewWorkOrder/buildNewWorkOrder?parentVocId=${parentVocId}`
    })
  },
  bindImproveTextAreaBlur(e) {
    this.setData({
      improveValue: e.detail.value
    })
  },
  bindSolveTextAreaBlur(e) {
    this.setData({
      solveValue: e.detail.value
    })
  },
  bindRejectValue(e) {
    this.setData({
      rejectValue: e.detail.value
    })
  },

  gotoWorkOrder(e) {
    if (this.data.subOrderTotal > 0) {
      wx.navigateTo({
        url: `/pages/subWorkOrderPage/subWorkOrderPage?parentVocId=${this.data.id}`
      })
    }
  },
  onShow() {
    const self = this;
    //查询子工单信息
    network.requestLoading(subOrdersUrl, JSON.stringify({
      'parentVocId': this.data.id
    }), '正在加载数据', function(res) {
      if (res.resCode === 1) {
        self.setData({
          subOrderTotal: res.data.rows.length
        });
        
        for (var i = 0; i < res.data.rows.length;i++){
          if (res.data.rows[i].currentStatus != 4) {
            self.setData({
              isSub: 1
            });
          }
        }

       
      }
    }, function() {
      wx.showToast({
        icon: 'none',
        title: '加载数据失败',
      })
    });
  },
  gotoCustomerInfo() {
    wx.navigateTo({
      url: '../customerInfo/customerInfo?id=' + this.data.id
    });
  },
  saveDraft() {
    let params = {};
    if (this.data.isProblem == 0) {
      params.wo = {
        id: this.data.id,
        vocType: this.data.sortVOCRange[this.data.sortVOC].value,
        vocSubType: this.data.sortSmallVOCRange[this.data.sortSmallVOC].value,
        woIsProblem: this.data.isProblem,
        woMeasures: this.data.improveValue,
        woPlanCloseTime: this.data.planDate,
        woProgress: this.data.solveValue,
        woTrackFreq: this.data.frequency
      }
    } else {
      params.wo = {
        id: this.data.id,
        woIsProblem: this.data.isProblem,
        woNoDealReason: ''
      }
    }
    //保存草稿
    network.requestLoading(saveDraftUrl, JSON.stringify(params), '正在加载数据', function(res) {
      if(res && res.resCode == 1){
        wx.showToast({
          title: '保存成功',
        })
      }else{
        wx.showToast({
          icon: 'none',
          title: '保存失败',
        })
      }
    }, function() {
      wx.showToast({
        icon: 'none',
        title: '加载数据失败',
      })
    });
  },
  /**
   * 提交客户关闭
   */
  submitColse() {
    
    if (this.data.isSub == 1) {
      return wx.showToast({
        icon: 'none',
        title: '请先关闭子工单',
      })
    }
    if (this.data.isProblem == 0) {
      if (!this.data.improveValue || !this.data.improveValue.trim()){
        return wx.showToast({
          icon: 'none',
          title: '改进措施不能为空',
        })
      }

      if (!this.data.solveValue || !this.data.solveValue.trim()) {
        return wx.showToast({
          icon: 'none',
          title: '解决进展不能为空',
        })
      }
    }

    let params = {};
    const userInfo = app.globalData.userInfo;
    const staffNo = userInfo.staffNo;
    const lastName = userInfo.lastName;
    if (this.data.isProblem == 0) {
      params.wo = {
        id: this.data.id,
        vocSubType: this.data.sortVOCRange[this.data.sortVOC].value,
        vocType: this.data.sortSmallVOCRange[this.data.sortSmallVOC].value,
        woIsProblem: this.data.isProblem,
        woMeasures: this.data.improveValue,
        woPlanCloseTime: this.data.planDate,
        woProgress: this.data.solveValue,
        woTrackFreq: this.data.frequency
      }
      params.user = {
        staffNo: staffNo,
        lastName: lastName
      }
    } else {
      params.wo = {
        id: this.data.id,
        woIsProblem: this.data.isProblem,
        woNoDealReason: ''
      }
      params.user = {
        staffNo: staffNo,
        lastName: lastName
      }
    }
    //提交客户关闭
    network.requestLoading(submitColseUrl, JSON.stringify(params), '正在加载数据', function(res) {
      if (res && res.resCode == 1) {
        wx.showToast({
          title: '提交成功',
        })
        wx.navigateBack({
          delta: 1
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: '提交失败',
        })
      }
    }, function() {
      wx.showToast({
        icon: 'none',
        title: '加载数据失败',
      })
    });
  },
  /**
   * 获取voc小类
   */
  getSmallVocInfo(parentId) {
    const self = this;
    //查询Voc小类
    network.requestLoading(smallVocUrl, JSON.stringify({
      moduleName: "ISSUESUBTYPE",
      parentId
    }), '正在加载数据', function(res) {
      if (res && res.resCode == 1) {
        self.setData({
          sortSmallVOCRange: res.data,
        })
      }
    }, function() {
      wx.showToast({
        icon: 'none',
        title: '加载数据失败',
      })
    })
  },
  /**
   * 加载历史数据
   */
  loadHistoryInfo(){
    //加载历史进展
    const id = this.data.id;
    const userInfo = app.globalData.userInfo;
    const staffNo = userInfo.staffNo;
    const self = this;
    network.requestLoading(historyUrl, JSON.stringify({
      vocId: id,
      staffNo
    }), '正在加载数据', function (res) {
      if (res && res.data) {
        
        res.data.map(v => v.time = util.dataFormat(v.time, "Y-M-D h:m:s"))
        self.setData({
          historyList: res.data
        })
      }
    }, function () {
      wx.showToast({
        icon: 'none',
        title: '加载数据失败',
      })
    });
  }

})