var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    showNav: false,
    isShow: false,
    openId: "",
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
        //获取数据
        getDataList() {
            var _self = this;
            var params = {
                "pageNo": 1,
                "pageSize": 999
            }
            Service.getPositionalTeamList('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.dataList = data.data;
                    for (var i in _self.dataList) {
                        if(_self.dataList[i].teamList.length){
                            for(var j in _self.dataList[i].teamList){
                                _self.dataList[i].teamList[j].content = _self.dataList[i].teamList[j].content ? fn.replaceStr(_self.dataList[i].teamList[j].content) : '暂无内容';
                            }
                        }
                        
                    }
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
            var swiper = new Swiper('.swiper-container', {
                slidesPerView: 4,
                spaceBetween: 10,
                freeMode: true,
                pagination: {
                      el: '.swiper-pagination',
                      type: 'fraction'
                },
            });
        }, 300)

    }
})