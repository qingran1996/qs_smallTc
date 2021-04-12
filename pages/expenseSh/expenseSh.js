var app = getApp()
Page({
  data: {
    currentIndex: 0, //默认第一个tab
    showtab: null,
    startTime: null, //开始时间
    setTitle: '', //页面顶部标题
    lasttitle: '',
    endTime: null, //结束时间
    startTime1: null, //开始时间
    setTitle1: '', //页面顶部标题
    lasttitle1: '',
    endTime1: null, //结束时间
    ch: 0,
    page: 1,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,
    downText: '加载中...',
    ishidden: false,
    isload: true,
    hidden: true,
    listshow: [],
    page1: 1,
    list1: [],
    scrollTop1: 0,
    scrollHeight1: 0,
    downText1: '加载中...',
    ishidden1: false,
    isload1: true,
    hidden1: true,
    showdata: [],
    typeId: null,
    bankUserName: null,
    fatherTypeId: null,
    minAmount: null,
    maxAmount: null,
  },
  //底部时间筛选
  timechange: function (e) {
    wx.navigateTo({
      url: '../calendar/calendar?currentIndex=' + this.data.currentIndex
    })
  },
  //底部时间筛选
  timechange1: function (e) {
    wx.navigateTo({
      url: '../calendar/calendar?currentIndex=' + this.data.currentIndex
    })
  },
  scroll1: function (event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop1: event.detail.scrollTop
    });
  },
  // 跳转待审核详情页面
  jump_daiNav: function (event) {
    // console.log(event.currentTarget.dataset.data)
    wx.navigateTo({
      url: '../expenseSh_daiNav_nav/expenseSh_daiNav_nav?data=' + encodeURIComponent(JSON.stringify(event.currentTarget.dataset.data))
    })
  },
  // 跳转已审核详情页面
  jump_yiNav: function (event) {
    console.log(event.currentTarget.dataset.statename)
    wx.navigateTo({
      url: '../expenseSh_yiNav_nav/expenseSh_yiNav_nav?data=' + encodeURIComponent(JSON.stringify(event.currentTarget.dataset.data)),
    })
  },
  //获取列表数据
  loadMore: function () {
    let that = this
    var url = app.globalData.URL + '/expenses/expensesQueryByState';
    var page_size = 10;


    // 请求数据
    that.setData({
      hidden: false
    });
    wx.request({
      url: url,
      method: 'POST',
      data: {
        userId: app.data.userMess.id,
        state: 1,
        typeId: that.data.typeId,
        bankUserName: that.data.bankUserName,
        fatherTypeId: that.data.fatherTypeId,
        minAmount: that.data.minAmount,
        maxAmount: that.data.maxAmount,
        startTime: that.data.startTime,
        endTime: that.data.endTime,
        pageNo: that.data.page,
        pageSize: page_size
      },
      success: function (res) {
        //console.info(that.data.list);
        var list = that.data.list;
        let data = res.data.data.content
        console.log(data)
        if (data.length != 0) {
          wx.showLoading({
            title: '加载中',
          })
          setTimeout(function () {
            for (let i = 0; i < data.length; i++) {
              let obj = {}
              obj.id = data[i].id
              obj.data = data[i]
              obj.expenseType = data[i].projectId != null ? '项目费用' : '公司费用'
              obj.expenseStyle = data[i].typeName
              obj.name = data[i].projectName != null ? data[i].projectName : ''
              obj.state = data[i].state
              obj.expensesDetailName = data[i].expensesDetailName != null ? data[i].expensesDetailName : ''
              if (data[i].state == 0) {
                obj.statename = '待申请'
              } else if (data[i].state == 1) {
                obj.statename = '已提交'
              } else if (data[i].state == 2) {
                obj.statename = '审批中'
              } else if (data[i].state == 3) {
                obj.statename = '审批通过'
              } else {
                obj.statename = '审批不通过'
              }
              obj.user = data[i].name
              obj.amount = data[i].amount != null ? data[i].amount : ''
              let times = app.formatDate(data[i].createTime)
              var timearr = times.replace(" ", ":").replace(/\:/g, "-").split("-");
              var timestr = "" + timearr[0] + "-" + timearr[1] + "-" + timearr[2]
              obj.time = timestr
              list.push(obj)
            }
            that.setData({
              list: list
            });
            that.data.page++;
            that.setData({
              hidden: true
            });
            wx.hideLoading()
          }, 1000)
        } else {
          that.setData({
            ishidden: false,
            isload: false,
            downText: '已加载完毕',
          });
        }


      }
    });
  },
  //获取列表数据
  loadMore1: function () {
    let that = this
    var url = app.globalData.URL + '/expenses/expensesQueryByState';
    var page_size = 10;


    // 请求数据
    that.setData({
      hidden1: false
    });
    wx.request({
      url: url,
      method: 'POST',
      data: {
        userId: app.data.userMess.id,
        state: 2,
        typeId: that.data.typeId,
        bankUserName: that.data.bankUserName,
        fatherTypeId: that.data.fatherTypeId,
        minAmount: that.data.minAmount,
        maxAmount: that.data.maxAmount,
        startTime: that.data.startTime1,
        endTime: that.data.endTime1,
        pageNo: that.data.page1,
        pageSize: page_size
      },
      success: function (res) {
        //console.info(that.data.list);
        var list1 = that.data.list1;
        let data = res.data.data.content
        // console.log(data)
        if (data.length != 0) {
          wx.showLoading({
            title: '加载中',
          })
          setTimeout(function () {
            for (let i = 0; i < data.length; i++) { 
              let obj = {}
              obj.id = data[i].id
              obj.data = data[i]
              obj.expenseType = data[i].projectId != null ? '项目费用' : '公司费用'
              obj.expenseStyle = data[i].typeName
              obj.name = data[i].projectName != null ? data[i].projectName : ''
              obj.state = data[i].state
              obj.expensesDetailName = data[i].expensesDetailName != null ? data[i].expensesDetailName : ''
              if (data[i].state == 0) {
                obj.statename = '待申请'
              } else if (data[i].state == 1) {
                obj.statename = '已提交'
              } else if (data[i].state == 2) {
                obj.statename = '审批中'
              } else if (data[i].state == 3) {
                obj.statename = '通过'
              } else {
                obj.statename = '未通过'
              }
              obj.user = data[i].name
              obj.amount = data[i].amount != null ? data[i].amount : ''
              let times = app.formatDate(data[i].createTime)
              var timearr = times.replace(" ", ":").replace(/\:/g, "-").split("-");
              var timestr = "" + timearr[0] + "-" + timearr[1] + "-" + timearr[2]
              obj.time = timestr
              list1.push(obj)
            }
            that.setData({
              list1: list1
            });
            that.data.page1++;
            that.setData({
              hidden1: true
            });
            wx.hideLoading()
          }, 1000)
        } else {
          that.setData({
            ishidden1: false,
            isload1: false,
            downText1: '已加载完毕',
          });
        }


      }
    });
  },
  //页面滑动到底部
  bindDownLoad: function () {
    var that = this;
    this.loadMore(that);
    console.log("加载了");


  },
  //页面滑动到底部
  bindDownLoad1: function () {
    var that = this;
    this.loadMore1(that);
    console.log("加载了");


  },
  scroll: function (event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  topLoad: function (event) {
    //   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
    // page = 1;
    // this.setData({
    //   list: [],
    //   scrollTop: 0
    // });
    // loadMore(this);
    // console.log("lower");
  },
  topLoad1: function (event) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.index)
    if (options.index != undefined) {
      this.setData({
        currentIndex: options.index
      })
    } else {
      this.setData({
        currentIndex: 0
      })
    }
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 40,
          scrollHeight1: res.windowHeight * 0.89 - 40
        });
      }
    })
    this.loadMore()
    this.loadMore1()

  },
  //用户点击tab时调用
  titleClick: function (e) {
    //let currentPageIndex =
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: e.currentTarget.dataset.idx
    })
  },

  //用户滑动切换tab调用
  swiperTab: function (e) {
    if (e.detail.source == 'touch') {
      this.setData({
        currentIndex: e.detail.current
      });
    }
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
    console.log(this.data.setTitle)
    if (this.data.showtab == 0) {
      this.setData({
        list: [],
        page: 1,
        lasttitle: this.data.setTitle != this.data.lasttitle ? '(' + this.data.setTitle + ')' : this.data.lasttitle
      })
      if (this.data.setTitle == '') {
        this.setData({
          lasttitle: ''
        })
      }
      this.loadMore()
    } else if (this.data.showtab == 1) {
      this.setData({
        list1: [],
        page1: 1,
        lasttitle1: this.data.setTitle1 != this.data.lasttitle1 ? '(' + this.data.setTitle1 + ')' : this.data.lasttitle1
      })
      if (this.data.setTitle1 == '') {
        this.setData({
          lasttitle1: ''
        })
      }
      this.loadMore1()
    }
    // this.setData({
    //   list: [],
    //   page: 1,
    //   list1: [],
    //   page1: 1
    // })

    // this.loadMore1()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
  onShareAppMessage: function () {

  }
})