var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    showSubUp: false,
    settleInfo: {},
    shopSettlement:{},
    expressDetail:{},
    singleFlag:"0",
    showMoreCharge: false

}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //展开更多 
        showMore(){
            this.showMoreCharge = !this.showMoreCharge
        },
        //结算子订单
        toSubList(e){
             window.location.href="settleSubList.html?realId=" + e.settlementSn + "&settlementStatus=" + e.settlementStatus ;
        },
        //发票快递 
        toSettleSend(e){
             window.location.href="settleSend.html?realId=" + e.settlementSn;
        }
       

    },
    mounted: function() {
        //alert(fn.versions.ios)
        var _self = this;
        var settlementSn = tempJson.realId ? tempJson.realId : "";
        if (settlementSn) {
            var params = {
                settlementSn: settlementSn
            }
            Service.getOrderSettleDetail('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.settleInfo = data.data;

                    _self.shopSettlement = data.data.shopSettlement ? data.data.shopSettlement : {};
                    _self.expressDetail = data.data.expressDetail ? data.data.expressDetail : {};
                }
            }))
        }

        
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
           
        }, 300)
    }
})