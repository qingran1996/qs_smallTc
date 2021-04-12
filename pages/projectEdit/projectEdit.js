// miniprogram/pages/projectEdit/projectEdit.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        'id': 0, //项目名称
        'name': '', //项目名称
        'type_id':0,//排序号
        'desc': '', //描述
        'start_date': '', //开始日期
        'is_expatriated': 0,//是否是外派
        'is_expatriated_show': "",//是否是外派
        'projectManagerList': [],
        'projectTypeList': [],
        'projectManagerId': 0,
    },
    bindNameInput: function (e) {
        this.setData({
            name: e.detail.value
        });
    },
    bindTypeIdChange: function (e) {
        this.setData({
            type_id: e.detail.value
        });
    },
    bindDescInput: function (e) {
        this.setData({
            desc: e.detail.value
        });
    },
    bindStartDateChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
            start_date: e.detail.value
        });
    },
    checkExpatriated: function (e) {
        console.log('checkExpatriated，携带值为', e.detail.value);
        this.setData({
            is_expatriated: e.detail.value ? 1 : 0
        });
    },
    bindManagerChange: function (e) {
        console.log('bindManagerChange，携带值为', e.detail.value);
        this.setData({
            projectManagerId: e.detail.value
        });
    },
    formSubmit: function () {
        var _this = this;
        if (_this.data.projectManagerList.length == 0) {
            return app.showErrorToast("库里未设置项目经理");
        }
        var userId = _this.data.projectManagerList[_this.data.projectManagerId].id;
        var typeId = _this.data.projectTypeList[_this.data.type_id].id;
        app.data.qs.update_project({
            id: _this.data.id,
            name: _this.data.name,
            type_id: typeId,
            desc: _this.data.desc,
            start_date: _this.data.start_date,
            is_expatriated: _this.data.is_expatriated,
            project_manager_user_id: userId,
            success: function (res) {
                wx.navigateBack({delta: 1});
            },
            fail: function (res) {
                console.log(res);
            }
        })
    },
    delete: function () {
        var _this = this;
        wx.showModal({
            title: '提示',
            content: '确定要删除此项目？',
            success: function (res) {
                console.log('点击确定了');
                if (res.confirm) {
                    app.data.qs.delete_project({
                        id: _this.data.id,
                        success: function (res) {
                            wx.navigateBack({delta: 2});
                        },
                        fail: function (res) {
                            console.log(res);
                        }
                    })

                } else if (res.cancel) {
                    console.log('点击取消了');
                    return false;
                }
            }
        })


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        //参数为空，则返回项目列表
        if (options.projectId == undefined) {
            wx.redirectTo({
                url: '../index/index',
            });
        }
        _this.setData({
            id: options.projectId
        });
        app.data.qs.get_project_detail_with_manager({
            'project_id': options.projectId,
            success: function (res) {
                if (res.data.project.id == undefined) {
                    wx.redirectTo({
                        url: '../index/index'
                    });
                }
                var projectManagerId = 0;
                var typeId = 0;
                app.data.qs.get_project_aggregate_list({
                    success: function (res1) {
                        for (var i = 0; i < res1.data.managers.length; i++) {
                            if (res1.data.managers[i].id == res.data.project.manager.id) {
                                projectManagerId = i;
                                break;
                            }
                        }
                        for (var i = 0; i < res1.data.project_types.length; i++) {
                            if (res1.data.project_types[i].id == res.data.project.project_type.id) {
                                typeId = i;
                                break;
                            }
                        }
                        _this.setData({
                            'projectManagerList': res1.data.managers,
                            'projectTypeList': res1.data.project_types,
                            'projectManagerId': projectManagerId,
                            'type_id': typeId
                        });
                    }
                });
                _this.setData({
                    'name': res.data.project.name,
                    'desc': res.data.project.desc,
                    'start_date': res.data.project.start_date_show,
                    'end_date': res.data.project.end_date_show,
                    'is_expatriated': res.data.project.is_expatriated,
                    'is_expatriated_show': res.data.project.is_expatriated == 1 ? "checked" : ""
                })

            }
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return app.data.shareMenu;
    }
})