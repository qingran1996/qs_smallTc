// miniprogram/pages/projectUserAdd/projectUserAdd.js
var app = getApp();
var weekDay = require('./../../util/weekday.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        projectId: 0,
        searchName: '',
        userId: 0,
        userList: [],
        confirmModuleHide: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var projectId = options.projectId;
        this.setData({
            projectId: projectId
        });
    }
    ,
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    }
    ,
    bindSearchChange: function (e) {
        var _this = this;
        console.log(e);
        var name = e.detail.value;
        if (name == "") {
            return;
        } else {
            app.data.qs.search_user({
                name: name,
                success: function (res) {
                    _this.setData({'userList': res.data})
                }
            })
        }
    },
    clickUser: function (e) {
        var current = e.currentTarget.dataset.id;
        console.log(e);
        this.setData({
            userId: current,
            confirmModuleHide: false
        });

    },
    confirm: function () {
        var _this = this;
        app.data.qs.add_project_user({
            user_id: _this.data.userId,
            project_id: _this.data.projectId,
            success: function (res) {
                app.data.qs.showSuccessToast(res.msg);
                _this.setData({
                    userId: 0,
                    confirmModuleHide: true
                });
            },
            fail: function (res) {
                app.data.qs.showErrorToast(res.msg);
                _this.setData({
                    userId: 0,
                    confirmModuleHide: true
                });
            }
        })
    },
    cancel: function () {
        this.setData({
            userId: 0,
            confirmModuleHide: true
        });
    },

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