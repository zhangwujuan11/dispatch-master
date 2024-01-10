// var HOST = "https://edows.txsofts.com/api/";
// var WebHost = "http://www.txsofts.com/dispatch/"
//var HOST ="http://192.168.199.220:8080/api/";

//var HOST ="https://operation.edows.cn/api/";
var HOST ="https://api.edows.cn/api/";  //正式环境
var WebHost ="https://dispatch.edows.cn/"

var Service = {
    /**
     * 用户登录接口
     * option 请求方式（post或者get）
     * params 请求参数
     * callback 回调   下面接口这三个参数的意义相同
     */
    login: function (option, params, callback) {
        var url = HOST + "member/login";
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 用户登出接口
     */
    logout: function (option, params, callback) {
        var url = HOST + "member/logout?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 微信授权API
     */
    autoSignature: function (option, params, callback) {
        var url = HOST + "wx/autoSignature";
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 微信授权登录
     */
    wxOauth: function (option, params, callback) {
        var url = HOST + "wx/oauth";
        this.commonMethod(url, option, params, callback);
    },
    /**
         * 优秀门店
         */
    getExcellentShopInfo: function (option, params, callback) {
        var url = HOST + "activities/excellentShopInfo";
        this.commonMethod(url, option, params, callback);
    },
    /**
      * 优秀门店详情
      */
    getExcellentShopList: function (option, params, callback) {
        var url = HOST + "activities/excellentShopList";
        this.commonMethod(url, option, params, callback);
    },

    // /**
    //  * ETC读取行驶证信息
    //  */
    // readDriveLicensePartner: function(option, params, callback) {
    //     var url = HOST + "partner/readDriveLicense?openId=" +( window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : '') ;
    //     this.commonMethod(url, option, params, callback);
    // },

    // 操作提示
    showTip: function (msg, url) {
        //console.log("url is "+ url) ;
        msg = msg || '出错啦，请稍后再试～';
        $('#tip-mes').html(msg);
        if (url) {
            $('#tip-box').show().delay(2000).hide(0);
            setTimeout(function () {
                window.location.href = url;
            }, 1000);
        } else {
            $('#tip-box').show().delay(2000).hide(0);
        }
    },
    commonMethod: function (url, option, params, callback) {
        fn.showLoading();
        $.ajax({
            url: url,
            type: option,
            data: params,
            contentType: "application/json;charset-UTF-8",
            dataType: "json",
            headers: { 'token': userInfo ? userInfo.token : "" },
        })
            .done(function (data) {
                if (data.code == 200) {
                    fn.closeLoading();
                    callback(data);
                } else if (data.code == 401) {
                    fn.closeLoading();
                    //跳转登录页面
                    setTimeout(function () {
                        console.log(">>>>>>" + window.location.href);
                        //window.localStorage.clear();
                        window.localStorage.setItem("userInfo", "");
                        window.location.href = "login.html?returnUrl=" + window.location.href;
                    }, 100);
                } else if (data.code == 406) {
                    fn.closeLoading();
                    //跳转登录页面
                    setTimeout(function () {
                        console.log(">>>>>>" + window.location.href);
                        //window.localStorage.clear();
                        window.localStorage.setItem("userInfo", "");
                        window.location.href = "login.html?returnUrl=" + window.location.href;
                    }, 100);
                } else {
                    fn.closeLoading();
                    callback(data);
                    fn.showTip(data.message);
                }
            })

    }
};
$(function () {
    // alert(window.innerHeight)
    fn.watermark({
        watermark_txt: '易道大咖'
    })
    var temp_url = decodeURI(window.location.href),
        tempJson = fn.unEscapeToJson(temp_url);
    var code = tempJson.code ? tempJson.code : '';
    //window.localStorage.setItem("openId", "oO8Dv01Y4SE7r9nLrLJ8U-el7KzD");
    // 微信登录授权开始
    if (window.localStorage.getItem("openId")) {

    } else {
        if (code) {
            var params = { code: code };
            console.log(params)

            $.ajax({
                    url: HOST + "wx/oauth",
                    type: "GET",
                    data: params,
                    contentType: "application/json;charset-UTF-8",
                    dataType: "json"
                })
                .done(function(data) {
                    console.log(data)
                    if (data.code == 200) {
                        window.localStorage.setItem("openId", data.data.openId);
                    } else {
                        //fn.showTip(data.message);
                        window.location.href = "wxOath.html?redirectUrl=" + window.location.href;
                    }
                })

        } else {
            window.location.href = "wxOath.html?redirectUrl=" + window.location.href;
        }
    }
    // 微信登录授权结束
});