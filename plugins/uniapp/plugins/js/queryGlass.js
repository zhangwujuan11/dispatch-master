var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    carType:'',
    parts:'',
    yearType:""
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //判断信息
        chackInfo() {
            if (!this.carType && !this.parts && !this.yearType) {
                fn.showTip("至少填写其中一项");
                return false;
            }
            return true;
        },
        //会员查询
        queryGlass(){
            if (!this.chackInfo()) {
                return false;
            }
            console.log("carType：", this.carType," parts", this.parts," yearType", this.yearType)
            window.location.href="glassList.html?carType=" + this.carType + "&parts=" + this.parts + "&yearType=" + this.yearType;

        }
    },
    mounted: function() {
        var _self = this;
        //_self.year = fn.formatTime(new Date(), 'Y-M-D');
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})