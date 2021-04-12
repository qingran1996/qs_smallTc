// miniprogram/pages/masterWorktime/masterWorktime.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        'list': [],
        'max': 15,
        'page': 1,
        'hasResult': false,
        'list2': [],
        'max2': 15,
        'page2': 1,
        'hasResult2': false,
        'projectId': 0,
        'auditState': 0,
        'scrollHeight': 0,
        'pageHide':false
    },
    showDetail: function (e) {

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        _this.initHeight();
        var projectId = options.projectId;
        var auditState = options.auditState ? options.auditState : 0;
        _this.setData({projectId: projectId, auditState: 0});
        _this.getWaitAuditList(projectId, 1);
    },

    getWaitAuditList: function (projectId, page, success) {
        var _this = this;
        app.data.qs.get_audits({
            project_id: projectId,
            audit_state: 0,
            max: _this.data.max,
            page: page,
            success: function (res) {
                var hasResult = ((page > 1) || (res.data.list.length > 0));
                if (page > 1) {
                    var moment_list = _this.data.list;
                    if (res.data.list.length == 0) {
                        app.data.qs.showSuccessToast("已加载完毕");
                    } else {
                        for (var i = 0; i < res.data.list.length; i++) {
                            moment_list.push(res.data.list[i]);
                        }
                    }
                } else {
                    moment_list = res.data.list;
                }
                _this.setData({list: moment_list, page: page, hasResult: hasResult});
                if (success) {
                    success(res);
                }

            }
        })
    },

    getAuditedList: function (projectId, page, success) {
        var _this = this;
        app.data.qs.get_audits({
            project_id: projectId,
            page: page,
            max: _this.data.max2,
            audit_state: 1,
            success: function (res) {
                var hasResult2 = ((page > 1) || (res.data.list.length > 0));
                if (page > 1) {
                    var moment_list = _this.data.list2;
                    if (res.data.list.length == 0) {
                        app.data.qs.showSuccessToast("已加载完毕");
                    } else {
                        for (var i = 0; i < res.data.list.length; i++) {
                            moment_list.push(res.data.list[i]);
                        }
                    }
                } else {
                    moment_list = res.data.list;
                }
                _this.setData({list2: moment_list, page2: page, hasResult2: hasResult2});
                if (success) {
                    success(res);
                }
            }
        })
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

    initHeight:function () {
        var _this = this;
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({
                    scrollHeight: res.windowHeight
                });
                var query = wx.createSelectorQuery();
                query.select('.weui-cells').boundingClientRect(function (rect) {
                    // console.log(rect.width)
                    var max = parseInt(res.windowHeight / rect.width) + 2;
                    if (max < 12) {
                        max = 12;
                    }
                    _this.setData({
                        max: max,
                        max2: max
                    })
                }).exec();
            }
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var _this = this;
        //如果是待审列表
        if (_this.data.auditState == 0 && _this.data.pageHide) {
            _this.initHeight();
            _this.setData({'pageHide':false});
            _this.getWaitAuditList(_this.data.projectId, 1)
        }else if(_this.data.auditState == 1){
            _this.setData({'pageHide':false});
        }

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.setData({'pageHide':true});
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
        var _this = this;
        wx.showNavigationBarLoading();

        if (_this.data.auditState == 0) {
            _this.getWaitAuditList(_this.data.projectId, 1, function (res) {
                //隐藏导航框
                wx.hideNavigationBarLoading();
                // 停止下拉动作
                wx.stopPullDownRefresh();
            });
        } else {
            _this.getAuditedList(_this.data.projectId, 1, function (res) {
                //隐藏导航框
                wx.hideNavigationBarLoading();
                // 停止下拉动作
                wx.stopPullDownRefresh();
            });
        }
    },
    onReachBottom: function () {
        console.log("reach bottom")
        this.lower();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    lower: function () {
        var _this = this;
        wx.showLoading({
            title: '玩命加载中',
        });

        if (_this.data.auditState == 0) {
            var page = _this.data.page + 1;
            _this.getWaitAuditList(_this.data.projectId, page, function (res) {
                wx.hideLoading();
            });
        } else {
            var page = _this.data.page2 + 1;
            _this.getAuditedList(_this.data.projectId, page, function (res) {
                wx.hideLoading();
            });
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return app.data.shareMenu;
    },
    //滑动切换
    swiperTab: function (e) {
        var _this = this;
        _this.setData({
            auditState: e.detail.current
        });
        if (_this.data.auditState == 0) {
            _this.getWaitAuditList(_this.data.projectId, 1, function (res) {
            });
        } else {
            _this.getAuditedList(_this.data.projectId, 1, function (res) {
            });
        }
    },
    //点击切换
    clickTab: function (e) {
        var _this = this;
        if (this.data.auditState === e.target.dataset.current) {
            return false;
        } else {
            console.log(e.target.dataset);
            _this.setData({
                auditState: e.target.dataset.current
            });
            if (_this.data.auditState == 0) {
                _this.getWaitAuditList(_this.data.projectId, 1, function (res) {
                });
            } else {
                _this.getAuditedList(_this.data.projectId, 1, function (res) {
                });
            }
        }
    }
});