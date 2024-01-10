var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    showSubUp: false,
    memberInfo: {
        bandType: "",
        birthday: "",
        carColor: "",
        carGlassId: 0,
        carInfoId: 0,
        carNo: "",
        mobile: "",
        name: "",
        sex: "",
        userId: 0,
        vin: "",
        fdjNo: "",
        address: ""
    },
    drivingPic: "",
    provSelected: "京",
    carNo: "",
    provList: ['京', '津', '沪', '渝', '冀', '豫', '云', '辽', '黑', '湘', '皖', '鲁', '新', '苏', '浙', '赣', '鄂', '桂', '甘', '晋', '蒙', '陕', '吉', '闽', '贵', '粤', '青', '藏', '川', '宁', '琼', '使', '领']
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {

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
                            _self.drivingPic = $('.matchImg').attr("src", localData);
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
                                    if (_self.memberInfo.carNo == data.data.carNo) {
                                        _self.memberInfo.name = data.data.userName;
                                        _self.memberInfo.carNo = data.data.carNo;
                                        _self.memberInfo.vin = data.data.vin;
                                        _self.memberInfo.address = data.data.address;
                                        _self.memberInfo.fdjNo = data.data.fdjNo;
                                        _self.carNo = data.data.carNo.substring(1);
                                        _self.provSelected = data.data.carNo.substring(0, 1)
                                    } else {
                                        _self.drivingPic = "";
                                        fn.showTip('请上传与系统车牌号信息一致的行驶证!')
                                    }

                                }
                            }))
                        }
                    });
                }
            });

            //测试环境用
            // var localData = "";
            // $('.matchImg').attr("src", localData);
            // _self.drivingPic = $('.matchImg').attr("src", localData);
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
        //获取驾驶证信息
        getDrivingPicInfo() {
            var _self = this;
            _self.drivingPic = tempJson.drivingPic ? tempJson.drivingPic : "";
            if (_self.drivingPic) {
                var params = {
                    base64Data: _self.drivingPic,
                    token: userInfo.token
                }
                Service.readDrivingLicense('POST', JSON.stringify(params), (function callback(data) {
                    if (data.code == 200) {
                        console.log(data.data);
                        if (_self.memberInfo.carNo == data.data.carNo) {
                            _self.memberInfo.name = data.data.userName;
                            _self.memberInfo.carNo = data.data.carNo;
                            _self.memberInfo.vin = data.data.vin;
                            _self.memberInfo.address = data.data.address;
                            _self.memberInfo.fdjNo = data.data.fdjNo;
                            _self.carNo = data.data.carNo.substring(1);
                            _self.provSelected = data.data.carNo.substring(0, 1)
                        } else {
                            _self.drivingPic = "";
                            fn.showTip('请上传与系统车牌号信息一致的行驶证!')
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
            var kw = tempJson.kw ? tempJson.kw : "";
            window.location.href = "queryCar.html?kw=" + kw + "&drivingPic=" + this.drivingPic;
        },
        //判断信息
        chackInfo() {
            if (!this.memberInfo.carNo) {
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

            return true;
        },
        //确定编辑
        updateMember() {
            if (!this.chackInfo()) {
                return false;
            }
            //this.memberInfo.carNo = this.provSelected + this.carNo;
            var params = this.memberInfo
            Service.updateMember('POST', JSON.stringify(params), (function callback(data) {
                if (data.code == 200) {
                    console.log(data.data);
                    fn.showTip("编辑成功", 'member.html?kw=' + (tempJson.kw ? tempJson.kw : ""));
                }
            }))
        }

    },
    mounted: function() {
        //alert(fn.versions.ios)
        var _self = this;
        var params = {
            kw: tempJson.kw ? tempJson.kw : ""
        }
        Service.queryMember('POST', JSON.stringify(params), (function callback(data) {
            console.log("=====数据：", data)
            if (data.code == 200) {
                document.getElementById("appContent").style.display = "block";
                _self.memberInfo = data.data;
                _self.memberInfo.userId = data.data.id;
                //车型选择
                if (tempJson.carType) {
                    _self.memberInfo.bandType = tempJson.carType
                }
                //存在车型ID
                if (tempJson.carInfoId) {
                    _self.memberInfo.carInfoId = tempJson.carInfoId
                }
                // if (data.data.carNo) {
                //     _self.provSelected = data.data.carNo.substring(0, 1);
                //     _self.carNo = data.data.carNo.substring(1);
                // }

                if (_self.memberInfo.birthday) {
                    _self.memberInfo.birthday = fn.formatTime(_self.memberInfo.birthday, 'Y-M-D');
                } else {
                    _self.memberInfo.birthday = fn.formatTime(new Date(), 'Y-M-D');
                }
                if (_self.memberInfo.rightsSta) {
                    _self.memberInfo.rightsSta = fn.formatTime(_self.memberInfo.rightsSta, 'Y-M-D');
                    _self.memberInfo.rightsEnd = fn.formatTime(_self.memberInfo.rightsEnd, 'Y-M-D');
                }

                _self.getDrivingPicInfo();
                for (var i = 0; i < $('.sex').length; i++) {
                    if (_self.memberInfo.sex == $('.sex').eq(i).html()) {
                        $('.sex').eq(i).parent().find('.iconRadio').addClass('iconOk')
                    }
                }


            }
        }))

        //性别选择
        $('.sexSelect li').on('click', function() {
            $(this).find('.iconRadio').addClass("iconOk")
                .parent().siblings().find('.iconRadio').removeClass("iconOk");
            _self.memberInfo.sex = $(this).find('span').html();

        })
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            //document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})