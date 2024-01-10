var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    classNative: 1,
    vinList: [{
        name: '福特'
    }, {
        name: '福特'
    }, {
        name: '福特'
    }, {
        name: '福特'
    }, {
        name: '福特'
    }],
    carInfoList: [],
    vinSearch: '',
    parts: "",
    carType: "",
    glassOptions: ['左后', '左前', '后档', '天窗', '前挡', '右后', '右前'],
    lokShow: false,
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        look: function () {
            this.lokShow = !this.lokShow
        },
        onIconSearch() {
            if (this.vinSearch !== '') {
                window.location.href = "vinResults.html?vin=" + this.vinSearch + "&parts=" + this.parts + "&carType=" + this.carType
            } else {
                wx.showToast({
                    title: '请输入VIN号'
                })
            }
        },
        clickRecords(index) {
            console.log(this.vinList[index])
        },
        authority(){
            if (navigator.userAgent.indexOf("Android") !== -1) { 
              $('.authority_mask').css('display','block');
            }
          },
          hideAuthorityMask(){
            $('.authority_mask').css('display','none');
          },
        //识别VIN码
        btnUploadFile(index) {
            $('.authority_mask').css('display','none');
            var _self = this;
            let es = window.event || e;
            let el = es.currentTarget || es.srcElement;
            //获取图片文件
            var imgFile = el.files[0];

            var reader = new FileReader();
            reader.onloadstart = function (e) {
                _self.isShowMask = true;
                console.log("开始读取....");
            }
            reader.onprogress = function (e) {
                console.log("正在读取中....");
            }
            reader.onabort = function (e) {
                console.log("中断读取....");
            }
            reader.onerror = function (e) {
                console.log("读取异常....");
            }
            reader.onload = async (evt) => {
                if (imgFile.size / 1024 > 1024 * 1.2) {
                    fn.dealImage(evt.target.result, {
                        quality: 0.4
                    }, function (base64Codes) {
                        var params = {
                            base64Data: base64Codes,
                            bizType: 1
                        }
                        Service.vinCode('POST', JSON.stringify(params), (function callback(data) {
                            console.log("数据：", data)
                            if (data.code === 200) {
                                let vinSearchs = JSON.parse(data.data.words_result)[0].words
                                this.data.vinSearch = vinSearchs
                                window.location.href = "vinResults.html?vin=" + vinSearchs + "&parts=" + _self.parts + "&carType=" + _self.carType
                            }
                        }))
                    });
                } else {
                    var params = {
                        base64Data: evt.target.result,
                        bizType: 1
                    }
                    Service.vinCode('POST', JSON.stringify(params), (function callback(data) {
                        if (data.code === 200) {
                            let vinSearchs = JSON.parse(data.data.words_result)[0].words
                            this.data.vinSearch = vinSearchs
                            window.location.href = "vinResults.html?vin=" + vinSearchs + "&parts=" + _self.parts + "&carType=" + _self.carType
                        }
                    }))
                }
            }
            reader.readAsDataURL(imgFile);
        },
        //小写转大写
        toUpperCase(e) {
            this.vinSearch = e.toUpperCase();
        }
    },
    mounted: function () {
        this.vinSearch = ''
    }
})