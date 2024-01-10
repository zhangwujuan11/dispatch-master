var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    showNav: false,
    isShow: false,
    openId: "",
    dataList:[],
    deviceList:[]
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //显示菜单 menu
        toShowNav() {
            this.showNav = !this.showNav
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

        //获取设备列表
        getDeviceList() {
            var _self = this;
            var params = {
                "pageNo": 1,
                "pageSize": 999
            }
            Service.getDeviceList('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.deviceList = data.data;
                     
                }
            }))
        },

        //跳转详情页
        toDetail(e){
            window.location.href="trainDetail.html?deviceId=" + e.id
        }
        

    },
    mounted: function() {
        var _self = this;
        this.getDataList();
        this.getDeviceList();
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
            var swiper = new Swiper('.swiper-container', {
                pagination: {
                    el: '.swiper-pagination'
                }
            });
            $('.swiper-container').css("height", parseInt(340 * (window.innerWidth > 750 ? 750 : window.innerWidth) / 750) + 'px');
        }, 300)
        $(window).resize(function() {
            
            $('.swiper-container').css("height", parseInt(340 * (window.innerWidth > 750 ? 750 : window.innerWidth) / 750) + 'px');
        });

    }
})