var app = getApp()
Page({
  data: {
    bankusername: '',
    banknum: '',
    bankname: '',
    typeId: null
  },
  //保存
  save: function () {
    let that = this
    var url = app.globalData.URL + '/expenses/expensesPayAdd';
    //console.log(that.data.projectuserName)
    wx.request({
      url: url,
      method: 'POST',
      data: {
        userId: app.data.userMess.id,
        userName: app.data.userMess.username,
        name: app.data.userMess.name,
        typeId: that.data.typeId,
        bankUsername: that.data.bankusername,
        bankName: that.data.bankname,
        bankNo: that.data.banknum
      },
      success: function (res) {
        if (res.data.code==0) {
          wx.navigateBack({
            url: '../mine/mine',
          })
        } else {
          wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
        }
       
      }
    });
    // wx.navigateBack({
    //   url: '../mine/mine',
    // })
  },
  //员工户名输入
  bankusernamechange: function (e) {
    //console.log(e.detail.value)
    this.setData({
      bankusername: e.detail.value
    })
  },
  //银行卡号输入
  banknumchange: function (e) {
    //console.log(e.detail.value)
    this.setData({
      banknum: e.detail.value
    })
  },
  //开户行输入
  banknamechange: function (e) {
    //console.log(e.detail.value)
    this.setData({
      bankname: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(this.data.showdata)
    console.log(options.typeId)
    this.setData({
      typeId: options.typeId
    })
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

  }
})