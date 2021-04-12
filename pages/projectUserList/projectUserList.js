// miniprogram/pages/projectUserList/projectUserList.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        'projectId': 0,
        'list': [],
        'project': {},
        'max': 10,
        'page': 1,
        'rights': {}
    },
    showDetail: function (e) {

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        var projectId = options.projectId;
        this.setData({
            projectId: projectId
        });
        app.data.qs.get_project_usr_list({
            project_id: projectId,
            success: function (res) {
                _this.setData({list: res.data.list, rights: res.data.rights, project: res.data.project});
                wx.setNavigationBarTitle({
                    title: res.data.project['name']
                });
            }
        })
    },
    deleteProjectUser: function (e) {
        var _this = this;
        var project_id = e.currentTarget.dataset.project_id;//项目编号
        var user_id = e.currentTarget.dataset.user_id;//用户编号
        var role_id = e.currentTarget.dataset.role_id;//角色
        var name = e.currentTarget.dataset.name;//姓名
        if (_this.data.rights.can_delete && role_id == 1) {
            wx.showModal({
                title: '提示',
                content: '确定要删除' + name + '？',
                success: function (res) {
                    if (res.confirm) {
                        app.data.qs.delete_project_user({
                            'project_id': project_id,
                            'user_id': user_id,
                            success: function (res) {
                                app.data.qs.showSuccessToast(res.msg);
                                wx.redirectTo({
                                    url: '../projectUserList/projectUserList?projectId=' + project_id
                                });
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var _this = this;
        app.data.qs.get_project_usr_list({
            project_id: _this.data.projectId,
            success: function (res) {
                _this.setData({
                    list: res.data.list, rights: res.data.rights, project: res.data.project
                })
                ;
                wx.setNavigationBarTitle({
                    title: res.data.project['name']
                })
            }
        })
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
        wx.showNavigationBarLoading();
        var _this = this;
        app.data.qs.get_project_usr_list({
            project_id: _this.data.projectId,
            success: function (res) {
                _this.setData({list: res.data.list});
                //隐藏导航框
                wx.hideNavigationBarLoading();
                // 停止下拉动作
                wx.stopPullDownRefresh();
            }
        })
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