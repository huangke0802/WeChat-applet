const app = getApp();
const util = require('../../utils/util.js');
const network = require('../../utils/network.js');
//获取当前工单信息的url
const curOrderUrl = app.globalData.BaseURL + '/questionICSS/queryVocProgress';


Page({
  data: {
    curOderInfo: {},
    imgPath: app.globalData.imgPath, //图片地址
    parentVocId: '',
    planDate: "",
    sysDate: util.getFormatDate(new Date()), //系统当前时间
    taskUser: '',
    oderWorkDes: "",
  },

  onLoad: function(query) {
    this.setData({
      planDate: this.data.sysDate
    })
    const self = this;
    this.setData({
      parentVocId: query.parentVocId
    });
    const params = {
      id: query.parentVocId
    }
    //查询当前工单信息
    network.requestLoading(curOrderUrl, JSON.stringify(params), '正在加载数据', function(res) {
      console.log(res)
      if (res) {
        self.setData({
          curOderInfo: res,
        });
      }
    }, function() {
      wx.showToast({
        icon: 'none',
        title: '加载数据失败',
      })
    });

  },
  bindPlanDateChange(e) {
    this.setData({
      planDate: util.formatSelectDate(e.detail.value, '-')
    })
  },
  taskUser(e) {
    this.setData({
      taskUser: e.detail.value
    })
  },
  oderWorkDes(e) {
    this.setData({
      oderWorkDes: e.detail.value
    })
  },
  submit() {
    const taskUser = this.data.taskUser;
    const planDate = this.data.planDate;
    const oderWorkDes = this.data.oderWorkDes;
    if (!taskUser.trim()) {
      return wx.showToast({
        icon: 'none',
        title: '责任人不能为空'
      });
    }
    if (!oderWorkDes.trim()) {
      return wx.showToast({
        icon: 'none',
        title: '工单描述不能为空'
      });
    }

    const userInfo = app.globalData.userInfo;
    const staffNo = userInfo.staffNo;
    const lastName = userInfo.lastName;
    const parentVocId = this.data.parentVocId;
    const subWoDesc = this.data.oderWorkDes;
    const subWoDueTime = this.data.planDate;
    const userId = ('0000000000' + this.data.taskUser).slice(-10);
    const url = app.globalData.BaseURL + '/questionICSS/startSubWo';

    const params = {
      swo: {
        parentVocId,
        subWoDesc,
        subWoDueTime
      },
      nextTaskAssignee: {
        id: userId
      },
      user: {
        staffNo,
        lastName
      }
    }

    //点击的是确定，执行提交新增子工单
    network.requestLoading(url, JSON.stringify(params), '正在加载数据', function(res) {

      console.log(res)
      if (res.resCode == 1) {

        wx.showToast({
          icon: 'success',
          title: '添加成功',
        });
        wx.navigateBack({
          delta: 1
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: '添加失败',
        })
      }
    }, function() {
      wx.showToast({
        icon: 'none',
        title: '加载数据失败',
      })
    });
  },
  reset() {
    this.setData({
      taskUser: '',
      oderWorkDes: ""
    });
    wx.navigateBack({
      delta: 1
    });
  }
})