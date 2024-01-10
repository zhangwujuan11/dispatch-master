var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    openId: ""
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        
    },
    mounted: function() {
        var _self = this;
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";


        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";

        }, 300)
    }
})