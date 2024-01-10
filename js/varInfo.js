
var userInfo="";

var serDomaine = 'http://dispatch.edows.cn/'; //QQ腾讯地图返回地址
//const linkTo = "index.html";
if (window.localStorage) {
    userInfo = window.localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : "";

} else {
    userInfo = JSON.parse(Cookie.read("userInfo")) ? JSON.parse(Cookie.read("userInfo")) : "";
}

// console.log("用户信息：", userInfo)

if (!userInfo) {
    window.location.href="login.html?returnUrl=" + window.location.href ;
}

