var WeekDay = {
    currentFirstDate: 0,
    beginDate: 0,
    endDate: 0,
    dateList: [],
    weekList: [],
    getTimeByTimeZone: function (d, timeZone) {
        var localTime = d.getTime();
        var localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数,这里可能是负数
        var utc = localTime + localOffset; //utc即GMT时间
        var offset = timeZone;//时区，北京市+8  美国华盛顿为 -5
        return utc + (3600000 * offset);  //本地对应的毫秒数
        // var date = new Date(localSecondTime);
        // console.log("根据本地时间得知" + timeZone + "时区的时间是 " + date.toLocaleString());
        // console.log("系统默认展示时间方式是：" + date)
    },
    getDateByTimeZone: function (d, timeZone) {
        var localTime = d.getTime();
        var localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数,这里可能是负数
        var utc = localTime + localOffset; //utc即GMT时间
        var offset = timeZone;//时区，北京市+8  美国华盛顿为 -5
        var localSecondTime = utc + (3600000 * offset);  //本地对应的毫秒数
        return new Date(localSecondTime);
        // console.log("根据本地时间得知" + timeZone + "时区的时间是 " + date.toLocaleString());
        // console.log("系统默认展示时间方式是：" + date)
    },
    formatDate: function (date) {
        var week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
        return week;
    },
    formatDay:function(dateStamp){
      var date = new Date(dateStamp);
      var day = date.getDate();
      if (day < 10) {
        day = "0" + day;
      }
      return day;
    },
    formatMonth: function (dateStamp) {
        var date = new Date(dateStamp);
     
        var month = (date.getMonth() + 1);
        var day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        return month + "-" + day
    },
    addDate: function (date, n) {
        date.setDate(date.getDate() + n);
        return date;
    },
    setDate: function (date) {
        var _this = this;
        var week = date.getDay();
        if (week == 0) {
            week = 6;
        } else {
            week = week - 1;
        }
        date = _this.addDate(date, week * -1);
        _this.currentFirstDate = new Date(date);
        var i = 0;
        for (i = 0; i < 7; i++) {
            var date = (i == 0 ? date : _this.addDate(date, 1));
            _this.dateList.push(date.getTime());
            console.log(_this.dateList);
            _this.weekList.push(_this.formatDate(date));
        }

        _this.beginDate = _this.dateList[0];
        _this.endDate = _this.dateList[6];
    },
    init: function (beginDate) {
        var _this = this;
        _this.dateList = [];
        _this.weekList = [];
        if (beginDate == null) {
            console.log(new Date().toLocaleDateString());
            beginDate = new Date(new Date().toLocaleDateString());
        } else {
            beginDate = new Date(beginDate - 0)
        }
        _this.setDate(beginDate);
    },
    next: function () {
        var _this = this;
        _this.dateList = [];
        _this.weekList = [];
        _this.setDate(_this.addDate(_this.currentFirstDate, 7))
    },
    prev: function () {
        var _this = this;
        _this.dateList = [];
        _this.weekList = [];
        _this.setDate(_this.addDate(_this.currentFirstDate, -7))
    }
};

module.exports = WeekDay;