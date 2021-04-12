/**
 * Created by andy on 2018/9/20.
 */
// var utils = require('./utils')

// 在 Worker 线程执行上下文会全局暴露一个 `worker` 对象，直接调用 worker.onMeesage/postMessage 即可
worker.onMessage(function (e) {
    console.log(e)
    var data=e.data;
    console.log(e)
    console.log(data)
    for(var i=0;i<data;i++){
        console.log(i)
        //计算的代码

    }

    worker.postMessage(data)
    // var times = 0;
    // var interval = setInterval(function(){
    //     var content = that.data.record_content.pop();
    //     console.log(content);
    //     if(content){
    //         console.log("请求后台");
    //         wx.request({
    //             url: "http://localhost:89/test/show", //仅为示例，并非真实的接口地址
    //             data: {
    //                 content: content
    //             },
    //             header: {
    //                 'content-type': 'text/html' // 默认值
    //             },
    //             success:function (res) {
    //                 console.log(res)
    //             }
    //         });
    //
    //     }
    //     times++;
    //     if(times>=1500 && that){
    //         clearInterval(interval);
    //         that.closeBluetoothAdapter();
    //     }
    // },20);
})