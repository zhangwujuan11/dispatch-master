var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
//创建vue对象
var vm = new Vue({
    el: "#app",
    data: {
        pdlist:[],
        token: userInfo.token ? userInfo.token : "",
        seviceClass: 'none',
        settlementStatus: 0,
        settlementSn:"",
        orderPrice:"",
        orderSn:"",
        bargain:"",
        bargainDes:""
    },
    created() {


    },
    mounted: function() {
        var _self = this;
        this.settlementSn = tempJson.realId ? tempJson.realId : "";
        this.settlementStatus = tempJson.settlementStatus ? tempJson.settlementStatus : 0;
        if (this.settlementSn) {
            this.getSubOrderSettleList();
        }

        
        //初始化vue后,显示vue模板布局
        // setTimeout(function() {
        //     document.getElementById("appContent").style.display = "block";
        // }, 300)


    },
    methods: {
        //获取结算单下的工单数据
        getSubOrderSettleList(){
            var _self = this;
            var params = {
                settlementSn: this.settlementSn
            }
            Service.getSubOrderSettleList('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    
                    _self.pdlist = data.data;
                    document.getElementById("appContent").style.display = "block";
                }
            }))
        },

        // 弹框开关
        toggleService(e) {
            if (this.seviceClass === 'show') {
                this.seviceClass = 'hide';
                setTimeout(() => {
                    this.seviceClass = 'none';
                }, 250);
            } else if (this.seviceClass === 'none') {
                this.seviceClass = 'show';
                this.orderPrice = e.orderPrice;
                this.orderSn = e.orderSn
            }
        },

        stopPrevent() {},

        

       
        //判断信息
        chackInfo() {
            if (!this.bargain) {
                fn.showTip("争议价格不能为空！");
                return false;
            }
            return true;
        },

        //确认结算
        surSettle() {
            var _self = this;
            if (!this.chackInfo()) {
                return false;
            }
            var params = {
                bargain: this.bargain,
                bargainDes: this.bargainDes,
                orderPrice: this.orderPrice,
                orderSn: this.orderSn
            }
            Service.bargainOrder('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    fn.showTip('价格争议提交成功，请耐心等待审核！');
                    _self.toggleService();
                    _self.getSubOrderSettleList();
                }
            }))
        }


    },
    computed: {


    },
});

// var date = new Date("2018-1-21");
// alert(date.getDay());

