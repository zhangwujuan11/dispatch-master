var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);
var time = '';
var data = {
  mescroll: "",
  clauseShow: false,
  total: 0,
  activeShow: true,
  phone: tempJson.legalPersonTel ? tempJson.legalPersonTel : '',
  verifyCode: '',
  smsTimer: 0, // 短信验证码计时器
  smsCount: 60, // 短信验证码间隔，60秒执
  curSmsCount: 60, // 短信验证码当前剩余秒数
  smsFlag: true,
  codeName: '获取验证码'
}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {
    upCallback: function (page) {
      console.log(page)
    },
    onClause() {
      this.activeShow = !this.activeShow
    },
    // 设置短信验证码按钮状态
    setSmsCodeBtn() {
      $('.sendCode').html(this.curSmsCount + "s");
      this.smsTimer = window.setInterval(vm.smsCountdown, 1000); //启动计时器，1秒执行一次
    },
    // 短信验证码倒计时
    smsCountdown() {
      // curSmsCount = smsCount;
      this.curSmsCount--;
      if (this.curSmsCount == 0) {
        this.smsFlag = true;
        window.clearInterval(this.smsTimer); // 停止计时器
      } else {
        $('.sendCode').html(this.curSmsCount + "s");
      }
    },
    getCode() {
      let _self = this
      if (this.phone && fn.testRule.isTel(this.phone)) {
        _self.smsFlag = false;
        let parms = {
          telephone: this.phone
        }
        Service.getCodeSMS('GET', parms, (function (data) {
          if (data.code == 200) {
            _self.setSmsCodeBtn();
            fn.showTip(data.message);
          } else {
            _self.smsFlag = true;
            fn.showTip(data.message);
          }
        }))
      } else {
        fn.showTip("请正确填写法人电话");
        return false;
      }

    },
    onClauseSign() {
      if (!this.verifyCode) {
        fn.showTip("请输入验证码！");
        return false;
      }
      let parms = {
        orderSn: tempJson.orderSn,
        telephone: this.phone,
        verifyCode: this.verifyCode
      }
      Service.getAuditSign('POST', JSON.stringify(parms), (function (data) {
        if (data.code == 200) {
          fn.showTip(data.message);
          window.location.href = 'shopQualApply.html';
        } else {
          fn.showTip(data.message);
        }
      }))
    }
  },
  mounted: function () {
    console.log(WebHost)
    let that = this
    var pdfh5 = new Pdfh5('#demo', {
      pdfurl: WebHost+ "doc/auth.pdf"
    });

    //pdf准备开始渲染，此时可以拿到pdf总页数
    pdfh5.on("ready", function () {
      console.log("pdf准备开始渲染，总页数：" + this.totalNum, )
      var page = 0
      time = setInterval(() => {
        page = $('.pageNow').text()
        if (page == this.totalNum) {
          that.clauseShow = true
          clearInterval(time)
        }
      }, 500);
    })
    //监听pdf渲染成功
    pdfh5.on("success", function (time) {
      time = time / 1000
      console.log("pdf渲染完成，总耗时" + time + "秒");
      //滚动到第3页
      // pdfh5.goto(3)
    })
  }
})