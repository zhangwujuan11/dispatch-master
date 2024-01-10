$(function() {
    window.localStorage.clear();
    window.localStorage.setItem("openId", "");
    var temp_url = decodeURI(window.location.href),
        tempJson = fn.unEscapeToJson(temp_url);

    var appId="wx01214aa68d5370c0";  //易到大咖
    // var toUrl = "http://www.txsofts.com/dispatch/index.html" //测试服务器
     var toUrl = "https://dispatch.edows.cn/index.html"; //正式服务器

    var redirect_uri = tempJson.redirectUrl ? tempJson.redirectUrl : toUrl;
    //var scope = "snsapi_base";//静默授权
    var scope = "snsapi_userinfo";

    var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + 
            appId +"&redirect_uri=" + encodeURI(redirect_uri) + 
            "&response_type=code&scope=" + scope + "&state=STATE#wechat_redirect"

    //alert(url)
    window.location.href = url;
})