// miniprogram/pages/mine/mine.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    years: [],
    yearsindex: 0,
    yearsname: '',
    months: [],
    monthsindex: 0,
    monthsname: '',
    lowmoney: '', //最低金额
    highmoney: '', //最高金额
    currentIndex: 0,
    currentIndex1: 0,
    showdata: [],
    currentItem: null, //颜色置空
    inputShowed: false,
    inputVal: "",
    year: 0,
    month: '',
    num: null,
    time: 500,
    scrollTop: 0,
    scrollHeight: 0,
    moneyheight: 0,
    searchheight: 0,
    expenseGYS: [], //供应商
    expenseTypeData: [], //费用预支样式接口
    typeId: null,
    bankUserName: null,
    fatherTypeId: null
  },
  //获取供应商
  getbankUserList: function () {
    let that = this
    var url = app.globalData.URL + '/expenses/bankUserList';
    wx.request({
      url: url,
      method: 'POST',
      data: {
        name: that.data.inputVal
      },
      success: function (res) {
        let data = res.data.data
        console.log(data)
        let expenseGYS = []
        for (let i = 0; i < data.length; i++) {
          expenseGYS.push({
            id: i,
            data: data[i],
            name: data[i].bankUsername,
            bank: data[i].bankName,
            num: data[i].bankNo,
            isdone: false
          })
        }
        that.setData({
          expenseGYS: expenseGYS
        })
      }
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
        let expenseTypeData = []
        // console.log(data)
        for (let i = 0; i < data.length; i++) {
          if (data[i].pid == 0) {
            expenseTypeData.push({
              id: i,
              data: data[i],
              fatherTypeId: data[i].id,
              name: data[i].name,
              isdone: false
            })
          }
        }
        that.setData({
          expenseTypeData: expenseTypeData
        })
      }
    });
  },
  //点击选中费用预支
  tagshow1: function (e) {
    console.log(e.target.dataset.data)
    let expenseTypeData = this.data.expenseTypeData
    for (let i = 0; i < expenseTypeData.length; i++) {
      expenseTypeData[i].isdone = false
    }
    expenseTypeData[e.target.dataset.data.id].isdone = true
    this.setData({
      expenseTypeData: expenseTypeData,
      fatherTypeId: e.target.dataset.data.fatherTypeId
    })
  },
  //点击选中供应商
  tagshow: function (e) {
    // console.log(e)
    let expenseGYS = this.data.expenseGYS
    for (let i = 0; i < expenseGYS.length; i++) {
      expenseGYS[i].isdone = false
    }
    expenseGYS[e.currentTarget.dataset.data.id].isdone = true
    this.setData({
      expenseGYS: expenseGYS,
      bankUserName: e.currentTarget.dataset.data.name
    })
  },
  searchinputVal: function (e) {
    // console.log(e.detail.value)
    this.setData({
      inputVal: e.detail.value
    })
  },
  lowmoneyshow: function (e) {
    this.setData({
      lowmoney: e.detail.value
    })
  },
  highmoneyshow: function (e) {
    this.setData({
      highmoney: e.detail.value
    })
  },
  // 搜索
  searchnav: function () {
    console.log(this.data.inputVal)
    this.getbankUserList()
  },
  search: function (value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([{
          text: '搜索结果',
          value: 1
        }, {
          text: '搜索结果2',
          value: 2
        }])
      }, 200)
    })
  },
  selectResult: function (e) {
    console.log('select result', e.detail.item)
  },
  //用户点击tab时调用
  titleClick: function (e) {
    //let currentPageIndex =
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: e.currentTarget.dataset.idx
    })
  },
  //用户滑动切换tab调用
  swiperTab: function (e) {
    if (e.detail.source == 'touch') {
      this.setData({
        currentIndex: e.detail.current,
        typeId: e.detail.current == 0 ? 2 : 1
      });
    }
    if (currentIndex == 0) { //将费用预支重置
      let expenseTypeData = this.data.expenseTypeData
      for (let i = 0; i < expenseTypeData.length; i++) {
        expenseTypeData[i].isdone = false
      }
    }
  },
  // 年选择
  bindPickerChangeYear: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      yearsindex: e.detail.value,
      yearsname: this.data.years[e.detail.value]
    })

    

  },
  // 月选择
  bindPickerChangeMonth: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      monthsindex: e.detail.value,
      monthsname: this.data.months[e.detail.value]
    })
  },
  //返回带参数
  gotoindex: function () {
    let dataname = ''
    let showdata = []
    let isok = false
    console.log(this.data.yearsname,this.data.monthsname)
    if (this.data.yearsname != '' && this.data.monthsname != '') {
      dataname = this.data.yearsname + '年' + this.data.monthsname + '月'
      showdata = this.computeTime(this.data.yearsname, this.data.monthsname)
      isok = true
    } else if (this.data.yearsname != '' && this.data.monthsname == '') {
      wx.showToast({
        title: '请完善月份',
        icon: 'none',
        duration: 2000
      })
      isok = false
    } else if (this.data.yearsname == '' && this.data.monthsname != '') {
      wx.showToast({
        title: '请完善年份',
        icon: 'none',
        duration: 2000
      })
      isok = false
    } else {
      dataname = ''
      showdata = []
      isok = true
    }

    let isok1 = false
    if (this.data.lowmoney == '' && this.data.highmoney == '') {
      isok1 = true
    } else if (this.data.lowmoney != '' && this.data.highmoney != '') {
      isok1 = true
    } else {
      wx.showToast({
        title: '请完整填写金额区间或者不填',
        icon: 'none',
        duration: 2000
      })
      isok1 = false
    }
    if (isok&&isok1) {
      let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      let prevPage = pages[pages.length - 2];
      console.log(showdata, dataname)
      console.log(this.data.lowmoney, this.data.highmoney)
      //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
      prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
        startTime: showdata.length != 0 ? showdata[0] : null,
        endTime: showdata.length != 0 ? showdata[1] : null,
        setTitle: dataname,
        startTime1: showdata.length != 0 ? showdata[0] : null,
        endTime1: showdata.length != 0 ? showdata[1] : null,
        setTitle1: dataname,
        typeId: this.data.typeId,
        bankUserName: this.data.bankUserName,
        fatherTypeId: this.data.fatherTypeId,
        minAmount: this.data.lowmoney,
        maxAmount: this.data.highmoney,
        showtab: this.data.currentIndex1
      })

      wx.navigateBack({
        delta: 1 // 返回上一级页面。
      })
    }

  },
  //取消选择
  nochange: function (e) {
    // console.log(this.data.year + '年' + this.data.month)
    // this.gotoindex('', '', '')
    this.setData({
      yearsname: '',
      monthsname: '',
      typeId: null,
      bankUserName: null,
      fatherTypeId: null
    })
    this.gotoindex()
  },
  //转换时间戳
  computeTime: function (year, month) {
    return [
      new Date(year, month - 1, 1).getTime(),
      new Date(year, month, 1).getTime()
    ]
  },
  //确定
  sure: function (e) {
    // let dataname = this.data.yearsname + '年' + this.data.monthsname + '月'
    // let showdata = this.computeTime(this.data.yearsname, this.data.monthsname)
    // console.log(showdata, dataname)
    // console.log(this.data.lowmoney, this.data.highmoney)
    // if (this.data.month=='') {
    //   wx.showToast({
    //     title: '请选择月份',
    //     icon: 'none',
    //     duration: 1000
    //   })
    // } else {
    this.gotoindex()
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getexpensesType() //获取费用预支
    this.getbankUserList() //获取供应商
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight,
          moneyheight: res.windowHeight - 350,
          searchheight: res.windowHeight - 450
        });
      }
    });
    if (options.currentIndex != undefined) {
      this.setData({
        currentIndex1: options.currentIndex
      })
    }
    // this.setData({
    //   search: this.search.bind(this)
    // })
    const date = new Date()
    const years = []
    const months = []
    for (let i = 1990; i <= date.getFullYear(); i++) {
      years.push(i)
    }

    for (let i = 1; i <= 12; i++) {
      months.push(i)
    }
    this.setData({
      years: years,
      yearsindex: years.length - 1,
      months: months
    })
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