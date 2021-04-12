var app = getApp()
Page({
  data: {
    getid: null,
    isHaveInvoice: null,
    scrollHeight: 0,
    moneyData: [], //保存的费用单
    fkstyle: '费用报销',
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
    moneyTotal: 0,
    state: 1,
    statename: '待审核'
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

          if (data.expensesPayList!=null) {
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
            username: data.expenses.expensesPay !=null?data.expenses.expensesPay.name:'',
            usernum: data.expenses.expensesPay !=null?data.expenses.expensesPay.userId:'',
            getid: data.expenses.id,
            isHaveInvoice: data.expenses.isHaveInvoice,
            fkstyle: data.expenses.typeName,
            park: data.expenses.deptName,
            date: app.formatDate(data.expenses.applyTime),
            isGL: data.expenses.projectId != null ? '已关联' : '未关联',
            projectName: data.expenses.projectName,
            address: data.expenses.projectAddress,
            moneyData: moneyData,
            bankshow: {
              user: data.expenses.expensesPay!=null?data.expenses.expensesPay.bankUsername:'',
              banknum: data.expenses.expensesPay!=null?data.expenses.expensesPay.bankNo:'',
              bankname: data.expenses.expensesPay!=null?data.expenses.expensesPay.bankName:''
            },
            bankchoose: data.expenses.typeId == 1 ? '工资卡' : '银行卡',
            moneyTotal: app.moneychange(data.totalAmount),
            state: data.expenses.state,
            statename: statename
          })
        }


      }
    });
  },
  //跳转审核状态
  jump_state:function(event) {
    wx.navigateTo({
      url: '../expenseAsk_nav_state/expenseAsk_nav_state?id='+this.data.getid + '&isHaveInvoice=' + this.data.isHaveInvoice,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // console.log(JSON.parse(options.data))
    let data = JSON.parse(decodeURIComponent(options.data))
    if(data.typeId==2) {
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
    wx.setNavigationBarTitle({
      title: options.title,
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
    // this.setData({
    //   username: app.data.userMess.name,
    //   usernum: app.data.userMess.username
    // })
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