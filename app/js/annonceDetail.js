var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    annonceInfo: {},
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //获取详情
        getDetail() {
            var _self = this;
            var params = {
                id: tempJson.id.split("?")[0] ? tempJson.id.split("?")[0] : ""
            }
            Service.getNoteDetail('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.annonceInfo = data.data;
                    _self.annonceInfo.createDate = fn.formatTime(_self.annonceInfo.createDate, "Y-M-D");
                    _self.annonceInfo.describe = _self.annonceInfo.describe ? fn.replaceStr(_self.annonceInfo.describe) : '暂无详情';

                }
            }))
        },

    },
    created() {
        fn.routeQuery(tempJson)
    },
    mounted: function () {
        this.getDetail();
        //初始化vue后,显示vue模板布局
        setTimeout(function () {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})