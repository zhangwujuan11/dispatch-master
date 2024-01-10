var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    dateCode: "",
    noteList: [],
    openId: ""
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //微信授权登录
        wxOauth() {
            var _self = this;
            var code = tempJson.code ? tempJson.code : '';
            var params = { code: code };
            Service.wxOauth('GET', params, (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                    window.localStorage.setItem("openId", data.data.openId);


                } else {
                    window.localStorage.setItem("openId", "");
                    window.location.href = "wxOath.html?redirectUrl=" + window.location.href;
                }
            }))
        },

        //获取今日码
        getDatecode() {
            var _self = this;
            var params = {};
            Service.getDatecode('GET', params, (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                    _self.dateCode = data.data;

                }
            }))
        },
        //获取消息列表
        getNotesList() {
            var _self = this;
            var params = {
                "pageNo": 1,
                "pageSize": 5,
                "type": 1 //消息类型（默认值：1），1：通知，2：提醒
            };
            Service.getNotesList('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                    _self.noteList = data.data.records;
                    for (var i in _self.noteList) {
                        _self.noteList[i].createDate = fn.formatTime(_self.noteList[i].createDate, 'Y-M-D')
                    }

                }
            }))
        },
        //跳转权益服务
        toBuyService() {
            window.location.href = "rightService.html";
        },
        //跳转订单中心
        toOrder() {
            window.location.href = "orderList.html";
        },
        //跳转会员中心
        toMember() {
            window.location.href = "queryMember.html";
        },
        //跳转查勘定损
        toSurvey() {
            window.location.href = "surveyList.html";
        },
        //跳转消息中心
        toAnnonce() {
            window.location.href = "annonce.html";
        },
        //跳转详情页
        toDetail(e) {
            window.location.href = "annonceDetail.html?id=" + e;
        },
        //跳转玻璃查询
        toQueryGlass() {
            window.location.href = "queryGlass.html";
        },
        //跳转镀膜补贴
        toCoatList() {
            window.location.href = "coatList.html";
        },
        //跳转认证申请
        toShopQualCert() {
            //window.location.href = "shopQualCert.html";
        },
        //跳转我的门店
        toShop() {
            window.location.href = "shop.html";
        },
        //跳转添加店员页面
        toShopUser() {
            window.location.href = "shopUserManager.html";
        },
        //跳转最新活动页面
        toActive() {
            window.location.href = "activeList.html";
        }

    },
    mounted: function() {
        var _self = this;
        // this.wxOauth();
        this.getDatecode();
        this.getNotesList();
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
        //fn.showTip(this.openId)
        //fn.showTip(window.localStorage.getItem("openId"));
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})