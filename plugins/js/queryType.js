var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);


var data = {
    carList: [],
    carInfoList: []
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //选择车型车辆
        selCarType(e) {
            console.log(e);
            var kw = tempJson.kw ? tempJson.kw : "";
            var returnUrl = tempJson.returnUrl ? tempJson.returnUrl : "";
            var cardId = tempJson.cardId ? tempJson.cardId : "";
            var drivingPic = tempJson.drivingPic ? tempJson.drivingPic : "";
            var memberInfo = tempJson.memberInfo ? tempJson.memberInfo : "";
            var carType = e.fullName;
            var carInfoId = e.id;
            var backUrl = tempJson.backUrl ? tempJson.backUrl : "";
            //alert(returnUrl)
            if (returnUrl) {
                window.location.href = returnUrl + "?kw=" + kw 
                                        + "&carType=" + carType 
                                        + "&carInfoId=" + carInfoId 
                                        + "&cardId=" + cardId 
                                        + "&backUrl="+ backUrl 
                                        + "&drivingPic=" + drivingPic
                                        + "&memberInfo=" + memberInfo;
            } else {

                window.location.href = "editMember.html?kw=" + kw 
                                        + "&carType=" + carType 
                                        + "&carInfoId=" + carInfoId 
                                        + "&backUrl="+ backUrl 
                                        + "&drivingPic=" + drivingPic
                                        + "&memberInfo=" + memberInfo;
            }
        },
        //隐藏
        hideMask() {
            $('.mask').hide();
            $('.showCarType').hide();
            $('.showCarType').css({ "left": "100%" });
        }
    },
    mounted: function() {
        var _self = this;
        var params = {
            token: userInfo.token,
            brandId: tempJson.brandId ? tempJson.brandId : ''
        }
        Service.getCarSeriesList('GET', params, (function callback(data) {
            console.log("=====数据：", data)
            if (data.code == 200) {
                _self.carList = data.data;
            }
        }))

        //选定车辆
        // $('.carTypeList').live('click', function() {
        //     var kw = tempJson.kw ? tempJson.kw :"";
        //     var returnUrl = tempJson.returnUrl ? tempJson.returnUrl : "";
        //     var carType = $(this).html();
        //     var carInfoId = $(this).attr("carInfoId");
        //     alert(returnUrl)
        //     if(returnUrl){
        //         window.location.href= returnUrl + "?kw=" + kw +"&carType=" + carType +"&carInfoId=" + carInfoId;
        //     }else{
        //         window.location.href="editMember.html?kw=" + kw +"&carType=" + carType +"&carInfoId=" + carInfoId;
        //     }


        // })

        // $('.mask').live( 'click', function() {
        //     $('.mask').hide();
        //     $('.showCarType').hide();
        //     $('.showCarType').css({ "left": "100%" });
        // })

        //初始化vue后,显示vue模板布局
        setTimeout(function() {

            document.getElementById("appContent").style.display = "block";
            $('.carTypeLists').css("height", window.innerHeight + 'px');
            $('body').on('click', '.aui-flex', function() {
                $('.mask').show();
                var serId = $(this).attr('serId');
                var params = {
                    token: userInfo.token,
                    seriesId: serId
                }
                Service.getCarSeries('GET', params, (function callback(data) {
                    console.log("=====数据：", data)
                    if (data.code == 200) {
                        _self.carInfoList = data.data;
                    }
                }))
                $('.showCarType').show().animate({ "left": "40%" }, 300);

            })

            $(window).resize(function() {
                $('.carTypeLists').css("height", window.innerHeight + 'px');
            });
            // $('body').on('click', '.aui-flex', function() {
            //     window.location.href="queryType.html?serId=" + $(this).attr('realId');
            // })
        }, 300)

    }
})