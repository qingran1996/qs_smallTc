// miniprogram/pages/myProjectList/myProjectList.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hidden: true,
        'list': [],
        'max': 10,
        'page': 1,
        inputVal: '',
        thispage: 1, 
        lastpage: '',
        projectList: []
    },
    tagshow:function (e) {
        console.log(e)
    },
    //左边翻页
    leftTag:function () {
        this.setData({
            page: this.data.page - 1
        })
        this.getprojectList()
    },
    //右边翻页
    rightTag:function () {
        this.setData({
            page: this.data.page + 1
        })
        this.getprojectList()
    },
    getprojectList:function () {
        let that = this
        var url = app.globalData.URL + '/project/getProListByUserId';
        var page_size = 10;
    
    
        // 请求数据
        that.setData({
          hidden: false
        });
        wx.request({
          url: url,
          method: 'POST',
          data: {
            userId: app.data.userMess.id,
            projectName: that.data.inputVal,
            pageNo: that.data.page,
            pageSize: page_size
          },
          success: function (res) {
            //console.info(that.data.list);
            var list = [];
            let data = res.data.data.content
            console.log(res.data.data)
            if (res.data.code == 0) {
              wx.showLoading({
                title: '加载中',
              })
              setTimeout(function () {
                for (let i = 0; i < data.length; i++) {
                  if (data[i] != null) {
                    list.push(data[i])
                  }
                }
                that.setData({
                    projectList: list,
                    thispage: that.data.page,
                    lastpage: res.data.data.totalPages
                });
                that.setData({
                  hidden: true
                });
                wx.hideLoading()
              }, 1000)
    
            } else {
              that.setData({
                ishidden: false,
                isload: false,
                downText: '已加载完毕',
              });
            }
    
    
          }
        });
    },
    searchinputVal: function (e) {
        // console.log(e.detail.value)
        this.setData({
            inputVal: e.detail.value
        })
    },
    // 搜索
    searchnav: function () {
        console.log(this.data.inputVal)
        this.setData({
            page: 1
        })
        this.getprojectList()
    },
    showDetail: function (e) {

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getprojectList()
        var _this = this;
        app.data.qs.my_project_list({
            success: function (res) {
                _this.setData({
                    list: res.data.list
                })
            }
        })
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({
                    searchheight: res.windowHeight - 106
                });
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
        wx.showNavigationBarLoading();
        var _this = this;
        app.data.qs.my_project_list({
            'page': 1,
            success: function (res) {
                _this.setData({
                    list: res.data.list
                });
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
        wx.showLoading({
            title: '玩命加载中',
        });
        var _this = this;
        _this.data.page = _this.data.page + 1;
        app.data.qs.my_project_list({
            'page': _this.data.page,
            success: function (res) {
                if (res.data.list.length > 1) {
                    _this.setData({
                        list: res.data.list
                    });
                }
                // 回调函数
                var moment_list = _this.data.list;

                for (var i = 0; i < res.data.list.length; i++) {
                    moment_list.push(res.data.list[i]);
                }
                // 设置数据
                _this.setData({
                    list: moment_list
                });
                // 隐藏加载框
                wx.hideLoading();
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return app.data.shareMenu;
    }
})