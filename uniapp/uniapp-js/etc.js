var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    showStepOne: true,
    showStepTwo: false,
    showStepThree: false,
    mobile: "",
    verifyCode: "",
    smsTimer: 0, // 短信验证码计时器
    smsCount: 60, // 短信验证码间隔，60秒执
    curSmsCount: 0, // 短信验证码当前剩余秒数
    smsFlag: true,
    drivingPic: "",
    userId: "",
    isNext: false,
    isShowMask: false,
    openId: "",
    carNo: "",
    vin: "",
    name: "",
    partnerCode: "",
    bankList: [],
    etcInfo: {},
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //是否参与了活动
        isJoin() {
            var _self = this;
            var url = HOST + "partner/activity/isJoin?openId=" + (window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : '');
            var params = {}
            $.ajax({
                url: url,
                type: "GET",
                data: params,
                contentType: "application/json;charset-UTF-8",
                dataType: "json"
            }).done(function(data) {
                console.log("数据：", data)
                if (data.code == 200) {
                    if (data.data) {
                        _self.partnerCode = data.data.partnerCode;
                        _self.showStepOne = false;
                        _self.showStepTwo = false;
                        _self.showStepThree = true;
                        _self.getPartnerDetail();
                    }
                    _self.getPartnerList();
                    document.getElementById("appContent").style.display = "block";
                } else {
                    fn.showTip(data.message);
                }
            })
        },

        //得到合作伙伴列表
        getPartnerList() {
            var _self = this;
            var url = HOST + "partner/list?openId=" + (window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : '');
            var params = {}
            $.ajax({
                url: url,
                type: "GET",
                data: params,
                contentType: "application/json;charset-UTF-8",
                dataType: "json"
            }).done(function(data) {
                console.log("数据：", data)
                if (data.code == 200) {
                    _self.bankList = data.data;

                } else {
                    fn.showTip(data.message);
                }
            })
        },

        //得到合作伙伴详情
        getPartnerDetail() {
            var _self = this;
            var url = HOST + "partner/detail?openId=" + (window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : '');
            var params = {
                code: this.partnerCode
                //code: this.partnerCode
            }
            $.ajax({
                url: url,
                type: "GET",
                data: params,
                contentType: "application/json;charset-UTF-8",
                dataType: "json"
            }).done(function(data) {
                console.log("数据：", data)
                if (data.code == 200) {
                    _self.etcInfo = data.data;
                    _self.etcInfo.detail = fn.replaceStr(_self.etcInfo.detail);
                } else {
                    fn.showTip(data.message);
                }
            })
        },

        //上传行使证图片
        btnUploadFile() {
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

                //alert(evt.target.result)
                //替换url

                var upUrl = HOST + "partner/readDriveLicense?openId=" + (window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : '');
                var params = {
                    base64Data: evt.target.result,
                    bizType: 0
                }
                $.ajax({
                    url: upUrl,
                    type: "POST",
                    data: JSON.stringify(params),
                    contentType: "application/json;charset-UTF-8",
                    dataType: "json"
                }).done(function(data) {
                    console.log("数据：", data)
                    if (data.code == 200) {
                        if (data.data.carNo) {

                            _self.drivingPic = data.data.filePath;
                            _self.name = data.data.userName;
                            _self.vin = data.data.vin;
                            _self.carNo = data.data.carNo;
                            _self.isNext = true;
                            _self.isShowMask = false;
                        } else {
                            _self.drivingPic = "";
                            fn.showTip('请正确上传行驶证照片!');
                            _self.isShowMask = false;
                        }

                    } else {
                        fn.showTip(data.message);
                    }
                })
            }
            reader.readAsDataURL(imgFile);
        },

        //判断信息
        chackInfo() {

            if (!this.mobile) {
                fn.showTip("手机号不能为空");
                return false;
            }
            if (!fn.testRule.isTel(this.mobile)) {
                fn.showTip("请正确输入手机号");
                return false;
            }
            if (!this.verifyCode) {
                fn.showTip("验证码不能为空");
                return false;
            }
            if (!this.partnerCode) {
                fn.showTip("请选择ETC渠道");
                return false;
            }
            return true;
        },

        //下一步
        next(type) {
            if (type == 'two') {

                this.showStepOne = false;
                this.showStepTwo = true;
                this.showStepThree = false;
            }
            if (type == 'three') {
                this.add();

            }
        },

        //上一步
        pre(type) {

            if (type == 'one') {
                this.showStepOne = true;
                this.showStepTwo = false;
                this.showStepThree = false;
            }

            if (type == 'two') {
                this.showStepOne = false;
                this.showStepTwo = true;
                this.showStepThree = false;
            }
        },

        // 设置短信验证码按钮状态
        setSmsCodeBtn() {
            $('.sendCode').html(this.curSmsCount + "s");
            this.smsTimer = window.setInterval(vm.smsCountdown, 1000); //启动计时器，1秒执行一次
            $('.sendCode').addClass('gray_bg');
        },
        // 短信验证码倒计时
        smsCountdown() {
            // curSmsCount = smsCount;
            this.curSmsCount--;
            if (this.curSmsCount == 0) {
                this.smsFlag = true;
                window.clearInterval(this.smsTimer); // 停止计时器
                $('.sendCode').removeAttr("disabled").html("重新获取").removeClass('gray_bg');
            } else {
                $('.sendCode').html(this.curSmsCount + "s");
            }
        },

        //发送验证码
        sendCode() {
            var _self = this;
            if (this.mobile && fn.testRule.isTel(this.mobile)) {
                var getCodeUrl = HOST + 'partner/verifyCode';
                if (this.smsFlag) {
                    this.smsFlag = false;
                    this.curSmsCount = this.smsCount;
                    var params = { "telephone": this.mobile }
                    $.ajax({
                        url: getCodeUrl,
                        type: "GET",
                        data: params,
                        // contentType: "application/json;charset-UTF-8",
                        dataType: "json"
                    }).done(function(data) {
                        console.log("数据：", data)
                        if (data.code == 200) {
                            _self.setSmsCodeBtn();
                            fn.showTip(data.message);

                        } else {
                            _self.smsFlag= true;
                            fn.showTip(data.message);
                        }
                    })
                }
            } else {
                // this.errMsg = "请正确填写手机号"
                fn.showTip("请正确填写负责人电话");
            }
        },


        //提交审核
        add() {
            if (!this.chackInfo()) {
                return false;
            }
            var _self = this;
            var url = HOST + "partner/activity/add?openId=" + (window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : '');
            var params = {
                "bizType": "1",
                "carNo": this.carNo,
                "drivingLicense": this.drivingPic,
                "mobile": this.mobile,
                "name": this.name,
                "openId": (window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : ''),
                "partnerCode": this.partnerCode,
                "verifyCode": this.verifyCode,
                "vin": this.vin
            }
            console.log('params：', params)
            $.ajax({
                url: url,
                type: "POST",
                data: JSON.stringify(params),
                contentType: "application/json;charset-UTF-8",
                dataType: "json"
            }).done(function(data) {
                console.log("数据：", data)
                if (data.code == 200) {
                    _self.getPartnerDetail();
                    _self.showStepOne = false;
                    _self.showStepTwo = false;
                    _self.showStepThree = true;

                } else {
                    fn.showTip(data.message);
                }
            })
        }

    },
    computed: {
        showSendBtn() {
            if (this.mobile && fn.testRule.isTel(this.mobile)) {
                return 1;
            } else {
                return 0;
            }
        }
    },
    mounted: function() {
        var _self = this;
        // this.getData();
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : '';
        this.isJoin();
        //初始化vue后,显示vue模板布局
        // setTimeout(function() {
        //     document.getElementById("appContent").style.display = "block";
        // }, 300)
    }
})