var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var userInfo="";

var serDomaine = 'http://www.txsofts.com/'; //QQ腾讯地图返回地址
//const linkTo = "index.html";
if (window.localStorage) {
    userInfo = window.localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : "";

} else {
    userInfo = JSON.parse(Cookie.read("userInfo")) ? JSON.parse(Cookie.read("userInfo")) : "";
}

var data = {
    saleInfo: {},
    isShowMask: false,
    isOwer:false,
    openId: "",
    userStars: [
        "images/sale/star.png",
        "images/sale/star.png",
        "images/sale/star.png",
        "images/sale/star.png",
        "images/sale/star.png"
    ],
    wjxScore: 0,
    imgList:[],
    commentVO:{},
    content: "",
    wjxArrs: [' ', '很差', '一般', '满意', '非常满意', '无可挑剔'],
    serArrs: [' ', '非常差', '差', '一般', '好', '非常好'],
    serList: [{
            name: '门店整洁',
            userStars: [
                "images/sale/star.png",
                "images/sale/star.png",
                "images/sale/star.png",
                "images/sale/star.png",
                "images/sale/star.png"
            ],
            score: 0
        },
        {
            name: '安装防护',
            userStars: [
                "images/sale/star.png",
                "images/sale/star.png",
                "images/sale/star.png",
                "images/sale/star.png",
                "images/sale/star.png"
            ],
            score: 0
        },
        {
            name: '玻璃干净',
            userStars: [
                "images/sale/star.png",
                "images/sale/star.png",
                "images/sale/star.png",
                "images/sale/star.png",
                "images/sale/star.png"
            ],
            score: 0
        },
        {
            name: '服务态度',
            userStars: [
                "images/sale/star.png",
                "images/sale/star.png",
                "images/sale/star.png",
                "images/sale/star.png",
                "images/sale/star.png"
            ],
            score: 0
        }
    ]

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
                openId : window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : ""
            }
            Service.getOrderSaleDetail('GET', params, (function callback(data) {
                console.log("=====数据====：", data)

                if (data.code == 200) {

                    _self.saleInfo = data.data;
                    _self.saleInfo.saleDate = fn.formatTime(_self.saleInfo.saleDate, 'Y-M-D')
                    if(data.data.commentVO){
                        _self.commentVO = data.data.commentVO;
                        if(_self.commentVO.openId == _self.openId){
                            _self.isOwer = true;
                            _self.serList[0].score = _self.commentVO.mdzj;
                            _self.serList[1].score = _self.commentVO.azfh;
                            _self.serList[2].score = _self.commentVO.blgj;
                            _self.serList[3].score = _self.commentVO.fwtd;
                            _self.imgList = _self.commentVO.imgVOList;
                        }
                    }
                    document.getElementById("appContent").style.display = "block";
                }
            }))
        },

        //跳转到温馨提示页
        toDetatil(e) {
            window.location.href = "saleDetail.html?orderId=" + e;
        },

        //上传商品图片
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
                                var obj = { "imgPath" : data.data.webPath}
                                _self.imgList.push(obj)
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

                            //alert(data.data.webPath);
                           // $("#showImg").attr("src", data.data.webPath);
                            var obj = { "imgPath" : data.data.webPath}
                            _self.imgList.push(obj)
                            _self.isShowMask = false;
                            //alert(data.data.webPath)
                        }
                    }))
                }
                setTimeout(function() {
                    _self.isShowMask = false;
                }, 10000)
            }
            reader.readAsDataURL(imgFile);
        },

        //删除图片
        delImg(e){
            this.imgList.splice(e,1);
        },

        // 星星点击事件
        starTap(index) {
            var that = this;
            var index = index; // 获取当前点击的是第几颗星星
            var tempUserStars = this.userStars; // 暂存星星数组
            var len = tempUserStars.length; // 获取星星数组的长度
            for (var i = 0; i < len; i++) {
                if (i <= index) { // 小于等于index的是满心
                    tempUserStars[i] = "images/sale/starOn.png";
                    that.wjxScore = i + 1;
                } else { // 其他是空心
                    tempUserStars[i] = "images/sale/star.png"
                }
            }
            // 重新赋值就可以显示了
            this.userStars = tempUserStars;

        },
        //服务星星点击
        starShow(index, subIndex) {
            var that = this;
            var index = index; // 获取当前点击的是第几颗星星
            //alert(this.serList[index].userStars)
            var tempUserStars = this.serList[index].userStars; // 暂存星星数组
            var len = tempUserStars.length; // 获取星星数组的长度
            for (var i = 0; i < len; i++) {
                if (i <= subIndex) { // 小于等于index的是满心
                    tempUserStars[i] = "images/sale/starOn.png";
                    that.serList[index].score = i + 1;
                } else { // 其他是空心
                    tempUserStars[i] = "images/sale/star.png"
                }
            }
            // 重新赋值就可以显示了
            this.serList[index].userStars = tempUserStars;
        },

        //判断信息
        chackInfo() {
            if (!this.wjxScore) {
                fn.showTip("请对商品评价！");
                return false;
            }
            return true;
        },

        //评价提交
        subAdd() {
            var _self = this;
            if (!this.chackInfo()) {
                return false;
            }
            //var imgEditDtoList = 
            var params = {
                "azfh": this.serList[1].score,
                "blgj": this.serList[2].score,
                "imgEditDtoList" : this.imgList,
                "content": this.content,
                "fwtd": this.serList[3].score,
                "mdzj": this.serList[0].score,
                "openId": this.openId,
                "orderSn": this.saleInfo.orderSn,
                "score": this.wjxScore
            }
            console.log("params：", params)
            Service.evaluOrderSale('POST', JSON.stringify(params), (function callback(data) {
                if (data.code == 200) {
                    console.log(data.data);
                    fn.showTip('评价成功！', 'saleEvalu.html?orderId=' + _self.saleInfo.orderSn);
                }
            }))
        }

    },
    mounted: function() {
        var _self = this;
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
        //alert(this.openId)
        // console.log('openId：',this.openId)
        var orderSn = tempJson.orderId ? tempJson.orderId : "";
        if (orderSn) {
            this.getOrderSaleDetail();
        } else {
            fn.showTip('没有销售单号,请先确认！');
        }



        //_self.year = fn.formatTime(new Date(), 'Y-M-D');
        //初始化vue后,显示vue模板布局
        // setTimeout(function() {

        // }, 300)
    }
})