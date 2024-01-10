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

        //提交信息 
        srhRst() {
            window.location.href = "searchResult.html"
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