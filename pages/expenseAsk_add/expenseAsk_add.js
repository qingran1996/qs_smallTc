var app = getApp()
Page({
  data: {
    getid: null,
    toptitle: '',
    showtypeId: null,
    scrollHeight: 0,
    users: '123', //用户身份
    park1: 0, //申请部门默认
    onlyUserData: [], //个人身份列表
    onlyId: 0,
    onlyUser: '',
    parkdata: [], //部门列表
    spId: '',
    showDialog: false,
    projectuserName: '', //项目审批人
    projectuserId: 0,
    moneyData: [], //保存的费用单
    slideButtons: [{
      type: 'warn',
      text: '删除',
    }],
    fkstyle: '费用报销',
    showstyle: null,
    park: '工程部',
    date: '2020-07-09',
    projectname: '上海利伯特',
    isconnect: false,
    isprojectshow: false,
    projectdataId: 0, //客户名称
    projectdata: [],
    username: app.data.userMess.name, //员工姓名
    usernum: app.data.userMess.id, //员工编号
    bankshow: {},
    moneyTotal: 0,
    bankId: 0,
    bankdata: [],
    payforname: '', //销售方户名
    payforbank: '', //开户行
    banknum: '', //银行卡号
    multiArray: [
      [],
      []
    ],
    multiIndex: [0, 0],
    moneyAlldata: [], //获取的费用总列表
    swdata: [], //获取的商务列表
    cldata: [], //获取的差旅列表
    cgdata: [], //获取的采购列表
    sureType: false
  },
  //前往查询历史界面
  gotosearch: function () {
    wx.navigateTo({
      url: '../history/history'
    })
  },
  //滑动操作
  slideButtonTap(e) {
    console.log('slide button tap', e.detail)
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
  //个人身份选择
  onlychange: function (e) {
    this.setData({
      'onlyId': e.detail.value,
      onlyUser: this.data.onlyUserData[e.detail.value]
    });
    //console.log(this.data.onlyUserData[this.data.onlyId])
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
  //进入具体费用详情
  moneyNav: function (e) {
    console.log(e.currentTarget.dataset.id)
    let type = false
    if (e.currentTarget.dataset.type == '商务请款') { 
      wx.navigateTo({
        url: '../expenseAsk_sw_upload/expenseAsk_sw_upload?id=' + e.currentTarget.dataset.id + '&parameter=' + type
      })
    } else if (e.currentTarget.dataset.type == '采购请款') {
      wx.navigateTo({
        url: '../expenseAsk_cg_upload/expenseAsk_cg_upload?id=' + e.currentTarget.dataset.id + '&parameter=' + type
      })
    } else {
      wx.navigateTo({
        url: '../expenseAsk_cl_upload/expenseAsk_cl_upload?id=' + e.currentTarget.dataset.id + '&parameter=' + type
      })
    }
  },
  //输入销售方户名
  payfornamechange: function (e) {
    this.setData({
      payforname: e.detail.value
    });
  },
  //输入开户行
  payforbankchange: function (e) {
    this.setData({
      payforbank: e.detail.value
    });
  },
  //输入银行卡号
  banknumchange: function (e) {
    this.setData({
      banknum: e.detail.value
    });
  },
  //费用类别
  getexpensesType: function () {
    let that = this
    var url = app.globalData.URL + '/expenses/expensesTypeQuery';
    wx.request({
      url: url,
      method: 'POST',
      data: {},
      success: function (res) {
        let data = res.data.data
        let montypedata = that.data.multiArray
        let moneydata = []
        let swdata = that.data.swdata
        let cldata = that.data.cldata
        let cgdata = that.data.cgdata
        // console.log(data)
        for (let i = 0; i < data.length; i++) {
          if (data[i].pid == 0) {
            montypedata[0].push(data[i].name)
            moneydata.push({
              id: data[i].id,
              name: data[i].name,
              flowname: data[i].flowname,
              sondata: []
            })
          }
        }
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < moneydata.length; j++) {
            if (data[i].pid == moneydata[j].id) {
              moneydata[j].sondata.push(data[i].name)
            }
          }
        }
        for (let i = 0; i < moneydata.length; i++) {
          if (moneydata[i].name == montypedata[0][0]) {
            montypedata[1] = moneydata[i].sondata
          }
        }
        //console.log(moneydata)
        //console.log(montypedata)
        that.setData({
          moneyAlldata: moneydata,
          multiArray: montypedata
        })
        // if (data.length != 0) {
        //     setTimeout(function () {
        //         // that.toggleDialog()
        //         for (let i = 0; i < data.length; i++) {
        //             let obj = {}
        //             obj.id = data[i].id
        //             obj.name = data[i].name
        //             obj.userName = data[i].userName
        //             list.push(obj)
        //         }
        //         that.setData({
        //             parkdata: list,
        //             projectuserId: list[0].id
        //         });
        //     }, 500)

        // } else {

        // }
      }
    });
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    //console.log(this.data.multiArray[1][this.data.multiIndex[1]])
    //console.log(this.data.multiIndex[0])
    if (this.data.moneyAlldata[this.data.multiIndex[0]].flowname == 'expenses_business') {
      wx.navigateTo({
        url: '../expenseAsk_add_sw/expenseAsk_add_sw?type=' + this.data.multiArray[1][this.data.multiIndex[1]] + "&id=" + this.data.getid,
      })
    } else if (this.data.moneyAlldata[this.data.multiIndex[0]].flowname == 'expenses_travel') {
      wx.navigateTo({
        url: '../expenseAsk_add_cl/expenseAsk_add_cl?type=' + this.data.multiArray[1][this.data.multiIndex[1]] + "&id=" + this.data.getid,
      })
    } else {
      wx.navigateTo({
        url: '../expenseAsk_add_cg/expenseAsk_add_cg?type=' + this.data.multiArray[1][this.data.multiIndex[1]] + "&id=" + this.data.getid,
      })
    }
  },
  bindMultiPickerColumnChange: function (e) {
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    // console.log(this.data.moneyAlldata)
    //console.log(this.data.moneyAlldata.length)
    data.multiArray[1] = this.data.moneyAlldata[data.multiIndex[0]].sondata;
    this.setData(data);
    //console.log(this.data.multiArray[0][data.multiIndex[0]],this.data.multiArray[1][data.multiIndex[1]])


  },
  //审批人确认
  sure: function () {
    let that = this
    var url = app.globalData.URL + '/expenses/expensesSubmitByRole';
    wx.request({
      url: url,
      method: 'POST',
      data: {
        userId: app.data.userMess.id,
        roleName: that.data.onlyUser,
        nextTaskUserId: that.data.spId,
        expensesId: that.data.getid
      },
      success: function (res) {
        wx.reLaunch({
          url: '../expenseAsk/expenseAsk',
        })
      }
    });
  },
  getnextRole: function (e) {
    let that = this
    var url = app.globalData.URL + '/expenses/nextRoleUserList';
    wx.request({
      url: url,
      method: 'POST',
      data: {
        expensesId: that.data.getid,
        orderNo: 1,
        roleName: that.data.onlyUser
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 0) {
          let data = res.data.data
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
            spId: parkdata[0].id
          })
          setTimeout(function () {
            that.toggleDialog()
            // that.setData({
            //   sureType: false
            // })
          }, 500)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
          // setTimeout(function () {
          //   that.setData({
          //     sureType: false
          //   })
          // }, 2000)
        }

      }
    });
  },
  //申请按钮
  sumbit: function (e) {
    //console.log(this.data.onlyUser)
    let that = this
    // that.setData({
    //   sureType: true
    // })
    if (this.data.showtypeId == 2) {
      if (this.data.payforname == '' || this.data.banknum == '' || this.data.payforbank == '') {
        wx.showToast({
          title: '请填写完整支付信息',
          icon: 'none',
          duration: 3000
        })
      } else {
        this.ischangeType()
        setTimeout(() => {
          that.getnextRole()
        }, 200);
      }
    } else {
      this.getnextRole()
    }

  },
  //仅当付款申请才调用
  ischangeType: function () {
    let that = this
    var url = app.globalData.URL + '/expenses/expensesPayAdd';
    wx.request({
      url: url,
      method: 'POST',
      data: {
        userId: app.data.userMess.id,
        userName: app.data.userMess.username,
        name: app.data.userMess.name,
        typeId: 2,
        expensesId: that.data.getid,
        bankUsername: that.data.payforname,
        bankName: that.data.payforbank,
        bankNo: that.data.banknum
      },
      success: function (res) {
        console.log(res.data)

      }
    });
  },
  projectchange: function (e) {
    this.setData({
      'projectdataId': e.detail.value
    });
    console.log(this.data.projectdata[this.data.projectdataId].name)
    this.projectsave(this.data.projectdata[this.data.projectdataId])
  },
  //银行选择
  bankchange: function (e) {
    this.setData({
      'bankId': e.detail.value,
    });
    console.log(this.data.bankdata[this.data.bankId])
    this.setData({
      bankshow: {
        user: this.data.bankdata[e.detail.value].user,
        banknum: this.data.bankdata[e.detail.value].banknum,
        bankname: this.data.bankdata[e.detail.value].bankname
      }
    })
    this.paychange(this.data.bankdata[e.detail.value].id)
  },
  //修改银行卡绑定费用Id
  paychange: function (id) {
    let that = this
    var url = app.globalData.URL + '/expenses/expensesUpdatePayId';
    wx.request({
      url: url,
      method: 'POST',
      data: {
        id: that.data.getid,
        payId: id
      },
      success: function (res) {
        console.log(res.data)
      }
    });
  },
  addexpense: function (e) {
    console.log('点击新增费用')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.setNavigationBarTitle({
    //   title: options.title,
    // })
    this.getexpensesType()
    this.getproject()
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight * 0.5
        });
      }
    });

    // console.log(JSON.parse(decodeURIComponent(options.data)))
    let showdata = JSON.parse(decodeURIComponent(options.data))
    let getuserdata = app.data.userMess.role_name.split(",")
    if (showdata.projectId != null) {
      this.setData({
        isconnect: true,
        isprojectshow: true
      })
      setTimeout(() => {
        for (let i = 0; i < that.data.projectdata.length; i++) {
          if (that.data.projectdata[i].id == showdata.projectId) {
            that.setData({
              projectdataId: i
            })
            that.projectsave(that.data.projectdata[i])
          }
        }
      }, 100);
    } else {
      this.setData({
        isconnect: false,
        isprojectshow: false
      })
    }
    for (let i = 0; i < getuserdata.length; i++) {
      if (getuserdata[i] == '大区经理') {
        getuserdata.splice(i, 1)
      }
    }
    this.setData({
      getid: showdata.id,
      onlyUserData: getuserdata,
      onlyUser: getuserdata[0]
    })

  },
  //项目保存
  projectsave: function (show) {
    let that = this
    var url = app.globalData.URL + '/expenses/expensesUpdateById';
    wx.request({
      url: url,
      method: 'POST',
      data: {
        id: that.data.getid,
        projectId: show.id,
        projectName: show.name,
        projectAddress: show.address
      },
      success: function (res) {
        console.log(res.data)
      }
    });
  },
  //项目列表
  getproject: function () {
    let that = this
    that.setData({
      projectdata: []
    })
    var url = app.globalData.URL + '/expenses/oaProjectList';
    wx.request({
      url: url,
      method: 'POST',
      data: {},
      success: function (res) {
        let projectdata = that.data.projectdata
        let data = res.data.data
        // console.log(data)
        for (let i = 0; i < data.length; i++) {
          projectdata.push({
            id: data[i].id,
            name: data[i].name,
            address: data[i].address
          })
        }
        that.setData({
          projectdata: projectdata
        })
      }
    });
  },
  //费用详情
  getdata: function (id) {
    let that = this
    var url = app.globalData.URL + '/expenses/expensesGetById';
    wx.request({
      url: url,
      method: 'POST',
      data: {
        id: id,
        userId: app.data.userMess.id
      },
      success: function (res) {
        let data = res.data.data
        let moneyData = that.data.moneyData
        let bankshow = that.data.bankshow
        let bankdata = that.data.bankdata
        console.log(data)
        if (res.data.code == 0) {
          if (data.expensesPurchaseList != null) {
            //采购请款
            for (let i = 0; i < data.expensesPurchaseList.length; i++) {
              moneyData.push({
                id: data.expensesPurchaseList[i].id,
                type: '采购请款',
                name: data.expensesPurchaseList[i].type,
                num: app.moneychange(data.expensesPurchaseList[i].amount)
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
                num: app.moneychange(data.expensesBusinessesList[i].amount)
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
                num: app.moneychange(data.expensesTravelList[i].amount)
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
          if (data.expensesPayList13 != null) {
            for (let i = 0; i < data.expensesPayList13.length; i++) {
              if (data.expenses.payId == data.expensesPayList13[i].id) {
                bankshow = {
                  user: data.expensesPayList13[i].bankUsername,
                  banknum: data.expensesPayList13[i].bankNo,
                  bankname: data.expensesPayList13[i].bankName
                }
              }
              if (data.expenses.expensesPay.typeId == data.expensesPayList13[i].typeId) {
                that.setData({
                  bankId: i
                })
              }
              bankdata.push({
                id: data.expensesPayList13[i].id,
                name: data.expensesPayList13[i].typeId == 1 ? '工资卡' : '其他银行卡',
                user: data.expensesPayList13[i].bankUsername,
                banknum: data.expensesPayList13[i].bankNo,
                bankname: data.expensesPayList13[i].bankName
              })
            }
          }
          that.setData({
            username: data.expenses.expensesPay != null ? data.expenses.expensesPay.name : '',
            usernum: data.expenses.expensesPay != null ? data.expenses.expensesPay.userId : '',
            showtypeId: data.expenses.typeId,
            fkstyle: data.expenses.typeName,
            showstyle: data.expenses.typeId,
            park: data.expenses.deptName,
            date: app.formatDate(data.expenses.applyTime),
            isGL: data.projectId != null ? '已关联' : '未关联',
            projectName: data.expenses.projectName,
            address: data.expenses.projectAddress,
            moneyData: moneyData,
            bankshow: bankshow,
            bankdata: bankdata,
            bankchoose: data.expenses.typeId == 1 ? '工资卡' : '其他银行卡',
            moneyTotal: app.moneychange(data.totalAmount)
          })

        }
      }
    });
  },
  switchChange: function (e) {
    //console.log(e.detail.value)
    this.setData({
      isconnect: e.detail.value,
      isprojectshow: e.detail.value
    })
    console.log(this.data.isconnect)
    if (this.data.isconnect) {
      this.projectsave(this.data.projectdata[0])
    } else {
      let showdata = {
        id: '',
        name: '',
        address: ''
      }
      this.projectsave(showdata)
    }

  },
  //银行卡信息识别
  bindlinechange: function (e) {
    //console.log(e.detail.value)
    //console.log(e.detail.value.match(/名称(.+)/))
    //  let payforname = ''
    //  let payforbank = ''
    //  let banknum = ''
    //  if (e.detail.value.match(/名称(.+)开户行/)!=null) {
    //   payforname = e.detail.value.match(/名称(.+)开户行/)[1].replace(/[&\|\\\*^%:：,， $#@\-]/g,"")
    //  }
    this.setData({
      payforname: e.detail.value.match(/名称(.+)开户行/) != null ? e.detail.value.match(/名称(.+)开户行/)[1].replace(/[&\|\\\*^%:：,， $#@\-]/g, "") : '',
      payforbank: e.detail.value.match(/开户行(.+)银行卡号/) != null ? e.detail.value.match(/开户行(.+)银行卡号/)[1].replace(/[&\|\\\*^%:：,， $#@\-]/g, "") : '',
      banknum: e.detail.value.replace(/[^0-9]/ig, "")
    })
    // }

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
    console.log('回来了')

    this.setData({
      moneyData: [],
      parkdata: [],
      bankdata: []
    })
    this.getdata(this.data.getid)
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