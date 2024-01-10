var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    cargValue: ""
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        queryCarg() {
            if (!this.cargValue) {
                fn.showTip("carg不能为空！");
                return false;
              }
            window.location.href = `cargResults.html?carg=${this.cargValue}`
        }
    },
    mounted: function () {
        var _self = this;

        //初始化vue后,显示vue模板布局
        setTimeout(function () {

            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})