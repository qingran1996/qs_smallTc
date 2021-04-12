// miniprogram/pages/timeRecordAdd/timeRecordAdd.js
var app = getApp();
var weekDay = require('./../../util/weekday.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        projectId: 0,
        workType: 0,
        leaveType: 0,
        duration: 15,
        beginDate: '',
        endDate: '',
        beginDateInt: 0,
        dateList: [],
        weekList: [],
        weekIdList: [],
        weekShowList: [],
        workTypeList: [],
        leaveTypeList: [],
        projectList: [],
        // durationList: [1, 2, 3, 4, 5, 6, 7, 8],
        durationList: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19,19.5,20,20.5,21,21.5,22,22.5,23,23.5,24],
        workHidden: false,
        leaveHidden: true,
        is_work_set: true,
        is_work_set_name: '工时设置',

    },
    checkIsWorkSet: function (e) {
        if (e.detail.value) {
            this.setData({
                'workHidden': false,
                'leaveHidden': true,
                'is_work_set_name': '工时设置',
                'is_work_set': e.detail.value,
            })
        } else {
            this.setData({
                'workHidden': true,
                'leaveHidden': false,
                'is_work_set_name': '请假设置',
                'is_work_set': e.detail.value,
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var beginDate = options.beginDate;
        if (beginDate == null) {
            wx.navigateBack();
        }
        var _this = this;
        weekDay.init(beginDate);
        console.log(weekDay);
        var weekShowList = app.data.qs.resovleWeekList2(weekDay);
        _this.setData({
            'beginDateInt': beginDate,
            'beginDate': weekDay.formatMonth(weekDay.beginDate),
            'endDate': weekDay.formatMonth(weekDay.endDate),
            'dateList': weekDay.dateList,
            'weekList': weekDay.weekList,
            'weekShowList': weekShowList
        });
        app.data.qs.get_work_type_list({
            success: function (res) {
                if (res.code == 200) {
                    console.log(res.data);
                    var workTypeList = res.data[1];
                    var leaveTypeList = res.data[2];
                    _this.setData({
                        'workTypeList': workTypeList,
                        'leaveTypeList': leaveTypeList,
                    });
                }
            }
        });
        app.data.qs.my_project_list_for_choose({
            success: function (res) {
                _this.setData({
                    'projectList': res.data.list,
                });

            }
        });
        console.log(this.data)
    }
    ,

    bindDurationChange: function (e) {
        this.setData({
            'duration': e.detail.value
        });
    },
    bindProjectChange: function (e) {
        this.setData({
            'projectId': e.detail.value
        });
    },
    bindWorkTypeChange: function (e) {
        this.setData({
            'workType': e.detail.value
        });
    },
    bindLeaveTypeChange: function (e) {
        this.setData({
            'leaveType': e.detail.value
        });
    },
    checkWeekChange: function (e) {
        this.setData({
            'weekIdList': e.detail.value
        });
    },

    formSubmit: function () {
        var _this = this;
        var weekIdList = _this.data.weekIdList;
        var dateList2 = [];
        console.log(_this.data.weekShowList);
        console.log(weekIdList);
        if (weekIdList.length == 0) {
            return app.data.qs.showErrorToast("请选择日期");
        }
        for (var i = 0; i < _this.data.dateList.length; i++) {
            var find1 = weekIdList.indexOf(i + "");
            if (find1 !== -1) {
                dateList2.push(_this.data.dateList[i])
            }
        }
        console.log(dateList2);
        if (_this.data.is_work_set) {
            if (_this.data.projectList[_this.data.projectId] == null) {
                return app.data.qs.showErrorToast("请选择你参与的项目");
            }
            app.data.qs.add_worktimes({
                project_id: _this.data.projectList[_this.data.projectId]['id'],
                work_type: _this.data.workTypeList[_this.data.workType]['id'],
                duration: _this.data.durationList[_this.data.duration],
                date_list: dateList2,
                success: function (res) {
                    app.data.qs.showSuccessToast(res.msg);
                    wx.navigateBack();
                    // wx.redirectTo({
                    //     url: '../timeRecord/timeRecord?beginDate=' + _this.data.beginDateInt,
                    // });
                },
                fail: function (res) {
                    app.data.qs.showErrorToast(res.msg);
                }
            })
        } else {
            if (_this.data.projectList[_this.data.projectId] == null) {
                return app.data.qs.showErrorToast("请选择你参与的项目");
            }
            app.data.qs.add_worktimes({
                project_id: _this.data.projectList[_this.data.projectId]['id'],
                work_type: _this.data.leaveTypeList[_this.data.leaveType]['id'],
                duration: _this.data.durationList[_this.data.duration],
                date_list: dateList2,
                success: function (res) {
                    app.data.qs.showSuccessToast(res.msg);
                    wx.navigateBack();
                    // wx.redirectTo({
                    //     url: '../timeRecord/timeRecord?beginDate=' + _this.data.beginDateInt,
                    // });
                },
                fail: function (res) {
                    app.data.qs.showErrorToast(res.msg);
                }
            })
        }

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
    }
})