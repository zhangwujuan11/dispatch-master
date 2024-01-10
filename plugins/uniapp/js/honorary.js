var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    showNav: false,
    isShow: false,
    openId: "",
    info:{}
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //显示菜单 menu
        toShowNav() {
            this.showNav = !this.showNav
        },

        //显示更多 
        showMore() {
            this.isShow = !this.isShow;
        },
        //获取荣誉信息
        getDataList() {
            var _self = this;
            var params = {
                "pageNo": 1,
                "pageSize": 999
            }
            Service.getHonourDetail('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.info = data.data;
                    _self.info.content = _self.info.content ? fn.replaceStr(_self.info.content) : '暂无内容';
                   
                }
            }))
        }

    },
    mounted: function() {
        var _self = this;
        this.getDataList();
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
            
        }, 300)

    }
})