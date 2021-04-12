var Ecg = {
  evn: 'test',
  wx: undefined,
  debug: false,
  fs: undefined,
  app_token: "",
  app_type: "Timer",
  app_version: "1.0",
  data_list: [],
  phone_info: {},
  init_phone_info: function () {
    var _this = this;
    _this.wx.getSystemInfo({
      success: function (res) {
        _this.phone_info.phone_model = res.model;
        _this.phone_info.terminal_platform = res.platform;
      }
    })
  },
  init: function (evn, wx) {
    var _this = this;
    _this.wx = wx;
    if (evn != 'test' && evn != 'prepare' && evn != 'prod') {
      _this.show_modal('提示', 'evn环境只能为test（测试）、prepare（预发布）、prod（线上）', false);
    } else {
      _this.evn = evn;
    }
    _this.fs = _this.wx.getFileSystemManager();
    _this.init_phone_info();
  },
  set_debug: function (flag) {
    this.debug = flag;
  },
  get_server_url: function () {
    var _this = this;
    if (_this.evn == 'prod') {
      return 'https://timer.yhelper.com:11443';
    } else if (_this.evn == 'prepare') {
      return 'https://timer.yhelper.com:11443';
    } else {
      return 'http://192.168.110.236:10003';
      // return 'http://192.168.110.217:94';
    }
  },
  setData: function (obj) {
    var _this = this;
    for (var i in obj) {
      _this[i] = obj[i];
    }
  },

  show_modal: function (title, content, show_cancel) {
    var _this = this;
    _this.wx.showModal({
      title: title,
      content: content,
      showCancel: show_cancel
    })
  },
  resovleWeekList: function (weekDay) {
    var weekShowList = [];
    for (var i = 0; i < weekDay.weekList.length; i++) {
      weekShowList.push({
        'id': i,
        'name': weekDay.weekList[i],
        'date': weekDay.formatMonth(weekDay.dateList[i]),
        'dateInt': weekDay.dateList[i],
        'date_show': weekDay.weekList[i] + "\n" + weekDay.formatDay(weekDay.dateList[i]),
      })
    }
    return weekShowList;
  },
  resovleWeekList2: function (weekDay) {
    var weekShowList = [];
    for (var i = 0; i < weekDay.weekList.length; i++) {
      weekShowList.push({
        'id': i,
        'name': weekDay.weekList[i],
        'date': weekDay.formatMonth(weekDay.dateList[i]),
        'date_show': weekDay.weekList[i] + "(" + weekDay.formatDay(weekDay.dateList[i]) + ")",
      })
    }
    return weekShowList;
  },
  /**
   * 机构认证服务
   * @param obj
   * @obj.app_id 第三方客户端密钥
   * @obj.app_secret 第三方客户端密钥
   * @obj.xcx_app_id  第三方小程序appId
   * @obj.success
   * @obj.success.callback.data
   * {code:, errMsg:, data:{app_token:'', expire_time:3600}}
   *        app_token 机构认证token
   *        code:0表示成功
   *        code:90000 系统繁忙
   *        code:92001 表示机构认证失败
   *        ========================================
   *        errMsg:中文提示信息
   *  @obj.fail
   *  @obj.fail.callback.data
   *  {code:, errMsg:}
   */
  auth: function (obj, wx) {
    var _this = this;
    _this.http_req("/v1/sdk/auth", {
      app_id: obj.client_id,
      app_secret: obj.client_secret,
      app_package_name: obj.app_package_name
    }, {
      app_type: _this.app_type,
      app_version: _this.app_version,
    }, function (res) {
      if (_this.is_success(res)) {
        _this.setData({
          'app_token': res.data.app_token
        });
        if (_this.is_function(obj.success)) {
          obj.success(res);
        }
      } else {
        if (_this.is_function(obj.fail)) {
          obj.fail(res);
        }
      }
    }, function () {}, wx)
  },
  /**
   * 用户登录
   * @param obj
   * @obj.user_name 第三方用户账号（注册时输入）
   * @obj.password  第三方用户密钥（注册时输入）
   * @obj.openid  小程序账号
   * @return {code:, errMsg:, data:{app_token:}}
   * app_token 用户认证token
   *        code:0表示成功
   *        code:90000 系统繁忙
   *        code:90001 表示机构认证服务token过期或无效
   *           =============================
   *        code:93001表示用户名或密码错误
   *        code:93002表示用户已冻结
   *        errMsg:中文提示信息
   */
  is_success: function (res) {
    return res.code == 200;
  },
  is_function: function (o) {
    return this.is(o, 'function');
  },
  // 全局请求接口
  http_req: function (method, url, data, callback, errFun) {
    var _this = this;
    var newurl = _this.get_server_url() + url
    // console.log(newurl)
    wx.request({
      url: newurl,
      method: method,
      data: data,
      header: {
        'content-type': method == 'GET'?'application/json':'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res)
        callback(res);
      },
      fail: function (err) {
        errFun(res);
      }
    })

  },
  http_upload_req: function (method, filePath, data, header, success, fail) {
    var _this = this;
    var url = _this.get_server_url() + method;
    if (header != undefined) {
      header['content-type'] = 'multipart/form-data';
    } else {
      header = {
        'content-type': 'multipart/form-data'
      };
    }
    _this.wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'fname',
      formData: data,
      header: header,
      success: function (res) {
        if (_this.is_function(success)) {
          success(JSON.parse(res.data));
        }
      },
      fail: function (res) {
        _this.log(data);
        if (_this.is_function(fail)) {
          fail(JSON.parse(res));
        }
      }
    })
  },
  showErrorToast: function (msg) {
    var _this = this;
    _this.wx.showToast({
      'title': msg,
      'icon': "error",
    })
  },
  showSuccessToast: function (msg) {
    var _this = this;
    _this.wx.showToast({
      'title': msg,
      'icon': "success",
    })
  },
  uuid: function () {
    //获取uuid
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  }

}

module.exports = Ecg;