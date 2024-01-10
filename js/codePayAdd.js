var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    payMethod: "",
    payCodeImg: "",
    isShowMask: false,
    payMethodId: "",
    payMothodList: [{
            name: "微信",
            value: "1"
        },
        {
            name: "支付宝",
            value: "3"
        },
        {
            name: "第三方支付",
            value: "4"
        }
    ]

}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {

        //上传付款码图片
        uploadProductImg() {
            var _self = this;
            let evt = window.event || e;
            let el = evt.currentTarget || evt.srcElement;
            //获取图片文件
            var imgFile = el.files[0];

            //后缀选取
            // if (!/\/(?:jpeg|jpg|png|gif|JPG|PNG)/i.test(imgFile.type)) {
            //     console.log(图片格式不支持);
            //     return;
            // }
            //异步读取文件
            var reader = new FileReader();
            reader.onloadstart = function(e) {
                _self.isShowMask = true;
                console.log("开始读取....");
            }
            reader.onprogress = function(e) {
                console.log("正在读取中....");
            }
            reader.onabort = function(e) {
                console.log("中断读取....");
            }
            reader.onerror = function(e) {
                console.log("读取异常....");
            }
            //reader.readAsDataURL(imgFile);
            reader.onload = async(evt) => {

                if (imgFile.size / 1024 > 1024 * 1.2) {
                    fn.dealImage(evt.target.result, {
                        quality: 0.6
                    }, function(base64Codes) {
                        // console.log(base64Codes)
                        var params = {
                            base64Data: base64Codes,
                            bizType: 101
                        }
                        Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
                            //console.log("数据：", data)
                            if (data.code == 200) {
                                _self.payCodeImg = data.data.webPath
                                _self.isShowMask = false;
                            }
                        }))
                    });
                } else {
                    var params = {
                        base64Data: evt.target.result,
                        bizType: 101
                    }
                    Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
                        //console.log("数据：", data)
                        if (data.code == 200) {
                            _self.payCodeImg = data.data.webPath
                            _self.isShowMask = false;
                        }
                    }))
                }
                setTimeout(function() {
                    _self.isShowMask = false;
                }, 10000)
            }
            reader.readAsDataURL(imgFile);
        },

        //cngPayMothod
        // toCng(e){
        //    alert(e)
        // },

        //判断信息
        chackInfo() {
            if (!this.payMethod) {
                fn.showTip("请选择支付方式");
                return false;
            }
            if (!this.payCodeImg) {
                fn.showTip("付款码图片不能为空");
                return false;
            }


            return true;
        },
        //确定编辑
        updateMember() {
            var _self = this;
            if (!this.chackInfo()) {
                return false;
            }
            var params = {
                "id": this.payMethodId,
                "payCodeImg": this.payCodeImg,
                "payMethod": this.payMethod
            }

            Service.editShopPayMethod('POST', JSON.stringify(params), (function callback(data) {
                if (data.code == 200) {
                    console.log(data.data);
                    if (_self.payMethodId) {
                        fn.showTip("编辑成功，请耐心等待后台审核才能生效", "codePay.html");
                    } else {
                        fn.showTip("提交成功", "codePay.html");
                    }

                }
            }))
        }

    },
    mounted: function() {
        //alert(fn.versions.ios)
        var _self = this;
        this.payMethodId = tempJson.realId ? tempJson.realId : "";
        if (this.payMethodId) {
            var params = {
                payMethodId: this.payMethodId
            }
            Service.getShopPayMethodDetail('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.payMethod = data.data.payMethod;
                    _self.payCodeImg = data.data.payCodeImg;
                    document.getElementById("appContent").style.display = "block";
                }
            }))
        } else {
            //初始化vue后,显示vue模板布局
            setTimeout(function() {
                document.getElementById("appContent").style.display = "block";
            }, 300)
        }


    }
})