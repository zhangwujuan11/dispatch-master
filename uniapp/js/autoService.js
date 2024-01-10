var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    showNav: false,
    isShow: false,
    openId: ""
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //显示菜单 menu
        toShowNav() {
            this.showNav = !this.showNav
        },

        //跳转详情页 
        toDetail() {
            window.location.href = "detail.html"
        },

        //在线查询
        toSearch(){
            window.location.href = "search.html"
        },
        //在线挂号
        toRegister(){
            window.location.href = "register.html"
        },
        //病例打印
        toPrint(){
            window.location.href = "print.html"
        },
        //就医反馈
        toAdvice(){
            window.location.href = "advice.html"
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