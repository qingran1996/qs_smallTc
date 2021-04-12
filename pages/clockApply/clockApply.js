// miniprogram/pages/clockApply/clockApply.js
var md5Util = require('../../util/md5.js');
var changeTime = require('../../util/changeTime.js');
var dateTimePicker = require('../../util/dateTimePicker.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0, //项目名称
        address: '', //地址
        tagIndex: 0,//上班
        tagName: '',//上班
        tagList: [],//标签列表
        projectIndex: 0,
        projectList: [],//项目列表
        remark: '',//备注
        clockTimeInt: 0,//打卡时间
        clockTime: null,//打卡时间
        dateTimeArray: [],
        startYear: 2019,
        endYear: 2050,
        flowRunKey: ''
    },
    bindRemarkInput: function (e) {
        this.setData({
            remark: e.detail.value
        });
    },

    bindProjectChange: function (e) {
        this.setData({
            'projectIndex': e.detail.value
        });
    },

    bindTagChange: function (e) {
        console.log('checkExpatriated，携带值为', e.detail.value);
        this.setData({
            tagIndex: e.detail.value
        });
    },

    formSubmit: function () {
        var _this = this;
        if (_this.data.tagList[_this.data.tagIndex] == null) {
            return app.data.qs.showErrorToast("请选择打卡标签");
        }
        if (_this.data.projectList[_this.data.projectIndex] == null) {
            return app.data.qs.showErrorToast("请选择项目");
        }
        if (_this.data.remark == '') {
            return app.data.qs.showErrorToast("备注不能为空");
        }
        var tagId = _this.data.tagList[_this.data.tagIndex]['id'];
        var projectId = _this.data.projectList[_this.data.projectIndex]['id'];
        app.data.qs.submit_apply_clock({
            clockTime: parseInt(_this.data.clockTimeInt),
            tagId: tagId,
            projectId: projectId,
            remark: _this.data.remark,
            success: function (res) {
                console.log(res);
                app.data.qs.showSuccessToast(res.msg);
                wx.redirectTo({
                    url: '../clockApplyDetail/clockApplyDetail?clockId=' + res.data.id,
                });

            },
            fail: function (res) {
                app.data.qs.show_modal("提示", res.msg, false);
                if (res.code == 601) {
                    wx.redirectTo({
                        url: '../clockApplyDetail/clockApplyDetail?clockId=' + res.data.id,
                    });
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;


        var startYear = new Date().getFullYear();
        console.log(startYear);
        var endYear = startYear + 50;
        _this.setData({
            'startYear': startYear,
            'endYear': endYear
        });
        var obj1 = dateTimePicker.dateTimePicker(startYear, endYear);
        // 精确到分的处理，将数组的秒去掉
        var lastArray1 = obj1.dateTimeArray.pop();
        console.log('====================');


        console.log('====================');
        var lastTime1 = obj1.dateTime.pop();
        var dateInt = _this.convertTimeStamp(obj1.dateTime, obj1.dateTimeArray);
        var userId = app.getLoginUserId();
        console.log(obj1.dateTime);
        console.log(obj1.dateTimeArray);
        var tagId = options.tagId;
        var date = (options.date - 0) || 0;
        var tagIndex = 0;
        var clockTime = obj1.dateTime;
        if (date > 0) {
            if (tagId == 2) {
                tagIndex = 1;
                dateInt = date + 17 * 3600000;
            } else {
                dateInt = date + 8 * 3600000;
            }
            var dateTime2 = dateTimePicker.getNewDateArray2(dateInt, obj1.dateTimeArray);
            dateInt = parseInt(dateInt / 1000);
            console.log("=========================")
            console.log(dateInt)
            console.log(dateTime2)
            clockTime = dateTime2;

        }
        _this.setData({
            tagIndex: tagIndex,
            clockTime: clockTime,
            clockTimeInt: dateInt,
            dateTimeArray: obj1.dateTimeArray,
            flowRunKey: md5Util.hex_md5(userId + ":" + new Date().getTime())
        });


        app.data.qs.get_all_clock_tags({
            success: function (res) {
                _this.setData({
                    'tagList': res.data,
                    'tagName': res.data[tagIndex]['name'],
                })

            }, fail: function (res) {
                if (res.code == 601) {
                    wx.showLoading({
                        title: res.msg,
                    });
                    setTimeout(function () {
                        wx.redirectTo({
                            url: '../clockApplyDetail/clockApplyDetail?clockId=' + res.data.id,
                        });
                    }, 3000);
                }
            }
        });
        app.data.qs.my_project_list_for_choose({
            success: function (res) {
                _this.setData({
                    'projectList': res.data.list,
                })

            }
        });


    },

    changeClockTime: function (e) {
        var dateInt = this.convertTimeStamp(e.detail.value, this.data.dateTimeArray);
        this.setData({'clockTime': e.detail.value, 'clockTimeInt': dateInt});
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

    }
    ,

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

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
    },

    convertTimeStamp: function (toDate, dateTimeArray1) {
        var dateStr = dateTimeArray1[0][toDate[0]] + '/' + dateTimeArray1[1][toDate[1]] + '/' + dateTimeArray1[2][toDate[2]] + ' ' + dateTimeArray1[3][toDate[3]] + ':' + dateTimeArray1[4][toDate[4]] + ':' + '00';
        console.log(dateStr);
        var time = new Date(dateStr).getTime() / 1000;
        console.log(time);
        return time;
    },
    changeDateTimeColumn: function (e) {
        var arr = this.data.clockTime, dateArr = this.data.dateTimeArray;
        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
        this.setData({
            dateTimeArray: dateArr
        });
    }
});