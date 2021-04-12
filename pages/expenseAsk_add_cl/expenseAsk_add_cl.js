var app = getApp()
Page({
  data: {
    expensesId: null,
    startdate: '2020-09-01',
    enddate: '2020-09-01',
    scrollHeight: 0,
    godate: '', //出行天数
    moneyType: '',
    askremark: '', //申请说明
    moneyNum: '', //请款金额
    maxmoney: 10000,
    userPD: '',
    bzremark: '', //备注
    uploadText: '上传文件',
    uploadFileName: '', //上传文件名称
    uploadFilepath: ''
  },
  //上传文件
  uploading: function (e) {
    let that = this

    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFiles
        console.log(tempFilePaths)
        wx.showLoading({
          title: '上传文件中',
        })
        if (that.data.uploadText == '') {
          that.setData({
            uploadText: '上传文件'
          })
        } else {
          that.setData({
            uploadText: '重新上传'
          })
        }
        
        wx.uploadFile({
          url: app.globalData.URL + '/expenses/expensesUpload',
          filePath: tempFilePaths[0].path,
          name: 'uploadFilePath',
          formData: {
            'userId': app.data.userMess.id,
            'typeId': 3,
            'uploadFileType': 4
          },
          success(res) {
            //json字符串 需用JSON.parse 转
            console.log(JSON.parse(res.data))
            if (JSON.parse(res.data).code == 0) {
              that.setData({
                uploadFileName: tempFilePaths[0].name,
              })
              wx.hideLoading()
              let data = JSON.parse(res.data).data
              that.setData({
                uploadFilepath: data.attachPath
              })
            } else {
              wx.hideLoading()
              wx.showToast({
                title: '上传失败',
                icon: 'loading',
                duration: 2000
              })
            }

          }
        })
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
  //保存到差旅
  saveTo: function (e) {
    if (this.data.moneyNum == '') {
      wx.showToast({
        title: '请填写请款金额',
        icon: 'none',
        duration: 3000
      })
    } else {
      let that = this
      var url = app.globalData.URL + '/expenses/expensesTravelAdd';
      // let form1 = new FormData()
      // form1.append('file',that.data.partwordpath)
      wx.request({
        url: url,
        method: 'POST',
        data: {
          attachmentFilePath: that.data.uploadFilepath,
          attachmentFilePathOriginal: that.data.uploadFileName,
          expensesId: that.data.expensesId,
          type: that.data.moneyType,
          amount: parseFloat(that.data.moneyNum),
          applicationDesc: that.data.askremark,
          remark: that.data.bzremark,
          beginDate: new Date(that.data.startdate).getTime() / 1000,
          endDate: new Date(that.data.enddate).getTime() / 1000,
          outDays: that.data.godate
        },
        success: function (res) {
          wx.navigateBack({
            url: '../expenseAsk_add/expenseAsk_add',
          })
        }
      });
    }

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
    // this.setData({
    //   moneyNum: e.detail.value
    // });
    let that = this
    if (this.data.userPD != '商务部') {
      var num = that.data.maxmoney;
      var nun = e.detail.value;
      if (num < nun) {
        that.setData({
          moneyNum: num
        })
      } else {
        that.setData({
          moneyNum: nun
        })
      }
    } else {
      this.setData({
        moneyNum: e.detail.value
      });
    }

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
      startdate: new Date(e.detail.value).toLocaleDateString()
    })
    let show = new Date(this.data.enddate).getTime() - new Date(e.detail.value).getTime()
    console.log(parseInt(show / (1000 * 60 * 60 * 24)))
    this.setData({
      godate: parseInt(show / (1000 * 60 * 60 * 24))
    })
  },
  enddateChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      enddate: new Date(e.detail.value).toLocaleDateString()
    })
    //console.log(new Date(e.detail.value).toLocaleDateString())
    //console.log(new Date(this.data.enddate).valueOf())
    let show = new Date(e.detail.value).getTime() - new Date(this.data.startdate).getTime()
    console.log(parseInt(show / (1000 * 60 * 60 * 24)))
    this.setData({
      godate: parseInt(show / (1000 * 60 * 60 * 24))
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.type)
    var day2 = new Date();
    day2.setTime(day2.getTime());
    var s2 = day2.getFullYear() + "/" + (day2.getMonth() + 1) + "/" + day2.getDate();
    console.log(s2)
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight * 0.9
        });
      }
    });
    this.setData({
      moneyType: options.type,
      expensesId: options.id,
      userPD: app.data.userMess.dept_name,
      startdate: s2,
      enddate: s2,
      godate: 0
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