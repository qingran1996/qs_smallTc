var app = getApp()
Page({
    data: {
       showdata: [
         {zhiwei: '商务总监',name:'顾小林',state: 1,time: '2020年10月10日'},
         {zhiwei: '部门经理',name:'王文涛',state: 2,time: ''}
       ]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //console.log(this.data.showdata)
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