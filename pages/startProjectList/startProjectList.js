// miniprogram/pages/startProjectList/startProjectList.js
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
    },
    showDetail: function (e) {

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        _this.initHeight();
        _this.loadData(1);
    },
    initHeight: function () {
        var _this = this;
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({
                    scrollHeight: res.windowHeight
                });
                var query = wx.createSelectorQuery();
                query.select('.weui-cells').boundingClientRect(function (rect) {
                    // console.log(rect.width)
                    console.log(rect)
                    var max = parseInt(res.windowHeight / rect.height) + 2;
                    if (max < 12) {
                        max = 12;
                    }
                    _this.setData({
                        max: max
                    })
                }).exec();
            }
        });
    },
    loadData: function (page, successFn) {
        var _this = this;
        app.data.qs.start_project_list({
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
                if (successFn) {
                    successFn(res);
                }
            }
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
        var _this = this;
        if (_this.data.pageHide) {
            _this.loadData(1);
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.setData({'pageHide': true})
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
        _this.loadData(1, function () {
            //隐藏导航框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        wx.showLoading({
            title: '玩命加载中',
        });
        var _this = this;
        _this.loadData(_this.data.page + 1, function (res) {

            wx.hideLoading();
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return app.data.shareMenu;
    }
})