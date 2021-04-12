var app = getApp()
Page({
  data: {
    getid: null,
    showtype: null,
    startdate: '2020-09-01',
    enddate: '2020-09-01',
    scrollHeight: 0,
    godate: '', //出行天数
    moneyType: '',
    askremark: '', //申请说明
    moneyNum: 0, //请款金额
    bzremark: '', //备注
    uploadText: '预览',
    uploadFileName: '', //上传文件名称
    uploadFilepath: '',
    loadingHidden: true
  },
  //获取详情
  getnav: function (id) {
    let that = this
    var url = app.globalData.URL + '/expenses/expensesTravelGetById';
    wx.request({
      url: url,
      method: 'POST',
      data: {
        id: id
      },
      success: function (res) {
        let data = res.data.data
        console.log(data)
        that.setData({
          startdate: app.formatDate(data.beginDate * 1000),
          enddate: app.formatDate(data.endDate * 1000),
          godate: data.outDays, //出行天数
          moneyType: data.type,
          askremark: data.applicationDesc, //申请说明
          moneyNum: app.moneychange(data.amount), //请款金额
          bzremark: data.remark, //备注
          uploadFileName: data.attachmentFilePathOriginal, //上传文件名称
          uploadFilepath: data.attachmentFilePathDownload,
        })

      }
    });
  },
  //上传文件
  uploading: function (e) {
    this.setData({
      loadingHidden: false
    })
    let _that = this
    wx.downloadFile({
      url: _that.data.uploadFilepath,
      success: function (res) {
        if (res.statusCode === 200) {
          var filePath = res.tempFilePath;
          console.log(res)
          let url = []
          if (res.header['Content-Type'] == 'image/jpeg' || res.header['Content-Type'] == 'image/gif' || res.header['Content-Type'] == 'image/png') {
            url.push(filePath)
            _that.setData({
              loadingHidden: true
            })
            wx.previewImage({
              current: filePath, // 当前显示图片的http链接
              urls: url // 需要预览的图片http链接列表
            })

          } else {
            //页面显示加载动画
            wx.openDocument({
              filePath: filePath,
              success: function (res) {
                _that.setData({
                  loadingHidden: true
                })
                console.log('打开文档成功')
              }
            })
          }
        } else {
          _that.setData({
            loadingHidden: true
          })
          wx.showToast({
            title: '下载失败，文件丢失或不存在',
            icon: 'none',
            duration: 2000 //持续的时间
          })
        }

      }
    })
    // wx.chooseImage({
    //   count: 1, // 默认9
    //   sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    //   sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    //   success: function (res) {
    //     // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    //     var tempFilePaths = res.tempFilePaths
    //     console.log(tempFilePaths)
    //   }
    // })
  },
  deletemoney: function () {
    let that = this
    var url = app.globalData.URL + '/expenses/expensesTravelDeleteById';
    // let form1 = new FormData()
    // form1.append('file',that.data.partwordpath)
    wx.request({
      url: url,
      method: 'POST',
      data: {
        id: that.data.getid
      },
      success: function (res) {
        wx.navigateBack({
          url: '../expenseAsk_add/expenseAsk_add',
        })
      }
    });
  },
  //
  saveTo: function (e) {
    let that = this
    wx.showModal({
      title: '是否删除差旅请款',
      success(res) {
        if (res.confirm) {
          that.deletemoney()
        } else {
          console.log('取消删除')
        }

      }
    })

  },
  // 备注
  bzRemarkInput: function (e) {
    this.setData({
      bzremark: e.detail.value
    });
    console.log(this.data.bzremark)
  },
  // 申请说明输入
  askRemarkInput: function (e) {
    this.setData({
      askremark: e.detail.value
    });
    console.log(this.data.askremark)
  },
  //请款金额输入
  moneyNumchange: function (e) {
    this.setData({
      moneyNum: e.detail.value
    });
  },
  // 出行天数输入
  godatechange: function (e) {
    this.setData({
      godate: e.detail.value
    });
    //console.log(this.data.godate)
  },
  startdateChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startdate: e.detail.value
    })
  },
  enddateChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      enddate: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.getnav(options.id)
    this.setData({
      getid: options.id,
      showtype: options.parameter
    })
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        if (options.parameter == 'true') {
          that.setData({
            scrollHeight: res.windowHeight
          });
        } else {
          that.setData({
            scrollHeight: res.windowHeight * 0.89
          });
        }
      }
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

  }
})