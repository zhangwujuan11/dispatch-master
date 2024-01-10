var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    showNav: false,
    isShow: false,
    openId: "",
    info:{},
    dataList:[]
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
        //获取医院基本信息：
        getKfyyBaseInfo() {
            var _self = this;
            var params = {
            }
            Service.getKfyyBaseInfo('get', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.info = data.data; _self.info.createDate = fn.formatTime(_self.info.createDate,"Y-M-D");
                     _self.info.content = _self.info.content ? fn.replaceStr(_self.info.content) : '暂无详情';
                    document.getElementById("appContent").style.display = "block";
                }
            }))
        },
        //获取就医环境列表
        getDataList() {
            var _self = this;
            var params = {
                "pageNo": 1,
                "pageSize": 999
            }
            Service.getEnvironmentList('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.dataList = data.data;
                     
                }
            }))
        },

    },
    mounted: function() {
        var _self = this;
        this.getKfyyBaseInfo();
        this.getDataList();
        //初始化vue后,显示vue模板布局
        // setTimeout(function() {
        //     document.getElementById("appContent").style.display = "block";
        // }, 300)
        
    }
})