var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
  shopInfo : {}
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {

        //跳转到销售单列表
        toSaleList(){
            window.location.href="saleList.html"
        },

        //跳转到月结统计列表
        toSaleReport(){
            window.location.href="saleReport.html"
        }
    },
    mounted: function() {
        var _self = this;
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})