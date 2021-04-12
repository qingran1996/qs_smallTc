// miniprogram/pages/mine/mine.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: { 
        isshow_sign: false,
        user_image: '',
        sign_image: '',
        name: '',
        email: '',
        gender: 0, 
        work_id: '',
        dept_id: '',
        dept_name: '',
        enrol_date: '',
        position: '',
        scrollTop: 0,
        scrollHeight: 0,
        wages: '', //工资号隐藏版
        wagesnum: '',
        wages_bank: '', //银行名字
        bankId: '', //银行卡号
        bankname: '',
        banknameuser: '',
        bankwagesnum: '',
        bankwages_bank: '',
        show: false,
        bankusername: '',
        banknum: '',
        bankshowname: '',
        moneyId: null,
        moneyId1: null,
        moneyId2: null,
        showActionsheet: false,
        isbuttonshow: true,
        groups: [{
            text: '查看签名',
            value: 1
        }, {
            text: '更换签名',
            value: 2
        }]
    },
    bottomshow: function () {
        this.setData({
            showActionsheet: true,
            isbuttonshow: false
        })
    },
    buttontap: function (e) {
        console.log(e)
    },
    buttontapclose:function () {
        console.log(123)
        this.setData({
            show: false,
            isbuttonshow: true
        })
    },
    close: function () {
        this.setData({
            showActionsheet: false,
            isbuttonshow: true
        })
    },
    //上传头像
    uploadimage() {
        this.uploadfileshow()
    },
    btnClick(e) {
        console.log(e)
        if (e.detail.value == 1) {
            console.log(123)
            let images = []
            images.push(this.data.sign_image)
            wx.previewImage({
                current: this.data.sign_image, // 当前显示图片的http链接  
                urls: images // 需要预览的图片http链接列表  
            })
        } else {
            this.uploadfileshow()
        }

        this.close()
    },
    uploadfileshow() {
        let that = this
        wx.chooseMessageFile({
            count: 1,
            type: 'all',
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFiles
                console.log(tempFilePaths)
                wx.showLoading({
                    title: '上传文件中',
                })
                wx.uploadFile({
                    url: app.globalData.URL + '/expenses/expensesUpload',
                    filePath: tempFilePaths[0].path,
                    name: 'uploadFilePath',
                    formData: {
                        'userId': app.data.userMess.id
                    },
                    success(res) {
                        //json字符串 需用JSON.parse 转
                        console.log(JSON.parse(res.data))
                        if (JSON.parse(res.data).code == 0) {

                            wx.hideLoading()
                            let data = JSON.parse(res.data).data
                            that.updateUserSign(data.userId, data.attachId)
                            // that.setData({
                            //     fppath: data.attachPath
                            // })
                        } else {
                            wx.hideLoading()
                            wx.showToast({
                                title: '上传失败',
                                icon: 'loading',
                                duration: 2000
                            })
                        }

                    }
                })
            }
        })
    },
    updateUserSign: function (userId, attachId) {
        let that = this
        var url = app.globalData.URL + '/user/updateUserSign';
        // let form1 = new FormData()
        // form1.append('file',that.data.partwordpath)
        wx.request({
            url: url,
            method: 'POST',
            data: {
                id: userId,
                attachId: attachId
            },
            success: function (res) {
                // console.log(res)
                if (res.data.code == 0) {
                    that.getmyimage()
                }
            }
        });
    },
    getmyimage: function () {
        let that = this
        var url = app.globalData.URL + '/user/getUserSign';
        // let form1 = new FormData()
        // form1.append('file',that.data.partwordpath)
        wx.request({
            url: url,
            method: 'POST',
            data: {
                id: app.data.userMess.id
            },
            success: function (res) {
                console.log(res)
                if (res.data.code == 0) {
                    that.setData({
                        sign_image: res.data.data != null ? app.data.qs.myUploadImg + res.data.data.attachPath : ''
                    })
                }
            }
        });
    },
    //员工户名输入
    bankusernamechange: function (e) {
        console.log(e.detail.value)
        this.setData({
            bankusername: e.detail.value
        })
    },
    //银行卡号输入
    banknumchange: function (e) {
        console.log(e.detail.value)
        this.setData({
            banknum: e.detail.value
        })
    },
    //开户行输入
    banknamechange: function (e) {
        console.log(e.detail.value)
        this.setData({
            bankshowname: e.detail.value
        })
    },
    getbank: function () {
        let that = this
        var url = app.globalData.URL + '/expenses/expensesPayGetByUserId';
        //console.log(that.data.projectuserName)
        wx.request({
            url: url,
            method: 'POST',
            data: {
                userId: app.data.userMess.id
            },
            success: function (res) {
                console.log(res.data)
                let data = res.data.data
                var reg = /^(\d{4})\d+(\d{4})$/
                if (data != null) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].typeId == 1) {
                            that.setData({
                                wages: data[i].bankNo.replace(reg, "$1****$2"),
                                name: data[i].bankUsername,
                                wagesnum: data[i].bankNo,
                                wages_bank: data[i].bankName,
                                moneyId1: data[i].id
                            })
                        }
                        if (data[i].typeId == 3) {
                            that.setData({
                                bankId: data[i].bankNo.replace(reg, "$1****$2"),
                                banknameuser: data[i].bankUsername,
                                bankwagesnum: data[i].bankNo,
                                bankwages_bank: data[i].bankName,
                                moneyId2: data[i].id
                            })
                        }
                    }
                }
            }
        });
    },
    //工资卡详情
    wagesnav: function () {
        this.setData({
            show: true,
            isbuttonshow: false,
            bankusername: this.data.name,
            banknum: this.data.wagesnum,
            bankshowname: this.data.wages_bank,
            moneyId: this.data.moneyId1
        })

    },
    //添加工资卡
    addwages: function () {
        let type = 1
        wx.navigateTo({
            url: '../mineBank/mineBank?typeId=' + type,
        })
    },
    //银行卡详情
    banknav: function () {
        this.setData({
            show: true,
            isbuttonshow: false,
            bankusername: this.data.banknameuser,
            banknum: this.data.bankwagesnum,
            bankshowname: this.data.bankwages_bank,
            moneyId: this.data.moneyId2
        })
    },
    //添加银行卡
    addbank: function () {
        let type = 3
        wx.navigateTo({
            url: '../mineBank/mineBank?typeId=' + type,
        })
    },
    binderrorimg: function (e) {
        this.setData({
            'user_image': "../../images/project/me.png"
        });
    },
    qiehuan: function () {
        wx.reLaunch({
            url: '../login/login'
        })
    },
    //修改银行卡
    savebank: function () {
        //console.log(this.data.bankusername)
        //console.log(this.data.moneyId)
        let that = this
        var url = app.globalData.URL + '/expenses/expensesPayUpdateById';
        wx.request({
            url: url,
            method: 'POST',
            data: {
                id: that.data.moneyId,
                bankUsername: that.data.bankusername,
                bankName: that.data.bankshowname,
                bankNo: that.data.banknum
            },
            success: function (res) {
                if (res.data.code == 0) {
                    that.setData({
                        show: false,
                        isbuttonshow: true
                    })
                    that.onShow()
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    })
                }

            }
        });

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(app.data.qs)
        var _this = this;
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({
                    scrollHeight: res.windowHeight * 0.89
                });
            }
        });
        // console.log(app.data.userMess.role_name.split(","))
    },
    scroll: function (event) {
        //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
        this.setData({
            scrollTop: event.detail.scrollTop
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
        var _this = this;
        _this.getbank() //获取银行卡列表
        _this.getmyimage() //获取我的签名
        app.data.qs.get_login_user({
            success: function (res) {
                console.log(res)
                var user_image = res.data.user.user_image == "" ? "../../images/project/me.png" : res.data.user.user_image;
                _this.setData({
                    'user_image': user_image,
                    'name': res.data.user.name,
                    'email': res.data.user.email,
                    'gender': res.data.user.sex,
                    'enrol_date': res.data.user.enrol_date,
                    'dept_id': res.data.user.dept_id,
                    'dept_name': res.data.user.dept_name,
                    'role_name': res.data.user.role_name,
                })
                if (res.data.user.role_name.indexOf("总经理") != -1) {
                    // console.log('有')
                    _this.setData({
                        isshow_sign: true
                    })
                } else {
                    // console.log('没有')
                    _this.setData({
                        isshow_sign: false
                    })
                }
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