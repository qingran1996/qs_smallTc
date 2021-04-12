var Ecg = {
    myUploadImg: 'http://timer.yhelper.com:10003/static/',
    evn: 'prepare',
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
            return 'http://192.168.10.151:94';
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
                    _this.setData({'app_token': res.data.app_token});
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }, function () {
            }, wx
        )
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
    login: function (obj) {
        var _this = this;
        var loginMess = {
            username: obj.user_name,
            openid: obj.openid,
            password: obj.password,
        };
        _this.http_req("/v1/auth/login", loginMess, {
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    _this.setData({'app_token': res.data.app_token});
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    auto_login: function (obj) {
        var _this = this;
        _this.http_req("/v1/auth/auto-login", {
                openid: obj.openid,
            }, {
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    _this.setData({'app_token': res.data.app_token});
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    send_verify_code: function (obj) {
        var _this = this;
        _this.http_req("/v1/auth/send-verify-code", {
                user_name: obj.user_name,
            }, {
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },

    /**
     *
     * @param obj
     */
    create_project: function (obj) {
        var _this = this;
        console.log(obj);
        _this.http_req("/v1/project/start", {
                name: obj.name,
                type_id: obj.type_id,
                desc: obj.desc,
                start_date: obj.start_date,
                is_expatriated: obj.is_expatriated,
                project_manager_user_id: obj.project_manager_user_id
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },

    search_user: function (obj) {
        var _this = this;
        _this.http_req("/v1/user/search", {name: obj.name}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    add_project_user: function (obj) {
        var _this = this;
        console.log(obj);
        _this.http_req("/v1/project/add-project-user", {
                user_id: obj.user_id,
                project_id: obj.project_id
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    delete_project_user: function (obj) {
        var _this = this;
        console.log(obj);
        _this.http_req("/v1/project/delete-project-user", {
                user_id: obj.user_id,
                project_id: obj.project_id
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    get_project_manager_list: function (obj) {
        var _this = this;
        console.log(obj);
        _this.http_req("/v1/user/get-manager-list", {}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },

    get_project_aggregate_list: function (obj) {
        var _this = this;
        console.log(obj);
        _this.http_req("/v1/project/get-project-aggregate-list", {}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    update_project: function (obj) {
        var _this = this;
        console.log(obj);
        _this.http_req("/v1/project/update", {
                id: obj.id,
                name: obj.name,
                type_id: obj.type_id,
                desc: obj.desc,
                start_date: obj.start_date,
                is_expatriated: obj.is_expatriated,
                project_manager_user_id: obj.project_manager_user_id
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },

    /**
     *
     * @param obj
     */
    delete_project: function (obj) {
        var _this = this;
        console.log(obj);
        _this.http_req("/v1/project/delete", {
                id: obj.id
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    get_project_detail: function (obj) {
        var _this = this;
        console.log(obj);
        _this.http_req("/v1/project/get", {
                project_id: obj.project_id
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    get_project_detail_with_manager: function (obj) {
        var _this = this;
        console.log(obj);
        _this.http_req("/v1/project/get-with-manager", {
                project_id: obj.project_id
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    join_project: function (obj) {
        var _this = this;
        console.log(obj);
        _this.http_req("/v1/project/join", {
                project_id: obj.project_id
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    my_project_list_for_choose: function (obj) {
        var _this = this;
        console.log(obj);
        var max = obj.max == undefined ? 10 : obj.max;
        var page = obj.page == undefined ? 1 : obj.page;
        _this.http_req("/v1/project/my-project-list2", {
                max: max,
                page: page
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    my_project_list: function (obj) {
        var _this = this;
        console.log(obj);
        var max = obj.max == undefined ? 10 : obj.max;
        var page = obj.page == undefined ? 1 : obj.page;
        _this.http_req("/v1/project/my-project-list", {
                max: max,
                page: page
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    get_project_usr_list: function (obj) {
        var _this = this;
        _this.http_req("/v1/project/get-project-user-list", {project_id: obj.project_id}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    start_project_list: function (obj) {
        var _this = this;
        _this.http_req("/v1/project/start-project-list", {}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    master_project_list: function (obj) {
        var _this = this;
        _this.http_req("/v1/project/master-project-list", {}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },

    /**
     *
     * @param obj
     */
    get_audits: function (obj) {
        var _this = this;
        var max = obj.max ? obj.max : 10;
        var page = obj.page ? obj.page : 1;
        _this.http_req("/v1/worktime/get-audits", {
                project_id: obj.project_id,
                audit_state: obj.audit_state,
                max: max,
                page: page,
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    get_wait_audits: function (obj) {
        var _this = this;
        _this.http_req("/v1/worktime/get-wait-audits", {
                project_id: obj.project_id
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },

    /**
     *
     * @param obj
     */
    get_wait_hr_audits: function (obj) {
        var _this = this;
        _this.http_req("/v1/worktime/get-wait-hr-audits", {}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    get_hr_audits: function (obj) {
        var _this = this;
        var max = obj.max ? obj.max : 15;
        var page = obj.page ? obj.page : 1;
        _this.http_req("/v1/worktime/get-hr-audits", {
                audit_state: obj.audit_state,
                max: max,
                page: page,
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },

    /**
     *
     * @param obj
     */
    get_audit_worktime: function (obj) {
        var _this = this;
        _this.http_req("/v1/worktime/get-audit-worktime", {
                flow_run_audit_id: obj.flow_run_audit_id
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },

    /**
     *
     * @param obj
     */
    audit: function (obj) {
        var _this = this;
        var audit_content = obj.audit_content != null ? obj.audit_content : "";
        var audit_state = obj.audit_state;
        if (audit_content === "" && audit_state == 2) {
            console.log(obj);
            return _this.wx.showToast({'title': '审核意见不能为空'})
        }
        _this.http_req("/v1/worktime/audit", {
                flow_run_audit_id: obj.flow_run_audit_id,
                audit_content: audit_content,
                audit_state: audit_state
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    all_project_list: function (obj) {
        var _this = this;
        console.log(obj);
        var max = obj.max == undefined ? 10 : obj.max;
        var page = obj.page == undefined ? 1 : obj.page;
        _this.http_req("/v1/project/all-project-list", {
                max: max,
                page: page
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    get_work_type_list: function (obj) {
        var _this = this;
        console.log(obj);
        _this.http_req("/v1/worktype/list", {}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    get_leave_type_list: function (obj) {
        var _this = this;
        console.log(obj);
        _this.http_req("/v1/worktype/list-leave-type", {}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    get_worktime_list: function (obj) {
        var _this = this;
        console.log(obj);
        var from_date = obj.from_date;
        var to_date = obj.to_date;
        _this.http_req("/v1/worktime/list", {'from_date': from_date, 'to_date': to_date}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    add_worktimes: function (obj) {
        var _this = this;
        console.log(obj);
        var date_list = obj.date_list;
        var duration = obj.duration;
        var project_id = obj.project_id;
        var work_type = obj.work_type;
        _this.http_req("/v1/worktime/batch-set", {
                date_list: date_list,
                duration: duration,
                project_id: obj.project_id,
                work_type: obj.work_type
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    delete_worktimes: function (obj) {
        var _this = this;
        console.log(obj);
        var date = obj.date / 1000;
        var work_type = obj.work_type;
        _this.http_req("/v1/worktime/delete", {
                date: date,
                work_type: work_type,
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    submit_worktimes: function (obj) {
        var _this = this;
        var from_date = obj.from_date;
        var to_date = obj.to_date;
        _this.http_req("/v1/worktime/submit", {
                from_date: from_date,
                to_date: to_date,
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    rollback_worktimes: function (obj) {
        var _this = this;
        var flow_run_id = obj.flow_run_id;
        _this.http_req("/v1/worktime/rollback", {
                flow_run_id: flow_run_id,
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    get_login_user: function (obj) {
        var _this = this;
        _this.http_req("/v1/auth/get", {}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }, function (res) {
                if (_this.is_function(obj.fail)) {
                    obj.success(res);
                }
            }
        )
    },
    upload_worktime_attach: function (obj) {
        var _this = this;
        _this.http_upload_req("/v1/attach/upload-worktime-attach", obj.fname, {
                attach_key: obj.attach_key,
                project_id: obj.project_id
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }, function (res) {
                if (_this.is_function(obj.fail)) {
                    obj.success(res);
                }
            }
        )
    },


    submit_leavetime: function (obj) {
        var _this = this;
        console.log(obj);
        var from_date = obj.from_date;
        var to_date = obj.to_date;
        var duration = obj.duration;
        var project_id = obj.project_id;
        var leave_type = obj.leave_type;
        var reason = obj.reason;
        var flow_run_key = obj.flow_run_key;
        var attach_id = obj.attach_id;
        _this.http_req("/v1/leavetime/submit", {
                leave_type: leave_type,
                from_date: obj.from_date,
                to_date: obj.to_date,
                duration: duration,
                reason: reason,
                project_id: project_id,
                flow_run_key: obj.flow_run_key,
                attach_id: obj.attach_id
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    audit_leavetime: function (obj) {
        var _this = this;
        var audit_content = obj.audit_content != null ? obj.audit_content : "";
        var audit_state = obj.audit_state;
        if (audit_content === "" && audit_state == 2) {
            console.log(obj);
            return _this.wx.showToast({'title': '审核意见不能为空'})
        }
        _this.http_req("/v1/leavetime/audit", {
                flow_run_audit_id: obj.flow_run_audit_id,
                audit_content: audit_content,
                audit_state: audit_state
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    my_leavetimes: function (obj) {
        var _this = this;
        var max = obj.max == undefined ? 10 : obj.max;
        var page = obj.page == undefined ? 1 : obj.page;
        var audit_state = obj.audit_state == undefined ? 0 : obj.audit_state;
        _this.http_req("/v1/leavetime/list", {max: max, page: page, audit_state: audit_state}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    get_leavetime: function (obj) {
        var _this = this;
        _this.http_req("/v1/leavetime/get", {flow_run_id: obj.flow_run_id}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    rollback_leavetime: function (obj) {
        var _this = this;
        var flow_run_id = obj.flow_run_id;
        _this.http_req("/v1/leavetime/rollback", {
                flow_run_id: flow_run_id,
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    get_audit_leavetime: function (obj) {
        var _this = this;
        _this.http_req("/v1/leavetime/get-by-audit-id", {flow_run_audit_id: obj.flow_run_audit_id}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    get_leavetime_audits: function (obj) {
        var _this = this;
        var max = obj.max ? obj.max : 15;
        var page = obj.page ? obj.page : 1;
        _this.http_req("/v1/leavetime/get-audits", {
                audit_state: obj.audit_state,
                max: max,
                page: page,
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },

    get_audit_clock: function (obj) {
        var _this = this;
        _this.http_req("/v1/clockpatch/get-by-audit-id", {flow_run_audit_id: obj.flow_run_audit_id}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    get_clock_flow: function (obj) {
        var _this = this;
        _this.http_req("/v1/clockpatch/get", {clock_id: obj.clock_id}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    rollback_clock: function (obj) {
        var _this = this;
        var flow_run_id = obj.flow_run_id;
        _this.http_req("/v1/clockpatch/rollback", {
                flow_run_id: flow_run_id,
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    audit_clock: function (obj) {
        var _this = this;
        var audit_content = obj.audit_content != null ? obj.audit_content : "";
        var audit_state = obj.audit_state;
        if (audit_content === "" && audit_state == 2) {
            console.log(obj);
            return _this.wx.showToast({'title': '审核意见不能为空'})
        }
        _this.http_req("/v1/clockpatch/audit", {
                flow_run_audit_id: obj.flow_run_audit_id,
                audit_content: audit_content,
                audit_state: audit_state
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     *
     * @param obj
     */
    get_clock_audits: function (obj) {
        var _this = this;
        var max = obj.max ? obj.max : 15;
        var page = obj.page ? obj.page : 1;
        _this.http_req("/v1/clockpatch/get-audits", {
                audit_state: obj.audit_state,
                max: max,
                page: page,
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    get_clock_tags: function (obj) {
        var _this = this;
        _this.http_req("/v1/clock/get-tag-list", {}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    get_all_clock_tags: function (obj) {
        var _this = this;
        _this.http_req("/v1/clock/get-all-tag-list", {}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    get_clock_list: function (obj) {
        var _this = this;
        console.log(obj);
        var from_date = obj.from_date;
        var to_date = obj.to_date;
        _this.http_req("/v1/clock/list", {'from_date': from_date, 'to_date': to_date}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    get_clock_tops: function (obj) {
        var _this = this;
        console.log(obj);
        var clock_date = obj.clock_date;
        _this.http_req("/v1/clock/top", {'clock_date': clock_date}, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    submit_clock: function (obj) {
        var _this = this;
        var data = {};
        var clock_time = obj.clockTime ? obj.clockTime : "";
        var long = obj.long ? obj.long : "";
        var lat = obj.lat ? obj.lat : "";
        var address = obj.address ? obj.address : "";
        var attach_id = obj.attachId ? obj.attachId : "";
        var tag_id = obj.tagId ? obj.tagId : "";
        var project_id = obj.projectId ? obj.projectId : "";
        var remark = obj.remark ? obj.remark : "";
        var is_applied = obj.is_applied ? obj.is_applied : "";
        var weather = obj.weather ? JSON.stringify(obj.weather) : "";
        _this.http_req("/v1/clock/submit", {
                clock_time: clock_time,
                long: long,
                lat: lat,
                attach_id: attach_id,
                address: address,
                tag_id: tag_id,
                project_id: project_id,
                remark: remark,
                is_applied: is_applied,
                weather: weather,
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    get_clock: function (obj) {
        var _this = this;
        var data = {};
        var id = obj.id;
        _this.http_req("/v1/clock/get", {
                id: id,
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    submit_apply_clock: function (obj) {
        var _this = this;
        var data = {};
        var clock_time = obj.clockTime ? obj.clockTime : "";
        var tag_id = obj.tagId ? obj.tagId : "";
        var project_id = obj.projectId ? obj.projectId : "";
        var remark = obj.remark ? obj.remark : "";
        _this.http_req("/v1/clockpatch/submit", {
                clock_time: clock_time,
                tag_id: tag_id,
                project_id: project_id,
                remark: remark,
            }, {
                app_token: _this.app_token,
                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }
        )
    },
    /**
     * 用户注册
     *
     * @obj
     * @obj.user_name 用户账号
     * @obj.password  用户密钥
     * @obj.sex integer 性别 0 未知，1男，2女
     * @obj.age integer 年龄（长度3）
     * @obj.phone  手机号（长度13）
     * @obj.email  邮箱（长度100）
     *
     * @return {code:, errMsg:, data:{}}
     *        code:0表示成功
     *        code:90000 系统繁忙
     *        code:90001 表示机构认证服务token过期或无效
     *        code:93011用户名已存在
     *        =============================
     *        errMsg:中文提示信息
     */
    register: function (obj) {
        var _this = this;
        _this.http_req("/v1/user/register", {
                user_name: obj.user_name,
                password: obj.password,
                user_fullname: obj.user_fullname,
                sex: obj.sex,
                age: obj.age,
                openid: obj.openid,
                code: obj.code,
            }, {

                app_type: _this.app_type,
                app_version: _this.app_version
            }, function (res) {
                if (_this.is_success(res)) {
                    if (_this.is_function(obj.success)) {
                        obj.success(res);
                    }
                } else {
                    if (_this.is_function(obj.fail)) {
                        obj.fail(res);
                    }
                }
            }, function (res) {
                if (_this.is_function(obj.fail)) {
                    obj.success(res);
                }
            }
        )
    },


    wx_login: function (obj) {
        var _this = this;
        _this.wx.login({
                success: function (res) {
                    if (res.code) {
                        _this.get_info_by_code(obj, res.code)
                    } else {
                        if (_this.is_function(obj.fail)) {
                            obj.fail(res);
                        }
                    }
                },
                fail: function (res) {
                    obj.fail(res);
                }
            }
        )
    },
    get_info_by_code: function (obj, code) {
        var _this = this;
        _this.http_req("/v1/auth/get-open-info", {'code': code}, {
            app_token: _this.app_token
        }, function (data) {
            if (_this.is_success(data)) {
                if (_this.is_function(obj.success)) {
                    obj.success(data);
                }
            } else {
                if (_this.is_function(obj.fail)) {
                    obj.fail(data);
                }
            }
        }, function (data) {
            if (_this.is_function(obj.fail)) {
                obj.fail(data);
            }
        })
    },

    is_success: function (res) {
        return res.code == 200;
    },
    is_function: function (o) {
        return this.is(o, 'function');
    },
    is: function (o, type) {
        var isnan = {"NaN": 1, "Infinity": 1, "-Infinity": 1};
        type = type.toLowerCase();

        // {"NaN": 1, "Infinity": 1, "-Infinity": 1}.hasOwnProperty(2)   -> false
        // {"NaN": 1, "Infinity": 1, "-Infinity": 1}.hasOwnProperty(NaN) -> true
        if (type == "finite") {
            return !isnan["hasOwnProperty"](+o);
        }
        if (type == "array") {
            return o instanceof Array;
        }
        return (type == "null" && o === null) ||
            // is(undefined,'undefined')
            (type == typeof o && o !== null) ||
            // Object(Object) == Object -> true
            // Object({}) == {}         -> false
            (type == "object" && o === Object(o)) ||
            (type == "array" && Array.isArray && Array.isArray(o)) ||
            Object.prototype.toString.call(o).slice(8, -1).toLowerCase() == type;
    },
    log: function () {//打印日至
        var _this = this;
        if (_this.debug) {
            console.log(arguments);
        }
    },
    http_req: function (method, data, header, success, fail, wx) {
        var _this = this;
        var url = _this.get_server_url() + method;
        if (header != undefined) {
            header['content-type'] = 'application/x-www-form-urlencoded';
        } else {
            header = {'content-type': 'application/x-www-form-urlencoded'};
        }
        var nwx = _this.wx;
        if (nwx == undefined && wx != undefined) {
            nwx = wx;
        }
        nwx.request({
            url: url,
            data: data,
            header: header,
            method: 'POST',
            dataType: 'json',
            success: function (res) {
                if (_this.is_function(success)) {
                    success(res.data);
                }
            },
            fail: function (res) {
                _this.log(data);
                if (res.code == -1) {
                    nwx.redirectTo({
                        url: '../login/login'
                    });
                }
                if (_this.is_function(fail)) {
                    fail(res.data);
                }
            }
        })
    },
    http_upload_req: function (method, filePath, data, header, success, fail) {
        var _this = this;
        var url = _this.get_server_url() + method;
        if (header != undefined) {
            header['content-type'] = 'multipart/form-data';
        } else {
            header = {'content-type': 'multipart/form-data'};
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
            }
        )
    },
    showSuccessToast: function (msg) {
        var _this = this;
        _this.wx.showToast({
                'title': msg,
                'icon': "success",
            }
        )
    },
    uuid: function () {
        //获取uuid
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

}

module.exports = Ecg;