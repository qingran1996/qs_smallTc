// miniprogram/pages/register/register.js
var app = getApp();
var md5 = require('../../util/md5.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userName: '',  //用户名
        code: '',    //验证码
        codeName: '获取验证码',
        password: '',   //密码
        userFullname: '',  //姓名
        sex: [
            {name: '男', value: 1},
            {name: '女', value: 2}
        ],
        age: '',
        agreeState: false,  //同意 免责声明
    },
    // 输入用户名
    userNameInput(e) {
        this.setData({
            userName: e.detail.value
        })
    },
    // 输入密码
    passwordInput(e) {
        this.setData({
            password: e.detail.value
        })
    },
    // 选择性别
    sexChoose(e) {
        this.data.sex.forEach(function (item) {
            if (item.value == e.detail.value) {
                item.checked = true;
            } else {
                item.checked = false;
            }
        })
        this.setData({
            sex: this.data.sex
        })
    },
    // 输入姓名
    ageInput(e) {
        this.setData({
            age: e.detail.value
        })
    },
    // 输入验证码
    codeInput(e) {
        this.setData({
            code: e.detail.value,
        })
    },
    //输入 姓名
    userFullnameInput(e) {
        this.setData({
            userFullname: e.detail.value,
        })
    },
    // 同意 免责声明
    agree() {
        this.setData({
            agreeState: !this.data.agreeState,
        });
    },
    // 注册
    register() {
        var _this = this;
        if (!this.data.agreeState) {
            app.errorToast('请同意免责声明');
            return;
        }
        var reg = /^1[3-578]\d{9}$/;
        var reg1 = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (!reg.test(_this.data.userName) && !reg1.test(_this.data.userName)) {
            app.errorToast('请正确填写手机号码或邮箱');
            return;
        }
        if (_this.data.password.length <= 0) {
            app.errorToast('密码不能为空');
            return;
        }
        if (_this.data.userFullname.length <= 0) {
            app.errorToast('姓名不能为空');
            return;
        }
        var sexValue = 0;
        this.data.sex.forEach(function (item) {
            if (item.checked) {
                sexValue = item.value;
            }
        })
        if (sexValue == 0) {
            app.errorToast('请选择性别');
            return;
        }
        if (_this.data.age.length <= 0) {
            app.errorToast('年龄不能为空');
            return;
        }
        app.qs.ecg.register({
            user_name: _this.data.userName,
            password: md5.hex_md5(_this.data.password),
            user_fullname: _this.data.userFullname,
            sex: sexValue,
            age: _this.data.age,
            openid: wx.getStorageSync('openId'),
            code: _this.data.code,
            success: function (res) {
              app.errorToast('注册成功,正在登录...');
              _this.login();
            },
            fail: function (res) {
                app.errorToast(res.errMsg || '注册失败');
            }
        })
    },
    // 登录
    login() {
        var _this = this;
        app.qs.ecg.auto_login({
            openid: wx.getStorageSync('openId'),
            success: function (res) {
                wx.setStorageSync('loginOut', false);
                app.data.userMess = res.data.user;
                app.relaunch('../index/index');
            },
            fail: function (res) {
              app.errorToast('登录失败,请重新登录');
              app.relaunch('../login/login');
            }
        })
    },
    // 获取验证码
    getCode() {
        var _this = this;
        if (_this.data.codeName != '获取验证码') {
            return;
        }
        var reg = /^1[3-578]\d{9}$/;
        var reg1 = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (!reg.test(_this.data.userName) && !reg1.test(_this.data.userName)) {
            app.errorToast('请正确填写手机号码或邮箱');
            return;
        }
        app.qs.ecg.send_verify_code({
            user_name: _this.data.userName,
            scene: 'register',
            success: function(res) {
                let second = 60;
                var time = setInterval(function () {
                    if (second >= 0) {
                        _this.setData({
                            codeName: second--
                        })
                    } else {
                        _this.setData({
                            codeName: '获取验证码'
                        })
                        clearInterval(time);
                    }
                }, 1000)
            },
            fail: function(res) {
                app.errorToast(res.errMsg || '发送验证码失败');
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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