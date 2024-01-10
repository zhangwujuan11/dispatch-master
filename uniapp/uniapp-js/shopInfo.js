var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    accountType: "",
    imgShopZero: {
        imgPath: '',
        name: '营业执照',
        isShowMask: false,
        id: ''
    },
    imgShopOne: {
        imgPath: '',
        name: '休息区',
        isShowMask: false,
        id: ''
    },
    imgShopTwo: {
        imgPath: '',
        name: '门头',
        isShowMask: false,
        id: ''
    },
    imgShopThree: {
        imgPath: '',
        name: '前台区',
        isShowMask: false,
        id: ''
    },
    imgShopFour: {
        imgPath: '',
        name: '施工区',
        isShowMask: false,
        id: ''
    },
    imgShopFive: {
        imgPath: '',
        name: '团队',
        isShowMask: false,
        id: ''
    },
    shopInfo: {},
    shopSettlementVOList:[]
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //获取数据
        getShopDetail() {
            var _self = this;
            var params = {};
            Service.getShopDetail('GET', params, (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                    _self.shopInfo = data.data;
                    // if(_self.shopInfo.taskPrice){
                    //    _self.shopInfo.taskPrice = fn.format_number(_self.shopInfo.taskPrice) 
                    // }
                    if (_self.shopInfo.shopImgs) {
                        for (var i in _self.shopInfo.shopImgs) {
                            if (_self.shopInfo.shopImgs[i].name == "营业执照") {
                                _self.imgShopZero = _self.shopInfo.shopImgs[i]
                                _self.imgShopZero.isShowMask = false;
                            } else if (_self.shopInfo.shopImgs[i].name == "休息区") {
                                _self.imgShopOne = _self.shopInfo.shopImgs[i]
                                _self.imgShopOne.isShowMask = false;
                            } else if (_self.shopInfo.shopImgs[i].name == "门头") {
                                _self.imgShopTwo = _self.shopInfo.shopImgs[i];
                                _self.imgShopTwo.isShowMask = false;
                            } else if (_self.shopInfo.shopImgs[i].name == "前台区") {
                                _self.imgShopThree = _self.shopInfo.shopImgs[i]
                                _self.imgShopThree.isShowMask = false;
                            } else if (_self.shopInfo.shopImgs[i].name == "施工区") {
                                _self.imgShopFour = _self.shopInfo.shopImgs[i]
                                _self.imgShopFour.isShowMask = false;
                            } else if (_self.shopInfo.shopImgs[i].name == "团队") {
                                _self.imgShopFive = _self.shopInfo.shopImgs[i]
                                _self.imgShopFive.isShowMask = false;
                            }
                        }
                    }
                    if(_self.shopInfo.shopSettlementVOList.length){
                        _self.shopSettlementVOList = _self.shopInfo.shopSettlementVOList;
                    }
                }
            }))
        },
        //跳转编辑门店页面
        editShopInfo() {
            window.location.href = "editShopInfo.html";
        },
        //跳转修改密码页面
        changePwd() {
            window.location.href = "resetPwd.html";
        },
        //注销用户
        logout() {
            var params = {
                token: userInfo.token
            }
            Service.logout('POST', JSON.stringify(params), (function callback(data) {
                if (data.code == 200) {
                    window.localStorage.setItem("userInfo", "");
                    window.localStorage.clear();
                    window.location.href = "login.html";
                }
            }))
        }


    },
    mounted: function() {
        var _self = this;
        this.accountType = userInfo.accountType ? userInfo.accountType : 0;
        this.getShopDetail();
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})