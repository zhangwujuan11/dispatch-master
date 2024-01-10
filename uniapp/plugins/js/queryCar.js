var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    carList: [],
    arrWords: []
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {

    },
    mounted: function() {
        var _self = this;
        var params = {
            token: userInfo.token
        }
        Service.getBrandList('GET', params, (function callback(data) {
            console.log("=====数据：", data)
            if (data.code == 200) {
                _self.carList = data.data;
                if(data.data.length){
                    var firstletter = []
                   for(var i=0; i<data.data.length; i++){
                        firstletter.push(data.data[i].firstletter)
                    } 
                    _self.arrWords = fn.uniqArrs(firstletter);
                }
                console.log(_self.arrWords)
            }
        }))

        //初始化vue后,显示vue模板布局
        setTimeout(function() {

            document.getElementById("appContent").style.display = "block";
            $('body').on('click', '.letter a', function() {
                var s = $(this).html();
                $(window).scrollTop($('#' + s + '1').offset().top);
                // console.log($('#' + s + '1'));
                $("#showLetter span").html(s);
                $("#showLetter").show().delay(500).hide(0);
            });
            $('body').on('click', '.aui-flex', function() {
                var kw= tempJson.kw ? tempJson.kw : "";
                var cardId = tempJson.cardId ? tempJson.cardId : "";
                var returnUrl = tempJson.returnUrl ? tempJson.returnUrl : "";
                var drivingPic = tempJson.drivingPic ? tempJson.drivingPic : "";
                var memberInfo = tempJson.memberInfo ? tempJson.memberInfo : "";
                var backUrl = tempJson.backUrl ? tempJson.backUrl : "";
                window.location.href="queryType.html?brandId=" 
                                    + $(this).attr('realId') 
                                    + "&kw=" + kw +"&returnUrl=" + returnUrl 
                                    + "&cardId=" + cardId 
                                    + "&backUrl=" + backUrl 
                                    + "&drivingPic=" + drivingPic
                                    + "&memberInfo=" + memberInfo;
            })
        }, 300)

    }
})