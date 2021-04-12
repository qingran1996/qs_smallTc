function formatTime(timeLong) {
    var date = new Date(timeLong * 1000);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n
}

function timeLongShow(n) {
    var hour = Math.floor(n / 3600);
    var minute = Math.floor((n - hour * 3600 ) / 60);
    var second = n % 60;
    return [hour, minute, second].map(formatNumber).join(':');
}

module.exports = {
    formatTime: formatTime,
    timeLongShow: timeLongShow,
};
