var app = getApp()
Page({
    data: {
        pmheight: 0 + 'px',
        id: 0,
        park: '工程部', //申请部门默认
        areashow: '',
        khremark: '利伯特', //客户名称
        projectremark: '愚蠢的地球人啊', //项目描述
        dzremark: '上海闵行区XXXXXXX', //项目地址
        htType: '人工合同', //合同类型默认
        protectType: '战略侵略地球', //项目类型默认
        hangye: '化工', //行业默认
        startTime: '2020-06-01',
        endTime: '2020-07-01',
        projectTime: '20周', //项目周期
        projectAllTime: '200', //项目总工时
        shstate: {state:2,statename:'待审核',url:''}, //审核状态
    },
    // 跳转详情页面
    jump_nav:function (event) {
        //console.log(this.data.id)
        wx.navigateTo({
          url: '../projectAsk_state/projectAsk_state?id='+this.data.id,
        })
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
     // console.log(options.data)
      //console.log(JSON.parse(decodeURIComponent(options.data)))
      let data = JSON.parse(decodeURIComponent(options.data))
        console.log(data)
        this.data.pmheight = wx.getSystemInfoSync().windowHeight-50 +"px"
        // console.log(this.data.pmheight)
        wx.setNavigationBarTitle({
          title: '项目详情',
        })
        this.setData({
          id: data.id,
          khremark: data.customerName, //客户名称
          projectremark: data.desc, //项目描述
          dzremark: data.address, //项目地址
          htType: data.isExpatriated==0?'总包项目合同':'人工时项目合同', //合同类型默认
          protectType: data.projectKind==1?'战略项目':'常规项目', //项目类型默认
          hangye: data.oaProjectType!=null?data.oaProjectType.name:'', //行业默认
          startTime: app.formatDate(data.startDate*1000),
          endTime: app.formatDate(data.endDate*1000),
          areashow: data.oaArea != null ? data.oaArea.areaName : '',
          projectTime: '20周', //项目周期
          projectAllTime: data.totalPersonHours, //项目总工时
          shstate: {state:data.state,statename:'待审核',url:''}, //审核状态
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