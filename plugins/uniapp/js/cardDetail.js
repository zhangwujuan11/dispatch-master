var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    cardInfo: {},

    safeguards:[],
    agreeFlag: true,
    arrCardTit: ["产品介绍", "购买须知", "理赔服务"],
    currentIndex: 0
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //获取权益卡详情
        getData() {
            var _self = this;
            var params = { id : tempJson.cardId ? tempJson.cardId : ""};
            Service.getRightCardDetail('GET', params, (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                    _self.cardInfo = data.data;
                    _self.cardInfo.content = fn.replaceStr(_self.cardInfo.content)
                    _self.safeguards = _self.cardInfo.safeguards;
                }
            }))
        },
        //是否同意
        cngAgree() {
            this.agreeFlag = !this.agreeFlag;
        },
        //切换Title
        cngTitle(e) {
            this.currentIndex = e;
        },
        //立即购买
        buyCard() {
            window.location.href = "cardQueryMember.html?cardId=" + (tempJson.cardId ? tempJson.cardId : "")
        }

    },
    mounted: function() {
        var _self = this;
        this.getData();
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})