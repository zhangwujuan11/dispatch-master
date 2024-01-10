var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var userInfo="";

//const linkTo = "index.html";
if (window.localStorage) {
    userInfo = JSON.parse(localStorage.getItem("userInfo")) ? JSON.parse(localStorage.getItem("userInfo")) : "";

} else {
    userInfo = JSON.parse(Cookie.read("userInfo")) ? JSON.parse(Cookie.read("userInfo")) : "";
}
var data = {
    openId: ""
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //支付码链接获取
        getCode() {
            var _self = this;
            var orderSn = tempJson.orderId ? tempJson.orderId : "";
            var str = WebHost + 'saleDetail.html?orderId=' + orderSn;
            $("#codeDiv").qrcode({
                correctLevel: 0,
                text: this.toUtf8(str) //任意内容
            });
            var canvas = document.getElementsByTagName('canvas')[0];
            var img = this.convertCanvasToImage(canvas);
            
            $('#qrCode').html(img); // 添加DOM
            
            document.getElementById("appContent").style.display = "block";
        },
        //从 canvas 提取图片 image  
        convertCanvasToImage(canvas) {
            //新建Image对象
            var image = new Image();
            // canvas.toDataURL 返回的是一串Base64编码的URL
            image.src = canvas.toDataURL("image/png");
            return image;
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
            var orderSn = tempJson.orderId ? tempJson.orderId : "";
            window.location.href = "saleDetail.html?orderId=" + orderSn;
        }
    },
    mounted: function() {
        var _self = this;
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
        var orderSn = tempJson.orderId ? tempJson.orderId : "";
        if (orderSn) {
            this.getCode();
        }


        //初始化vue后,显示vue模板布局
        // setTimeout(function() {
        //     document.getElementById("appContent").style.display = "block";

        // }, 300)
    }
})