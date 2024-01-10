var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
  shopInfo : {}
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {

        //跳转到待结算列表
        toSettle(){
            window.location.href="settleList.html"
        },
        //跳转到百度待结算列表
        toBdSettle(){
            window.location.href="settleBdList.html"
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