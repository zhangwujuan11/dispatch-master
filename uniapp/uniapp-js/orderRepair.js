var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  orderInfo: {
    carNo: '',
    address: '',
    insuranceCompany: "",
    productName: "",
    changePart: "请选择破损部位",
    serviceType: "",
    orderAudits: [],
    oeNumber: null,
    carg: null,
    userName: "",
    mobile: "",
    productBrand: "请选择玻璃类型",
    surveyOrderSn: '',
    vin: '',
    userType: '',
    caseSn: ''
  },
  dateCode: "",
  orderAuditList: [],
  base64Codes: "",

  sigParts: [],
  serviceList: [
    {
      value: '',
      text: "请选择服务类型"
    },
    {
      value: 1,
      text: "拆装"
    },
    {
      value: 2,
      text: "更换"
    },
    {
      value: 3,
      text: "修复"
    },
    {
      value: 0,
      text: "其他"
    }
  ],
  claimList: [{
      value: 108,
      text: "太平洋财险"
    },
    {
      value: 107,
      text: "中国人寿财险"
    },
    {
      value: 110,
      text: "中国平安保险"
    },
    {
      value: 109,
      text: "中国人保财险"
    },
    {
      value: 105,
      text: "诚泰保险"
    },
    {
      value: 113,
      text: "国任保险"
    },
    {
      value: 104,
      text: "大地保险"
    },
    {
      value: 111,
      text: "永城保险"
    },
    {
      value: 112,
      text: "珠峰保险"
    }
  ],
  glassList:[
    {
      value: '',
      text: "请选择玻璃类型"
    },
    {
    value: 1,
    text: "进口玻璃"
  }, {
    value: 1,
    text: "福耀玻璃"
  }, {
    value: 1,
    text: "其他玻璃"
  }],
  safePicker: null,
  positionPicker: null,
  servicePicker: null,
  glassPicker: null,
}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {
    //获取今日码
    getDatecode() {
      var _self = this;
      Service.sigParts('GET', '', (function callback(data) {
        console.log(data)
        if (data.code == 200) {
          data.data.map((item) => {
            item.value = item.partsId
            item.text = item.partsName
          })
          data.data = [{value:'',text:'请选择破损部位'},...data.data]
          _self.sigParts = data.data
        }
      }))
      Service.insuranceSurveyList('GET', '', (function callback(data) {
        if (data.code == 200) {
          data.data.map((item) => {
            item.value = item.id
            item.text = item.name
          })
          data.data = [{value:'',text:'请选择保险公司'},...data.data]
          _self.claimList = data.data
        }
      }))
    },
    toUpperCase(e) {
      console.log('e：', e.toUpperCase())
      this.orderInfo.carNo = e.toUpperCase();
    },
    // 理赔审核
    getClaimChekItem() {
      var _self = this;
      Service.claimChekItem('GET', '', (function callback(data) {
        if (data.code == 200) {
          _self.orderAuditList = data.data

        }
      }))
    },
    authority(){
      if (navigator.userAgent.indexOf("Android") !== -1) { 
        $('.authority_mask').css('display','block');
      }
    },
    hideAuthorityMask(){
      $('.authority_mask').css('display','none');
    },
    //上传图片
    btnUploadFile(index) {
      $('.authority_mask').css('display','none');
      $('.upLoadImgs').eq(index).find(".noPass").hide();
      var _self = this;
      let evt = window.event || e;
      let el = evt.currentTarget || evt.srcElement;
      //获取图片文件
      var imgFile = el.files[0];

      //后缀选取
      // if (!/\/(?:jpeg|jpg|png|gif|JPG|PNG)/i.test(imgFile.type)) {
      //     console.log(图片格式不支持);
      //     return;
      // }
      //异步读取文件
      var reader = new FileReader();
      reader.onloadstart = function (e) {
        _self.orderInfo.orderAuditList[index].isShowMask = true;
        console.log("开始读取....");
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

        //alert(evt.target.result)
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
                $('.upLoadImgs').eq(index).find(".picFullcar").attr("src", data.data.webPath);
                _self.orderInfo.orderAuditList[index].isShowMask = false;
              }
            }))
          });
        } else {
          var params = {
            base64Data: evt.target.result,
            bizType: 101
          }
          Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
            //console.log("数据：", data)
            if (data.code == 200) {
              $('.upLoadImgs').eq(index).find(".picFullcar").attr("src", data.data.webPath);
              _self.orderInfo.orderAuditList[index].isShowMask = false;
            }
          }))
        }
        setTimeout(function () {
          _self.orderInfo.orderAuditList[index].isShowMask = true;
        }, 10000)
      }
      reader.readAsDataURL(imgFile);
    },
    //上传新版行驶证
    btnUploadDriveImg() {
      $('.authority_mask').css('display','none');
      var _self = this;
      let evt = window.event || e;
      let el = evt.currentTarget || evt.srcElement;
      //获取图片文件
      var imgFile = el.files[0];
      //异步读取文件
      var reader = new FileReader();
      reader.onloadstart = function (e) {
        _self.isShowMask = true;
        console.log("开始读取....");
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

        //alert(evt.target.result)
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
                _self.drivingPic = data.data.webPath;
                var params = {
                  base64Data: _self.drivingPic,
                  //base64Data: _self.drivingPic,
                  bizType: 2
                }
                Service.readDrivingLicense('POST', JSON.stringify(params), (function callback(data) {
                  if (data.code == 200 && data.data != {}) {
                    _self.orderInfo.userName = data.data.userName;
                    _self.orderInfo.carNo = data.data.carNo;
                    _self.orderInfo.vin = data.data.vin;
                    _self.orderInfo.address = data.data.address;
                    _self.orderInfo.fdjNo = data.data.fdjNo;
                    _self.orderInfo.bandType = data.data.brand;
                    let findIndex = _self.orderAuditList.findIndex(item => item.checkItemId == '48')
                    _self.orderAuditList[findIndex].checkItemImg = data.data.filePath
                  }
                }))
              }
            }))
          });
        } else {
          var params = {
            base64Data: evt.target.result,
            bizType: 101
          }
          Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
            //console.log("数据：", data)
            if (data.code == 200) {

              _self.drivingPic = data.data.webPath;
              var params = {
                base64Data: _self.drivingPic,
                //base64Data: _self.drivingPic,
                bizType: 2
              }
              Service.readDrivingLicense('POST', JSON.stringify(params), (function callback(data) {

                if (data.code == 200 && data.data != {}) {
                  _self.orderInfo.userName = data.data.userName;
                  _self.orderInfo.carNo = data.data.carNo;
                  _self.orderInfo.vin = data.data.vin;
                  _self.orderInfo.address = data.data.address;
                  _self.orderInfo.fdjNo = data.data.fdjNo;
                  _self.orderInfo.brand = data.data.brand
                  let findIndex = _self.orderAuditList.findIndex(item => item.checkItemId == '48')
                  _self.orderAuditList[findIndex].checkItemImg = data.data.filePath
                }
              }))
            }
          }))
        }

        setTimeout(function () {
          _self.isShowMask = false;
        }, 10000)
      }
      reader.readAsDataURL(imgFile);
    },
    // 玻璃品牌
    toGlass() {
      let _self = this
      if(_self.glassPicker){
        _self.glassPicker.dispose();
      }
      _self.glassPicker = new mui.PopPicker({
        layer: 1
      });
      _self.glassPicker.setData([{
        value: 1,
        text: "进口玻璃"
      }, {
        value: 1,
        text: "福耀玻璃"
      }, {
        value: 1,
        text: "其他玻璃"
      }]);
      _self.glassPicker.show(function (items) {
        $("#choose-glass").text(items[0].text);
        _self.orderInfo.productBrand = items[0].text;
      });
    },
    // 服务类型
    // toService() {
    //   let _self = this
    //   if(_self.servicePicker){
    //     _self.servicePicker.dispose();
    //   }
    //   _self.servicePicker = new mui.PopPicker({
    //     layer: 1
    //   });

    //   _self.servicePicker.setData(_self.serviceList);
    //   _self.servicePicker.show(function (items) {
    //     $("#choose-service").text(items[0].text);
    //     _self.orderInfo.serviceType = items[0].value;
    //   });
    // },
    // 保险公司
    // toSafe() {
    //   let _self = this
    //   if(_self.safePicker){
    //     _self.safePicker.dispose();
    //   }
    //   _self.safePicker = new mui.PopPicker({
    //     layer: 1
    //   });

    //   _self.safePicker.setData(_self.claimList);
    //   _self.safePicker.show(function (items) {
    //     $("#choose-safe").text(items[0].text);
    //     _self.orderInfo.userType = items[0].value;
    //   });
    // },
    // 维修或更换部位
    // toPosition() {
    //   let _self = this
    //   if(_self.positionPicker){
    //     _self.positionPicker.dispose();
    //   }
    //   _self.positionPicker = new mui.PopPicker({
    //     layer: 1
    //   });

    //   _self.positionPicker.setData(_self.sigParts);
    //   _self.positionPicker.show(function (items) {
    //     $("#choose-position").text(items[0].text);
    //     _self.orderInfo.changePart = items[0].text;
    //   });
    // },

    //判断信息
    chackPicInfo() {
      let _self = this
      if (!_self.orderInfo.caseSn) {
        fn.showTip("请输入报案号");
        return false;
      }
      if (!_self.orderInfo.userType) {
        fn.showTip("请选择保险公司");
        return false;
      }
      if (!_self.orderInfo.carNo) {
        fn.showTip("请输入车牌号");
        return false;
      }
      if (!_self.orderInfo.userName) {
        fn.showTip("请输入姓名");
        return false;
      }
      if (!_self.orderInfo.vin) {
        fn.showTip("请输入VIN码");
        return false;
      }
      if (_self.orderInfo.changePart=='请选择破损部位') {
        fn.showTip("请选择破损部位");
        return false;
      }

      if (_self.orderInfo.oeNumber == '' && _self.orderInfo.carg == '') {
        fn.showTip("OE码或者CARG码必须填写一位");
        return false;
      }
      // if (_self.orderInfo.oeNumber.length <= 5 || _self.orderInfo.carg.length <= 5) {
      //   fn.showTip("请输入正确的OE码或者CARG码");
      //   return false;
      // }

      if (!_self.orderInfo.mobile) {
        fn.showTip("请输入联系方式");
        return false;
      }
      if (!fn.testRule.isTel(_self.orderInfo.mobile)) {
        fn.showTip("请正确输入手机号");
        return false;
      }
      if (_self.orderInfo.serviceType=='') {
        fn.showTip("请选择服务类型");
        return false;
      }

      if (_self.orderInfo.productBrand == '请选择玻璃类型') {
        fn.showTip("请选择玻璃类型");
        return false;
      }

      for (var i = 0; i < $('.upLoadImgs').length; i++) {
        if ($('.upLoadImgs').eq(i).find(".picFullcar").attr('src') == "images/upload.jpg") {
          fn.showTip("查勘定损照片必填");
          return false;
        }
      }
      return true;
    },
    //提交审核
    subAdd() {
      if (!this.chackPicInfo()) {
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
        carNo: this.orderInfo.carNo,
        carg: this.orderInfo.carg,
        caseSn: this.orderInfo.caseSn,
        changePart: this.orderInfo.changePart == '请选择破损部位' ? '':this.orderInfo.changePart,
        mobile: this.orderInfo.mobile,
        oeNumber: this.orderInfo.oeNumber,
        orderAudits: orderAudits,
        productBrand: this.orderInfo.productBrand == '请选择玻璃类型' ? '':this.orderInfo.productBrand,
        serviceType: this.orderInfo.serviceType,
        surveyOrderSn: this.orderInfo.surveyOrderSn,
        address: this.orderInfo.address,
        userName: this.orderInfo.userName,
        userType: this.orderInfo.userType,
        vin: this.orderInfo.vin
      }

      console.log("参数请求=====：", params)

      Service.surveyAdd('POST', JSON.stringify(params), (function callback(data) {
        //console.log("数据：", data)
        if (data.code == 200) {
          fn.showTip("提交成功", "surveyList.html?searchType=2");
        }
      }))
    }
  },
  mounted: function () {
    var _self = this;
    this.getDatecode();
    this.getClaimChekItem()
    $('.cropperModal').height(document.body.clientHeight + 'px')
    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)
  }
})