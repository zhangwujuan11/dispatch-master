var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);
//创建vue对象
var vm = new Vue({
  el: "#app",
  data: {
    orderInfo: {},
    refuseMsg: "",
    orderSn: 0,
    orderStatus: 0,
    orderAuditList: []
  },
  methods: {
    //订单详情数据
    getOrderDetail() {
      var _self = this;
      var params = {
        orderSn: tempJson.orderId ? tempJson.orderId : ""
      }
      Service.msgOrderDetail('GET', params, (function callback(data) {
        console.log("=====数据====：", data)
        if (data.code == 200) {
          _self.orderInfo = data.data;
          _self.orderAuditList = _self.orderInfo.orderAuditList;
        }
      }))
    },

  },
  mounted: function () {
    var _self = this;
    this.getOrderDetail();
    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)
  },

  computed: {}
});