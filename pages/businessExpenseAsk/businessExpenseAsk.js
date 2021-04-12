// miniprogram/pages/mine/mine.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       // console.log(app.data.qs)
        var _this = this;
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({
                    scrollHeight: res.windowHeight * 0.89
                });
            }
        });
        // console.log(app.data.userMess.role_name.split(","))
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