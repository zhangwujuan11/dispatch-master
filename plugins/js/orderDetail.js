var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
//创建vue对象
var vm = new Vue({
    el: "#app",
    data: {
        orderInfo: {},
        refuseMsg: "",
        orderSn: 0,
        orderStatus:0,
        orderAuditList:[]
    },
    methods: {

        //订单详情数据
        getOrderDetail() {
            var _self = this;
            var params = {
                orderSn: tempJson.orderId ? tempJson.orderId : ""
            }
            Service.getOrderDetail('GET', params, (function callback(data) {
                console.log("=====数据====：", data)
                if (data.code == 200) {
                    _self.orderInfo = data.data;
                    _self.orderAuditList = _self.orderInfo.orderAuditList;
                }
            }))
        },
        //开始订单
        startOrder(event) {
            event.preventDefault();
            event.stopPropagation();
            var el = event.currentTarget;
            var orderSn = $(el).attr('orderSn');
            window.location.href = 'step.html?orderId=' + orderSn;
        },
        //门店接单
        orderRecevie(event) {
            var _self = this;
            event.preventDefault();
            event.stopPropagation();
            var el = event.currentTarget;
            var orderSn = $(el).attr('orderSn');
            var params = {
                orderSn: orderSn
            }
            Service.orderRecevie('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    fn.showTip("接单成功");
                    this.getOrderDetail();
                }
            }))
        },
        //拒绝接单
        orderRefuse(event) {
            event.preventDefault();
            event.stopPropagation();
            var el = event.currentTarget;
            //var orderSn = 
            this.orderSn = $(el).attr('orderSn');
            this.orderStatus = $(el).attr('orderStatus');
            $('.win-refuse, .mark').show();

        },
        //确认拒绝
        surRefuse() {
            var _self = this;
            // alert(this.orderSn)
            if (!this.refuseMsg) {
                fn.showTip("理由不能为空");
                return false;
            }
            var params = {
                orderSn: this.orderSn,
                remark: this.refuseMsg
            }
            if (this.orderStatus == 100) {
                Service.orderRefuse('POST', JSON.stringify(params), (function callback(data) {
                    console.log("=====数据：", data)
                    if (data.code == 200) {
                        $('.win-refuse, .mark').hide();
                        fn.showTip("拒绝接单成功");
                        _self.getOrderDetail();
                    }
                }))
            } else {
                Service.cancelOrder('POST', JSON.stringify(params), (function callback(data) {
                    console.log("=====数据：", data)
                    if (data.code == 200) {
                        $('.win-refuse, .mark').hide();
                        fn.showTip("取消接单成功");
                        _self.getOrderDetail();
                    }
                }))
            }

        },
        //取消拒绝理由
        cancelRefuse() {
            $('.win-refuse, .mark').hide();
        },
    },
    mounted: function() {
        var _self = this;
        this.getOrderDetail();

        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";

        }, 300)
    },

    computed: {


    }
});