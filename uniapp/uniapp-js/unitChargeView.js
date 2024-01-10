var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    showSubUp: false,
    memberInfo: {},
    singleFlag:"0"

}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {

       

    },
    mounted: function() {
        //alert(fn.versions.ios)
        var _self = this;
        var settlementId = tempJson.realId ? tempJson.realId : "";
        if (settlementId) {
            var params = {
                settlementId: settlementId
            }
            Service.getShopSettleDetail('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.memberInfo = data.data;
                  
                    if (_self.memberInfo.settletmentMethod == 0) {
                        _self.singleFlag = true
                    } else {
                        _self.singleFlag = false
                    }
                   

                }
            }))
        }

        
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
           
        }, 300)
    }
})