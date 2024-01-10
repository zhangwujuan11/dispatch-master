var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var userInfo = { token: "" };

var data = {
    dateCode: "",
    openId: "",
    accountType: "",
    rstData: [],
    isShow: false,
    bigPic: ""
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {

        //查看大图
        showBigImg(e) {
            //alert(e)
            this.bigPic = e;
            this.isShow = true;
        },
        //隐藏大图
        hideMask() {
            this.isShow = false;
        },

        //查看门店销售授权书
        toCertiShopRst(e,index) {
            console.log('证书：', e)
            if (e.shopSqCertificateVO) {
                window.location.href = "certiShopRst.html?realId=" + index;
            } else {
                fn.showTip('暂无门店销售授权书！')
            }
        },
        //查看员工技能认证
        toCertiMemRst(e,index) {
            if (e.personCertificateVOList.length) {
                window.location.href = "certiMemRst.html?realId=" + index  ;
            } else {
                fn.showTip('暂无员工技能认证！')
            }
        }


    },
    mounted: function() {

        this.accountType = userInfo.accountType ? userInfo.accountType : 0;
        if (window.localStorage.getItem("rstData")) {
            this.rstData = JSON.parse(window.localStorage.getItem("rstData"));
        }

        var _self = this;
        // this.wxOauth();
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";

        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})