var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    activeInfo: {},
    openId: '',
    payInfo: {},
    surpluCount: 0, //剩余人数
    restPay: [],
    memberList: [],
    newMemberList: [],
    itemsVOList: [],
    isShowTwo: false,
    isShowShopUser: false,
    pdlist: [],
    originPdList: [],
    selArrs: [],
    payType: "JSAPI", //支付类型 JSAPI: 直接支付,  NATIVE：扫码支付
    appId: '',
    nonceStr: '',
    package: '',
    paySign: '',
    signType: "",
    timeStamp: ''

}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //获取店员信息：
        getShopUserList() {
            var _self = this;
            var params = {
                pageNo: 1,
                pageSize: 999
            }

            Service.getShopPersonList('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {

                    for (var i in data.data) {
                        data.data[i].selFlag = false;
                    }
                    _self.originPdList = data.data;
                    //_self.pdlist = data.data;
                }

            }))
        },

        //选择店员页面
        selShopUser() {
            console.log('memberList：', this.memberList)
            console.log('originPdList：', this.originPdList)
            this.pdlist = [];
            if (this.memberList.length) {
                // // 将旧数组的值处理成id集合
                var oldIds = this.memberList.map(item => item.personId)
                console.log('oldIds:', oldIds)
                // 得到newArr与oldArr不同的值
                var result = this.originPdList.filter(item => !oldIds.includes(item.id.toString()))

                // var result = [];
                // for (var i = 0; i < this.originPdList.length; i++) {
                //     var obj = this.originPdList[i];
                //     var num = obj.id;
                //     var isExist = false;
                //     for (var j = 0; j < this.memberList.length; j++) {
                //         var aj = this.memberList[j];
                //         var n = aj.personId;
                //         if (n == num) {
                //             isExist = true;
                //             break;
                //         }
                //     }
                //     if (!isExist) {
                //         result.push(obj);
                //     }
                // }
                console.log('this.pdlist：', result) // [{id: 4}]
                this.pdlist = result;
            } else {
                this.pdlist = this.originPdList;
            }
            this.isShowShopUser = true;
        },
        //选择店员
        getSelectUser(e) {
            console.log(e.selFlag)
            e.selFlag = !e.selFlag;
        },
        //返回
        cancelUerSel() {
            this.isShowShopUser = false;
        },
        //编辑店员信息
        editActive(e, index) {

            // e.isEdit = !e.isEdit
            // alert(e.isEdit)
            var _self = this;
            let obj = _self.memberList[index];
            // obj.isEdit = !obj.isEdit;
            // _self.$set(_self.memberList, index, obj);
            if (obj.isEdit) {

                if (!e.personImg) {
                    fn.showTip("参赛照片不能为空");
                    return false;
                }
                if (!e.personIntro) {
                    fn.showTip("店员简介不能为空");
                    return false;
                }

                var params = {
                    "activityId": tempJson.id ? tempJson.id : "",
                    "itemId": e.itemId,
                    "personId": e.personId,
                    "personImg": e.personImg,
                    "personIntro": e.personIntro
                }

                Service.editActive('POST', JSON.stringify(params), (function callback(data) {
                    console.log("=====数据：", data)

                    if (data.code == 200) {
                        fn.showTip('编辑成功！')
                        obj.isEdit = !obj.isEdit;
                        _self.$set(_self.memberList, index, obj);
                    }

                }))
            } else {
                obj.isEdit = !obj.isEdit;
                _self.$set(_self.memberList, index, obj);
            }
        },
        //取消店员
        cancelShopUser(e, item) {
            var _self = this;
            fn.commonWindowSur('确定此店员取消本次活动？')
            $('.commonBtn_suc').on('click', function() {
                if (_self.selArrs.length > 1) {
                    _self.selArrs.splice(e, 1);
                    for (var i in _self.pdlist) {
                        if (_self.pdlist[i].id == item.personId) {
                            _self.pdlist[i].selFlag = false;
                        }
                    }
                    _self.getShopUsers();
                } else {
                    _self.selArrs.splice(e, 1);
                    for (var i in _self.pdlist) {
                        if (_self.pdlist[i].id == item.personId) {
                            _self.pdlist[i].selFlag = false;
                        }
                    }
                    _self.newMemberList = [];
                }
                $('.workInfo, .mark, ._loading').remove();
                fn.showTip("取消报名成功");
            })


        },
        //确认选择店员
        surUserSel() {

            this.selArrs = [];
            for (var i in this.pdlist) {
                if (this.pdlist[i].selFlag) {
                    this.selArrs.push(this.pdlist[i].id);
                }
            }
            if (!this.selArrs.length) {
                fn.showTip('请先选择店员');
            } else {
                console.log('选择后的店员：', this.selArrs)
                if (this.selArrs.length > this.surpluCount) {
                    fn.showTip('门店只有 ' + this.surpluCount + ' 个剩余名额');
                } else {

                    this.getShopUsers();
                }

            }

        },


        //确认选择店员
        getShopUsers() {
            var _self = this;
            var selIds = this.selArrs.join(',');

            var params = {
                personIds: selIds
            }
            //alert(selIds);
            Service.getActivesPersons('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                //alert(data.code)
                if (data.code == 200) {

                    _self.isShowShopUser = false;
                    _self.newMemberList = data.data;
                    for (var i in _self.newMemberList) {
                        _self.newMemberList[i].itemId = _self.itemsVOList.length ? _self.itemsVOList[0].id : '';
                        _self.newMemberList[i].isShowMask = false
                    }


                }
            }))
        },

        //判断信息
        chackInfo() {
            for (var i in this.memberList) {
                if (!this.memberList[i].itemId) {
                    fn.showTip("参与活动项目必填");
                    return false;
                }

            }
            for (var i in this.newMemberList) {
                if (!this.newMemberList[i].itemId) {
                    fn.showTip("参与活动项目必填");
                    return false;
                }

            }
            if (this.activeInfo.joinFlag == 1) {
                console.log('this.newMemberList：', this.newMemberList);
                for (var i in this.newMemberList) {
                    if (!this.newMemberList[i].personImg) {
                        fn.showTip("参赛照片必填");
                        return false;
                    }

                    if (!this.newMemberList[i].personIntro) {
                        fn.showTip("店员简介必填");
                        return false;
                    }

                }
            }
            return true;
        },

        //确认店员信息生成订单
        surShopUserInfo() {
            if (!this.chackInfo()) {
                return false;
            }
            var joins = this.newMemberList;
            for (var i in this.memberList) {
                if (!this.memberList[i].payStatus) {
                    joins.push(this.memberList[i]);
                }
            }

            var _self = this;
            var params = {
                activityId: tempJson.id ? tempJson.id : "",
                joins: joins
                //joins: this.memberList
            }

            Service.joinActive('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    console.log(data.data)
                    _self.payInfo = data.data;
                    _self.newMemberList = [];

                    _self.selArrs = [];
                    for (var i in _self.pdlist) {
                        _self.pdlist[i].selFlag = false;
                    }

                    if (_self.payInfo.freePay) {
                        fn.showTip('报名成功', 'activeDetail.html?id=' + (tempJson.id ? tempJson.id : ""));
                    } else {
                        _self.isShowTwo = true;
                    }

                }

            }))
        },
        //获取详情
        getDetail() {
            var _self = this;
            _self.restPay = [];
            var params = {
                activityId: tempJson.id ? tempJson.id : ""
            }
            Service.getActiveDetail('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.activeInfo = data.data;


                    _self.surpluCount = data.data.surpluCount;
                    _self.itemsVOList = data.data.itemsVOList;
                    _self.activeInfo.beginDate = _self.activeInfo.beginDate ? fn.formatTime(_self.activeInfo.beginDate, 'Y-M-D') : "";
                    _self.activeInfo.endDate = _self.activeInfo.endDate ? fn.formatTime(_self.activeInfo.endDate, 'Y-M-D') : "";

                    _self.activeInfo.describe = _self.activeInfo.describe ? fn.replaceStr(_self.activeInfo.describe) : '暂无详情';
                    // console.log(_self.activeInfo.describe)
                    var listData = data.data.activitesJoinInfoVOs;
                    for (var i in listData) {
                        listData[i].isEdit = false;
                    }
                    _self.memberList = listData;
                    for (var i in _self.memberList) {

                        if (!_self.memberList[i].payStatus) {
                            _self.restPay.push(_self.memberList[i]);
                        }
                    }
                    document.getElementById("appContent").style.display = "block";
                    setTimeout(function() {
                        var title = _self.activeInfo.title,
                            //desc = _self.info.content ? fn.replaceStr(_self.info.content) : '暂无详情',
                            desc = '由福耀集团发起、以“福耀精神、福耀天下”为主题的CARG 大活动，于2020年10月在福清举办，活动中的“汽车玻璃技能大赛”（简称：技师大赛）由福建易道大咖商业管理有限公司承办，现将报名和参赛的相关事项通知如下：',
                            link = window.location.href,
                            imgUrl = _self.activeInfo.imagePath ? _self.activeInfo.imagePath : WebHost + 'images/logo.png';
                        desc = desc.replace(/<!--[^>]*-->/gi, "");
                        //  console.log(desc)
                        console.log(imgUrl)
                        toShare(title, desc, link, imgUrl)
                    }, 30)
                }
            }))
        },

        //上传图片
        btnUploadFile(index, type) {
            $('.active-user').eq(index).find(".noPass").hide();

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
                if (type == 1) {
                    _self.memberList[index].isShowMask = true;
                } else {
                    _self.newMemberList[index].isShowMask = true;
                }

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

                                if (type == 1) {
                                    _self.memberList[index].personImg = data.data.webPath;
                                    _self.memberList[index].isShowMask = false;;
                                } else {
                                    _self.newMemberList[index].personImg = data.data.webPath;
                                    _self.newMemberList[index].isShowMask = false;;
                                }

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


                            if (type == 1) {
                                _self.memberList[index].personImg = data.data.webPath;
                                _self.memberList[index].isShowMask = false;
                            } else {
                                _self.newMemberList[index].personImg = data.data.webPath;
                                _self.newMemberList[index].isShowMask = false;
                            }
                        }
                    }))
                }

                setTimeout(function() {
                    if (type == 1) {
                        _self.memberList[index].isShowMask = false;
                    } else {
                        _self.newMemberList[index].isShowMask = false;
                    }

                }, 10000)
            }
            reader.readAsDataURL(imgFile);
        },


        //取消入库的活动
        cancelActive(e) {
            var _self = this;
            fn.commonWindowSur('确定此店员取消本次活动？')
            $('.commonBtn_suc').on('click', function() {
                var params = {
                    activityId: tempJson.id ? tempJson.id : "",
                    personId: e.personId,
                    itemId: e.itemId
                }
                Service.cancelActive('POST', JSON.stringify(params), (function callback(data) {
                    if (data.code == 200) {
                        //console.log(data.data);
                        $('.workInfo, .mark, ._loading').remove();
                        _self.newMemberList = [];
                        _self.getDetail();
                        fn.showTip(data.message);
                    }
                }))
            })
        },

        //取消支付
        pre() {
            this.newMemberList = [];
            this.getDetail();
            this.isShowTwo = false;
        },

        //支付
        payOrder() {
            var _self = this;

            var params = {
                "ip": "",
                "openId": this.openId,
                "activityId": tempJson.id ? tempJson.id : "",
                "payType": "JSAPI"
            };
            Service.payActive('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                    _self.appId = data.data.appId;
                    _self.nonceStr = data.data.nonceStr;
                    _self.package = data.data.packageValue;
                    _self.paySign = data.data.paySign;
                    _self.signType = data.data.signType;
                    _self.timeStamp = data.data.timeStamp;
                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady',
                                _self.onBridgeReady, false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady',
                                _self.onBridgeReady);
                            document.attachEvent('onWeixinJSBridgeReady',
                                _self.onBridgeReady);
                        }
                    } else {
                        _self.onBridgeReady();
                    }

                }
            }))
        },
        onBridgeReady() {
            var _self = this;
            WeixinJSBridge.invoke('getBrandWCPayRequest', {
                    "appId": _self.appId, //公众号名称,由商户传入     
                    "timeStamp": _self.timeStamp, //时间戳,自1970年以来的秒数     
                    "nonceStr": _self.nonceStr, //随机串     
                    "package": _self.package,
                    "signType": _self.signType, //微信签名方式：     
                    "paySign": _self.paySign //微信签名 
                },
                function(res) {
                    _self.getDetail();
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        fn.showTip('支付成功', 'activeDetail.html?id=' + (tempJson.id ? tempJson.id : ""));
                        //支付成功后跳转的页面
                    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                        fn.showTip('支付取消');
                    } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                        fn.showTip('支付失败');
                        WeixinJSBridge.call('closeWindow');
                    } //使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok,但并不保证它绝对可靠。
                });
        }



    },
    mounted: function() {

        var _self = this;
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
        this.getDetail();
        this.getShopUserList();
        //初始化vue后,显示vue模板布局
        // setTimeout(function() {
        //     document.getElementById("appContent").style.display = "block";
        // }, 300)
    }
})