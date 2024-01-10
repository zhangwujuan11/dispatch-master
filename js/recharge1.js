var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

//创建vue对象
var vm = new Vue({
  el: "#app",
  data: {
    openId: '',
    czList: [{
        name: 100,
        id: 1
      },
      {
        name: 300,
        id: 1
      },
      {
        name: 500,
        id: 1
      },
      {
        name: 1000,
        id: 1
      },
      {
        name: 1500,
        id: 1
      },
      {
        name: 2000,
        id: 1
      },
    ],
    price: '',
    activeIndexs: '',
    orderSn: '',
    shopBalance: 0
  },
  methods: {
    getBalance() {
      const that = this
      // Service.getShopBalance('GET', '', (function callback(data) {
      //   if (data.code == 200) {
      //     that.shopBalance = data.data.balance
      //   }
      // }))
      let urls = 'https://uat.edows.cn/api/shop/getShopBalance?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJTRjg2NzUxNiIsImV4cCI6MTYzODkzMzc0MywiaWF0IjoxNjM3NjM3NzQzfQ.Thl23Xv_1sIvMIvIKBnTkwqryinCI2QDquTvgQAqyww'
      $.ajax({
        url: urls,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          if (data.code == 200) {
            that.shopBalance = data.data.balance
          }
        }
      });
    },

    toSettle() {},
    onCzItem(item, index) {
      this.price = item.name
      this.activeIndexs = index + 1
    },
    addPay() {
      var _self = this
      if (this.price < 100 || this.price == '') {
        fn.showTip('最低充值100')
        return;
      }
      let params = {
        amount: _self.price
      }
      let urls = 'https://uat.edows.cn/api/shop/createBalanceOrder?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJTRjg2NzUxNiIsImV4cCI6MTYzODkzMzc0MywiaWF0IjoxNjM3NjM3NzQzfQ.Thl23Xv_1sIvMIvIKBnTkwqryinCI2QDquTvgQAqyww'
      $.ajax({
        url: urls,
        type: 'GET',
        dataType: 'json',
        data: params,

        success: function (data) {
          if (data.code == 200) {
            _self.orderSn = data.data.orderSn
            _self.payOrder()
          }
        }
      });
      // Service.createBalanceOrder('GET', params, (function callback(data) {
      //   console.log(data)
      //   if (data.code == 200) {
      //     _self.orderSn = data.data.orderSn
      //     _self.payOrder()
      //   }
      // }))
    },
    payOrder() {
      var _self = this;
      // alert(this.openId)
      if (_self.orderSn != '') {
        var params = {
          "ip": "",
          "openId": this.openId,
          "orderSn": this.orderSn,
          "payType": "MWEB"
        };
        let urls = 'https://uat.edows.cn/api/shop/balancePay?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJTRjg2NzUxNiIsImV4cCI6MTYzODkzMzc0MywiaWF0IjoxNjM3NjM3NzQzfQ.Thl23Xv_1sIvMIvIKBnTkwqryinCI2QDquTvgQAqyww'
        $.ajax({
          url: urls,
          type: 'POST',
          contentType: "application/json;charset-UTF-8",
          dataType: "json",
          data: JSON.stringify(params),
          success: function (data) {
            if (data.code == 200) {
              window.location.href = data.data.mwebUrl
            } else {
              _self.showTip(data.message);
            }
            // Service.balancePay('POST', JSON.stringify(params), (function callback(data) {
            // if (data.code == 200) {
            //   _self.appId = data.data.appId;
            //   _self.nonceStr = data.data.nonceStr;
            //   _self.package = data.data.packageValue;
            //   _self.paySign = data.data.paySign;
            //   _self.signType = data.data.signType;
            //   _self.timeStamp = data.data.timeStamp;
            //   if (typeof WeixinJSBridge == "undefined") {
            //     if (document.addEventListener) {
            //       document.addEventListener('WeixinJSBridgeReady',
            //         _self.onBridgeReady, false);
            //     } else if (document.attachEvent) {
            //       document.attachEvent('WeixinJSBridgeReady',
            //         _self.onBridgeReady);
            //       document.attachEvent('onWeixinJSBridgeReady',
            //         _self.onBridgeReady);
            //     }
            //   } else {
            //     _self.onBridgeReady();
            //   }
            // }
            // }))
          }
        });
      }
    },
    onBridgeReady() {
      var _self = this;
      WeixinJSBridge.invoke('getBrandWCPayRequest', {
          "appId": _self.appId, //公众号名称,由商户传入     
          "timeStamp": _self.timeStamp, //时间戳,自1970年以来的秒数     
          "nonceStr": _self.nonceStr, //随机串     
          "package": _self.package,
          "signType": _self.signType, //微信签名方式：     
          "paySign": _self.paySign //微信签名 
        },
        function (res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            _self.getBalance()
            fn.showTip('支付成功', 'shop.html');
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            fn.showTip('支付取消');
          } else if (res.err_msg == "get_brand_wcpay_request:fail") {
            fn.showTip('支付失败');
            WeixinJSBridge.call('closeWindow');
          } //使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok,但并不保证它绝对可靠。
        });
    },
  },
  mounted() {
    //初始化vue后,显示vue模板布局
    this.openId = window.localStorage.getItem("openId") || "";
    this.getBalance()
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)
  }
});