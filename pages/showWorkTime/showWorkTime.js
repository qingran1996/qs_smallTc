// miniprogram/pages/timeRecord/timeRecord.js
var app = getApp();
var weekDay = require('./../../util/weekday.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        flowRunAuditId: 0,
        projectId: 0,
        char_lt: "",
        char_gt: "",
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
        auditModuleHide: true,
        auditContent: '',
        auditState: 0,
        attachs: {},
        hrAudits: {},
        currentAuditHide:true,
        currentAuditInfo:{}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        var flowRunAuditId = options.flowRunAuditId;
        var projectId = options.projectId;
        if (projectId == null) {
            projectId = 0
        }
        _this.setData({
            'flowRunAuditId': flowRunAuditId,
            'projectId': projectId,
        });
        app.data.qs.get_audit_worktime({
            flow_run_audit_id: flowRunAuditId,
            success: function (res) {
                if (res.code == 200) {
                    weekDay.init(res.data['from_date']);
                    var weekShowList = app.data.qs.resovleWeekList(weekDay);
                    _this.setData({
                        'beginDateInt': weekDay.beginDate,
                        'beginDate': weekDay.formatMonth(weekDay.beginDate),
                        'endDate': weekDay.formatMonth(weekDay.endDate),
                        'dateList': weekDay.dateList,
                        'weekList': weekShowList
                    });
                    var workTypeList = res.data['work_types'][1];
                    var leaveTypeList = res.data['work_types'][2];
                    var workTimeList = res.data['work_times'];
                    var leaveTimeList = res.data['leave_times'];
                    var projectList = res.data['projects'];
                    var attachs = res.data['attachs'];
                    var hrAudits = res.data['hr_audits'];
                    _this.setData({
                        'workTypeList': workTypeList,
                        'leaveTypeList': leaveTypeList,
                        'workTimeList': workTimeList,
                        'leaveTimeList': leaveTimeList,
                        'projectList': projectList,
                        'attachs': attachs,
                        'hrAudits': hrAudits
                    });
                }
            }
        });
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
    pass: function () {
        var _this = this;
        _this.setData({
            auditModuleHide: false,
            auditState: 1,
        });
    },
    reject: function () {
        var _this = this;
        _this.setData({
            auditModuleHide: false,
            auditState: 2,
        });
    },
    //取消按钮
    cancel: function () {
        this.setData({
            auditModuleHide: true
        });
    },
    //确认
    confirm: function () {
        var _this = this;
        app.data.qs.audit({
            flow_run_audit_id: _this.data.flowRunAuditId,
            audit_state: _this.data.auditState,
            audit_content: _this.data.auditContent,
            success: function (res) {
                app.data.qs.showSuccessToast(res.msg);
                if (_this.data.projectId > 0) {
                    wx.navigateBack();
                } else {
                    wx.navigateBack();
                }

            },
            fail: function (res) {
                app.data.qs.showErrorToast(res.msg);
            }
        });
    },
    bindContentInput: function (e) {
        var _this = this;
        _this.setData({
            auditContent: e.detail.value
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
});