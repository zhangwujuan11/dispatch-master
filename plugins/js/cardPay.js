var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    openId: "",
    payType: "NATIVE" //支付类型 JSAPI: 直接支付,  NATIVE：扫码支付
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //支付码链接获取
        getCode() {

            var _self = this;

            var params = {
                "ip": "",
                "openId": this.openId,
                "orderSn": tempJson.orderSn ? tempJson.orderSn : "",
                "payType": this.payType
            };
            Service.payRightCard('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                    //fn.showTip(data.data.codeUrl)
                    $("#qrCode").qrcode({
                        correctLevel: 0,
                        text: _self.toUtf8(data.data.codeUrl) //任意内容
                    });
                    document.getElementById("appContent").style.display = "block";

                }
            }))
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
        //点击返回
        goBack() {
            window.location.href = "cardOrder.html?orderSn=" + (tempJson.orderSn ? tempJson.orderSn : "");
        }
    },
    mounted: function() {
        var _self = this;
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
        this.getCode();

        //初始化vue后,显示vue模板布局
        // setTimeout(function() {
        //     document.getElementById("appContent").style.display = "block";

        // }, 300)
    }
})