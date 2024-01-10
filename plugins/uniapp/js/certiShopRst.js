var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var userInfo = { token : ""};

var data = {
    dateCode: "",
    openId: "",
    accountType: "",
    realId: "",
    rstData: [],
    shopSqCertificateVO:{},
    isShow:false,
    bigPic:""
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        
        //查看大图
        showBigImg(e){
            //alert(e)
            this.bigPic = e;
            this.isShow = true;
        },
        //隐藏大图
        hideMask(){
            this.isShow = false;
        },

    },
    mounted: function() {

        this.accountType = userInfo.accountType ? userInfo.accountType : 0;
        this.realId = tempJson.realId ? tempJson.realId : "";
        if (window.localStorage.getItem("rstData")) {
            this.rstData = JSON.parse(window.localStorage.getItem("rstData"))[this.realId];
            this.shopSqCertificateVO = this.rstData.shopSqCertificateVO;
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