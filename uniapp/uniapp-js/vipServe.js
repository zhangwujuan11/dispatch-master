var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
  cardList : []
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //购买权益卡
        buyCard(e){
            window.location.href="cardServe.html?cardId=" + e
        },
        //权益卡详情
        viewDetail(e){
			console.log(e)
            window.location.href="cardDetailserve.html?cardId=" + e
        },
        //跳转权益订单
        toCardOrderList(){
            // window.location.href="cardOrderList.html"
            window.location.href="cardOrderserve.html"
        },
        //跳转待支付权益订单
        toCardPayOrderList(){
            // window.location.href="cardPayOrderList.html"
            window.location.href="cardPayOrderserve.html"
        },

    },
    mounted: function() {
        var _self = this;
        var params = {
        	"openId":window.localStorage.getItem("openId")//正式
        }
        Service.getRightCardserve('GET', params, (function callback(data) {
            console.log("=====数据：", data)
            if (data.code == 200) {
                _self.cardList = data.data;
                document.getElementById("appContent").style.display = "block";
            }
        }))
        //初始化vue后,显示vue模板布局
        // setTimeout(function() {
        //     document.getElementById("appContent").style.display = "block";
        // }, 300)
    }
})