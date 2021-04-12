var app = getApp()
Page({
  data: {
    hiddenmodalput: true,   // 控制弹窗显示隐藏
        textareaVal: '',
    showDialog: false,
    projectuserName: '', //项目审批人
    parkdata: [], //部门列表
    park: 0,
    scrollHeight: 0,
    users: '', //用户身份
    projectId: 0, //项目id
    pmheight: 0 + 'px',
    person: '工程部', //申请人
    khremark: '利伯特', //客户名称
    projectremark: '愚蠢的地球人啊', //项目描述
    dzremark: '上海闵行区XXXXXXX', //项目地址
    htType: '人工合同', //合同类型默认
    protectType: '战略侵略地球', //项目类型默认
    hangye: '化工', //行业默认
    startTime: '2020-06-01',
    endTime: '2020-07-01',
    areashow: '南区', //区域
    projectTime: '20周', //项目周期
    projectAllTime: '200', //项目总工时
    shstate: {
      state: 2,
      statename: '待审核',
      url: ''
    }, //审核状态
    reason: '', //审核意见
    projectId: 0,
    userName: app.data.userMess.name,
    nextRole: '',
    nextRoleName: '',
    sureType: false
  },
  isfouce: function () {
    this.setData({
        hiddenmodalput: false
    })
},

textarea: function (e) {
    this.setData({
        textareaVal: e.detail.dataset.value
    })
},
  //关闭自定义弹框
  closedig: function () {
    this.setData({
      sureType: false
    })
    this.toggleDialog()
  },
  projectTimechange: function (e) {
    console.log(e.detail.value)
    this.setData({
      reason: e.detail.value
    });
    console.log(this.data.reason)
  },
  // 跳转详情页面
  jump_nav: function (event) {
    //console.log(this.data.id)
    wx.navigateTo({
      url: '../projectSh_daiNav_state/projectSh_daiNav_state?id=' + this.data.id,
    })
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
  //不通过
  nopass: function () {
    // console.log(this.data.projectId)
    // console.log(app.data.userMess.name)
    this.ispassshow(2)
  },
  //通过
  pass: function () {
    // this.ispassshow(1)
    let that = this
    if (that.data.nextRole != '') {
      that.setData({
        sureType: true
      })
      that.toggleDialog()
      console.log(that.data.projectuserName)
    } else {
      this.ispassshow(1)
      // let showid = 1
      // wx.reLaunch({
      //   url: '../projectSh/projectSh?index=' + showid,
      // })
    }
  },
  ispassshow: function (id) {
    let that = this
    var url = app.globalData.URL + '/task/completeProTask';
    wx.request({
      url: url,
      method: 'POST',
      data: {
        userName: app.data.userMess.username,
        projectId: that.data.projectId,
        comment: that.data.reason,
        result: id,
        nextAssignee: that.data.projectuserName==''?'123':that.data.projectuserName
      },
      success: function (res) {
        //console.info(that.data.list);
        //var list = that.data.parkdata;
        let data = res.data.data
        console.log(data)
        if (res.data.code == 0) {
          let showid = 1
          wx.reLaunch({
            url: '../projectSh/projectSh?index=' + showid,
          })
        } else {
          wx.showToast({
            title: '系统繁忙请等待',
            icon: 'loading',
            duration: 2000
          })
          setTimeout(function () {
            that.setData({
              sureType: false
            })
          }, 2000)
        }


      }
    });
  },
  isTj: function () {
    // let that = this
    // if (that.data.nextRole != '') {
    //   that.setData({
    //     sureType: true
    //   })
    //   that.toggleDialog()
    //   console.log(that.data.projectuserName)
    // } else {
    //   let showid = 1
    //   wx.reLaunch({
    //     url: '../projectSh/projectSh?index=' + showid,
    //   })
    // }
  },
  getusers: function (data, showname) {
    let that = this
    var url = app.globalData.URL + '/user/getUsers';
    wx.request({
      url: url,
      method: 'POST',
      data: {
        itemName: data
      },
      success: function (res) {
        //console.info(that.data.list);
        var list = that.data.parkdata;
        let data = res.data.data
        console.log(data)
        if (data.length != 0) {
          setTimeout(function () {
            //that.toggleDialog()
            let thatid = 0
            for (let i = 0; i < data.length; i++) {
              if (data[i] != null) {
                if (showname == data[i].name) {
                  thatid = i
                } else {
                  thatid = 0
                }
                let obj = {}
                obj.id = data[i].id
                obj.name = data[i].name
                obj.userName = data[i].userName
                list.push(obj)
              }

            }
            that.setData({
              parkdata: list,
              park: thatid,
              projectuserName: list[thatid].userName
            });
          }, 500)

        } else {

        }
      }
    });
  },
  // 审批人选择
  parkchange: function (e) {
    this.setData({
      'park': e.detail.value
    });
    // this.data.htList[this.data.htType].name
    console.log(this.data.parkdata[this.data.park].userName)
    this.setData({
      projectuserName: this.data.parkdata[this.data.park].userName
    });
  },
  //确认
  sure: function () {
    this.ispassshow(1)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // console.log(JSON.parse(options.data))
    let data = JSON.parse(decodeURIComponent(options.data))
    //console.log(this.data.showdata)
    this.data.pmheight = wx.getSystemInfoSync().windowHeight - 50 + "px"
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    this.setData({
      id: data.project.id,
      projectId: data.project.id,
      person: '12',
      nextRole: data.nextRole,
      nextRoleName: data.nextRoleName,
      khremark: data.project.customerName, //客户名称
      projectremark: data.project.desc, //项目描述
      dzremark: data.project.address, //项目地址
      htType: data.project.isExpatriated == 0 ? '总包项目合同' : '人工时项目合同', //合同类型默认
      protectType: data.project.projectKind == 0 ? '战略项目' : '常规项目', //项目类型默认
      hangye: data.project.oaProjectType != null ? data.project.oaProjectType.name : '', //行业默认
      startTime: app.formatDate(data.project.startDate * 1000),
      endTime: app.formatDate(data.project.endDate * 1000),
      areashow: data.project.oaArea != null ? data.project.oaArea.areaName : '',
      projectTime: '20周', //项目周期
      projectAllTime: data.project.totalPersonHours, //项目总工时
      shstate: {
        state: data.project.state,
        statename: '待审核',
        url: ''
      }, //审核状态
    })
    if (data.nextRole != '') {
      this.getusers(data.nextRole, data.nextRoleName)
    } else {

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