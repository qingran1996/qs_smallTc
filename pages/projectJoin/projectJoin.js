// miniprogram/pages/projectJoin/projectJoin.js

var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        'id': 0, //项目名称
        'name': '', //项目名称
        'no': '',//排序号
        'desc': '', //描述
        'start_date_show': '', //开始日期
        'end_date_show': '', //结束日期
        'is_expatriated_show': '',//是否是外派
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        //参数为空，则返回项目列表
        if (options.projectId == undefined) {
            wx.redirectTo({
                url: '../index/index',
            });
        }
        _this.setData({
            id: options.projectId
        });
        app.data.qs.get_project_detail({
            'project_id': options.projectId,
            success: function (res) {
                if (res.data.project.id == undefined) {
                    wx.redirectTo({
                        url: '../index/index'
                    });
                }
                _this.setData({
                    'name': res.data.project.name,
                    'no': res.data.project.no,
                    'desc': res.data.project.desc,
                    'start_date_show': res.data.project.start_date_show,
                    'end_date_show': res.data.project.end_date_show,
                    'is_expatriated_show': res.data.project.is_expatriated_show,
                })
            }
        })

    },
    join: function () {
        var userId = app.data.getLoginUserId();
        if (userId == false) {
            
        }
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