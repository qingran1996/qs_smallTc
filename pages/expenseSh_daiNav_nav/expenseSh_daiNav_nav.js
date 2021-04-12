var app = getApp()
Page({
  data: {
    sign_image: '',
    isshow_sign: false,
    isHaveInvoice: null,
    isshow_expense: false,
    getid: null,
    scrollHeight: 0,
    moneyData: [], //保存的费用单
    askuser: '',
    fkstyle: '费用报销',
    aksuser: '',
    park: '工程部',
    date: '2020-07-09',
    projectname: '上海利伯特',
    address: '上海闵行区',
    isGL: '已关联',
    projectName: '上海利伯特',
    address: '大西瓜', 
    username: app.data.userMess.name, //员工姓名
    usernum: app.data.userMess.id, //员工编号
    bankchoose: '工资卡',
    ischoose: true,
    bankshow: {
      user: '',
      banknum: '',
      bankname: ''
    },
    checkRadio: [{
        value: 1,
        name: '是'
      },
      {
        value: 0,
        name: '否',
        checked: 'true'
      }
    ],
    checkRadioValue: 0,
    isfpPass: false,
    users: '123', //用户身份
    parkdata: [], //部门列表
    park1: 0,
    spId: '',
    showDialog: false,
    moneyTotal: 0,
    state: 1,
    statename: '待审核',
    reason: '', //审核意见
    result: null,
    showPayPwdInput: false, //是否展示密码输入层
    pwdVal: '', //输入的密码
    payFocus: true, //文本框焦点
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      checkRadioValue: e.detail.value
    })
    this.fpshow()
    const items = this.data.checkRadio
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }

    this.setData({
      items
    })
  },
  //选择审批人
  parkchange: function (e) {
    this.setData({
      'park1': e.detail.value,
      spId: this.data.parkdata[e.detail.value].id
    });
    // this.data.htList[this.data.htType].name
    console.log(this.data.spId)
  },
  sure: function () {
    console.log(this.data.spId)
    let that = this
    var url = app.globalData.URL + '/expenses/expensesCompleteUserTask';
    wx.request({
      url: url,
      method: 'POST',
      data: {
        userId: app.data.userMess.id,
        expensesId: that.data.getid,
        comment: that.data.reason,
        nextTaskUserId: that.data.spId,
        result: that.data.result
      },
      success: function (res) {
        console.log(res.data)
        let data = res.data.data
        let showid = 1
        wx.reLaunch({
          url: '../expenseSh/expenseSh?index=' + showid,
        })
      }
    });
  },
  fpshow: function () {
    let that = this
    var url = app.globalData.URL + '/expenses/expensesUpdateInvoice';
    // let form1 = new FormData()
    // form1.append('file',that.data.partwordpath)
    wx.request({
      url: url,
      method: 'POST',
      data: {
        id: that.data.getid,
        isHaveInvoice: that.data.checkRadioValue
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            isfpPass: true
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
  },
  pass: function () {
    if (this.data.sign_image == '' && this.data.isshow_sign == true) {
      wx.showToast({
        title: '请完善签名',
        icon: 'none',
        duration: 2000
      })
    } else {
      let that = this
      var url = app.globalData.URL + '/expenses/nextRoleUserList';
      wx.request({
        url: url,
        method: 'POST',
        data: {
          userId: app.data.userMess.id,
          expensesId: that.data.getid,
          orderNo: 0
        },
        success: function (res) {
          console.log(res.data)
          let data = res.data.data
          if (res.data.code == 0) {
            that.setData({
              parkdata: [],
              users: data[0].itemName
            })
            let parkdata = that.data.parkdata
            for (let i = 0; i < data.length; i++) {
              parkdata.push({
                id: data[i].userId,
                name: data[i].user.name
              })
            }
            that.setData({
              parkdata: parkdata,
              spId: parkdata[0].id,
              result: 1
            })
            setTimeout(function () {
              that.toggleDialog()
            }, 600)
          } else if (res.data.code == 11006) {
            that.setData({
              result: 1,
              spId: 0
            })
            that.sure()
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
          }

        }
      });
    }

  },
  //总经理上传签名
  showInputLayer: function () {

  },
  nopass: function () {
    // if (this.data.checkRadioValue==1) {
    //   console.log('签了')
    //   this.fpshow()
    // }
    if (this.data.sign_image == '' && this.data.isshow_sign == true) {
      wx.showToast({
        title: '请完善签名',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        result: 0,
        spId: 0
      })
      this.sure()
    }
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
  //进入具体费用详情
  moneyNav: function (e) {
    //console.log(e.currentTarget.dataset.id, e.currentTarget.dataset.type)
    let type = true
    if (e.currentTarget.dataset.type == '商务请款') {
      wx.navigateTo({
        url: '../expenseAsk_sw_nav/expenseAsk_sw_nav?id=' + e.currentTarget.dataset.id + '&parameter=' + type
      })
    } else if (e.currentTarget.dataset.type == '采购请款') {
      wx.navigateTo({
        url: '../expenseAsk_cg_nav/expenseAsk_cg_nav?id=' + e.currentTarget.dataset.id + '&parameter=' + type
      })
    } else {
      wx.navigateTo({
        url: '../expenseAsk_cl_nav/expenseAsk_cl_nav?id=' + e.currentTarget.dataset.id + '&parameter=' + type
      })
    }

  },
  //跳转审核状态
  jump_state: function (event) {
    wx.navigateTo({
      url: '../expenseAsk_nav_state/expenseAsk_nav_state?id=' + this.data.getid + '&isHaveInvoice=' + this.data.isHaveInvoice,
    })
  },
  getdata: function (id) {
    let that = this
    var url = app.globalData.URL + '/expenses/expensesGetById';
    wx.request({
      url: url,
      method: 'POST',
      data: {
        id: id,
        userName: app.data.userMess.username
      },
      success: function (res) {
        let data = res.data.data
        let moneyData = that.data.moneyData
        let bankshow = that.data.bankshow
        let statename = that.data.statename
        console.log(data)
        if (res.data.code == 0) {

          if (data.expensesPurchaseList != null) {
            //采购请款
            for (let i = 0; i < data.expensesPurchaseList.length; i++) {
              moneyData.push({
                id: data.expensesPurchaseList[i].id,
                type: '采购请款',
                name: data.expensesPurchaseList[i].type,
                num: data.expensesPurchaseList[i].amount
              })
            }
          }

          if (data.expensesBusinessesList != null) {
            //商务请款
            for (let i = 0; i < data.expensesBusinessesList.length; i++) {
              moneyData.push({
                id: data.expensesBusinessesList[i].id,
                type: '商务请款',
                name: data.expensesBusinessesList[i].type,
                num: data.expensesBusinessesList[i].amount
              })
            }
          }

          if (data.expensesTravelList != null) {
            //差旅费
            for (let i = 0; i < data.expensesTravelList.length; i++) {
              moneyData.push({
                id: data.expensesTravelList[i].id,
                type: '差旅费',
                name: data.expensesTravelList[i].type,
                num: data.expensesTravelList[i].amount
              })
            }
          }

          if (data.expensesPayList != null) {
            //银行卡选择
            for (let i = 0; i < data.expensesPayList.length; i++) {
              if (data.expenses.typeId == data.expensesPayList[i].typeId) {
                that.setData({
                  bankshow: {
                    user: data.expensesPayList[i].bankUsername,
                    banknum: data.expensesPayList[i].bankNo,
                    bankname: data.expensesPayList[i].bankName
                  }
                })
              }
            }
          }
          if (data.expenses.state == 0) {
            statename = '待申请'
          } else if (data.expenses.state == 1) {
            statename = '已提交'
          } else if (data.expenses.state == 2) {
            statename = '审批中'
          } else if (data.expenses.state == 3) {
            statename = '审批通过'
          } else {
            statename = '审批不通过'
          }
          that.setData({
            username: data.expenses.expensesPay != null ? data.expenses.expensesPay.name : '',
            usernum: data.expenses.expensesPay != null ? data.expenses.expensesPay.userId : '',
            getid: data.expenses.id,
            isHaveInvoice: data.expenses.isHaveInvoice,
            aksuser: data.expenses.expensesPay != null ? data.expenses.expensesPay.name : '',
            fkstyle: data.expenses.typeName,
            park: data.expenses.deptName,
            date: app.formatDate(data.expenses.applyTime),
            isGL: data.expenses.projectId != null ? '已关联' : '未关联',
            projectName: data.expenses.projectName,
            address: data.expenses.projectAddress,
            moneyData: moneyData,
            bankshow: {
              user: data.expenses.expensesPay != null ? data.expenses.expensesPay.bankUsername : '',
              banknum: data.expenses.expensesPay != null ? data.expenses.expensesPay.bankNo : '',
              bankname: data.expenses.expensesPay != null ? data.expenses.expensesPay.bankName : ''
            },
            bankchoose: data.expenses.typeId == 1 ? '工资卡' : '银行卡',
            moneyTotal: data.totalAmount,
            state: data.expenses.state,
            statename: statename
          })
        }


      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(this.data.showdata)
    //console.log(JSON.parse(options.data))
    let data = JSON.parse(decodeURIComponent(options.data))
    if (data.typeId == 2) {
      this.setData({
        ischoose: false
      })
    } else {
      this.setData({
        ischoose: true
      })
    }
    this.getdata(data.id)
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  },
  /**
   * 显示支付密码输入层
   */
  showInputLayer: function () {
    this.setData({
      showPayPwdInput: true,
      payFocus: true
    });
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function () {

    var val = this.data.pwdVal;

    this.setData({
      showPayPwdInput: false,
      payFocus: false,
      pwdVal: ''
    }, function () {
      console.log(val)
      // wx.showToast({
      //   title: val,
      // })
    });

  },
  /**
   * 获取焦点
   */
  getFocus: function () {
    this.setData({
      payFocus: true
    });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function (e) {
    // console.log(e.detail.value)
    this.setData({
      pwdVal: e.detail.value
    });

    // if (e.detail.value.length >= 6){
    //   this.hidePayLayer();
    // }
  },
  password_pass: function () {
    console.log(this.data.pwdVal)
    let that = this
    var url = app.globalData.URL + '/user/checkPassword';
    // let form1 = new FormData()
    // form1.append('file',that.data.partwordpath)
    wx.request({
      url: url,
      method: 'POST',
      data: {
        id: app.data.userMess.id,
        passWord: that.data.pwdVal
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.hidePayLayer();
          that.getmyimage()
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      }
    });
  },
  sighlook() {
    let images = []
    images.push(this.data.sign_image)
    wx.previewImage({
      current: this.data.sign_image, // 当前显示图片的http链接  
      urls: images // 需要预览的图片http链接列表  
    })
  },
  getmyimage: function () {
    let that = this
    var url = app.globalData.URL + '/user/getUserSign';
    // let form1 = new FormData()
    // form1.append('file',that.data.partwordpath)
    wx.request({
      url: url,
      method: 'POST',
      data: {
        id: app.data.userMess.id
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            sign_image: res.data.data != null ? app.data.qs.myUploadImg + res.data.data.attachPath : ''
          })
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
    let _this = this
    app.data.qs.get_login_user({
      success: function (res) {
        console.log(res)
        if (res.data.user.role_name.indexOf("总经理") != -1) {
          // console.log('有')
          _this.setData({
            isshow_sign: true
          })
        } else {
          // console.log('没有')
          _this.setData({
            isshow_sign: false
          })
        }
        if (res.data.user.role_name.indexOf("财务经理") != -1) {
          // console.log('有')
          _this.setData({
            isshow_expense: true
          })
        } else {
          // console.log('没有')
          _this.setData({
            isshow_expense: false
          })
        }

      }
    })
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