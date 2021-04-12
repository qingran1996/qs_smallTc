var app = getApp()
Page({
  data: {
    startdate: '2020-09-01',
    enddate: '2020-09-01',
    scrollHeight: 0,
    khname: '', //相关客户
    godate: '', //出行天数
    moneyType: '',
    expensesId: null,
    partword: '', //比价过程文件
    partwordpath: '',
    partwordstyle: '上传文件',
    ht: '', //合同
    htpath: '',
    htstyle: '上传文件',
    fp: '', //发票
    fppath: '',
    fpstyle: '上传文件',
    askremark: '', //申请说明
    moneyNum: '', //请款金额
    bzremark: '', //备注
    uploadText: '上传文件',
    uploadFilepath: '',
    uploadFileName: '', //上传文件名称
  },
  //发票上传
  fpshow: function () {
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
        if (that.data.fpstyle == '') {
          that.setData({
            fpstyle: '上传文件'
          })
        } else {
          that.setData({
            fpstyle: '重新上传'
          })
        }
        
        wx.uploadFile({
          url: app.globalData.URL + '/expenses/expensesUpload',
          filePath: tempFilePaths[0].path,
          name: 'uploadFilePath',
          formData: {
            'userId': app.data.userMess.id,
            'typeId': 2,
            'uploadFileType': 3
          },
          success(res) {
            //json字符串 需用JSON.parse 转
            console.log(JSON.parse(res.data))
            if (JSON.parse(res.data).code == 0) {
              that.setData({
                fp: tempFilePaths[0].name
              })
              wx.hideLoading()
              let data = JSON.parse(res.data).data
              that.setData({
                fppath: data.attachPath
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
  },
  //合同上传
  htshow: function () {
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
        if (that.data.htstyle == '') {
          that.setData({
            htstyle: '上传文件'
          })
        } else {
          that.setData({
            htstyle: '重新上传'
          })
        }
       
        wx.uploadFile({
          url: app.globalData.URL + '/expenses/expensesUpload',
          filePath: tempFilePaths[0].path,
          name: 'uploadFilePath',
          formData: {
            'userId': app.data.userMess.id,
            'typeId': 2,
            'uploadFileType': 2
          },
          success(res) {
            //json字符串 需用JSON.parse 转
            console.log(JSON.parse(res.data))
            if (JSON.parse(res.data).code == 0) {
              that.setData({
                ht: tempFilePaths[0].name
              })
              wx.hideLoading()
              let data = JSON.parse(res.data).data
              that.setData({
                htpath: data.attachPath
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
  },
  //比价过程文件上传
  partwordshow: function () {
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
        if (that.data.partwordstyle == '') {
          that.setData({
            partwordstyle: '上传文件'
          })
        } else {
          that.setData({
            partwordstyle: '重新上传'
          })
        }
        
        wx.uploadFile({
          url: app.globalData.URL + '/expenses/expensesUpload',
          filePath: tempFilePaths[0].path,
          name: 'uploadFilePath',
          formData: {
            'userId': app.data.userMess.id,
            'typeId': 2,
            'uploadFileType': 1
          },
          success(res) {
            //json字符串 需用JSON.parse 转
            console.log(JSON.parse(res.data))
            if (JSON.parse(res.data).code == 0) {
              that.setData({
                partword: tempFilePaths[0].name
              })
              wx.hideLoading()
              let data = JSON.parse(res.data).data
              that.setData({
                partwordpath: data.attachPath
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
  },
  //相关附件上传
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
            'typeId': 2,
            'uploadFileType': 4
          },
          success(res) {
            //json字符串 需用JSON.parse 转
            console.log(JSON.parse(res.data))
            if (JSON.parse(res.data).code == 0) {
              that.setData({
                uploadFileName: tempFilePaths[0].name
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
  },
  //保存到差旅
  saveTo: function (e) {
    if (this.data.moneyNum == ''&&this.data.khname=='') {
      wx.showToast({
        title: '请填写客户名称和请款金额',
        icon: 'none',
        duration: 3000
      })
    } else if(this.data.moneyNum == ''&&this.data.khname!=''){
      wx.showToast({
        title: '请填写请款金额',
        icon: 'none',
        duration: 3000
      })
    } else if(this.data.moneyNum != ''&&this.data.khname==''){
      wx.showToast({
        title: '请填写客户名称',
        icon: 'none',
        duration: 3000
      })
    } else {
      let that = this
      var url = app.globalData.URL + '/expenses/expensesBusinessAdd';
      // let form1 = new FormData()
      // form1.append('file',that.data.partwordpath)
      wx.request({
        url: url,
        method: 'POST',
        data: {
          priceComparePath: that.data.partwordpath,
          priceComparePathOriginal: that.data.partword,
          contractPath: that.data.htpath,
          contractPathOriginal: that.data.ht,
          invoicePath: that.data.fppath,
          invoicePathOriginal: that.data.fp,
          attachmentFilePath: that.data.uploadFilepath,
          attachmentFilePathOriginal: that.data.uploadFileName,
          expensesId: that.data.expensesId,
          customer: that.data.khname,
          type: that.data.moneyType,
          amount: parseFloat(that.data.moneyNum),
          applicationDesc: that.data.askremark,
          remark: that.data.bzremark
        },
        success: function (res) {
          wx.navigateBack({
            url: '../expenseAsk_add/expenseAsk_add',
          })
        }
      });
    }


    //存储本地数据
    // let that = this
    // wx.setStorage({
    //   key: 'clData',
    //   data: {
    //     type: '商务请款',
    //     name: that.data.moneyType,
    //     num: that.data.moneyNum
    //   }
    // })
    // wx.navigateBack({
    //   url: '../expenseAsk_add/expenseAsk_add',
    // })
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
  // 相关客户输入
  khchange: function (e) {
    this.setData({
      khname: e.detail.value
    });
    //console.log(this.data.khname)
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
    console.log(options)
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
      expensesId: options.id
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