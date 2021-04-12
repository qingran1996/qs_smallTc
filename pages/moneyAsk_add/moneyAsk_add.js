var app = getApp()
Page({
    data: {
        park: 0, //项目名称默认
        showModal: false,
        parkdata: [], //项目列表
        khremark: '', //客户名称
        maxmoney: 0,
        deptdata: [],
        payforname: '',
        personname: '', //人员名字
        personNum: 0,
        point: 0, //占比
        pointshow: 0,
        addmoney: '', //占比金额
        showId: 0, //当前分配岗位id
        deptid: 0,
        persondata: [],
        personId: 0,
        slideButtons: [{
            id: 0,
            type: 'waiting',
            text: '修改'
        }, {
            id: 1,
            type: 'warn',
            text: '删除'
        }],
        topdata: [{
                name: '项目号',
                nav: ''
            },
            {
                name: '所属部门',
                nav: ''
            },
            {
                name: '项目阶段',
                nav: ''
            },
            {
                name: '发放金额',
                nav: ''
            }
        ], //顶部填写
        showdata: [],
        moneyFP: [], //奖金分配
        today: '',
        projectname: '',
        projectNo: '',
        projectshowId: 0,
        depId: 0,
        projectIsFinsh: 0,
        userlist: [],
        userId: 0,
        usershowid: 0,
        processInstanceId: 0,
        sureType: false,
        username: '',
        userNum: null,
        uploaddata: null,
        isadd: true,
        choose: null,
        showmax: 0,
        showindexId: 0
    },
    //关闭自定义弹框
    closedig: function () {
        this.toggleDialog()
        // this.nosure()
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
    //滑动删除
    slideButtonTap(e) {
        // console.log(e.target.dataset.index)
        this.setData({
            choose: e.target.dataset.index
        })
        let data = this.data.moneyFP
        if (e.detail.index == 1) {
            data[e.target.dataset.id].namedata.splice(e.target.dataset.index, 1)
            this.setData({
                moneyFP: data
            })
        } else {
            let show = data[e.target.dataset.id].namedata[e.target.dataset.index]
            console.log('---------' + e.target.dataset.id)
            if (e.target.dataset.id != 0) {
                this.setData({
                    uploaddata: show,
                    showId: 1,
                    point: parseFloat(show.bar),
                    isadd: false
                })
                console.log(show)
                let that = this
                setTimeout(() => {
                    that.setData({
                        showModal: true
                    })
                }, 600);
                that.getperson(2) //获取人员
            } else {
                this.setData({
                    isadd: false,
                    point: parseFloat(show.bar),
                    addmoney: show.num,
                    showId: 0,
                    showModal: true,
                    personNum: this.data.userNum,
                    personname: this.data.username
                })
            }

        }
        //console.log(e.target.dataset.index)

    },
    //申请奖金
    saveTo: function () {
        if (this.data.payforname == '') {
            wx.showToast({
                title: '请先输入总金额',
                icon: 'none',
                duration: 3000
            })
        } else {
            let data = this.data.moneyFP
            let showdata = []
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].namedata.length; j++) {
                    showdata.push({
                        proleId: data[i].roleId,
                        ppositionId: data[i].positionId,
                        userId: data[i].namedata[j].id,
                        pfee: parseFloat(data[i].namedata[j].num),
                        proportion: parseFloat(data[i].namedata[j].bar) / 100
                    })
                }
            }
            //console.log(showdata)
            let json = {
                projectName: this.data.projectname,
                projectNo: this.data.projectNo,
                depId: this.data.depId,
                userId: app.data.userMess.id,
                projectIsFinsh: this.data.projectIsFinsh,
                fee: parseFloat(this.data.payforname),
                note: '',
                // workFlowName: '项目奖金申请',
                workFlowName: 'OaProjectBonus',
                oaProjectBonusDetailRequests: showdata
            }
            //console.log(json)
            //console.log(this.data.moneyFP)
            let that = this
            that.setData({
                sureType: true
            })
            wx.showLoading({
                title: '正在请求',
            })
            var url = app.globalData.URL + '/oaprojectbonus/submitBonus';
            wx.request({
                url: url,
                method: 'POST',
                data: json,
                success: function (res) {
                    let data = res.data.data
                    if (data != null) {
                        wx.hideLoading()
                        // this.toggleDialog()
                        that.setData({
                            processInstanceId: data
                        })
                        that.getuserlist(data)
                        setTimeout(function () {
                            that.toggleDialog()
                            that.setData({
                                sureType: false
                            })
                        }, 500)
                    } else {
                        wx.hideLoading()
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
                    console.log(data)
                }
            });
        }

    },
    getuserlist: function (data) {
        let that = this
        var url = app.globalData.URL + '/oaprojectbonus/getNextAssignee?processInstanceId=' + data;
        wx.request({
            url: url,
            method: 'POST',
            success: function (res) {
                let data = res.data.data
                let userlist = that.data.userlist
                //console.log(res.data.data)
                setTimeout(() => {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i] != null) {
                            userlist.push({
                                id: data[i].id,
                                name: data[i].name
                            })
                        }
                    }
                    that.setData({
                        userlist: userlist,
                        usershowid: userlist[0].id
                    })
                }, 500);

            }
        });
    },
    sure: function () {
        let that = this
        var url = app.globalData.URL + '/oaprojectbonus/selectNextAssignee?processInstanceId=' + that.data.processInstanceId + '&userId=' + that.data.usershowid;
        wx.request({
            url: url,
            method: 'POST',
            success: function (res) {
                if (res.data.code == 0) {
                    wx.reLaunch({
                        url: '../moneyAsk/moneyAsk',
                    })
                }
            }
        });
    },
    /**
     * 弹出框蒙层截断touchmove事件
     */
    preventTouchMove: function () {},
    /**
     * 隐藏模态对话框
     */
    hideModal: function () {
        this.setData({
            showModal: false
        });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
        this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
        let moneyFP = this.data.moneyFP
        if (this.data.addmoney != '0' && this.data.addmoney != '' && this.data.addmoney != '0.00') {
            if (this.data.isadd) {
                moneyFP[this.data.showId].namedata.push({
                    name: this.data.personname,
                    id: this.data.personNum,
                    bar: this.data.pointshow.toFixed(2),
                    bar1: this.data.pointshow,
                    num: parseFloat(this.data.addmoney).toFixed(2)
                })
            } else {
                moneyFP[this.data.showId].namedata[this.data.choose] = {
                    name: this.data.personname,
                    id: this.data.personNum,
                    bar: this.data.pointshow.toFixed(2),
                    bar1: this.data.pointshow,
                    num: parseFloat(this.data.addmoney).toFixed(2)
                }
            }

        }
        this.hideModal();
        this.setData({
            moneyFP: moneyFP,
            point: 0,
            addmoney: ''
        })
    },
    // 发放金额输入
    payfornamechange: function (e) {
        this.setData({
            payforname: e.detail.value
        });
        console.log(this.data.payforname)
    },
    //占比金额
    addmoneychange: function (e) {
        //console.log(this.data.moneyFP[this.data.showId].namedata[this.data.choose])
        //console.log(this.data.isadd)
        let max = 0
        if (this.data.isadd) {
            max = 0
        } else {
            max = -parseFloat(this.data.moneyFP[this.data.showId].namedata[this.data.choose].num)
        }
        let data1 = this.data.moneyFP
        for (let i = 0; i < data1.length; i++) {
            for (let j = 0; j < data1[i].namedata.length; j++) {
                max += parseFloat(data1[i].namedata[j].num)
            }
        }
        //console.log(max)
        let showmax = parseFloat(this.data.payforname) - parseFloat(max)

        // if (!this.data.isadd){
        //     showmax -=parseFloat(this.data.moneyFP[this.data.showId].namedata[this.data.choose].num)
        // }
        if (parseFloat(e.detail.value) > showmax) {
            this.setData({
                'addmoney': showmax.toFixed(2)
            });
        } else {
            this.setData({
                'addmoney': e.detail.value
            });
        }

        if (e.detail.value == '') {
            this.setData({
                point: 0
            })
        } else {
            let point = parseFloat(this.data.addmoney) / parseFloat(this.data.payforname) * 100
            this.setData({
                pointshow: point,
                point: point.toFixed(2)
            })
        }
        this.setData({
            showmax: showmax
        })
    },
    deptchange: function (e) {
        this.setData({
            'deptid': e.detail.value,
            'depId': this.data.deptdata[e.detail.value].id
        });
    },
    //审批人
    userchange: function (e) {
        this.setData({
            'userId': e.detail.value,
            'usershowid': this.data.userlist[e.detail.value].id
        });
    },
    //人员选择
    personchange: function (e) {
        this.setData({
            'personId': e.detail.value,
            'personname': this.data.persondata[e.detail.value].name,
            'personNum': this.data.persondata[e.detail.value].id,
        });
    },
    // 
    parkchange: function (e) {
        this.setData({
            'park': e.detail.value,
            'projectname': this.data.parkdata[e.detail.value].name,
            'projectNo': this.data.parkdata[e.detail.value].num,
            'projectshowId': this.data.parkdata[e.detail.value].id
        });
        // this.data.htList[this.data.htType].name
        console.log(this.data.parkdata[this.data.park].id)
    },
    // 跳转添加负责人页面
    jump_projectAdd: function (event) {
        if (this.data.payforname == '') {
            wx.showToast({
                title: '请先输入总金额',
                icon: 'none',
                duration: 3000
            })
        } else {
            console.log(this.data.moneyFP[0])
            if (event.currentTarget.dataset.id != 0) {
                let that = this
                setTimeout(() => {
                    that.setData({
                        showModal: true,
                        isadd: true,
                        showId: event.currentTarget.dataset.id
                    })
                }, 600);
                that.getperson(1) //获取人员
            } else {
                this.setData({
                    isadd: true,
                    showId: event.currentTarget.dataset.id,
                    showModal: true,
                    personNum: this.data.userNum,
                    personname: this.data.username
                })
            }


        }
        console.log(event.currentTarget.dataset.id)
        this.setData({
            showindexId: event.currentTarget.dataset.id
        })
        // wx.navigateTo({
        //     url: '../moneyAsk_add_person/moneyAsk_add_person',
        // })

    },
    //获取人员
    getperson: function (show) {
        let that = this
        that.setData({
            persondata: []
        })
        var url = app.globalData.URL + '/oaprojectbonus/findUsersByOaProjectId?projectId=' + that.data.projectshowId;
        wx.request({
            url: url,
            method: 'POST',
            success: function (res) {
                // console.log(show)
                if (res.data.code == 0) {
                    let data = res.data.data
                    let persondata = that.data.persondata
                    //console.log(res.data.data)
                    for (let i = 0; i < data.length; i++) {
                        if (data[i] != null) {
                            persondata.push({
                                id: data[i].id,
                                name: data[i].name
                            })
                        }
                    }
                    if (show == 1) {
                        if (that.data.personname == that.data.username) {
                            that.setData({
                                persondata: persondata,
                                personname: persondata[0].name,
                                personNum: persondata[0].id,
                            })

                        } else {
                            that.setData({
                                persondata: persondata,
                                personname: that.data.personname,
                                personNum: that.data.personNum,
                            })
                        }
                    } else {
                        for (let i = 0; i < persondata.length; i++) {
                            if (that.data.uploaddata.id == persondata[i].id) {
                                that.setData({
                                    personId: i,
                                    persondata: persondata,
                                    personname: persondata[i].name,
                                    personNum: persondata[i].id,
                                    addmoney: parseFloat(that.data.uploaddata.num)
                                })
                            }
                        }
                    }

                } else {
                    wx.showToast({
                        title: '人员获取失败',
                        icon: 'none',
                        duration: 2000
                    })
                }

            }
        });
    },
    //获取所有岗位职位
    getmoney: function () {
        let that = this
        var url = app.globalData.URL + '/oaprojectbonus/getAllProjectJob';
        wx.request({
            url: url,
            method: 'POST',
            success: function (res) {
                let data = res.data.data
                let moneyFP = that.data.moneyFP
                console.log(res.data.data)
                for (let i = 0; i < data.length; i++) {
                    if (data[i] != null) {
                        moneyFP.push({
                            id: i,
                            roleId: data[i].roleId,
                            roleName: data[i].roleName,
                            positionId: data[i].positionId,
                            positionName: data[i].positionName,
                            namedata: []
                        })
                    }
                }
                that.setData({
                    moneyFP: moneyFP
                })
            }
        });
    },
    getdept: function () {
        let that = this
        var url = app.globalData.URL + '/oaprojectbonus/getAllDepts';
        wx.request({
            url: url,
            method: 'POST',
            success: function (res) {
                let data = res.data.data
                let deptdata = that.data.deptdata
                // console.log(res.data.data)
                for (let i = 0; i < data.length; i++) {
                    if (data[i] != null) {
                        deptdata.push({
                            id: data[i].deptId,
                            name: data[i].deptName
                        })
                    }
                }
                that.setData({
                    deptdata: deptdata,
                    depId: deptdata[0].id
                })
            }
        });
    },
    // 获取项目
    getproject: function () {
        let that = this
        var url = app.globalData.URL + '/oaprojectbonus/getAllProjectByUserId?userId=' + app.data.userMess.id;
        wx.request({
            url: url,
            method: 'POST',
            success: function (res) {
                let data = res.data.data
                let parkdata = that.data.parkdata
                console.log(res.data.data)
                for (let i = 0; i < data.length; i++) {
                    if (data[i] != null) {
                        parkdata.push({
                            id: data[i].id,
                            name: data[i].name,
                            num: data[i].no,
                            isDinished: data[i].isFinished == 0 ? '进行中' : '已完成',
                            projectIsFinsh: data[i].isFinished
                        })
                    }
                }
                that.setData({
                    parkdata: parkdata,
                    projectname: parkdata[0].name,
                    projectNo: parkdata[0].num,
                    projectshowId: parkdata[0].id,
                    projectIsFinsh: parkdata[0].projectIsFinsh
                })
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //console.log(this.data.showdata)
        var day2 = new Date();
        day2.setTime(day2.getTime());
        var s2 = day2.getFullYear() + "/" + (day2.getMonth() + 1) + "/" + day2.getDate();
        console.log(s2)
        this.getproject() //获取项目
        this.getdept() //获取部门
        this.getmoney() //获取所有岗位职位
        this.setData({
            today: s2,
            username: app.data.userMess.name,
            userNum: app.data.userMess.id
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

    }
})