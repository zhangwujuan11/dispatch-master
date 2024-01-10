var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var userInfo = { token: "" };

var data = {
    dateCode: "",
    openId: "",
    accountType: "",
    provList: [],
    cityList: [],
    zoneList: [],
    certiInfo: {
        "cityId": "",
        "zoneId": "",
        "name": "",
        "statesId": "",
        "pageNo": 1,
        "pageSize": 999
    }
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {


        //获取省份列表数据
        getProvList() {
            var _self = this;
            var params = {};
            Service.getProvList('GET', params, (function callback(data) {
               // console.log("=====数据：", data.data)
                if (data.code == 200) {
                    _self.provList = data.data;
                    setTimeout(function() {
                        document.getElementById("appContent").style.display = "block";
                    }, 10)

                }
            }))
        },

        //获取城市列表数据
        getCityList() {
            var _self = this;
            var params = {
                "statesId" : this.certiInfo.statesId
            };
            Service.getCityList('GET', params, (function callback(data) {
                //console.log("=====数据：", data.data)
                if (data.code == 200) {
                    _self.cityList = data.data;

                }
            }))
        },

        //获取区域列表数据
        getZoneList() {
            var _self = this;
            var params = {
                "cityId" : this.certiInfo.cityId
            };
            Service.getZoneList('GET', params, (function callback(data) {
               // console.log("=====数据：", data.data)
                if (data.code == 200) {
                    _self.zoneList = data.data;

                }
            }))
        },


        //选择省份
        cngProv(e) {
            this.certiInfo.statesId="";
            this.certiInfo.cityId = "";
            this.certiInfo.zoneId = "";
            this.certiInfo.statesId = e.target.value;
            console.log(this.certiInfo.statesId)
            if(this.certiInfo.statesId){
              this.getCityList();  
            }
            
        },

        //选择市
        cngCity(e) {
            this.certiInfo.cityId = "";
            this.certiInfo.zoneId = "";
            this.certiInfo.cityId = e.target.value;
            
            console.log(this.certiInfo.cityId)
            if(this.certiInfo.cityId){
                this.getZoneList();
            }
            
        },

        //选择区
        cngZone(e) {
            this.certiInfo.zoneId = "";
             this.certiInfo.zoneId = e.target.value;
              console.log(this.certiInfo.zoneId)
        },
        //判断信息
        chackInfo() {
            if (!this.certiInfo.statesId && !this.certiInfo.cityId && !this.certiInfo.zoneId && !this.certiInfo.name) {
                fn.showTip("请至少选择一项！");
                return false;
            }

            return true;
        },

        srhCerti() {
            if (!this.chackInfo()) {
                return false;
            }
            var rstData = [];
            var params = this.certiInfo;
            Service.queryAuditCert('POST', JSON.stringify(params), (function callback(data) {
                console.log("数据：", data)

                if (data.code == 200) {
                    if(data.data.length){
                        rstData = data.data;
                        window.localStorage.setItem("rstData", JSON.stringify(rstData));
                        window.location.href="certiRst.html";
                    }else{
                        fn.showTip('暂无相关门店证书！')
                    }
                    
                }
            }))


        }


    },
    mounted: function() {
        this.accountType = userInfo.accountType ? userInfo.accountType : 0;
        var _self = this;
        // this.wxOauth();
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
        this.getProvList();
        //初始化vue后,显示vue模板布局
        // setTimeout(function() {

        //     document.getElementById("appContent").style.display = "block";
        // }, 300)
    }
})