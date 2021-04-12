var app = getApp()

Page({
  data: {
    hidden: true,
    startTime: '', //开始时间
    setTitle: '', //页面顶部标题
    endTime: '', //结束时间
    page: 1,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,
    downText: '加载中...',
    ishidden: false,
    isload: true,
    showActionsheet: false,
    show: false,
    buttons: [{
        type: 'default',
        className: '',
        text: '取消',
        value: 0
      },
      {
        type: 'primary',
        className: '',
        text: '确定',
        value: 1
      }
    ],
    date: '2016-09',
    slideButtons1: [],
    slideButtons: [{
      id: 1,
      type: 'warn',
      text: '删除'
    }],
    groups: [{
        text: '预支费用',
        value: 1
      },
      {
        text: '付款申请',
        value: 2
      }
    ],
    typeId: null,
    bankUserName: null,
    fatherTypeId: null,
    minAmount: null,
    maxAmount: null,
  },
  slideButtonTap: function (e) {
    console.log('slide button tap', e.currentTarget.dataset.data)
    let that = this
    var url = app.globalData.URL + '/expenses/expensesDeleteById';
    wx.request({
      url: url,
      method: 'POST',
      data: {
        id: e.currentTarget.dataset.data.id
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.onShow()
        } else {
          wx.showToast({
            title: '系统繁忙',
            icon: 'none',
            duration: 3000
          })
        }
      }
    });
  },
  close: function () {
    this.setData({
      showActionsheet: false
    })
  },
  btnClick(e) {
    console.log(e.detail.value, this.data.groups[e.detail.value - 1].text, (new Date()).valueOf())
    let that = this
    var url = app.globalData.URL + '/expenses/expensesAdd';
    wx.request({
      url: url,
      method: 'POST',
      data: {
        userId: app.data.userMess.id,
        typeId: e.detail.value,
        typeName: that.data.groups[e.detail.value - 1].text,
        deptId: app.data.userMess.dept_id,
        deptName: app.data.userMess.dept_name,
        applyTime: (new Date()).valueOf()
      },
      success: function (res) {
        console.log(res)
        if (res.data.data == null) {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 3000
          })
        } else {
          //在准备新增前清理数据
          //wx.clearStorage()
          wx.navigateTo({
            url: '../expenseAsk_add/expenseAsk_add?data=' + JSON.stringify(res.data.data),
          })
        }
        that.close()
      }
    });


  },
  // 跳转新增页面
  jump_projectAdd: function (e) {
    this.setData({
      showActionsheet: true
    })
    // wx.navigateTo({
    //   url: '../projectAsk_add/projectAsk_add', 
    // })
  },
  //底部时间筛选
  timechange: function (e) {
    wx.navigateTo({
      url: '../calendar/calendar'
    })
  },
  // 跳转详情页面
  jump_nav: function (event) {
    //console.log(event.currentTarget.dataset.data)
    //判断是否为未申请的数据+
    if (event.currentTarget.dataset.data.state != 0) {
      wx.navigateTo({
        url: '../expenseAsk_nav/expenseAsk_nav?data=' + encodeURIComponent(JSON.stringify(event.currentTarget.dataset.data)) + '&title=' + event.currentTarget.dataset.data.typeName
      })
    } else {
      wx.navigateTo({
        url: '../expenseAsk_add/expenseAsk_add?data=' + encodeURIComponent(JSON.stringify(event.currentTarget.dataset.data))
      })
    }
    // wx.navigateTo({
    //   url: '../expenseAsk_nav/expenseAsk_nav?data=' + JSON.stringify(event.currentTarget.dataset.data) + '&title=' + event.currentTarget.dataset.data.typeName
    // })
  },
  handleMove: function (e) {

  },
  onLoad: function () {
    //   这里要注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight * 0.89
        });
      }
    });

  },
  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    this.setData({
      list: [],
      page: 1
    })
    wx.setNavigationBarTitle({
      title: this.data.setTitle == '' ? '费用申请列表' : '费用申请列表' + '(' + this.data.setTitle + ')'
    })
    this.loadMore();
  },
  loadMore: function () {
    let that = this
    var url = app.globalData.URL + '/expenses/expensesQuery';
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
        pageNo: that.data.page,
        typeId: that.data.typeId,
        bankUserName: that.data.bankUserName,
        fatherTypeId: that.data.fatherTypeId,
        minAmount: that.data.minAmount,
        maxAmount: that.data.maxAmount,
        startTime: that.data.startTime,
        endTime: that.data.endTime,
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
              if (data[i] != null) {
                let obj = {}
                obj.id = data[i].id
                obj.data = data[i]
                obj.expenseType = data[i].projectId != null ? '项目费用' : '公司费用'
                obj.expenseStyle = data[i].typeName
                obj.name = data[i].projectName != null ? data[i].projectName : ''
                obj.state = data[i].state
                obj.user = data[i].name
                obj.amount = data[i].amount != null ? data[i].amount : ''
                let times = app.formatDate(data[i].createTime)
                var timearr = times.replace(" ", ":").replace(/\:/g, "-").split("-");
                var timestr = "" + timearr[0] + "-" + timearr[1] + "-" + timearr[2]
                obj.time = timestr
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
                list.push(obj)
              }
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
  //页面滑动到底部
  bindDownLoad: function () {
    var that = this;
    this.loadMore(that);
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
  }
})