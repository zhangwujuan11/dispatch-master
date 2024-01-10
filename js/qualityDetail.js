var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);
var userInfo = {
  token: ""
};
//创建vue对象
var vm = new Vue({
  el: "#app",
  data: {
    info: {}
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

    //返回首页
    goHome() {
      window.location.href = "index.html"
    }

  },
  mounted: function () {
    var _self = this;
    //this.getOrderDetail();
    var params = {
      "carNo": tempJson.carNo ? tempJson.carNo : "",
      "securityCode": tempJson.securityCode ? tempJson.securityCode : ""
    }
    Service.queryUserSecurityCode('POST', JSON.stringify(params), (function callback(data) {
      if (data.code == 200) {
        console.log(data.data);
        if (!data.data.securityCode) {
          fn.showTip('没有查询到您的防伪编码！')
        } else {
          _self.info = data.data;
        }
      }
    }))
    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)
  },
  computed: {}
});