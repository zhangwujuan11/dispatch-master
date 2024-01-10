var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  dateCode: "",
  openId: "",
  smsTimer: 0, // 短信验证码计时器
  smsCount: 60, // 短信验证码间隔，60秒执
  curSmsCount: 0, // 短信验证码当前剩余秒数
  smsFlag: true,
  imgShopOne: {
    imgPath: '',
    name: '休息区',
    shopId: ''
  },
  imgShopTwo: {
    imgPath: '',
    name: '门头',
    shopId: ''
  },
  imgShopThree: {
    imgPath: '',
    name: '前台区',
    shopId: ''
  },
  imgShopFour: {
    imgPath: '',
    name: '施工区',
    shopId: ''
  },
  imgShopFive: {
    imgPath: '',
    name: '团队',
    shopId: ''
  },
  agreeFlag: false,
  webHost: "",
  shopInfo: {
    "address": "", //地址
    "azgwNum": "", //安装工位(个) 
    "azjsNum": "", // 安装技师（个） ,
    "chargeMobile": "", //负责人电话
    "verifyCode": "", //验证码
    "chargeName": "", //负责人姓名 ,
    "chargeWx": "", //负责人微信
    "provinceId": "", //: 省 ,
    "cityId": "", //: 市 ,
    "zoneId": "", //: 区 ,
    "hwazgjcNum": "", // 户外安装工具车（辆） ,
    "legalPerson": "", //法人代表
    "linktel": "", //联系电话
    "name": "", //门店电话
    "openb": "", //营业开始时间 ,
    "opene": "", //营业结束时间
    "shopImgList": [],
    "province": "",
    "city": "",
    "zone": "",
    "nsrsbh": "", //统一社会信用代码 ,
    "saleArea": "", //销售区域
    "shopNum": "", //门店数量
    "shopArea": "", //门店面积 
    "stores": "", //库存情况（万元） ,
    "warehousesArea": "", //仓库面积 ,
    "warehousesNum": "" // 仓库数量 ,

  }
}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {

    //上传图片
    upImg(e) {
      var _self = this;
      console.log("图片信息：", e)

      //正式用
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sizeType: ['original'],
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
              //alert(localData.split(",")[0])
              var base64 = "data:image/jgp;base64 || data:image/jgep;base64 || data:image/png;base64 || data:image/gif;base64";
              //alert(localData.split(",")[0])
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
              //Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
              $.ajax({
                url: HOST + "order/upload",
                type: "POST",
                data: JSON.stringify(params),
                contentType: "application/json;charset-UTF-8",
                dataType: "json"
              }).done(function (data) {
                //console.log("数据：", data)
                if (data.code == 200) {
                  if (e.name == "休息区") {
                    _self.imgShopOne.imgPath = data.data.webPath;
                  } else if (e.name == "门头") {
                    _self.imgShopTwo.imgPath = data.data.webPath;
                  } else if (e.name == "前台区") {
                    _self.imgShopThree.imgPath = data.data.webPath;
                  } else if (e.name == "施工区") {
                    _self.imgShopFour.imgPath = data.data.webPath;
                  } else if (e.name == "团队") {
                    _self.imgShopFive.imgPath = data.data.webPath;
                  } else if (e.name == "营业执照") {
                    _self.imgShopFive.imgPath = data.data.webPath;
                  }
                }
              })
            }
          });
        }
      });

    },

    // 设置短信验证码按钮状态
    setSmsCodeBtn() {
      $('.sendCode').html(this.curSmsCount + "s");
      this.smsTimer = window.setInterval(vm.smsCountdown, 1000); //启动计时器，1秒执行一次
      $('.sendCode').addClass('gray_bg');
    },
    // 短信验证码倒计时
    smsCountdown() {
      // curSmsCount = smsCount;
      this.curSmsCount--;
      if (this.curSmsCount == 0) {
        this.smsFlag = true;
        window.clearInterval(this.smsTimer); // 停止计时器
        $('.sendCode').removeAttr("disabled").html("重新获取").removeClass('gray_bg');
      } else {
        $('.sendCode').html(this.curSmsCount + "s");
      }
    },
    //发送验证码
    sendCode() {
      var _self = this;
      if (this.shopInfo.chargeMobile && fn.testRule.isTel(this.shopInfo.chargeMobile)) {
        var getCodeUrl = HOST + 'member/getAuthCode';
        if (this.smsFlag) {
          this.smsFlag = false;
          this.curSmsCount = this.smsCount;
          var params = {
            "telephone": this.shopInfo.chargeMobile
          }
          $.ajax({
            url: getCodeUrl,
            type: "GET",
            data: params,
            // contentType: "application/json;charset-UTF-8",
            dataType: "json"
          }).done(function (data) {
            console.log("数据：", data)
            if (data.code == 200) {
              _self.setSmsCodeBtn();
              fn.showTip(data.message);

            } else {
              fn.showTip(data.message);
            }
          })
        }
      } else {
        // this.errMsg = "请正确填写手机号"
        fn.showTip("请正确填写负责人电话");
      }
    },

    //是否同意
    cngAgree() {
      this.agreeFlag = !this.agreeFlag;
    },


    //判断信息
    chackInfo() {
      if (!this.shopInfo.name) {
        fn.showTip("门店名称不能为空");
        return false;
      }
      if (!this.shopInfo.linktel) {
        fn.showTip("联系电话不能为空");
        return false;
      }

      if (!this.shopInfo.nsrsbh) {
        fn.showTip("统一社会信用代码不能为空");
        return false;
      }
      if (!this.shopInfo.saleArea) {
        fn.showTip("销售区域不能为空");
        return false;
      }
      if (!this.shopInfo.legalPerson) {
        fn.showTip("法人代表不能为空");
        return false;
      }
      if (!this.shopInfo.chargeName) {
        fn.showTip("负责人姓名不能为空");
        return false;
      }
      if (!this.shopInfo.chargeMobile) {
        fn.showTip("负责人联系电话不能为空");
        return false;
      }
      if (!fn.testRule.isTel(this.shopInfo.chargeMobile)) {
        fn.showTip("请正确输入负责人联系电话");
        return false;
      }
      if (!this.shopInfo.verifyCode) {
        fn.showTip("短信验证码不能为空");
        return false;
      }

      if (!this.shopInfo.chargeWx) {
        fn.showTip("负责人微信");
        return false;
      }
      if (!this.shopInfo.zoneId) {
        fn.showTip("省市区不能为空");
        return false;
      }
      if (!this.shopInfo.address) {
        fn.showTip("详细地址不能为空");
        return false;
      }
      if (!this.shopInfo.shopNum) {
        fn.showTip("门店数量不能为空");
        return false;
      }
      if (!this.shopInfo.warehousesArea) {
        fn.showTip("门店面积不能为空");
        return false;
      }
      if (!this.shopInfo.azgwNum) {
        fn.showTip("安装工位不能为空");
        return false;
      }
      if (!this.shopInfo.azjsNum) {
        fn.showTip("安装技师不能为空");
        return false;
      }

      if (!this.agreeFlag) {
        fn.showTip("您还未阅读并同意此协议");
        return false;
      }

      // for(var i=0; i<$('.upLoadImgs').length; i++){
      //     if ($('.upLoadImgs').eq(i).find(".picFullcar").attr('src')=="images/upload.jpg") {
      //         fn.showTip("破损照片必填");
      //         return false;
      //     }

      // }
      return true;
    },

    //门店更新
    editShop() {
      if (!this.chackInfo()) {
        return false;
      }
      var shopImgList = [];
      if (this.imgShopOne.imgPath) {
        shopImgList.push(this.imgShopOne)
      }
      if (this.imgShopTwo.imgPath) {
        shopImgList.push(this.imgShopTwo)
      }
      if (this.imgShopThree.imgPath) {
        shopImgList.push(this.imgShopThree)
      }
      if (this.imgShopFour.imgPath) {
        shopImgList.push(this.imgShopFour)
      }
      if (this.imgShopFive.imgPath) {
        shopImgList.push(this.imgShopFive)
      }
      var params = {
        "openId": this.openId,
        "address": this.shopInfo.address,
        "azgwNum": this.shopInfo.azgwNum,
        "azjsNum": this.shopInfo.azjsNum,
        "chargeMobile": this.shopInfo.chargeMobile,
        "chargeName": this.shopInfo.chargeName,
        "chargeWx": this.shopInfo.chargeWx,
        "hwazgjcNum": this.shopInfo.hwazgjcNum,
        "legalPerson": this.shopInfo.legalPerson,
        "linktel": this.shopInfo.linktel,
        "name": this.shopInfo.name,
        "nsrsbh": this.shopInfo.nsrsbh,
        "openb": this.shopInfo.openb,
        "opene": this.shopInfo.opene,
        "shopNum": this.shopInfo.shopNum,
        //"redirectUrl": this.shopInfo.redirectUrl,
        "saleArea": this.shopInfo.saleArea,
        "shopArea": this.shopInfo.shopArea,
        "shopImgList": shopImgList,
        "stores": this.shopInfo.stores,
        "verifyCode": this.shopInfo.verifyCode,
        "warehousesArea": this.shopInfo.warehousesArea,
        "warehousesNum": this.shopInfo.warehousesNum,
        "zoneId": this.shopInfo.zoneId
      }

      console.log('参数：', params)
      $.ajax({
          url: HOST + "member/register",
          type: "POST",
          data: JSON.stringify(params),
          contentType: "application/json;charset-UTF-8",
          dataType: "json"
        })
        .done(function (data) {
          console.log(data)
          if (data.code == 200) {
            fn.showTip("感谢您注册易道大咖，请耐心等待审核！");
          } else {
            fn.showTip(data.message);
          }
        })
    }

  },

  computed: {
    showSendBtn() {
      if (this.shopInfo.chargeMobile && fn.testRule.isTel(this.shopInfo.chargeMobile)) {
        return 1;
      } else {
        return 0;
      }
    }
  },
  mounted: function () {
    var _self = this;
    //this.getShopDetail();
    this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
    this.webHost = WebHost;
    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      //省市选择
      var cityPicker = new mui.PopPicker({
        layer: 3
      });
      cityPicker.setData(cityData3);

      $("#choose-city").on("tap", function () {
        cityPicker.show(function (items) {
          _self.shopInfo.zoneId = items[2].value;
          _self.shopInfo.province = items[0].text;
          _self.shopInfo.city = items[1].text;
          _self.shopInfo.zone = items[2].text;

        });
      });

      //时间选择
      var subinvman_sel = $("#openb")[0];
      if (subinvman_sel) {
        document.querySelector("#openb").addEventListener("tap", function () {
          var dtpicker = new mui.DtPicker({
            "type": "time"
          });
          // dtpicker.setSelectedValue("08:12");  
          dtpicker.show(function (items) {
            console.log(items.text)
            //$("#openb")[0].innerHTML = items.text;
            _self.shopInfo.openb = items.text;
            dtpicker.dispose();
          });
        });
      };

      var subinvman_sel = $("#opene")[0];
      if (subinvman_sel) {
        document.querySelector("#opene").addEventListener("tap", function () {
          var dtpicker = new mui.DtPicker({
            "type": "time"
          });
          dtpicker.show(function (items) {
            console.log(items.text)
            //$("#opene")[0].innerHTML = items.text;
            _self.shopInfo.opene = items.text;
            dtpicker.dispose();
          });
        });
      };

      document.getElementById("appContent").style.display = "block";
    }, 100)
  }

})