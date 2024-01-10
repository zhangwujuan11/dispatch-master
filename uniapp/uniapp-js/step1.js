var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    goodsName:"",
    cngPart: "",
    vinNo: "",
    partNo: "",
    realPrice:""
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //判断信息
        chackInfo() {
            if (!this.goodsName) {
                fn.showTip("商品名称不能为空");
                return false;
            }
            if (!this.cngPart) {
                fn.showTip("密码不能为空");
                return false;
            }
            if (!this.vinNo) {
                fn.showTip("车辆VIN不能为空");
                return false;
            }
            if (!this.partNo) {
                fn.showTip("零件编码不能为空");
                return false;
            }
            if (!this.realPrice) {
                fn.showTip("实际服务金额不能为空");
                return false;
            }
            return true;
        },
        next(){
            if (!this.chackInfo()) {
                return false;
            }
            window.location.href="step2.html";
        }
    },
    mounted: function() {
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})