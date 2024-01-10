var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  agree: false,
  webHost: '',
  isShowSelUser: false,
  accountType: "",
  isExtendFlag: true,
  openId: '',
  pdlist: [],
  pageNum: 1,
  pageSize: 100,
  selArrs: [],
  shopImgList: [],
  itemObj: {},
  imgShopFive: {
    imgPath: '',
    name: '团队',
    id: ''
  },
  auditPrice: 10000,
  //money:[],
  serviceMoney: [6000, 4000],
  auditMoney: [10000, 6000, 4000],
  shopInfo: {
    isExtend: 1,
    chainTime: "", //参加连锁督导时间
    rangeDes: "汽车玻璃维修技术与服务认证 （AGTS门店认证)",
    shopName: "",
    address: "",
    legalPerson: "",
    chargeName: "",
    chargeMobile: "",
    established: "",
    registeredCapital: "",
    shopArea: "",
    azgwNum: "",
    azjsNum: "",
    payMethod: 1,
    level: '',
    auditYear: ''
  },
  "shopType": "102",
  personIds: [],
  shopPersonIds: [],
  status: "",
  showMoreCharge: false,
  showShop: false,
  taskPrice: 0,
  ModalsTitle: '',
}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {

    //展开更多 
    showMore() {
      this.showMoreCharge = !this.showMoreCharge
    },

    //员工认证
    toUserCert() {
      // if (this.status != '104') {
      //   fn.showTip("门店资质认证还未成功！");
      //   return false;
      // }
      // if (this.status == '104' && this.shopType != '102') {
      //   fn.showTip("服务门店无需进行店员认证考核！");
      //   return false;
      // }
      window.location.href = "shopUserQualCert.html";
    },
    //门店问题改进
    toQuestionCert() {
      if (this.status != '104') {
        fn.showTip("门店资质认证还未成功！");
        return false;
      }
      if (this.status == '104' && this.shopType != '102') {
        fn.showTip("服务门店无需进行门店问题改进！");
        return false;
      }
      window.location.href = "shopQuestionCert.html";
    },
    //更换支付方式
    cngPayMode(e) {
      if (e == 'onLine') {
        this.shopInfo.payMethod = 1
      }
      if (e == 'offLine') {
        this.shopInfo.payMethod = 2
      }
    },
    //上传图片
    upImg(index) {
      $('.upLoadImgs').eq(index).find(".noPass").hide();
      //正式用
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        //sizeType: ['original'],
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        defaultCameraMode: "normal",
        success: function (res) {
          var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          //$(obj).attr("src", localIds);
          vm.showSubUp = true;
          wx.getLocalImgData({
            localId: localIds.toString(), // 图片的localID
            success: function (res) {
              var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
              // $('.matchImg').attr("src", localData);
              var base64 = "data:image/jgp;base64 || data:image/jgep;base64 || data:image/png;base64 || data:image/gif;base64";

              var base64Jpg = "data:image/jgp;base64";
              if (fn.versions.android) {
                if (localData.split(",")[0] != base64) {
                  localData = base64Jpg + "," + localData;
                }
              }
              //$(obj).attr("src", localData);

              var params = {
                base64Data: localData,
                bizType: 101
              }
              Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
                //console.log("数据：", data)
                if (data.code == 200) {
                  $('.upLoadImgs').eq(index).find(".picFullcar").attr("src", data.data.webPath);
                }
              }))
            }
          });
        }
      });

    },

    //上传图片
    btnUploadFile(index) {

      $('.upLoadImgs').eq(index).find(".noPass").hide();

      var _self = this;

      let evt = window.event || e;
      let el = evt.currentTarget || evt.srcElement;
      //获取图片文件
      var imgFile = el.files[0];
      //异步读取文件
      var reader = new FileReader();

      reader.onloadstart = function (e) {
        // $('.maskUploadImg').eq(index).show();
        console.log("开始读取....", index);
        // _self.memberInfo.orderAuditList[index].isShowMask = true;
      }
      reader.onprogress = function (e) {

        console.log("正在读取中....");
      }
      reader.onabort = function (e) {
        console.log("中断读取....");
      }
      reader.onerror = function (e) {
        console.log("读取异常....");
      }
      //reader.readAsDataURL(imgFile);
      reader.onload = async (evt) => {
        //替换url
        if (imgFile.size / 1024 > 1024 * 1.2) {
          fn.dealImage(evt.target.result, {
            quality: 0.6
          }, function (base64Codes) {
            // console.log(base64Codes)
            var params = {
              base64Data: base64Codes,
              bizType: 101
            }
            Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
              //console.log("数据：", data)
              if (data.code == 200) {
                _self.shopInfo.shopImgList[index].checkItemImg = data.data.webPath
                $('.maskUploadImg').eq(index).hide();
              }
            }))
          });
        } else {
          var params = {
            base64Data: evt.target.result,
            bizType: 101
          }
          Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
            if (data.code == 200) {
              _self.shopInfo.shopImgList[index].checkItemImg = data.data.webPath
              $('.maskUploadImg').eq(index).hide();
            }
          }))
        }
        setTimeout(function () {
          $('.maskUploadImg').eq(index).hide();
        }, 10000)
      }
      reader.readAsDataURL(imgFile);
    },

    toAuditYear() {
      let _self = this
      var dtpicker = new mui.DtPicker({
        type: "year", //设置日历初始视图模式 
        beginDate: new Date(2021, 01, 01), //设置开始日期 
        endDate: new Date().toLocaleDateString(), //设置结束日期 
      })
      dtpicker.show(function (selectItems) {
        $("#choose-year").text(selectItems.y.text);
        _self.shopInfo.auditYear = selectItems.y.value;
      })
    },
    // 认证级别
    toLevel() {
      let _self = this
      var cityPicker = new mui.PopPicker({
        layer: 1
      });

      cityPicker.setData([{
          value: 0,
          text: "A类认证"
        },
        // {
        //   value: 1,
        //   text: "C类认证"
        // }
      ]);
      cityPicker.show(function (items) {
        $("#choose-level").text(items[0].text);
        _self.shopInfo.level = items[0].value;
      });
    },
    //切换门店类型
    toCngType(e) {
      let _self = this
      // if (_self.shopInfo.level == undefined) {
      //   fn.showTip("请选择认证级别");
      //   return false;
      // }
      var cityPicker = new mui.PopPicker({
        layer: 3
      });

      cityPicker.setData(cityData3);

      cityPicker.show(function (items) {
        $("#choose-city").text(items[0].text + " " + items[1].text + " " + items[2].text);

        _self.shopInfo.saleAreaId = items[2].value;
        _self.shopInfo.province = items[0].text;
        _self.shopInfo.city = items[1].text;
        _self.shopInfo.zone = items[2].text;

        let params = {
          zonesId: items[2].value,
          // level: _self.shopInfo.level
          level: 0
        }
        if (_self.shopInfo.status != 106) {
          Service.getAuditPrice('GET', params, (function callback(data) {
            if (data.code == 200) {
              _self.shopInfo.taskPrice = data.data.taskPrice
              _self.shopInfo.auditPrice = data.data.auditPrice
            }
          }))
        }
        // return true;
      });

    },

    //获取门认证信息
    getShopAuditDetail() {
      var _self = this;
      this.personIds = [];
      var params = {};
      Service.getShopAuditDetail('GET', params, (function callback(data) {

        if (data.code == 200) {
          _self.getShopMemberInfo();
          let shopInfos = data.data
          data.data.payMethod = data.data.payMethod ? data.data.payMethod : 1;
          // document.getElementById("appContent").style.display = "block";
          _self.shopInfo = data.data;
          _self.auditPrice = parseInt(data.data.auditPrice);
          _self.status = data.data.status;
          _self.shopInfo.level == 0
          _self.shopInfo.auditYear = 2022
          // _self.shopInfo.level = data.data.level == 0 ? 'A类认证' : 'C类认证'
          if (_self.shopInfo.shopType) {
            _self.shopType = _self.shopInfo.shopType;
          }
          if (!_self.shopInfo.rangeDes) {
            _self.shopInfo.rangeDes = "汽车玻璃维修技术与服务认证 （AGTS门店认证)"
          }
          if (_self.shopInfo.chainTime) {
            _self.shopInfo.chainTime = fn.formatTime(_self.shopInfo.chainTime, 'Y-M-D')
          }

        }
      }))
    },

    //是否接受市场推广服务
    isExtend(e) {
      if (e == 1) {
        this.shopInfo.isExtend = 1;
        this.isExtendFlag = true
      }
      if (e == 0) {
        this.shopInfo.isExtend = 0;
        this.isExtendFlag = false
      }
    },
    //获取店员信息
    getShopMemberInfo() {
      var _self = this;
      //延时一秒,模拟联网
      var params = {
        pageNo: this.pageNum,
        pageSize: this.pageSize,
        personIds: this.personIds.join(',')
      }
      Service.getShopAuditPersonList('POST', JSON.stringify(params), (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200) {
          _self.totalPage = data.count;
          var listData = data.data;
          for (var i in listData) {
            listData[i].selFlag = false;
          }

          _self.pdlist = listData;
        }
      }))
    },
    showModals(title) {
      console.log(title)
      $('.showModal,.mask').show();
      this.ModalsTitle = title
    },
    hideMasks() {
      $('.showModal,.mask').hide();
    },
    //判断信息
    chackInfo() {
      if (!this.shopType) {
        fn.showTip("请选择门店类型");
        return false;
      }
      if (!this.shopInfo.shopName) {
        fn.showTip("请输入门店名称");
        return false;
      }
      if (!this.shopInfo.address) {
        fn.showTip("请输入经营地址");
        return false;
      }
      if (!this.shopInfo.legalPerson) {
        fn.showTip("请输入法人代表");
        return false;
      }
      if (!this.shopInfo.chargeName) {
        fn.showTip("请输入负责人姓名");
        return false;
      }
      if (!this.shopInfo.chargeMobile) {
        fn.showTip("请输入负责人联系电话");
        return false;
      }
      if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.shopInfo.legalPersonTel)) {
        fn.showTip("请输入正确的手机号码");
        return;
      }
      if (!this.shopInfo.legalPersonTel) {
        fn.showTip("请输入法人联系电话");
        return false;
      }
      if (!this.shopInfo.auditYear) {
        fn.showTip("请选择认证年度");
        return false;
      }
      // if (this.shopInfo.level == undefined) {
      //   fn.showTip("请选择认证级别");
      //   return false;
      // }
      if (this.shopInfo.taskPrice == '0.00') {
        fn.showTip("请选择销售区域");
        return false;
      }
      if (this.shopInfo.status == 105 || this.shopInfo.isExpire == 1) {
        let data = this.shopInfo.shopImgList.findIndex(item => {
          return item.checkItemId === 35
        })
        let data1 = this.shopInfo.shopImgList.findIndex(item => {
          return item.checkItemId === 37
        })
        let data2 = this.shopInfo.shopImgList.findIndex(item => {
          return item.checkItemId === 39
        })
        if (this.shopInfo.shopImgList[data].checkItemImg == '') {
          fn.showTip("请上传营业执照");
          return false;
        }
        if (this.shopInfo.shopImgList[data1].checkItemImg == '') {
          fn.showTip("请上传门头照");
          return false;
        }
        if (this.shopInfo.shopImgList[data2].checkItemImg == '') {
          fn.showTip("请上传施工区");
          return false;
        }
      }

      if (this.shopInfo.payStatus != 1) {
        if (!this.agree) {
          fn.showTip("请同意合约文件！");
          return false;
        }
      }
      return true;
    },
    //整改
    toRectification() {

      var _self = this;
      var orderAudits = [];
      for (var i = 0; i < $('.upLoadImgs').length; i++) {
        var obj = {};
        obj.checkItemId = $('.upLoadImgs').eq(i).attr('checkItemId');
        obj.checkItemImg = $('.upLoadImgs').eq(i).find(".picFullcar").attr('src');
        orderAudits.push(obj)
      }

      var params = {
        shopImgList: orderAudits,
        orderSn: this.shopInfo.orderSn,
      }

      Service.setAuditZg('POST', JSON.stringify(params), (function callback(data) {
        if (data.code == 200) {
          fn.showTip("提交成功");
          _self.getShopAuditDetail();
        }
      }))
    },

    //提交勘验单
    addPay(titles) {
      var _self = this;
      $('.showModal,.mask').hide();
      if (!this.chackInfo()) {
        return false;
      }

      var orderAudits = [];
      for (var i = 0; i < $('.upLoadImgs').length; i++) {
        var obj = {};
        obj.checkItemId = $('.upLoadImgs').eq(i).attr('checkItemId');
        obj.checkItemImg = $('.upLoadImgs').eq(i).find(".picFullcar").attr('src');
        orderAudits.push(obj)
      }

      var params = {
        auditPrice: this.auditPrice,
        shopImgList: orderAudits,
        orderSn: this.shopInfo.orderSn,
        payMethod: this.shopInfo.payMethod,
        address: this.shopInfo.address,
        chargeMobile: this.shopInfo.chargeMobile,
        chargeName: this.shopInfo.chargeName,
        legalPerson: this.shopInfo.legalPerson,
        legalPersonTel: this.shopInfo.legalPersonTel,
        renewFlag: this.shopInfo.isExpire,
        saleAreaId: this.shopInfo.saleAreaId,
        taskPrice: this.shopInfo.taskPrice,
        auditYear: this.shopInfo.auditYear,
        level: 0,
      }

      Service.applyShopAudit('POST', JSON.stringify(params), (function callback(data) {
        if (data.code == 200) {
          if (_self.shopInfo.payStatus != 1) {
            _self.shopInfo.orderSn = data.data;
            if (_self.shopInfo.payMethod == 1) {
              if (_self.shopInfo.isExpire == 0) {
                _self.payOrder();
              } else {
                if (_self.shopInfo.status == 105) {
                  fn.showTip('恭喜你完成本年度销售任务，您可以继续进行续签');
                  window.location.href = 'shopContract.html?orderSn=' + _self.shopInfo.orderSn + "&legalPersonTel=" + _self.shopInfo.legalPersonTel
                } else {
                  fn.showTip("提交成功,请耐心等待审核结果");
                  _self.getShopAuditDetail();
                }
              }
            } else if (_self.shopInfo.payMethod == 2) {
              fn.showTip("提交成功");
              _self.getShopAuditDetail();
            }
          } else {
            fn.showTip("提交成功");
            _self.getShopAuditDetail();
          }
        }
      }))

    },
    //判断是否同意
    toAgree() {
      this.agree = !this.agree
    },
    //判断信息
    chackPayInfo() {
      if (!this.agree) {
        fn.showTip("请同意合约文件！");
        return false;
      }
      return true;
    },
    //支付
    payOrder() {
      var _self = this;

      if (!this.chackPayInfo()) {
        return false;
      }
      if (this.shopInfo.taskFlag == 0) {
        // alert(this.openId)
        var params = {
          "ip": "",
          "openId": this.openId,
          "orderSn": this.shopInfo.orderSn,
          "payType": "JSAPI"
        };
        Service.shopAuditPay('POST', JSON.stringify(params), (function callback(data) {

          if (data.code == 200) {
            _self.appId = data.data.appId;
            _self.nonceStr = data.data.nonceStr;
            _self.package = data.data.packageValue;
            _self.paySign = data.data.paySign;
            _self.signType = data.data.signType;
            _self.timeStamp = data.data.timeStamp;
            if (typeof WeixinJSBridge == "undefined") {
              if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady',
                  _self.onBridgeReady, false);
              } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady',
                  _self.onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady',
                  _self.onBridgeReady);
              }
            } else {
              _self.onBridgeReady();
            }
          }
        }))
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
          _self.getShopAuditDetail();
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            fn.showTip('支付成功');
            //支付成功后跳转的页面
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            fn.showTip('支付取消');
          } else if (res.err_msg == "get_brand_wcpay_request:fail") {
            fn.showTip('支付失败');
            WeixinJSBridge.call('closeWindow');
          } //使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok,但并不保证它绝对可靠。
        });
    },

    toSignContract() {
      window.location.href = 'shopContract.html?orderSn=' + this.shopInfo.orderSn + "&legalPersonTel=" + this.shopInfo.legalPersonTel
    },

  },
  created() {
    fn.routeQuery(tempJson)
  },
  mounted: function () {
    this.accountType = userInfo.accountType ? userInfo.accountType : 0;
    var _self = this;
    this.getShopAuditDetail();
    this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
    this.webHost = WebHost;

  }
})