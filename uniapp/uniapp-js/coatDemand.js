var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    showStepTwo: false,
    isShowMask: false,
    dateCode: "",
    drivingPic: "",
    memberInfo: {
        bandType: "",
        carType: "",
        birthday: "",
        carColor: "",
        carGlassId: "",
        carInfoId: "",
        carNo: "",
        mobile: "",
        userName: "",
        sex: "",
        userId: "",
        vin: "",
        fdjNo: "",
        address: "",
        securityCode: "",
        factoryCode: ""
    },
    provSelected: "京",
    carNo: "",
    provList: ['京', '津', '沪', '渝', '冀', '豫', '云', '辽', '黑', '湘', '皖', '鲁', '新', '苏', '浙', '赣', '鄂', '桂', '甘', '晋', '蒙', '陕', '吉', '闽', '贵', '粤', '青', '藏', '川', '宁', '琼', '使', '领'],
    cardInfo: {},
    rcpLists: [],
    orderAuditList: [],
    pageNo: 1,
    pageSize: 100,
    shopMemberList: [],
    personId: ""
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //获取今日码
        getDatecode() {
            var _self = this;
            var params = {};
            Service.getDatecode('GET', params, (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                    _self.dateCode = data.data;
                }
            }))
        },
        //获取门店店员列表
        getData() {
            var _self = this;
            var params = {
                pageNo: this.pageNo,
                pageSize: this.pageSize
            }
            Service.getShopPersonList('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                    _self.getDrivingPicInfo();
                    _self.shopMemberList = data.data;

                    // _self.rcpLists = data.data.rcpLists;
                    // _self.rcpLists.sort(fn.sortBy('year'));
                }
            }))
        },
        //订单详情数据
        getPlatingOrderChekItemList() {
            var _self = this;
            var params = {}
            Service.getPlatingOrderChekItemList('GET', params, (function callback(data) {
                console.log("=====数据====：", data)
                if (data.code == 200) {
                    for (var i in data.data) {
                        data.data[i].isShowMask = false;
                    }
                    _self.orderAuditList = data.data;

                }
            }))
        },
        //上传行使证图片
        upDriveImg() {
            var _self = this;
            //正式环境用
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                //sizeType: ['original'],
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                defaultCameraMode: "normal",
                success: function(res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    vm.showSubUp = true;
                    wx.getLocalImgData({
                        localId: localIds.toString(), // 图片的localID
                        success: function(res) {
                            var localData = res.localData; // localData是图片的base64数据，可以用img标签显示

                            var base64 = "data:image/jgp;base64 || data:image/jgep;base64 || data:image/png;base64 || data:image/gif;base64";
                            //alert(localData.split(",")[0])
                            var base64Jpg = "data:image/jgp;base64";
                            if (fn.versions.android) {
                                if (localData.split(",")[0] != base64) {
                                    localData = base64Jpg + "," + localData;
                                }
                            }
                            var params = {
                                base64Data: localData,
                                bizType: 101
                            }
                            Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
                                //console.log("数据：", data)
                                if (data.code == 200) {
                                    //alert(data.data.webPath);
                                    _self.drivingPic = data.data.webPath;
                                    var params = {
                                        base64Data: _self.drivingPic,
                                        //base64Data: _self.drivingPic,
                                        bizType: 2
                                    }
                                    Service.readDrivingLicense('POST', JSON.stringify(params), (function callback(data) {
                                        if (data.code == 200) {
                                            console.log(data.data);
                                            if (data.data.carNo) {
                                                _self.memberInfo.userName = data.data.userName;
                                                _self.memberInfo.carNo = data.data.carNo;
                                                _self.memberInfo.vin = data.data.vin;
                                                _self.memberInfo.address = data.data.address;
                                                _self.memberInfo.fdjNo = data.data.fdjNo;
                                                _self.carNo = data.data.carNo.substring(1);
                                                _self.provSelected = data.data.carNo.substring(0, 1)
                                            } else {
                                                _self.drivingPic = "";
                                                fn.showTip('请正确上传行驶证照片!')
                                            }
                                        }
                                    }))
                                }
                            }))

                        }
                    });
                }
            });

            //测试环境用
            // var localData = "";
            // $('.matchImg').attr("src", localData);
            // var params = {
            //     base64Data: localData,
            //     token: userInfo.token
            // }
            // Service.readDrivingLicense('POST', JSON.stringify(params), (function callback(data) {
            //     if (data.code == 200) {
            //         console.log(data.data);
            //         _self.memberInfo.name = data.data.userName;
            //         _self.memberInfo.carNo = data.data.carNo; 
            //         _self.memberInfo.vin = data.data.vin;   
            //         _self.memberInfo.address = data.data.address; 
            //         _self.memberInfo.fdjNo = data.data.fdjNo; 
            //         _self.carNo = data.data.carNo.substring(1);
            //         _self.provSelected = data.data.carNo.substring(0,1)

            //     }
            // }))

        },

        //上传新版行驶证
        btnUploadDriveImg() {
            $('.authority_mask').css('display','none');
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
                                _self.drivingPic = data.data.webPath;
                                var params = {
                                    base64Data: _self.drivingPic,
                                    bizType: 2
                                }
                                Service.readDrivingLicense('POST', JSON.stringify(params), (function callback(data) {
                                    if (data.code == 200) {
                                        console.log(data.data);
                                        if (data.data.carNo) {
                                            _self.memberInfo.userName = data.data.userName;
                                            _self.memberInfo.carNo = data.data.carNo;
                                            _self.memberInfo.vin = data.data.vin;
                                            _self.memberInfo.address = data.data.address;
                                            _self.memberInfo.fdjNo = data.data.fdjNo;
                                            _self.carNo = data.data.carNo.substring(1);
                                            _self.provSelected = data.data.carNo.substring(0, 1)
                                            _self.isShowMask = false;
                                        } else {
                                            _self.drivingPic = "";
                                            fn.showTip('请正确上传行驶证照片!');
                                            _self.isShowMask = false;
                                        }
                                    }

                                }))
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
                            _self.drivingPic = data.data.webPath;
                            var params = {
                                base64Data: _self.drivingPic,
                                bizType: 2
                            }
                            Service.readDrivingLicense('POST', JSON.stringify(params), (function callback(data) {
                                if (data.code == 200) {
                                    console.log(data.data);
                                    if (data.data.carNo) {
                                        _self.memberInfo.userName = data.data.userName;
                                        _self.memberInfo.carNo = data.data.carNo;
                                        _self.memberInfo.vin = data.data.vin;
                                        _self.memberInfo.address = data.data.address;
                                        _self.memberInfo.fdjNo = data.data.fdjNo;
                                        _self.carNo = data.data.carNo.substring(1);
                                        _self.provSelected = data.data.carNo.substring(0, 1)
                                        _self.isShowMask = false;
                                    } else {
                                        _self.drivingPic = "";
                                        fn.showTip('请正确上传行驶证照片!');
                                        _self.isShowMask = false;
                                    }
                                }

                            }))
                        }
                    }))
                }



                setTimeout(function() {
                    _self.isShowMask = false;
                }, 10000)
            }
            reader.readAsDataURL(imgFile);
        },
        authority(){
            if (navigator.userAgent.indexOf("Android") !== -1) { 
              $('.authority_mask').css('display','block');
            }
          },
          hideAuthorityMask(){
            $('.authority_mask').css('display','none');
          },
        //上传新版审核图片
        btnUploadFile(index) {
            $('.authority_mask').css('display','none');
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
                _self.orderAuditList[index].isShowMask = true;
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
                                $('.upLoadImgs').eq(index).find(".picFullcar").attr("src", data.data.webPath);
                                _self.orderAuditList[index].isShowMask = false;
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
                            $('.upLoadImgs').eq(index).find(".picFullcar").attr("src", data.data.webPath);
                            _self.orderAuditList[index].isShowMask = false;
                        }
                    }))
                }




                setTimeout(function() {
                    _self.orderAuditList[index].isShowMask = false;
                }, 10000)
            }
            reader.readAsDataURL(imgFile);
        },



        //获取驾驶证信息
        getDrivingPicInfo() {
            var _self = this;
            _self.drivingPic = tempJson.drivingPic ? tempJson.drivingPic : "";
            if (_self.drivingPic) {
                //alert(_self.drivingPic)
                var params = {
                    base64Data: _self.drivingPic,
                    bizType: 2
                }
                Service.readDrivingLicense('POST', JSON.stringify(params), (function callback(data) {

                    if (data.code == 200) {
                        console.log(data.data);

                        if (data.data.carNo) {
                            _self.memberInfo.name = data.data.userName;
                            _self.memberInfo.carNo = data.data.carNo;
                            _self.memberInfo.vin = data.data.vin;
                            _self.memberInfo.address = data.data.address;
                            _self.memberInfo.fdjNo = data.data.fdjNo;
                            _self.carNo = data.data.carNo.substring(1);
                            _self.provSelected = data.data.carNo.substring(0, 1)
                        } else {
                            _self.drivingPic = "";
                            fn.showTip('请正确上传行驶证照片!')
                        }

                    }
                }))
            }

        },

        getProSelected() {
            //获取选中省份简称
            console.log(this.provSelected)
        },
        //小写转大写
        toUpperCase(e) {
            // console.log('e：',e.toUpperCase())
            this.carNo = e.toUpperCase();
        },
        //选择车型
        cngbandType() {
            console.log(this.memberInfo);
            this.memberInfo.carNo = this.provSelected + this.carNo;
            var cardId = tempJson.cardId ? tempJson.cardId : "";
            window.location.href = "queryCar.html?returnUrl=coatDemand.html&cardId=" + cardId +
                "&drivingPic=" + this.drivingPic
            //+ "&memberInfo=" + JSON.stringify(this.memberInfo) ;
        },
        //判断信息
        chackInfo() {
            if (!this.shopMemberList.length) {
                this.memberInfo.carNo = this.provSelected + this.carNo;
                fn.showTip("暂未添加店员，请先行添加!")
                // "shopUserManager.html?returnUrl=coatDemand.html?memberInfo=" + JSON.stringify(this.memberInfo)
                //     + "&drivingPic=" + this.drivingPic 
                // ) ;
                return false;
            }
            if (!this.memberInfo.carType) {
                fn.showTip("车型不能为空");
                return false;
            }
            if (!this.carNo) {
                fn.showTip("车牌号不能为空");
                return false;
            }
            if (!this.memberInfo.vin) {
                fn.showTip("车架号不能为空");
                return false;
            }
            if (!this.memberInfo.userName) {
                fn.showTip("姓名不能为空");
                return false;
            }
            if (!this.memberInfo.mobile) {
                fn.showTip("手机号不能为空");
                return false;
            }
            if (!fn.testRule.isTel(this.memberInfo.mobile)) {
                fn.showTip("请正确输入手机号");
                return false;
            }
            if (!this.memberInfo.securityCode) {
                fn.showTip("请选择新玻璃防伪编码");
                return false;
            }
            if (!this.memberInfo.factoryCode) {
                fn.showTip("请选择新玻璃本厂编码");
                return false;
            }
            if (!this.personId) {
                fn.showTip("请选择服务店员");
                return false;
            }
            return true;
        },

        //下一步
        next() {
            if (!this.chackInfo()) {
                return false;
            }
            this.showStepTwo = true;
        },

        //上一步
        pre() {

            this.showStepTwo = false;
        },

        //判断图片审核信息
        chackPicInfo() {

            for (var i = 0; i < $('.upLoadImgs').length; i++) {
                if ($('.upLoadImgs').eq(i).find(".picFullcar").attr('src') == "images/upload.jpg") {
                    fn.showTip("审核照片必填");
                    return false;
                }

            }
            return true;
        },
        //提交审核
        add() {
            if (!this.chackInfo()) {
                return false;
            }
            if (!this.chackPicInfo()) {
                return false;
            }
            var _self = this;
            var orderAudits = [];
            for (var i = 0; i < $('.upLoadImgs').length; i++) {
                var obj = {};
                obj.checkItemId = $('.upLoadImgs').eq(i).attr('checkItemId');
                obj.checkItemImg = $('.upLoadImgs').eq(i).find(".picFullcar").attr('src');
                orderAudits.push(obj)
            }
            console.log(orderAudits)
            this.memberInfo.carInfoId = tempJson.carInfoId ? tempJson.carInfoId : '',
                this.memberInfo.carNo = this.provSelected + this.carNo;
            this.memberInfo.dateCode = this.dateCode;
            this.memberInfo.orderAudits = orderAudits;
            this.memberInfo.personId = this.personId;

            var params = this.memberInfo
            console.log('params：', params)
            Service.updatePlatingOrderApply('POST', JSON.stringify(params), (function callback(data) {
                if (data.code == 200) {
                    console.log(data.data);
                    fn.showTip("提交成功", "coatList.html");
                    //window.location.href = "cardOrder.html?orderSn=" + data.data;
                }
            }))
        },
        //立即提交
        // buyCard() {
        //     window.location.href = "cardOrder.html"
        // }



    },
    mounted: function() {
        var _self = this;
        this.getPlatingOrderChekItemList();
        this.getData();

        //性别选择
        $('.sexSelect li').on('click', function() {
            $(this).find('.iconRadio').addClass("iconOk")
                .parent().siblings().find('.iconRadio').removeClass("iconOk");
            _self.memberInfo.sex = $(this).find('span').html();

        })
        // 数据信息：
        if (tempJson.memberInfo) {
            _self.memberInfo = JSON.parse(tempJson.memberInfo)
            if (_self.memberInfo.carNo) {
                _self.carNo = _self.memberInfo.carNo.substring(1);
                _self.provSelected = _self.memberInfo.carNo.substring(0, 1)
            }
            if (_self.memberInfo.sex == '男') {
                $('.sexSelect li').eq(0).find('.iconRadio').addClass("iconOk")
            } else {
                $('.sexSelect li').eq(1).find('.iconRadio').addClass("iconOk")
            }
        }



        //车型选择
        if (tempJson.carType) {
            _self.memberInfo.bandType = tempJson.carType ? tempJson.carType : '';
            _self.memberInfo.carType = tempJson.carType ? tempJson.carType : '';
        }

        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            console.log(tempJson.memberInfo)
            //_self.memberInfo = tempJson.memberInfo ? JSON.parse(tempJson.memberInfo) : "";


            _self.getDatecode();
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})