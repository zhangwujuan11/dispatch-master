var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    kw: "",
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //判断信息
        chackInfo() {
            if (!this.kw) {
                fn.showTip("车牌号不能为空");
                return false;
            }
            return true;
        },
        //小写转大写
        toUpperCase(e) {
            this.kw = e.toUpperCase();
        },
        //会员查询
        query() {
            if (!this.chackInfo()) {
                return false;
            }
            var _self = this;
            var params = {
                carNo: this.kw,
               "openId":window.localStorage.getItem("openId")//正式
            }
            Service.queryserve('POST', JSON.stringify(params), (function callback(data) {
                if (data.code == 200) {
					console.log(data)
                    // window.location.href = "claimserve.html?carNo=" + _self.kw +'&cardId=' + (tempJson.cardId ? tempJson.cardId : "");
                    window.location.href = "cardOrder.html?carNo=" + _self.kw +'&cardId=' + (tempJson.cardId ? tempJson.cardId : "");
                }
            }))
        }
    },
    mounted: function() {
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})