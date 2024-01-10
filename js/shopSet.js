var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
  shopInfo : {}
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //获取数据
        getShopDetail(){
            var _self = this;
            var params = {};
            Service.getShopDetail('GET',params, (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                  _self.shopInfo = data.data;  
                }
            }))
        },
        //跳转权益订单
        toCardOrderList(){
            window.location.href="cardOrderList.html"
        },
        //跳转待支付权益订单
        toCardPayOrderList(){
            window.location.href="cardPayOrderList.html"
        },
        //跳转到门店信息
        toShop(){
            window.location.href="shopInfo.html"
        },
        //跳转到待结算列表
        toSettle(){
            window.location.href="settleSel.html"
        },
        //跳转到结算单位 
        toUnitCharge(){
            window.location.href="unitCharge.html"
        },
        //跳转到门店店员管理
        toShopManage(){
            window.location.href="shopUserManager.html"
        },
        //跳转到销售单据
        toSale(){
           window.location.href="saleList.html" 
       },
       //跳转到二维码配置
       toCodePay(){
        window.location.href="codePay.html" 
       },
        //跳转到门店信息
        cngPwd(){
            window.location.href="resetPwd.html"
        },
        //注销用户
        logout(){
            var params = {
                token: userInfo.token
            }
            Service.logout('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    //window.localStorage.clear();
                    window.localStorage.setItem("userInfo", "");
                    //window.localStorage.setItem("openId", "");
                    window.location.href="login.html";
                }
            }))
        }
    },
    mounted: function() {
        var _self = this;
        //this.getShopDetail();
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})