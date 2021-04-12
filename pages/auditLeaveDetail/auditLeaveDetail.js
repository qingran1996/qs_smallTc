// miniprogram/pages/auditLeaveDetail/auditLeaveDetail.js
var app = getApp();
var weekDay = require('./../../util/weekday.js');
var md5 = require('../../util/md5.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        flowRunAuditId: 0,
        flowRunData: null,
        projectList: null,
        hrAudit: null,
        masterAudit: null,
        hrAuditList: null,
        currentAuditHide: true,
        flowRun: null,
        rights: null,
        auditModuleHide: true,
        auditContent: '',
        auditState: null,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var flowRunAuditId = options.flowRunAuditId;
        this.init2(flowRunAuditId);
        wx.showLoading({title: '加载中'});
    },
    init2: function (flowRunAuditId) {
        var _this = this;
        app.data.qs.get_audit_leavetime({
            'flow_run_audit_id': flowRunAuditId,
            success: function (res) {
                if (res.code == 200) {
                    var flowRunData = res.data['flow_run_data'];
                    var projects = res.data['projects'];
                    var hrAudit = res.data['hr_audit'];
                    var masterAudit = res.data['master_audit'];
                    var flowRun = res.data['flow_run_info'];
                    var rights = res.data['rights'];
                    var userId = app.getLoginUserId();
                    _this.setData({
                        'flowRunData': flowRunData,
                        'projectList': projects,
                        'hrAudit': hrAudit,
                        'masterAudit': masterAudit,
                        'flowRunAuditId': flowRunAuditId,
                        'flowRun': flowRun,
                        'rights': rights,
                    });


                }
                wx.hideLoading();

            }
        });
        console.log(this.data)
    }
    ,
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
        wx.showLoading({title: '审核中'});
        app.data.qs.audit_leavetime({
            flow_run_audit_id: _this.data.flowRunAuditId,
            audit_state: _this.data.auditState,
            audit_content: _this.data.auditContent,
            success: function (res) {
                app.data.qs.showSuccessToast(res.msg);
                wx.navigateBack();
                wx.hideLoading();

            },
            fail: function (res) {
                app.data.qs.showErrorToast(res.msg);
                wx.hideLoading();
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return app.data.shareMenu;
    }
});