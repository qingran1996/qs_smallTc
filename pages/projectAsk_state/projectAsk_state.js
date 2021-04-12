var app = getApp()
Page({
    data: {
        projectTime: '事情办得不错', //项目评价
        list:[],
        pjData: [
            {zhiwei: '商务总监',name: '顾小林',state: 1,remark:'干的不错',time: '2020年10月10日'},
            {zhiwei: '商务总监',name: '王文涛',state: 2,remark:'等待审核',time: '2020年10月10日'},
            {zhiwei: '商务总监',name: '丁宏翔',state: 2,remark:'等待审核',time: '2020年10月10日'}
        ]
    },
     // 项目评价
     projectTimechange: function (e) {
         console.log(e.detail.value)
        // this.setData({
        //     projectTime: e.detail.value
        // });
        // console.log(this.data.projectTime)
    },
    getdata: function (id) {
        let that = this
        var url = app.globalData.URL + '/project/getProjectState';
        wx.request({
            url: url,
            method: 'POST',
            data: {
                projectId: id
            },
            success: function (res) {
              //console.info(that.data.list);
              var list = that.data.list;
              let data = res.data.data
              console.log(data)
              if (data.length != 0) {
                setTimeout(function () {
                  for(let i=0;i<data.length;i++) {
                      let obj = {}
                      obj.name = data[i].userName
                      if (data[i].status=='通过') {
                        obj.state=1
                        obj.statename = '通过'
                      } else if(data[i].status=='未通过') {
                        obj.state=2
                        obj.statename = '未通过'
                      } else {
                        obj.state=3
                        obj.statename = '待审核'
                      }
                      // obj.state = data[i].status=='通过'?1:2
                      // obj.statename = data[i].status=='通过'?'通过':'待审核'
                      obj.zhiwei = data[i].roleName
                      obj.remark = data[i].comment
                      obj.time = data[i].endTime!=null?app.formatDate(data[i].endTime):''
                      list.push(obj)
                  }
                  that.setData({
                    list: list
                  });
                },1000)
                
              } else {
                
              }
      
      
            }
          });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       // console.log(options.id)
        this.getdata(options.id)
        this.data.pmheight = wx.getSystemInfoSync().windowHeight-50 +"px"
        // console.log(this.data.pmheight)
        wx.setNavigationBarTitle({
            title: '审核状态',
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