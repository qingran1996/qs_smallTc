//app.js
var qs = require('./qs/qs.js');
var qs1 = require('./qs/qs_1.js');
App({
    globalData: {
        //  URL: 'http://192.168.10.152:10003',
        URL: 'https://timer.yhelper.com:11443/japi',
        uploadpath: '/root/uploadfile/timeFlow/expensens/'
        // https://timer.yhelper.com:11443/japi
    },
    data: {
        qs: qs,
        qs1: qs1, //封装请求
        urlProd: 'prod', //环境
        userMess: {}, //用户信息
        promise: '',
        shareMenu: {
            title: '强思工时系统',
            imageUrl: '',
            path: 'pages/index/index',
        },
        routers: []
    },
    extname(filename) {
        if (!filename || typeof filename != 'string') {
            return false
        };
        let a = filename.split('').reverse().join('');
        let b = a.substring(0, a.search(/\./)).split('').reverse().join('');
        return b
    },
    moneychange(num) {
        var noNegative = true; //默认是正值。
        var s = (num + "").replace(/[^\d\.-]/g, ""); //把数字和. 换成空格,也就是前面均加上""
        //此时，转换后的值为 12345678.234   数字与数字之间, .之间，均有"" 
        s = parseFloat(s).toFixed(2); //先转换成小数，后四舍五入两位小数，为12345678.23
        s = s + ""; //转换成字符串
        if (parseFloat(s) < 0) { //是负数
            s = Math.abs(s).toFixed(2) + ""; //先转换成正数，然后取两位小数
            noNegative = false; //标志位为负数
        }
        var zheng = s.split(".")[0]; //取出前面的整数值。 为12345678
        var zhengArr = zheng.split("").reverse(); //先按照""进行拆分，后进行反转。
        // 拆分时，为1,2,3,4,5,6,7,8  反转后为8,7,6,5,4,3,2,1
        var dian = s.split(".")[1]; //取出小数部分，为23
        var t = "";
        for (var i = 0; i < zhengArr.length; i++) {
            if (i % 3 == 2 && i != zhengArr.length - 1) { //为第三位，并且并不是最后了。如123456时，6并不加,
                t += zhengArr[i] + ",";
            } else {
                t += zhengArr[i] + ""; //加上空格
            }
        }
        //此时,t的值为876,543,21, 反转后为12,345,678 
        //进行拼接， 符号位+ 反转后的数字+小数点+小数部分
        var value = (noNegative ? "" : "-") + t.split("").reverse().join("") +
            "." + dian;
        // 输出的值，就是12,345,678.23
        return value
    },
    //时间戳转日期
    formatDate(date) {
        var date = new Date(date);
        var YY = date.getFullYear() + '-';
        var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return YY + MM + DD + " " + hh + mm + ss;
    },
    wxRequest(method, url, data, callback, errFun) {
        wx.request({
            url: url,
            method: method,
            data: data,
            header: {
                'content-type': 'application/json',
                'Accept': 'application/json'
            },
            dataType: 'json',
            success: function (res) {
                callback(res);
            },
            fail: function (err) {
                errFun(res);
            }
        })
    },
    onLaunch: function () {
        // console.log(this.globalData)
        if (this.data.urlProd == 'prod') {
            this.globalData.URL = 'https://timer.yhelper.com:11443/japi'
        } else if (this.data.urlProd == 'prepare') {
            this.globalData.URL = 'https://timer.yhelper.com:11443/japi'
        } else {
            this.globalData.URL = 'http://192.168.10.151:10003'
        }
        //console.log(this.globalData)
        wx.setStorageSync('firstLogin', true); //是否是第一次进入 index 页
        this.data.qs.init(this.data.urlProd, wx);
        var _this = this;
        _this.wxLogin().then(function (res) {
            _this.autoLogin().then(function (res1) {
                if (res1.data.is_registered == 0) {
                    wx.navigateTo({
                        url: '/pages/login/login'
                    });
                }
            });
        });
    },
    getLoginUserId: function () {
        var _this = this;
        if (_this.userMess) {
            return _this.userMess.id;
        }
        return false;
    },
    getReader: function () {
        let modelId = ['B87xlSwCdNsKq_MrGaubDs1VNyLjN-0s4j_EwU6dTfo', 'mUlw_oebBbLzFbdeJ1iUmLHaMMq3O1F_ZvzriX_-bpU']
        
        wx.getSetting({
            withSubscriptions: true, //  这里设置为true,下面才会返回mainSwitch
            success: function (res) {
                console.log(res)
                // 调起授权界面弹窗
                if (res.subscriptionsSetting.mainSwitch) { // 用户打开了订阅消息总开关
                    if (res.subscriptionsSetting.itemSettings == null) { // 用户同意总是保持是否推送消息的选择, 这里表示以后不会再拉起推送消息的授权
                        // 当用户没有点击 ’总是保持以上选择，不再询问‘  按钮。那每次执到这都会拉起授权弹窗
                        wx.showModal({
                            title: '提示',
                            content: '请授权开通服务通知',
                            showCancel: true,
                            success: function (ress) {
                                if (ress.confirm) {
                                    wx.requestSubscribeMessage({ // 调起消息订阅界面
                                        tmplIds: modelId,
                                        success(res) {
                                            wx.showToast({
                                                title: '订阅成功 ',
                                                icon: 'success',
                                                duration: 2000
                                            })
                                        },
                                        fail(er) {
                                            wx.showToast({
                                                title: '订阅失败 ',
                                                icon: 'error',
                                                duration: 2000
                                            })
                                        }
                                    })

                                }
                            }
                        })
                    } else {
                        
                    }

                } else {
                    console.log('订阅消息未开启')
                }
            },
            fail: function (error) {
                console.log(error);
            },
        })
    },
    onShow: function () {
        // console.log(123)
        // 这里是获取下发权限地方，根据官方文档，可以根据  wx.getSetting() 的 withSubscriptions   这个参数获取用户是否打开订阅消息总开关。后面我们需要获取用户是否同意总是同意消息推送。所以这里要给它设置为true 。
        console.log(wx.getStorageSync('openId'))
        this.getReader()
    },

    // 微信获取openID
    wxLogin: function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.data.qs.wx_login({
                success: function (res) {
                    //console.log(res);
                    wx.setStorageSync('openId', res.data.openid);
                    resolve(res);
                },
                fail: function (res) {
                    console.log(res);
                    reject(res);
                }
            })
        })

    },
    // 自动登录
    autoLogin: function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.data.qs.auto_login({
                openid: wx.getStorageSync('openId'),
                success: function (res) {
                    console.log(res)
                    _this.data.userMess = res.data.user;
                    _this.data.routers = res.data.user.menuList;
                    if (res.data.is_registered == 1) {
                        wx.setStorageSync('loginOut', false); //是否需要重新登录
                    } else {
                        wx.setStorageSync('loginOut', true);
                    }
                    resolve(res);
                },
                fail: function (res) {
                    wx.setStorageSync('loginOut', true);
                    reject(res);
                }
            })
        })

    },
    // 封装wx.relaunch()
    relaunch: function (url) {
        if (wx.canIUse('reLaunch')) {
            wx.reLaunch({
                url: url,
                fail: function () {
                    wx.redirectTo({
                        url: url,
                    });
                }
            });
        } else {
            wx.redirectTo({
                url: url,
            });
        }
    },
    // 封装错误显示
    errorToast: function (title) {
        wx.showToast({
            title: title,
            icon: 'none',
            // image: '../../images/error.png'
        })
    },
})