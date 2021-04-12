var app = getApp()
Page({
  data: {
    projectname: '',
    projectnum: '',
    deptname: '',
    projectzt: '',
    projectmoney: '',
    moneyFP: [], //奖金分配
    time: '',
    processInstanceId: '',
    reason: '',
    parkdata: [], //部门列表
    park1: 0,
    users: '',
    spId: ''
  },
  //选择审批人
  parkchange: function (e) {
    this.setData({
      'park1': e.detail.value
    });
    // this.data.htList[this.data.htType].name
    // console.log(this.data.spId)
  },
  sure: function () {
    let that = this
    var url = app.globalData.URL + '/oaprojectbonus/selectNextAssignee?processInstanceId=' + that.data.processInstanceId + '&userId=' + that.data.spId;
    wx.request({
      url: url,
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        let data = res.data.data
        let showid = 1
        wx.reLaunch({
          url: '../moneySh/moneySh?index=' + showid,
        })
      }
    });
  },
  getnext: function () {
    let that = this
    var url = app.globalData.URL + '/oaprojectbonus/getNextAssignee?processInstanceId=' + that.data.processInstanceId;
    wx.request({
      url: url,
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        let data = res.data.data
        if (res.data.code == 0) {
          that.setData({
            parkdata: [],
            users: data[0].positionName
          })
          let parkdata = that.data.parkdata
          for (let i = 0; i < data.length; i++) {
            parkdata.push({
              id: data[i].id,
              name: data[i].name
            })
          }
          that.setData({
            parkdata: parkdata,
            spId: parkdata[0].id
          })
          setTimeout(function () {
            that.toggleDialog()
          }, 500)
        } else {
          let showid = 1
          wx.reLaunch({
            url: '../moneySh/moneySh?index=' + showid,
          })
        }

      }
    });
  },
  pass: function () {
    let that = this
    let status = 1
    var url = app.globalData.URL + '/oaprojectbonus/excuteAuditTask?userId=' + app.data.userMess.id + '&processInstanceId=' + that.data.processInstanceId + '&message=' + that.data.reason + '&auditStatus=' + status;
    wx.request({
      url: url,
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        that.getnext()
      }
    });
  },
  nopass: function () {
    let that = this
    let status = 0
    var url = app.globalData.URL + '/oaprojectbonus/excuteAuditTask?userId=' + app.data.userMess.id + '&processInstanceId=' + that.data.processInstanceId + '&message=' + that.data.reason + '&auditStatus=' + status;
    wx.request({
      url: url,
      method: 'POST',
      success: function (res) {
        // console.log(res.data)
        // let data = res.data.data
        let showid = 1
        wx.reLaunch({
          url: '../moneySh/moneySh?index=' + showid,
        })
      }
    });
  },
  parkchange: function (e) {
    this.setData({
      'park1': e.detail.value,
      'spId': this.data.parkdata[e.detail.value].id
    });
  },
  //审核意见
  projectTimechange: function (e) {
    //console.log(e.detail.value)
    this.setData({
      reason: e.detail.value
    });
    console.log(this.data.reason)
  },
  //关闭自定义弹框
  closedig: function () {
    this.toggleDialog()
  },
  /**
   * 控制 pop 的打开关闭
   * 该方法作用有2:
   * 1：点击弹窗以外的位置可消失弹窗
   * 2：用到弹出或者关闭弹窗的业务逻辑时都可调用
   */
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    });

  },
  // 跳转审核状态页面
  jump_nav: function (event) {
    //console.log(event.currentTarget.dataset.state)
    wx.navigateTo({
      url: '../moneyAsk_nav_state/moneyAsk_nav_state?processInstanceId=' + event.currentTarget.dataset.state,
    })
  },
  //获取页面详情
  getdata: function (id) {
    let that = this
    var url = app.globalData.URL + '/oaprojectbonus/getOaProjectBonusDetailByOaProjectBonusId?bussinessId=' + id;
    wx.request({
      url: url,
      method: 'POST',
      success: function (res) {
        let data = res.data.data
        let moneyFP = that.data.moneyFP
        console.log(data)
        for (let i = 0; i < data.length; i++) {
          if (data[i] != null) {
            moneyFP.push({
              id: i,
              roleName: data[i].roleName,
              positionName: data[i].positionName,
              namedata: data[i].users
            })
          }
        }
        that.setData({
          moneyFP: moneyFP
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(decodeURIComponent(options.data))
    //console.log(JSON.stringify(options.data))
    //console.log(JSON.parse(options.data))
    let data = JSON.parse(decodeURIComponent(options.data))
    //console.log(data)
    this.getdata(parseInt(data.businessId))
    this.setData({
      processInstanceId: data.processInstanceId,
      projectname: data.oaProjectName,
      projectnum: data.oaProjectNo,
      deptname: data.deptName,
      projectpart: data.taskName,
      projectzt: data.status,
      projectmoney: data.fee,
      time: app.formatDate(data.applyTime)
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