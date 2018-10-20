// pages/homeicss/homeicss.js
var app = getApp()
var network = require('../../utils/network.js');
const util = require('../../utils/util.js');
var urlSelect = app.globalData.BaseURL + '/info';
var urlGetList = app.globalData.BaseURL + '/questionICSS/queryVocICSSList';
var formData;
var userInfo;
var actFinished, woStatus, relatedMe; //当前选择界面标识
//接受的url
const receiveWoUrl = app.globalData.BaseURL + '/questionICSS/receiveWo';
//查询所有子工单
const allSubOrderUrl = app.globalData.BaseURL + '/questionICSS/querySubWOByUser';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //用户信息
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: "0",
    toTaskList: [], //待处理
    toCloseList: [], //待关闭
    closedList: [], //已关闭
    relatedList: [], //关注单
    formData: {}, //请求入参
    imgPath: app.globalData.imgPath, //图片地址
    pageNum: 1, //当前页码
    pageSize: 10, //每页显示数量
    loading: false, //"上拉加载"的变量，默认false，隐藏  
    loadingComplete: false, //“没有数据”的变量，默认false，隐藏 
    hasMoreData: true,
    //当前选择界面标识
    actFinished: 0,
    woStatus: 1,
    relatedMe: 1,
    subCurrentTab: 0,
    waitCloseTab: 0,
    closeedTab: 0,
    allSubList: [], // 待处理的 VOC子工单
    allSubListTotal:0,
    waitCloseSubList: [], // 待关闭的 VOC子工单
    waitCloseSubTotal:0,
    closedSubList: [], //已关闭的 VOC子工单
    closeSubTotal: 0,
    toDetailIndex: 1,
    subToDetailIndex: 1,
    waitCloselIndex: 1,
    subWaitCloselIndex: 1,
    closedindex: 1,
    subClosedindex: 1,

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},
  getInfo: function(actFinished, woStatus, relatedMe, scroll, pageNum) {
    //根据工号获取工单列表
    this.data.formData.actCurTaskAssignee = app.globalData.userInfo.staffNo; //staffUnique
    this.data.formData.actFinished = actFinished;
    this.data.formData.woStatus = woStatus;
    this.data.formData.relatedMe = relatedMe;
    this.data.formData.fromIndex = pageNum;
    this.data.formData.pageSize = 10;
    console.log(pageNum)
    const that = this;
    network.requestLoading(urlGetList, JSON.stringify(this.data.formData), '正在加载数据', function(res) {
      if (actFinished == '0') { //待处理，待关闭
        if (woStatus == '1') {
          //待处理
          if (res.rows.length > 0) {
            that.setData({
              //toTaskList: searchList,
              toTaskList: [...that.data.toTaskList, ...res.rows],
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

        } else if (woStatus == '2') {
          //待关闭
          // console.log(res.rows.length)
          if (res.rows.length > 0) {

            that.setData({

              toCloseList: [...that.data.toCloseList, ...res.rows],
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
      } else if (actFinished == '1') { //已关闭
        if (res.rows.length >= 0) {
          that.setData({
            closedList: [...that.data.closedList, ...res.rows],
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
      } else { //关注单

        if (res.rows.length >= 0) {

          that.setData({

            relatedList: [...that.data.relatedList, ...res.rows],
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

    setTimeout(() => this.setData({
      loadingComplete: false
    }), 2000)
  },

  //滚动到底部触发事件
  scrollLower: function(event) {
    const index = event.currentTarget.dataset.index;
    let curent;
    if (index == 1) {
      curent = this.data.toDetailIndex
      curent++;
      this.setData({
        toDetailIndex: curent
      })

      let that = this;
      if (that.data.hasMoreData) {
        that.setData({

          loading: true,
        });
        that.getInfo(this.data.actFinished, this.data.woStatus, this.data.relatedMe, true, curent)
      }
    }

    if (index == 2) {
      curent = this.data.subToDetailIndex
      curent++;
      this.setData({
        subToDetailIndex: curent
      });
        if (this.data.allSubListTotal > this.data.allSubList.length) {
          this.getWaitHanlderSubOrder(curent, true);
        }
    }

    if (index == 3) {
      curent = this.data.waitCloselIndex
      curent++;
      this.setData({
        waitCloselIndex: curent
      })

      let that = this;
      if (that.data.hasMoreData) {
        that.setData({

          loading: true,
        });
        that.getInfo(this.data.actFinished, this.data.woStatus, this.data.relatedMe, true, curent)
      }
    }

    if (index == 4) {
      curent = this.data.subWaitCloselIndex
      curent++;
      this.setData({
        subWaitCloselIndex: curent
      });
      if (this.data.waitCloseSubTotal > this.data.waitCloseSubList.length){
        this.getWatiColseSubOrder(curent, true);
      }
    }

    if (index == 5) {
      curent = this.data.closedindex
      curent++;
      this.setData({
        closedindex: curent
      })

      let that = this;
      if (that.data.hasMoreData) {
        that.setData({

          loading: true,
        });
        that.getInfo(this.data.actFinished, this.data.woStatus, this.data.relatedMe, true, curent)
      }
    }

    if (index == 6) {
      curent = this.data.subClosedindex
      curent++;
      this.setData({
        subClosedindex: curent
      });
      
      if (this.data.closeSubTotal > this.data.closedSubList.length) {
        this.getClosedSubOrder(curent, true);
      }
      
    }
  },
  //查看进展
  selcetproaction: function(event) {
    wx.navigateTo({
      url: '../progress/progress?id=' + event.currentTarget.dataset.id
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    that.setData({
      userInfo: app.globalData.userInfo
    });
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  initPage: function() {
    this.data.pageNum = 1,
      this.data.toTaskList = [] //待处理
    this.data.toCloseList = [], //待关闭
      this.data.closedList = [], //已关闭
      this.data.relatedList = [], //关注单
      this.data.hasMoreData = true
    this.setData({
      loading: false, //"上拉加载"的变量，默认false，隐藏  
      loadingComplete: false, //“没有数据”的变量，默认false，隐藏 
    });
  },

  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    if (e.detail.current == '0') {
      that.data.actFinished = '0'
      that.data.woStatus = '1'
      that.data.relatedMe = '1'
      this.initPage();
    } else if (e.detail.current == '1') {
      that.data.actFinished = '0'
      that.data.woStatus = '2'
      that.data.relatedMe = '1'
      this.initPage();
    } else if (e.detail.current == '2') {
      that.data.actFinished = '1'
      that.data.woStatus = '3'
      that.data.relatedMe = '1'
      this.initPage();
    } else if (e.detail.current == '3') {
      that.data.actFinished = null
      that.data.woStatus = null
      that.data.relatedMe = '2';
      this.initPage();
    }
    that.getInfo(that.data.actFinished, that.data.woStatus, that.data.relatedMe)
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
    this.setData({
      toTaskList: [],
    });
    this.getInfo(0, 1, 1);
    if (app.globalData.scene == 2) {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
    app.globalData.scene = 1;
    this.getWaitHanlderSubOrder();
    this.getWatiColseSubOrder();
    // this.getInfo(0, 1, 1);
    // const that = this;
    // this.setData({
    //   actFinished: 0,
    //   woStatus: 1,
    //   relatedMe: 1,
    //   toDetailIndex: 1,
    // })
    // this.initPage();
    // that.getInfo(that.data.actFinished, that.data.woStatus, that.data.relatedMe)
    // this.getClosedSubOrder();
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
  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {
  //   console.log('下拉加载更多');
  //   let that = this;
  //   if (that.data.hasMoreData) {
  //     that.setData({
  //       pageNum: that.data.pageNum + 1,  //每次触发上拉事件，把searchPageNum+1
  //       loading: true,
  //     });
  //     that.getInfo(this.data.actFinished, this.data.woStatus, this.data.relatedMe)
  //   }
  // },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  // },
  cardClick(e) {
    const curId = e.currentTarget.dataset.id;
    const curOrderUrl = app.globalData.BaseURL + '/questionICSS/queryVocProgress';
    const params = {
      id: curId
    };
    //查询当前工单信息
    network.requestLoading(curOrderUrl, JSON.stringify(params), '正在加载数据', function(res) {
      if (res) {
        if (res.woAssignTime) {
          wx.navigateTo({
            url: `/pages/toHandleVocView/toHandleVocView?id=${curId}`
          })
        } else {
          wx.showModal({
            title: '接受工单',
            content: '确定接受此工单吗？',
            success(e) {
              if (e.confirm) {
                //点击的是确定，这里执行后台方法
                const userInfo = app.globalData.userInfo;
                const staffNo = userInfo.staffNo;
                const params = {
                  id: curId,
                  staffNo
                }
                network.requestLoading(receiveWoUrl, JSON.stringify(params), '正在加载数据', function(res) {
                  if (res.resCode === 1) {
                    wx.navigateTo({
                      url: `/pages/toHandleVocView/toHandleVocView?id=${curId}`
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
        }
      }
    }, function() {
      wx.showToast({
        icon: 'none',
        title: '加载数据失败',
      })
    });

  },
  /**
   * 待处理
   * 切换voc工单/voc子工单
   */
  swichSubTab(e) {

    const current = e.currentTarget.dataset.current;

    this.setData({
      subCurrentTab: current
    });
    const that = this;
    if (current == 0) {
      this.setData({
        actFinished: 0,
        woStatus: 1,
        relatedMe: 1,
        toDetailIndex: 1,
      })
      this.initPage();
      that.getInfo(that.data.actFinished, that.data.woStatus, that.data.relatedMe)
    } else {
      this.getWaitHanlderSubOrder(1, false);
      this.setData({
        subToDetailIndex: 1
      })
    }
  },
  /**
   * 待关闭
   * 切换voc工单/voc子工单
   */
  swichWaitCloseTab(e) {

    const current = e.currentTarget.dataset.current;

    this.setData({
      waitCloseTab: current
    });
    const that = this;
    if (current == 0) {
      this.setData({
        actFinished: 0,
        woStatus: 2,
        relatedMe: 1,
        waitCloselIndex: 1,
      });
      this.initPage();
      that.getInfo(that.data.actFinished, that.data.woStatus, that.data.relatedMe)
    } else {
      this.setData({
        subWaitCloselIndex : 1
      })
      this.getWatiColseSubOrder(1, false);
    }
  },
  /**
   * 已关闭
   * 切换voc工单/voc子工单
   */
  swichCloseedTab(e) {

    const current = e.currentTarget.dataset.current;

    this.setData({
      closeedTab: current
    });

    const that = this;
    if (current == 0) {
      this.setData({
        actFinished: 0,
        woStatus: 3,
        relatedMe: 1,
        closedindex: 1,
      });

      this.initPage();
      that.getInfo(that.data.actFinished, that.data.woStatus, that.data.relatedMe)
    } else {
      this.setData({
        subClosedindex : 1
      })
      this.getClosedSubOrder(1, false);
    }

  },
  /**
   * 获取 待处理 VOC子工单
   */
  getWaitHanlderSubOrder(pageNum, scroll) {
    this.getSubOrder(1, pageNum, scroll);
  },
  /** 
   * 获取 待关闭 VOC子工单
   */
  getWatiColseSubOrder(pageNum, scroll) {
    this.getSubOrder(2, pageNum, scroll);
  },
  /**
   * 获取 已关闭 VOC子工单
   */
  getClosedSubOrder(pageNum,scroll) {
    this.getSubOrder(3, pageNum, scroll);
  },
  /**
   * 待处理 VOC子工单点击事件
   */
  subCardClick(e) {
    const parentVocId = e.currentTarget.dataset.parentvocid;
    const subid = e.currentTarget.dataset.subid;
    wx.navigateTo({
      url: `/pages/subToHandler/subToHandler?parentVocId=${parentVocId}&subid=${subid}`
    })
  },
  /**
   * 待关闭 VOC子工单点击事件
   */
  waitCloseSubCardClick(e) {
    const parentVocId = e.currentTarget.dataset.parentvocid;
    const subid = e.currentTarget.dataset.subid;
    wx.navigateTo({
      url: `/pages/subWaitClose/subWaitClose?parentVocId=${parentVocId}&subid=${subid}`
    })
  },
  /**
   * 已关闭 VOC子工单点击事件
   */
  closedSubCardClick(e) {
    const parentVocId = e.currentTarget.dataset.parentvocid;
    const subid = e.currentTarget.dataset.subid;
    wx.navigateTo({
      url: `/pages/subColsed/subColsed?parentVocId=${parentVocId}&subid=${subid}`
    })
  },
  signOut(e) {

    //中软注销url
    const url = app.globalData.BaseURL + '/deleteSysWxUser';
    const userInfo = app.globalData.userInfo;
    const staffNo = userInfo.staffNo;
    wx.showModal({
      title: '消息提示',
      content: '亲，您确定注销吗？',
      success: (e) => {
        if (e.confirm) { //点击的是确定，这里执行后台方法
          network.requestLoading(url, JSON.stringify({
            staffNo
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
          });
        }
      },
      fail: () => {
        wx.showToast({
          icon: 'none',
          title: '加载数据失败',
        })
      }
    })
  },
  /**
   * 根据woStatus传参不同，查询不同的VOC子工单
   * woStatus ：
   * 1 ： 待处理
   * 2 ： 待关闭
   * 3 ： 已关闭
   * scroll : 布尔值，判断是否是滚动
   */
  getSubOrder(woStatus, pageNum, scroll) {
    const self = this;
    const userInfo = app.globalData.userInfo;
    const staffNo = userInfo.staffNo;
    const pageSize = this.data.pageSize;
    const params = {
      user: {
        staffNo,
      },
      woStatus,
      pageIndex:pageNum,
      pageSize
    };
    network.requestLoading(allSubOrderUrl, JSON.stringify(params), '正在加载数据', function(res) {

      if (res) {
        res.data.rows.map(v => v.expectedDate = util.dataFormat(v.subWoDueTime, "Y-M-D"))
        if (woStatus == 1) {
          if (scroll){
            self.setData({
              allSubList: [...self.data.allSubList, ...res.data.rows]
            });
          }else{
            self.setData({
              allSubList: [...res.data.rows]
            });
          }
          
          
        } else if (woStatus == 2) {
          if (scroll) {
            self.setData({
              waitCloseSubList: [...self.data.waitCloseSubList, ...res.data.rows],
              waitCloseSubTotal: res.data.total
            })
          }else{
            self.setData({
              waitCloseSubList: [ ...res.data.rows],
              waitCloseSubTotal: res.data.total
            })
          }
          
        } else if (woStatus == 3) {
          if (scroll) {
            self.setData({
              closedSubList: [...self.data.closedSubList, ...res.data.rows],
              closeSubTotal: res.data.total
            })
          } else {
            self.setData({
              closedSubList: [...res.data.rows],
              closeSubTotal: res.data.total
            })
          }
        }
      } else {

      }
    }, function() {
      wx.showToast({
        icon: 'none',
        title: '加载数据失败',
      })
    });
  },
  /**
   * 待关闭 VOC工单
   * 点击关闭按钮的事件
   */
  closeVocOrder(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/closePage/closePage?id=${id}`
    })
  }
})