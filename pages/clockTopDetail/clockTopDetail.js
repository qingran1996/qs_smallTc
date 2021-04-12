// miniprogram/pages/clock/clock.js
var amapFile = require('../../util/amap-wx.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0, //项目名称
        lat: 0,//维度
        long: 0, //经度
        userName: '', //用户
        address: '', //地址
        attachId: 0,//附件编号
        attachUrl: "",//附件地址
        tagId: 0,//上班
        tagName: '',//标签列表
        projectId: 0,
        projectName: '',//项目列表
        remark: '',//备注
        clockTime: 0,//打卡时间
        clockTimeShow: '',//打卡时间
        isApplied: 0,//是否是申请
        key: '74612345bb48e7a0f7db79bf54a731c4',
        markers: null,
        scale: 16,
        mapWidth: '',
        weather: {},
    },

    previewImage: function (e) {
        var current = e.target.dataset.src;
        console.log(e);
        var imgalist = [];
        imgalist.push(current);
        wx.previewImage({
            current: current, // 当前显示图片的http链接
            urls: imgalist // 需要预览的图片http链接列表
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);

        var id = options.id;
        var _this = this;
        var userId = app.getLoginUserId();
        _this.initWidth();
        app.data.qs.get_clock({
            'id': id,
            success: function (res) {
                _this.setData({
                    clockTime: res.data.clock_time,
                    clockTimeShow: res.data.clock_time_show,
                    userName: res.data.user_name,
                    tagId: res.data.tag_id,
                    tagName: res.data.tag_name,
                    projectId: res.data.project_id,
                    projectName: res.data.project_name,
                    remark: res.data.remark,
                    lat: res.data.lati,
                    long: res.data.longi,
                    address: res.data.address,
                    attachId: res.data.attach_id,
                    attachUrl: res.data.attach_url,
                    isApplied: res.data.is_applied,
                    weather: res.data.weather,
                });
                _this.loadCity(res.data.lati, res.data.longi);

            }, fail: function (res) {
                app.data.qs.showErrorToast(res.msg);
            }
        });

    },

    //把当前位置的经纬度传给高德地图，调用高德API获取当前地理位置，天气情况等信息
    loadCity: function (latitude, longitude) {
        var _this = this;
        var myAmapFun = new amapFile.AMapWX({key: _this.data.key});
        myAmapFun.getRegeo({
            location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
            success: function (data) {
                console.log(data);
                var address = data[0].regeocodeData.formatted_address;
                var markers = [{
                    id: 0,
                    longitude: longitude,
                    latitude: latitude,
                    title: address,
                    iconPath: '../../images/marker.png',
                    width: 39,
                    height: 60
                }];
                _this.setData({
                    'lat': latitude,
                    'long': longitude,
                    'markers': markers,
                    'address': address,
                })
            }, fail: function (info) {
            }
        });
        // myAmapFun.getWeather({
        //     success: function (data) {
        //         _this.setData({weather: data});
        //         console.log(data); //成功回调
        //     },
        //     fail: function (info) {
        //         //失败回调 console.log(info)
        //     }
        // })
    },
    initWidth: function () {
        var _this = this;
        wx.getSystemInfo({
            success: function (res) {
                var query = wx.createSelectorQuery();
                query.select('.weui-cells').boundingClientRect(function (rect) {
                    _this.setData({
                        mapWidth: rect.width + "px",
                    })
                }).exec();
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    }
    ,

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    }
    ,

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    }
    ,

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    }
    ,

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return app.data.shareMenu;
    }
})