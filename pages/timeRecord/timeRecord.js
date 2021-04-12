// miniprogram/pages/timeRecord/timeRecord.js
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
        workTimeList: {},
        projectList: [],
        workTypeList: [],
        leaveTypeList: [],
        leaveTimeList: {},
        flowRunInfo: {},
        rights: {},
        attachs: {},
        moduleHide: true,
        flowRunKey: "",
        currentAuditInfo: {},
        currentAuditHide: true,
        rollbackModuleHide: true,
        hrAudits: {},
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
        app.data.qs.get_worktime_list({
            'from_date': fromDate,
            'to_date': toDate,
            success: function (res) {
                if (res.code == 200) {
                    console.log(res.data);
                    var workTypeList = res.data['work_types'][1];
                    var leaveTypeList = res.data['work_types'][2];
                    var workTimeList = res.data['work_times'];
                    console.log("works_time");
                    console.log(workTimeList[1][0]);
                    var leaveTimeList = res.data['leave_times'];
                    var projectList = res.data['projects'];
                    var attachs = res.data['attachs'];
                    console.log(attachs)
                    var flowRunInfo = res.data['flow_run_info'];
                    var rights = res.data['rights'];
                    var userId = app.getLoginUserId();
                    var flowRunKey = res.data['runkey'];
                    var hrAudits = res.data['hr_audits'];
                    _this.setData({
                        'workTypeList': workTypeList,
                        'leaveTypeList': leaveTypeList,
                        'workTimeList': workTimeList,
                        'leaveTimeList': leaveTimeList,
                        'projectList': projectList,
                        'flowRunInfo': flowRunInfo,
                        'rights': rights,
                        'flowRunKey': flowRunKey,
                        'attachs': attachs,
                        'hrAudits': hrAudits
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
            url: '../timeRecord/timeRecord?beginDate=' + weekDay.beginDate
        });
    },
    next: function () {
        var _this = this;
        var beginDate = weekDay.beginDate;
        var _this = this;
        weekDay.init(beginDate);
        weekDay.next();
        wx.redirectTo({
            url: '../timeRecord/timeRecord?beginDate=' + weekDay.beginDate
        });
    },
    rollback: function () {
        var _this = this;
        _this.setData({rollbackModuleHide: false})
    },
    //取消按钮
    cancel_rollback: function () {
        this.setData({
            rollbackModuleHide: true
        });
    },
    //确认
    confirm_rollback: function () {
        var _this = this;
        this.setData({
            rollbackModuleHide: true
        });
        app.data.qs.rollback_worktimes({
            'flow_run_id': _this.data.flowRunInfo.flow_run_id,
            success: function (res) {
                app.data.qs.showSuccessToast(res.msg);
                wx.redirectTo({
                    url: '../timeRecord/timeRecord?beginDate=' + weekDay.beginDate
                });
            },
            fail: function (res) {
                app.data.qs.showErrorToast(res.msg);
            }
        });
    },
    submit: function () {
        var _this = this;
        _this.setData({moduleHide: false})
    },

    //取消按钮
    cancel: function () {
        this.setData({
            moduleHide: true
        });
    },
    //确认
    confirm: function () {
        var _this = this;
        this.setData({
            moduleHide: true
        });
        app.data.qs.submit_worktimes({
            'from_date': parseInt(weekDay.beginDate / 1000),
            'to_date': parseInt(weekDay.endDate / 1000),
            'attachs': _this.data.attachs,
            success: function (res) {
                app.data.qs.showSuccessToast(res.msg);
                wx.redirectTo({
                    url: '../timeRecord/timeRecord?beginDate=' + weekDay.beginDate
                });
            },
            fail: function (res) {
                app.data.qs.show_modal("提示", res.msg, false);
            }
        });
    },
    chooseImage: function (e) {
        var _this = this;
        var projectId = e.currentTarget.dataset.projectid;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: function (res) {
                app.data.qs.upload_worktime_attach({
                    fname: res.tempFilePaths[0]
                    , attach_key: _this.data.flowRunKey, project_id: projectId,
                    success: function (res) {
                        _this.data.attachs[projectId] = res.data.url
                        _this.setData({
                            'attachs': _this.data.attachs
                        })
                    }
                })
            }
        })
    },
    previewImage: function (e) {
        var current = e.target.dataset.src;
        console.log(e);
        var imgalist = [];
        imgalist.push(current);
        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: imgalist // 需要预览的图片http链接列表
        })
    },
    deleteWorkTime: function (e) {
        var _this = this;
        var index = e.currentTarget.dataset.weekindex;//获取当前长按图片下标
        var worktype = e.currentTarget.dataset.itemid;//获取当前长按图片下标
        var date = weekDay.dateList[index];
        if (!_this.data.rights.can_submit) {
            return app.data.qs.showErrorToast("已提交，无法删除");
        }
        if (_this.data.workTimeList[worktype][index]) {
            wx.showModal({
                title: '提示',
                content: '确定要删除此项工时设置？',
                success: function (res) {
                    if (res.confirm) {
                        app.data.qs.delete_worktimes({
                            'date': date,
                            'work_type': worktype,
                            success: function (res) {
                                app.data.qs.showSuccessToast(res.msg);
                                console.log(_this.data.workTimeList[worktype][index])

                                _this.data.workTimeList[worktype][index] = "";
                                _this.setData({workTimeList: _this.data.workTimeList})
                            },
                            fail: function () {
                                app.data.qs.showErrorToast(res.msg);
                            }
                        });
                        console.log('点击确定了');
                    } else if (res.cancel) {
                        console.log('点击取消了');
                        return false;
                    }
                }
            })
        }

    },
    deleteLeaveTime: function (e) {
        var _this = this;
        var index = e.currentTarget.dataset.weekindex;//获取当前长按图片下标
        var worktype = e.currentTarget.dataset.itemid;//获取当前长按图片下标
        var date = weekDay.dateList[index];
        console.log(e.currentTarget.dataset);
        if (!_this.data.rights.can_submit) {
            return app.data.qs.showErrorToast("已提交，无法删除");
        }
        if (_this.data.leaveTimeList[worktype][index]) {
            wx.showModal({
                title: '提示',
                content: '确定要删除此项请假设置？',
                success: function (res) {
                    if (res.confirm) {
                        app.data.qs.delete_worktimes({
                            'date': date,
                            'work_type': worktype,
                            success: function (res) {
                                app.data.qs.showSuccessToast(res.msg);
                                _this.data.leaveTimeList[worktype][index] = "";
                                _this.setData({leaveTimeList: _this.data.leaveTimeList})

                            },
                            fail: function () {
                                app.data.qs.showErrorToast(res.msg);
                            }
                        })
                        console.log('点击确定了');
                    } else if (res.cancel) {
                        console.log('点击取消了');
                        return false;
                    }
                }
            })
        }

    },

    showAuditInfo: function (e) {
        var _this = this;
        var projectId = e.currentTarget.dataset.projectid;
        if (projectId > 0) {
            var projectList = _this.data.projectList;
            projectList.forEach(function (project) {
                if (project.id == projectId) {
                    _this.setData({currentAuditInfo: project.audits, currentAuditHide: false});
                }
            })
        } else {
            _this.setData({currentAuditInfo: _this.data.hrAudits, currentAuditHide: false});
        }
    },
    closeAuditInfo: function () {
        var _this = this;
        _this.setData({currentAuditHide: true});
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