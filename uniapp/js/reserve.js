var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var userInfo = { token : ""};
var map = new BMap.Map("container");
var localSearch = new BMap.LocalSearch(map);
//创建vue对象
var vm = new Vue({
    el: "#app",
    data: {
        step1: true,
        step2: false,
        step3: false,
        subFlag: true,
        name: "",
        mobile: "",
        serviceType: "",
        carList: [],
        arrWords: [],
        carTypeList: [],
        carInfoList: [],
        carType: "",
        carInfoId: "",
        brandId: '',
        provSelected: "京",
        carNo: "",
        provList: [{
                code: '京',
                province: '北京'
            },
            {
                code: '津',
                province: '天津'
            },
            {
                code: '沪',
                province: '上海'
            },
            {
                code: '渝',
                province: '重庆'
            },
            {
                code: '冀',
                province: '河北'
            },
            {
                code: '豫',
                province: '河南'
            },

            {
                code: '云',
                province: '云南'
            },
            {
                code: '辽',
                province: '辽宁'
            },
            {
                code: '黑',
                province: '黑龙江'
            },
            {
                code: '湘',
                province: '湖南'
            },
            {
                code: '皖',
                province: '安徽'
            },
            {
                code: '鲁',
                province: '山东'
            },

            {
                code: '新',
                province: '新疆'
            },
            {
                code: '苏',
                province: '江苏'
            },
            {
                code: '浙',
                province: '浙江'
            },
            {
                code: '赣',
                province: '江西'
            },
            {
                code: '鄂',
                province: '湖北'
            },
            {
                code: '桂',
                province: '广西'
            },

            {
                code: '甘',
                province: '甘肃'
            },
            {
                code: '晋',
                province: '山西'
            },
            {
                code: '蒙',
                province: '内蒙古'
            },
            {
                code: '陕',
                province: '陕西'
            },
            {
                code: '吉',
                province: '吉林'
            },
            {
                code: '闽',
                province: '福建'
            },


            {
                code: '贵',
                province: '贵州'
            },
            {
                code: '粤',
                province: '广东'
            },
            {
                code: '青',
                province: '青海'
            },
            {
                code: '藏',
                province: '西藏'
            },
            {
                code: '川',
                province: '四川'
            },
            {
                code: '宁',
                province: '宁夏'
            },
            {
                code: '琼',
                province: '海南'
            },
            {
                code: '使',
                province: '大使馆'
            },
            {
                code: '领',
                province: '领士馆'
            }
        ],
        remarks: ""

    },
    methods: {


        //小写转大写
        toUpperCase(e) {
            // console.log('e：',e.toUpperCase())
            this.carNo = e.toUpperCase();
        },
        //显示车型库信息
        cngCarType() {
            this.step1 = false;
            this.step2 = true;
        },

        //车辆列表
        getCarList() {
            var _self = this;
            var params = {
                token: userInfo.token 
            }
            Service.getBrandList('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.carList = data.data;
                    if (data.data.length) {
                        var firstletter = []
                        for (var i = 0; i < data.data.length; i++) {
                            firstletter.push(data.data[i].firstletter)
                        }
                        _self.arrWords = fn.uniqArrs(firstletter);
                    }


                    console.log(_self.arrWords)
                }
            }))
        },

        //得到车型
        getCarTypeList() {
            var _self = this;
            var params = {
                token: userInfo.token,
                brandId: this.brandId
            }
            Service.getCarSeriesList('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.carTypeList = data.data;
                    _self.step1 = false;
                    _self.step2 = false;
                    _self.step3 = true;
                    _self.step4 = false;
                    _self.step5 = false;
                }
            }))
        },

        //选择车辆
        cngCar(e) {
            this.brandId = e.id;
            this.getCarTypeList();

        },
        //隐藏
        hideMask() {
            $('.mask').hide();
            $('.showCarType').hide();
            $('.showCarType').css({ "left": "100%" });
        },


        //选择车型
        surCarType(e) {
            var _self = this;
            $('.mask').show();
            var serId = e.id;
            var params = {
                token: userInfo.token,
                seriesId: serId
            }
            Service.getCarSeries('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.carInfoList = data.data;
                }
            }))
            $('.showCarType').show().animate({ "left": "40%" }, 300);

        },

        //选择车型车辆
        selCarType(e) {
            console.log(e);
            this.carType = e.fullName;
            this.carInfoId = e.id;
            this.hideMask();
            this.step1 = true;
            this.step2 = false;
            this.step3 = false;
        },



        //判断信息
        chackInfo() {
            if (!this.name) {
                fn.showTip("客户姓名不能为空");
                return false;
            }

            if (!this.mobile) {
                fn.showTip("联系电话不能为空");
                return false;
            }
            if (!fn.testRule.isTel(this.mobile)) {
                fn.showTip("请正确输入联系电话");
                return false;
            }
            if (!this.serviceType) {
                fn.showTip("请选择服务类型");
                return false;
            }
            return true;
        },

        //提交勘验单
        add() {
            if (!this.chackInfo()) {
                return false;
            }
            var _self = this;

            var params = {
                "carNo": this.provSelected + this.carNo,
                "carType": this.carType,
                "mobile": this.mobile,
                "name": this.name,
                "remarks": this.remarks,
                "serviceType": this.serviceType
            }
            console.log("参数请求：", params)
            if (_self.subFlag) {
                _self.subFlag = false;
                Service.subReservationService('POST', JSON.stringify(params), (function callback(data) {
                    //console.log("数据：", data)
                    if (data.code == 200) {
                        _self.subFlag = true;
                        // _self.carNo = "";
                        // _self.carType = "";
                        // _self.name = "";
                        // _self.mobile = "";
                        // _self.remarks = "";
                        // _self.serviceType = "";
                        fn.showTip("提交成功",'reserveSuc.html');
                        //fn.showTip("提交成功", 'reserve.html');
                    }
                }))
                setTimeout(function() {
                    _self.subFlag = true;
                }, 3000)
            }
        }
    },
    mounted: function() {
        var _self = this;
        // this.getShopUserList();
        this.getCarList();
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
            $('body').on('click', '.letter a', function() {
                var s = $(this).html();
                $(window).scrollTop($('#' + s + '1').offset().top);
                // console.log($('#' + s + '1'));
                $("#showLetter span").html(s);
                $("#showLetter").show().delay(500).hide(0);
            });
        }, 300)
    },

    computed: {


    }
});