var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    activeInfo: {},
    memberList: []

}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //选择店员
        selShopUser(e) {
            window.location.href = "shopUserSelect.html?activeId=" + e;
        },

        //获取详情
        getDetail() {
            var _self = this;
            var params = {
                activityId: tempJson.id ? tempJson.id : ""
            }
            Service.getActiveDetail('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.activeInfo = data.data;
                    _self.activeInfo.beginDate = _self.activeInfo.beginDate ? fn.formatTime(_self.activeInfo.beginDate, 'Y-M-D') : "";
                    _self.activeInfo.endDate = _self.activeInfo.endDate ? fn.formatTime(_self.activeInfo.endDate, 'Y-M-D') : "";
                    _self.activeInfo.describe = _self.activeInfo.describe ? fn.replaceStr(_self.activeInfo.describe) : '暂无详情';
                    if (_self.activeInfo.activitesJoinInfoVOs.length) {
                        _self.memberList = _self.activeInfo.activitesJoinInfoVOs;
                    }
                }
            }))
        },

        //取消活动
        cancelActive(e) {
            var _self = this;
            fn.commonWindowSur('确定此店员取消本次活动？')
            $('.commonBtn_suc').on('click', function() {
                var params = {
                    activityId: tempJson.id ? tempJson.id : "",
                    personId: e.personId
                }
                Service.cancelActive('POST', JSON.stringify(params), (function callback(data) {
                    if (data.code == 200) {
                        //console.log(data.data);
                        $('.workInfo, .mark, ._loading').remove();
                        fn.showTip("活动报名取消成功");
                        _self.getDetail();
                    }
                }))
            })
        }

    },
    mounted: function() {

        var _self = this;
        this.getDetail();
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})