// miniprogram/pages/clockTop/clockTop.js
var dateTimePicker = require('../../util/dateTimePicker.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        'list': [],
        'max': 10,
        'page': 1,
        'hasResult': false,

        'pageHide': false,
        'scrollHeight': 0,
        'clockDate': '',

    },
    showDetail: function (e) {

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        var currentDate = new Date();
        var clockDate = options.clockDate ? options.clockDate : currentDate.getFullYear() + "-" + (currentDate.getMonth()+1) + "-" + currentDate.getDate();
        _this.setData({
            clockDate: clockDate
        });
        _this.getTopList(clockDate, 1);
    },

    bindClockDateChange: function (e) {
        var _this = this;
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
            clockDate: e.detail.value
        });
        _this.getTopList(e.detail.value, 1)
    },


    getTopList: function (dateInt, page, success) {
        var _this = this;

        app.data.qs.get_clock_tops({
            clock_date: dateInt,
            max: _this.data.max,
            page: page,
            success: function (res) {
                var hasResult = ((page > 1) || (res.data.list.length > 0));
                if (page > 1) {
                    var moment_list = _this.data.list;
                    if (res.data.list.length == 0) {
                        app.data.qs.showSuccessToast("已加载完毕");
                    } else {
                        for (var i = 0; i < res.data.list.length; i++) {
                            moment_list.push(res.data.list[i]);
                        }
                    }
                } else {
                    moment_list = res.data.list;
                }
                _this.setData({list: moment_list, page: page, hasResult: hasResult});
                if (success) {
                    success(res);
                }

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
        var _this = this;
        //如果是待审列表
        if (_this.data.pageHide) {

            _this.getTopList(_this.data.clockDate, 1);

            _this.setData({'pageHide': false});
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.setData({
            pageHide: true
        })
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
        var _this = this;
        wx.showNavigationBarLoading();
        _this.getTopList(_this.data.clockDate, 1, function (res) {
            //隐藏导航框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
        });
    },
    onReachBottom: function () {
        console.log("reach bottom")
        this.lower();
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    lower: function () {
        var _this = this;
        wx.showLoading({
            title: '玩命加载中',
        });
        var page = 1;
        _this.getTopList(_this.data.clockDate, page, function (res) {
            wx.hideLoading();
        });

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return app.data.shareMenu;
    },

});