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
    isload: true
  },
  //底部时间筛选
  timechange: function (e) {
    wx.navigateTo({
      url: '../calendar/calendar'
    })
  },
  // 跳转新增页面
  jump_projectAdd: function () {
    wx.navigateTo({
      url: '../projectAsk_add/projectAsk_add',
    })
  },
  // 跳转详情页面
  jump_nav: function (event) {
    console.log(event.currentTarget.dataset.data)
    wx.navigateTo({
      url: '../projectAsk_nav/projectAsk_nav?data=' + encodeURIComponent(JSON.stringify(event.currentTarget.dataset.data))
    })
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
    // this.loadMore();
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
      title: this.data.setTitle == '' ? '项目申请列表' : '项目申请列表' + '(' + this.data.setTitle + ')'
    })
    this.loadMore();
  },
  loadMore: function () {
    let that = this
    var url = app.globalData.URL + '/project/query';
    var page_size = 10;


    // 请求数据
    that.setData({
      hidden: false
    });
    wx.request({
      url: url,
      method: 'POST',
      data: {
        userName: app.data.userMess.username,
        startDate: that.data.startTime,
        endDate: that.data.endTime,
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
              if (data[i] != null) {
                let obj = {}
                obj.id = data[i].id
                obj.data = data[i]
                obj.name = data[i].name
                obj.state = data[i].state

                if (data[i].state == 2) {
                  obj.statename = '审批中'
                } else if (data[i].state == 3) {
                  obj.statename = '审批通过'
                } else {
                  obj.statename = '审批未通过'
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