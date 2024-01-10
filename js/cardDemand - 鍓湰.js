var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    showStepTwo: false,
    dateCode : "",
    memberInfo: {
        bandType: "",
        birthday: "",
        carColor: "",
        carGlassId: "",
        carInfoId: "",
        carNo: "",
        mobile: "",
        name: "",
        sex: "",
        userId: "",
        vin: "",
        fdjNo: "",
        address: ""
    },
    provSelected: "京",
    carNo: "",
    provList: ['京', '津', '沪', '渝', '冀', '豫', '云', '辽', '黑', '湘', '皖', '鲁', '新', '苏', '浙', '赣', '鄂', '桂', '甘', '晋', '蒙', '陕', '吉', '闽', '贵', '粤', '青', '藏', '川', '宁', '琼', '使', '领'],
    cardInfo: {},
    yearPrice: "",
    rcpLists: []
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //获取今日码
        getDatecode(){
            var _self = this;
            var params = {};
            Service.getDatecode('GET',params, (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                  _self.dateCode = data.data;  
                }
            }))
        },
        //获取权益卡详情
        getData() {
            var _self = this;
            var params = { id: tempJson.cardId ? tempJson.cardId : "" };
            Service.getRightCardDetail('GET', params, (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                    _self.cardInfo = data.data;
                    _self.rcpLists = data.data.rcpLists;
                    _self.rcpLists.sort(fn.sortBy('year'));
                }
            }))
        },
        //上传图片
        upImg() {
            var _self = this;
            //正式环境用
            wx.chooseImage({
                count: 1, // 默认9
                //sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sizeType: ['original'],
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
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
                                    $('.matchImg').attr("src", localData);
                                }
                            }
                            $('.matchImg').attr("src", localData);
                            // if (localData.split(",")[0] != base64) {
                            //     localData = base64Jpg + "," + localData;
                            //     $('.matchImg').attr("src", localData);
                            // } else {
                            //     $('.matchImg').attr("src", localData);
                            // }
                            var params = {
                                base64Data: $('.matchImg').attr('src'),
                                token: userInfo.token
                            }
                            Service.readDrivingLicense('POST', JSON.stringify(params), (function callback(data) {
                                if (data.code == 200) {
                                    console.log(data.data);
                                    _self.memberInfo.name = data.data.userName;
                                    _self.memberInfo.carNo = data.data.carNo;
                                    _self.memberInfo.vin = data.data.vin;
                                    _self.memberInfo.address = data.data.address;
                                    _self.memberInfo.fdjNo = data.data.fdjNo;
                                    _self.carNo = data.data.carNo.substring(1);
                                    _self.provSelected = data.data.carNo.substring(0, 1)
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
            var cardId = tempJson.cardId ? tempJson.cardId : "";
            window.location.href = "queryCar.html?returnUrl=cardDemand.html&cardId=" + cardId;
        },
        //判断信息
        chackInfo() {
            if (!this.memberInfo.bandType) {
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
            if (!this.memberInfo.name) {
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
            if (!this.yearPrice) {
                fn.showTip("请选择保障期限");
                return false;
            }
            return true;
        },
        //确定编辑
        updateMember() {
            if (!this.chackInfo()) {
                return false;
            }

            this.memberInfo.carInfoId = tempJson.carInfoId ? tempJson.carInfoId : '',
            this.memberInfo.carNo = this.provSelected + this.carNo;
            this.memberInfo.dateCode = this.dateCode;
            this.memberInfo.price = this.yearPrice.split(',')[1],
            this.memberInfo.rightCardId = tempJson.cardId ? tempJson.cardId : '',
            this.memberInfo.year= this.yearPrice.split(',')[0]

            var params = this.memberInfo
            console.log('params：', params)
            Service.addUserRightCardOrder('POST', JSON.stringify(params), (function callback(data) {
                if (data.code == 200) {
                    console.log(data.data);
                    window.location.href = "cardOrder.html?orderSn=" + data.data;
                }
            }))
        },
        //下一步
        next() {

            this.showStepTwo = true;
        },

        //上一步
        pre() {

            this.showStepTwo = false;
        },
        //立即提交
        // buyCard() {
        //     window.location.href = "cardOrder.html"
        // }



    },
    mounted: function() {
        var _self = this;
        this.getData();
        //性别选择
        $('.sexSelect li').on('click', function() {
            $(this).find('.iconRadio').addClass("iconOk")
                .parent().siblings().find('.iconRadio').removeClass("iconOk");
            _self.memberInfo.sex = $(this).find('span').html();

        })
        //车型选择
        if (tempJson.carType) {
            _self.memberInfo.bandType = tempJson.carType ?tempJson.carType : '';
        }

        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            _self.getDatecode();
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})