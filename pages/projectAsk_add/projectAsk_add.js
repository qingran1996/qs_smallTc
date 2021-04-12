var app = getApp()
Page({
    data: {
        pmheight: 0 + 'px',
        showDialog: false,
        users: '', //用户身份
        projectuserName: '', //
        projectuserName1: '', //项目审批人
        projectuserId: 0,
        projectId: 0, //项目id
        park: 0, //申请部门默认
        park1: 0, //申请部门默认
        parkdata: [], //部门列表
        nextman: [],
        nextId: 0,
        projectname: '', //项目名称
        projectnum: '', //项目编号
        khremark: 0, //客户名称
        khdata: [],
        khid: 1,
        khname: '',
        projectremark: '', //项目描述
        dzremark: '', //项目地址
        area: 0,
        areaId: 1,
        areadata: [],
        htType: 0, //合同类型默认
        htTypeId: 0, //合同类型id
        htList: [{
                id: 0,
                name: '总包项目合同'
            },
            {
                id: 1,
                name: '人工时项目合同'
            }
        ], //合同列表
        protectType: 0, //项目类型默认
        projectTypeId: 1, //项目类型id
        projectTypeData: [{
                id: 1,
                name: '战略项目'
            },
            {
                id: 2,
                name: '常规项目'
            }
        ], //项目类型列表
        hangye: 0, //行业默认
        hangyeId: 1, //行业id
        hangyeData: [], //行业列表
        startTime: '2020-06-01',
        startTimeNum: 0,
        endTime: '2020-07-01',
        scrollHeight: 0,
        endTimeNum: 0,
        projectTime: '', //项目周期
        projectAllTime: '', //项目总工时
        sureType: false,
        iszz: false,
        ishidden: false
    },
    chuantou (event) {
       // event.stopPropagation()
        //console.log(event)
    },
    //关闭自定义弹框
    closedig: function () {
        this.setData({
            iszz: false
        })
        this.toggleDialog()
        this.nosure()
    },
    //确认
    sure: function () {
        // let that = this
        // var url = app.globalData.URL + '/task/taskAssign';
        // if (that.data.projectuserName == '') {
        //     that.data.projectuserName = that.data.parkdata[that.data.park].userName
        // }
        // wx.request({
        //     url: url,
        //     method: 'POST',
        //     data: {
        //         userName: that.data.projectuserName,
        //         projectId: that.data.projectId
        //     },
        //     success: function (res) {
        //         wx.reLaunch({
        //             url: '../projectAsk/projectAsk',
        //         })
        //     }
        // });
        let that = this
        that.setData({
            sureType: true
        })
        let newdata = {
            name: that.data.projectname,
            desc: that.data.projectremark,
            typeId: that.data.hangyeId,
            areaId: that.data.areaId,
            address: that.data.dzremark,
            startDate: that.data.startTimeNum,
            endDate: that.data.endTimeNum,
            creatorId: that.data.projectuserId,
            customerId: that.data.khid,
            customerName: that.data.khname,
            totalPersonHours: that.data.projectAllTime,
            isExpatriated: that.data.htTypeId,
            isFinished: 0,
            isDeleted: 0,
            isBonusHours: 0,
            projectKind: that.data.projectTypeId,
            state: 2,
            userName: app.data.userMess.username,
            workFlowName: "OaProject",
            nextAssignee: that.data.projectuserName
        }
       // console.log(newdata)
        var url = app.globalData.URL + '/project/submitPro';
        wx.request({
            url: url,
            method: 'POST',
            data: newdata,
            success: function (res) {
                //console.info(that.data.list);
                let data = res.data.data
                console.log(data)
                if (res.data.code == 0) {
                    // that.setData({
                    //     users: data.nextRole,
                    //     projectId: data.projectId
                    // });
                    // that.getusers(data.nextRole) 
                    setTimeout(function () {
                        that.setData({
                            sureType: false
                        })
                        wx.reLaunch({
                            url: '../projectAsk/projectAsk',
                        })
                    }, 500)
                } else {
                    wx.showToast({
                        title: '系统繁忙请等待',
                        icon: 'loading',
                        duration: 2000
                    })
                    setTimeout(function () {
                        that.setData({
                            sureType: false
                        })
                    }, 2000)
                }

            }
        });
    },
    nosure: function () {
        this.setData({
            sureType: false
        })
        // let that = this
        // var url = app.globalData.URL + '/project/deletePro';
        // wx.request({
        //     url: url,
        //     method: 'POST',
        //     data: {
        //         projectId: that.data.projectId
        //     },
        //     success: function (res) {
        //         console.log('取消项目提交')
        //     }
        // });
        // wx.reLaunch({
        //     url: '../projectAsk/projectAsk',
        // })
    },
    // 跳转新增页面
    jump_projectAdd: function () {
        // wx.navigateTo({
        //     url: '../projectAsk_add/projectAsk_add',
        // })
        //this.toggleDialog()
        if (this.data.projectAllTime != '' && this.data.projectname != '') {
            this.setData({
                iszz: true
            })
            this.toggleDialog()
        } else {
            wx.showToast({
                title: '请将页面信息完善',
                icon: 'none',
                duration: 3000
            })
        }

    },
    getusers: function (data) {
        let that = this
        var url = app.globalData.URL + '/user/getUsers';
        that.setData({
            parkdata: [],
            nextman: []
        });
        wx.request({
            url: url,
            method: 'POST',
            data: {
                itemName: data
            },
            success: function (res) {
                //console.info(that.data.list);
                var list = that.data.parkdata;
                let data = res.data.data
                console.log(data)
                if (data.length != 0) {
                    setTimeout(function () {
                        // that.toggleDialog()
                        for (let i = 0; i < data.length; i++) {
                            if (data[i] != null) {
                                let obj = {}
                                obj.id = data[i].id
                                obj.name = data[i].name
                                obj.userName = data[i].userName
                                list.push(obj)
                            }

                        }
                        that.setData({
                            parkdata: list,
                            nextman: list,
                            projectuserId: list[0].id,
                            projectuserName: list[0].userName
                        });
                    }, 500)

                } else {

                }
            }
        });
    },
    /**
     * 控制 pop 的打开关闭
     * 该方法作用有2:
     * 1：点击弹窗以外的位置可消失弹窗
     * 2：用到弹出或者关闭弹窗的业务逻辑时都可调用
     */
    toggleDialog() {
        this.setData({
            showDialog: !this.data.showDialog
        });

    },
    //项目名称输入
    projectremark: function (e) {
        this.setData({
            projectname: e.detail.value
        });
        console.log(this.data.projectname)
    },
    //项目编号输入
    projectnumremark: function (e) {
        this.setData({
            projectnum: e.detail.value
        });
        console.log(this.data.projectnum)
    },
    // 项目总工时输入
    projectAllTimechange: function (e) {
        this.setData({
            projectAllTime: e.detail.value
        });
        console.log(this.data.projectAllTime)
    },
    // 项目周确输入
    projectTimechange: function (e) {
        this.setData({
            projectTime: e.detail.value
        });
        console.log(this.data.projectTime)
    },
    //开始日期
    bindDateChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        //console.log(new Date(e.detail.value).getTime())
        console.log(Math.round(new Date(e.detail.value) / 1000))
        this.setData({
            startTime: e.detail.value,
            startTimeNum: Math.round(new Date(e.detail.value) / 1000)
        })
    },
    //结束日期
    bindendDateChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        console.log(new Date(e.detail.value).getTime())
        this.setData({
            endTime: e.detail.value,
            endTimeNum: Math.round(new Date(e.detail.value) / 1000)
        })
    },
    // 
    parkchange: function (e) {
        this.setData({
            'park': e.detail.value,
            'nextId': e.detail.value
        });
        // this.data.htList[this.data.htType].name
        console.log(this.data.parkdata[this.data.park].userName)
        // console.log(this.data.parkdata[this.data.park].id)
        this.setData({
            projectuserName: this.data.parkdata[this.data.park].userName,
            projectuserId: this.data.parkdata[this.data.park].id
        });
    },
    manchange: function (e) {
        this.setData({
            'nextId': e.detail.value
        });
        this.setData({
            projectuserName: this.data.nextman[this.data.nextId].userName
        });
    },
    // 客户名称输入
    khchange: function (e) {
        this.setData({
            'khremark': e.detail.value
        });
        // this.data.htList[this.data.htType].name
        console.log(this.data.khdata[this.data.khremark].name)
        this.setData({
            khid: this.data.khdata[this.data.khremark].id,
            khname: this.data.khdata[this.data.khremark].name
        });
    },
    // 项目描述输入
    projectRemarkInput: function (e) {
        this.setData({
            projectremark: e.detail.value
        });
        console.log(this.data.projectremark)
    },
    // 项目地址输入
    placeRemarkInput: function (e) {
        this.setData({
            dzremark: e.detail.value
        });
        console.log(this.data.dzremark)
    },
    // 合同类型选择
    htchange: function (e) {
        this.setData({
            'htType': e.detail.value
        });
        // this.data.htList[this.data.htType].name
        console.log(this.data.htList[this.data.htType].id)
        if (this.data.htList[this.data.htType].id==1) {
            this.setData({
                projectAllTime: '0'
            });
        } else {
            this.setData({
                projectAllTime: ''
            });
        }
        this.setData({
            htTypeId: this.data.htList[this.data.htType].id
        });
    },
    //项目类型选择
    protectTypechange: function (e) {
        this.setData({
            'protectType': e.detail.value
        });
        console.log(this.data.projectTypeData[this.data.protectType].id)
        this.setData({
            projectTypeId: this.data.projectTypeData[this.data.protectType].id
        });
    },
    areachange: function (e) {
        this.setData({
            'area': e.detail.value
        });
        console.log(this.data.areadata[this.data.area].name)
        this.setData({
            areaId: this.data.areadata[this.data.area].id
        });
    },
    //行业选择
    hangyechange: function (e) {
        this.setData({
            'hangye': e.detail.value
        });
        console.log(this.data.hangyeData[this.data.hangye].name)
        this.setData({
            hangyeId: this.data.hangyeData[this.data.hangye].id
        });
    },
    //获取行业接口
    getProType: function () {
        let that = this
        var url = app.globalData.URL + '/project/getOaProType';
        wx.request({
            url: url,
            method: 'POST',
            data: {},
            success: function (res) {
                //console.info(that.data.list);
                var list = that.data.hangyeData;
                let data = res.data.data
                console.log(data)
                if (data.length != 0) {
                    setTimeout(function () {
                        for (let i = 0; i < data.length; i++) {
                            let obj = {}
                            obj.id = data[i].id
                            obj.name = data[i].name
                            list.push(obj)
                        }
                        that.setData({
                            hangyeData: list
                        });
                    }, 500)

                } else {

                }


            }
        });
    },

    getarea: function () {
        let that = this
        var url = app.globalData.URL + '/oaarea/query';
        wx.request({
            url: url,
            method: 'POST',
            data: {},
            success: function (res) {
                //console.info(that.data.list);
                var list = that.data.areadata;
                let data = res.data.data
                console.log(data)
                if (data.length != 0) {
                    setTimeout(function () {
                        for (let i = 0; i < data.length; i++) {
                            let obj = {}
                            obj.id = data[i].areaId
                            obj.name = data[i].areaName
                            list.push(obj)
                        }
                        that.setData({
                            areadata: list,
                            areaId: list[0].id
                        });
                    }, 500)

                } else {

                }


            }
        });
    },
    getkh: function () {
        let that = this
        var url = app.globalData.URL + '/com/query';
        wx.request({
            url: url,
            method: 'POST',
            data: {},
            success: function (res) {
                //console.info(that.data.list);
                var list = that.data.khdata;
                let data = res.data.data
                //console.log(data)
                if (data.length != 0) {
                    setTimeout(function () {
                        for (let i = 0; i < data.length; i++) {
                            let obj = {}
                            obj.id = data[i].id
                            obj.name = data[i].name
                            list.push(obj)
                        }
                        that.setData({
                            khdata: list,
                            khid: list[0].id,
                            khname: list[0].name
                        });
                    }, 500)

                } else {

                }


            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //console.log(this.data.showdata)
        this.getProType()
        this.getarea()
        this.getkh()
        let name = '商务总监'
        this.getusers(name)

        this.data.pmheight = wx.getSystemInfoSync().windowHeight - 50 + "px"
        // console.log(this.data.pmheight)
        wx.setNavigationBarTitle({
            title: '新建项目',
        })
        let that = this
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    scrollHeight: res.windowHeight * 0.89
                });
            }
        });
        this.setData({
            startTimeNum: Math.round(new Date(this.data.startTime) / 1000),
            endTimeNum: Math.round(new Date(this.data.endTime) / 1000)
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

    }
})