var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var data = {
    userName:"",
    type:"", //BAIDU(1001,"百度"),  
             //UC(1002,"UC"), 
             //TIKTOK(1003,"抖音"), 
             //FREEDOWNLOAD(1004,"360"),
             //QT(1005,"其它");
    tel: "",
    carType: "",
    isWork:false ,   //工作时间早8点到晚16点
    city: "",
    province: "",
    cityId: "",
    zone: ""

}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //滚动到顶部
        scrollToTop() {
            $("html,body").animate({ scrollTop: 0 }, 400);
           // $('.item-input').eq(0).find('input').focus();
        },
        //判断信息
        chackInfo() {
            if (!this.userName) {
                fn.showTip("姓名不能为空");
                return false;
            }

            if (!this.tel) {
                fn.showTip("联系方式不能为空");
                return false;
            }
            if (!fn.testRule.isTel(this.tel)) {
                fn.showTip("请正确输入联系方式");
                return false;
            }
            
            if (!this.carType) {
                fn.showTip("汽车型号不能为空");
                return false;
            }

            if (!this.cityId) {
                fn.showTip("省市不能为空");
                return false;
            }

            return true;
        },

        //门店更新
        surSub() {
            if (!this.chackInfo()) {
                return false;
            }

            var params = {
                userName: this.userName,
                channelCode: this.type,
                mobile: this.tel,
                carType: this.carType,
                cityId: this.cityId,
                city: this.city
            }

            console.log('参数：', params)
            Service.subPopular('POST', JSON.stringify(params), (function callback(data) {
                if (data.code == 200) {
                    fn.showTip("预约成功,请耐心等待！")
                    setTimeout(function(){
                        window.location.reload();
                    },2000)
                }
            }))
        }

    },

    mounted: function() {
        var _self = this;
        if(new Date().getHours() >= 8 && new Date().getHours() < 18 ){
            this.isWork = true
        }else{
            this.isWork = false
        }
        
        this.type =  tempJson.type ? tempJson.type : "1005";
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            //省市选择
            var cityPicker = new mui.PopPicker({
                layer: 2
            });
            cityPicker.setData(cityData3);
            // cityPicker.pickers[2].setSelectedIndex(_self.shopInfo.zoneId, 2000);
            $("#choose-city").on("tap", function() {
                document.activeElement.blur()
                cityPicker.show(function(items) {
                    _self.cityId = items[1].value;
                    _self.province = items[0].text;
                    _self.city = items[1].text;
                });
            });

            document.getElementById("appContent").style.display = "block";
            var swiper = new Swiper('.swiper-container', {
                pagination: {
                    el: '.swiper-pagination',
                },
                paginationClickable: true
            });
        }, 300)


    }
})