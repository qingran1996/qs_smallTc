// miniprogram/pages/masterProjectList/masterProjectList.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        'list': [],
        'max': 10,
        'page': 1
    },
    showDetail: function (e) {

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        app.data.qs.master_project_list({
            success: function (res) {
                _this.setData({list: res.data.list})
            }
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
        wx.showNavigationBarLoading();
        var _this = this;
        app.data.qs.master_project_list({
            'page': 1,
            success: function (res) {
                _this.setData({list: res.data.list});
                //隐藏导航框
                wx.hideNavigationBarLoading();
                // 停止下拉动作
                wx.stopPullDownRefresh();
            }
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        wx.showLoading({
            title: '玩命加载中',
        });
        var _this = this;
        _this.data.page = _this.data.page + 1;
        app.data.qs.master_project_list({
            'page': _this.data.page,
            success: function (res) {
                if (res.data.list.length > 1) {
                    _this.setData({list: res.data.list});
                }
                // 回调函数
                var moment_list = _this.data.list;

                for (var i = 0; i < res.data.list.length; i++) {
                    moment_list.push(res.data.list[i]);
                }
                // 设置数据
                _this.setData({
                    list: moment_list
                });
                // 隐藏加载框
                wx.hideLoading();
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return app.data.shareMenu;
    }
})