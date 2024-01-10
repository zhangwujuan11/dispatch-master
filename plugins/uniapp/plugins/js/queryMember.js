var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    kw: ""
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //判断信息
        chackInfo() {
            if (!this.kw) {
                fn.showTip("车牌号/车架号/保单号不能为空");
                return false;
            }
            return true;
        },
        //小写转大写
        toUpperCase(e) {
            // console.log('e：',e.toUpperCase())
            this.kw = e.toUpperCase();
        },
        //会员查询
        query() {
            if (!this.chackInfo()) {
                return false;
            }
            var _self = this;
            var params = {
                kw: this.kw,
                type: 2
            }
            Service.queryMember('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    //if(data.data.name){
                        window.location.href = "member.html?kw=" + _self.kw;
                    // }else{
                    //     fn.showTip('未查询到相关会员信息');
                    // }
                }
            }))
           // window.location.href = "member.html?kw=" + this.kw;

        }
    },
    mounted: function() {
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})