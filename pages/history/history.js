// miniprogram/pages/mine/mine.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    showdata: [],
    inputVal: "",
    time: 500,
    scrollTop: 0,
    scrollHeight: 0,
  },
  //前往查询历史界面
  gotosearch: function (data) {
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      payforname: data.text,
      payforbank: data.bankName,
      banknum: data.bankNo
    })

    wx.navigateBack({
      delta: 1 // 返回上一级页面。
    })
  },
  search: function (value) {
   // console.log(value)
    //console.log(this.data.showdata)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.data.showdata)
      }, 200)
    })
  },
  searching: function (e) {
    let that = this
    let showdata = []
    var url = app.globalData.URL + '/expenses/expensesPayGetByName';
    wx.request({
      url: url,
      method: 'POST',
      data: {
        bankUsername: e.detail.value
      },
      success: function (res) {
        let data = res.data.data
        if (data != null) {
          that.data.showdata = showdata
          // console.log(data)
          for (let i = 0; i < data.length; i++) {
            showdata.push({
              text: data[i].bankUsername,
              value: data[i].id,
              bankName: data[i].bankName,
              bankNo: data[i].bankNo
            })
          }
          that.setData({
            showdata: showdata
          })
        } else {
          that.setData({
            showdata: []
          })
        }

      }
    });
    this.setData({
      search: this.search.bind(this)
    })
  },
  selectResult: function (e) {
    console.log('select result', e.detail)
    this.gotosearch(e.detail.item)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    // this.setData({
    //   search: this.search.bind(this)
    // })
    // console.log(app.data.userMess.role_name.split(","))
  },
  scroll: function (event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });
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
    return app.data.shareMenu;
  }
})