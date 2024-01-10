var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    showSubUp: false,
    memberInfo: {},
    cerTificates:[],
    isTrain:"0",
    isAuth: false

}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
    },
    mounted: function() {
        //alert(fn.versions.ios)
        var _self = this;
        var params = {
            shopPersonId: tempJson.realId ? tempJson.realId : ""
        }
        Service.getShopPersonDetail('GET', params, (function callback(data) {
            console.log("=====数据：", data)
            if (data.code == 200) {
                _self.memberInfo = data.data;
                if( _self.memberInfo.job==10){
                    _self.memberInfo.jobName ="店长"
                }
                if( _self.memberInfo.job==11){
                    _self.memberInfo.jobName ="技师"
                }
                if( _self.memberInfo.job==12){
                    _self.memberInfo.jobName ="前台"
                }
                _self.isTrain = _self.memberInfo.isTrain;
                _self.cerTificates = _self.memberInfo.cerTificates ? _self.memberInfo.cerTificates : [];
                if(_self.cerTificates.length){
                    for(var i in _self.cerTificates ){
                        _self.cerTificates[i].issueDate = _self.cerTificates[i].issueDate ? fn.formatTime(_self.cerTificates[i].issueDate,'Y-M-D') : "";
                    }
                }
            }
        }))

        
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
           
        }, 300)
    }
})