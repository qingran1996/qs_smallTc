// miniprogram/pages/clockList/clockList.js
var app = getApp();
var weekDay = require('./../../util/weekday.js');
var md5 = require('../../util/md5.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        char_lt: "<<",
        char_gt: ">>",
        beginDate: '',
        beginDateInt: 0,
        endDate: '',
        dateList: [],
        weekList: [],
        clockList: {},
        projectList: [],
        tagList: [],
        pageHide: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var beginDate = options.beginDate;
        this.toDate(beginDate);
        wx.showLoading({title: '加载中'});
    },
    toDate: function (beginDate) {
        var _this = this;
        weekDay.init(beginDate);
        var weekShowList = app.data.qs.resovleWeekList(weekDay);

        _this.setData({
            'beginDateInt': weekDay.beginDate,
            'beginDate': weekDay.formatMonth(weekDay.beginDate),
            'endDate': weekDay.formatMonth(weekDay.endDate),
            'dateList': weekDay.dateList,
            'weekList': weekShowList
        });
        var fromDate = parseInt(weekDay.beginDate / 1000);
        var toDate = parseInt(weekDay.endDate / 1000);
        app.data.qs.get_clock_list({
            'from_date': fromDate,
            'to_date': toDate,
            success: function (res) {
                if (res.code == 200) {
                    console.log(res.data);
                    var tagList = res.data['tags'];
                    var clockList = res.data['clocks'];
                    var projectList = res.data['projects'];

                    var userId = app.getLoginUserId();
                    _this.setData({
                        'clockList': clockList,
                        'tagList': tagList,
                        'projectList': projectList,
                    });


                }
                wx.hideLoading();

            }
        });
        console.log(this.data)
    }
    ,
    prev: function () {
        var _this = this;
        var beginDate = weekDay.beginDate;
        var _this = this;
        weekDay.init(beginDate);
        weekDay.prev();
        wx.redirectTo({
            url: '../clockList/clockList?beginDate=' + weekDay.beginDate
        });
    },
    next: function () {
        var _this = this;
        var beginDate = weekDay.beginDate;
        var _this = this;
        weekDay.init(beginDate);
        weekDay.next();
        wx.redirectTo({
            url: '../clockList/clockList?beginDate=' + weekDay.beginDate
        });
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (this.data.pageHide) {
            this.toDate(this.data.beginDateInt);
            this.setData({
                pageHide: false
            });
        }
        wx.showLoading({title: '加载中'});
    }
    ,

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.setData({
            pageHide: true
        });
    }
    ,

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    }
    ,

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    }
    ,

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    }
    ,

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return app.data.shareMenu;
    }
})