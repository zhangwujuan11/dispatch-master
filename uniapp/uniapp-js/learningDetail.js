var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    activeInfo: {},
    openId:'',
    learnInfo:{}

}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //获取详情
        getDetail() {
            var _self = this;
            var params = {
                id: tempJson.id ? tempJson.id : ""
            }
            Service.getKnowledgeDetail('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.learnInfo = data.data;
                    _self.learnInfo.content = _self.learnInfo.content ? fn.replaceStr(_self.learnInfo.content) : '暂无详情';
                    _self.learnInfo.publishTime = _self.learnInfo.publishTime ? fn.formatTime(_self.learnInfo.publishTime, 'Y-M-D') : "";
                    //_self.activeInfo.endDate = _self.activeInfo.endDate ? fn.formatTime(_self.activeInfo.endDate, 'Y-M-D') : "";


                }
            }))
        },

    },
    mounted: function() {

        var _self = this;
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
        this.getDetail();
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})