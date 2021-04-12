// miniprogram/pages/login/login.js
var app = getApp();
var md5 = require('../../util/md5.js');
var time;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        autoLogin: false,  //登录方式  false:账号密码登录  true:验证码登录
        loginName: '',  //账号密码登录  用户名
        loginPassword: '',   //账号密码登录 密码
        codeLoginName: '',   //验证码登录  用户名
        code: '',  //验证码
        codeName: '获取验证码',
        time: '',
        hasUserMess: true,  //是否已经登录过
    },
    // 更换登录方式
    changeLoginWay: function (e) {
        this.setData({
            autoLogin: e.currentTarget.dataset.autologin,
            loginPassword: '',
            code: '',
            codeName: '获取验证码',
        })
        clearInterval(time);
    },
    // 输入登录账号
    loginNameInput: function (e) {
        this.setData({
            loginName: e.detail.value
        })
    },
    // 输入登录密码
    loginPassInput: function (e) {
        this.setData({
            loginPassword: e.detail.value
        })
    },
    // 输入验证码的账号
    codeLoginNameInput: function (e) {
        this.setData({
            codeLoginName: e.detail.value
        })
    },
    // 输入验证码
    codeInput: function (e) {
        this.setData({
            code: e.detail.value
        })
    },
    clickTap:function(e){
      wx.requestSubscribeMessage({
        tmplIds: ['lLTjWKv_WtnIJZuhxGKUApj3LUBC-QLCdh1pm1B4Uls','6ADVbc4QmjM3VFyBF2uJm-9wWVpu4DtuhPWpp5nZsg4'],
        success: (res) => {
          
        }
      });
    },
    // 登录
    login: function () {
        var _this = this;
        var userName = '';
        if (!this.data.autoLogin) {
            userName = this.data.loginName;
        } else {
            userName = this.data.codeLoginName;
        }
        if (userName.length <= 0) {
            app.errorToast('用户名不能为空');
            return;
        }

        if (!this.data.autoLogin && this.data.loginPassword.length <= 0) {
            app.errorToast('密码不能为空');
            return;
        }
        if (this.data.autoLogin && this.data.code.length <= 0) {
            app.errorToast('验证码不能为空');
            return;
        }
        var md5password = '';
        if (_this.data.loginPassword.length > 0) {
            md5password = md5.hex_md5(_this.data.loginPassword);
        }
        ;
        app.data.qs.login({
            openid: wx.getStorageSync('openId'),
            password: md5password,
            user_name: userName,
            code: _this.data.code,
            success: function (res) {
                _this.loginSuccess(res);
            },
            fail: function (res) {
                _this.loginFail(res);
            },
        })
    },
    // 登录成功
    loginSuccess: function (res) {
        var _this = this;
        app.data.userMess = res.data.user;
        app.data.routers = res.data.user.menuList;
        console.log( app.data.routers )
        wx.setStorageSync('loginOut', false);
        wx.setStorageSync('changeMess', true);   //登录信息更改
        if (getCurrentPages().length > 1) {
            wx.reLaunch({
                url: '../index/index'
            });
        } else {
            wx.reLaunch({
                url: '../index/index'
            });
        }
    },
    // 登录失败
    loginFail: function (res) {
        app.errorToast(res.msg || '登录失败');
    },
    // 获取验证码
    getCode: function () {
        var _this = this;
        if (_this.data.codeName != '获取验证码') {
            return;
        }
        if (this.data.codeLoginName.length <= 0) {
            app.errorToast('用户名不能为空');
            return;
        }
        var reg = /^1[3-578]\d{9}$/;
        var reg1 = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (!reg.test(this.data.codeLoginName) && !reg1.test(this.data.codeLoginName)) {
            app.errorToast('请正确填写手机号码或邮箱');
            return;
        }
        app.data.qs.send_verify_code({
            user_name: _this.data.codeLoginName,
            scene: 'login',
            success: function (res) {
                var second = 60;
                time = setInterval(function () {
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
            fail: function (res) {
                app.errorToast(res.errMsg || '发送验证码失败');
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
        this.setData({
            codeName: '获取验证码',
        });
        clearInterval(time);
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