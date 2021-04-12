// miniprogram/pages/leave/leave.js
var app = getApp();
var dateTimePicker = require('../../util/dateTimePicker.js');
var md5Util = require('../../util/md5.js');


Page({

    /**
     * 页面的初始数据
     */
    data: {
        projectId: 0,
        attachUrl: '',
        attachID: 0,
        leaveType: 0,
        duration: 0,
        fromDate: null,
        fromDateInt: 0,
        toDate: null,
        toDateInt: 0,
        leaveTypeList: [],
        projectList: [],
        projectIndex: 0,
        dateTimeArray: [],
        dateTimeArray1: [],
        startYear: 2019,
        endYear: 2050,
        flowRunKey: '',
        reason: ''
    },
    //为了兼容IOS，需先将字符串转换为'2018/9/11 9:11:23'
    convertTimeStamp: function (toDate, dateTimeArray1) {
        var dateStr = dateTimeArray1[0][toDate[0]] + '/' + dateTimeArray1[1][toDate[1]] + '/' + dateTimeArray1[2][toDate[2]] + ' ' + dateTimeArray1[3][toDate[3]] + ':' + dateTimeArray1[4][toDate[4]] + ':' + '00';
        console.log(dateStr);
        var time = new Date(dateStr).getTime() / 1000;
        console.log(time);
        return time;
    },

    computeDuration: function (toDateInt, fromDateInt) {
        return this.computeHourLen(toDateInt, fromDateInt);
    },

    computeHourLen: function (toDateInt, fromDateInt) {
        console.log(toDateInt)
        console.log(fromDateInt)
        var hourLong = Math.ceil((toDateInt - fromDateInt) / 3600);
        var day = parseInt(hourLong / 24);
        var dayLeft = hourLong % 24;
        var left = 0;
        if (dayLeft > 0) {
            left = dayLeft > 8 ? 8 : dayLeft;
        }
        return day * 8 + left;
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        var startYear = new Date().getFullYear()-1;
        console.log(startYear);
        var endYear = startYear + 50;
        _this.setData({
            'startYear': startYear,
            'endYear': endYear
        });
        var obj1 = dateTimePicker.dateTimePicker(startYear, endYear);
        // 精确到分的处理，将数组的秒去掉
        var lastArray1 = obj1.dateTimeArray.pop();
        var lastTime1 = obj1.dateTime.pop();
        console.log('====================');

        console.log(obj1.dateTime);
        console.log('====================');
        var dateInt = _this.convertTimeStamp(obj1.dateTime, obj1.dateTimeArray);
        var userId = app.getLoginUserId();
        _this.setData({
            fromDate: obj1.dateTime,
            fromDateInt: dateInt,
            dateTimeArray: obj1.dateTimeArray,
            dateTimeArray1: obj1.dateTimeArray,
            toDate: obj1.dateTime,
            toDateInt: dateInt,
            duration: 0,
            flowRunKey: md5Util.hex_md5(userId + ":" + new Date().getTime())
        });

        app.data.qs.get_leave_type_list({
            success: function (res) {
                if (res.code == 200) {
                    _this.setData({
                        'leaveTypeList': res.data
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

    bindProjectChange: function (e) {
        this.setData({
            'projectIndex': e.detail.value
        });
    },
    bindDurationInput: function (e) {
        this.setData({
            'duration': e.detail.value
        });
    },
    bindReasonInput: function (e) {
        this.setData({
            'reason': e.detail.value
        });
    },
    bindLeaveTypeChange: function (e) {
        this.setData({
            'leaveType': e.detail.value
        });
    },

    changeFromDate: function (e) {
        var dateInt = this.convertTimeStamp(e.detail.value, this.data.dateTimeArray);
        this.setData({'fromDate': e.detail.value, fromDateInt: dateInt});
        this.changeDuration();
    },

    changeToDate: function (e) {
        var dateInt = this.convertTimeStamp(e.detail.value, this.data.dateTimeArray1);
        this.setData({toDate: e.detail.value, toDateInt: dateInt});
        this.changeDuration();
    },

    changeDuration: function () {
        var fromDateInt = this.data.fromDateInt;
        var toDateInt = this.data.toDateInt;
        var duration = this.computeDuration(toDateInt, fromDateInt);
        this.setData({duration: duration});
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
    chooseImage: function (e) {
        var _this = this;
        var projectId = _this.data.projectList[_this.data.projectIndex]['id'];
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: function (res) {
                app.data.qs.upload_worktime_attach({
                    fname: res.tempFilePaths[0]
                    , attach_key: _this.data.flowRunKey, project_id: projectId,
                    success: function (res) {
                        _this.data.attachUrl = res.data.url;
                        _this.data.attachID = res.data.attach_id;
                        _this.setData({
                            'attachUrl': res.data.url,
                            'attachID': res.data.attach_id,
                        })
                    }
                })
            }
        })
    },
    chooseVideo: function (e) {
        var _this = this;
        var projectId = _this.data.projectList[_this.data.projectIndex]['id'];
        wx.chooseVideo({
            compressed: true,
            maxDuration: 60,
            camera: 'back',  //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: function (res) {
                app.data.qs.upload_worktime_attach({
                    fname: res.tempFilePath
                    , attach_key: _this.data.flowRunKey, project_id: projectId,
                    success: function (res) {
                        _this.data.attachUrl = res.data.url;
                        _this.data.attachID = res.data.attach_id;
                        _this.setData({
                            'attachUrl': res.data.url,
                            'attachID': res.data.attach_id,
                        })
                    }
                })
            }
        })
    },
    previewVideo: function (e) {

    },
    formSubmit: function () {
        var _this = this;
        if (_this.data.projectList[_this.data.projectIndex] == null) {
            return app.data.qs.showErrorToast("请选择你项目");
        }
        app.data.qs.submit_leavetime({
            project_id: _this.data.projectList[_this.data.projectIndex]['id'],
            leave_type: _this.data.leaveTypeList[_this.data.leaveType]['id'],
            duration: _this.data.duration,
            from_date: _this.data.fromDateInt,
            to_date: _this.data.toDateInt,
            reason: _this.data.reason,
            flow_run_key: _this.data.flowRunKey,
            attach_id: _this.data.attachID,
            success: function (res) {
                app.data.qs.showSuccessToast(res.msg);
                wx.redirectTo({
                    url: '../myLeaveDetail/myLeaveDetail?runId=' + res.data.flow_run_id,
                });
            },
            fail: function (res) {
                app.data.qs.show_modal("提示", res.msg, false);
            }
        })


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

    changeDateTimeColumn: function (e) {
       // console.log(e)
        var arr = this.data.fromDate, dateArr = this.data.dateTimeArray;
        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
       // console.log(dateArr[2])
        this.setData({
            dateTimeArray: dateArr
        });
    },
    changeDateTimeColumn1: function (e) {
        var arr = this.data.toDate, dateArr = this.data.dateTimeArray1;
        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
        this.setData({
            dateTimeArray1: dateArr
        });
    }
});