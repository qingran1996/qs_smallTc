// miniprogram/pages/projectStart/projectStart.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        'name': '', //项目名称
        'type_id': 0,//排序号
        'desc': '', //描述
        'start_date': '', //开始日期
        'is_expatriated': 0,//是否是外派
        'projectManagerList': [],
        'projectTypeList': [],
        'projectManagerId': 0
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
        app.data.qs.create_project({
            name: _this.data.name,
            type_id: typeId,
            desc: _this.data.desc,
            start_date: _this.data.start_date,
            is_expatriated: _this.data.is_expatriated,
            project_manager_user_id: userId,
            success: function (res) {
                app.data.qs.showSuccessToast(res.msg)
                wx.redirectTo({
                    url: '../startProjectList/startProjectList',
                });
            },
            fail: function (res) {
                app.data.qs.showErrorToast(res.msg)
                console.log(res);
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        app.data.qs.get_project_aggregate_list({
            success: function (res) {
                _this.setData({
                    'projectManagerList': res.data.managers,
                    'projectTypeList': res.data.project_types
                });
            }
        })
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