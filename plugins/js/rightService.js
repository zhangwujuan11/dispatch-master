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
            window.location.href="cardQueryMember.html?cardId=" + e
        },
        //权益卡详情
        viewDetail(e){
            window.location.href="cardDetail.html?cardId=" + e
        },
        //跳转权益订单
        toCardOrderList(){
            window.location.href="cardOrderList.html"
        },
        //跳转待支付权益订单
        toCardPayOrderList(){
            window.location.href="cardPayOrderList.html"
        },

    },
    mounted: function() {
        var _self = this;
        var params = {}
        Service.getRightCardList('GET', params, (function callback(data) {
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