var app = getApp()
Page({
    data: {
        routers: [],
    },
    onLoad: function () {
        var _this = this;
        wx.showLoading({
            title: '加载中...',
        })
        var time = setInterval(function () {
            if (app.data != null && app.data.routers != null && app.data.routers.length > 0) {
                console.log(app.data.routers);
                let showdata = []
                let data = app.data.routers
                for(let i=0;i<data.length;i++) {
                    if(data[i].pid==2) {
                        showdata.push(data[i])
                    }
                }
                _this.setData({
                    'routers': showdata
                });
                wx.hideLoading();
                clearInterval(time);
            }
        }, 1000);


    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        var _this = this;
        wx.showLoading({
            title: '加载中...',
        })
        var time = setInterval(function () {
            if (app.data != null && app.data.routers != null && app.data.routers.length > 0) {
                console.log(app.data.routers);
                _this.setData({
                    'routers': app.data.routers
                });
                wx.hideLoading();
                clearInterval(time);
            }
        }, 1000);
    },
})