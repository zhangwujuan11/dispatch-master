var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    dateCode: "",
    openId: "",
    smsTimer: 0, // 短信验证码计时器
    smsCount: 60, // 短信验证码间隔，60秒执
    curSmsCount: 0, // 短信验证码当前剩余秒数
    smsFlag: true,
    imgShopOne: {
        imgPath: '',
        name: '休息区',
        shopId: ''
    },
    imgShopTwo: {
        imgPath: '',
        name: '门头',
        shopId: ''
    },
    imgShopThree: {
        imgPath: '',
        name: '前台区',
        shopId: ''
    },
    imgShopFour: {
        imgPath: '',
        name: '施工区',
        shopId: ''
    },
    imgShopFive: {
        imgPath: '',
        name: '团队',
        shopId: ''
    },
    agreeFlag: true,
    webHost:"",
    shopInfo: {
        "address": "", //地址
        "azgwNum": "", //安装工位(个) 
        "azjsNum": "", // 安装技师（个） ,
        "chargeMobile": "", //负责人电话
        "verifyCode": "", //验证码
        "chargeName": "", //负责人姓名 ,
        "chargeWx": "", //负责人微信
        "provinceId": "", //: 省 ,
        "cityId": "", //: 市 ,
        "zoneId": "", //: 区 ,
        "hwazgjcNum": "", // 户外安装工具车（辆） ,
        "legalPerson": "", //法人代表
        "linktel": "", //联系电话
        "name": "", //门店电话
        "openb": "", //营业开始时间 ,
        "opene": "", //营业结束时间
        "shopImgList": [],
        "province": "",
        "city": "",
        "zone": "",
        "nsrsbh": "", //统一社会信用代码 ,
        "saleArea": "", //销售区域
        "shopNum": "", //门店数量
        "shopArea": "", //门店面积 
        "stores": "", //库存情况（万元） ,
        "warehousesArea": "", //仓库面积 ,
        "warehousesNum": "" // 仓库数量 ,

    }
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {

        //上传图片
        upImg(e) {
            var _self = this;
            console.log("图片信息：", e)

            //正式用
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sizeType: ['original'],
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                defaultCameraMode: "normal",
                success: function(res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    //$(obj).attr("src", localIds);
                    vm.showSubUp = true;
                    wx.getLocalImgData({
                        localId: localIds.toString(), // 图片的localID
                        success: function(res) {
                            var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                            // $('.matchImg').attr("src", localData);
                            //alert(localData.split(",")[0])
                            var base64 = "data:image/jgp;base64 || data:image/jgep;base64 || data:image/png;base64 || data:image/gif;base64";
                            //alert(localData.split(",")[0])
                            var base64Jpg = "data:image/jgp;base64";
                            if (fn.versions.android) {
                                if (localData.split(",")[0] != base64) {
                                    localData = base64Jpg + "," + localData;
                                }
                            }
                            //$(obj).attr("src", localData);

                            var params = {
                                base64Data: localData,
                                bizType: 101
                            }
                            //Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
                            $.ajax({
                                url: HOST + "order/upload",
                                type: "POST",
                                data: JSON.stringify(params),
                                contentType: "application/json;charset-UTF-8",
                                dataType: "json"
                            }).done(function(data) {
                                //console.log("数据：", data)
                                if (data.code == 200) {
                                    if (e.name == "休息区") {
                                        _self.imgShopOne.imgPath = data.data.webPath;
                                    } else if (e.name == "门头") {
                                        _self.imgShopTwo.imgPath = data.data.webPath;
                                    } else if (e.name == "前台区") {
                                        _self.imgShopThree.imgPath = data.data.webPath;
                                    } else if (e.name == "施工区") {
                                        _self.imgShopFour.imgPath = data.data.webPath;
                                    } else if (e.name == "团队") {
                                        _self.imgShopFive.imgPath = data.data.webPath;
                                    } else if (e.name == "营业执照") {
                                        _self.imgShopFive.imgPath = data.data.webPath;
                                    }
                                }
                            })
                        }
                    });
                }
            });
            //测试用
            //  var localData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHIAAAAqCAYAAABvAA/nAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxQ0Y4NUYzNjYyNDkxMUU4OEM2NDhFMjExOUVFNDZFRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoxQ0Y4NUYzNzYyNDkxMUU4OEM2NDhFMjExOUVFNDZFRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjFDRjg1RjM0NjI0OTExRTg4QzY0OEUyMTE5RUU0NkVEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjFDRjg1RjM1NjI0OTExRTg4QzY0OEUyMTE5RUU0NkVEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+aVUo5AAAF/BJREFUeNrsm3l8VFWW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";
            //  var params = {
            //      base64Data: localData,
            //      bizType: 201
            //  }
            // // Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
            //  $.ajax({
            //          url: HOST + "order/upload",
            //          type: "POST",
            //          data: JSON.stringify(params),
            //          contentType: "application/json;charset-UTF-8",
            //          dataType: "json"
            //      }).done(function(data) {
            //      //console.log("数据：", data)
            //      if (data.code == 200) {
            //          if (e.name == "休息区") {
            //              _self.imgShopOne.imgPath = data.data.webPath;
            //          } else if (e.name == "门头") {
            //              _self.imgShopTwo.imgPath = data.data.webPath;
            //          } else if (e.name == "前台区") {
            //              _self.imgShopThree.imgPath = data.data.webPath;
            //          } else if (e.name == "施工区") {
            //              _self.imgShopFour.imgPath = data.data.webPath;
            //          } else if (e.name == "团队") {
            //              _self.imgShopFive.imgPath = data.data.webPath;
            //          }
            //          //$('.upLoadImgs').eq(index).find(".picFullcar").attr("src", data.data.webPath);
            //      }
            //  })
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
            if (this.shopInfo.chargeMobile && fn.testRule.isTel(this.shopInfo.chargeMobile)) {
                var getCodeUrl = HOST + 'member/getAuthCode';
                if (this.smsFlag) {
                    this.smsFlag = false;
                    this.curSmsCount = this.smsCount;
                    var params = { "telephone": this.shopInfo.chargeMobile }
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
                            fn.showTip(data.message);
                        }
                    })
                }
            } else {
                // this.errMsg = "请正确填写手机号"
                fn.showTip("请正确填写负责人电话");
            }
        },

        //是否同意
        cngAgree(){
            this.agreeFlag = !this.agreeFlag;
        },


        //判断信息
        chackInfo() {
            if (!this.shopInfo.name) {
                fn.showTip("门店名称不能为空");
                return false;
            }
            if (!this.shopInfo.linktel) {
                fn.showTip("联系电话不能为空");
                return false;
            }

            if (!this.shopInfo.nsrsbh) {
                fn.showTip("统一社会信用代码不能为空");
                return false;
            }
            if (!this.shopInfo.saleArea) {
                fn.showTip("销售区域不能为空");
                return false;
            }
            if (!this.shopInfo.legalPerson) {
                fn.showTip("法人代表不能为空");
                return false;
            }
            if (!this.shopInfo.chargeName) {
                fn.showTip("负责人姓名不能为空");
                return false;
            }
            if (!this.shopInfo.chargeMobile) {
                fn.showTip("负责人联系电话不能为空");
                return false;
            }
            if (!fn.testRule.isTel(this.shopInfo.chargeMobile)) {
                fn.showTip("请正确输入负责人联系电话");
                return false;
            }
            if (!this.shopInfo.verifyCode) {
                fn.showTip("短信验证码不能为空");
                return false;
            }

            if (!this.shopInfo.chargeWx) {
                fn.showTip("负责人微信");
                return false;
            }
            if (!this.shopInfo.zoneId) {
                fn.showTip("省市区不能为空");
                return false;
            }
            if (!this.shopInfo.address) {
                fn.showTip("详细地址不能为空");
                return false;
            }
            if (!this.shopInfo.shopNum) {
                fn.showTip("门店数量不能为空");
                return false;
            }
            if (!this.shopInfo.warehousesArea) {
                fn.showTip("门店面积不能为空");
                return false;
            }
            if (!this.shopInfo.azgwNum) {
                fn.showTip("安装工位不能为空");
                return false;
            }
            if (!this.shopInfo.azjsNum) {
                fn.showTip("安装技师不能为空");
                return false;
            }

            if (!this.agreeFlag) {
                fn.showTip("您还未阅读并同意此协议");
                return false;
            }

            // for(var i=0; i<$('.upLoadImgs').length; i++){
            //     if ($('.upLoadImgs').eq(i).find(".picFullcar").attr('src')=="images/upload.jpg") {
            //         fn.showTip("破损照片必填");
            //         return false;
            //     }

            // }
            return true;
        },

        //门店更新
        editShop() {
            if (!this.chackInfo()) {
                return false;
            }
            var shopImgList = [];
            if (this.imgShopOne.imgPath) {
                shopImgList.push(this.imgShopOne)
            }
            if (this.imgShopTwo.imgPath) {
                shopImgList.push(this.imgShopTwo)
            }
            if (this.imgShopThree.imgPath) {
                shopImgList.push(this.imgShopThree)
            }
            if (this.imgShopFour.imgPath) {
                shopImgList.push(this.imgShopFour)
            }
            if (this.imgShopFive.imgPath) {
                shopImgList.push(this.imgShopFive)
            }
            var params = {
                "openId" : this.openId,
                "address": this.shopInfo.address,
                "azgwNum": this.shopInfo.azgwNum,
                "azjsNum": this.shopInfo.azjsNum,
                "chargeMobile": this.shopInfo.chargeMobile,
                "chargeName": this.shopInfo.chargeName,
                "chargeWx": this.shopInfo.chargeWx,
                "hwazgjcNum": this.shopInfo.hwazgjcNum,
                "legalPerson": this.shopInfo.legalPerson,
                "linktel": this.shopInfo.linktel,
                "name": this.shopInfo.name,
                "nsrsbh": this.shopInfo.nsrsbh,
                "openb": this.shopInfo.openb,
                "opene": this.shopInfo.opene,
                "shopNum" : this.shopInfo.shopNum,
                //"redirectUrl": this.shopInfo.redirectUrl,
                "saleArea": this.shopInfo.saleArea,
                "shopArea": this.shopInfo.shopArea,
                "shopImgList": shopImgList,
                "stores": this.shopInfo.stores,
                "verifyCode": this.shopInfo.verifyCode,
                "warehousesArea": this.shopInfo.warehousesArea,
                "warehousesNum": this.shopInfo.warehousesNum,
                "zoneId": this.shopInfo.zoneId
            }

            console.log('参数：', params)
            $.ajax({
                    url: HOST + "member/register",
                    type: "POST",
                    data: JSON.stringify(params),
                    contentType: "application/json;charset-UTF-8",
                    dataType: "json"
                })
                .done(function(data) {
                    console.log(data)
                    if (data.code == 200) {
                        fn.showTip("感谢您注册易道大咖，请耐心等待审核！");
                    } else {
                        fn.showTip(data.message);
                    }
                })
        }

    },
    // watch: {
    //     shopInfo: {
    //         handler: function(val, oldval) {
    //             console.log(val)
    //         },
    //         deep: true //对象内部的属性监听，也叫深度监听
    //     }
    // },
    computed: {
        showSendBtn() {
            if (this.shopInfo.chargeMobile && fn.testRule.isTel(this.shopInfo.chargeMobile)) {
                return 1;
            } else {
                return 0;
            }
        }
    },
    mounted: function() {
        var _self = this;
        //this.getShopDetail();
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
        this.webHost = WebHost;
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            //省市选择
            var cityPicker = new mui.PopPicker({
                layer: 3
            });
            cityPicker.setData(cityData3);

            $("#choose-city").on("tap", function() {

                cityPicker.show(function(items) {
                    // $("#choose-city").text(items[0].text + " " + items[1].text + " " + items[2].text);
                    // console.log(items[2].value)
                    // $("#province_id").val(items[0].value);
                    // $("#city_id").val(items[1].value);
                    // $("#zone_id").val(items[2].value);

                    _self.shopInfo.zoneId = items[2].value;
                    _self.shopInfo.province = items[0].text;
                    _self.shopInfo.city = items[1].text;
                    _self.shopInfo.zone = items[2].text;
                    // $("#province").val(items[0].text);
                    // $("#city").val(items[1].text);
                    // $("#zone").val(items[2].text);

                    //返回 false 可以阻止选择框的关闭
                    //return false;
                });
            });

            //时间选择
            var subinvman_sel = $("#openb")[0];
            if (subinvman_sel) {
                document.querySelector("#openb").addEventListener("tap", function() {
                    var dtpicker = new mui.DtPicker({
                        "type": "time"
                    });
                    // dtpicker.setSelectedValue("08:12");  
                    dtpicker.show(function(items) {
                        console.log(items.text)
                        //$("#openb")[0].innerHTML = items.text;
                        _self.shopInfo.openb = items.text;
                        dtpicker.dispose();
                    });
                });
            };

            var subinvman_sel = $("#opene")[0];
            if (subinvman_sel) {
                document.querySelector("#opene").addEventListener("tap", function() {
                    var dtpicker = new mui.DtPicker({
                        "type": "time"
                    });
                    dtpicker.show(function(items) {
                        console.log(items.text)
                        //$("#opene")[0].innerHTML = items.text;
                        _self.shopInfo.opene = items.text;
                        dtpicker.dispose();
                    });
                });
            };

            document.getElementById("appContent").style.display = "block";
        }, 100)


    }

})