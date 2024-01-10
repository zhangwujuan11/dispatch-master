var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var userInfo = { token : ""};

var data = {
    openId: '',
    shopInfo: {},
    carNo:"",
    securityCode:""
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //获取门店认证信息
        getShopAuditDetail() {
            var _self = this;
            
            var params = {};
            Service.getShopAuditDetail('GET', params, (function callback(data) {
                if (data.code == 200) {
                    document.getElementById("appContent").style.display = "block";
                    _self.shopInfo = data.data;
                }

            }))
        },

        //判断信息
        chackInfo() {
            if (!this.securityCode) {
                fn.showTip("防伪编号不能为空!");
                return false;
            }
            
            return true;
        },
        //去考试 
        query(){
            var _self = this;
            if (!this.chackInfo()) {
                return false;
            }
            
            var params = {
                "carNo": this.carNo,
                "securityCode": this.securityCode
            }
            Service.queryUserSecurityCode('POST', JSON.stringify(params), (function callback(data) {
                if (data.code == 200) {
                    console.log(data.data);

                    if(!data.data.securityCode){
                        fn.showTip('没有查询到您的防伪编码！')  
                    }else {
                        window.location.href = "qualityDetail.html?carNo=" + _self.carNo + '&securityCode=' + _self.securityCode;
                      
                    }
                    
                }
            }))

            
        }
    },
    mounted: function() {
        var _self = this;
       // this.getShopAuditDetail();
        
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})