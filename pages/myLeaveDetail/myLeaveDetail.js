// miniprogram/pages/myLeaveDetail/myLeaveDetail.js
var app = getApp();
var weekDay = require('./../../util/weekday.js');
var md5 = require('../../util/md5.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        runId: 0,
        flowRun: null,
        flowRunData: null,
        projectList: null,
        hrAudit: null,
        masterAudit: null,
        hrAuditList: null,
        currentAuditHide: true,
        canRollback: false,
        rollbackModuleHide: true,
        pageHide: false,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var runId = options.runId;
        this.init2(runId);
        wx.showLoading({title: '加载中'});
    },
    init2: function (runId) {
        var _this = this;
        app.data.qs.get_leavetime({
            'flow_run_id': runId,
            success: function (res) {
                if (res.code == 200) {
                    var flowRun = res.data['flow_run_info'];
                    var flowRunData = res.data['flow_run_data'];
                    var projects = res.data['projects'];
                    var hrAudit = res.data['hr_audit'];
                    var masterAudit = res.data['master_audit'];
                    var canRollback = res.data['rights']['can_rollback'];
                    var userId = app.getLoginUserId();
                    _this.setData({
                        'flowRun': flowRun,
                        'flowRunData': flowRunData,
                        'projectList': projects,
                        'hrAudit': hrAudit,
                        'masterAudit': masterAudit,
                        'runId': runId,
                        'canRollback': canRollback,
                    });


                }
                wx.hideLoading();

            }
        });
        console.log(this.data)
    }
    ,
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
        app.data.qs.rollback_leavetime({
            'flow_run_id': _this.data.runId,
            success: function (res) {
                app.data.qs.showSuccessToast(res.msg);
                wx.redirectTo({
                    url: '../myLeaveDetail/myLeaveDetail?runId=' + _this.data.runId
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
    showAuditInfo: function (e) {
        var _this = this;
        var id = e.currentTarget.dataset.id;
        var type = e.currentTarget.dataset.type;
        if (type == 'project') {
            console.log(id);
            var projectList = _this.data.projectList;
            projectList.forEach(function (project) {
                if (project.id == id) {
                    _this.setData({currentAuditInfo: project.audits, currentAuditHide: false});
                }
            });
        } else if (type == 'master') {
            _this.setData({currentAuditInfo: _this.data.masterAudit, currentAuditHide: false});
        } else if (type == 'hr') {
            _this.setData({currentAuditInfo: _this.data.hrAudit, currentAuditHide: false});
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
            this.init2(this.data.runId);
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
    previewImage: function (e) {
        var current = e.target.dataset.src;
        console.log(e);
        var imgalist = [];
        imgalist.push(current);
        console.log(current);
        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: imgalist // 需要预览的图片http链接列表
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return app.data.shareMenu;
    }
});