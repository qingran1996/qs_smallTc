var app = getApp()
Page({
    data: {
        projectname: '',
        projectnum: '',
        deptname: '',
        projectzt: '',
        projectmoney: '',
        moneyFP: [], //奖金分配
        time: '',
        processInstanceId: ''
    },
    // 跳转审核状态页面
    jump_nav: function (event) {
        //console.log(event.currentTarget.dataset.state)
        wx.navigateTo({
            url: '../moneyAsk_nav_state/moneyAsk_nav_state?processInstanceId='+event.currentTarget.dataset.state,
        })
    },
    //获取页面详情
    getdata: function (id) {
        let that = this
        var url = app.globalData.URL + '/oaprojectbonus/getOaProjectBonusDetailByOaProjectBonusId?bussinessId=' + id;
        wx.request({
            url: url,
            method: 'POST',
            success: function (res) {
                let data = res.data.data
                let moneyFP = that.data.moneyFP
                console.log(data)
                for (let i = 0; i < data.length; i++) {
                    if (data[i] != null) {
                        moneyFP.push({
                            id: i,
                            roleName: data[i].roleName,
                            positionName: data[i].positionName,
                            namedata: data[i].users
                        })
                    }
                }
                that.setData({
                    moneyFP: moneyFP
                })
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //console.log(JSON.parse(options.data))
        let data = JSON.parse(decodeURIComponent(options.data))
        console.log(data)
        this.getdata(parseInt(data.businessId))
        this.setData({
            processInstanceId: data.processInstanceId,
            projectname: data.oaProjectName,
            projectnum: data.oaProjectNo,
            deptname: data.deptName,
            projectpart: data.taskName,
            projectzt: data.status,
            projectmoney: data.fee,
            time: app.formatDate(data.applyTime)
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