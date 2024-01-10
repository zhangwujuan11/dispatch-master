var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var userInfo="";

//const linkTo = "index.html";
if (window.localStorage) {
    userInfo = window.localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : "";

} else {
    userInfo = JSON.parse(Cookie.read("userInfo")) ? JSON.parse(Cookie.read("userInfo")) : "";
}


var data = {
    saleInfo: {}
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {

        //订单详情数据
        getOrderSaleDetail() {
            var _self = this;
            var params = {
                orderSn: tempJson.orderId ? tempJson.orderId : "",
                openId : window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "",
                token : userInfo ? userInfo.token : ''
            }
            Service.getOrderSaleDetail('GET', params, (function callback(data) {
                console.log("=====数据====：", data)
                if (data.code == 200) {
                    _self.saleInfo = data.data;
                    _self.saleInfo.saleDate = fn.formatTime(_self.saleInfo.saleDate, 'Y-M-D')
                }
            }))
        },
        //生成二维码
        genCode() {
            var orderSn = tempJson.orderId ? tempJson.orderId : "";
            if(orderSn){
                window.location.href= "saleCode.html?orderId=" + orderSn;
            }

        },
        //转化utf8
        toUtf8(str) {
            var out, i, len, c;
            out = "";
            len = str.length;
            for (i = 0; i < len; i++) {
                c = str.charCodeAt(i);
                if ((c >= 0x0001) && (c <= 0x007F)) {
                    out += str.charAt(i);
                } else if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                    out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                } else {
                    out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
            }
            return out;
        },
        //跳转到温馨提示页
        toSaleWarePage(){
            window.location.href= "saleWarePage.html";
        }
    },
    mounted: function() {
        var _self = this;

        this.getOrderSaleDetail();
        //alert(tempJson.type ? tempJson.orderId : "" )
        //alert(window.location.href)
        //_self.year = fn.formatTime(new Date(), 'Y-M-D');
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})