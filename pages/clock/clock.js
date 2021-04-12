// miniprogram/pages/clock/clock.js
var amapFile = require('../../util/amap-wx.js');
var md5Util = require('../../util/md5.js');
var changeTime = require('../../util/changeTime.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0, //项目名称
        lat: 0,//维度
        long: 0, //经度
        address: '', //地址
        attachId: 0,//附件编号
        attachUrl: "",//附件地址
        tagIndex: 0,//上班
        tagName: '',//上班
        tagList: [],//标签列表
        projectIndex: 0,
        projectList: [],//项目列表
        remark: '',//备注
        clockTime: 0,//打卡时间
        clockTimeShow: '',//打卡时间
        isApplied: 0,//是否是申请
        key: '74612345bb48e7a0f7db79bf54a731c4',
        markers: null,
        scale: 16,
        weather: {},
        mapWidth: ""
    },
    bindRemarkInput: function (e) {
        this.setData({
            remark: e.detail.value
        });
    },

    bindProjectChange: function (e) {
        this.setData({
            'projectIndex': e.detail.value
        });
    },

    bindTagChange: function (e) {
        console.log('checkExpatriated，携带值为', e.detail.value);
        this.setData({
            tagIndex: e.detail.value
        });
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
    chooseImage: function (e) {
        var _this = this;
        if (_this.data.projectList[_this.data.projectIndex] == null) {
            return app.data.qs.showErrorToast("请选择项目");
        }
        var projectId = _this.data.projectList[_this.data.projectIndex]['id'];
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: function (res) {
                app.data.qs.upload_worktime_attach({
                    fname: res.tempFilePaths[0]
                    , attach_key: _this.data.flowRunKey, project_id: projectId,
                    success: function (res) {
                        _this.setData({
                            'attachUrl': res.data.url,
                            'attachId': res.data.attach_id,
                        })
                    }
                })
            }
        })
    },

    formSubmit: function () {
        var _this = this;
        _this.loadInfo(function(){
            if (_this.data.tagList[_this.data.tagIndex] == null) {
                        return app.data.qs.showErrorToast("请选择打卡标签");
                    }
                    if (_this.data.projectList[_this.data.projectIndex] == null) {
                        return app.data.qs.showErrorToast("请选择项目");
                    }
                    var tagId = _this.data.tagList[_this.data.tagIndex]['id'];
                    var projectId = _this.data.projectList[_this.data.projectIndex]['id'];
                    app.data.qs.submit_clock({
                        clockTime: parseInt(_this.data.clockTime),
                        tagId: tagId,
                        projectId: projectId,
                        remark: _this.data.remark,
                        lat: _this.data.lat,
                        long: _this.data.long,
                        address: _this.data.address,
                        attachId: _this.data.attachId,
                        isApplied: _this.data.isApplied,
                        weather: _this.data.weather,
                        success: function (res) {
                            console.log(res);
                            app.data.qs.showSuccessToast(res.msg);
                            wx.redirectTo({
                                url: '../clockDetail/clockDetail?id=' + res.data.id,
                            });

                        },
                        fail: function (res) {
                            app.data.qs.show_modal("提示", res.msg, false);
                            if (res.code == 601) {
                                wx.redirectTo({
                                    url: '../clockDetail/clockDetail?id=' + res.data.id,
                                });
                            }
                        }
                    })
        });
       
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _this = this;
        _this.initWidth();
        var userId = app.getLoginUserId();
        _this.setData({
            flowRunKey: md5Util.hex_md5(userId + ":" + new Date().getTime())
        });
        _this.loadInfo();
        app.data.qs.get_clock_tags({
            success: function (res) {

                if (res.data.length > 0) {
                    _this.setData({
                        'tagList': res.data,
                        'tagName': res.data[0]['name'],
                    })
                }

            }, fail: function (res) {
                if (res.code == 601) {
                    wx.showLoading({
                        title: res.msg,
                    });
                    setTimeout(function () {
                        wx.redirectTo({
                            url: '../clockDetail/clockDetail?id=' + res.data.id,
                        });
                    }, 3000);
                }
            }
        });
        app.data.qs.my_project_list_for_choose({
            success: function (res) {
                _this.setData({
                    'projectList': res.data.list,
                })

            }
        });
        var i = setInterval(function () {
            var clockTime = new Date().getTime() / 1000;
            _this.setData({
                clockTimeShow: changeTime.formatTime(clockTime),
                clockTime: clockTime
            });
        }, 1000)

    },

//获取当前位置的经纬度
    loadInfo: function (func) {
        var _this = this;
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function (res) {
                var latitude = res.latitude;//维度
                var longitude = res.longitude;//经度
                console.log(res);
                // var address = res.address;//地址


                _this.loadCity(latitude, longitude, func);
            }
        })
    }, //把当前位置的经纬度传给高德地图，调用高德API获取当前地理位置，天气情况等信息
    loadCity: function (latitude, longitude,func) {
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
                    width: 22,
                    height: 32
                }];
                _this.setData({
                    'lat': latitude,
                    'long': longitude,
                    'markers': markers,
                    'address': address,
                })
                if(func){
                    func()
                }
            }, fail: function (info) {
            }
        });
        myAmapFun.getWeather({
            success: function (data) {
                _this.setData({weather: data});
                console.log(data); //成功回调
            },
            fail: function (info) {
                //失败回调 console.log(info)
            }
        })
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